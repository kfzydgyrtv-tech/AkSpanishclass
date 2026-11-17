const fileInput = document.querySelector("#local-pdf");
const reader = document.querySelector("#book-reader");
const openPdf = document.querySelector("#open-pdf");
const statusMessage = document.querySelector("#book-status");
const fileLabel = document.querySelector("#local-label");
let localUrl;

fileInput.addEventListener("change", () => {
  const [file] = fileInput.files;
  if (!file) return;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    statusMessage.textContent = "Choose a PDF file to use the reader.";
    return;
  }

  if (localUrl) URL.revokeObjectURL(localUrl);
  localUrl = URL.createObjectURL(file);
  reader.src = localUrl;
  reader.hidden = false;
  openPdf.href = localUrl;
  openPdf.hidden = false;
  statusMessage.textContent = file.name + " is open in your browser.";
  fileLabel.textContent = "Open another PDF";
});
