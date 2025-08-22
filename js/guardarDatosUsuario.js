//Firebase Realtime Database
import { rt, auth } from "./firebaseConfig.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { boxes } from "./cajasPc.js";


// Guarda los datos en firebase RealTime Database
export function guardarCajasEnDB() {
  const user = auth.currentUser;
  if (!user) return 

  const uid = user.uid; // Obtenemos el Uid del usuario
  const cajasData = generarCajasParaDB(); //Obtenemos los datos de cada pokémon en la caja

  // Guardar bajo "users/<uid>/boxes"
  set(ref(rt, `users/${uid}/boxes`), cajasData)
    .then(() => console.log("Cajas guardadas correctamente en Realtime Database"))
    .catch(err => console.error("Error guardando cajas:", err));
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