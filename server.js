// ═══════════════════════════════════════════════════════════════
// 🤖 TITAN AI V5 — TELEGRAM WEBHOOK SERVER
// TradingView Alert → Bu server → Telegram Bot
//
// FAQAT SHU YERGA BOT TOKEN YOZILADI (Pine Script ga emas!)
// ═══════════════════════════════════════════════════════════════

const express = require(“express”);
const app = express();
app.use(express.json());

// ───────────────────────────────────────────────
// ⚙️ BU YERNI O’ZGARTIRING
// ───────────────────────────────────────────────
const BOT_TOKEN = “8774881445:AAGpOsMfKz_rNSyGHEbg65tL5l8Ge0L8JNQ”;  // @BotFather dan
const CHAT_ID   = “-1003993068653”;                               // @userinfobot dan
const SECRET    = “farai”;                                    // o’zingiz xohlagan so’z

const TG_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// ───────────────────────────────────────────────
// 📨 Telegram ga yuborish
// ───────────────────────────────────────────────
async function sendTG(text) {
try {
const res = await fetch(TG_URL, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: “HTML” })
});
const data = await res.json();
if (!data.ok) console.error(“TG xato:”, data.description);
return data;
} catch (e) {
console.error(“Fetch xato:”, e.message);
}
}

// ───────────────────────────────────────────────
// 🎨 Telegram xabari formati
// ───────────────────────────────────────────────
function format(d) {
const buy  = d.signal === “BUY”;
const time = new Date().toLocaleString(“uz-UZ”, { timeZone: “Asia/Tashkent” });

```
return `${buy ? "💎" : "☢️"} <b>TITAN AI V5 — ${d.signal}</b>
```

━━━━━━━━━━━━━━━━━━━
📊 Juftlik:  <b>${d.symbol}</b>
⏰ Vaqt:     <b>${d.tf} min</b>
━━━━━━━━━━━━━━━━━━━
💰 Narx:  <b>${d.price}</b>
🛑 SL:    <b>${d.sl}</b>  (${d.sldist} pt)
🎯 TP:    <b>${d.tp}</b>
━━━━━━━━━━━━━━━━━━━
📦 Lot:      <b>${d.lot}</b>
⚠️ Risk:     <b>$${d.risk}</b>
━━━━━━━━━━━━━━━━━━━
🕐 <i>${time}</i>`;
}

// ───────────────────────────────────────────────
// 🌐 WEBHOOK — TradingView bu yerga POST yuboradi
// URL: https://SIZNING-DOMEN.com/webhook?secret=titan2025
// ───────────────────────────────────────────────
app.post(”/webhook”, async (req, res) => {
if (req.query.secret !== SECRET) {
return res.status(403).json({ error: “Ruxsat yo’q” });
}

```
const body = req.body;
console.log("📥 Signal:", JSON.stringify(body));

if (body && body.signal) {
    const msg = format(body);
    await sendTG(msg);
    return res.json({ ok: true, signal: body.signal });
}

res.json({ ok: true });
```

});

// Health check
app.get(”/”, (_, res) => res.send(“🤖 TITAN V5 Server ishlayapti ✅”));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`✅ Server: http://localhost:${PORT}`);
console.log(`📡 Webhook: http://localhost:${PORT}/webhook?secret=${SECRET}`);
});
