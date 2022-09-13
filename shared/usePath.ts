import { useEffect, useState } from "react";

import { Path } from "./types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function usePath(disabled: boolean = false) {
  const router = useRouter(),
    [path, _setPath] = useState<Path>(null);

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
  }, [path, router.query.path]);

  useEffect(() => {
    if (!disabled) return;
    if (path) setPath(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, disabled]);

  const setPath = (value: React.SetStateAction<Path>) => {
    if (disabled) {
      _setPath(null);
      toast.dark("Connect your wallet and select the chain to continue.");
    } else _setPath(value);
  };

  return [path, setPath] as const;
}
