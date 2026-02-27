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

  // Inject WhatsApp Floating Button
  const waNumber = (window.SITE_CONFIG && window.SITE_CONFIG.whatsappBusiness) ? window.SITE_CONFIG.whatsappBusiness : "https://wa.me/573505828278";
  const waMessage = encodeURIComponent("Hola, Dra. Maribel Peña Duran. Me interesa agendar una sesión de [Individual / Pareja / Obesidad / Certificado]. Mi nombre es [Nombre del paciente].");
  const waUrl = `${waNumber}?text=${waMessage}`;

  const waBtn = document.createElement('a');
  waBtn.href = waUrl;
  waBtn.className = 'whatsapp-float';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.112.551 4.174 1.597 5.989L.1 23.901l6.02-1.579c1.745.968 3.738 1.481 5.861 1.481h.005c6.643 0 12.031-5.385 12.031-12.031S18.674 0 12.031 0zm0 21.802h-.004c-1.785 0-3.535-.48-5.068-1.388l-.363-.215-3.765.986.999-3.672-.236-.375c-.997-1.583-1.523-3.417-1.523-5.32 0-5.545 4.513-10.059 10.059-10.059 2.686 0 5.211 1.047 7.108 2.945A10.016 10.016 0 0122.09 12.03c0 5.546-4.513 10.06-10.059 10.06v-.006zm5.551-7.587c-.304-.152-1.798-.887-2.076-.988-.278-.101-.481-.152-.684.152-.203.304-.785.988-.962 1.19-.177.203-.354.228-.658.076-.304-.152-1.283-.473-2.443-1.51-1.018-.91-1.706-2.035-1.884-2.339-.177-.304-.019-.468.133-.62.137-.137.304-.355.456-.532.152-.177.203-.304.304-.506.101-.203.051-.38-.025-.532-.076-.152-.684-1.649-.937-2.257-.247-.594-.497-.514-.684-.524-.177-.008-.38-.008-.582-.008s-.532.076-.81.38c-.278.304-1.063 1.039-1.063 2.533s1.089 2.938 1.24 3.141c.152.203 2.144 3.272 5.195 4.588.726.314 1.291.502 1.733.642.729.231 1.393.198 1.916.12.585-.088 1.798-.735 2.051-1.444.253-.709.253-1.317.177-1.444-.076-.127-.279-.203-.583-.355z"/></svg>
    Agendar mi valoración por WhatsApp
  `;
  document.body.appendChild(waBtn);
})();
