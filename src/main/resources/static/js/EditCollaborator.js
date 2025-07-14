
//Editar colaborador

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const editForm = document.getElementById("edit-form");
  const messageDiv = document.getElementById("editMessage");

  const inputEmailSearch = document.getElementById("searchEmail");
  const inputName = document.getElementById("editName");
  const inputEmail = document.getElementById("editEmail");
  const inputDate = document.getElementById("editStartDate");

  const updateBtn = document.getElementById("updateBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  let collaboratorId = null;

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = inputEmailSearch.value.trim();

    try {
      const response = await fetch(
        `http://localhost:8080/collaborator/correo/${email}`
      );

      if (!response.ok) {
        const error = await response.json();
        showMessage(error.correo || "No se encontró el colaborador.", "error");
        editForm.style.display = "none";
        return;
      }

      const data = await response.json();

      collaboratorId = data.id;
      inputName.value = data.nombre;
      inputEmail.value = data.correo;
      inputDate.value = data.fecIng;

      editForm.style.display = "block";
      showMessage(
        "Colaborador encontrado. Puedes editarlo o eliminarlo.",
        "success"
      );
    } catch (err) {
      console.error(err);
      showMessage("Ocurrió un error al buscar el colaborador.", "error");
    }
  });

  updateBtn.addEventListener("click", async () => {
    const updated = {
      nombre: inputName.value.trim(),
      correo: inputEmail.value.trim(),
      fecIng: inputDate.value,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/collaborator/${collaboratorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        showValidationErrors(error);
        return;
      }

      showMessage("Colaborador actualizado correctamente.", "success");
    } catch (err) {
      console.error(err);
      showMessage("Ocurrió un error al actualizar.", "error");
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar este colaborador?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/collaborator/${collaboratorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        showMessage(error.message || "No se pudo eliminar.", "error");
        return;
      }

      showMessage("Colaborador eliminado correctamente.", "success");
      editForm.style.display = "none";
      searchForm.reset();
    } catch (err) {
      console.error(err);
      showMessage("Ocurrió un error al eliminar.", "error");
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.color = type === "error" ? "red" : "green";
  }

  function showValidationErrors(errors) {
    if (typeof errors === "object" && !Array.isArray(errors)) {
      const messages = Object.values(errors).join(" ");
      showMessage(messages, "error");
    } else {
      showMessage("Ocurrió un error de validación.", "error");
    }
  }
});
