const express = require("express");
const app     = express();
app.use(express.json());

// ⚙️ SOZLAMALAR
const BOT_TOKEN = "8774881445:AAGpOsMfKz_rNSyGHEbg65tL5l8Ge0L8JNQ"; 
const CHAT_ID   = "-1003993068653";   
const SECRET    = "farai"; 

const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// 🛡️ Takrorlanishni oldini olish uchun xotira
let lastSignal = null;

// 📨 Telegram ga xabar yuborish
async function sendTelegram(text) {
    try {
        const res = await fetch(TELEGRAM_URL, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id:    CHAT_ID,
                text:       text,
                parse_mode: "HTML",
            }),
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Fetch xato:", e);
    }
}

// 🎨 Xabar formatlash
function formatMessage(d) {
    const isBuy    = d.signal === "BUY";
    const emoji    = isBuy ? "💎" : "☢️";
    const dir      = isBuy ? "BUY  📈" : "SELL 📉";
    const now      = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

    // Taymfreymni tekshirish (agar d.timeframe bo'sh bo'lsa, xato ko'rsatmaslik uchun)
    const tf = d.timeframe ? d.timeframe : "Aniqlanmagan";

    return (
        `${emoji} <b>PRO CAPITAL — ${dir}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 Juftlik:   <b>${d.symbol || "XAUUSD"}</b>\n` +
        `⏰ Taymfreym: <b>${tf}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 Narx:  <b>${d.price}</b>\n` +
        `🛑 SL:    <b>${d.sl}</b>\n` +
        `🎯 TP:    <b>${d.tp}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 Lot:      <b>${d.lot || "0.01"}</b>\n` +
        `⚠️ Risk:     <b>$${d.risk_usd || "0"}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🕐 <i>${now} (Toshkent)</i>\n` +
        `@sliv_signal_robot `
    );
}

// 🌐 WEBHOOK ENDPOINT
app.post("/webhook", async (req, res) => {
    if (req.query.secret !== SECRET) {
        return res.status(403).json({ error: "Ruxsat yo’q" });
    }

    try {
        const body = req.body;

        if (body.signal) {
            // 🛑 Takrorlanishni tekshirish (Symbol va Narx orqali)
            const currentSignalKey = `${body.symbol}-${body.signal}-${body.price}`;
            
            if (lastSignal === currentSignalKey) {
                console.log("⚠️ Takroriy signal to'xtatildi.");
                return res.json({ ok: true, note: "Signal allaqachon yuborilgan" });
            }

            // Xabarni formatlash va yuborish
            const msg = formatMessage(body);
            await sendTelegram(msg);

            // Oxirgi signalni eslab qolish
            lastSignal = currentSignalKey;
            
            return res.json({ ok: true });
        }

        res.json({ ok: true, note: "Signal formati noto'g'ri" });
    } catch (err) {
        console.error("❌ Server xato:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("🤖 PRO CAPITAL Webhook Server ishlamoqda ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server ishga tushdi: PORT ${PORT}`);
});
