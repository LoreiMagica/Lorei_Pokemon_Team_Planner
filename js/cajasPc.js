//Función para actualizar el icono del movimiento al clickar un pokémon
import { actualizarIcono } from "./firebaseDatos.js";
import { Pokemon } from "./DataModel/Pokemon.js"; // Importamos la clase Pokemon
import { pokemonFormas } from "./firebaseDatos.js";


//Buscamos todos los elementos html de index.html
const boxGrid = document.getElementById("boxGrid");
const pokemonForm = document.getElementById("pokemonForm");
const boxNameInput = document.getElementById("boxName");
const addBoxBtn = document.getElementById("addBox");
const prevBoxBtn = document.getElementById("prevBox");
const nextBoxBtn = document.getElementById("nextBox");

const speciesInput = document.getElementById("speciesInput"); //El input de nombre de pokémon
const formSelect = document.getElementById("formasSelect"); //El input de formas pokemon

const crearPokemonBtn = document.getElementById("crearPokemonBtn"); //Botón de eliminar el pokémon
const limpiarFormularioBtn = document.getElementById("limpiarFormularioBtn"); //Botón para limpiar el formulario
const deleteBtn = document.getElementById("deletePokemon"); //Botón de eliminar el pokémon


export let selectedSlotIndex = null; // índice del slot seleccionado
export let pokedex = []; //Array de nombres e IDs de pokémon para luego buscar sus formas
export let boxes = []; //Array para almacenar las cajas de Pokémon
export let currentBoxIndex = 0; //Caja que se está mostrando ahora mismo


// Y ahora obtenemos los iconos de los movimientos para que quede más "aesthetic"
const moveIcons = [
  document.getElementById("icon1"),
  document.getElementById("icon2"),
  document.getElementById("icon3"),
  document.getElementById("icon4"),
];

// Crear nueva caja
function createEmptyBox(name = `Caja ${boxes.length + 1}`) {
  return { name, slots: Array(30).fill(null) };
}

// Renderizar caja actual
function renderBox() {
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

      // Si hay un Pokémon, rellenamos el formulario
      if (pokemon) {
        //console.log(`Seleccionado Pokémon: ${pokemon.species} en la ranura ${i}`);
        pokemon.fillForm(actualizarIcono);
        crearPokemonBtn.textContent = "Editar Pokémon"; // Cambiar texto del botón

        // Seteamos la imagen guardada del pokémon
        actualizarImagenPokemon();
      } else {
        crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón
      }
    });

    boxGrid.appendChild(slot);
  });
}

// Inicialización
boxes.push(createEmptyBox());
renderBox();

// Eventos
//Cambiar nombre a la caja
boxNameInput.addEventListener("input", () => {
  boxes[currentBoxIndex].name = boxNameInput.value;
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
    selectedSlotIndex = null;
  }
});

//Ir a la caja siguiente
nextBoxBtn.addEventListener("click", () => {
  if (currentBoxIndex < boxes.length - 1) {
    currentBoxIndex++;
    renderBox();
    selectedSlotIndex = null;
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
  

  // Ids de movimientos que conoce ahora mismo
  const moveIds = [
    document.getElementById("move1").value,
    document.getElementById("move2").value,
    document.getElementById("move3").value,
    document.getElementById("move4").value,
  ].filter(m => m); // quita los vacíos


  // Nombres de movimientos que conoce ahora mismo
const moveNames = ["move1", "move2", "move3", "move4"]
  .map(id => {
    const sel = document.getElementById(id);
    return sel.value ? sel.options[sel.selectedIndex].text : null;
  })
  .filter(Boolean); // quita nulls

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
    console.log( currentBox.slots[targetIndex])
    renderBox();
  } else {
    // Si no hay espacio, mostramos un mensajede error
    alert("La caja está llena.");
  }

    // Limpiar el formulario después de añadir el Pokémon
  pokemonForm.reset();
  pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
  moveIcons.forEach(icono => {
    icono.src = `images/types/mystery.svg`; // Reiniciar iconos de movimientos
  }) 
  crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón
  selectedSlotIndex = null;

});

  // Limpiar el formulario a petición del usuario
limpiarFormularioBtn.addEventListener("click", () =>  {
  pokemonForm.reset();
  pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
  moveIcons.forEach(icono => {
    icono.src = `images/types/mystery.svg`;  // Reiniciar iconos de movimientos
    
  })
  crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón 

})

//Función para borrar un pokémon guardado en la caja
deleteBtn.addEventListener("click", () => {
  if (selectedSlotIndex === null) {
    alert("Selecciona un Pokémon de la caja para eliminarlo.");
    return;
  }

  const currentBox = boxes[currentBoxIndex];
  
  //Comprobamos que el slot esté ocupado
  if (currentBox.slots[selectedSlotIndex]) {
    let pokemon = currentBox.slots[selectedSlotIndex]
    console.log(pokemon);
    if(pokemon != null) {
    // Confirmación opcional
    const confirmDelete = confirm(`¿Seguro que quieres eliminar este ${pokemon.species}${pokemon.forma} ?`);
    if (!confirmDelete) return;

    // Vaciar el slot
    currentBox.slots[selectedSlotIndex] = null;

    // Resetear formulario y selección
    pokemonForm.reset();
    selectedSlotIndex = null;
    pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
    moveIcons.forEach(icono => {
      icono.src = `images/types/mystery.svg`;  // Reiniciar iconos de movimientos
    }) 
    crearPokemonBtn.textContent = "Añadir a la Caja"; // Reiniciar texto del botón

    // Volver a renderizar la caja
    renderBox();
    }

  } else {
    alert("Ese slot ya está vacío.");
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
  console.log(`Cargando imagen para: ${speciesName} con forma: ${formValue}: images/pokemon-model/${entry.id}${formValue?.toLowerCase() || ""}.png`);
  if (entry) {
    pokemonImage.src = `images/pokemon-model/${entry.id}${formValue?.toLowerCase() || ""}.png`;
  }else{
  
    //Si el usuario escribe el nombre mal, lo notifica, y pone la imagen por defecto
    console.error(`No se encontró la imagen para el Pokémon: ${speciesName}`);
    pokemonImage.src = "images/pokemon-model/0.png";
  }

}




