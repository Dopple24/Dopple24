const productPrice = document.querySelector(".product-price");
const ticketAmount = document.getElementById("ticket-amount");
const seating = document.querySelector(".app");
const standWhileSitting = document.getElementById(
  "ticket-to-stand-while-sitting",
);
let event = null;

export async function loadEvent(stand = true, sit = true) {
  event = JSON.parse(localStorage.getItem("selectedEvent"));

  if (sit && stand) {
    ticketAmount.style.display = "none";
  }
  if (!sit) {
    seating.style.display = "none";
  }
  if (!stand) {
    ticketAmount.style.display = "none";
    standWhileSitting.style.display = "none";
  }

  if (
    event === null ||
    event.id != new URLSearchParams(window.location.search).get("id")
  ) {
    const response = await fetch("../template/events.json");
    const data = await response.json();

    const events = data.events;

    events.forEach((ev) => {
      if (ev.id == new URLSearchParams(window.location.search).get("id")) {
        localStorage.setItem("selectedEvent", JSON.stringify(ev));
        event = ev;
      }
    });
  }
  let images = document.querySelectorAll(".product-image");
  images[0].src = `../assets/${event.image}`;

  document.querySelector(".product-title").textContent = event.name;
  document.querySelector(".product-description").textContent =
    event.long_description;
  document.querySelector(".product-date").textContent = event.date;

  productPrice.textContent = `Cena: ${event.price * Number(document.getElementById("ticket-quantity").value)} Kč`;
}
document.getElementById("ticket-quantity").addEventListener("input", () => {
  console.log("input log");
  productPrice.textContent = `Cena: ${event.price * Number(document.getElementById("ticket-quantity").value)} Kč`;
});
