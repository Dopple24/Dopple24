import init, { create_qr } from '../qr_creator/pkg/qr_creator.js';

const urlParams = new URLSearchParams(window.location.search);
const iban = urlParams.get('iban');
const order_id = urlParams.get('order_id')

async function run() {
    const amount = document.getElementById('amount').value;
    const message = document.getElementById('message').value;

    if (!iban) {
        alert("Chybí IBAN v URL (?iban=...)");
        return;
    }

    await init();
    const svg = create_qr(iban, amount, message);
    document.getElementById("qr").innerHTML = svg;
}

document.getElementById('message').value = order_id;
document.getElementById('generate').addEventListener('click', run);
