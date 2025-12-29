const baseUrl = "https://dopple24.github.io/Dopple24/index.html?iban=CZ6508000000192000145399";
const iframe = document.getElementById("paymentFrame");
const id = new URLSearchParams(window.location.search).get('order_id');

iframe.src = `${baseUrl}&order_id=${id}`;