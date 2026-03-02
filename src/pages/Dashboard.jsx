import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentBattlesApi } from "../api/historyApi";
import { useAuth } from "../store/auth";
import { makeSocket } from "../lib/socket";
import LogoutButton from "../components/logout/logout";

function Badge({ children, tone = "slate" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : tone === "red"
      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
      : tone === "yellow"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-slate-500/15 text-slate-300 border-slate-500/30";

  return (
    <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function statusTone(status) {
  const s = String(status || "").toUpperCase();
  if (s === "FINISHED") return "green";
  if (s === "CANCELLED") return "red";
  if (s === "ACTIVE") return "yellow";
  return "slate";
}

export default function Dashboard() {
  const nav = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [battles, setBattles] = useState([]);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  // join room
  const [joinCode, setJoinCode] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const [joining, setJoining] = useState(false);
  const socketRef = useRef(null);

  // init socket for JOIN only (keep it light)
  useEffect(() => {
    if (!token) return;

    const s = makeSocket(token);
    socketRef.current = s;

    s.on("connect_error", (e) => setJoinErr(e?.message || "Socket error"));
    s.on("room:error", (m) => setJoinErr(String(m || "Room error")));
    s.on("room:cancelled", () => nav("/dashboard"));
    s.on("battle:started", (startedRoom) => nav(`/battle/${startedRoom.roomId}`));

    return () => {
      s.off();
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, nav]);

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const res = await getRecentBattlesApi(100);
      if (!res || !Array.isArray(res.battles)) {
        setBattles([]);
        setErr(res?.message || "Failed to load history");
        return;
      }
      setBattles(res.battles);
    } catch (e) {
      setErr(e?.message || "Failed to load history");
      setBattles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return (battles || []).filter((b) => {
      const s = String(b.status || "").toUpperCase();
      const topic = String(b.topic || "").toLowerCase();
      const room = String(b.roomCode || "").toLowerCase();
      const winner = String(b.winnerUsername || "").toLowerCase();

      const statusOk = status === "ALL" ? true : s === status;
      const qOk =
        !text ||
        topic.includes(text) ||
        room.includes(text) ||
        winner.includes(text) ||
        s.toLowerCase().includes(text);

      return statusOk && qOk;
    });
  }, [battles, q, status]);

  const joinRoom = () => {
    setJoinErr("");
    const code = String(joinCode || "").trim();
    if (!code) return setJoinErr("Enter a room code");

    const s = socketRef.current;
    if (!s || !s.connected) return setJoinErr("Socket not connected");

    setJoining(true);

    s.emit("room:join", { roomId: code }, (ack) => {
      setJoining(false);
      if (!ack?.ok) return setJoinErr(ack?.message || "Join failed");
      nav(`/room/${code}`);
    });
  };

  return (
    <div className="bg-slate-950 text-white min-h-[100svh]">
      {/* TOP BAR */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => nav("/dashboard")}
              className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-100 hover:text-white whitespace-nowrap"
            >
              CodeBattle
            </button>

            <div className="hidden lg:block text-sm text-slate-400 truncate">
              Welcome{user?.username ? `, ${user.username}` : ""} — Global battle history + quick actions
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-sm text-slate-300 max-w-[40vw] truncate">
              {user?.username || user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-5 sm:py-6 space-y-4 sm:space-y-5">
        {/* ACTIONS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Create */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="text-base sm:text-lg font-bold">Create Room</div>
            <div className="text-sm text-slate-400 mt-1">
              Start a new battle and invite players.
            </div>

            <button
              onClick={() => nav("/create-room")}
              className="mt-4 w-full h-11 sm:h-12 px-4 rounded-xl font-semibold bg-slate-200 text-slate-900 hover:bg-white"
            >
              Create Room
            </button>
          </div>

          {/* Join */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-base sm:text-lg font-bold">Join Room</div>
                <div className="text-sm text-slate-400 mt-1">
                  Paste room code to enter lobby.
                </div>
              </div>

              <button
                onClick={load}
                className="w-full sm:w-auto h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold"
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter room code (example: a1b2c3)"
                className="w-full flex-1 h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
              />

              <button
                disabled={joining}
                onClick={joinRoom}
                className="w-full sm:w-auto h-11 sm:h-12 px-5 rounded-xl font-semibold bg-slate-200 text-slate-900 hover:bg-white disabled:opacity-60"
              >
                {joining ? "Joining..." : "Join"}
              </button>
            </div>

            {joinErr && (
              <div className="mt-3 text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-sm">
                {joinErr}
              </div>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by topic, room code, winner, status..."
                className="w-full flex-1 h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full sm:w-56 h-11 sm:h-12 px-3 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
              >
                <option value="ALL">All</option>
                <option value="FINISHED">FINISHED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="WAITING">WAITING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div>
              <div className="text-base sm:text-lg font-bold">Global History</div>
              <div className="text-xs text-slate-400">
                Showing {filtered.length} of {battles.length}
              </div>
            </div>
          </div>

          {err && (
            <div className="px-4 sm:px-5 py-4 text-rose-300 border-b border-slate-800 text-sm">
              {err}
            </div>
          )}

          {loading ? (
            <div className="px-4 sm:px-5 py-10 text-slate-400">Loading battles...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 sm:px-5 py-10 text-slate-400">
              No battles found for this filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((b) => {
                const s = String(b.status || "").toUpperCase();
                return (
                  <div
                    key={b.roomCode}
                    className="px-4 sm:px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 hover:bg-slate-900"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-semibold truncate max-w-[70vw] sm:max-w-none">
                          {(b.topic || "TOPIC").toUpperCase()}
                        </div>

                        <Badge tone={statusTone(s)}>{s}</Badge>

                        <span className="text-xs text-slate-400 break-all">
                          Room: <span className="text-slate-200">{b.roomCode}</span>
                        </span>
                      </div>

                      <div className="text-sm text-slate-300 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        <span>
                          Players: <span className="text-white">{b.playerCount}</span>
                        </span>
                        <span className="text-slate-500">·</span>
                        <span>
                          Questions: <span className="text-white">{b.questionCount}</span>
                        </span>
                        <span className="text-slate-500">·</span>
                        <span>
                          Timer: <span className="text-white">{b.timerSeconds}s</span>
                        </span>
                      </div>

                      <div className="text-sm text-slate-400 mt-1">
                        Winner:{" "}
                        <span className="text-emerald-300 font-semibold break-words">
                          {b.winnerUsername || "—"}
                        </span>
                      </div>
                    </div>

                    {/* buttons responsive */}
                    <div className="grid grid-cols-2 sm:flex gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => nav(`/history/${b.roomCode}`)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-200 text-slate-900 hover:bg-white font-semibold"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => navigator.clipboard?.writeText?.(b.roomCode)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 px-1">
          Tip: Click <b>Open</b> to view battle details (<code>/history/:roomCode</code>).
        </div>
      </div>
    </div>
  );
}