import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { makeSocket } from "../lib/socket";

const TOPICS = ["arrays", "strings", "dp", "graphs", "trees"];
const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <div className="mt-2">{children}</div>
      {hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
    </div>
  );
}

export default function CreateRoom() {
  const nav = useNavigate();
  const { token } = useAuth();
  const socketRef = useRef(null);

  const [status, setStatus] = useState("connecting...");
  const [err, setErr] = useState("");

  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("3");
  const [maxPlayers, setMaxPlayers] = useState("2");
  const [timerMinutes, setTimerMinutes] = useState("10");

  useEffect(() => {
    if (!token) return;

    const socket = makeSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", (e) => setStatus(e?.message || "connect_error"));
    socket.on("room:error", (msg) => setErr(String(msg || "Room error")));

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const validateCreate = () => {
    if (!topic) return "Select topic";
    const qc = Number(questionCount);
    const mp = Number(maxPlayers);
    const tm = Number(timerMinutes);

    if (!qc || qc < 1 || qc > 10) return "Question count must be 1 to 10";
    if (!mp || mp < 2 || mp > 10) return "Max players must be 2 to 10";
    if (!tm || tm < MIN_MINUTES || tm > MAX_MINUTES)
      return `Timer must be ${MIN_MINUTES}-${MAX_MINUTES} minutes`;

    return "";
  };

  const createRoom = () => {
    setErr("");
    const socket = socketRef.current;
    if (!socket || !socket.connected) return setErr("Socket not connected");

    const v = validateCreate();
    if (v) return setErr(v);

    socket.emit(
      "room:create",
      {
        topic,
        questionCount: Number(questionCount),
        maxPlayers: Number(maxPlayers),
        timerSeconds: Number(timerMinutes) * 60,
      },
      (ack) => {
        if (!ack?.ok) return setErr(ack?.message || "Create failed");
        nav(`/room/${ack.room.roomId}`);
      }
    );
  };

  const validationMsg = validateCreate();
  const canCreate = !validationMsg;

  return (
    <div className="bg-slate-950 text-white min-h-[100svh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 py-5 sm:py-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Create Room
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Configure a battle room and share the room code with your friend.
              </p>
            </div>

            <div className="self-start text-xs px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 whitespace-nowrap">
              Socket: <span className="text-white font-semibold">{status}</span>
            </div>
          </div>

          {err && (
            <div className="mt-4 text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-sm">
              {err}
            </div>
          )}

          {!err && !canCreate && (
            <div className="mt-4 text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm">
              {validationMsg}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Topic" hint="Choose the topic set for random problems.">
                <select
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Select topic</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Question Count" hint="1 to 10 problems per battle.">
              <input
                className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                min={1}
                max={10}
              />
            </Field>

            <Field label="Max Players" hint="2 to 10 players.">
              <input
                className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                min={2}
                max={10}
              />
            </Field>

            <div className="md:col-span-2">
              <Field
                label="Timer (minutes)"
                hint={`Allowed: ${MIN_MINUTES}-${MAX_MINUTES} minutes`}
              >
                <input
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 outline-none focus:border-slate-600"
                  type="number"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(e.target.value)}
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                />
              </Field>
            </div>

            {/* Buttons: stack on mobile, inline on bigger screens */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={createRoom}
                disabled={!canCreate}
                className="w-full sm:flex-1 h-11 sm:h-12 px-4 rounded-xl font-semibold bg-slate-200 text-slate-900 hover:bg-white disabled:opacity-50 disabled:hover:bg-slate-200"
              >
                Create Room
              </button>

              <button
                onClick={() => nav("/dashboard")}
                className="w-full sm:w-auto h-11 sm:h-12 px-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 px-1">
          After room creation, you will be redirected to Lobby (<code>/room/:roomId</code>).
        </div>
      </div>
    </div>
  );
}