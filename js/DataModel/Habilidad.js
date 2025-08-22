export class Habilidad {
  constructor(id, nombre, resistencias = [], debilidades = [], inmunidades = []) {
    this.id = id;
    this.nombre = nombre;
    this.resistencias = resistencias; // Array de resistencias
    this.debilidades = debilidades;     // Array de debilidades
    this.inmunidades = inmunidades;     // Array de inmunidades
  }
}