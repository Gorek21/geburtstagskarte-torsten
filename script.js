const photoIntro = document.querySelector("#photoIntro");
const mainContent = document.querySelector("#mainContent");
const enterCardButton = document.querySelector("[data-enter-card]");
const resetZoomButton = document.querySelector("[data-reset-zoom]");
const fullViewButton = document.querySelector("[data-full-view]");

const revealButton = document.querySelector("[data-reveal]");
const backButton = document.querySelector("[data-back]");
const details = document.querySelector("#details");
const start = document.querySelector("#start");

const photoStage = document.querySelector("#photoStage");
const introPhoto = document.querySelector("#introPhoto");

const minZoom = 13;
const maxZoom = 35;

let scale = minZoom;
let offsetX = 0;
let offsetY = 0;

let startX = 0;
let startY = 0;
let startScale = minZoom;
let startOffsetX = 0;
let startOffsetY = 0;
let startDistance = 0;
let pinchOriginX = 0;
let pinchOriginY = 0;
let isDragging = false;
let fullView = false;

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

function getStageCenter() {
  const rect = photoStage.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
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
}

function renderPhoto() {
  clampOffsets();

  if (introPhoto) {
    introPhoto.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
  }

  if (photoStage) {
    photoStage.classList.toggle("is-zoomed", scale > minZoom + 0.01);
  }
}

function setFullView(enabled) {
  fullView = enabled;

  if (fullView) {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    photoStage?.classList.add("show-full");

    if (fullViewButton) {
      fullViewButton.innerHTML = "Zurück zum<br>Suchbild";
    }
  } else {
    scale = minZoom;
    offsetX = 0;
    offsetY = 0;
    photoStage?.classList.remove("show-full");

    if (fullViewButton) {
      fullViewButton.innerHTML = "Ich möchte wissen,<br>was dieses Objekt ist";
    }
  }

  renderPhoto();
}

function resetZoom() {
  setFullView(false);
}

function leaveFullViewForManualZoom() {
  if (!fullView) return;

  fullView = false;
  photoStage?.classList.remove("show-full");

  if (fullViewButton) {
    fullViewButton.innerHTML = "Ich möchte wissen,<br>was dieses Objekt ist";
  }

  scale = minZoom;
  offsetX = 0;
  offsetY = 0;
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
fullViewButton?.addEventListener("click", () => {
  setFullView(!fullView);
});

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

  if (!photoStage) return;

  leaveFullViewForManualZoom();

  const oldScale = scale;
  const newScale = clamp(scale + (event.deltaY < 0 ? 0.8 : -0.8), minZoom, maxZoom);

  const stageCenter = getStageCenter();

  const pointerX = event.clientX - stageCenter.x;
  const pointerY = event.clientY - stageCenter.y;

  const imagePointX = (pointerX - offsetX) / oldScale;
  const imagePointY = (pointerY - offsetY) / oldScale;

  scale = newScale;

  offsetX = pointerX - imagePointX * scale;
  offsetY = pointerY - imagePointY * scale;

  renderPhoto();
}, { passive: false });

photoStage?.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();

    leaveFullViewForManualZoom();

    const midpoint = getMidpoint(event.touches[0], event.touches[1]);
    const stageCenter = getStageCenter();

    startDistance = getDistance(event.touches[0], event.touches[1]);
    startScale = scale;
    startOffsetX = offsetX;
    startOffsetY = offsetY;

    const pointerX = midpoint.x - stageCenter.x;
    const pointerY = midpoint.y - stageCenter.y;

    pinchOriginX = (pointerX - offsetX) / scale;
    pinchOriginY = (pointerY - offsetY) / scale;

    isDragging = false;
  } else if (event.touches.length === 1) {
    event.preventDefault();

    const touch = event.touches[0];

    startX = touch.clientX - offsetX;
    startY = touch.clientY - offsetY;
    isDragging = true;
  }
}, { passive: false });

photoStage?.addEventListener("touchmove", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();

    const midpoint = getMidpoint(event.touches[0], event.touches[1]);
    const currentDistance = getDistance(event.touches[0], event.touches[1]);
    const stageCenter = getStageCenter();

    const pointerX = midpoint.x - stageCenter.x;
    const pointerY = midpoint.y - stageCenter.y;

    scale = clamp(startScale * (currentDistance / startDistance), minZoom, maxZoom);

    offsetX = pointerX - pinchOriginX * scale;
    offsetY = pointerY - pinchOriginY * scale;

    renderPhoto();
  } else if (event.touches.length === 1 && isDragging) {
    event.preventDefault();

    const touch = event.touches[0];

    offsetX = touch.clientX - startX;
    offsetY = touch.clientY - startY;

    renderPhoto();
  }
}, { passive: false });

photoStage?.addEventListener("touchend", (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0];

    startX = touch.clientX - offsetX;
    startY = touch.clientY - offsetY;
    isDragging = true;
  } else if (event.touches.length === 0) {
    isDragging = false;
    renderPhoto();
  }
});

window.addEventListener("resize", renderPhoto);

renderPhoto();