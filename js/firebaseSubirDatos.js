// Imports de firebase
import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// 🔹 Función auxiliar para agregar un tiempo de espera y evitar que firebase nos banee
export function delay(ms) {
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
  //console.log(`Leyendo fichero: `+ texto.split("\n").map(l => l.trim()));
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