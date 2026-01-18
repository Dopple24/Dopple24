import { renderTable } from "./table.js";
import { showMailChanger, EntryType } from "./reassurer.js";

let titles = ["id", "event name", "sold tickets", "event date", "status"];
let rows = [
  [],
];

const params = new URLSearchParams(window.location.search);
const uuid = params.get("uuid");


let selected_ticket = [];
let selected_index = -1;
let paused = false;
let should_yell = false;

let editorWindow = null;

let boxX, boxY, boxWidth, boxHeight, previewImage = null;

const app = document.getElementById("app");

async function leave() { 
  try {
    // This will "pause" until the fetch resolves
    const response = await fetch("https://api.rmjws.cz/v1/customer/${params.get(" + uuid + ")}/logout", {
        method: "POST",
        credentials: "include" // send stored cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      window.location.replace("./subpages/login.html");
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

function refresh() { render(); }

async function fetchBlockingJson(url) {
  try {
    // This will "pause" until the fetch resolves
    const response = await fetch(url, {
        credentials: "include" // send stored cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text(); // or response.text() depending on your API
    return data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
}

function parseTo2DArray(data){
  if (data && Array.isArray(data)) {
    return data.map(obj => [
      obj.id,
      obj.event_name,
      obj.sold_tickets,
      obj.event_date,
      obj.status,
    ]);
  }
}

async function render() {
  console.log('Fetching...');
  const result = await fetchBlockingJson(`https://api.rmjws.cz/v1/customer/${uuid}/get_events`);
  if (result) {
    rows = parseTo2DArray(result);
    console.log('set', result)
    renderUI();
  }
  else {
    rows = [
      ["1","Maturitní ples","1000","2025-02-14","closed"],
    ];
    renderUI();
    alert("failed to fetch data")
  }

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
  logo.src = currentTheme === "light" ? "./assets/RMJ_light.svg" : "./assets/RMJ_dark.svg";
  console.log(currentTheme);

  top.appendChild(logo);

  // Main
  const main = document.createElement("div");
  main.className = "main";

  const left = document.createElement("div");
  left.className = "leftbar";
  const leaveBtn = document.createElement("button");
  leaveBtn.textContent = "log out";
  leaveBtn.onclick = leave;
  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "refresh";
  refreshBtn.onclick = refresh;
  const createEvent = document.createElement("button");
  createEvent.textContent = "create event";
  createEvent.onclick = add_event;
  left.appendChild(leaveBtn);
  left.appendChild(refreshBtn);
  left.appendChild(createEvent);


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
    ["Event name:", selected_ticket[1] || ""],
    ["Sold tickets:", selected_ticket[2] || ""],
    ["Event date:", selected_ticket[3] || ""],
    ["Status:", selected_ticket[4] || ""]
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
    window.location.replace(`./subpages/ticket_list.html?id=${selected_ticket[0]}&uuid=${uuid}`);
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
    ["Event name:", selected_ticket[1] || ""],
    ["Sold tickets:", selected_ticket[2] || ""],
    ["Event date:", selected_ticket[3] || ""],
    ["Status:", selected_ticket[4] || ""]
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
    window.location.replace(`./subpages/ticket_list.html?id=${selected_ticket[0]}&uuid=${uuid}`);
  };

  right.appendChild(openBtn);
}

function add_event() {
  showMailChanger({
    titleName: "Create event",
    contents: [
      [EntryType.TEXT, ["email", "E-mail", ""]], 
      [EntryType.TEXT, ["date", "Date", "01-01-01"]], 
      [EntryType.BUTTON, ["button", "Click me", () => {
        editorWindow = window.open("./subpages/ticket_creator.html", "editor", "width=1000,height=800");
      }]]
    ],
    onConfirm: ([event_name, event_date]) => add_event_passed(event_name, event_date, previewImage),
    onCancel: () => console.log("Cancelled")
  });
}

async function add_event_passed(event_name, event_date, event_image) {
  console.log(event_date, event_name);
  fetch("https://api.rmjws.cz/v1/customer/${params.get(" + uuid + ")}/add_event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_name: "" + event_name,
      event_date: "" + event_date,
      image: "" + event_image,
    })
  })
  .then(res => {
    console.log(res);
    if (!res.ok) throw new Error("Request failed");
    return res.json(); // or res.text()
  })
  .then(data => console.log("Server response:", data))
  .catch(err => console.error("Error:", err));
}

window.addEventListener("message", (event) => {
  if (event.data?.type === "numberBoxSaved") {
    const { image, box } = event.data.payload;

    console.log("Received from editor:", box);

    boxX = box.x;
    boxY = box.y;
    boxHeight = box.height;
    boxWidth = box.width;
    previewImage = image;
    setPreview(image);
    const file = base64ToFile(image, "upload.png");
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);
  }
});

//const previewBox = document.getElementById("preview");
//const previewImg = document.getElementById("preview-img");

function setPreview(src) {
  console.log(src);
  /*previewImg.src = src;
  previewImg.onload = () => {
    previewBox.classList.add("has-image");
  };*/ //Does not have preview implemented
}

function base64ToFile(base64, filename = "image.png") {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)[1];

  const binary = atob(data);
  const len = binary.length;
  const buffer = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new File([buffer], filename, { type: mime });
}


renderUI();
render();