//Importamos el slot y caja seleccionado para leer el Pokémon
import { selectedSlotIndex, boxes, currentBoxIndex, pokedex } from "./cajasPc.js";
import { movesData } from "./firebaseDatos.js";

// crear recuadros para los pokémon
const recuadrosEquipoContainer = document.getElementById("recuadrosEquipoContainer");
const numRecuadros = 6;
const recuadros = [];

// Crear los recuadros
for (let i = 0; i < numRecuadros; i++) {
  const recuadro = document.createElement("div");
  recuadro.classList.add("recuadroEquipo");
  recuadro.dataset.index = i;

  // Botón para añadir el Pokémon del slot seleccionado
  const addBtn = document.createElement("button");
  addBtn.textContent = "Añadir Pokémon";
  addBtn.classList.add("btn", "btn-sm", "btn-success");
  recuadro.appendChild(addBtn);

  // Contenedor de datos del Pokémon
  const img = document.createElement("img");
  img.src = "images/pokemon-model/0.png";
  recuadro.appendChild(img);

  const ataque1 = document.createElement("div");
  const ataque2 = document.createElement("div");
  const ataque3 = document.createElement("div");
  const ataque4 = document.createElement("div");
  const habilidad = document.createElement("div");

  recuadro.appendChild(ataque1);
  recuadro.appendChild(ataque2);
  recuadro.appendChild(ataque3);
  recuadro.appendChild(ataque4);
  recuadro.appendChild(habilidad);

  // Evento del botón: añade el Pokémon del slot seleccionado
  addBtn.addEventListener("click", () => {
    if (selectedSlotIndex === null) {
      alert("Selecciona un Pokémon de la caja primero.");
      return;
    }

    const currentBox = boxes[currentBoxIndex];
    const pokemon = currentBox.slots[selectedSlotIndex];
    if (!pokemon) {
      alert("No hay Pokémon en el slot seleccionado.");
      return;
    }

    let tipoMovimiento = [];

    for (let i = 0; i < pokemon.moves.length; i++) {
        // Buscar dentro del array moves.Data
        let movimiento = movesData.find(m => m.id === pokemon.moves[i]);

        if (movimiento) {
            tipoMovimiento.push(movimiento.tipo);
            console.log(`Movimiento encontrado: ${movimiento.nombre} con tipo ${movimiento.tipo}`);
        }
    }

    img.src = `images/pokemon-model/${pokedex[pokemon.species]}${pokemon.forma?.toLowerCase() || ""}.png`;
    ataque1.textContent = pokemon.moveNames[0] || "";
    ataque1.classList.add(`${tipoMovimiento[0]}_type` || "mystery_type");
    ataque1.classList.add("ataque");

    ataque2.textContent = pokemon.moveNames[1] || "";
    ataque2.classList.add(`${tipoMovimiento[1]}_type` || "mystery_type");
    ataque2.classList.add("ataque");

    ataque3.textContent = pokemon.moveNames[2] || "";
    ataque3.classList.add(`${tipoMovimiento[2]}_type` || "mystery_type");
    ataque3.classList.add("ataque");

    ataque4.textContent = pokemon.moveNames[3] || "";
    ataque4.classList.add(`${tipoMovimiento[3]}_type` || "mystery_type");
    ataque4.classList.add("ataque");


    habilidad.textContent = pokemon.abilityName || "";
  });

  recuadrosEquipoContainer.appendChild(recuadro);
  recuadros.push(recuadro);
}
