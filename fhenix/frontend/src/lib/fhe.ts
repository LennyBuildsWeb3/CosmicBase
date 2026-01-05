import { BrowserProvider, Contract } from "ethers";
import { getDominantElement, getZodiacIndex, ELEMENTS, ZODIAC } from "./saju";

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS;

const ABI = [
  "function storeProfile(bytes,bytes,bytes,bytes,bytes,bytes) external",
  "function getProfile(address) view returns (uint256,uint256,uint256,uint256,uint256,uint256)",
  "function hasProfile(address) view returns (bool)",
  "function checkCompatibility(address) returns (uint256)"
];

export interface BirthInput { month: number; day: number; year: number; hour: number }
export interface Profile extends BirthInput { element: string; zodiac: string }

let cofhe: any = null;

export async function initFHE(provider: BrowserProvider) {
  try {
    const { cofhejs } = await import("cofhejs/web");
    const signer = await provider.getSigner();
    const res = await cofhejs.initialize({ 
      provider: provider as any, 
      signer: signer as any, 
      environment: "TESTNET" 
    });
    if (res.success) {
      cofhe = cofhejs;
      return true;
    }
    console.error("FHE init failed:", res.error);
    return false;
  } catch (e) {
    console.error("FHE init error:", e);
    return false;
  }
}

export async function storeProfile(provider: BrowserProvider, d: BirthInput) {
  if (!cofhe) throw new Error("FHE not initialized");
  
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT, ABI, signer);
  const el = getDominantElement(d.year, d.month, d.day, d.hour);
  const zod = getZodiacIndex(d.month, d.day);

  const { Encryptable } = await import("cofhejs/web");
  
  const encResult = await cofhe.encrypt([
    Encryptable.uint8(BigInt(d.month)),
    Encryptable.uint8(BigInt(d.day)),
    Encryptable.uint16(BigInt(d.year)),
    Encryptable.uint8(BigInt(d.hour)),
    Encryptable.uint8(BigInt(el)),
    Encryptable.uint8(BigInt(zod))
  ]);

  if (!encResult.success) throw new Error("Encryption failed");
  
  const tx = await contract.storeProfile(...(encResult.data as any[]));
  return tx.wait();
}

export async function getProfile(provider: BrowserProvider): Promise<Profile | null> {
  if (!cofhe) throw new Error("FHE not initialized");
  
  const signer = await provider.getSigner();
  const addr = await signer.getAddress();
  const contract = new Contract(CONTRACT, ABI, signer);
  
  if (!(await contract.hasProfile(addr))) return null;
  
  const [m, d, y, h, e, z] = await contract.getProfile(addr);
  
  const { FheTypes } = await import("cofhejs/web");
  
  const month = await cofhe.unseal(m, FheTypes.Uint8);
  const day = await cofhe.unseal(d, FheTypes.Uint8);
  const year = await cofhe.unseal(y, FheTypes.Uint16);
  const hour = await cofhe.unseal(h, FheTypes.Uint8);
  const element = await cofhe.unseal(e, FheTypes.Uint8);
  const zodiac = await cofhe.unseal(z, FheTypes.Uint8);

  return {
    month: Number(month.success ? month.data : 0),
    day: Number(day.success ? day.data : 0),
    year: Number(year.success ? year.data : 0),
    hour: Number(hour.success ? hour.data : 0),
    element: ELEMENTS[Number(element.success ? element.data : 0)],
    zodiac: ZODIAC[Number(zodiac.success ? zodiac.data : 0)]
  };
}
