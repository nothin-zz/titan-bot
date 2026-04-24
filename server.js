
const express = require("express");
const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8774881445:AAGpOsMfKz_rNSyGHEbg65tL5l8Ge0L8JNQ";
const CHAT_ID = process.env.CHAT_ID || "-1003993068653";
const SECRET = process.env.SECRET || "farai";
const TG_URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";

async function sendTG(text) {
    const res = await fetch(TG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "HTML" })
    });
    const d = await res.json();
    if (!d.ok) console.error("TG xato:", d.description);
}

function format(d) {
    var time = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
    return "<b>TITAN AI V5 - " + d.signal + "</b>
" +
        "Juftlik: <b>" + d.symbol + "</b>
" +
        "Vaqt: <b>" + d.tf + " min</b>
" +
        "Narx: <b>" + d.price + "</b>
" +
        "SL: <b>" + d.sl + "</b> (" + d.sldist + " pt)
" +
        "TP: <b>" + d.tp + "</b>
" +
        "Lot: <b>" + d.lot + "</b>
" +
        "Risk: <b>$" + d.risk + "</b>
" +
        "<i>" + time + "</i>";
}

app.post("/webhook", async function(req, res) {
    if (req.query.secret !== SECRET) {
        return res.status(403).json({ error: "Ruxsat yoq" });
    }
    try {
        var body = req.body;
        console.log("Signal:", JSON.stringify(body));
        if (body && body.signal) {
            await sendTG(format(body));
        }
        res.json({ ok: true });
    } catch (e) {
        console.error("Xato:", e.message);
        res.status(500).json({ error: e.message });
    }
});

app.get("/", function(req, res) {
    res.send("TITAN V5 ishlayapti");
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Port: " + PORT);
});
