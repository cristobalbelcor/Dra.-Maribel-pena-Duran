(function () {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(nav.classList.contains("open")));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  const normalizedCurrent = current.startsWith("articulo-") ? "blog.html" : current;
  document.querySelectorAll("[data-page]").forEach((link) => {
    const page = link.getAttribute("data-page");
    if (page === normalizedCurrent) {
      link.classList.add("active");
    }
  });

  const links = window.SITE_CONFIG || {};
  document.querySelectorAll("[data-link]").forEach((anchor) => {
    const key = anchor.getAttribute("data-link");
    const url = links[key];
    if (url) {
      anchor.setAttribute("href", url);
    }
  });

  function isWhatsAppUrl(url) {
    return /wa\.me|api\.whatsapp\.com/i.test(url || "");
  }

  function cleanText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function getStoredContactName() {
    try {
      const key = "dra-maribel-wa-contact-name";
      const savedName = cleanText(localStorage.getItem(key));
      if (savedName) {
        return savedName;
      }

      const formStores = ["dra-maribel-contactos", "dra-maribel-admision", "dra-maribel-forms"];
      for (const storeKey of formStores) {
        const rows = JSON.parse(localStorage.getItem(storeKey) || "[]");
        if (!Array.isArray(rows)) {
          continue;
        }
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          const name = cleanText(rows[i] && rows[i].name);
          if (name) {
            localStorage.setItem(key, name);
            return name;
          }
        }
      }
    } catch (_error) {
      return "";
    }
    return "";
  }

  function resolveService(anchor) {
    const explicit = cleanText(anchor.getAttribute("data-wa-service"));
    if (explicit) {
      return explicit;
    }

    const formService = document.querySelector("#service");
    if (formService && cleanText(formService.value)) {
      return cleanText(formService.value);
    }

    const scope = anchor.closest(".pricing-card, .blog-card, .card, .cta-band, .hero-copy, article, section");
    if (scope) {
      const heading = scope.querySelector("h3, h2, h1");
      if (heading) {
        return cleanText(heading.textContent);
      }
    }

    const label = cleanText(anchor.textContent).toLowerCase();
    if (label.includes("pareja")) {
      return "Terapia de pareja";
    }
    if (label.includes("guía") || label.includes("pdf")) {
      return "Guía PDF de respiración";
    }
    if (label.includes("agendar") || label.includes("reservar") || label.includes("valoración") || label.includes("llamada")) {
      return "Valoración inicial";
    }
    return "Valoración inicial";
  }

  function attachWhatsAppMessage(anchor) {
    if (!anchor || anchor.dataset.waBound === "1") {
      return;
    }

    const href = anchor.getAttribute("href") || "";
    if (!isWhatsAppUrl(href)) {
      return;
    }

    anchor.dataset.waBound = "1";
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");

    anchor.addEventListener("click", (event) => {
      event.preventDefault();

      let contactName = getStoredContactName();
      if (!contactName) {
        contactName = cleanText(window.prompt("Escribe tu nombre para enviar el mensaje por WhatsApp:"));
      }

      if (!contactName) {
        return;
      }

      try {
        localStorage.setItem("dra-maribel-wa-contact-name", contactName);
      } catch (_error) {
        // no-op
      }

      const service = resolveService(anchor);
      const message = `Hola, Maribel Peña Duran. Mi nombre es ${contactName} y estoy interesado(a) en el servicio "${service}".`;
      const separator = href.includes("?") ? "&" : "?";
      const waUrl = `${href}${separator}text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  document.querySelectorAll("a").forEach((anchor) => {
    attachWhatsAppMessage(anchor);
  });

  function applyContactContext() {
    const form = document.querySelector('form[data-storage="dra-maribel-contactos"]');
    if (!form) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const topic = cleanText(params.get("topic"));
    const contexts = {
      empezar_terapia: {
        title: "Orientación inicial: ¿Cuándo es momento de empezar terapia?",
        body: "Si sientes que llevas semanas o meses con ansiedad persistente, irritabilidad, agotamiento emocional, dificultades para dormir o conflictos repetitivos en tus relaciones, no necesitas esperar a estar en crisis para pedir ayuda. Como psicóloga clínica, te recomiendo iniciar terapia cuando el malestar ya está afectando tu bienestar, tu trabajo o tu vida personal. En consulta te ayudo a identificar patrones de pensamiento y conducta, construir herramientas concretas y definir un plan claro de intervención para recuperar equilibrio emocional.",
        service: "Consulta Individual",
        message: "Quiero orientación sobre cuándo empezar terapia. He notado señales emocionales persistentes y deseo una valoración clínica inicial para definir el mejor plan de trabajo."
      }
    };

    const context = contexts[topic];
    if (!context) {
      return;
    }

    const contextBox = document.getElementById("contact-context");
    const contextTitle = document.getElementById("contact-context-title");
    const contextBody = document.getElementById("contact-context-body");
    if (contextBox && contextTitle && contextBody) {
      contextTitle.textContent = context.title;
      contextBody.textContent = context.body;
      contextBox.hidden = false;
    }

    const serviceField = document.getElementById("service");
    if (serviceField && !cleanText(serviceField.value)) {
      serviceField.value = context.service;
    }

    const messageField = document.getElementById("message");
    if (messageField && !cleanText(messageField.value)) {
      messageField.value = context.message;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
  applyContactContext();

  // Inject WhatsApp Floating Button
  const waNumber = (window.SITE_CONFIG && window.SITE_CONFIG.whatsappBusiness) ? window.SITE_CONFIG.whatsappBusiness : "https://wa.me/573505828278";

  const waBtn = document.createElement('a');
  waBtn.href = waNumber;
  waBtn.setAttribute("data-wa-service", "Valoración inicial");
  waBtn.className = 'whatsapp-float';
  waBtn.setAttribute("aria-label", "Contactar por WhatsApp");
  waBtn.setAttribute("title", "Contactar por WhatsApp");
  // Defensive inline styles in case a cached stylesheet is served.
  waBtn.style.position = "fixed";
  waBtn.style.bottom = "20px";
  waBtn.style.right = "20px";
  waBtn.style.width = "56px";
  waBtn.style.height = "56px";
  waBtn.style.borderRadius = "50%";
  waBtn.style.display = "flex";
  waBtn.style.alignItems = "center";
  waBtn.style.justifyContent = "center";
  waBtn.style.backgroundColor = "#25d366";
  waBtn.style.color = "#ffffff";
  waBtn.style.zIndex = "9999";
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.112.551 4.174 1.597 5.989L.1 23.901l6.02-1.579c1.745.968 3.738 1.481 5.861 1.481h.005c6.643 0 12.031-5.385 12.031-12.031S18.674 0 12.031 0zm0 21.802h-.004c-1.785 0-3.535-.48-5.068-1.388l-.363-.215-3.765.986.999-3.672-.236-.375c-.997-1.583-1.523-3.417-1.523-5.32 0-5.545 4.513-10.059 10.059-10.059 2.686 0 5.211 1.047 7.108 2.945A10.016 10.016 0 0122.09 12.03c0 5.546-4.513 10.06-10.059 10.06v-.006zm5.551-7.587c-.304-.152-1.798-.887-2.076-.988-.278-.101-.481-.152-.684.152-.203.304-.785.988-.962 1.19-.177.203-.354.228-.658.076-.304-.152-1.283-.473-2.443-1.51-1.018-.91-1.706-2.035-1.884-2.339-.177-.304-.019-.468.133-.62.137-.137.304-.355.456-.532.152-.177.203-.304.304-.506.101-.203.051-.38-.025-.532-.076-.152-.684-1.649-.937-2.257-.247-.594-.497-.514-.684-.524-.177-.008-.38-.008-.582-.008s-.532.076-.81.38c-.278.304-1.063 1.039-1.063 2.533s1.089 2.938 1.24 3.141c.152.203 2.144 3.272 5.195 4.588.726.314 1.291.502 1.733.642.729.231 1.393.198 1.916.12.585-.088 1.798-.735 2.051-1.444.253-.709.253-1.317.177-1.444-.076-.127-.279-.203-.583-.355z"/></svg>
  `;
  document.body.appendChild(waBtn);
  const waIcon = waBtn.querySelector("svg");
  if (waIcon) {
    waIcon.style.width = "28px";
    waIcon.style.height = "28px";
    waIcon.style.fill = "currentColor";
  }
  attachWhatsAppMessage(waBtn);

  // Breathing sponsor button + modal (global)
  const breathBtn = document.createElement("button");
  breathBtn.type = "button";
  breathBtn.className = "sponsor-breath-btn";
  breathBtn.setAttribute("aria-label", "Abrir ejercicio de respiración");
  breathBtn.innerHTML = `
    <svg class="sponsor-heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0116.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/>
    </svg>
    <span>Respira</span>
  `;
  document.body.appendChild(breathBtn);

  const breathOverlay = document.createElement("div");
  breathOverlay.id = "breath-modal-overlay";
  breathOverlay.className = "breath-modal-overlay";
  breathOverlay.innerHTML = `
    <div class="breath-modal" role="dialog" aria-modal="true" aria-labelledby="breath-title">
      <button type="button" class="breath-close" data-breath-close aria-label="Cerrar">&times;</button>
      <div class="breath-head">
        <h3 class="breath-title" id="breath-title">Respiración 4-7-8</h3>
        <p class="breath-subtitle">Técnica breve para reducir ansiedad y recuperar foco</p>
      </div>
      <div class="breath-stage">
        <div class="breath-circle" data-breath-circle>
          <div class="breath-core"><span data-breath-count></span></div>
        </div>
      </div>
      <p class="breath-instruction" data-breath-instruction>¿Lista(o) para empezar?</p>
      <div class="breath-progress"><div class="breath-progress-bar" data-breath-progress></div></div>
      <div class="breath-actions">
        <button type="button" class="breath-toggle" data-breath-toggle>Iniciar respiración</button>
      </div>
      <p class="breath-note"><strong>Cómo funciona:</strong> Inhala por nariz 4 segundos, sostiene 7 segundos y exhala 8 segundos. Repite 3 ciclos.</p>
    </div>
  `;
  document.body.appendChild(breathOverlay);

  const breathCircle = breathOverlay.querySelector("[data-breath-circle]");
  const breathCount = breathOverlay.querySelector("[data-breath-count]");
  const breathInstruction = breathOverlay.querySelector("[data-breath-instruction]");
  const breathProgress = breathOverlay.querySelector("[data-breath-progress]");
  const breathToggle = breathOverlay.querySelector("[data-breath-toggle]");
  const breathClose = breathOverlay.querySelector("[data-breath-close]");

  let breathActive = false;
  let breathPhase = "inhale";
  let breathCountStep = 1;
  let breathCycles = 0;
  let breathTimer = null;
  const breathDurations = { inhale: 4, hold: 7, exhale: 8 };

  function openBreathModal() {
    breathOverlay.classList.add("active");
  }

  function stopBreathing(resetCycle = true) {
    breathActive = false;
    clearTimeout(breathTimer);
    if (resetCycle) {
      breathPhase = "inhale";
      breathCountStep = 1;
      breathCycles = 0;
    }
    breathCircle.className = "breath-circle";
    breathCount.textContent = "";
    breathInstruction.textContent = "¿Lista(o) para empezar?";
    breathProgress.style.width = "0%";
    breathToggle.textContent = "Iniciar respiración";
  }

  function closeBreathModal() {
    breathOverlay.classList.remove("active");
    stopBreathing();
  }

  function renderBreathPhase() {
    const phaseDuration = breathDurations[breathPhase];
    breathProgress.style.width = `${(breathCountStep / phaseDuration) * 100}%`;
    breathCount.textContent = String(breathCountStep);
    breathCircle.className = `breath-circle breath-${breathPhase}`;
    if (breathPhase === "inhale") {
      breathInstruction.textContent = "Inhala...";
    } else if (breathPhase === "hold") {
      breathInstruction.textContent = "Sostén...";
    } else {
      breathInstruction.textContent = "Exhala...";
    }
  }

  function runBreathing() {
    if (!breathActive) {
      return;
    }
    renderBreathPhase();

    if (breathCountStep < breathDurations[breathPhase]) {
      breathTimer = setTimeout(() => {
        breathCountStep += 1;
        runBreathing();
      }, 1000);
      return;
    }

    breathTimer = setTimeout(() => {
      breathCountStep = 1;
      if (breathPhase === "inhale") {
        breathPhase = "hold";
      } else if (breathPhase === "hold") {
        breathPhase = "exhale";
      } else {
        breathPhase = "inhale";
        breathCycles += 1;
      }

      if (breathCycles >= 3) {
        stopBreathing(false);
        breathInstruction.textContent = "Ejercicio completo. Respira con calma.";
        return;
      }
      runBreathing();
    }, 1000);
  }

  breathBtn.addEventListener("click", openBreathModal);
  breathClose.addEventListener("click", closeBreathModal);
  breathOverlay.addEventListener("click", (event) => {
    if (event.target === breathOverlay) {
      closeBreathModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && breathOverlay.classList.contains("active")) {
      closeBreathModal();
    }
  });

  breathToggle.addEventListener("click", () => {
    if (breathActive) {
      stopBreathing();
      return;
    }
    breathActive = true;
    breathPhase = "inhale";
    breathCountStep = 1;
    breathCycles = 0;
    breathToggle.textContent = "Detener ejercicio";
    runBreathing();
  });

  document.querySelectorAll("[data-open-breathing]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openBreathModal();
    });
  });
})();
