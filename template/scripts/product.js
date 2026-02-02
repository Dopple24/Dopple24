const productPrice = document.querySelector('.product-price');
let event = null;

async function loadEvent() {
    event = JSON.parse(localStorage.getItem("selectedEvent"));
    if ((event === null) || event.id != new URLSearchParams(window.location.search).get("id")) {
        const response = await fetch('../template/events.json');
        const data = await response.json();

        const events = data.events;

        events.forEach(ev => {
            if (ev.id == new URLSearchParams(window.location.search).get("id")) {
                localStorage.setItem("selectedEvent", JSON.stringify(ev));
                event = ev;
            }
        });
    }
    let images = document.querySelectorAll('.product-image');
    images[0].src = `../assets/${event.image}`;

    document.querySelector('.product-title').textContent = event.name;
    document.querySelector('.product-description').textContent = event.long_description;
    document.querySelector('.product-date').textContent = event.date;
    
    productPrice.textContent = `Cena: ${event.price * Number(document.getElementById('ticket-quantity').value)} Kč`;
}
productPrice.addEventListener("input", () => {
    productPrice.textContent = `Cena: ${event.price * Number(document.getElementById('ticket-quantity').value)} Kč`;
})
loadEvent();

