//Función para actualizar el icono del movimiento al clickar un pokémon
import { actualizarIcono,  pokemonFormas, movesData } from "./firebaseCargarDatos.js";
import { auth } from "./firebaseConfig.js";
import { Pokemon } from "./DataModel/Pokemon.js"; // Importamos la clase Pokemon
import { guardarCajasEnDB } from "./guardarDatosUsuario.js"; //Función para guardar las cajas en firebase realtimeDatabase
import { actualizarBotonesAnadir } from "./organizarEquipo.js"; //Función para habilitar y deshabilitar los botones de añadir pok´emon al equipo
import { pokedex } from "./firebaseCargarDatos.js"; //Función para habilitar y deshabilitar los botones de añadir pok´emon al equipo



//Buscamos todos los elementos html de index.html
const boxGrid = document.getElementById("boxGrid");
const pokemonForm = document.getElementById("pokemonForm");
const boxNameInput = document.getElementById("boxName");
const addBoxBtn = document.getElementById("addBox");
const prevBoxBtn = document.getElementById("prevBox");
const nextBoxBtn = document.getElementById("nextBox");

const speciesInput = document.getElementById("speciesInput"); //El input de nombre de pokémon
const formSelect = document.getElementById("formasSelect"); //El input de formas pokemon

const crearPokemonBtn = document.getElementById("crearPokemonBtn"); //Botón de crear el pokémon
const limpiarFormularioBtn = document.getElementById("limpiarFormularioBtn"); //Botón para limpiar el formulario
const deleteBtn = document.getElementById("deletePokemon"); //Botón de eliminar el pokémon


export let selectedSlotIndex = null; // índice del slot seleccionado
export let boxes = []; //Array para almacenar las cajas de Pokémon
export let currentBoxIndex = 0; //Caja que se está mostrando ahora mismo

export function setCurrentBoxIndex(i) {
  currentBoxIndex = i;
}

// Y ahora obtenemos los iconos de los movimientos para que quede más "aesthetic"
const moveIcons = [
  document.getElementById("icon1"),
  document.getElementById("icon2"),
  document.getElementById("icon3"),
  document.getElementById("icon4"),
];

// Crear nueva caja
function createEmptyBox(name = tv("boxName", { boxes: boxes.length + 1 })) {
  return { name, slots: Array(30).fill(null) };
}

// Renderizar caja actual
export function renderBox() {
  boxGrid.innerHTML = "";
  const currentBox = boxes[currentBoxIndex];
  boxNameInput.value = currentBox.name;

  // Crear cada cuadrado de la caja donde puede agregarse un pokémon
  currentBox.slots.forEach((pokemon, i) => {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    //En caso de existir un Pokémon en la ranura, lo mostramos
    if (pokemon) {
      slot.classList.add("filled");
      slot.title = pokemon.getTooltip();

      // 🔹 Agregar imagen del Pokémon
      slot.appendChild(pokemon.renderImage(pokedex));

    }

    // 🔹 Evento al hacer click en el slot de la caja
    slot.addEventListener("click", () => {
      // Quitar selección previa en otro slot de la caja
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));

      // Marcar este nuevo slot
      slot.classList.add("selected");
      selectedSlotIndex = i;
      actualizarBotonesAnadir() //Actualizamos los botones de equipo


      // Si hay un Pokémon, rellenamos el formulario
      if (pokemon) {
        //console.log(`Seleccionado Pokémon: ${pokemon.species} en la ranura ${i}`);
        pokemon.fillForm(actualizarIcono);
        crearPokemonBtn.textContent = t("edit_pokemon"); // Cambiar texto del botón

        // Seteamos la imagen guardada del pokémon
            pokemonImage.src = pokemon.renderImage(pokedex).src
      } else {
        crearPokemonBtn.textContent = t("add_to_box"); // Reiniciar texto del botón
      }
    });
    actualizarBotonesAnadir()
    boxGrid.appendChild(slot);
  });
  selectedSlotIndex = null;  // reiniciamos el puntero al renderizar
  actualizarBotonesAnadir() //Actualizamos los botones de equipo
}

// Inicialización
boxes.push(createEmptyBox());
renderBox();

// Eventos
//Cambiar nombre a la caja
boxNameInput.addEventListener("input", () => {
  boxes[currentBoxIndex].name = boxNameInput.value;
  guardarCajasEnDB();
});

//Crear una nueva caja
addBoxBtn.addEventListener("click", () => {
  boxes.push(createEmptyBox());
  currentBoxIndex = boxes.length - 1;
  renderBox();
});

//Ir a la caja anterior
prevBoxBtn.addEventListener("click", () => {
  if (currentBoxIndex > 0) {
    currentBoxIndex--;
    renderBox();
  }
});

//Ir a la caja siguiente
nextBoxBtn.addEventListener("click", () => {
  if (currentBoxIndex < boxes.length - 1) {
    currentBoxIndex++;
    renderBox();
  }
});

// Añadir/Editar Pokémon
pokemonForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Nombre del pokémon
  const species = document.getElementById("speciesInput").value;
  
  //Buscamos el pokémon en el array
  const entry = pokedex.find(p => p.nombre === species);
  
  //Obtenemos el id del pokémon
  const idPokemon = entry ? entry.id : null;

  // Forma del Pokémon
  const forma = formSelect.value; 

  //Tipos del pokémon
  let tipo1 = "";
  let tipo2 = "";
  // 🔹 Si existe una forma que sobrescribe tipos, la aplicamos
  const formaMatch = pokemonFormas.find(f => f.no === idPokemon && f.forma === forma);
  if (formaMatch) {
    tipo1 = formaMatch.tipo1 || "";
    tipo2 = formaMatch.tipo2 || "";
  } else {
    // Si no, usamos los tipos del pokémon base
    tipo1 = entry?.tipo1 || "";
    tipo2 = entry?.tipo2 || "";
  }
  
  // Ids y nombres de movimientos que conoce ahora mismo
  const moves = ["move1", "move2", "move3", "move4"]
    .map(id => {
      const val = document.getElementById(id).value;
      return movesData.find(m => m.nombre === val) || null;
    })
    .filter(Boolean);

  const moveIds = moves.map(m => m.id);
  const moveNames = moves.map(m => m.nombre);

  //Id de habilidad aprendida
  const ability = document.getElementById("ability").value;

  //Nombre de habilidad aprendida
  const selAbility = document.getElementById("ability");
  const abilityName = selAbility.value ? selAbility.selectedOptions[0]?.text : "";

  //Caja actual donde se añadirá el Pokémon
  const currentBox = boxes[currentBoxIndex];

  // Posición del puntero seleccionado
  let targetIndex = selectedSlotIndex !== null ? selectedSlotIndex : currentBox.slots.findIndex(s => s === null);

    // Si hay espacio en la caja, añadimos el Pokémon
  if (targetIndex  !== -1) {
  currentBox.slots[targetIndex] = new Pokemon(idPokemon, species, forma, tipo1, tipo2, moveIds, moveNames, ability, abilityName);
    //console.log( currentBox.slots[targetIndex])
    renderBox();
    guardarCajasEnDB();
      // Si no hay usuario logueado, notificamos 
      if (!auth.currentUser) {
        saveNotice.textContent = t("login_to_save_pokemon");
        return; // Salimos sin guardar
      }

      // Limpiar el formulario después de añadir el Pokémon
      pokemonForm.reset();
      pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
      moveIcons.forEach(icono => {
        icono.src = `images/types/mystery.svg`; // Reiniciar iconos de movimientos
      }) 
    } else {
      // Si no hay espacio, mostramos un mensajede error
      alert(t("box_full"));
    }



  crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón
  selectedSlotIndex = null;
  actualizarBotonesAnadir() //Actualizamos los botones de equipo
});

  // Limpiar el formulario a petición del usuario
limpiarFormularioBtn.addEventListener("click", () =>  {
  pokemonForm.reset();
  pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
  moveIcons.forEach(icono => {
    icono.src = `images/types/mystery.svg`;  // Reiniciar iconos de movimientos
    
  })
  crearPokemonBtn.textContent = t("add_to_box"); // Reiniciar texto del botón 

})

//Función para borrar un pokémon guardado en la caja
deleteBtn.addEventListener("click", () => {
  if (selectedSlotIndex === null) {
    alert(t("select_pokemon_to_remove"));
    return;
  }

  const currentBox = boxes[currentBoxIndex];
  
  //Comprobamos que el slot esté ocupado
  if (currentBox.slots[selectedSlotIndex]) {
    let pokemon = currentBox.slots[selectedSlotIndex]
    console.log(pokemon);
    if(pokemon != null) {
    // Confirmación opcional
    const confirmDelete = confirm(tv("confirm_pokemon_delete", { pokemon: pokemon.species }));
    if (!confirmDelete) return;

    // Vaciar el slot
    currentBox.slots[selectedSlotIndex] = null;

    // Resetear formulario y selección
    pokemonForm.reset();
    selectedSlotIndex = null;
    actualizarBotonesAnadir() //Actualizamos los botones de equipo
    pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
    moveIcons.forEach(icono => {
      icono.src = `images/types/mystery.svg`;  // Reiniciar iconos de movimientos
    }) 
    crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón

    // Volver a renderizar la caja
    renderBox();
    guardarCajasEnDB();
    }

  } else {
    alert(t("slot_empty"));
  }
});

// Actualiza imagen preview del Pokémon al cambiar la especie o forma
export function actualizarImagenPokemon() {
  const speciesName = speciesInput.value;
  const formValue = formSelect.value;
  

  if (!speciesName) {
    pokemonImage.src = "images/pokemon-model/0.png";
    return;
  }

  // Verifica si el nombre del Pokémon existe en el pokedex
    // 🔹 Si tiene imágenes con formato nombre_forma.png
    const entry = pokedex.find(p => p.nombre === speciesName);

    
  //Lo mostramos por consola para verlo, y tras eso lo seteamos
  // Si hay una forma seleccionada, añadimos el sufijo de la forma
  //console.log(`Cargando imagen para: ${speciesName} con forma: ${formValue}: images/pokemon-model/${entry.id}${formValue?.toLowerCase() || ""}.png`);
  if (entry) {
    pokemonImage.src = `images/pokemon-model/${entry.id}${formValue?.toLowerCase() || ""}.png`;
  }else{
  
    //Si el usuario escribe el nombre mal, lo notifica, y pone la imagen por defecto
    console.error(`❌ No se encontró la imagen para el Pokémon: ${speciesName}`);
    pokemonImage.src = "images/pokemon-model/0.png";
  }

}