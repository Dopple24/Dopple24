const baseUrl = "../index.html?iban=CZ6508000000192000145399";
const iframe = document.getElementById("paymentFrame");
const params = new URLSearchParams(window.location.search);
let id = params.get("order_id");
let event_id = params.get("event_id");

if (!id) {
  id = JSON.parse(localStorage.getItem("order"));
}

iframe.src = `${baseUrl}&order_id=${id}&event_id=${event_id}`;
