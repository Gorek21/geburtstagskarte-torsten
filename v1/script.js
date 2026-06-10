const photoIntro = document.querySelector("#photoIntro");
const mainContent = document.querySelector("#mainContent");
const enterCardButton = document.querySelector("[data-enter-card]");
const resetZoomButton = document.querySelector("[data-reset-zoom]");

const revealButton = document.querySelector("[data-reveal]");
const backButton = document.querySelector("[data-back]");
const details = document.querySelector("#details");
const start = document.querySelector("#start");

const photoStage = document.querySelector("#photoStage");
const introPhoto = document.querySelector("#introPhoto");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;
let startScale = 1;
let startDistance = 0;
let lastMidpoint = null;
let isDragging = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(touchA, touchB) {
  const dx = touchB.clientX - touchA.clientX;
  const dy = touchB.clientY - touchA.clientY;
  return Math.hypot(dx, dy);
}

function getMidpoint(touchA, touchB) {
  return {
    x: (touchA.clientX + touchB.clientX) / 2,
    y: (touchA.clientY + touchB.clientY) / 2
  };
}

function clampOffsets() {
  if (!photoStage || !introPhoto) return;

  const stageWidth = photoStage.clientWidth;
  const stageHeight = photoStage.clientHeight;
  const imageWidth = introPhoto.offsetWidth * scale;
  const imageHeight = introPhoto.offsetHeight * scale;

  const maxX = Math.max(0, (imageWidth - stageWidth) / 2);
  const maxY = Math.max(0, (imageHeight - stageHeight) / 2);

  offsetX = clamp(offsetX, -maxX, maxX);
  offsetY = clamp(offsetY, -maxY, maxY);

  if (scale <= 1) {
    offsetX = 0;
    offsetY = 0;
  }
}

function renderPhoto() {
  clampOffsets();

  if (introPhoto) {
    introPhoto.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
  }

  if (photoStage) {
    photoStage.classList.toggle("is-zoomed", scale > 1.01);
  }
}

function resetZoom() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  renderPhoto();
}

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
resetZoomButton?.addEventListener("click", resetZoom);

revealButton?.addEventListener("click", openSecret);
backButton?.addEventListener("click", closeSecret);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && details && !details.hidden) {
    closeSecret();
  }
});

if (introPhoto) {
  introPhoto.addEventListener("load", renderPhoto);
}

photoStage?.addEventListener("dblclick", resetZoom);

photoStage?.addEventListener("wheel", (event) => {
  event.preventDefault();

  const delta = event.deltaY < 0 ? 0.18 : -0.18;
  scale = clamp(scale + delta, 1, 4);
  renderPhoto();
}, { passive: false });

photoStage?.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    startDistance = getDistance(event.touches[0], event.touches[1]);
    startScale = scale;
    lastMidpoint = getMidpoint(event.touches[0], event.touches[1]);
    isDragging = false;
  } else if (event.touches.length === 1 && scale > 1) {
    const touch = event.touches[0];
    startX = touch.clientX - offsetX;
    startY = touch.clientY - offsetY;
    isDragging = true;
  }
}, { passive: true });

photoStage?.addEventListener("touchmove", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();

    const currentDistance = getDistance(event.touches[0], event.touches[1]);
    const currentMidpoint = getMidpoint(event.touches[0], event.touches[1]);

    scale = clamp(startScale * (currentDistance / startDistance), 1, 4);

    if (lastMidpoint) {
      offsetX += currentMidpoint.x - lastMidpoint.x;
      offsetY += currentMidpoint.y - lastMidpoint.y;
    }

    lastMidpoint = currentMidpoint;
    renderPhoto();
  } else if (event.touches.length === 1 && isDragging && scale > 1) {
    event.preventDefault();

    const touch = event.touches[0];
    offsetX = touch.clientX - startX;
    offsetY = touch.clientY - startY;
    renderPhoto();
  }
}, { passive: false });

photoStage?.addEventListener("touchend", (event) => {
  if (event.touches.length === 1 && scale > 1) {
    const touch = event.touches[0];
    startX = touch.clientX - offsetX;
    startY = touch.clientY - offsetY;
    isDragging = true;
  } else if (event.touches.length === 0) {
    isDragging = false;
    lastMidpoint = null;

    if (scale < 1.02) {
      resetZoom();
    } else {
      renderPhoto();
    }
  }
});

window.addEventListener("resize", renderPhoto);
renderPhoto();