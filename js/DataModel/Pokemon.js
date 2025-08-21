export class Pokemon {
  constructor(id = 0, species, forma = "", tipo1 = "", tipo2 = "", moves = [], moveNames = [], ability = "", abilityName = "") {
    this.id = id; // ID del Pokémon
    this.species = species; // Nombre del Pokémon
    this.tipo1 = tipo1; // Tipo 1 del Pokémon
    this.tipo2 = tipo2; // Tipo 2 del Pokémon (opcional)
    this.forma = forma; // Forma del Pokémon (opcional)
    this.moves = moves; // Array de IDs de movimientos
    this.moveNames = moveNames; // Array de nombres de movimientos
    this.ability = ability; // ID de la habilidad
    this.abilityName = abilityName; // Nombre de la habilidad
  }

  // 🖼️ Devuelve el nombre del archivo de imagen
  getImageFile(pokedex) {
    const entry = pokedex.find(p => p.nombre === this.species);
    if (!entry) return "0";
    let file = entry.id;
    if (this.forma) file += this.forma.toLowerCase();
    return file;
  }


  // 🎨 Genera un <img> listo para insertar en un slot
  renderImage(pokedex) {
    const img = document.createElement("img");
    img.src = `images/pokemon-model/${this.getImageFile(pokedex)}.png`;
    img.alt = this.species;
    img.style.width = "70px";
    img.style.height = "70px";
    img.style.objectFit = "contain";
    return img;
  }

  // 📝 Rellena el formulario con los datos del Pokémon
  fillForm(actualizarIcono) {
    document.getElementById("speciesInput").value = this.species;
    document.getElementById("formasSelect").value = this.forma || "";
    document.getElementById("ability").value = this.ability;

    const [m1, m2, m3, m4] = this.moves;
    document.getElementById("move1").value = m1 || "";
    document.getElementById("move2").value = m2 || "";
    document.getElementById("move3").value = m3 || "";
    document.getElementById("move4").value = m4 || "";

    actualizarIcono(0, m1);
    actualizarIcono(1, m2);
    actualizarIcono(2, m3);
    actualizarIcono(3, m4);
  }

  // 📜 Devuelve el cuadrito de info para mostrar en el slot
  getTooltip() {
    return `${this.species}\nAtaques: ${this.moveNames.join(", ")}\nHabilidad: ${this.abilityName}`;
  }
}
