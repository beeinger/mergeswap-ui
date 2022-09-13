import React, { useContext, useState } from "react";

import { ChainsContext } from "shared/useChains";

export default function PoSToPoW() {
  const { isPoW } = useContext(ChainsContext);
  const [PoWEthTokensAmount, setPoWEthTokensAmount] = useState("");

  return isPoW ? (
    //? Should be active only when person has our tokens that represent PoW ETH on PoS
    <div>
      <h4>Exchange PoW ETH tokens on PoS back to PoW ETH</h4>
      <input
        placeholder="PoW ETH tokens amount"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={PoWEthTokensAmount}
      />
      <button>withdraw</button>
    </div>
  ) : (
    //? Should be active only when someone has burned our PoW ETH tokens on PoS
    <div>
      <h4>Redeem PoW ETH you&apos;ve sent back from PoS</h4>
      <button>redeem {PoWEthTokensAmount || "11.2"}</button>
    </div>
  );
}
