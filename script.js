const card = document.querySelector("#card");
const button = document.querySelector("#openCard");

button.addEventListener("click", () => {
  card.classList.add("is-open");
});