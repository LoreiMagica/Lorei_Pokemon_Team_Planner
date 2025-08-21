// DataModel/PokemonForma.js
export class PokemonForma {
  constructor(no, forma, tipo1 = "", tipo2 = "") {
    this.no = no;         // ID del Pokémon base (ej: 6 = Charizard)
    this.forma = forma;   // sufijo de la forma (ej: "-mega")
    this.tipo1 = tipo1;   // Tipo 1
    this.tipo2 = tipo2;   // Tipo 2
  }
}
