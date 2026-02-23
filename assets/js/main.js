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
})();
