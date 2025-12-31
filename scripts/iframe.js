const baseUrl = "http://192.168.50.109:5500/index.html?iban=CZ6508000000192000145399";
const iframe = document.getElementById("paymentFrame");
let id = new URLSearchParams(window.location.search).get('order_id');

if (!id) {
    id = JSON.parse(localStorage.getItem('order'));
}

iframe.src = `${baseUrl}&order_id=${id}`;