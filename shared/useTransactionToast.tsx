import React, { useEffect, useMemo } from "react";

import { TransactionStatus } from "@usedapp/core";
import { toast } from "react-toastify";

export default function useWrapTxInToasts(
  state: TransactionStatus,
  callback: () => void
) {
  const toastId = React.useRef(null);
  const progress = useMemo(() => {
    switch (state.status) {
      case "None":
        return -1;
      case "PendingSignature":
        return 1;
      case "Mining":
        return 2;
      case "Success":
      case "Fail":
      case "Exception":
      default:
        return 3;
    }
  }, [state]);

  useEffect(() => {
    if (progress === -1) return;
    // Handle transaction done
    if (progress === 3) {
      toastId.current = toast.dismiss(toastId.current);

      if (state.status === "Success")
        toast.dark("Transaction successful!", {
          type: "success",
        });
      else
        toast.dark(
          <>
            <span>Transaction failed!</span>
            <br />
            <span style={{ opacity: 0.35, fontSize: "0.75 rem" }}>
              {state.errorMessage}
            </span>
          </>,
          {
            type: "error",
          }
        );

      return callback();
    }
    // Handle transaction progress
    const render = (
        <>
          <span>Transaction in progress...</span>
          <br />
          <span style={{ opacity: 0.35, fontSize: "0.75 rem" }}>
            {state.status}
          </span>
        </>
      ),
      config = {
        progress: progress / 3,
      };

    if (!toastId.current) toastId.current = toast.dark(render, config);
    else toast.update(toastId.current, { ...config, render });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, state.status]);
}
