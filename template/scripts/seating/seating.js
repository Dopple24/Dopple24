const roomApp = document.getElementById("room");
const amountInput = document.getElementById("amount");
const amountDisplay = document.getElementById("amount-current");
const amountDisplayMax = document.getElementById("amount-max");
const confirmBtn = document.getElementById("confirm");
const cartList = document.getElementById("cart-list");
const closePopUp = document.getElementById("notification-close");
const card = document.getElementById("notification-card");
const payBtn = document.getElementById("pay");
const emailInput = document.getElementById("email-input");
const emailVerification = document.getElementById("email-verification");
const standTickets = document.getElementById("stand-amount");
const sliderGroup = document.querySelector(".slider-group");

const amountInputStand = document.getElementById("stand-amount");
const amountDisplayStand = document.getElementById("stand-amount-current");
const amountDisplayMaxStand = document.getElementById("stand-amount-max");

const params = new URLSearchParams(window.location.search);

const roomPicker = document.getElementById("room-picker");

let event_id = params.get("id");

if (!event_id) {
  const storedEvent = localStorage.getItem("selectedEvent");

  if (storedEvent) {
    const event = JSON.parse(storedEvent);
    event_id = event.id;
  }
}

let email = "";
let email_ver = "";
let unit = 60;
let heightUnit = 60;
const MAX_TOTAL_SEATS = 10;

let roomWidthUnits = 2;
let roomHeightUnits = 2;

let rooms = [];
let tables = [];
let obstacles = [];
let activeRoom = 0;

let activeTableEl = null;

/* =========================
   Helpers
========================= */
function getTotalSelectedSeats() {
  const seatsFromTables = rooms.reduce((roomSum, room) => {
    const tableSum = room.tables
      .filter((table) => table.selectedSeats > 0)
      .reduce((sum, table) => sum + Number(table.selectedSeats), 0);

    return roomSum + tableSum;
  }, 0);

  return seatsFromTables + Number(standTickets.value);
}

function updateTableLabel(el) {
  if (el === null) {
    renderCart(true, 300);
    return;
  }
  let tableToUpdate = getTable(el.id);
  const used = Number(tableToUpdate.selectedSeats);
  const max = Number(tableToUpdate.seats);

  el.textContent =
    used > 0
      ? `${tableToUpdate.id} (${used}/${max})`
      : `${tableToUpdate.id} (${max})`;

  if (used > 0) {
    el.classList.add("checked");
  } else {
    el.classList.remove("checked");
  }

  renderCart(true, 300);
}

async function fetchSeats() {
  try {
    const response = await fetch(
      `http://localhost:6870/public/${event_id}/seats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return res.json();
    });
    return response;
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function init_tables() {
  const json = JSON.parse(await fetchSeats());
  roomPicker.innerHTML = "";
  activeRoom = 0;
  Object.values(json).forEach((room) => {
    tables = [];
    obstacles = [];
    let place = document.createElement("option");
    place.value = room.name;
    place.text = room.name;
    roomPicker.appendChild(place);

    // Convert object values to an array
    const tableArray = Object.values(room.tables);
    const obstacleArray = Object.values(room.obstacles);

    tableArray.forEach((table) => {
      if (Number(table.x) + Number(table.w) + 2 > roomWidthUnits) {
        roomWidthUnits = Number(table.x) + Number(table.w) + 2;
      }
      if (Number(table.y) + Number(table.h) + 2 > roomHeightUnits) {
        roomHeightUnits = Number(table.y) + Number(table.h) + 2;
      }
      tables.push({
        id: table.id,
        x: table.x,
        y: table.y,
        w: table.w,
        h: table.h,
        seats: table.seats - table.reserved_seats,
        selectedSeats: 0,
        price: table.price,
        room: room.name,
      });
    });

    obstacleArray.forEach((obstacle) => {
      if (Number(obstacle.x) + Number(obstacle.w) + 2 > roomWidthUnits) {
        roomWidthUnits = Number(obstacle.x) + Number(obstacle.w) + 2;
      }
      if (Number(obstacle.y) + Number(obstacle.h) + 2 > roomHeightUnits) {
        roomHeightUnits = Number(obstacle.y) + Number(obstacle.h) + 2;
      }
      obstacles.push({
        id: obstacle.id,
        x: obstacle.x,
        y: obstacle.y,
        w: obstacle.w,
        h: obstacle.h,
      });
    });
    unit = (roomApp.clientWidth || 700) / roomWidthUnits;
    heightUnit = (roomApp.clientHeight || 420) / roomHeightUnits;
    rooms.push({ name: room.name, tables: tables, obstacles: obstacles });
  });
}

/* =========================
   Table creation
========================= */
function createTable(table) {
  const el = document.createElement("div");
  el.className = "table";

  el.style.left = table.x * unit + "px";
  el.style.top = table.y * heightUnit + "px";
  el.style.width = table.w * unit + "px";
  el.style.height = table.h * heightUnit + "px";

  el.id = table.id;
  updateTableLabel(el);
  el.addEventListener("click", () => activateTable(el));

  return el;
}

function createObstacle(obstacle) {
  const el = document.createElement("div");
  el.className = "obstacle";

  el.style.left = obstacle.x * unit + "px";
  el.style.top = obstacle.y * heightUnit + "px";
  el.style.width = obstacle.w * unit + "px";
  el.style.height = obstacle.h * heightUnit + "px";

  el.dataset.id = obstacle.id;

  el.textContent = obstacle.id;

  return el;
}

/* =========================
    Cart logic
========================= */
function renderCart(doesStand = false, standPrice) {
  // Get all table elements in the DOM
  let selectedTables = rooms
    .flatMap((room) => room.tables)
    .filter((table) => Number(table.selectedSeats) > 0);

  // Add stand tickets to selected tables count
  if (doesStand) {
    if (Number(standTickets.value) > 0) {
      const standTable = {
        id: "Stand Tickets",
        price: standPrice,
        selectedSeats: standTickets.value,
      };
      selectedTables.push(standTable);
    }
  }

  // Clear current cart
  cartList.innerHTML = "";

  let cartCost = 0;

  console.log("selected seats: " + selectedTables);

  // If nothing selected
  if (Object.keys(selectedTables).length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tables selected";
    li.style.textAlign = "center";
    li.style.fontStyle = "italic";
    li.style.color = "#888";
    cartList.appendChild(li);
    return;
  }

  // Add selected tables
  for (let table of selectedTables) {
    const li = document.createElement("li");

    let price = Number(table.price);
    let seats = Number(table.selectedSeats);
    let totalPrice = seats * price;
    cartCost += totalPrice;

    li.innerHTML = `
      <div class="cart-item-left">
        <strong>${table.room} ${table.id}</strong>
        <small>${seats} seat${seats === 1 ? "" : "s"} × ${price.toFixed(2)}</small>
      </div>
      <div class="cart-item-right">
        <span class="cart-price">${totalPrice.toFixed(2)} Kč</span>
      </div>
    `;

    cartList.appendChild(li);
  }

  // Update total
  document.getElementById("cart-total").textContent =
    `${cartCost.toFixed(2)} Kč`;
}

/* =========================
   Selection logic
========================= */
function activateTable(el) {
  amountDisplay.textContent = 1;
  // If clicked table is already active, deactivate it
  if (activeTableEl === el) {
    el.classList.remove("selected");
    getTable(el.id).selectedSeats = 0;
    updateTableLabel(el);
    activeTableEl = null;
    amountInput.value = 1;
    return;
  }

  // Remove highlight from previous active table
  if (activeTableEl) {
    activeTableEl.classList.remove("selected");
  }

  let thisTable = getTable(el.id);
  // Check if max seats reached
  if (
    getTotalSelectedSeats() >= MAX_TOTAL_SEATS &&
    thisTable.selectedSeats === 0
  ) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    return;
  }

  if (thisTable.seats == 0) {
    alert("This table is fully booked.");
    return;
  }

  // Activate clicked table
  activeTableEl = el;
  el.classList.add("selected");

  if (thisTable.selectedSeats == 0) {
    getTable(el.id).selectedSeats = 1;
    updateTableLabel(el);
  }

  updateCounts();
}

function updateCounts() {
  if (!activeTableEl) {
    sliderGroup.style.display = "none";
  } else {
    sliderGroup.style.display = "flex";
    let current_table = getTable(activeTableEl.id);
    const remainingSeats =
      MAX_TOTAL_SEATS -
      getTotalSelectedSeats() +
      Number(current_table.selectedSeats);
    amountInput.min = 1;
    amountInput.max = Math.min(current_table.seats, remainingSeats);
    amountDisplayMax.textContent = Math.min(
      current_table.seats,
      remainingSeats,
    );
  }
  const remainingSeatsStand =
    MAX_TOTAL_SEATS - getTotalSelectedSeats() + Number(amountInputStand.value);
  amountInputStand.min = 0;
  amountInputStand.max = remainingSeatsStand;
  amountInputStand.value =
    remainingSeatsStand < amountInputStand.value
      ? remainingSeatsStand
      : amountInputStand.value;

  console.log(
    MAX_TOTAL_SEATS,
    getTotalSelectedSeats(),
    Number(amountInputStand.value),
  );
}

/* =========================
   Seat amount handling
========================= */
amountInput.addEventListener("input", () => {
  amountDisplay.textContent = amountInput.value || 1;
  if (!activeTableEl) return;

  let current_table = getTable(activeTableEl.id);

  const current = Number(current_table.selectedSeats);
  const next = Number(amountInput.value);
  const totalWithoutCurrent = getTotalSelectedSeats() - current;

  if (totalWithoutCurrent + next > MAX_TOTAL_SEATS) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    amountInput.value = current;
    return;
  }

  current_table.selectedSeats = next;
  updateTableLabel(activeTableEl);
});

amountInputStand.addEventListener("input", () => {
  amountDisplayStand.textContent = amountInputStand.value || 0;

  updateCounts();

  if (getTotalSelectedSeats() > MAX_TOTAL_SEATS) {
    alert(`You can select a maximum of ${MAX_TOTAL_SEATS} seats.`);
    amountInputStand.value -= getTotalSelectedSeats() - MAX_TOTAL_SEATS + 1;
    return;
  }

  updateTableLabel(null);
});

emailInput.addEventListener("input", () => {
  email = emailInput.value;
});

emailVerification.addEventListener("input", () => {
  email_ver = emailVerification.value;
});

function showNotificationCard(title, message, type = "success") {
  const titleEl = document.getElementById("notification-title");
  const messageEl = document.getElementById("notification-message");

  card.className = `notification-card show ${type}`;
  titleEl.textContent = title;
  messageEl.innerHTML = message;

  if (type != "success") {
    const pay = document.getElementById("pay");
    pay.style.display = "none";
  }
}

closePopUp.addEventListener("click", () => {
  card.className = `notification-card hidden`;
});

payBtn.addEventListener("click", () => {
  const order = JSON.parse(localStorage.getItem("order"));
  window.location.href =
    "../../qr_payment/subpages/iframe_tester.html?order_id=" +
    encodeURIComponent(order.id) +
    "&event_id=" +
    encodeURIComponent(event_id);
});

/* =========================
   Confirm
========================= */
confirmBtn.addEventListener("click", async () => {
  let selectedTables = [];
  rooms.forEach((room) => {
    selectedTables.concat(
      [...room.tables].filter((table) => Number(table.selectedSeats) > 0),
    );
  });

  const totalSeats = getTotalSelectedSeats();

  email = emailInput.value;
  email_ver = emailVerification.value;

  if (email !== email_ver) {
    alert("Emails do not match.");
    return;
  }
  if (totalSeats === 0) {
    alert("Please select at least one seat.");
    return;
  }

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  let errorMessage = "";
  let seats = [];
  rooms.forEach((room) => {
    room.tables.forEach((table) => {
      if (Number(table.selectedSeats) > 0) {
        seats.push([
          String(room.name),
          String(table.id),
          Number(table.selectedSeats),
        ]);
      }
    });
  });

  const orderID = await fetch(
    `http://localhost:6870/public/${params.get("id")}/reserve_seats`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        seats: seats,
        to_stand: parseInt(amountInputStand.value) ?? 0,
        email: email,
      }),
    },
  )
    .then((response) => {
      switch (response.status) {
        case 200:
          console.log("Success!");

          document.querySelectorAll(".table").forEach((el) => {
            el.classList.remove("selected", "checked");
          });

          return response.text(); // or .text(), depending on your response type
        case 400:
          console.error("Bad request: Table not found");
          console.log(response);
          errorMessage = "error 400: This seat is already occupied";
          break;
        case 500:
          console.error("Internal server error");
          console.log(response);
          errorMessage = "error 500: internal server error";
          break;
        default:
          console.log(response);
          console.warn("Unexpected status:", response.status);
          errorMessage = response.status + "unexpected error occured";
      }
    })
    .catch((error) => {
      console.error("Network or fetch error:", error);
    });

  if (orderID != null) {
    const order = { id: orderID };
    localStorage.setItem("order", JSON.stringify(order));
    showNotificationCard(
      "Success",
      "Your order ID: <strong>" + orderID + "</strong>",
      "success",
    );
    roomApp.innerHTML = "";
    rooms = [];
    await init();
  } else {
    showNotificationCard(
      "Failure",
      "Your order couldn't be processed:" + errorMessage,
      "error",
    );
  }
});

function renderTables(roomName) {
  roomApp.innerHTML = "";

  rooms[activeRoom].tables.forEach((table) => {
    roomApp.appendChild(createTable(table));
  });

  rooms[activeRoom].obstacles.forEach((obstacle) => {
    roomApp.appendChild(createObstacle(obstacle));
  });

  updateCounts();
}

function getTable(tableId) {
  return rooms[activeRoom].tables.find((table) => table.id == tableId);
}

async function init() {
  await init_tables();
  console.log("activeRoom:" + activeRoom);
  renderTables(activeRoom);
  roomPicker.addEventListener("change", (event) => {
    activeRoom = rooms.findIndex((room) => room.name == event.target.value);

    rooms.forEach((room) => {
      console.log(room.name);
    });

    console.log("activeRoom is:", activeRoom);
    renderTables(activeRoom);
  });
}

function reloadDisplay() {
  let displayedTables = document.querySelector(".table");
  displayedTables.forEach((table) => {
    table.classList.remove("selected");
    table.classList.remove("checked");
  });
}
/* =========================
   Init
========================= */

await init();
