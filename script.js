const openButton = document.querySelector("[data-open]");
const backButton = document.querySelector("[data-back]");
const dashboard = document.querySelector("#dashboard");
const start = document.querySelector("#start");
const animatedItems = document.querySelectorAll(".status-card, .timeline-item");

function openDashboard() {
  dashboard.hidden = false;
  document.body.classList.add("is-open");

  requestAnimationFrame(() => {
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeDashboard() {
  document.body.classList.remove("is-open");

  start.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    dashboard.hidden = true;
  }, 360);
}

openButton?.addEventListener("click", openDashboard);
backButton?.addEventListener("click", closeDashboard);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !dashboard.hidden) {
    closeDashboard();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      window.setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 80);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18
});

animatedItems.forEach((item) => observer.observe(item));