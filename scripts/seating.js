const room = document.getElementById("room");
const amountInput = document.getElementById("amount");
const confirmBtn = document.getElementById("confirm");

const UNIT = 60;
const MAX_TOTAL_SEATS = 10;

const tables = [
  { id: "T1", x: 1, y: 1, w: 3, h: 1, seats: 6 },
  { id: "T2", x: 5, y: 1, w: 3, h: 1, seats: 8 },
  { id: "T3", x: 1, y: 3, w: 1, h: 3, seats: 4 },
  { id: "T4", x: 3, y: 3, w: 1, h: 3, seats: 4 },
  { id: "T5", x: 5, y: 3, w: 1, h: 3, seats: 4 },
  { id: "T6", x: 7, y: 3, w: 1, h: 3, seats: 4 }
];

let activeTableEl = null;

/* =========================
   Helpers
========================= */
function getTotalSelectedSeats() {
  return [...document.querySelectorAll(".table")]
    .reduce((sum, el) => sum + Number(el.dataset.selectedSeats), 0);
}

function updateTableLabel(el) {
  const used = Number(el.dataset.selectedSeats);
  const max = Number(el.dataset.maxSeats);

  el.textContent = used > 0
    ? `${el.dataset.id} (${used}/${max})`
    : `${el.dataset.id} (${max})`;

  if (used > 0) {
    el.classList.add("checked");
  } else {
    el.classList.remove("checked");
  }
}

/* =========================
   Table creation
========================= */
function createTable(table) {
  const el = document.createElement("div");
  el.className = "table";

  el.style.left = table.x * UNIT + "px";
  el.style.top = table.y * UNIT + "px";
  el.style.width = table.w * UNIT + "px";
  el.style.height = table.h * UNIT + "px";

  el.dataset.id = table.id;
  el.dataset.maxSeats = table.seats;
  el.dataset.selectedSeats = 0;

  updateTableLabel(el);

  el.addEventListener("click", () => activateTable(el));

  return el;
}

/* =========================
   Selection logic
========================= */
function activateTable(el) {
  // If clicked table is already active, deactivate it
  if (activeTableEl === el) {
    el.classList.remove("selected");
    el.dataset.selectedSeats = 0;
    updateTableLabel(el);
    activeTableEl = null;
    amountInput.value = "";
    return;
  }

  // Remove highlight from previous active table
  if (activeTableEl) {
    activeTableEl.classList.remove("selected");
  }

  // Check if max seats reached
  if (getTotalSelectedSeats() >= MAX_TOTAL_SEATS && Number(el.dataset.selectedSeats) === 0) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    return;
  }

  // Activate clicked table
  activeTableEl = el;
  el.classList.add("selected");

  const remainingSeats = MAX_TOTAL_SEATS - getTotalSelectedSeats() + Number(el.dataset.selectedSeats);
  amountInput.min = 1;
  amountInput.max = Math.min(el.dataset.maxSeats, remainingSeats);
  amountInput.value = el.dataset.selectedSeats || 1;

  if (el.dataset.selectedSeats === "0") {
    el.dataset.selectedSeats = 1;
    updateTableLabel(el);
  }
}



/* =========================
   Seat amount handling
========================= */
amountInput.addEventListener("input", () => {
  if (!activeTableEl) return;

  const current = Number(activeTableEl.dataset.selectedSeats);
  const next = Number(amountInput.value);
  const totalWithoutCurrent = getTotalSelectedSeats() - current;

  if (totalWithoutCurrent + next > MAX_TOTAL_SEATS) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    amountInput.value = current;
    return;
  }

  activeTableEl.dataset.selectedSeats = next;
  updateTableLabel(activeTableEl);
});

/* =========================
   Confirm
========================= */
confirmBtn.addEventListener("click", () => {
  const selectedTables = [...document.querySelectorAll(".table")]
    .filter(el => Number(el.dataset.selectedSeats) > 0);

  const totalSeats = getTotalSelectedSeats();

  if (totalSeats === 0) {
    alert("Please select at least one seat.");
    return;
  }

  console.log("Total seats:", totalSeats);

  selectedTables.forEach(el => {
    console.log(
      el.dataset.id,
      el.dataset.selectedSeats,
      "/",
      el.dataset.maxSeats
    );
  });
});

/* =========================
   Init
========================= */
tables.forEach(table => {
  room.appendChild(createTable(table));
});
