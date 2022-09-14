import React, { useContext, useState } from "react";

import { ChainsContext } from "shared/useChains";

export default function PoSToPoW() {
  const { isPoS } = useContext(ChainsContext);
  const [poWEthTokensAmount, setPoWEthTokensAmount] = useState("");

  return isPoS ? (
    //? Should be active only when person has our tokens that represent ETH PoW on PoS
    <div>
      <h4>Exchange ETH PoW tokens on PoS back to ETH PoW</h4>
      <input
        placeholder="ETH PoW tokens amount"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount}
      />
      <button>withdraw</button>
    </div>
  ) : (
    //? Should be active only when someone has burned our ETH PoW tokens on PoS
    <div>
      <h4>Redeem ETH PoW you&apos;ve sent back from PoS</h4>
      <input
        placeholder="ETH PoW amount"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount}
      />
      <button>redeem</button>
    </div>
  );
}
