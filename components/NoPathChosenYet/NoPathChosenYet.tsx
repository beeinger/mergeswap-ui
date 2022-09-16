import { ColumnContainer, SmallText, StyledNoPathChosenYet } from "./styles";
import React, { useContext, useEffect, useRef, useState } from "react";

import { ChainsContext } from "shared/useChains";
import { Path } from "shared/types";
import { PathContext } from "shared/usePath";
import Tooltip from "components/Tooltip";
import { toast } from "react-toastify";

const WPoWETHExplanation = "wrapped ERC-20 token representing PoW ETH on PoS";

export default function NoPathChosenYet() {
  const { handleSwitchToPoS, handleSwitchToPoW, isPoS, isPoW } =
    useContext(ChainsContext);
  const { setPath, disabled } = useContext(PathContext);
  const [pathSelectionInProgress, setPathSelectionInProgress] =
    useState<Path>(null);
  const toastId = useRef(null);

  const handleClick = (path: Path) => () => {
    // TODO: remove this check when PoS->PoW is available
    if (path === "PoS->PoW") return setPath(path);

    if (
      disabled ||
      (path === "PoW->PoS" && !isPoW) ||
      // @ts-ignore
      (path === "PoS->PoW" && !isPoS)
    ) {
      setPathSelectionInProgress(path);
      if (path === "PoW->PoS") {
        toastId.current = toast.dark(
          "Please connect the wallet and/or switch the network to PoW",
          {
            autoClose: false,
            closeButton: false,
            closeOnClick: false,
            draggable: false,
            isLoading: true,
          }
        );
        handleSwitchToPoW();
      } else if (path === "PoS->PoW") {
        toast.dark(
          "Please connect the wallet and/or switch the network to PoS",
          {
            autoClose: false,
            closeButton: false,
            closeOnClick: false,
            draggable: false,
            isLoading: true,
          }
        );
        handleSwitchToPoS();
      }
    } else setPath(path);
  };

  useEffect(() => {
    if (
      pathSelectionInProgress &&
      !disabled &&
      ((pathSelectionInProgress === "PoW->PoS" && isPoW) ||
        (pathSelectionInProgress === "PoS->PoW" && isPoS))
    ) {
      setPath(pathSelectionInProgress);
      toast.dismiss(toastId.current);
      toast.dark("All set!", { type: "success", autoClose: 10000 });
      setPathSelectionInProgress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, pathSelectionInProgress, isPoS, isPoW]);

  const [isFocused, setIsFocused] = useState(false),
    handleFocus = () => setIsFocused(true),
    handleBlur = () => setIsFocused(false);

  return (
    <StyledNoPathChosenYet
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <h2>Choose the path you wish to follow</h2>
      <span>
        <b>Note:</b> Do these steps briskly, PoW has some syncing issues...
      </span>
      <ColumnContainer>
        <div onClick={handleClick("PoW->PoS")}>
          <h3>{"PoW->PoS"}</h3>
          <ol>
            <li>
              Deposit your ETHW
              <br />
              to our contract on PoW
            </li>
            <li>
              Mint{" "}
              <Tooltip active={isFocused} tooltip={WPoWETHExplanation} left>
                WPoWETH
              </Tooltip>
              on PoS
            </li>
          </ol>
        </div>
        <div onClick={handleClick("PoS->PoW")}>
          <h3>{"PoS->PoW"}</h3>
          <ol>
            <li>
              Burn{" "}
              <SmallText
                style={{ marginLeft: "-1.5rem", marginRight: "-1rem" }}
              >
                Withdraw
              </SmallText>{" "}
              <Tooltip active={isFocused} tooltip={WPoWETHExplanation}>
                WPoWETH
              </Tooltip>{" "}
              on{" "}
              <SmallText
                style={{ marginLeft: "-0.75rem", marginRight: "-0.5rem" }}
              >
                from
              </SmallText>{" "}
              PoS
            </li>
            <li>
              Redeem ETHW from our
              <br />
              contract on PoW
            </li>
          </ol>
        </div>
      </ColumnContainer>
    </StyledNoPathChosenYet>
  );
}
