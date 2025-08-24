//Importamos el slot y caja seleccionado para leer el Pokémon
import { selectedSlotIndex, boxes, currentBoxIndex } from "./cajasPc.js";
import { Pokemon } from "./DataModel/Pokemon.js";
import { movesData } from "./firebaseCargarDatos.js";
import { generarTablaColores, generarTablaNumeros } from "./organizarTablas.js";
import { pokedex } from "./firebaseCargarDatos.js";
import { t} from "./i18n.js";





// crear recuadros para los pokémon
const recuadrosEquipoContainer = document.getElementById("recuadrosEquipoContainer");
const numRecuadros = 6;
export let recuadros = [];

// Array con tus Pokémon del equipo para mostrar en las tablas
export const equipoTabla = [new Pokemon, new Pokemon, new Pokemon, new Pokemon, new Pokemon, new Pokemon];


// Crear los recuadros de equipo
for (let i = 0; i < numRecuadros; i++) {
  const recuadro = document.createElement("div");
  recuadro.classList.add("recuadroEquipo");
  recuadro.dataset.index = i;

  // Botón para añadir el Pokémon del slot seleccionado
  const addBtn = document.createElement("button");
  addBtn.setAttribute("data-i18n", "addPokemonTeam"); // <-- clave de traducción
  addBtn.textContent = t("addPokemonTeam");
  addBtn.id = `equipoPokemon${i}`;
  addBtn.classList.add("btn", "btn-sm", "btn-success");
  addBtn.disabled = true;
  recuadro.appendChild(addBtn);

    // Nuevo botón para limpiar el recuadro
  const clearBtn = document.createElement("button");
  clearBtn.setAttribute("data-i18n", "cleanPokemonTeam"); // <-- clave de traducción
  clearBtn.textContent = t("cleanPokemonTeam");
  clearBtn.classList.add("btn", "btn-sm", "btn-secondary");
  recuadro.appendChild(clearBtn);

  // Contenedor de datos del Pokémon
  const img = document.createElement("img");
  img.src = "images/pokemon-model/0.png";
  recuadro.appendChild(img);

  // Recuadro para mostrar los movuimientos y habilidad
  const ataque1 = document.createElement("div");
  const ataque2 = document.createElement("div");
  const ataque3 = document.createElement("div");
  const ataque4 = document.createElement("div");
  const habilidad = document.createElement("div");

  //Los agregamos al div
  recuadro.appendChild(ataque1);
  recuadro.appendChild(ataque2);
  recuadro.appendChild(ataque3);
  recuadro.appendChild(ataque4);
  recuadro.appendChild(habilidad);

  // Evento del botón: añade el Pokémon del slot seleccionado
  addBtn.addEventListener("click", (event) => {
    if (selectedSlotIndex === null) {
      alert(t("selectPokemonFirst"));
      return;
    }

    const currentBox = boxes[currentBoxIndex];
    const pokemon = currentBox.slots[selectedSlotIndex];

    //Si no hay pokémon en el puntero, lo notificamos
    if (!pokemon) {
      alert(t("noPokemonInSlot"));
      return;
    }

    let tipoMovimiento = []; //Array para almacenar los tipos de movimientos y mostrar el background de su color

    //Buscamos los tipos de movimientos del Pokémon 
    for (let i = 0; i < pokemon.moveIds.length; i++) {
        // Buscar dentro del array movesData
        let movimiento = movesData.find(m => m.id === pokemon.moveIds[i]);

        if (movimiento) {
            tipoMovimiento.push(movimiento.tipo);
        }
    }

    // Llenamos los recuadros de detalles del pokémon con los nombres de los movimientos y habilidad
    const entry = pokedex.find(p => p.id === pokemon.id);
    if (entry) {
      img.src = `images/pokemon-model/${pokemon.id}${pokemon.forma?.toLowerCase() || ""}.png`;
    }
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
    if (habilidad.textContent != ""){habilidad.classList.add("habilidad");}

    //CALCULA TABLA
    let id = event.target.id
    for (let j = 0; j < 6; j++) {
      if (id === `equipoPokemon${j}`) {
        equipoTabla[j] = pokemon
        //console.log(`✅ Pokémon añadido al equipo en la ranura ${j}:`, pokemon);
        //console.log("Equipo actual:", equipoTabla);
      }
    }
    // Ejecutar actualización de las tablas
    generarTablaColores();
    generarTablaNumeros();

  });

    // Evento del nuevo botón “Limpiar cuadro”
  clearBtn.addEventListener("click", () => {
    // Reset imagen
    img.src = "images/pokemon-model/0.png";

    // Reset ataques
    [ataque1, ataque2, ataque3, ataque4].forEach(a => {
      a.textContent = "";
      a.className = "ataque";
    });

    // Reset habilidad
    habilidad.textContent = "";
    habilidad.className = "";

    // Reset el array de equipo
    equipoTabla[i] = new Pokemon();

    // Actualizar tablas de colores y números
    generarTablaColores();
    generarTablaNumeros();
  });

  //Y lo añadimos al contenedor
  recuadrosEquipoContainer.appendChild(recuadro);
  recuadros.push(recuadro);
}


export function actualizarBotonesAnadir() {
  recuadros.forEach(recuadro => {
    const btn = recuadro.querySelector("button");
    btn.disabled = selectedSlotIndex === null;
  });
}

// Ejecutar generación de tablas
generarTablaColores();
generarTablaNumeros();
