import init, { create_qr } from './qr_creator/pkg/qr_creator.js';

const urlParams = new URLSearchParams(window.location.search);
const iban = urlParams.get('iban');

async function run() {
    const amount = document.getElementById('amount').value;
    const message = document.getElementById('message').value;

    if (!iban) {
        alert("IBAN chybí v URL (?iban=...)");
        return;
    }

    await init(); // loads WASM

    const svg = create_qr(iban, amount, message);
    document.getElementById("qr").innerHTML = svg;
}

// Attach event listener instead of inline onclick
document.getElementById('generate').addEventListener('click', run);
