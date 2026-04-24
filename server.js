const express = require(“express”);
const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || “8774881445:AAGpOsMfKz_rNSyGHEbg65tL5l8Ge0L8JNQ”;
const CHAT_ID = process.env.CHAT_ID || “-1003993068653”;
const SECRET = process.env.SECRET || “farai”;
const TG_URL = “https://api.telegram.org/bot” + BOT_TOKEN + “/sendMessage”;

async function sendTG(text) {
const res = await fetch(TG_URL, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: “HTML” })
});
const data = await res.json();
if (!data.ok) {
console.error(“TG xato:”, data.description);
}
}

function format(d) {
var buy = d.signal === “BUY”;
var time = new Date().toLocaleString(“uz-UZ”, { timeZone: “Asia/Tashkent” });
var icon = buy ? “BUY” : “SELL”;
return “<b>TITAN AI V5 - “ + icon + “</b>\n” +
“Juftlik: <b>” + d.symbol + “</b>\n” +
“Vaqt: <b>” + d.tf + “ min</b>\n” +
“Narx: <b>” + d.price + “</b>\n” +
“SL: <b>” + d.sl + “</b> (” + d.sldist + “ pt)\n” +
“TP: <b>” + d.tp + “</b>\n” +
“Lot: <b>” + d.lot + “</b>\n” +
“Risk: <b>$” + d.risk + “</b>\n” +
“<i>” + time + “</i>”;
}

app.post(”/webhook”, async function(req, res) {
if (req.query.secret !== SECRET) {
return res.status(403).json({ error: “Ruxsat yoq” });
}
try {
var body = req.body;
console.log(“Signal keldi:”, JSON.stringify(body));
if (body && body.signal) {
await sendTG(format(body));
}
res.json({ ok: true });
} catch (e) {
console.error(“Xato:”, e.message);
res.status(500).json({ error: e.message });
}
});

app.get(”/”, function(req, res) {
res.send(“TITAN V5 Server ishlayapti”);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
console.log(“Server ishlayapti port: “ + PORT);
});
