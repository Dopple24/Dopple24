import { renderTable } from "./table.js";
import { showMailChanger } from "./mail_changer.js";
import { showYeller } from "./reassurer.js";

let titles = ["id", "price", "email", "buy date", "status"];
let rows_default = [
  ["1002", "$25", "b@test.com", "2025-02-14", "OK"],
  ["1003", "$40", "c@test.com", "2025-03-10", "Error"],
  ["1004", "$35", "d@test.com", "2025-04-01", "OK"],
  ["1005", "$50", "e@test.com", "2025-05-05", "Payment Returned"],
  ["1006", "$20", "f@test.com", "2025-06-12", "OK"],
  ["1007", "$45", "g@test.com", "2025-07-20", "Error"],
  ["1008", "$30", "h@test.com", "2025-08-15", "OK"],
  ["1009", "$55", "i@test.com", "2025-09-01", "Payment Returned"],
  ["1010", "$60", "j@test.com", "2025-10-10", "OK"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],

  ["1002", "$25", "b@test.com", "2025-02-14", "OK"],
  ["1003", "$40", "c@test.com", "2025-03-10", "Error"],
  ["1004", "$35", "d@test.com", "2025-04-01", "OK"],
  ["1005", "$50", "e@test.com", "2025-05-05", "Payment Returned"],
  ["1006", "$20", "f@test.com", "2025-06-12", "OK"],
  ["1007", "$45", "g@test.com", "2025-07-20", "Error"],
  ["1008", "$30", "h@test.com", "2025-08-15", "OK"],
  ["1009", "$55", "i@test.com", "2025-09-01", "Payment Returned"],
  ["1010", "$60", "j@test.com", "2025-10-10", "OK"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],
  ["1011", "$15", "k@test.com", "2025-11-05", "Error"],
];
let rows = [[]]

async function fetchBlockingJson(url) {
  try {
    // This will "pause" until the fetch resolves
    const response = await fetch(url, {
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
}

async function editMail(index, new_email, database_id) {
  const response = await fetch("https://192.168.50.179:8080/edit_mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: index,
      new_email: new_email,
      database_id: database_id
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(data => console.log("Server response:", data))
  .catch(err => console.error("Error:", err));
}

function parseTo2DArray(data){
  if (data && Array.isArray(data)) {
    return data.map(obj => [
      obj.id,
      obj.price + " Kč",
      obj.email,
      obj.date,
      obj.status
    ]);
  }
}

// Usage:
async function render() {
  console.log('Fetching...');
  const result = await fetchBlockingJson(`https://192.168.50.179:8080/get_database${window.location.search}`);
  if (result) {
    rows = parseTo2DArray(result.data);
    console.log('set')
  }
  else {
    alert("failed to fetch data");
    rows = rows_default;
  }
renderUI();
}

const params = new URLSearchParams(window.location.search);
const database_id = params.get("event_id");


let selected_ticket = [];
let selected_index = -1;
let paused = false;
let should_yell = false;

const app = document.getElementById("app");

function leave() { 
  window.location.replace("../index.html");
}

function refresh() { render(); }
async function edit_email(index, newEmail) {
  try {
    // Wait for server response before updating UI
    const result = await editMail(index, newEmail, database_id);
    console.log(result);

    // Only update local rows & render after successful response
    rows[index][2] = newEmail;
    render();
  } catch (err) {
    console.error('Failed to edit email:', err);
  }
}
function resend_email(index) {
  alert("Resent ticket " + rows[index][0]);
}

function renderUI() {
  app.innerHTML = "";

  const root = document.createElement("div");
  root.className = "root";

  const currentTheme =
    document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  const top = document.createElement("div");
  top.className = "topbar";
  const logo = document.createElement("img");
  logo.src = currentTheme === "light" ? "../assets/RMJ_light.svg" : "../assets/RMJ_dark.svg";
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
  createTicketBtn.textContent = "create new ticket";
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
  ticketImg.src = "../assets/cropped.png";
  right.appendChild(ticketImg);

  const fields = [
    ["Ticket number:", selected_ticket[0] || ""],
    ["E-mail:", selected_ticket[2] || ""],
    ["Bought date:", selected_ticket[3] || ""],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `<span class="rightLabel">${label}</span><span class="rightValue">${value}</span>`;
    right.appendChild(row);
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit e-mail";
  editBtn.disabled = selected_ticket.length === 0;
  editBtn.onclick = () => {
    paused = true;
    renderUI();
  };

  const resendBtn = document.createElement("button");
  resendBtn.textContent = "resend email";
  resendBtn.disabled = selected_ticket.length === 0;
  resendBtn.onclick = () => {
    should_yell = true;
    renderUI();
  };

  

  right.appendChild(editBtn);
  right.appendChild(resendBtn);

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
        initialEmail: selected_ticket[2] || "",
        onConfirm(email) {
          paused = false;
          edit_email(selected_index, email); // edit_email already calls render()
        },
        onCancel() {
          paused = false;
          renderUI(); // render once
        }
    });
  }
  
  if (should_yell) {
    showYeller({
        reassure_text: `This will send an email to ${selected_ticket[2]} with ticket ${selected_ticket[0]}. Are you sure?`,
        onResponse(answer) {
          should_yell = false;
          if (answer) resend_email(selected_index); // can call render inside
          renderUI(); // render once to update UI
        }
    });
  }
}

function updateRightPanel() {
  const right = document.querySelector(".rightbar");
  if (!right) return;
  right.innerHTML = ""; // clear old info

  const ticketImg = document.createElement("img");
  ticketImg.src = "../assets/cropped.png";
  right.appendChild(ticketImg);

  const fields = [
    ["Ticket number:", selected_ticket[0] || ""],
    ["E-mail:", selected_ticket[2] || ""],
    ["Bought date:", selected_ticket[3] || ""],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `<span class="rightLabel">${label}</span><span class="rightValue">${value}</span>`;
    right.appendChild(row);
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit e-mail";
  editBtn.disabled = selected_ticket.length === 0;
  editBtn.onclick = () => {
    paused = true;
    renderUI(); // show mail changer modal
  };

  const resendBtn = document.createElement("button");
  resendBtn.textContent = "resend email";
  resendBtn.disabled = selected_ticket.length === 0;
  resendBtn.onclick = () => {
    should_yell = true;
    renderUI(); // show confirmation modal
  };

  right.appendChild(editBtn);
  right.appendChild(resendBtn);
}

async function create_ticket() {
  fetch("https://192.168.50.179:8080/create_ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_id: database_id,
      seat: null,
      price: null,
      address: null,
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(refresh())
  .catch(err => console.error("Error:", err));
}

renderUI();
render();
