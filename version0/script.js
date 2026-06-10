const openButton = document.querySelector("[data-open]");
const backButton = document.querySelector("[data-back]");
const revealSection = document.querySelector("#reveal");
const startSection = document.querySelector("#start");
const stops = document.querySelectorAll(".stop");

function showReveal() {
  revealSection.hidden = false;
  document.body.classList.add("is-revealed");

  requestAnimationFrame(() => {
    revealSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function hideReveal() {
  document.body.classList.remove("is-revealed");
  startSection.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    revealSection.hidden = true;
  }, 360);
}

openButton?.addEventListener("click", showReveal);
backButton?.addEventListener("click", hideReveal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !revealSection.hidden) {
    hideReveal();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      window.setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 90);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

stops.forEach((stop) => observer.observe(stop));