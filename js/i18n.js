export let currentLang = 'es';

import { texts } from "../locales/languages.js";
import { recargarDatos, pokedex } from "./firebaseCargarDatos.js";



const speciesList = document.getElementById("speciesList");


// Función para traducir
export async function changeLanguage(lang) {
currentLang = lang;

  // Textos normales
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!texts[lang] || !texts[lang][key]) return;


    // Revisamos si tiene data-vars
    let vars = {};
    const varsAttr = el.getAttribute("data-vars");
    if (varsAttr) {
      try {
        vars = JSON.parse(varsAttr);
      } catch(e) {
        console.warn("Error parsing data-vars", varsAttr);
      }
    }

    el.textContent = tv(key, vars);
  });

  // Atributo TITLE
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (texts[lang] && texts[lang][key]) {
      el.setAttribute("title", texts[lang][key]);
    }
  });

  // Atributo PLACEHOLDER
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (texts[lang] && texts[lang][key]) {
      el.setAttribute("placeholder", texts[lang][key]);
    }
  });

  // ⚡ Si quieres más atributos (ej. alt), lo añades igual:
  document.querySelectorAll("[data-i18n-alt]").forEach(el => {
    const key = el.getAttribute("data-i18n-alt");
    if (texts[lang] && texts[lang][key]) {
      el.setAttribute("alt", texts[lang][key]);
    }
  });

    await recargarDatos(speciesList, pokedex);

}

document.getElementById("languageSelect").addEventListener("change", async (e) => {
  const newLang = e.target.value;
  currentLang = e.target.value;

  changeLanguage(newLang);

  // Guardamos en localStorage
  localStorage.setItem("lang", newLang);
});

export function setLang(loadLang) {
  currentLang = loadLang;
  document.getElementById("languageSelect").value = loadLang;
  changeLanguage(loadLang);

}

export function t(key) {
  return texts[currentLang][key] || key;
};

// Helper global para usar en alerts, etc.
export function tv(key, vars = {}) {
  let translation = (texts[currentLang] && texts[currentLang][key]) || key;

  // Reemplazar variables tipo {pokemon}, {nombre}, etc.
  Object.keys(vars).forEach(v => {
    const regex = new RegExp(`{${v}}`, "g");
    translation = translation.replace(regex, vars[v]);
  });

  return translation;
};

window.t = t;
window.tv = tv;