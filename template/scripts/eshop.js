
async function loadEshop() {
    const response = await fetch('../template/events.json');
    const data = await response.json();

    const events = data.events;
    const eshop = document.getElementById('eshop');

    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'shop-item';

        item.innerHTML = `
        <img src="./assets/${event.image}" alt="${event.name}" class="shop-item-image" />
        <h2 class="shop-item-title">${event.name}</h2>
        <p class="shop-item-description">${event.description}</p>
        <p class="shop-item-price">Od ${event.price} Kč</p>
        <p class="shop-item-date">${event.date}</p>
        <a class="shop-item-button">
            Koupit Vstupenku
        </a>
        `;

        let button = item.querySelector('.shop-item-button');

        button.addEventListener('click', () => {
            goToDetail(event);
            window.location.href = "./subpage/product.html?id=" + event.id;
        });

        eshop.appendChild(item);
    });
    }

loadEshop();

function goToDetail(event) {
  localStorage.setItem("selectedEvent", JSON.stringify(event));
  window.location.href = "./subpage/product.html";
}