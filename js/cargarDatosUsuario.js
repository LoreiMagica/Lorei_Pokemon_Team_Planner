import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { auth, rt } from "./firebaseConfig.js";
import { Pokemon } from "./DataModel/Pokemon.js";
import { renderBox, boxes, setCurrentBoxIndex  } from "./cajasPc.js"; // La función para dibujar la caja
import { delay } from "./firebaseSubirDatos.js";
import { equipoTabla, recuadros } from "./organizarEquipo.js"; //Equipo actual mostrado en la sección equipo y sus recuadros de perfil
import { generarTablaColores, generarTablaNumeros } from "./organizarTablas.js"; //Las tablas de tipos para dibujarlas al cargar equipos
import { pokedex } from "./firebaseCargarDatos.js" //La pokédex para consultar el pokémon
import { movesData } from "./firebaseCargarDatos.js"; //La lista de movimientos para consultarlo también
import { cargarPokedex } from "./firebaseCargarDatos.js";


const listaEquipos = document.getElementById("listaEquipos"); //select para elegir equipo a cargar 
const cargarEquipoBtn = document.getElementById("cargarEquipoBtn"); //Botón de cargar equipo seleccionado

// Función para guardar las cajas actuales en la base de datos
export async function cargarCajasDesdeDB() {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const dbRef = ref(rt, `users/${uid}/boxes`);
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) return;

      const cajasData = snapshot.val();

      // Limpiar cajas actuales
        boxes.length = 0; // vaciar el array sin reasignar

      // Redibujar las cajascon objetos Pokemon
        Object.values(cajasData).forEach(boxData => {
      const slotsArray = Array.from({ length: 30 }, (_, i) => {
        if (!boxData.slots) return null;

        const slot = boxData.slots[i];
        if (!slot) return null;

        return new Pokemon(
          slot.id,
          slot.species,
          slot.forma,
          slot.tipo1,
          slot.tipo2,
          slot.moveIds,
          slot.moveNames,
          slot.ability,
          slot.abilityName
        );
      });

      boxes.push({
        name: boxData.name || "Caja",
        slots: slotsArray
      });
    });

    // Renderizar la primera caja
    setCurrentBoxIndex(0);
    cargarPokedex(speciesList, pokedex).then(() => {
    // Ahora sí podemos a dibujar la caja
    renderBox();
  });
  console.log("✅ Cajas cargadas desde Realtime Database");
  cargarPokedex(speciesList, pokedex);}



//Ahora, si guarda equipos, también hay que meterlos en el select
export async function cargarListaEquipos() {

  //Como siempre, es una función para usuarios logeados
  if (!auth.currentUser) return;

  //Obtenemos el uid para buscar en su carpeta
  const uid = auth.currentUser.uid;

  try {
    const snapshot = await get(child(ref(rt), `users/${uid}/teams`));
    listaEquipos.innerHTML = `<option value="" data-i18n="selectTeam" >${t("selectTeam")}</option>`; //Opción por defecto
    
    if (snapshot.exists()) {
      const equipos = snapshot.val();
    //Si encuentra un equipo, lo agrega al select como opción para elegfir
      Object.keys(equipos).forEach(nombre => {
        const option = document.createElement("option");
        option.setAttribute("data-i18n", "selectTeam");
        option.value = nombre;
        option.textContent = nombre;
        listaEquipos.appendChild(option);
      });
    }
  } catch (error) {
    console.error("❌ Error cargando lista de equipos:", error);
  }
}

// Y por último, la opción de cargar un equipo seleccionado
cargarEquipoBtn.addEventListener("click", async () => {
  if (!auth.currentUser) {
    alert(t("must_login_to_load_team"));
    return;
  }

  //Si cargas sin elegir un equipo, avisa al usuario
  const nombreEquipo = listaEquipos.value;
  if (!nombreEquipo) {
    alert(t("first_select_a_team"));
    return;
  }

  //Lo de siempre del uid
  const uid = auth.currentUser.uid;

  try {
    const snapshot = await get(child(ref(rt), `users/${uid}/teams/${nombreEquipo}`));
    if (snapshot.exists()) {
      const data = snapshot.val().equipo;

      // Reconstruir el equipoTabla con todos los datos de los pokémon
      data.forEach((pData, i) => {
        if (pData) {
          equipoTabla[i] = new Pokemon(
            pData.id,
            pData.species,
            pData.forma,
            pData.tipo1,
            pData.tipo2,
            pData.moveIds,
            pData.moveNames,
            pData.ability,
            pData.abilityName
          );

          
        } else {
          equipoTabla[i] = new Pokemon(); // Si no hay un pokémon ahí, lo deja vacío
        }
      });

      //Dibujamos las tablas de tipos
      generarTablaColores();
      generarTablaNumeros();
      renderizarEquipo();
    } else {
      //Si hay un error raro de un equipo borrado o algo, notifica
      alert(t("team_doesnt_exists"));
    }
  } catch (error) {
    //Si sucede un error, avisa al usuario
    console.error("Error cargando equipo:", error);
    alert(t("error_loading_team"));
  }
});

//Función para dibujar los equipos en sus huecos de equipo (Esto se volvió más tocho de lo esperado)
function renderizarEquipo() {
  recuadros.forEach((recuadro, i) => {
    const pokemon = equipoTabla[i];
    const img = recuadro.querySelector("img");
    const [ataque1, ataque2, ataque3, ataque4, habilidad] = recuadro.querySelectorAll("div");

    // Resetear contenido
    img.src = "images/pokemon-model/0.png";
    ataque1.textContent = ataque2.textContent = ataque3.textContent = ataque4.textContent = habilidad.textContent = "";
    ataque1.className = ataque2.className = ataque3.className = ataque4.className = "ataque";
    habilidad.className = "";

    if (pokemon && pokemon.id && pokemon.id !== 0) {
      // Cambiar sprite
      const entry = pokedex.find(p => p.nombre === pokemon.species);
      if (entry) {
        img.src = `images/pokemon-model/${entry.id}${pokemon.forma?.toLowerCase() || ""}.png`;
      }

      // Movimientos con color
      pokemon.moveNames.forEach((m, idx) => {
        if (m) {
          const movData = movesData.find(md => md.id === pokemon.moveIds[idx]);
          const tipo = movData ? movData.tipo : "mystery";
          const ataqueDiv = [ataque1, ataque2, ataque3, ataque4][idx];
          ataqueDiv.textContent = m;
          ataqueDiv.classList.add(`${tipo}_type`);
        }
      });

      // Habilidad
      if (pokemon.abilityName) {
        habilidad.textContent = pokemon.abilityName;
        habilidad.classList.add("habilidad");
      }
    }
  });
}




