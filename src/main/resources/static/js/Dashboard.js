const correoSelect = document.getElementById("filterCorreo");
const categoriaSelect = document.getElementById("filterCategoria");
const onboardingSelect = document.getElementById("filterOnboarding");
const estadoSelect = document.getElementById("filterEstado");
const tbody = document.querySelector("#dashboardTable tbody");

let dashboardData = []; // para mantener la copia original

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:8080/dashboard");
    dashboardData = await res.json();

    llenarFiltros(dashboardData);
    renderTable(dashboardData);
  } catch (err) {
    console.error("Error cargando datos:", err);
  }

  // Asociar eventos
  correoSelect.addEventListener("change", aplicarFiltros);
  categoriaSelect.addEventListener("change", aplicarFiltros);
  onboardingSelect.addEventListener("change", aplicarFiltros);
  estadoSelect.addEventListener("change", aplicarFiltros);
});

function llenarFiltros(data) {
  const correos = new Set();
  const categorias = new Set();
  const onboardings = new Set();

  data.forEach((item) => {
    correos.add(item.collaborador.correo);
    categorias.add(item.onbording.categoria.nombre);
    onboardings.add(item.onbording.nombre); // o puedes usar el ID si prefieres
  });

  correos.forEach(
    (c) => (correoSelect.innerHTML += `<option value="${c}">${c}</option>`)
  );
  categorias.forEach(
    (c) => (categoriaSelect.innerHTML += `<option value="${c}">${c}</option>`)
  );
  onboardings.forEach(
    (o) => (onboardingSelect.innerHTML += `<option value="${o}">${o}</option>`)
  );
}

function aplicarFiltros() {
  const correo = correoSelect.value;
  const categoria = categoriaSelect.value;
  const onboarding = onboardingSelect.value;
  const estado = estadoSelect.value;

  const filtrado = dashboardData.filter((item) => {
    return (
      (!correo || item.collaborador.correo === correo) &&
      (!categoria || item.onbording.categoria.nombre === categoria) &&
      (!onboarding || item.onbording.nombre === onboarding) &&
      (!estado || item.onbording.estado === estado)
    );
  });

  renderTable(filtrado);
}

function renderTable(data) {
  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.collaborador.nombre}</td>
      <td>${item.collaborador.correo}</td>
      <td>${item.onbording.categoria.nombre}</td>
      <td>${item.onbording.nombre}</td>
      <td>${item.onbording.estado}</td>
      <td>${item.onbording.fecIni}</td>
      <td>${item.onbording.numSesiones}</td>
      <td>
        <input 
          type="checkbox" 
          ${item.estado ? "checked" : ""} 
          data-id="${item.id}"
          data-colaborador="${item.collaborador.id}"
          data-onbording="${item.onbording.id}"
        />
      </td>
    </tr>
  `).join('');

  // Agrega listeners a los checkboxes después de renderizar
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const checked = e.target.checked;
      const dashboardId = e.target.dataset.id;
      const colaboradorId = e.target.dataset.colaborador;
      const onbordingId = e.target.dataset.onbording;

      try {
        await fetch(`http://localhost:8080/dashboard/${dashboardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: checked,
            collaborador: { id: parseInt(colaboradorId) },
            onbording: { id: parseInt(onbordingId) }
          })
        });
      } catch (error) {
        console.error("Error al actualizar asistencia:", error);
        e.target.checked = !checked; // revertir en caso de error
      }
    });
  });
}

