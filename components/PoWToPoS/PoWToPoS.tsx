import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import {
  Interface,
  formatEther,
  formatUnits,
  hexZeroPad,
  keccak256,
  parseEther,
  defaultAbiCoder,
} from "ethers/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import {
  useContractFunction,
  useEtherBalance,
  useEthers,
  useSendTransaction,
} from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import { PoW } from "shared/chains/custom";
import { encodeProof } from "shared/utils/encode-proof";
import useWrapTxInToasts from "shared/useTransactionToast";

export default function PoWToPoS() {
  const { isPoW, provider } = useContext(ChainsContext);
  const { account } = useEthers();
  const [poWEthAmount, setPoWEthAmount] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [powDepositId, setPowDepositId] = useState<number | undefined>(
    undefined
  );
  const [powDepositInclusionBlock, setPowDepositInclusionBlock] = useState<
    number | undefined
  >(undefined);
  const [accountProof, setAccountProof] = useState<string>("");
  const [storageProof, setStorageProof] = useState<string>("");

  const depositPowInterface = new Interface([
      "function deposit(uint256 amount, address recipient) payable",
      "event Deposit(uint256 id, uint256 amount, address depositor, address recipient)",
    ]),
    depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
    depositPowContract = new Contract(
      depositPowAddress,
      depositPowInterface,
      provider
    );

  const wPowEthInterface = new Interface([
      "function mint(uint256 depositId, address recipient, uint256 amount, uint256 depositBlockNumber, bytes memory storageProof)",
      "function updateDepositContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
    ]),
    wPowEthAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
    wPowEthContract = new Contract(wPowEthAddress, wPowEthInterface, provider);

  const { state, send, resetState } = useContractFunction(
    depositPowContract,
    "deposit",
    {
      transactionName: "Deposit POWETH",
    }
  );

  const {
    state: mintTxState,
    send: sendMintTx,
    resetState: resetMintTxState,
  } = useContractFunction(wPowEthContract, "multicall", {
    transactionName: "mint",
  });
  const etherBalance = useEtherBalance(account);

  useWrapTxInToasts(state, () => {
    console.log("do something when tx is done");
    resetState();
  });

  useWrapTxInToasts(mintTxState, () => {
    console.log("do something when tx is done");
    resetMintTxState();
  });

  const handleDeposit = async () => {
    if (!account) throw new Error("no recipient specified");
    setIsLoading(true);
    const receipt = await send(parseEther(poWEthAmount), account, {
      value: parseEther(poWEthAmount),
    });
    const [depositId, , ,] = defaultAbiCoder.decode(
      ["uint256", "uint256", "address", "address"],
      receipt.logs[0].data
    );
    setPowDepositId(depositId.toNumber());
    setPowDepositInclusionBlock(receipt.blockNumber);
    setPoWEthAmount("");
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
    console.log(gasUnitsEstimate);
    const gasPrice = await provider.getGasPrice();
    // We multiply by 4 to absorb gasPrice volatility + future withdraw call.
    const costInWei = formatUnits(gasUnitsEstimate.mul(gasPrice).mul(4), "wei");
    const maxAmount = amount.sub(costInWei);
    setPoWEthAmount(formatEther(maxAmount.gte(0) ? maxAmount : 0));
    setIsLoading(false);
  };

  // TODO this code should execute only 10 confirmations after deposit
  useEffect(() => {
    const genDepositProof = async (
      tx: TransactionResponse,
      receipt: TransactionReceipt
    ) => {
      await tx.wait(
        Number(process.env.NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS)
      );
      console.log(receipt);

      const { args } = depositPowContract.interface.parseLog(receipt.logs[0]);

      console.log("key", args[0].toHexString());
      const paddedSlot = hexZeroPad("0x" + powDepositId.toString(16), 32);
      const paddedKey = hexZeroPad(args[0].toHexString(), 32);
      const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));

      const proof = await provider.send("eth_getProof", [
        process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
        [itemSlot],
        "0x" + powDepositInclusionBlock.toString(16),
      ]);
      const rpcAccountProof = proof.accountProof;
      const rpcStorageProof = proof.storageProof[0].proof;

      setAccountProof(encodeProof(rpcAccountProof));
      setStorageProof(encodeProof(rpcStorageProof));
    };

    if (state.status === "Success") {
      genDepositProof(state.transaction, state.receipt);
    }
  }, [state, provider, depositPowContract.interface]);

  const { sendTransaction } = useSendTransaction();

  const handleMint = async () => {
    const inclusionBlockStateRoot = ""; // TODO retrieve state root
    const signedStateRoot = ""; // await httpClient.post("apiurl", {});

    const multicallArgs = [
      depositPowContract.interface.encodeFunctionData("relayStateRoot", [
        powDepositInclusionBlock,
        inclusionBlockStateRoot,
        signedStateRoot,
      ]),
      depositPowContract.interface.encodeFunctionData(
        "updateDepositContractStorageRoot",
        [powDepositInclusionBlock, accountProof]
      ),
      depositPowContract.interface.encodeFunctionData("mint", [
        powDepositId,
        account,
        parseEther(poWEthAmount),
        powDepositInclusionBlock,
        storageProof,
      ]),
    ];

    const tx = await sendMintTx();
  };

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) =>
          /^[0-9]*\.?[0-9]*$/.test(e.target.value) &&
          setPoWEthAmount(e.target.value)
        }
        value={poWEthAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {formatEther(etherBalance || "0").slice(0, 7)}
        <MaxButton
          onClick={setMax}
          disabled={etherBalance === undefined || isLoading}
        >
          max
        </MaxButton>
      </Balance>
      <ConfirmTransaction
        disabled={!account || state.status !== "None" || isLoading}
        onClick={handleDeposit}
      >
        deposit
      </ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has sent ETH PoW to PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) =>
          /^[0-9]*\.?[0-9]*$/.test(e.target.value) &&
          setPoWEthAmount(e.target.value)
        }
        value={poWEthAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {"todo"}
        <MaxButton>max</MaxButton>
      </Balance>
      <ConfirmTransaction onClick={handleMint}>mint</ConfirmTransaction>
    </InteractionContainer>
  );
}
