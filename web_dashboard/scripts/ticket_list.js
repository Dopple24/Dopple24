import { renderTable } from "./table.js";
import { showMailChanger } from "./mail_changer.js";
import { showYeller } from "./reassurer.js";

let titles = ["id", "price", "email", "buy date", "status"];
let rows = [
  [
    { text: "1002", text_color: "white" },
    { text: "$25", text_color: "white" },
    { text: "b@test.com", text_color: "white" },
    { text: "2025-02-14", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1003", text_color: "white" },
    { text: "$40", text_color: "white" },
    { text: "c@test.com", text_color: "white" },
    { text: "2025-03-10", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1004", text_color: "white" },
    { text: "$35", text_color: "white" },
    { text: "d@test.com", text_color: "white" },
    { text: "2025-04-01", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1005", text_color: "white" },
    { text: "$50", text_color: "white" },
    { text: "e@test.com", text_color: "white" },
    { text: "2025-05-05", text_color: "white" },
    { text: "pending", text_color: "yellow" },
  ],
  [
    { text: "1006", text_color: "white" },
    { text: "$20", text_color: "white" },
    { text: "f@test.com", text_color: "white" },
    { text: "2025-06-12", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1007", text_color: "white" },
    { text: "$45", text_color: "white" },
    { text: "g@test.com", text_color: "white" },
    { text: "2025-07-20", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1008", text_color: "white" },
    { text: "$30", text_color: "white" },
    { text: "h@test.com", text_color: "white" },
    { text: "2025-08-15", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1009", text_color: "white" },
    { text: "$55", text_color: "white" },
    { text: "i@test.com", text_color: "white" },
    { text: "2025-09-01", text_color: "white" },
    { text: "pending", text_color: "yellow" },
  ],
  [
    { text: "1010", text_color: "white" },
    { text: "$60", text_color: "white" },
    { text: "j@test.com", text_color: "white" },
    { text: "2025-10-10", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1011", text_color: "white" },
    { text: "$15", text_color: "white" },
    { text: "k@test.com", text_color: "white" },
    { text: "2025-11-05", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1002", text_color: "white" },
    { text: "$25", text_color: "white" },
    { text: "b@test.com", text_color: "white" },
    { text: "2025-02-14", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1003", text_color: "white" },
    { text: "$40", text_color: "white" },
    { text: "c@test.com", text_color: "white" },
    { text: "2025-03-10", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1004", text_color: "white" },
    { text: "$35", text_color: "white" },
    { text: "d@test.com", text_color: "white" },
    { text: "2025-04-01", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1005", text_color: "white" },
    { text: "$50", text_color: "white" },
    { text: "e@test.com", text_color: "white" },
    { text: "2025-05-05", text_color: "white" },
    { text: "pending", text_color: "yellow" },
  ],
  [
    { text: "1006", text_color: "white" },
    { text: "$20", text_color: "white" },
    { text: "f@test.com", text_color: "white" },
    { text: "2025-06-12", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1007", text_color: "white" },
    { text: "$45", text_color: "white" },
    { text: "g@test.com", text_color: "white" },
    { text: "2025-07-20", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1008", text_color: "white" },
    { text: "$30", text_color: "white" },
    { text: "h@test.com", text_color: "white" },
    { text: "2025-08-15", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1009", text_color: "white" },
    { text: "$55", text_color: "white" },
    { text: "i@test.com", text_color: "white" },
    { text: "2025-09-01", text_color: "white" },
    { text: "pending", text_color: "yellow" },
  ],
  [
    { text: "1010", text_color: "white" },
    { text: "$60", text_color: "white" },
    { text: "j@test.com", text_color: "white" },
    { text: "2025-10-10", text_color: "white" },
    { text: "valid", text_color: "lime" },
  ],
  [
    { text: "1011", text_color: "white" },
    { text: "$15", text_color: "white" },
    { text: "k@test.com", text_color: "white" },
    { text: "2025-11-05", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
  [
    { text: "1011", text_color: "white" },
    { text: "$15", text_color: "white" },
    { text: "k@test.com", text_color: "white" },
    { text: "2025-11-05", text_color: "white" },
    { text: "invalid", text_color: "red" },
  ],
];




let selected_ticket = [];
let selected_index = -1;
let paused = false;
let should_yell = false;

const app = document.getElementById("app");

function leave() { alert("leave"); }
function refresh() { alert("refresh"); }
function edit_email(index, newEmail) {
  rows[index][2].text = newEmail;
  render();
}
function resend_email(index) {
  alert("Resent ticket " + rows[index][0].text);
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
  left.appendChild(leaveBtn);
  left.appendChild(refreshBtn);

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

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit e-mail";
  editBtn.disabled = selected_ticket.length === 0;
  editBtn.onclick = () => {
    paused = true;
    render();
  };

  const resendBtn = document.createElement("button");
  resendBtn.textContent = "resend email";
  resendBtn.disabled = selected_ticket.length === 0;
  resendBtn.onclick = () => {
    should_yell = true;
    render();
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
  ticketImg.src = "../assets/cropped.png";
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

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit e-mail";
  editBtn.disabled = selected_ticket.length === 0;
  editBtn.onclick = () => {
    paused = true;
    render(); // show mail changer modal
  };

  const resendBtn = document.createElement("button");
  resendBtn.textContent = "resend email";
  resendBtn.disabled = selected_ticket.length === 0;
  resendBtn.onclick = () => {
    should_yell = true;
    render(); // show confirmation modal
  };

  right.appendChild(editBtn);
  right.appendChild(resendBtn);
}


render();