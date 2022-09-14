import { Interface, parseEther } from "ethers/lib/utils";
import { useContext, useMemo } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import useWrapTxInToasts from "shared/useTransactionToast";

const wPowEthInterface = new Interface([
    "function mint(uint256 depositId, address recipient, uint256 amount, uint256 depositBlockNumber, bytes memory storageProof)",
    "function updateDepositContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
  ]),
  wPowEthAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS;

export default function useMint(
  poWEthAmount,
  { powDepositId, powDepositInclusionBlock, accountProof, storageProof }
) {
  const { provider } = useContext(ChainsContext);
  const { account } = useEthers();

  const wPowEthContract = useMemo(
    () => new Contract(wPowEthAddress, wPowEthInterface, provider),
    [provider]
  );

  //? Mint wPoWETH
  const {
      state: mintTxState,
      send: sendMintTx,
      resetState: resetMintTxState,
    } = useContractFunction(wPowEthContract, "multicall", {
      transactionName: "mint",
    }),
    onMintComplete = async () => {
      const { transaction: tx, receipt, status } = mintTxState;

      console.log("do something when tx is done");

      // cleanup
      resetMintTxState();
    };

  useWrapTxInToasts(mintTxState, onMintComplete);

  const handleMint = async () => {
    const inclusionBlockStateRoot = ""; // TODO retrieve state root
    const signedStateRoot = ""; // await axios.post("apiurl", {});

    const multicallArgs = [
      wPowEthContract.interface.encodeFunctionData("relayStateRoot", [
        powDepositInclusionBlock,
        inclusionBlockStateRoot,
        signedStateRoot,
      ]),
      wPowEthContract.interface.encodeFunctionData(
        "updateDepositContractStorageRoot",
        [powDepositInclusionBlock, accountProof]
      ),
      wPowEthContract.interface.encodeFunctionData("mint", [
        powDepositId,
        account,
        parseEther(poWEthAmount),
        powDepositInclusionBlock,
        storageProof,
      ]),
    ];

    const tx = await sendMintTx(...multicallArgs);
  };

  return { handleMint };
}
