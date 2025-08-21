//Importamos el slot y caja seleccionado para leer el Pokémon
import { selectedSlotIndex, boxes, currentBoxIndex, pokedex } from "./cajasPc.js";
import { Pokemon } from "./DataModel/Pokemon.js";
import { movesData } from "./firebaseDatos.js";

// crear recuadros para los pokémon
const recuadrosEquipoContainer = document.getElementById("recuadrosEquipoContainer");
const numRecuadros = 6;
const recuadros = [];

// Array con tus Pokémon del equipo para mostrar en las tablas
const equipoTabla = [new Pokemon, new Pokemon, new Pokemon, new Pokemon, new Pokemon, new Pokemon];

// Array con tipos elementales
const tiposElementales = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", 
  "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

  // Tabla completa de efectividades de tipos
const effectiveness = {
  Normal:   { Rock: 0.5, Steel: 0.5, Ghost: 0 },
  Fire:     { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water:    { Fire: 2, Rock: 2, Ground: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Grass:    { Water: 2, Rock: 2, Ground: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
  Ice:      { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Fighting: { Normal: 2, Rock: 2, Steel: 2, Ice: 2, Dark: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Poison:   { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground:   { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying:   { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug:      { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5, Poison: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost:    { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Rock: 2, Ice: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy:    { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 }
};

// Crear los recuadros de equipo
for (let i = 0; i < numRecuadros; i++) {
  const recuadro = document.createElement("div");
  recuadro.classList.add("recuadroEquipo");
  recuadro.dataset.index = i;

  // Botón para añadir el Pokémon del slot seleccionado
  const addBtn = document.createElement("button");
  addBtn.textContent = "Añadir Pokémon";
  addBtn.id = `equipoPokemon${i}`;
  addBtn.classList.add("btn", "btn-sm", "btn-success");
  recuadro.appendChild(addBtn);

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
      alert("Selecciona un Pokémon de la caja primero.");
      return;
    }

    const currentBox = boxes[currentBoxIndex];
    const pokemon = currentBox.slots[selectedSlotIndex];

    //Si no hay pokémon en el puntero, lo notificamos
    if (!pokemon) {
      alert("No hay Pokémon en el slot seleccionado.");
      return;
    }

    let tipoMovimiento = []; //Array para almacenar los tipos de movimientos y mostrar el background de su color

    //Buscamos los tipos de movimientos del Pokémon 
    for (let i = 0; i < pokemon.moves.length; i++) {
        // Buscar dentro del array movesData
        let movimiento = movesData.find(m => m.id === pokemon.moves[i]);

        if (movimiento) {
            tipoMovimiento.push(movimiento.tipo);
        }
    }

    // Llenamos los recuadros de detalles del pokémon con los nombres de los movimientos y habilidad
    const entry = pokedex.find(p => p.nombre === pokemon.species);
    if (entry) {
      img.src = `images/pokemon-model/${entry.id}${pokemon.forma?.toLowerCase() || ""}.png`;
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
        console.log(`Pokémon añadido al equipo en la ranura ${j}:`, pokemon);
        console.log("Equipo actual:", equipoTabla);
      }
    }
    // Ejecutar actualización de las tablas
    generarTablaColores();
    generarTablaNumeros();

  });

  //Y lo añadimos al contenedor
  recuadrosEquipoContainer.appendChild(recuadro);
  recuadros.push(recuadro);
}


// Función que calcula la efectividad (HAY QUE MEJORAR ESTO)
function calcularEfectividad(movimiento, tipoObjetivo) {
  // Devuelve 2 = super efectivo, 1 = normal, 0.5 = resistente, 0 = inmune
    let resultado = 1; // default neutral

    //console.log(`Calculando efectividad de ${movimiento} contra ${tipoObjetivo}`);
    if (effectiveness[movimiento] && effectiveness[movimiento][tipoObjetivo] !== undefined) {
      resultado = effectiveness[movimiento][tipoObjetivo];
      console.log("movimiento: "+ movimiento+" vs "+tipoObjetivo + " " +parseFloat(resultado));
    }
    return resultado;
}

// Genera tabla de efectividades de los movimientos del equipo
function generarTablaColores() {
  const container = document.getElementById("tablaColoresContainer");
  let html = '<table><tr><th>Enem. &darr;</th>';

  // Encabezados columna: Pokémon
  for (let i = 0; i < equipoTabla.length; i++) {
    
    // Recorremos cada registro del array
    let pokemon = equipoTabla[i];

    //Si encuentra un pokémon que no es placeholder...
    if (pokemon.species != null) {

      //Lo escribe en la tabla
      const entry = pokedex.find(p => p.nombre === pokemon.species);
      console.log("Pokémon encontrado:", entry);
      html += `<th class="imgEquipoTablas"><img src="images/pokemon-model/${entry.id}${pokemon.forma?.toLowerCase() || ""}.png" alt="${pokemon.species}"></th>`
    } else {
      // Si no hay Pokémon en esa ranura, ponemos la imagen por defecto
      //console.log("No hay Pokémon en esa ranura");
      html += `<th class="imgEquipoTablas"><img src= "images/pokemon-model/0.png" alt="Ninguno"></th>`;
    }
  }
    // Cerramos la fila de encabezados
  html += '</tr>';


  // Filas: tipos
  tiposElementales.forEach(tipoFila => {

    //Dibujamos cada imagen de tipo
    html += `<tr><th class="imgTipoTablas"><img src="/images/types/${tipoFila.toLowerCase()}.svg" alt="${tipoFila}"></th>`;

    //Calculamos la coincidencia con cada pokémon
    equipoTabla.forEach(pokemon => {
    let esEfectivo = pokemon.moves.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);
      return calcularEfectividad(movimiento.tipo, tipoFila) > 1;
    });

      let esNeutro = pokemon.moves.some(mov => 
        calcularEfectividad(movesData.find(m => m.id === mov).tipo, tipoFila) === 1
      );

    let esResistente = pokemon.moves.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);
      return calcularEfectividad(movimiento.tipo, tipoFila) < 1 && calcularEfectividad(movimiento.tipo, tipoFila) > 0;
    });

    let esInmune = pokemon.moves.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);
      return calcularEfectividad(movimiento.tipo, tipoFila) === 0;
    });
      //console.log(esEfectivo, + " "+ esInmune);

      //Y tras eso lo escribimos en la tabla
        let icono = "";
        if (esInmune) {
          icono = `<i class="bi bi-x-octagon ataqueInmune"></i>`;
        }
        if (esResistente) {
          icono = `<i class="bi bi-arrow-90deg-down ataqueResistente"></i></i>`;
        } 
        if (esNeutro) {
          icono = ` `;
        }
        if (esEfectivo) {
          icono = `<i class="bi bi-check-circle ataqueEfectivo"></i></i>`;
        }
        
      html += `<td>${icono}</td>`;
    })

    //Pasamos a la siguiente línea de la tabla
    html += '</tr>';
  });

  //Cerramos tabla
  html += '</table>';
  //console.log("Tabla de colores generada");
  container.innerHTML = html;
};

// Genera tabla de números
function generarTablaNumeros() {
  const container = document.getElementById("tablaNumerosContainer");
  let html = '<table><tr><th>At. &darr;</th>';

  // Encabezados columna: Pokémon
    for (let i = 0; i < equipoTabla.length; i++) {
    // Recorremos cada registro del array
    let pokemon = equipoTabla[i];

    //Si encuentra un pokémon que no es placeholder...
    if (pokemon.species != null) {

      //Lo escribe en la tabla
      const entry = pokedex.find(p => p.nombre === pokemon.species);
      //console.log("Pokémon encontrado:", entry);
      html += `<th class="imgEquipoTablas"><img src= "images/pokemon-model/${entry.id}${pokemon.forma?.toLowerCase() || ""}.png" alt="${pokemon.species}"></th>`
    } else {
      // Si no hay Pokémon en esa ranura, ponemos la imagen por defecto
      html += `<th class="imgEquipoTablas"><img src= "images/pokemon-model/0.png" alt="Ninguno"></th>`;
    }
  }
    // Cerramos la fila de encabezados
    html += '</tr>';


  // Filas: tipos Elementales
  tiposElementales.forEach(tipoFila => {
    html += `<tr><th class="imgTipoTablas"><img src="/images/types/${tipoFila.toLowerCase()}.svg" alt="${tipoFila}"></th>`;
    
    //Calculamos la resistencia de cada Pokémon del equipo
    equipoTabla.forEach(pokemon => {
      if (pokemon.id != 0) {
      //Ponemos la efectividad en 1
        let multiplicador = 1;
        
          //Calculamos la resistencia del tipo del pokémon contra el tipo de la fila
          multiplicador *= calcularEfectividad(tipoFila, pokemon.tipo1);
          multiplicador *= calcularEfectividad(tipoFila, pokemon.tipo2);

          //Y escribimos el resultado en la tabla
        let texto = multiplicador === 0 ? "x0"
                  : multiplicador === 0.25 ? "x1/4"
                  : multiplicador === 0.5 ? "1/2"
                  : multiplicador === 2 ? "x2"
                  : multiplicador === 4 ? "x4"
                  : "1";

        switch (texto) {
          case "x0":
            html += `<td class="pokemonInmune">${texto}</td>`;
            break;
          case "x1/4":
            html += `<td class="pokemonSuperResistente">${texto}</td>`;
            break;

          case "1/2":
            html += `<td class="pokemonResistente">${texto}</td>`;
            break;
          
          case "x2":
            html += `<td class="pokemonDebil">${texto}</td>`;
            break;

          case "x4":
            html += `<td class="pokemonSuperdebil">${texto}</td>`;
            break;

          default:
            html += `<td class="pokemonNeutro">${texto}</td>`;
            break;
        }
      } else {
        html += `<td></td>`;
      }
      });

    //Pasamos a la siguiente línea de la tabla
    html += '</tr>';
  });

  //Y terminamos de dibujar la tabla
  html += '</table>';
  container.innerHTML = html;
}

// Ejecutar generación de tablas
generarTablaColores();
generarTablaNumeros();
