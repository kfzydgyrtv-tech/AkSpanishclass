const form = document.querySelector("#student-message");
const email = document.querySelector("#contact-email");
const message = form.elements.namedItem("message");

message.addEventListener("input", () => message.setCustomValidity(""));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const body = message.value.trim();
  if (!body) {
    message.setCustomValidity("Please write a message.");
    message.reportValidity();
    return;
  }

  const topic = form.elements.namedItem("topic").value;
  const subject = encodeURIComponent(`Spanish class — ${topic}`);
  const draft = encodeURIComponent(body.replace(/\r?\n/g, "\r\n"));
  window.location.href = `${email.getAttribute("href")}?subject=${subject}&body=${draft}`;
});

form.hidden = false;
