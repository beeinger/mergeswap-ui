import {
  Interface,
  defaultAbiCoder,
  formatEther,
  formatUnits,
  hexZeroPad,
  keccak256,
  parseEther,
} from "ethers/lib/utils";
import { useContext, useMemo, useRef, useState } from "react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import { encodeProof } from "shared/utils/encode-proof";
import { toast } from "react-toastify";
import useWrapTxInToasts from "shared/useTransactionToast";

const depositPowInterface = new Interface([
    "function deposit(uint256 amount, address recipient) payable",
    "event Deposit(uint256 id, uint256 amount, address depositor, address recipient)",
  ]),
  depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS;

export default function useDeposit(
  [poWEthAmount, setPoWEthAmount],
  setIsLoading
) {
  const { provider, handleSwitchToPoS } = useContext(ChainsContext);
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const toastId = useRef(null);

  const [powDepositId, setPowDepositId] = useState<number>(undefined),
    [powDepositInclusionBlock, setPowDepositInclusionBlock] =
      useState<number>(undefined),
    [accountProof, setAccountProof] = useState<string>(""),
    [storageProof, setStorageProof] = useState<string>("");

  const depositPowContract = useMemo(
    () => new Contract(depositPowAddress, depositPowInterface, provider),
    [provider]
  );

  const {
      state: depositState,
      send: sendDeposit,
      resetState: resetDepositState,
    } = useContractFunction(depositPowContract, "deposit", {
      transactionName: "Deposit POWETH",
    }),
    onDepositComplete = async () => {
      const { transaction: tx, receipt, status } = depositState;

      console.log("complete", status);

      if (status === "Success") {
        toastId.current = toast.dark(
          <>
            Deposited ETH PoW successfully!
            <br />
            Awaiting {process.env.NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS}{" "}
            blocks confirmations...
          </>,
          {
            autoClose: false,
            closeButton: false,
            closeOnClick: false,
            draggable: false,
            isLoading: true,
          }
        );
        await tx.wait(
          Number(process.env.NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS)
        );

        const { args } = depositPowContract.interface.parseLog(receipt.logs[0]);

        const paddedSlot = hexZeroPad("0x" + powDepositId.toString(16), 32),
          paddedKey = hexZeroPad(args[0].toHexString(), 32),
          itemSlot = keccak256(paddedKey + paddedSlot.slice(2));

        const proof = await provider.send("eth_getProof", [
            process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
            [itemSlot],
            "0x" + powDepositInclusionBlock.toString(16),
          ]),
          rpcAccountProof = proof.accountProof,
          rpcStorageProof = proof.storageProof[0].proof;

        setAccountProof(encodeProof(rpcAccountProof));
        setStorageProof(encodeProof(rpcStorageProof));

        toast.update(toastId.current, {
          render: (
            <>
              Ok, all done!
              <br />
              Now switch to PoS and mint!
            </>
          ),
          isLoading: false,
          autoClose: 60000,
          closeButton: true,
          closeOnClick: true,
          draggable: true,
        });
        handleSwitchToPoS();
      }
      // cleanup
      resetDepositState();
    };

  useWrapTxInToasts(depositState, onDepositComplete);

  const handleDeposit = async () => {
    if (!poWEthAmount) return;
    setIsLoading(true);
    const receipt = await sendDeposit(parseEther(poWEthAmount), account, {
      value: parseEther(poWEthAmount),
    });
    if (receipt) {
      const [depositId, , ,] = defaultAbiCoder.decode(
        ["uint256", "uint256", "address", "address"],
        receipt.logs[0].data
      );
      setPowDepositId(depositId.toNumber());
      setPowDepositInclusionBlock(receipt.blockNumber);
      setPoWEthAmount("");
    }
    setIsLoading(false);
  };

  const setMax = async () => {
    setIsLoading(true);
    const amount = etherBalance;
    const gasUnitsEstimate = await depositPowContract.estimateGas.deposit(
      amount,
      account,
      {
        value: amount,
      }
    );
    const gasPrice = await provider.getGasPrice();
    //? We multiply by 4 to absorb gasPrice volatility + future withdraw call.
    const costInWei = formatUnits(gasUnitsEstimate.mul(gasPrice).mul(4), "wei");
    const maxAmount = amount.sub(costInWei);
    setPoWEthAmount(formatEther(maxAmount.gte(0) ? maxAmount : 0));
    setIsLoading(false);
  };

  return {
    depositState,
    handleDeposit,
    setMax,
    powDepositId,
    powDepositInclusionBlock,
    accountProof,
    storageProof,
  };
}
