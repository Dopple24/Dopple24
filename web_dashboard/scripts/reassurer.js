export function showYeller({ reassure_text = "some text", onResponse }) {
  const root = document.getElementById("yeller-root");
  root.innerHTML = "";

  // Overlay (replaces Rectangle background overlay)
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  // Dialog box (replaces inner Rectangle)
  const dialog = document.createElement("div");
  dialog.className = "dialog";

  // Vertical layout (replaces VerticalLayout / VerticalBox)
  const content = document.createElement("div");
  content.className = "dialog-content";

  // Text (replaces Text)
  const text = document.createElement("p");
  text.className = "dialog-text";
  text.textContent = reassure_text;

  // Horizontal box (replaces HorizontalBox)
  const buttons = document.createElement("div");
  buttons.className = "dialog-buttons";

  // Yes button (replaces Button)
  const yes = document.createElement("button");
  yes.textContent = "Yes";
  yes.onclick = () => {
    cleanup();
    onResponse(true);
  };

  // No button (replaces Button)
  const no = document.createElement("button");
  no.textContent = "No";
  no.onclick = () => {
    cleanup();
    onResponse(false);
  };

  buttons.appendChild(yes);
  buttons.appendChild(no);
  content.appendChild(text);
  content.appendChild(buttons);
  dialog.appendChild(content);
  overlay.appendChild(dialog);
  root.appendChild(overlay);

  function cleanup() {
    root.innerHTML = "";
  }
}
