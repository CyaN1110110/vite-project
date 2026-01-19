import "../indexStyles.css";

const button = document.querySelector("#dangerButton");

button.addEventListener("click", () => {
  window.alert("I Said Do Not Click This Button");
});
