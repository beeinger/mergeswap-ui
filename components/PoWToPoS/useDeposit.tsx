import {
  Interface,
  defaultAbiCoder,
  formatEther,
  formatUnits,
  parseEther,
} from "ethers/lib/utils";
import { useContext, useMemo, useRef } from "react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import { PoW } from "shared/chains/custom";
import { toast } from "react-toastify";
import useWrapTxInToasts from "shared/useTransactionToast";

const depositPowInterface = new Interface([
    "function deposit(uint256 amount, address recipient) payable",
    "event Deposit(uint256 id, uint256 amount, address depositor, address recipient)",
  ]),
  depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS;

export default function useDeposit(
  [poWEthAmount, setPoWEthAmount],
  setIsLoading,
  setData,
  isThereUnclaimedDeposit
) {
  const { handleSwitchToPoS } = useContext(ChainsContext);
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const toastId = useRef(null);

  const depositPowContract = useMemo(
    () => new Contract(depositPowAddress, depositPowInterface, PoW.provider),
    []
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

        toast.dismiss(toastId.current);
        toast.dark(
          <>
            Ok, all done!
            <br />
            Now switch to PoS and mint!
          </>,
          { type: "success", autoClose: 20000 }
        );
        handleSwitchToPoS();
      }
      // cleanup
      resetDepositState();
    };

  useWrapTxInToasts(depositState, onDepositComplete);

  const handleDeposit = async () => {
    if (isThereUnclaimedDeposit())
      return toast.dark(
        "You have unclaimed deposit, please mint it on PoS first",
        {
          type: "warning",
        }
      );
    if (!poWEthAmount)
      return toast.dark("You need to deposit something... 0.0 doesn't cut it", {
        type: "info",
      });

    setIsLoading(true);
    const receipt = await sendDeposit(parseEther(poWEthAmount), account, {
      value: parseEther(poWEthAmount),
    });
    if (receipt) {
      const [depositId, , ,] = defaultAbiCoder.decode(
        ["uint256", "uint256", "address", "address"],
        receipt.logs[0].data
      );

      const depositData = {
        powDepositId: depositId.toNumber(),
        powDepositAmount: poWEthAmount,
        powDepositInclusionBlock: receipt.blockNumber.toString(),
      };
      setData(depositData);

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
    const gasPrice = await PoW.provider.getGasPrice();
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
  };
}
