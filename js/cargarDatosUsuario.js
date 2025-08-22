import { ref, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { auth, rt } from "./firebaseConfig.js";
import { Pokemon } from "./DataModel/Pokemon.js";
import { renderBox, boxes, setCurrentBoxIndex  } from "./cajasPc.js"; // La función para dibujar la caja
import { delay } from "./firebaseSubirDatos.js";

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
    await delay(200);
    renderBox();
    console.log("Cajas cargadas desde Realtime Database");

    
}
