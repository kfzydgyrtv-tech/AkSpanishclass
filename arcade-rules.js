"use strict";
/* Only loaded on Ak's Arcade gallery: hover to read, click to pin for five seconds. */
(function () {
  const widget = document.getElementById("arcade-rules-widget");
  const button = document.getElementById("arcade-rules-button");
  const panel = document.getElementById("arcade-rules-panel");
  if (!widget || !button || !panel) return;

  let clickTimer = null;
  let pinned = false;
  let waitForMouseLeave = false;

  function show() {
    widget.classList.add("rules-visible");
    button.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  }

  function hide() {
    widget.classList.remove("rules-visible");
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  }

  function clearClickTimer() {
    if (clickTimer !== null) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
  }

  widget.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "touch" && !pinned && !waitForMouseLeave) show();
  });
  widget.addEventListener("pointerleave", function () {
    waitForMouseLeave = false;
    if (!pinned) hide();
  });

  button.addEventListener("click", function () {
    clearClickTimer();
    pinned = true;
    waitForMouseLeave = false;
    show();
    clickTimer = setTimeout(function () {
      pinned = false;
      clickTimer = null;
      waitForMouseLeave = true;
      hide();
    }, 5000);
  });

  button.addEventListener("focus", function () {
    if (!pinned && !waitForMouseLeave) show();
  });
  button.addEventListener("blur", function () {
    if (!pinned && !widget.matches(":hover")) hide();
  });
  button.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      clearClickTimer();
      pinned = false;
      waitForMouseLeave = true;
      hide();
      button.blur();
    }
  });
})();
