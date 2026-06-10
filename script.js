const card = document.querySelector("#birthdayCard");
const openButton = document.querySelector("#openCard");
const closeButton = document.querySelector("#closeCard");

openButton.addEventListener("click", () => {
  card.classList.add("is-open");
  document.body.classList.add("card-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

closeButton.addEventListener("click", () => {
  card.classList.remove("is-open");
  document.body.classList.remove("card-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
});