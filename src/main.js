import "../indexStyles.css";
import Swal from "sweetalert2";

const button = document.querySelector("#dangerButton");

button.addEventListener("click", async () => {
  await Swal.fire({
    icon: "warning",
    title: "I Said Do Not Click This Button",
    text: "You clicked it anyway.",
    confirmButtonText: "My bad",
    confirmButtonColor: "#2b6fff",
    background: "#0b1630",
    color: "rgba(255,255,255,0.92)",
  });
});
