import { movesData, abilitiesData } from "./firebaseCargarDatos.js"; //Array de movimientos y habilidades
import { equipoTabla } from "./organizarEquipo.js";  //Equipo actual 
import { pokedex } from "./firebaseCargarDatos.js"; //Lista de pokémon completa


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

// Función que calcula la efectividad 
function calcularEfectividad(movimiento, tipoObjetivo) {
  // Devuelve 2 = super efectivo, 1 = normal, 0.5 = resistente, 0 = inmune
    let resultado = 1; // default neutral

    //console.log(`Calculando efectividad de ${movimiento} contra ${tipoObjetivo}`);
    if (effectiveness[movimiento] && effectiveness[movimiento][tipoObjetivo] !== undefined) {
      resultado = effectiveness[movimiento][tipoObjetivo];
      //console.log("movimiento: "+ movimiento+" vs "+tipoObjetivo + " " +parseFloat(resultado));
    }
    return resultado;
}

// Genera tabla de efectividades de los movimientos del equipo
export function generarTablaColores() {
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
      //console.log("Pokémon encontrado:", entry);
      html += `<th class="imgEquipoTablas"><img src="images/pokemon-model/${entry.id}${pokemon.forma?.toLowerCase() || ""}.png" alt="${pokemon.species}"></th>`
    } else {
      // Si no hay Pokémon en esa ranura, ponemos la imagen por defecto
      //console.log("No hay Pokémon en esa ranura");
      html += `<th class="imgEquipoTablas"><img src= "images/pokemon-model/0.png" alt="Ninguno"></th>`;
    }
  }
    // Cerramos la fila de encabezados
  html += `<th>Total</th></tr>`;


  // Filas: tipos
  tiposElementales.forEach(tipoFila => {

    //Dibujamos cada imagen de tipo
    html += `<tr><th class="imgTipoTablas"><img src="/images/types/${tipoFila.toLowerCase()}.svg" alt="${tipoFila}"></th>`;
    let contadorEfectivos = 0; // contador total de efectivos para esta fila


    //Calculamos la coincidencia con cada pokémon
    equipoTabla.forEach(pokemon => {
    let esEfectivo = pokemon.moveIds.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);

        // Ignoramos movimientos de tipo Status
      if (!movimiento || movimiento.categoria === "Status") return false;

      //Agregamos la excepción de Liofinización, que es un ataque tipo hielo fuerte contra agua
      if (movimiento.id == 573 && tipoFila == "Water") return 2

      return calcularEfectividad(movimiento.tipo, tipoFila) > 1;
    });

      let esNeutro = pokemon.moveIds.some(mov =>  {
        let movimiento = movesData.find(m => m.id === mov);

         // Ignoramos movimientos de tipo Status
        if (!movimiento || movimiento.categoria === "Status") return false;
        calcularEfectividad(movesData.find(m => m.id === mov).tipo, tipoFila) === 1
    });

    let esResistente = pokemon.moveIds.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);

        // Ignoramos movimientos de tipo Status
      if (!movimiento || movimiento.categoria === "Status") return false;
      return calcularEfectividad(movimiento.tipo, tipoFila) < 1 && calcularEfectividad(movimiento.tipo, tipoFila) > 0;
    });

    let esInmune = pokemon.moveIds.some(mov => {
      let movimiento = movesData.find(m => m.id === mov);

        // Ignoramos movimientos de tipo Status
      if (!movimiento || movimiento.categoria === "Status") return false;
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
          contadorEfectivos++
        }
        
        
      html += `<td>${icono}</td>`;
    })

    // Al final de la fila añadimos la celda con el total
    if (contadorEfectivos == 1) {
        html += `<td class="contadorEfectivosTotal1">${contadorEfectivos}</td></tr>`;
    } else  if (contadorEfectivos == 2) {
        html += `<td class="contadorEfectivosTotal2">${contadorEfectivos}</td></tr>`;
    } else  if (contadorEfectivos >= 3) {
        html += `<td class="contadorEfectivosTotal3">${contadorEfectivos}</td></tr>`;
    } else {
    html += `<td class="contadorEfectivos">${contadorEfectivos}</td></tr>`;
    }
  });

  //Cerramos tabla
  html += '</table>';
  //console.log("Tabla de colores generada");
  container.innerHTML = html;
};

// Genera tabla de números
export function generarTablaNumeros() {
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
    //Agregamos columna de resistencias y debilidades total y terminamos con los encabezados para pasar a la siguiente línea de la tabla
    html += `<th><i class="bi bi-shield-check ataqueEfectivo"></i></th><th><i class="bi bi-shield-exclamation ataqueResistente"></i></th></tr>`;


  // Filas: tipos Elementales
  tiposElementales.forEach(tipoFila => {
    html += `<tr><th class="imgTipoTablas"><img src="/images/types/${tipoFila.toLowerCase()}.svg" alt="${tipoFila}"></th>`;
    
    let contadorResistencias = 0; //  contador de coberturas
    let contadorDebilidades = 0; //  contador de debilidades

    //Calculamos la resistencia de cada Pokémon del equipo
    equipoTabla.forEach(pokemon => {
    if (pokemon.id != 0) {
        //Ponemos la efectividad en 1
            let multiplicador = 1;
            
        //Calculamos la resistencia del tipo del pokémon contra el tipo de la fila
        multiplicador *= calcularEfectividad(tipoFila, pokemon.tipo1);
        multiplicador *= calcularEfectividad(tipoFila, pokemon.tipo2);

        // Comprobamos la habilidad del pokémon
        if (pokemon.ability) {
            let habilidad = abilitiesData.find(h => h.id === pokemon.ability);
            //console.log(habilidad.inmunidades + " " +tipoFila)
            if (habilidad) {
            // Inmunidades primero (anulan todo)
            if (habilidad.inmunidades.includes(tipoFila)) {
                multiplicador = 0;
            }
            // Resistencias (solo si no es inmune)
            else if (habilidad.resistencias.includes(tipoFila)) {
                // Caso especial: habilidad Ráafaga delta (id 21) solo funciona si el Pokémon es de tipo Volador
                if (habilidad.id != 21 || pokemon.tipo1 == "Flying" || pokemon.tipo2 == "Flying") {
                multiplicador *= 0.5;
                }
            }
            // Debilidades (solo si no es inmune)
            else if (habilidad.debilidades.includes(tipoFila)) {
                multiplicador *= 2;
            }
            }

            // --- Habilidades SuperEffectiveType (Habilidades que disminuyen ataques efectivos) ---
            if (habilidad.resistencias.includes("SuperEffectiveType")) {
            let esDebilTipo1 = effectiveness[tipoFila]?.[pokemon.tipo1] === 2;
            let esDebilTipo2 = effectiveness[tipoFila]?.[pokemon.tipo2] === 2;
            
            if (esDebilTipo1 || esDebilTipo2) {
                multiplicador *= 0.75;
            }
            }
        }

            //Y escribimos el resultado en la tabla
        let texto = multiplicador === 0 ? "x0"
                    : multiplicador === 0.25 ? "x1/4"
                    : multiplicador === 0.5 ? "1/2"
                    : multiplicador === 1.5 ? "x1.5"
                    : multiplicador === 2 ? "x2"
                    : multiplicador === 3 ? "x3"
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

            case "x1.5":
            html += `<td class="pokemonDebil">${texto}</td>`;
            break;
            
            case "x2":
            html += `<td class="pokemonDebil">${texto}</td>`;
            break;

            case "x3":
            html += `<td class="pokemonSuperdebil">${texto}</td>`;
            break;

            case "x4":
            html += `<td class="pokemonSuperdebil">${texto}</td>`;
            break;

            default:
            html += `<td class="pokemonNeutro">${texto}</td>`;
            break;
        }
        if (multiplicador > 1) {
            contadorDebilidades++
        } else if (multiplicador < 1) {
            contadorResistencias++
        }
        } else {
        html += `<td></td>`;
        }
    });

        // Al final de la fila añadimos las celdas con el total de resistencias
        if (contadorResistencias == 1) {
            html += `<td class="contadorEfectivosTotal1">${contadorResistencias}</td>`;
        } else  if (contadorResistencias == 2) {
            html += `<td class="contadorEfectivosTotal2">${contadorResistencias}</td>`;
        } else  if (contadorResistencias >= 3) {
            html += `<td class="contadorEfectivosTotal3">${contadorResistencias}</td>`;
        } else {
        html += `<td class="contadorEfectivos">${contadorResistencias}</td>`;
        }

        // Al final de la fila añadimos las celdas con el total de resistencias
        // y pasamos a la siguiente línea de la tabla
        if (contadorDebilidades == 1) {
            html += `<td class="contadorDebilidadesTotal1">${contadorDebilidades}</td></tr>`;
        } else  if (contadorDebilidades == 2) {
            html += `<td class="contadorDebilidadesTotal2">${contadorDebilidades}</td></tr>`;
        } else  if (contadorDebilidades >= 3) {
            html += `<td class="contadorDebilidadesTotal3">${contadorDebilidades}</td></tr>`;
        } else {
        html += `<td class="contadorEfectivos">${contadorDebilidades}</td></tr>`;
        }
    });

  //Y terminamos de dibujar la tabla
  html += '</table>';
  container.innerHTML = html;
}