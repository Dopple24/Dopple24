import { renderTable } from "./table.js";

let titles = ["id", "event name", "sold tickets", "event date", "status"];
let rows = [
    [
        { text: "1002", text_color: "white" },
        { text: "Maturitní ples", text_color: "white" },
        { text: "1000", text_color: "white" },
        { text: "2025-02-14", text_color: "white" },
        { text: "closed", text_color: "lime" },
    ],
]

let selected_ticket = [];
let selected_index = -1;
let paused = false;
let should_yell = false;

const app = document.getElementById("app");
const table = document.createElement("div");

table.id = "table";
app.appendChild(table);

renderTable(app, {
titles,
rows,
disabled: paused || should_yell,
selectedIndex: selected_index, // pass selected index
onSelect(ticket, index) {
    selected_ticket = ticket;
    selected_index = index;
    updateRightPanel();
}
});