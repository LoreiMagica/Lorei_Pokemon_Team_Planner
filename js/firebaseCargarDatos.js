// Imports de firebase
import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { PokemonForma } from "./DataModel/PokemonForma.js"; //Objeto para guardar las formas de los pokémon
import { Movimiento } from "./DataModel/Movimiento.js";  //Objeto para los movimientos de pokémon
import { Habilidad } from "./DataModel/Habilidad.js";  //Objeto para crear habilidades
import { currentLang } from "./i18n.js";  //Objeto para crear habilidades


// Obtenemos los movimientos del formulario
const moveSelects = [
  document.getElementById("move1"),
  document.getElementById("move2"),
  document.getElementById("move3"),
  document.getElementById("move4"),
];

// Y ahora obtenemos los iconos de los movimientos para que quede más "aesthetic"
const moveIcons = [
  document.getElementById("icon1"),
  document.getElementById("icon2"),
  document.getElementById("icon3"),
  document.getElementById("icon4"),
];

export let pokedex = []; //Array de nombres e IDs de pokémon para luego buscar sus formas


//Array de formas de pokémon
export const pokemonFormas = []; // Array global de formas
//Array de movimientos de pokémon 
export const movesData = [];  
// Array global de habilidades
export const abilitiesData = [];

// Obtenemos el select de habilidades del html
const abilitySelect = document.getElementById("ability");

const speciesList = document.getElementById("speciesList");



// 🔹 Función para cargar pokedex en el datalist para mostrarlo en el formulario
export async function cargarPokedex(speciesDatalist, pokedex) {
  console.log(currentLang)

  const querySnapshot = await getDocs(collection(db, "pokedex"))

  //Vaciamos las listas con nombres de pokémon para evitar duplicados
  speciesList.innerHTML = ''
  pokedex.length = []

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();


    // Si el documento tiene un nombre de pokémon, lo añadimos al datalist
    if (data.nombre) {
      // tomamos el nombre en el idioma actual o, por defecto, en inglés
      let nombre = data[currentLang] ?? data["en"];

      //Como soy mu lista y puse la columna de nombre español como "nombre", he de hacerle un if especial pa él
      if (currentLang == "es") {nombre = data.nombre}

      //Y ahora seteamos
      const option = document.createElement("option");
      option.value = nombre;
      speciesDatalist.appendChild(option);
      pokedex.push({
        id: parseInt(docSnap.id),
        nombre, //Seteamos el nombre que hemos obtenido
        tipo1: data.tipo1,
        tipo2: data.tipo2
      });
    }
  });
}

// 🔹 Función para cargar formas de un pokémon en el formulario
export async function cargarFormas(pokemonName, pokedex, formSelect) {
  formSelect.innerHTML = `<option value="">${t("formName")}</option>`;
  //Buscamos el pokémon en el array
  const entry = pokedex.find(p => p.nombre === pokemonName);
  
  //Obtenemos el id del pokémon
  const no = entry ? entry.id : null;
  
  //Si no encuentra id, sale del método
  if (!no) return;

  //Comparamos el número del pokémon elegido por el usuario con las formas en la colección "pokedex_forms"
  const q = query(collection(db, "pokedex_forms"), where("no", "==", no));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

      // tomamos el nombre en el idioma actual o, por defecto, en inglés
      let nombre = data[currentLang] ?? data["en"];

      //Como soy mu lista y puse la columna de nombre español como "nombre", he de hacerle un if especial pa él
      if (currentLang == "es") {nombre = data.nombre}

    // 🔹 Almacenar objeto PokemonForma en su array
    pokemonFormas.push( new PokemonForma(
      data.no,
      data.forma,
      data.tipo1 || "",
      data.tipo2 || ""
    ));
    //console.log(pokemonFormas);

    // Si el documento tiene un nombre de forma, lo añadimos al select
    if (data.nombre) {
      const option = document.createElement("option");
      option.value = data.forma;
      option.textContent = nombre;//Seteamos el nombre que hemos obtenido
      formSelect.appendChild(option);
    }
  });
}


// 🔹 Función para cargar movimientos en los selects del formulario
export async function cargarMovimientos() {
  try {
    const snapshot = await getDocs(collection(db, "pokedex_moves"));

    //Limpiamos el array por si acaso
    movesData.length = 0;

    //Por cada movimiento obtenido, lo añadimos al array de movimientos
    snapshot.forEach((doc) => {
      const data = doc.data();

      // tomamos el nombre en el idioma actual o, por defecto, en inglés
      let nombre = data[currentLang] ?? data["en"];

      //Como soy mu lista y puse la columna de nombre español como "nombre", he de hacerle un if especial pa él
      if (currentLang == "es") {nombre = data.nombre}

        movesData.push( new Movimiento(
                doc.id,
                nombre,
                data.tipo,
                data.categoria
          )
        );
      });

    // 🔹 Ordenamos alfabéticamente por nombre
    movesData.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre));

    // 🔹 Llenamos el datalist (una sola vez)
    const dataList = document.getElementById("movesList");
    dataList.innerHTML = "";

    
    movesData.forEach(move => {
      const option = document.createElement("option");
      option.value = move.nombre; // el texto visible
      option.dataset.id = move.id; // guardamos el id como extra
      dataList.appendChild(option);
    });

    // Eventos de cambio en cada input
    moveSelects.forEach((input, idx) => {
      input.addEventListener("change", () => {
        validarMovimiento(input);
        actualizarOpciones();  
        actualizarIcono(idx, input.value);
      });
    });


  } catch (err) {
    console.error("❌ Error cargando movimientos:", err);
  }
}

// 🔹 Función para actualizar las opciones disponibles en los selects de movimientos
function actualizarOpciones() {
  const seleccionados = moveSelects
    .map(input => input.value.trim())
    .filter(v => v !== "");

  const movesList = document.getElementById("movesList");
  [...movesList.options].forEach(opt => {
    if (seleccionados.includes(opt.value)) {
      opt.disabled = true;  // evita repetir
    } else {
      opt.disabled = false;
    }
  });
}
// 🔹 Función para actualizar el icono al lado del movimiento seleccionado
export function actualizarIcono(index, moveId) {

  //Buscamos el movimiento en el array de movimientos
  const move = movesData.find(m => m.nombre === moveId);

  if (move) {
    //Si lo encuentra, ponemos el icono del respectivo tipo
    moveIcons[index].src = `images/types/${move.tipo.toLowerCase()}.svg`;
    moveIcons[index].style.visibility = "visible";
  } else {
    //Sino, ponemos el genérico (???)
    moveIcons[index].src = `images/types/mystery.svg`;
  }
}

function validarMovimiento(input) {
  const movesList = document.getElementById("movesList");
  const valido = [...movesList.options].some(opt => opt.value === input.value);

  if (!valido) {
    input.setCustomValidity("Debes seleccionar un movimiento válido");
    input.reportValidity();
    input.value = ""; // limpiar si no es válido
  } else {
    input.setCustomValidity("");
  }
  input.setCustomValidity("");

}

// 🔹 Función para cargar las habilidades disponibles que modifican las debilidades o resistencias de tipos
export async function cargarHabilidades() {
  const querySnapshot = await getDocs(collection(db, "pokedex_abilities"));

  // Limpiamos el select antes de llenarlo
  abilitySelect.innerHTML = `<option value="">${t("abilitiesName")}</option>`;


  //Por cada habilidad obtenida, lo añadimos al array de habilidades (No son muchas)
  querySnapshot.forEach((doc) => {
    const data = doc.data();

          // tomamos el nombre en el idioma actual o, por defecto, en inglés
      let nombre = data[currentLang] ?? data["en"];

      //Como soy mu lista y puse la columna de nombre español como "nombre", he de hacerle un if especial pa él
      if (currentLang == "es") {nombre = data.nombre}

    abilitiesData.push(new Habilidad(
        doc.id,
        nombre,  //El nombre en el idioma que hemos seteado
        data.resistencia || [],
        data.debilidad || [],
        data.inmunidad || []
      ));
  });

  // 🔹 Ordenamos alfabéticamente por nombre
  abilitiesData.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre));

    //Creamos un option para cada habilidad
    abilitiesData.forEach(ability => {
    const option = document.createElement("option");
    option.value = ability.id;    //Valor del option
    option.textContent = ability.nombre;  //Nombre a mostrar en el select
    abilitySelect.appendChild(option);
  });
}

export async function recargarDatos(speciesList, pokedex) {
  // vaciar arrays
  pokedex.length = 0;
  pokemonFormas.length = 0;
  movesData.length = 0;
  abilitiesData.length = 0;


  // recargar desde Firebase
  await cargarPokedex(speciesList, pokedex);
  await cargarMovimientos();
  await cargarHabilidades();
}