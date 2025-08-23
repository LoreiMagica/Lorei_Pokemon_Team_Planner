// scriptsUsuario.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { app, auth } from "./firebaseConfig.js";  
import { guardarCajasEnDB } from "./guardarDatosUsuario.js"; // Función para guardar datos del usuario
import { cargarCajasDesdeDB, cargarListaEquipos } from "./cargarDatosUsuario.js";  // Función para cargar los datos de usuario guardados
import { changeLanguage, currentLang } from "./i18n.js";



// Elementos html del cuadro de inicio de sesión
const authForm = document.getElementById("authForm");
const toggleRegister = document.getElementById("toggleRegister");
const authError = document.getElementById("authError");
const authButton = document.getElementById("authButton");
const userGreeting = document.getElementById("userGreeting");
let isRegister = false;

// Cambiar entre login y registro
toggleRegister.addEventListener("click", (e) => {
  e.preventDefault();
  isRegister = !isRegister; //Mirar si está en modo registrar o logear
  document.getElementById("authModalLabel").textContent = isRegister ? t("register") : t("login");
  authForm.querySelector("button[type=submit]").textContent = isRegister ? t("createAccount") : t("enter");
  toggleRegister.textContent = isRegister ? t("alreadyAccount") : t("notAccount");
});

// Enviar formulario
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  //Obtenemos el email y contraseña escritos
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    if (isRegister) {
        //Si se está registrando correctamente
      await createUserWithEmailAndPassword(auth, email, password);
      authError.textContent = t("registerSucess");
    } else {
        //Si se está logeando
      await signInWithEmailAndPassword(auth, email, password);
      authError.textContent = t("loginSucess");
    }

    //Borramos el mensaje de error si hubiese
    authError.textContent = "";
    // Cerrar modal con Bootstrap
    const modal = bootstrap.Modal.getInstance(document.getElementById("authModal"));
    modal.hide(); // Cerramos el diálogo de inicio de sesión
    saveNotice.textContent = ""; //Borramos el mensaje de que los pokémon no se guardan
    

  } catch (err) {
    //Si da error, avisa por un texto en el cuadro
    if (err.message == "Firebase: Error (auth/invalid-credential).") {
        authError.textContent = "❌ Error: Usuario o contraseña incorrectos" 
    } else {
    authError.textContent = err.message;
    }
  }
});

// Cerrar sesión
authButton.addEventListener("click", async () => {
  if (auth.currentUser) {
    //Confirmamos si de verdad desea cerrar sesión
    const confirmar = confirm(t("sureCloseSession"));
    if (confirmar) {
      await signOut(auth);
    }
  }
});

// Detectar cambios de sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Mostramos al usuario con qué correo se ha logeado
    userGreeting.textContent = tv("helloUser", { email: user.email });
    userGreeting.classList.remove("d-none");
    userGreeting.setAttribute("data-i18n", "helloUser");
    userGreeting.setAttribute("data-vars", JSON.stringify({ email: user.email }));
    userGreeting.classList.remove("d-none");
    
    // Inicializa el texto según idioma actual
    changeLanguage(currentLang);

    //Cambiamos a la opción de cerrar sesión
    authButton.textContent = t("logout");
    authButton.classList.remove("btn-primary");
    authButton.classList.add("btn-danger");

    // Cambiamos la acción al pulsar el botón
    authButton.removeAttribute("data-bs-toggle");
    authButton.removeAttribute("data-bs-target");

    // Usuario logueado: cargar cajas 
    cargarCajasDesdeDB();
    cargarListaEquipos();

    
    // Mostrar icono de guardar manualmente
    guardarCajasbtn.classList.remove("d-none");
  } else {
    // Usuario no logueado, quitamos el mensaje de saludo
    userGreeting.textContent = "";
    userGreeting.classList.add("d-none");

    //Ponemos el botón de iniciar sesión
    authButton.textContent = t("login");
    authButton.classList.remove("btn-danger");
    authButton.classList.add("btn-primary");

    // Cambiamos la acción al pulsar el botón
    authButton.setAttribute("data-bs-toggle", "modal");
    authButton.setAttribute("data-bs-target", "#authModal");

    // Ocultar icono de guardar manualmente
    guardarCajasbtn.classList.add("d-none");
  }
});

// Evento click del icono
guardarCajasbtn.addEventListener("click", () => {
  guardarCajasEnDB();
});