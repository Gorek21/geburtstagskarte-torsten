const photoIntro = document.querySelector("#photoIntro");
const mainContent = document.querySelector("#mainContent");
const enterCardButton = document.querySelector("[data-enter-card]");

const revealButton = document.querySelector("[data-reveal]");
const backButton = document.querySelector("[data-back]");
const sponsorCard = document.querySelector("[data-sponsor-card]");
const details = document.querySelector("#details");
const start = document.querySelector("#start");

function openCardFromPhoto() {
  if (!photoIntro || !mainContent) return;

  photoIntro.classList.add("is-leaving");

  window.setTimeout(() => {
    photoIntro.hidden = true;
    mainContent.hidden = false;

    requestAnimationFrame(() => {
      start?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, 520);
}

function openSecret() {
  if (!details) return;

  details.hidden = false;
  document.body.classList.add("is-revealed");

  requestAnimationFrame(() => {
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeSecret() {
  if (!details || !start) return;

  document.body.classList.remove("is-revealed");
  start.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    details.hidden = true;
  }, 360);
}

enterCardButton?.addEventListener("click", openCardFromPhoto);
revealButton?.addEventListener("click", openSecret);
backButton?.addEventListener("click", closeSecret);

sponsorCard?.addEventListener("click", () => {
  const isFlipped = sponsorCard.classList.toggle("is-flipped");
  sponsorCard.setAttribute("aria-expanded", String(isFlipped));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && details && !details.hidden) {
    closeSecret();
  }
});