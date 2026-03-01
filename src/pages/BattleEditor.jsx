// ======================= PART 1 / 3 =======================
// src/pages/BattleEditor.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { makeSocket } from "../lib/socket";
import Editor from "@monaco-editor/react";

/* ==============================
   LANGUAGES
============================== */
const LANGS = [
  { label: "Java", value: 62 },
  { label: "Python", value: 71 },
];

function starterFieldForLang(language_id) {
  if (language_id === 62) return "starterJava";
  if (language_id === 71) return "starterPython";
  return null;
}

/* ==============================
   MARKERS
============================== */
const HELPERS_START = "__HELPERS_START__";
const HELPERS_END = "__HELPERS_END__";
const START_MARK = "__START__";
const END_MARK = "__END__";

function token(langId, name) {
  return langId === 62 ? `//${name}` : `#${name}`;
}

/* ==============================
   THEME (optional)
============================== */
const BATTLE_PRO_THEME = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "", foreground: "E2E8F0" },
    { token: "keyword", foreground: "C084FC", fontStyle: "bold" },
    { token: "keyword.control", foreground: "C084FC", fontStyle: "bold" },
    { token: "type", foreground: "93C5FD" },
    { token: "type.identifier", foreground: "93C5FD" },
    { token: "identifier.function", foreground: "FCD34D" },
    { token: "string", foreground: "86EFAC" },
    { token: "number", foreground: "FCA5A5" },
    { token: "comment", foreground: "64748B", fontStyle: "italic" },
    { token: "operator", foreground: "A5B4FC" },
    { token: "delimiter", foreground: "CBD5F5" },
  ],
  colors: {
    "editor.background": "#020617",
    "editor.foreground": "#E2E8F0",
    "editorCursor.foreground": "#A855F7",
    "editor.selectionBackground": "#4c1d95",
    "editor.inactiveSelectionBackground": "#312e81",
    "editor.lineHighlightBackground": "#0f172a",
    "editorLineNumber.foreground": "#64748b",
    "editorLineNumber.activeForeground": "#c084fc",
    "editorBracketMatch.background": "#6d28d966",
    "editorBracketMatch.border": "#a855f7",
    "scrollbarSlider.background": "#47556955",
    "scrollbarSlider.hoverBackground": "#47556988",
    "scrollbarSlider.activeBackground": "#475569AA",
    "editorIndentGuide.background1": "#0f172a",
    "editorIndentGuide.activeBackground1": "#6d28d9",
  },
};

/* ==============================
   INSERT MARKERS (Java + Python)
   - helpers region inside class
   - main region inside required function
============================== */
function ensureMarkers(code, language_id, fnName = "") {
  if (!code) return "";

  const hs = token(language_id, HELPERS_START);
  const he = token(language_id, HELPERS_END);
  const ms = token(language_id, START_MARK);
  const me = token(language_id, END_MARK);

  // If both regions already exist, keep as-is
  const hasHelpers = code.includes(hs) && code.includes(he);
  const hasMain = code.includes(ms) && code.includes(me);
  if (hasHelpers && hasMain) return code;

  let out = String(code);

  // ---------------------------------------
  // JAVA: put helpers inside class, main inside method body
  // ---------------------------------------
  if (language_id === 62) {
    // 1) Helpers region: after "class Solution {"
    if (!hasHelpers) {
      const classIdx = out.search(/\bclass\s+Solution\b/);
      if (classIdx !== -1) {
        const braceIdx = out.indexOf("{", classIdx);
        if (braceIdx !== -1) {
          const insertAt = braceIdx + 1;
          out =
            out.slice(0, insertAt) +
            `\n\n  ${hs}\n  // helper functions here\n  ${he}\n` +
            out.slice(insertAt);
        }
      }
    }

    // 2) Main region: inside function body of fnName
    if (!hasMain) {
      const name = fnName?.trim() || "";
      // match method like: public int[] twoSum(...){
      const re = name
        ? new RegExp(`\\b${name}\\s*\\([^)]*\\)\\s*\\{`, "m")
        : /\bpublic\b[\s\S]*?\([^)]*\)\s*\{/m;

      const m = out.match(re);
      if (m && typeof m.index === "number") {
        const openBraceAt = out.indexOf("{", m.index);
        const insertAt = openBraceAt + 1;
        out =
          out.slice(0, insertAt) +
          `\n\n    ${ms}\n\n    ${me}\n` +
          out.slice(insertAt);
      }
    }

    // remove "TODO: write logic only" if present
    out = out.replace(/^\s*\/\/\s*TODO:.*$/gm, "");

    return out;
  }

  // ---------------------------------------
  // PYTHON: helpers inside class (top), main inside fn body
  // ---------------------------------------
  if (language_id === 71) {
    // normalize indentation (your starters are 2 spaces; we keep 2)
    // 1) Helpers region: right after "class Solution:"
    if (!hasHelpers) {
      const classIdx = out.search(/\bclass\s+Solution\s*:/);
      if (classIdx !== -1) {
        const lineEnd = out.indexOf("\n", classIdx);
        const insertAt = lineEnd === -1 ? out.length : lineEnd + 1;
        out =
          out.slice(0, insertAt) +
          `  ${hs}\n  # helper functions here\n  ${he}\n\n` +
          out.slice(insertAt);
      }
    }

    // 2) Main region: inside def fnName(...)
    if (!hasMain) {
      const name = fnName?.trim() || "";
      const re = name
        ? new RegExp(`\\bdef\\s+${name}\\s*\\(`, "m")
        : /\bdef\s+\w+\s*\(/m;

      const m = out.match(re);
      if (m && typeof m.index === "number") {
        const defLineEnd = out.indexOf("\n", m.index);
        const insertAt = defLineEnd === -1 ? out.length : defLineEnd + 1;

        // Insert with 4-space body indent (your file uses 2 for def line, 4 for body)
        out =
          out.slice(0, insertAt) +
          `    ${ms}\n\n    ${me}\n` +
          out.slice(insertAt);
      }
    }

    // remove TODO line if present
    out = out.replace(/^\s*#\s*TODO:.*$/gm, "");

    return out;
  }

  return out;
}

/* ==============================
   EDITABLE RANGES (TWO ZONES)
============================== */
function getEditableRanges(code, language_id) {
  if (!code) return [];

  const hs = token(language_id, HELPERS_START);
  const he = token(language_id, HELPERS_END);
  const ms = token(language_id, START_MARK);
  const me = token(language_id, END_MARK);

  const ranges = [];

  const hsIdx = code.indexOf(hs);
  const heIdx = code.indexOf(he);
  if (hsIdx !== -1 && heIdx !== -1 && heIdx > hsIdx) {
    ranges.push({
      start: hsIdx + hs.length,
      end: heIdx,
    });
  }

  const msIdx = code.indexOf(ms);
  const meIdx = code.indexOf(me);
  if (msIdx !== -1 && meIdx !== -1 && meIdx > msIdx) {
    ranges.push({
      start: msIdx + ms.length,
      end: meIdx,
    });
  }

  // sort, just in case
  ranges.sort((a, b) => a.start - b.start);
  return ranges;
}

function isChangeInsideAnyRange(model, changeRange, ranges) {
  const startOff = model.getOffsetAt(changeRange.getStartPosition());
  const endOff = model.getOffsetAt(changeRange.getEndPosition());
  return ranges.some((r) => startOff >= r.start && endOff <= r.end);
}

function formatMMSS(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ======================= PART 2 / 3 =======================
export default function BattleEditor() {
  const { roomId } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();

  const socket = useMemo(() => (token ? makeSocket(token) : null), [token]);

  const [status, setStatus] = useState("connecting...");
  const [err, setErr] = useState("");

  const [room, setRoom] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);

  const [language_id, setLanguageId] = useState(62);
  const [source_code, setSourceCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const detailsCacheRef = useRef(new Map());
  const editorRef = useRef(null);
  const lastGoodRef = useRef("");
  const suppressRef = useRef(false);

  /* ==============================
     SOCKET
  ============================== */
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", (e) => setErr(e?.message || "Socket error"));
    socket.on("room:error", (m) => setErr(String(m || "Room error")));

    socket.on("room:update", (r) => {
      setRoom(r);
      setErr("");
      if (r?.status === "FINISHED") setShowLeaderboard(true);
    });

    socket.on("battle:ended", (finalRoom) => {
      setRoom(finalRoom);
      setShowLeaderboard(true);
    });

    socket.on("submit:result", (payload) => {
      setSubmitting(false);
      setSubmitResult(payload);
    });

    socket.emit("room:get", { roomId }, (ack) => {
      if (ack?.ok && ack.room) {
        setRoom(ack.room);
        if (ack.room?.status === "FINISHED") setShowLeaderboard(true);
      }
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [socket, roomId]);

  /* ==============================
     TIMER
  ============================== */
  useEffect(() => {
    if (!room?.endTimeMs || room?.status !== "ACTIVE") {
      setTimeLeftMs(0);
      return;
    }

    const tick = () => {
      const left = Number(room.endTimeMs) - Date.now();
      setTimeLeftMs(Math.max(0, left));
      if (left <= 0) setShowLeaderboard(true);
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [room?.endTimeMs, room?.status]);

  /* ==============================
     ACTIVE PROBLEM
  ============================== */
  const questions = room?.questions || [];
  const activeQ = questions?.[activeIdx] || null;
  const activeProblemId = activeQ?.id || activeQ?.problemId || null;

  /* ==============================
     LOAD PROBLEM + STARTER
  ============================== */
  useEffect(() => {
    if (!socket || !activeProblemId) return;

    setErr("");
    setSubmitResult(null);

    const setStarterFor = (p) => {
      const field = starterFieldForLang(language_id);
      const starterRaw = field ? p?.[field] : "";
      const fnName = p?.fnName || "";

      const starter = ensureMarkers(String(starterRaw || ""), language_id, fnName);

      setSourceCode(starter);
      lastGoodRef.current = starter;

      const ed = editorRef.current;
      const model = ed?.getModel?.();
      if (ed && model) {
        suppressRef.current = true;
        model.setValue(starter);
        suppressRef.current = false;
      }
    };

    const cached = detailsCacheRef.current.get(activeProblemId);
    if (cached?.problem) {
      setProblem(cached.problem);
      setTestcases(cached.testcases || []);
      setStarterFor(cached.problem);
      return;
    }

    setProblem(null);
    setTestcases([]);
    setSourceCode("");
    lastGoodRef.current = "";

    socket.emit("problem:details", { problemId: activeProblemId }, (res) => {
      if (!res?.ok) {
        setErr(res?.message || "Failed to load problem");
        return;
      }

      const p = res.problem || null;
      const tcs = res.testcases || [];

      detailsCacheRef.current.set(activeProblemId, { problem: p, testcases: tcs });

      setProblem(p);
      setTestcases(tcs);
      setStarterFor(p);
    });
  }, [socket, activeProblemId, language_id]);

  /* ==============================
     MONACO GUARDS (2 editable zones)
  ============================== */
  function attachMonacoGuards(editor) {
    if (!editor) return;

    // Disable copy/paste/cut/select-all
    editor.onKeyDown((e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.code;
      if (ctrl && (key === "KeyC" || key === "KeyV" || key === "KeyX" || key === "KeyA")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    const node = editor.getDomNode();
    if (node) {
      const stop = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      node.addEventListener("copy", stop);
      node.addEventListener("cut", stop);
      node.addEventListener("paste", stop);
    }

    editor.onDidChangeModelContent((event) => {
      if (suppressRef.current) return;

      const model = editor.getModel();
      if (!model) return;

      const current = model.getValue();
      const ranges = getEditableRanges(current, language_id);

      // If markers missing → allow (but better to fix DB / ensureMarkers)
      if (!ranges.length) {
        lastGoodRef.current = current;
        setSourceCode(current);
        return;
      }

      const invalid = (event.changes || []).some((ch) => {
        return !isChangeInsideAnyRange(model, ch.range, ranges);
      });

      if (invalid) {
        suppressRef.current = true;
        model.setValue(lastGoodRef.current);
        suppressRef.current = false;
        return;
      }

      lastGoodRef.current = current;
      setSourceCode(current);
    });
  }

  /* ==============================
     SUBMIT
  ============================== */
  const submit = () => {
    setErr("");
    setSubmitResult(null);

    if (!socket) return setErr("Socket not connected");
    if (!room) return setErr("Room not loaded");
    if (room.status !== "ACTIVE") return setErr("Battle finished");
    if (timeLeftMs <= 0) return setErr("Time is over");
    if (!activeProblemId) return setErr("No problem selected");

    const codeToSend = editorRef.current?.getValue?.() ?? source_code;
    if (!String(codeToSend || "").trim()) return setErr("Code is empty");

    setSubmitting(true);

    socket.emit("submit:code", {
      roomId,
      problemId: activeProblemId,
      language_id,
      source_code: codeToSend,
    });
  };

  /* ==============================
     RESULT HELPERS
  ============================== */
  const resultsArr = Array.isArray(submitResult?.results) ? submitResult.results : [];
  const total = resultsArr.length;
  const passedCount = resultsArr.filter((r) => r.passed).length;
  const maxTime = resultsArr.reduce((m, r) => Math.max(m, Number(r.time || 0)), 0);
  const maxMem = resultsArr.reduce((m, r) => Math.max(m, Number(r.memory || 0)), 0);

  /* ==============================
     LEADERBOARD
  ============================== */
  const players = Array.isArray(room?.players) ? room.players : [];
  const scores = room?.scores || {};

  const sortedPlayers = players
    .map((p) => ({ ...p, score: Number(scores?.[p.userId] ?? 0) }))
    .sort((a, b) => b.score - a.score);

  const winnerId = room?.winner || (sortedPlayers[0]?.userId ?? "");
  const winner = sortedPlayers.find((p) => p.userId === winnerId) || sortedPlayers[0] || null;

  if (showLeaderboard || room?.status === "FINISHED") {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl font-bold">🏆 Contest Finished</div>
            <div className="text-sm text-slate-400 mt-1">Room: {roomId}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400">Winner</div>
            <div className="text-2xl font-bold mt-1">
              {winner ? (winner.email || winner.userId) : "N/A"}
            </div>
            <div className="text-sm mt-2 text-slate-300">
              Final Score: <span className="font-bold">{winner?.score ?? 0}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-lg font-semibold mb-4">Leaderboard</div>

            <div className="space-y-3">
              {sortedPlayers.length ? (
                sortedPlayers.map((p, idx) => (
                  <div
                    key={p.userId}
                    className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 text-center font-bold text-lg">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </div>
                      <div>
                        <div className="font-semibold">{p.email || p.userId}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[240px]">{p.userId}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold">{p.score}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No players found.</div>
              )}
            </div>

            <button
              onClick={() => nav("/dashboard")}
              className="mt-6 w-full p-3 rounded-xl bg-slate-200 text-slate-900 hover:bg-white font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  // ======================= PART 3 / 3 =======================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-4 space-y-4">

        {/* ================= PROBLEM TABS + TIMER ================= */}
        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex gap-2 overflow-x-auto">
            {questions.map((p, idx) => (
              <button
                key={p.id || p.problemId || idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                  idx === activeIdx
                    ? "bg-slate-200 text-slate-900"
                    : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                Problem {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Time Left</div>
              <div className="text-lg font-bold">
                {room?.status === "ACTIVE" ? formatMMSS(timeLeftMs) : "--:--"}
              </div>
            </div>

            <button
              onClick={() => nav("/dashboard")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold"
            >
              Exit
            </button>
          </div>
        </div>

        {err && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 rounded-2xl p-4">
            {err}
          </div>
        )}

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ================= LEFT PANEL ================= */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div>
              <div className="text-xl font-bold">{problem?.title || "Loading problem..."}</div>
              <div className="text-sm text-slate-400">
                {problem?.topic ? `Topic: ${problem.topic}` : ""}{" "}
                {problem?.difficulty ? `· Difficulty: ${problem.difficulty}` : ""}
              </div>
              {!!problem?.fnName && (
                <div className="text-xs text-slate-500 mt-1">
                  Function: <span className="text-slate-300 font-semibold">{problem.fnName}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm whitespace-pre-wrap min-h-[180px]">
              {problem?.statement || "Loading statement..."}
            </div>

            <div>
              <div className="font-semibold mb-2">Sample Testcases</div>
              {!testcases?.length ? (
                <div className="text-sm text-slate-400">No sample testcases received.</div>
              ) : (
                <div className="space-y-3">
                  {testcases.map((t, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm">
                      <div className="text-slate-300 font-semibold">Case {i + 1}</div>

                      <div className="mt-2">
                        <div className="text-xs text-slate-500">Input</div>
                        <pre className="whitespace-pre-wrap">{t.input || "(empty)"}</pre>
                      </div>

                      <div className="mt-2">
                        <div className="text-xs text-slate-500">Expected</div>
                        <pre className="whitespace-pre-wrap">{t.expected || "(empty)"}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg">Code Editor</div>

              <select
                value={language_id}
                onChange={(e) => setLanguageId(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
              >
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800">
              <Editor
                height="420px"
                language={language_id === 62 ? "java" : "python"}
                theme="battle-pro"
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("battle-pro", BATTLE_PRO_THEME);
                }}
                value={source_code}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: "all",
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                  lastGoodRef.current = editor.getValue() || source_code || "";
                  attachMonacoGuards(editor);
                }}
              />
            </div>

            <button
              disabled={submitting || timeLeftMs <= 0}
              onClick={submit}
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-900 hover:bg-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Submitting..." : timeLeftMs <= 0 ? "Time Over" : "Submit"}
            </button>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Result</div>

                {submitResult?.verdict && (
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-bold ${
                      submitResult.verdict === "AC"
                        ? "bg-emerald-600"
                        : submitResult.verdict === "WA"
                        ? "bg-rose-600"
                        : "bg-amber-600"
                    }`}
                  >
                    {submitResult.verdict}
                  </span>
                )}
              </div>

              {!submitResult ? (
                <div className="text-sm text-slate-400 mt-3">No result yet.</div>
              ) : (
                <>
                  <div className="text-sm text-slate-300 mt-2">{submitResult.message}</div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                      <div className="text-slate-500 text-xs">Passed</div>
                      <div className="font-bold">{passedCount}/{total || 0}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                      <div className="text-slate-500 text-xs">Max Runtime</div>
                      <div className="font-bold">{maxTime ? `${maxTime}s` : "-"}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                      <div className="text-slate-500 text-xs">Max Memory</div>
                      <div className="font-bold">{maxMem ? `${maxMem} KB` : "-"}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                      <div className="text-slate-500 text-xs">Language</div>
                      <div className="font-bold">{language_id === 62 ? "Java" : "Python"}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {resultsArr.map((r) => (
                      <div
                        key={r.index}
                        className="flex items-start justify-between bg-slate-900 rounded-xl p-3 border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Test {r.index}</span>
                          <span className={r.passed ? "text-emerald-400" : "text-rose-400"}>
                            {r.passed ? "✅" : "❌"}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 text-right">
                          <div>{r.time ? `${r.time}s` : ""}</div>
                          <div>{r.memory ? `${r.memory} KB` : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(resultsArr?.[0]?.compile_output || resultsArr?.[0]?.stderr) && (
                    <div className="mt-3 bg-black/30 border border-rose-700 rounded-xl p-3 text-xs whitespace-pre-wrap">
                      {resultsArr?.[0]?.compile_output || resultsArr?.[0]?.stderr}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}