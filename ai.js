// Vercel 서버 함수: 브라우저 대신 여기서 Claude API를 호출합니다.
// API 키는 코드에 넣지 말고 Vercel 환경변수 ANTHROPIC_API_KEY 에 넣으세요.
const MODEL = process.env.CLAUDE_MODEL || "claude-haiku-5-5";
const MAX_PROMPT = 12000; // 너무 긴 요청 차단 (비용 보호)

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: "API 키가 설정되지 않았어요" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const prompt = body && body.prompt;
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > MAX_PROMPT)
    return res.status(400).json({ error: "잘못된 요청" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, messages: [{ role: "user", content: prompt }] })
    });
    if (!r.ok) return res.status(502).json({ error: "AI 호출 실패", status: r.status });
    const j = await r.json();
    const text = (j.content || []).map(c => c.text || "").join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return res.status(502).json({ error: "응답 형식 오류" });
    return res.status(200).json({ data: JSON.parse(m[0]) });
  } catch (e) {
    return res.status(500).json({ error: "서버 오류" });
  }
};
