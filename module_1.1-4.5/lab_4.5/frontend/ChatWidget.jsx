import { useEffect, useRef, useState } from "react";

const DEFAULT_API = "http://localhost:3000";

const shell = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 50,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const panel = {
  width: 360,
  maxHeight: 480,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const fab = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(79,70,229,0.45)",
  fontSize: 24,
  lineHeight: 1,
};

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Виджет чата: история диалога, SSE-стрим, сброс «Новый диалог».
 * @param {{ apiBase?: string }} props
 */
export default function ChatWidget({ apiBase = DEFAULT_API }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const historyForRequest = messages;
    const userMessage = { role: "user", content: text };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    let res;
    try {
      res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyForRequest,
        }),
      });
    } catch {
      setLoading(false);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && last.content === "")
          next[next.length - 1] = {
            role: "assistant",
            content:
              "Ошибка сети. Убедитесь, что прокси запущен (npm start в chat-backend) и адрес apiBase верный.",
          };
        return next;
      });
      return;
    }

    if (!res.ok || !res.body) {
      setLoading(false);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant")
          next[next.length - 1] = {
            role: "assistant",
            content: `Ошибка сервера (${res.status}).`,
          };
        return next;
      });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);

          const line = rawEvent.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;

          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            continue;
          }

          if (data.content) {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant") {
                next[next.length - 1] = {
                  ...last,
                  content: last.content + data.content,
                };
              }
              return next;
            });
          }

          if (data.error) {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant")
                next[next.length - 1] = {
                  role: "assistant",
                  content: last.content || `Ошибка: ${data.error}`,
                };
              return next;
            });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  return (
    <div style={shell}>
      {open && (
        <div
          id="chat-widget-panel"
          style={{ ...panel, marginBottom: 12 }}
          role="dialog"
          aria-label="Чат с ассистентом"
        >
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 600 }}>CodeHub Assistant</span>
            <button
              type="button"
              onClick={newChat}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
              aria-label="Начать новый диалог"
            >
              Новый диалог
            </button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 260,
              background: "#fafafa",
            }}
          >
            {messages.length === 0 && (
              <span style={{ color: "#6b7280", fontSize: 14 }}>Задайте вопрос ассистенту.</span>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && (
              <span style={{ fontSize: 12, color: "#6b7280" }} aria-live="polite">
                Ассистент печатает…
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #e5e7eb" }}>
            <input
              aria-label="Сообщение для ассистента"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Напишите сообщение…"
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Отправить сообщение"
              style={{
                padding: "0 16px",
                borderRadius: 8,
                border: "none",
                background: loading || !input.trim() ? "#9ca3af" : "#4f46e5",
                color: "#fff",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              Отпр.
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        style={fab}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? "chat-widget-panel" : undefined}
        aria-label={open ? "Закрыть чат" : "Открыть чат"}
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
        padding: "8px 12px",
        borderRadius: 12,
        background: isUser ? "#4f46e5" : "#fff",
        color: isUser ? "#fff" : "#111827",
        border: isUser ? "none" : "1px solid #e5e7eb",
        whiteSpace: "pre-wrap",
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <span style={srOnly}>{isUser ? "Пользователь: " : "Ассистент: "}</span>
      {content || "…"}
    </div>
  );
}
