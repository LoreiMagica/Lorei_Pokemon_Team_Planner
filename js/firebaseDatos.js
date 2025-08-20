// Imports de firebase
import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

//Array de movimientos de pokémon 
const movesData = [];  

// Obtenemos el select de habilidades del html
const abilitySelect = document.getElementById("ability");


// 🔹 Función auxiliar para agregar un tiempo de espera y evitar que firebase nos banee
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔹 Leer fichero local
export async function leerFichero(ruta) {
  const respuesta = await fetch(ruta);
  const texto = await respuesta.text();
  return texto.split("\n").map(l => l.trim()).filter(l => l.length > 0);
}

// 🔹 Función para insertar nombres y tipos en la colección "pokedex" de firebase
export async function subirNombresPokedex() {
    // Leemos los ficheros de nombres y tipos para prepararlos para su inserción
  const nombres = await leerFichero("../txt_db/pokemon_names.txt");
  const tipos = await leerFichero("../txt_db/pokemon_names_types.txt");

  //Nos aseguramos que el número de pokémon y tipos es el mismo para evitar liarla
  if (nombres.length !== tipos.length) {
    console.error("Los ficheros no tienen el mismo número de líneas");
    return;
  }

    //Recorremos los nombres y tipos para insertarlos en la colección "pokedex"
  for (let i = 0; i < nombres.length; i++) {
    const [tipo1, tipo2] = tipos[i].split(",").map(t => t.trim());
    const docRef = doc(db, "pokedex", String(i + 1));
    await setDoc(docRef, {
      nombre: nombres[i],
      tipo1: tipo1 || null,
      tipo2: tipo2 || null
    });
    console.log(`✔ Insertado #${i+1}: ${nombres[i]} `);
    await delay(50);
  }
}

// 🔹 Función para insertar formas de pokémon en firebase
export async function subirFormas() {
  const nombres = await leerFichero("../txt_db/pokemon_names_forms.txt");

  for (let i = 0; i < nombres.length; i++) {
    try {
        //Agrego los nombres de las formas junto con datos por defecto 
        // para crear cada documento con las columnas requeridas
      await addDoc(collection(db, "pokedex_forms"), {
        no: 0,
        nombre: nombres[i],
        tipo1: null,
        tipo2: null,
        forma: "-mega"
      });
      console.log(`✔ Insertado: ${nombres[i]}`);
    } catch (e) {
      console.error("Error añadiendo documento:", e);
    }
  }
}
// 🔹 Función para insertar movimientos en firebase
export async function subirMovimientos() {
    // Leemos los ficheros de movimientos, tipos y categorías para prepararlos para su inserción
    const nombres = await leerFichero("../txt_db/pokemon_moves.txt");
    const tipos = await leerFichero("../txt_db/pokemon_moves_types.txt");
    const categorias = await leerFichero("../txt_db/pokemon_moves_category.txt");


    //Nos aseguramos que el número de pokémon y tipos es el mismo para evitar liarla
  if (nombres.length !== tipos.length || nombres.length !== categorias.length) {
    console.error("Los ficheros no tienen la misma cantidad de líneas");
    return;
  }

  for (let i = 0; i < nombres.length; i++) {
    const id = i + 1; // id autoincremental
    
    const docRef = doc(db, "pokedex_moves", String(i + 1));

    //Seteamos el documento con los datos del movimiento
    await setDoc(docRef, {
      nombre: nombres[i],
      tipo: tipos[i],
      categoria: categorias[i]
    });

    console.log(`Insertado movimiento #${id}: ${nombres[i]}`);
    await delay(50);

  }

  console.log("✅ Subida de movimientos completa");
}


// 🔹 Función auxiliar para leer fichero y devolver array de líneas (hecho pa las habilidades)
export async function readFileLines(path) {
  const respuesta = await fetch(path);
  const texto = await respuesta.text();
  console.log(`Leyendo fichero: `+ texto.split("\n").map(l => l.trim()));
  return texto.split("\n").map(l => l.trim());
}


// 🔹 Función para subir habilidades que modifican las debilidades y resistencias a firebase
export async function subirHabilidades() {
    // 🔹 Cargamos los 4 ficheros
    const nombres = await readFileLines("../txt_db/pokemon_abilities_names.txt");
    const resistencias = await readFileLines("../txt_db/pokemon_abilities_resist.txt");
    const debilidades = await readFileLines("../txt_db/pokemon_abilities_weakness.txt");
    const inmunidades = await readFileLines("../txt_db/pokemon_abilities_immune.txt");
  for (let i = 0; i < nombres.length; i++) {
    const nombre = nombres[i];

    // Procesar cada columna -> si está vacía, array vacío
    const resistencia = resistencias[i] ? resistencias[i].split(",").map(x => x.trim()).filter(x => x) : [];
    const debilidad = debilidades[i] ? debilidades[i].split(",").map(x => x.trim()).filter(x => x) : [];
    const inmunidad = inmunidades[i] ? inmunidades[i].split(",").map(x => x.trim()).filter(x => x) : [];

    // Crear documento con ID incremental (empezando en 1)
    const id = i + 1; // id autoincremental
    
    const docRef = doc(db, "pokedex_abilities", String(i + 1));

    //Seteamos el documento con los datos de la habilidad
    await setDoc(docRef, {
      nombre: nombre,
      resistencia: resistencia,
      debilidad: debilidad,
      inmunidad: inmunidad,
    });

    console.log(`✅ Subido doc ${id}: ${nombre}`);
  }

  console.log("🚀 ¡Datos subidos correctamente!");
}


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
      pokedex[data.nombre] = parseInt(docSnap.id);
    }
  });
}

// 🔹 Función para cargar formas de un pokémon en el formulario
export async function cargarFormas(pokemonName, pokedex, formSelect) {
  formSelect.innerHTML = '<option value="">-- Formas --</option>';
  const no = pokedex[pokemonName];
  if (!no) return;

  //Comparamos el número del pokémon elegido por el usuario con las formas en la colección "pokedex_forms"
  const q = query(collection(db, "pokedex_forms"), where("no", "==", no));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

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
        movesData.push({
                id: doc.id,
                nombre: data.nombre,
                tipo: data.tipo,
                categoria: data.categoria
            });
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


  //Array de habilidades de pokémon 
const abilitiesData = [];  

    //Por cada habilidad obtenida, lo añadimos al array de habilidades (No son muchas)
    querySnapshot.forEach((doc) => {
      const data = doc.data();
        abilitiesData.push({
                id: doc.id,
                nombre: data.nombre,
            });
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
