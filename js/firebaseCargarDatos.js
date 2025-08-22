// Imports de firebase
import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { PokemonForma } from "./DataModel/PokemonForma.js"; //Objeto para guardar las formas de los pokémon
import { Movimiento } from "./DataModel/Movimiento.js";  //Objeto para los movimientos de pokémon
import { Habilidad } from "./DataModel/Habilidad.js";  //Objeto para crear habilidades


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

//Array de formas de pokémon
export const pokemonFormas = []; // Array global de formas
//Array de movimientos de pokémon 
export const movesData = [];  
// Array global de habilidades
export const abilitiesData = [];

// Obtenemos el select de habilidades del html
const abilitySelect = document.getElementById("ability");


// 🔹 Función para cargar pokedex en el datalist para mostrarlo en el formulario
export async function cargarPokedex(speciesDatalist, pokedex) {
  const querySnapshot = await getDocs(collection(db, "pokedex"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // Si el documento tiene un nombre de pokémon, lo añadimos al datalist
    if (data.nombre) {
      const option = document.createElement("option");
      option.value = data.nombre;
      speciesDatalist.appendChild(option);
      pokedex.push({
        id: parseInt(docSnap.id),
        nombre: data.nombre,
        tipo1: data.tipo1,
        tipo2: data.tipo2
      });
    }
  });
}

// 🔹 Función para cargar formas de un pokémon en el formulario
export async function cargarFormas(pokemonName, pokedex, formSelect) {
  formSelect.innerHTML = '<option value="">-- Formas --</option>';
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
      option.textContent = data.nombre;
      formSelect.appendChild(option);
    }
  });
}


// 🔹 Función para cargar movimientos en los selects del formulario
export async function cargarMovimientos() {
  try {
    const snapshot = await getDocs(collection(db, "pokedex_moves"));

    //Por cada movimiento obtenido, lo añadimos al array de movimientos
    snapshot.forEach((doc) => {
      const data = doc.data();
        movesData.push( new Movimiento(
                doc.id,
                data.nombre,
                data.tipo,
                data.categoria
          )
  );
        });

    // 🔹 Ordenamos alfabéticamente por nombre
    movesData.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre));

    // Llenar cada select
    moveSelects.forEach(select => {
      select.innerHTML = `<option value="">-- Selecciona movimiento --</option>`;

      //Creamos un option para cada movimiento
      movesData.forEach(move => {
        const option = document.createElement("option");
        option.value = move.id;    //Valor del option
        option.textContent = move.nombre;  //Nombre a mostrar en el select
        select.appendChild(option);
      });
    });

    // Evitar duplicados
    moveSelects.forEach((select, idx) => {
      select.addEventListener("change", () => {
        actualizarOpciones();
        actualizarIcono(idx, select.value);

      });
    });

  } catch (err) {
    console.error("Error cargando movimientos:", err);
  }
}

// 🔹 Función para actualizar las opciones disponibles en los selects de movimientos
function actualizarOpciones() {
  // obtener movimientos ya seleccionados
  const seleccionados = moveSelects.map(s => s.value).filter(v => v !== "");

  moveSelects.forEach(select => {
    [...select.options].forEach(opt => {
      if (opt.value === "") return; // dejar la opción vacía siempre
      opt.disabled = seleccionados.includes(opt.value) && select.value !== opt.value;
    });
  });
}

// 🔹 Función para actualizar el icono al lado del movimiento seleccionado
export function actualizarIcono(index, moveId) {

  //Buscamos el movimiento en el array de movimientos
  const move = movesData.find(m => m.id === moveId);
  if (move) {
    //Si lo encuentra, ponemos el icono del respectivo tipo
    moveIcons[index].src = `images/types/${move.tipo.toLowerCase()}.svg`;
    moveIcons[index].style.visibility = "visible";
  } else {
    //Sino, ponemos el genérico (???)
    moveIcons[index].src = `images/types/mystery.svg`;
  }
}

// 🔹 Función para cargar las habilidades disponibles que modifican las debilidades o resistencias de tipos
export async function cargarHabilidades(speciesDatalist, pokedex) {
  const querySnapshot = await getDocs(collection(db, "pokedex_abilities"));

  // Limpiamos el select antes de llenarlo
  abilitySelect.innerHTML = `<option value="">-- Selecciona habilidad --</option>`;


  //Por cada habilidad obtenida, lo añadimos al array de habilidades (No son muchas)
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    abilitiesData.push(new Habilidad(
        doc.id,
        data.nombre,
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
