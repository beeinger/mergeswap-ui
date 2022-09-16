import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ChainsContext } from "./useChains";
import { Path } from "./types";
import { toast } from "react-toastify";
import { useEthers } from "@usedapp/core";
import { useRouter } from "next/router";

export const PathContext = createContext<ReturnType<typeof usePath>>(null);

export default function usePath() {
  const router = useRouter(),
    [path, _setPath] = useState<Path>(null);

  const { isETHAtAll } = useContext(ChainsContext),
    { account } = useEthers();
  const disabled = useMemo(
    () => !account || !isETHAtAll,
    [account, isETHAtAll]
  );

  const setPath = (value: React.SetStateAction<Path>) => {
    // TODO: remove this check when PoS->PoW is available
    if (value === "PoS->PoW")
      return toast.dark("🚧 This path is not yet available");
    if (disabled) {
      _setPath(null);
      toast.dark(
        <>
          Connect your wallet and select the chain to continue.
          <br />
          <br />
          Or choose a path from the Info tab.
        </>,
        {
          type: "info",
        }
      );
    } else _setPath(value);
  };

  useEffect(() => {
    if (disabled) return;

    if (!path) {
      const pathToBe = router.query.path as Path;
      if (["PoW->PoS", "PoS->PoW"].includes(pathToBe)) setPath(pathToBe);
    } else
      router.replace(
        { pathname: router.pathname, query: { ...router.query, path } },
        undefined,
        { shallow: true }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, router.query.path, disabled]);

  useEffect(() => {
    if (!disabled) return;
    if (path) setPath(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, disabled]);

  return { path, setPath, disabled };
}
