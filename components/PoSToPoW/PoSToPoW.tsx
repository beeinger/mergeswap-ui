import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import React, { useContext, useState } from "react";

import { ChainsContext } from "shared/useChains";

export default function PoSToPoW() {
  const { isPoS } = useContext(ChainsContext);
  const [poWEthTokensAmount, setPoWEthTokensAmount] = useState("");

  return isPoS ? (
    //? Should be active only when person has our tokens that represent ETH PoW on PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {"todo"}
        <MaxButton>max</MaxButton>
      </Balance>
      <ConfirmTransaction>withdraw</ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has burned our ETH PoW tokens on PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {"todo"}
        <MaxButton>max</MaxButton>
      </Balance>
      <ConfirmTransaction>redeem</ConfirmTransaction>
    </InteractionContainer>
  );
}
