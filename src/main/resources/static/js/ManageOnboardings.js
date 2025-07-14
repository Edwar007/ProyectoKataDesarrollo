document.addEventListener("DOMContentLoaded", () => {
  const onboardingList = document.getElementById("onboardingList");
  const detailsSection = document.getElementById("onboardingDetails");

  const titleSpan = document.getElementById("onboardingTitle");
  const categorySpan = document.getElementById("categoryName");
  const nombreSpan = document.getElementById("nombre");
  const sesionesSpan = document.getElementById("numSesiones");
  const horaIniSpan = document.getElementById("horaInicio");
  const horaFinSpan = document.getElementById("horaFin");

  const inviteForm = document.getElementById("inviteForm");
  const emailInput = document.getElementById("collaboratorEmail");
  const messageDiv = document.getElementById("inviteMessage");

  const cancelBtn = document.getElementById("btnCancelar");
  const updateBtn = document.getElementById("btnActualizar");

  let currentOnboarding = null;

  async function loadOnboardings() {
    try {
      const response = await fetch("http://localhost:8080/onbording");
      const data = await response.json();

      const grouped = { PENDIENTE: [], REALIZADO: [], CANCELADO: [] };
      data.forEach((ob) => grouped[ob.estado]?.push(ob));

      ["PENDIENTE", "REALIZADO", "CANCELADO"].forEach((estado) => {
        grouped[estado].forEach((ob) => {
          const card = document.createElement("div");
          card.classList.add("onboarding-item", estado.toLowerCase());

          card.innerHTML = `
            <div class="badge">${estado}</div>
            <strong>${ob.nombre}</strong><br>
            <span>${ob.categoria.nombre}</span><br>
            <span>${ob.fecIni}</span><br>
            <small>${ob.horaInicio} - ${ob.horaFin}</small>
          `;

          card.addEventListener("click", () => showDetails(ob));
          onboardingList.appendChild(card);
        });
      });
    } catch (err) {
      console.error("Error cargando onboardings:", err);
    }
  }

  function showDetails(ob) {
    currentOnboarding = ob;

    titleSpan.textContent = `Detalle de: ${ob.nombre}`;
    categorySpan.textContent = ob.categoria.nombre;
    nombreSpan.textContent = ob.nombre;
    sesionesSpan.textContent = ob.numSesiones;
    horaIniSpan.textContent = ob.horaInicio;
    horaFinSpan.textContent = ob.horaFin;

    messageDiv.textContent = "";
    detailsSection.style.display = "block";

    loadCollaborators(ob.id);

    cancelBtn.onclick = async () => {
      if (!confirm("¿Estás seguro de cancelar este onboarding?")) return;

      try {
        const payload = {
          nombre: ob.nombre,
          fecIni: ob.fecIni,
          estado: "CANCELADO", // <- Solo este campo cambia
          numSesiones: ob.numSesiones,
          horaInicio: ob.horaInicio,
          horaFin: ob.horaFin,
          categoria: { id: ob.categoria.id },
        };

        const res = await fetch(`http://localhost:8080/onbording/${ob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Error al cancelar");
        }

        alert("Onboarding cancelado correctamente");
        location.reload(); // Refresca para reflejar el estado actualizado
      } catch (e) {
        console.error("Error al cancelar onboarding", e);
        alert("No se pudo cancelar el onboarding");
      }
    };

    updateBtn.onclick = () => {
      openUpdateModal(ob);
    };
  }

  inviteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!currentOnboarding?.id || !email) {
      showMessage("Debe ingresar un correo válido", "error");
      return;
    }

    try {
      const colabRes = await fetch(
        `http://localhost:8080/collaborator/correo/${email}`
      );
      if (!colabRes.ok) {
        const error = await colabRes.json();
        showMessage(error.correo || "Colaborador no encontrado", "error");
        return;
      }

      const colaborador = await colabRes.json();

      const response = await fetch("http://localhost:8080/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: false,
          collaborador: { id: colaborador.id },
          onbording: { id: currentOnboarding.id },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        showMessage(err.dashboard || "Error invitando", "error");
        return;
      }

      showMessage("Colaborador invitado con éxito", "success");
      inviteForm.reset();
      loadCollaborators(currentOnboarding.id);
    } catch (err) {
      console.error(err);
      showMessage("Error inesperado", "error");
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.color = type === "error" ? "red" : "green";
  }

  loadOnboardings();
});

async function loadCollaborators(onboardingId) {
  const container = document.getElementById("collaboratorsList");
  container.innerHTML = "<li>Cargando...</li>";

  try {
    const res = await fetch(
      `http://localhost:8080/dashboard/onbording/${onboardingId}/collaborators`
    );
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = "<li>No hay colaboradores asignados aún.</li>";
      return;
    }

    container.innerHTML = data
      .map(
        (c) => `
      <li class="collaborator-item">
        <strong>${c.nombre}</strong><br />
        <span class="email">${c.correo}</span>
      </li>
    `
      )
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<li>Sin participantes</li>";
  }
}

function openUpdateModal(ob) {
  const modal = document.getElementById("updateModal");
  const closeBtn = document.getElementById("closeUpdateModal");
  const updForm = document.getElementById("updateForm");
  const colaboradoresList = document.getElementById("updColaboradoresList");

  // Mostrar modal centrado
  modal.classList.add("show");

  // Rellenar inputs
  document.getElementById("updNombre").value = ob.nombre;
  document.getElementById("updFecIni").value = ob.fecIni;
  document.getElementById("updNumSesiones").value = ob.numSesiones;
  document.getElementById("updHoraInicio").value = ob.horaInicio;
  document.getElementById("updHoraFin").value = ob.horaFin;

  // Estado (desplegable)
  const estados = ["PENDIENTE", "CANCELADO", "REALIZADO"];
  const estadoSelect = document.getElementById("updEstado");
  estadoSelect.innerHTML = estados
    .map(
      (e) =>
        `<option value="${e}" ${
          e === ob.estado ? "selected" : ""
        }>${e}</option>`
    )
    .join("");

  // Cargar categorías dinámicamente
  const categoriaSelect = document.getElementById("updCategoria");
  fetch("http://localhost:8080/category")
    .then((res) => res.json())
    .then((categorias) => {
      categoriaSelect.innerHTML = categorias
        .map(
          (cat) => `<option value="${cat.id}" ${
            cat.id === ob.categoria.id ? "selected" : ""
          }>
            ${cat.nombre}
          </option>`
        )
        .join("");
    });

  // Cargar colaboradores
  colaboradoresList.innerHTML = "<li>Cargando...</li>";

  fetch(`http://localhost:8080/dashboard/onbording/${ob.id}/collaborators`)
    .then((res) => res.json())
    .then((data) => {
      colaboradoresList.innerHTML = "";

      data.forEach((colab) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <span>${colab.nombre} (${colab.correo})</span>
        <button class="delete-btn" data-id="${colab.dashboardId}">Quitar</button>
      `;
        colaboradoresList.appendChild(li);
      });

      // Agregamos eventos a cada botón de eliminar
      colaboradoresList.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const onboardingId = currentOnboarding.id;
          const collaboratorId = colab.id;
          console.log("Onboarding ID:", onboardingId);
          console.log("Collaborator ID:", collaboratorId);


          const res = await fetch(
            `http://localhost:8080/dashboard/onbording/${onboardingId}/collaborator/${collaboratorId}`
          );
          if (!res.ok) {
            alert("No se encontró la relación para eliminar");
            return;
          }
          const dashboardId = await res.json();

          // Ya puedes eliminar
          await fetch(`http://localhost:8080/dashboard/${dashboardId}`, {
            method: "DELETE",
          });
        });
      });
    })
    .catch((err) => {
      console.error("Error cargando colaboradores:", err);
      colaboradoresList.innerHTML = "<li>Error al cargar colaboradores</li>";
    });

  // Botón cerrar modal
  closeBtn.onclick = () => {
    modal.classList.remove("show");
  };

  // Submit del formulario
  updForm.onsubmit = async () => {
    const updated = {
      nombre: document.getElementById("updNombre").value,
      fecIni: document.getElementById("updFecIni").value,
      numSesiones: parseInt(document.getElementById("updNumSesiones").value),
      horaInicio: document.getElementById("updHoraInicio").value,
      horaFin: document.getElementById("updHoraFin").value,
      estado: estadoSelect.value,
      categoria: {
        id: parseInt(categoriaSelect.value),
      },
    };

    try {
      await fetch(`http://localhost:8080/onbording/${ob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      alert("Onboarding actualizado correctamente");
      modal.classList.remove("show");
      location.reload();
    } catch (err) {
      console.error("Error al actualizar onboarding", err);
      alert("Error al actualizar");
    }
  };
}
