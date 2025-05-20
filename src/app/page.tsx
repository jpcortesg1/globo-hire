"use client";
import { useState } from "react";

export default function Home() {
  const [credits, setCredits] = useState<number | null>(null);
  const [symbols, setSymbols] = useState<string[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create session
  const createSession = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/session/create", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setCredits(data.session.credits);
      setMessage("Session created!");
    } else {
      setMessage(data.error || "Error creating session");
    }
    setSymbols(null);
    setLoading(false);
  };

  // Roll
  const roll = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/game/roll", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setCredits(data.result.credits);
      setSymbols(data.result.symbols);
      setMessage(data.result.message || (data.result.isWin ? "You won!" : "No win this time."));
    } else {
      setMessage(data.error || "Error rolling");
    }
    setLoading(false);
  };

  // Cash out
  const cashOut = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/session/cashout", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setCredits(data.credits);
      setMessage(data.message || "Cashed out!");
    } else {
      setMessage(data.error || "Error cashing out");
    }
    setSymbols(null);
    setLoading(false);
  };

  // Status
  const getStatus = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/session/status");
    const data = await res.json();
    if (data.success) {
      setCredits(data.status.credits);
      setMessage(data.message || "Session status loaded.");
    } else {
      setMessage(data.error || "Error getting status");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold mb-4">Slot Machine Test UI</h1>
      <div className="flex gap-2">
        <button onClick={createSession} disabled={loading}>Create Session</button>
        <button onClick={roll} disabled={loading}>Roll</button>
        <button onClick={cashOut} disabled={loading}>Cash Out</button>
        <button onClick={getStatus} disabled={loading}>Status</button>
      </div>
      <div className="mt-4">
        <div>Credits: {credits !== null ? credits : "--"}</div>
        <div>
          Symbols: {symbols ? symbols.join(" | ") : "--"}
        </div>
        <div className="mt-2 text-blue-600">{loading ? "Loading..." : message}</div>
      </div>
    </div>
  );
}
