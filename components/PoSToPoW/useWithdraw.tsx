import {
  Interface,
  defaultAbiCoder,
  formatEther,
  parseEther,
} from "ethers/lib/utils";
import { useContext, useMemo, useRef } from "react";
import { useContractFunction, useEthers, useTokenBalance } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "ethers";
import { PoS } from "shared/chains/custom";
import { toast } from "react-toastify";
import useWrapTxInToasts from "shared/useTransactionToast";

const wPowEthInterface = new Interface([
  "function withdraw(uint256 amount, address recipient)",
  "event Withdrawal(uint256 id, uint256 amount, address withdrawMadeBy, address recipient)",
]);

const wPowEthIAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS;

export default function useWithdraw(
  [wPowEthAmount, setPoWEthTokensAmount],
  setIsLoading,
  setData,
  isThereUnclaimedWithdrawal
) {
  const toastId = useRef(null);
  const { account } = useEthers();
  const { handleSwitchToPoW } = useContext(ChainsContext);
  const wPowEthBalance = useTokenBalance(
    process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS!,
    account
  );

  const wPowEthContract = useMemo(
    () => new Contract(wPowEthIAddress, wPowEthInterface, PoS.provider),
    []
  );

  const {
      state: withdrawalState,
      send: sendWithdrawal,
      resetState: resetWithdrawalState,
    } = useContractFunction(wPowEthContract, "withdraw", {
      transactionName: "Withdraw POWETH",
    }),
    onDepositComplete = async () => {
      const { transaction: tx, receipt, status } = withdrawalState;

      // TODO: save receipt.
      if (status === "Success") {
        toastId.current = toast.dark(
          <>
            Withdrawn ETH PoW successfully!
            <br />
            Awaiting {
              process.env.NEXT_PUBLIC_WITHDRAWAL_BLOCKS_CONFIRMATIONS
            }{" "}
            blocks confirmations...
            <br />
            After that, please withdraw quickly, PoW has some syncing
            problems...
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
          Number(process.env.NEXT_PUBLIC_WITHDRAWAL_BLOCKS_CONFIRMATIONS)
        );

        toast.dismiss(toastId.current);
        toast.dark(
          <>
            Ok, all done!
            <br />
            Now switch to PoW and withdraw!
          </>,
          { type: "success", autoClose: 20000 }
        );
        handleSwitchToPoW();
      }
      // cleanup
      resetWithdrawalState();
    };

  useWrapTxInToasts(withdrawalState, onDepositComplete);

  const handleWithdrawal = async () => {
    if (isThereUnclaimedWithdrawal())
      return toast.dark(
        "You have unclaimed withdrawal, please redeem it on PoW first",
        {
          type: "warning",
        }
      );
    if (!wPowEthAmount)
      return toast.dark(
        "You need to withdraw something... 0.0 doesn't cut it",
        {
          type: "info",
        }
      );

    setIsLoading(true);
    const receipt = await sendWithdrawal(parseEther(wPowEthAmount), account);
    if (receipt) {
      const [withdrawalId, amount] = defaultAbiCoder.decode(
        ["uint256", "uint256", "address", "address"],
        receipt.logs?.[1]?.data
      );

      const withdrawalData = {
        posWithdrawalId: withdrawalId?.toNumber(),
        posWithdrawalAmount: amount?.toString(),
        posWithdrawalInclusionBlock: receipt.blockNumber?.toString(),
      };
      setData(withdrawalData);

      setPoWEthTokensAmount("");
    }
    setIsLoading(false);
  };

  const setMax = () =>
    setPoWEthTokensAmount(
      formatEther(wPowEthBalance.gte(0) ? wPowEthBalance : 0)
    );

  return {
    handleWithdrawal,
    withdrawalState,
    setMax,
    wPowEthBalance,
  };
}
