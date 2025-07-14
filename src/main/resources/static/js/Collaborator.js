document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("collaborator-form");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const collaborator = {
      nombre: form.name.value.trim(),
      correo: form.email.value.trim(),
      fecIng: form.startDate.value,
    };

    if (!collaborator.nombre || !collaborator.correo || !collaborator.fecIng) {
      showMessage("Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/collaborator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collaborator),
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleValidationErrors(errorData);
        return;
      }

      const data = await response.json();
      showMessage("Colaborador registrado con éxito.", "success");
      form.reset();
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error al registrar el colaborador.", "error");
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.color = type === "error" ? "red" : "green";
  }

  function handleValidationErrors(errors) {
    if (typeof errors === "object" && !Array.isArray(errors)) {
      const messages = Object.values(errors).join(" ");
      showMessage(messages, "error");
    } else {
      showMessage("Ocurrió un error de validación.", "error");
    }
  }
});
