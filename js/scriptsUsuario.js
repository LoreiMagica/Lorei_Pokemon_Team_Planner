const themeToggle = document.getElementById("themeToggle"); // Botón de cambiar tema
const themeIcon = document.getElementById("themeIcon"); //Icono de sol y luna

// Al cargar la página, comprueba el tema guardado en localStorage
window.addEventListener("load", () => {

    //Si el tema guardado es oscuro
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme"); // Seteamos el tema oscuro
  themeIcon.classList.remove("bi-moon-fill"); //Quitamos el icono de luna
  themeIcon.classList.add("bi-sun-fill"); //Ponemos el icono de sol
  themeToggle.classList.remove("btn-outline-dark"); //Quitamos el marco oscuro
  themeToggle.classList.add("btn-outline-light"); // Ponemos el marco claro
}
});

// Cambiar el tema al hacer clic en el botón
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {

    //Cambiar a tema oscuro
    themeIcon.classList.remove("bi-moon-fill"); //Quitamos el icono de luna
    themeIcon.classList.add("bi-sun-fill"); //Ponemos el icono de sol
    themeToggle.classList.remove("btn-outline-dark"); //Quitamos el marco oscuro
    themeToggle.classList.add("btn-outline-light"); // Ponemos el marco claro
    localStorage.setItem("theme", "dark"); //Guardamos en memoria el tema oscuro
  } else {

    //Cambiar a tema claro
    themeIcon.classList.remove("bi-sun-fill"); //Quitamos el icono de sol
    themeIcon.classList.add("bi-moon-fill"); //Ponemos el icono de luna
    themeToggle.classList.remove("btn-outline-light"); //Quitamos el marco claro
    themeToggle.classList.add("btn-outline-dark"); // Ponemos el marco claro
    localStorage.setItem("theme", "light"); //Guardamos en memoria el tema oscuro
  }
});
