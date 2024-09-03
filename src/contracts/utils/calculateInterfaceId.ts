import { sha256 } from "@btc-vision/btc-runtime/runtime/env/global";

// Helper function to calculate function selector using SHA-256
function calculateSelector(methodSignature: string): u32 {
  const hash = sha256(Uint8Array.wrap(String.UTF8.encode(methodSignature)));
  // Use the first 4 bytes of the hash as the selector
  return (
    (hash[0] << 24) |
    (hash[1] << 16) |
    (hash[2] << 8) |
    hash[3]
  );
}

export function calculateInterfaceId(methodSignatures: string[]): u32 {
  let interfaceId: u32 = 0;

  for (let i = 0; i < methodSignatures.length; i++) {
    interfaceId ^= calculateSelector(methodSignatures[i]);
  }

  return interfaceId;
}