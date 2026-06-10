const card = document.querySelector("#birthdayCard");
const openButton = document.querySelector("#openCard");
const closeButton = document.querySelector("#closeCard");

openButton.addEventListener("click", () => {
  card.classList.add("is-open");
});

closeButton.addEventListener("click", () => {
  card.classList.remove("is-open");
});