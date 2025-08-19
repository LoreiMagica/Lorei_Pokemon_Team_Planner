//Buscamos todos los elementos html de index.html
const boxGrid = document.getElementById("boxGrid");
const pokemonForm = document.getElementById("pokemonForm");
const boxNameInput = document.getElementById("boxName");
const addBoxBtn = document.getElementById("addBox");
const prevBoxBtn = document.getElementById("prevBox");
const nextBoxBtn = document.getElementById("nextBox");

const speciesInput = document.getElementById("speciesInput"); //El input de nombre de pokémon
const formSelect = document.getElementById("formasSelect"); //El input de formas pokemon


export let pokedex = {}; //Array de nombres e IDs de pokémon para luego buscar sus formas
let boxes = []; //Array para almacenar las cajas de Pokémon
let currentBoxIndex = 0; //Caja que se está mostrando ahora mismo


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
      slot.title = `${pokemon.species}\nAtaques: ${pokemon.moves.join(", ")}\nHabilidad: ${pokemon.ability}`;

            // 🔹 Agregar imagen del Pokémon
      const img = document.createElement("img");
      let imageFile = pokedex[pokemon.species];
      if (pokemon.forma) imageFile += `${pokemon.forma.toLowerCase()}`;
      img.src = `images/pokemon-model/${imageFile}.png`;
      img.alt = pokemon.species;
      img.style.width = "60px";
      img.style.height = "60px";
      img.style.objectFit = "contain";

      slot.appendChild(img);
    }

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
  }
});

//Ir a la caja siguiente
nextBoxBtn.addEventListener("click", () => {
  if (currentBoxIndex < boxes.length - 1) {
    currentBoxIndex++;
    renderBox();
  }
});

// Añadir Pokémon
pokemonForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Nombre del pokémon
  const species = document.getElementById("speciesInput").value;

  // Movimientos que conoce ahora mismo
  const moveIds = [
    document.getElementById("move1").value,
    document.getElementById("move2").value,
    document.getElementById("move3").value,
    document.getElementById("move4").value,
  ].filter(m => m); // quita los vacíos


  //Habilidad aprendida
  const ability = document.getElementById("ability").value;

  const currentBox = boxes[currentBoxIndex];
  const emptyIndex = currentBox.slots.findIndex(s => s === null);
  const forma = formSelect.value; // Forma del Pokémon

    // Si hay espacio en la caja, añadimos el Pokémon
  if (emptyIndex !== -1) {
    currentBox.slots[emptyIndex] = { species, forma, moves: moveIds, ability };
    renderBox();
  } else {
    // Si no hay espacio, mostramos un mensajede error
    alert("La caja está llena.");
  }

    // Limpiar el formulario después de añadir el Pokémon
  pokemonForm.reset();
  pokemonImage.src = "images/pokemon-model/0.png"; // Reiniciar imagen del Pokémon
  moveIcons.forEach(icono => {
    icono.src = `images/types/mystery.svg`;
  }) 

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
  if (pokedex[speciesName]) {

    // 🔹 Si tiene imágenes con formato nombre_forma.png
      let imageFile = pokedex[speciesName];
  if (formValue) {
    // Si hay una forma seleccionada, añadimos el sufijo de la forma
    imageFile += `${formValue.toLowerCase()}`;
  }

  //Lo mostramos por consola para verlo, y tras eso lo seteamos
  console.log(`Cargando imagen para: ${speciesName} con forma: ${formValue}: ${imageFile}.png`);
  pokemonImage.src = `images/pokemon-model/${imageFile}.png`;

  }else{
  
    //Si el usuario escribe el nombre mal, lo notifica, y pone la imagen por defecto
    console.error(`No se encontró la imagen para el Pokémon: ${speciesName}`);
    pokemonImage.src = "images/pokemon-model/0.png";
  }

}




