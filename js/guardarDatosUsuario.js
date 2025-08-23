//Firebase Realtime Database
import { rt, auth } from "./firebaseConfig.js";
import { ref, set, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import { boxes } from "./cajasPc.js";
import { equipoTabla } from "./organizarEquipo.js"; //Equipo actual mostrado en la sección equipo y sus recuadros de perfil
import { cargarListaEquipos } from "./cargarDatosUsuario.js";


const guardarEquipoBtn = document.getElementById("guardarEquipoBtn"); //Botón para guardar equipo
const listaEquipos = document.getElementById("listaEquipos"); //select para elegir equipo a cargar 

// Guarda los datos en firebase RealTime Database
export function guardarCajasEnDB() {
  const user = auth.currentUser;
  if (!user) return 

  const uid = user.uid; // Obtenemos el Uid del usuario
  const cajasData = generarCajasParaDB(); //Obtenemos los datos de cada pokémon en la caja

  // Guardar bajo "users/<uid>/boxes"
  set(ref(rt, `users/${uid}/boxes`), cajasData)
    .then(() => console.log("✅ Cajas guardadas correctamente en Realtime Database"))
    .catch(err => console.error("❌ Error guardando cajas:", err));
}

// Convierte tus boxes a datos planos
export function generarCajasParaDB() {
  return boxes.map(box => ({
    name: box.name,
    slots: box.slots.map(slot => {
      if (!slot) return null;
      return {
        id: slot.id,
        species: slot.species,
        forma: slot.forma,
        tipo1: slot.tipo1,
        tipo2: slot.tipo2,
        moveIds: slot.moveIds,
        moveNames: slot.moveNames,
        ability: slot.ability,
        abilityName: slot.abilityName
      };
    })
  }));
}


 // Guarda las cajas del usuario en un JSON descargable con el UID como nombre de archivo.
export function guardarCajasEnJSON(boxesData) {
  const user = auth.currentUser;
  if (!user) return; // No hay usuario logueado, nos vamos

  //Obtenemos el uid del usuario lofgeado
  const uid = user.uid;
  const jsonString = JSON.stringify(boxesData, null, 2); // formato legible

  //Creamos un esquema
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${uid}.json`; //Damos nombre con el uid del usuario único
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

//Convierte objetos pokémon en un formato json
export function generarCajasParaJSON() {
  return boxes.map(box => ({
    name: box.name,
    slots: box.slots.map(slot => {
      if (!slot) return null; // ranura vacía, nos vamos
      return {
        id: slot.id,
        species: slot.species,
        forma: slot.forma,
        tipo1: slot.tipo1,
        tipo2: slot.tipo2,
        moveIds: slot.moves,
        moveNames: slot.moveNames,
        ability: slot.ability,
        abilityName: slot.abilityName
      };
    })
  }));
}

// Función para guardar el equipo actual en realtime database
guardarEquipoBtn.addEventListener("click", async () => {
  if (!auth.currentUser) {
    alert(t("must_login_to_save_team"));
    return;
  }

    // Validación: ¿hay algún Pokémon agregado al equipo?
  const hayPokemon = equipoTabla.some(p => p && p.id && p.id !== 0);
  if (!hayPokemon) {
    alert(t("add_pokemon_to_save"));
    return;
  }

    //Pide un nombre para el equipo en el propio alert
  const nombreEquipo = prompt(t("enter_team_name"));
  //Si el nombre es nulo, cancela la operación
  if (!nombreEquipo) {
   alert(t("operation_cancelled"));
    return;
  }

  //Obtenemos el uid del usuario logeado para guardarlo en su carpeta de la base de datos
  const uid = auth.currentUser.uid;

  // Guardamos el equipo en Firebase realtimeDatabase
  try {
    await set(ref(rt, `users/${uid}/teams/${nombreEquipo}`), {
      equipo: equipoTabla.map(p => p ? {
        id: p.id || null,
        species: p.species || null,
        forma: p.forma || null,
        tipo1: p.tipo1 || null,
        tipo2: p.tipo2 || null,
        moveIds: p.moveIds || [],
        moveNames: p.moveNames || [],
        ability: p.ability || null,
        abilityName: p.abilityName || null
      } : null)
    });

    //Si todo va bien, notifica al usuario
    alert(tv("team_saved", { nombreEquipo: nombreEquipo }));
    await cargarListaEquipos(); // refresca el select
  } catch (error) {
    //Si sucede un error, también avisa
    console.error("❌ Error guardando equipo:", error);
    alert(t("error_saving_team"));
  }
});

// Función para eliminar un equipo guardado de la base de datos
document.getElementById("eliminarEquipoBtn").addEventListener("click", async () => {
  const select = document.getElementById("listaEquipos");
  const nombreEquipo = select.value;

  if (!nombreEquipo) {
    alert(t("select_team_to_erase"));
    return;
  }

  // Confirmación antes de borrar
  if (!confirm(tv("sure_erase", { nombreEquipo: nombreEquipo }))) {
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Ruta del equipo en Firebase realtimeDatabase
        const equipoRef = ref(rt, `users/${user.uid}/teams/${nombreEquipo}`);
        await remove(equipoRef);

        // Eliminar también del select
        select.querySelector(`option[value="${nombreEquipo}"]`).remove();
        select.value = ""; //Seleccionamos el value por defecto

        //Notifica al usuario salga bien o mal
        alert(tv("erase_team_correct", { nombreEquipo: nombreEquipo }));
      } catch (error) {
        console.error("❌ Error al eliminar equipo:", error);
        alert(t("erase_team_fail"));
      }
    } else {
      alert(t("must_login_to_erase"));
    }
  });
});
