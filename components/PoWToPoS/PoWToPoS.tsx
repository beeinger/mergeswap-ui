import React, { useContext, useState } from "react";

import { ChainsContext } from "shared/useChains";

export default function PoWToPoS() {
  const { isPoW } = useContext(ChainsContext);
  const [poWEthAmount, setPoWEthAmount] = useState("");

  // @wip
  const handleDeposit = () => {
    console.log("handling deposit", poWEthAmount);
  };

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <div>
      <h4>Send PoW ETH to PoS</h4>
      <input
        placeholder="ETH amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button onClick={handleDeposit}>confirm</button>
    </div>
  ) : (
    //? Should be active only when someone has sent PoW ETH to PoS
    <div>
      <h4>Mint PoW ETH you&apos;ve sent to PoS</h4>
      <input
        placeholder="PoW ETH amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button>mint</button>
    </div>
  );
}
