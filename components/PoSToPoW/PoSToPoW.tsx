import React, { useContext, useEffect, useState } from "react";

import { ChainsContext } from "shared/useChains";

export default function PoSToPoW() {
  const { isPoS } = useContext(ChainsContext);
  const [poWEthTokensAmount, setPoWEthTokensAmount] = useState("");

  return isPoS ? (
    //? Should be active only when person has our tokens that represent PoW ETH on PoS
    <div>
      <h4>Exchange PoW ETH tokens on PoS back to PoW ETH</h4>
      <input
        placeholder="PoW ETH tokens amount"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount}
      />
      <button>withdraw</button>
    </div>
  ) : (
    //? Should be active only when someone has burned our PoW ETH tokens on PoS
    <div>
      <h4>Redeem PoW ETH you&apos;ve sent back from PoS</h4>
      <input
        placeholder="PoW ETH amount"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount}
      />
      <button>redeem</button>
    </div>
  );
}
