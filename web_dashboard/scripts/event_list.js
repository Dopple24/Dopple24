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

function leave() { alert("leave"); }
function refresh() { alert("refresh"); }
function create_ticket() {
  window.location.replace("./subpages/ticket_creator.html");
}

function render() {
  app.innerHTML = "";

  const root = document.createElement("div");
  root.className = "root";

  const currentTheme =
    document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  const top = document.createElement("div");
  top.className = "topbar";
  const logo = document.createElement("img");
  logo.src = currentTheme === "light" ? "./assets/RMJ_light.svg" : "./assets/RMJ_dark.svg";
  console.log(currentTheme);

  top.appendChild(logo);

  // Main
  const main = document.createElement("div");
  main.className = "main";

  const left = document.createElement("div");
  left.className = "leftbar";
  const leaveBtn = document.createElement("button");
  leaveBtn.textContent = "leave";
  leaveBtn.onclick = leave;
  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "refresh";
  refreshBtn.onclick = refresh;
  const createTicketBtn = document.createElement("button");
  createTicketBtn.textContent = "create ticket";
  createTicketBtn.onclick = create_ticket;
  left.appendChild(leaveBtn);
  left.appendChild(refreshBtn);
  left.appendChild(createTicketBtn);

  const center = document.createElement("div");
  center.className = "main-content";

  const table = document.createElement("div");
  table.id = "table";
  center.appendChild(table);

  renderTable(center, {
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


  const right = document.createElement("div");
  right.className = "rightbar";

  const ticketImg = document.createElement("img");
  ticketImg.src = "./assets/cropped.png";
  right.appendChild(ticketImg);

  const fields = [
    ["Ticket number:", selected_ticket[0]?.text || ""],
    ["E-mail:", selected_ticket[2]?.text || ""],
    ["Bought date:", selected_ticket[3]?.text || ""],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `<span class="rightLabel">${label}</span><span class="rightValue">${value}</span>`;
    right.appendChild(row);
  });

  const openBtn = document.createElement("button");
  openBtn.textContent = "open";
  openBtn.disabled = selected_ticket.length === 0;
  openBtn.onclick = () => {
    console.log(selected_index);
    window.location.replace("/subpages/ticket_list.html");
  };

  right.appendChild(openBtn);

  main.appendChild(left);
  main.appendChild(center);
  main.appendChild(right);

  root.appendChild(top);
  root.appendChild(main);
  app.appendChild(root);

  
  const scrollElement = document.querySelector('.scroll');
  const header = document.querySelector('.header');

  if (scrollElement.scrollHeight > scrollElement.clientHeight) {
    header.classList.add("active");   // add the class
  } else {
    header.classList.remove("active"); // remove the class 
  }

  if (paused) {
    showMailChanger({
        initialEmail: selected_ticket[2]?.text || "",
        onConfirm(email) {
        paused = false;
        edit_email(selected_index, email); // edit_email already calls render()
        },
        onCancel() {
        paused = false;
        render(); // render once
        }
    });
  }
  
  if (should_yell) {
    showYeller({
        reassure_text: `This will send an email to ${selected_ticket[2]?.text} with ticket ${selected_ticket[0]?.text}. Are you sure?`,
        onResponse(answer) {
        should_yell = false;
        if (answer) resend_email(selected_index); // can call render inside
        render(); // render once to update UI
        }
    });
  }
}

function updateRightPanel() {
  const right = document.querySelector(".rightbar");
  if (!right) return;
  right.innerHTML = ""; // clear old info

  const ticketImg = document.createElement("img");
  ticketImg.src = "./assets/cropped.png";
  right.appendChild(ticketImg);

  const fields = [
    ["Ticket number:", selected_ticket[0]?.text || ""],
    ["E-mail:", selected_ticket[2]?.text || ""],
    ["Bought date:", selected_ticket[3]?.text || ""],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `<span class="rightLabel">${label}</span><span class="rightValue">${value}</span>`;
    right.appendChild(row);
  });

  const openBtn = document.createElement("button");
  openBtn.textContent = "open";
  openBtn.disabled = selected_ticket.length === 0;
  openBtn.onclick = () => {
    console.log(selected_index);
    window.location.replace("./subpages/ticket_list.html");
  };

  right.appendChild(openBtn);
}


render();