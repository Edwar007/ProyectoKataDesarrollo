document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onboarding-form");
  const messageDiv = document.getElementById("onboardingMessage");
  const categorySelect = document.getElementById("category");

  // 🔽 1. Cargar categorías dinámicamente
  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:8080/category");
      const categories = await response.json();

      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        categorySelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando categorías:", err);
      showMessage("Error al cargar categorías.", "error");
    }
  }

  loadCategories();

  // 📨 2. Enviar formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const onboarding = {
      nombre: form.title.value.trim(),
      fecIni: form.startDate.value,
      numSesiones: parseInt(form.sessions.value),
      horaInicio: form.startTime.value,
      horaFin: form.endTime.value,
      categoria: {
        id: parseInt(form.category.value),
      },
    };

    // Validación básica en el front
    if (!onboarding.nombre || !onboarding.fecIni || !onboarding.numSesiones ||
        !onboarding.horaInicio || !onboarding.horaFin || !onboarding.categoria.id) {
      showMessage("Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/onbording", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboarding),
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleValidationErrors(errorData);
        return;
      }

      showMessage("Onboarding creado con éxito.", "success");
      form.reset();
    } catch (err) {
      console.error(err);
      showMessage("Ocurrió un error al guardar el onboarding.", "error");
    }
  });

  // ✏️ Función para mostrar mensajes de éxito o error
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.color = type === "error" ? "red" : "green";
  }

  // ✏️ Mostrar errores detallados si vienen en JSON
  function handleValidationErrors(errors) {
    if (typeof errors === "object" && !Array.isArray(errors)) {
      const messages = Object.values(errors).join(" ");
      showMessage(messages, "error");
    } else if (typeof errors === "string") {
      // Por ejemplo: "La fecha de inicio no puede ser sábado ni domingo"
      showMessage(errors, "error");
    } else {
      showMessage("Ocurrió un error de validación.", "error");
    }
  }
});
