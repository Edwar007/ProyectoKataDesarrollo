document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("onboardingModal");
  const closeModalBtn = document.getElementById("closeModal");

  // Cierra el modal al hacer clic en el botón "×"
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cierra el modal si se hace clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,listWeek",
    },
    events: await fetchEvents(),
    eventClick: async function (info) {
      const ob = info.event.extendedProps;

      // Mostrar datos
      document.getElementById("detalleNombre").textContent = info.event.title;
      document.getElementById("detalleCategoria").textContent = ob.categoria;
      document.getElementById("detalleSesiones").textContent = ob.numSesiones;
      document.getElementById("detalleEstado").textContent = ob.estado;

      document.getElementById("detalleHora").textContent = `${formatHour(
        info.event.start
      )} - ${formatHour(info.event.end)}`;

      // Cargar colaboradores
      const lista = document.getElementById("detalleColaboradores");
      lista.innerHTML = "<li>Cargando...</li>";

      try {
        const res = await fetch(
          `http://localhost:8080/dashboard/onbording/${ob.id}/collaborators`
        );
        const data = await res.json();

        if (data.length === 0) {
          lista.innerHTML = "<li>No hay colaboradores asignados.</li>";
        } else {
          lista.innerHTML = data
            .map((c) => `<li><strong>${c.nombre}</strong> - ${c.correo}</li>`)
            .join("");
        }
      } catch (e) {
        console.error(e);
        lista.innerHTML = "<li>Error al cargar colaboradores</li>";
      }

      // Mostrar modal
      modal.style.display = "block";
    },
  });

  calendar.render();
});

function formatHour(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchEvents() {
  try {
    const res = await fetch("http://localhost:8080/onbording");
    const onboardings = await res.json();

    const events = [];

    onboardings.forEach((ob) => {
      const startDate = new Date(ob.fecIni);
      const horaIni = ob.horaInicio;
      const horaFin = ob.horaFin;
      const sesiones = ob.numSesiones;

      let sesionesGeneradas = 0;
      let currentDate = new Date(startDate);

      while (sesionesGeneradas < sesiones) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) {
          const dateStr = currentDate.toISOString().split("T")[0];

          events.push({
            title: ob.nombre,
            start: `${dateStr}T${horaIni}`,
            end: `${dateStr}T${horaFin}`,
            extendedProps: {
              id: ob.id,
              categoria: ob.categoria.nombre,
              estado: ob.estado,
              numSesiones: ob.numSesiones,
            },
            backgroundColor: getColorByEstado(ob.estado),
            borderColor: "#000",
          });

          sesionesGeneradas++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return events;
  } catch (err) {
    console.error("Error cargando eventos:", err);
    return [];
  }
}

function getColorByEstado(estado) {
  switch (estado) {
    case "REALIZADO":
      return "#66bb6a";
    case "CANCELADO":
      return "#ef5350";
    case "PENDIENTE":
    default:
      return "#42a5f5";
  }
}
