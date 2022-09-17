import { hexValue, hexZeroPad, keccak256 } from "ethers/lib/utils";

import { JsonRpcProvider } from "@ethersproject/providers";
import { toast } from "react-toastify";

const getProof = async (
  mapKey: string,
  blockNumber: string,
  provider: JsonRpcProvider,
  contractAddress: string,
  slotIndex: string
) => {
  const paddedSlot = hexZeroPad(slotIndex, 32);
  const paddedKey = hexZeroPad(mapKey, 32);
  const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));

  const proof = await provider
    .send("eth_getProof", [
      contractAddress,
      [itemSlot],
      hexValue(Number(blockNumber)),
    ])
    .catch((err) => {
      toast.dark(
        "😕 Sorry, the network is out-of-sync (not our fault), please try again!)"
      );
      return { error: true, message: err.message };
    });

  return {
    storageProof: proof?.storageProof?.[0]?.proof,
    accountProof: proof?.accountProof,
    error: proof?.error || false,
    message: proof?.message || "",
  };
};

export default getProof;
