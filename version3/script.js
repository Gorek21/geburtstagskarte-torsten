const revealButton = document.querySelector("[data-reveal]");
const backButton = document.querySelector("[data-back]");
const details = document.querySelector("#details");
const start = document.querySelector("#start");

function openSecret() {
  details.hidden = false;
  document.body.classList.add("is-revealed");

  requestAnimationFrame(() => {
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeSecret() {
  document.body.classList.remove("is-revealed");

  start.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    details.hidden = true;
  }, 360);
}

revealButton?.addEventListener("click", openSecret);
backButton?.addEventListener("click", closeSecret);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !details.hidden) {
    closeSecret();
  }
});