import { useEffect, useState } from "react";

import { Path } from "./types";
import { useRouter } from "next/router";

export default function usePath() {
  const router = useRouter(),
    [path, setPath] = useState<Path>(null);

  useEffect(() => {
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

  return [path, setPath] as const;
}
