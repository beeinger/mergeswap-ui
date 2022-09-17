import { JsonRpcProvider } from "@ethersproject/providers";
import { hexValue } from "ethers/lib/utils";

const retrieveStateRoot = async (
  blockNumber: number,
  provider: JsonRpcProvider
) => {
  const { stateRoot } = await provider.send("eth_getBlockByNumber", [
    hexValue(blockNumber),
    true,
  ]);
  if (!stateRoot)
    throw new Error(`could not retrieve state root for block ${blockNumber}`);

  return stateRoot;
};

export default retrieveStateRoot;
