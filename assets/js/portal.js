(function () {
  const state = {
    user: null,
    users: JSON.parse(localStorage.getItem("dra-maribel-users") || "[]")
  };

  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");
  const authBlock = document.querySelector("#auth-block");
  const dashboard = document.querySelector("#dashboard");
  const userNameSlot = document.querySelector("[data-user-name]");
  const logoutBtn = document.querySelector("#logout-btn");

  const tabs = document.querySelectorAll(".portal-tab");
  const panels = document.querySelectorAll(".portal-content");

  function saveUsers() {
    localStorage.setItem("dra-maribel-users", JSON.stringify(state.users));
  }

  function loadSession() {
    const session = localStorage.getItem("dra-maribel-session");
    if (!session) {
      return;
    }
    const parsed = JSON.parse(session);
    const found = state.users.find((u) => u.email === parsed.email);
    if (found) {
      state.user = found;
    }
  }

  function saveSession(user) {
    localStorage.setItem("dra-maribel-session", JSON.stringify({ email: user.email }));
  }

  function clearSession() {
    localStorage.removeItem("dra-maribel-session");
  }

  function switchTab(targetId) {
    tabs.forEach((tab) => {
      const selected = tab.getAttribute("data-target") === targetId;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  }

  function render() {
    const isLogged = Boolean(state.user);
    if (authBlock) {
      authBlock.style.display = isLogged ? "none" : "grid";
    }
    if (dashboard) {
      dashboard.style.display = isLogged ? "grid" : "none";
    }
    if (userNameSlot && state.user) {
      userNameSlot.textContent = state.user.name;
    }
    if (isLogged) {
      switchTab("panel-citas");
    }
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = registerForm.querySelector("[name='name']").value.trim();
      const email = registerForm.querySelector("[name='email']").value.trim().toLowerCase();
      const password = registerForm.querySelector("[name='password']").value;

      const error = registerForm.querySelector("[data-error='register']");
      if (error) {
        error.classList.remove("show");
      }

      if (!name || !email || !password) {
        if (error) {
          error.textContent = "Completa nombre, correo y contraseña.";
          error.classList.add("show");
        }
        return;
      }

      if (state.users.some((u) => u.email === email)) {
        if (error) {
          error.textContent = "Ese correo ya está registrado.";
          error.classList.add("show");
        }
        return;
      }

      const user = { name, email, password };
      state.users.push(user);
      saveUsers();
      state.user = user;
      saveSession(user);
      registerForm.reset();
      render();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = loginForm.querySelector("[name='email']").value.trim().toLowerCase();
      const password = loginForm.querySelector("[name='password']").value;

      const error = loginForm.querySelector("[data-error='login']");
      if (error) {
        error.classList.remove("show");
      }

      const user = state.users.find((u) => u.email === email && u.password === password);
      if (!user) {
        if (error) {
          error.textContent = "Credenciales no válidas.";
          error.classList.add("show");
        }
        return;
      }

      state.user = user;
      saveSession(user);
      loginForm.reset();
      render();
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.getAttribute("data-target"));
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      state.user = null;
      clearSession();
      render();
    });
  }

  loadSession();
  render();
})();
