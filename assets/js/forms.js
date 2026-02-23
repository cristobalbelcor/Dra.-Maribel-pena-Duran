(function () {
  function setMessage(form, success) {
    const banner = form.querySelector("[data-success]");
    if (!banner) {
      return;
    }
    banner.classList.toggle("show", Boolean(success));
  }

  function clearErrors(form) {
    form.querySelectorAll("[data-error]").forEach((el) => el.classList.remove("show"));
  }

  function showError(form, name) {
    const target = form.querySelector(`[data-error="${name}"]`);
    if (target) {
      target.classList.add("show");
    }
  }

  function getFields(form) {
    const data = {};
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      if (field.type === "checkbox") {
        data[field.name] = field.checked;
      } else {
        data[field.name] = field.value.trim();
      }
    });
    return data;
  }

  function saveLocal(key, payload) {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ ...payload, submittedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      setMessage(form, false);

      const requiredFields = (form.getAttribute("data-required") || "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = getFields(form);
      let valid = true;

      requiredFields.forEach((name) => {
        const value = payload[name];
        if (value === "" || value === false || value === undefined) {
          valid = false;
          showError(form, name);
        }
      });

      if (!valid) {
        return;
      }

      const key = form.getAttribute("data-storage") || "dra-maribel-forms";
      saveLocal(key, payload);
      form.reset();
      setMessage(form, true);
    });
  });
})();
