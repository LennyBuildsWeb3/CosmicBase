import { useState } from "react";
import { BrowserProvider } from "ethers";
import { initFHE, storeProfile, getProfile, Profile } from "./lib/fhe";

const BASE_SEPOLIA = { chainId: "0x14a34", name: "Base Sepolia", rpc: "https://sepolia.base.org" };

export default function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState("");
  const [form, setForm] = useState({ month: 1, day: 15, year: 1995, hour: 12 });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState("");
  const [status, setStatus] = useState("");

  async function connect() {
    console.log("Connect clicked");
    if (!window.ethereum) {
      alert("Install MetaMask or Wepin");
      return;
    }
    setLoading("Connecting...");
    try {
      console.log("Creating provider...");
      const p = new BrowserProvider(window.ethereum);
      
      // Request accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Getting signer...");
      const s = await p.getSigner();
      const addr = await s.getAddress();
      setProvider(p);
      setAddress(addr);
      
      // Check network
      const network = await p.getNetwork();
      console.log("Network:", network.chainId);
      if (network.chainId !== 84532n) {
        setStatus("⚠️ Please switch to Base Sepolia (Chain ID: 84532)");
        setLoading("");
        return;
      }
      
      setLoading("Initializing FHE...");
      console.log("Init FHE...");
      const ok = await initFHE(p);
      console.log("FHE init result:", ok);
      setStatus(ok ? "✅ Connected & FHE Ready" : "⚠️ Connected (FHE init failed)");
    } catch (e: any) {
      console.error("Connect error:", e);
      setStatus("❌ " + e.message);
    }
    setLoading("");
  }

  async function save() {
    if (!provider) return;
    setLoading("Encrypting & saving...");
    setStatus("");
    try {
      await storeProfile(provider, form);
      setStatus("✅ Profile saved on-chain (encrypted)!");
    } catch (e: any) {
      setStatus("❌ " + e.message);
    }
    setLoading("");
  }

  async function load() {
    if (!provider) return;
    setLoading("Decrypting...");
    setStatus("");
    try {
      const p = await getProfile(provider);
      setProfile(p);
      setStatus(p ? "✅ Decrypted!" : "No profile found");
    } catch (e: any) {
      setStatus("❌ " + e.message);
    }
    setLoading("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-2">☯ CosmicBase FHE</h1>
        <p className="text-center text-purple-300 text-sm mb-6">Encrypted Astrology on Base Sepolia</p>

        {!address ? (
          <button onClick={connect} disabled={!!loading} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-semibold disabled:opacity-50">
            {loading || "Connect Wallet"}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-sm text-purple-400 bg-purple-900/30 py-2 rounded-lg">
              {address.slice(0,6)}...{address.slice(-4)}
            </div>

            <div className="bg-purple-800/30 p-5 rounded-xl space-y-3">
              <h2 className="font-semibold">🔐 Store Encrypted Profile</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-purple-300">Month</label>
                  <input type="number" min={1} max={12} value={form.month} onChange={e => setForm({...form, month: +e.target.value})} className="w-full bg-purple-900/50 p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs text-purple-300">Day</label>
                  <input type="number" min={1} max={31} value={form.day} onChange={e => setForm({...form, day: +e.target.value})} className="w-full bg-purple-900/50 p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs text-purple-300">Year</label>
                  <input type="number" min={1900} max={2025} value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full bg-purple-900/50 p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs text-purple-300">Hour (0-23)</label>
                  <input type="number" min={0} max={23} value={form.hour} onChange={e => setForm({...form, hour: +e.target.value})} className="w-full bg-purple-900/50 p-2 rounded" />
                </div>
              </div>
              <button onClick={save} disabled={!!loading} className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded-lg disabled:opacity-50">
                {loading || "🔒 Encrypt & Save"}
              </button>
            </div>

            <div className="bg-purple-800/30 p-5 rounded-xl space-y-3">
              <h2 className="font-semibold">🔓 View My Profile</h2>
              <button onClick={load} disabled={!!loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg disabled:opacity-50">
                {loading || "Decrypt & View"}
              </button>
              {profile && (
                <div className="bg-black/30 p-4 rounded-lg text-sm space-y-1">
                  <p>📅 {profile.month}/{profile.day}/{profile.year} at {profile.hour}:00</p>
                  <p>🌿 Element: <span className="text-green-400 font-semibold">{profile.element}</span></p>
                  <p>⭐ Zodiac: <span className="text-yellow-400 font-semibold">{profile.zodiac}</span></p>
                </div>
              )}
            </div>

            {status && <p className="text-center text-sm">{status}</p>}
          </div>
        )}

        <p className="text-center text-purple-500 text-xs mt-6">Powered by Fhenix FHE</p>
      </div>
    </div>
  );
}
