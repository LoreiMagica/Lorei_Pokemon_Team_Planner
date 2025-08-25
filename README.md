# Lorei Pokémon Team Planner

# Español
Puedes visitar y hacer uso normal de todas las funciones de esta web en: 
- https://lorei-pokemon-team-planner.web.app

## Descripción y uso
Lorei Pokémon Team Planner es una web donde puedes crear y recopilar tus mejores pokémon de tu juego, y planificar de una manera sencilla tus equipos para tu aventura o competiciones. 

En esta web tendrás un sencillo formulario donde podrás encontrar cualquier pokémon existente en los videojuegos oficiales, junto a sus formas alternativas, también ofrece la lista completa de ataques existentes, y otra lista donde elegir habilidades que modifican la resistencia del pokémon frente a ataques enemigos

[](/gif_readme/gif_formulario_es.gif)

Todos los pokémon creados en el formulario, se almacenarán en la caja a la izquierda. Podrás crear múltiples cajas y renombrarlas a tu gusto para organizar, editar, y eliminar tus pokémon como desees

[](/gif_readme/png_cajas_es.png)

Junto a todo esto, podrás crear un equipo pokemon pulsando sobre tus pokémon creados en las cajas, y colocándolos en el slot de equipo debajo de las cajas. La web se encargará de calcular las efectividades de los movimientos de tu equipo, las resistencias, y debilidades de estos al instante

[](/gif_readme/png_equipo_es.png)

La web permite que los usuarios se registren para guardar permanentemente sus datos de pokémon, sus equipos creados, y poder consultarlos desde cualquier dispositivo

## Instalación
Si lo deseas, puedes descargar el proyecto y, creando y configurando tu propio proyecto de firebase, puedes lanzar tu propia versión de este Pokémon team planner, y modificarla a tu gusto. La ruta por defecto del fichero de configuración de firebaseConfig es "js/".

El propio proyecto tiene funciones para cargar en firebase la información necesaria para funcionar de todos los pokémon, ataques y habilidades almacenada en los ficheros txt("js/firebaseSubirDatos.js"). Por defecto cargará los nombres en español (mi idioma nativo), pero con su html de admin (/admin/actualizarFirebase.html) puedes cargar los ficheros de diferentes idiomas. O incluso agregar el tuyo propio

## ¿Planeas agregar más funciones o idiomas?
No lo creo. Creé esta página web porque me encanta jugar a pokémon probando diferentes criaturas en cada partida, y los planificadores de equipo online que hay se me quedan cortos, por ello deseaba algo más completo y profesional, y es justo lo que hice.
Igualmente, estaría encantada de aceptar contribuciones de los demás para poder ofrecer más idiomas para llegar a más público, u ofrecer nuevas funciones para ayudar a los jugadores más exigentes de pokémon, como yo. Por supuesto, vuestro aportación contará con el reconocimiento necesario en la web


## Agradecimientos
- Gracias a [PokéAPI](https://github.com/PokeAPI/sprites) por los sprites de pokémon usados en la web
- Gracias a [Pokemondb](https://pokemondb.net/tools/text-list) por la base de datos de nombres de pokémon, formas y tipos para empezar el proyecto
- Gracias a [Wikidex](https://www.wikidex.net/wiki/WikiDex), [Bulbapedia](https://bulbagarden.net/home), [Poképedia](https://www.pokepedia.fr/Portail:Accueil), [Pokecentral](https://wiki.pokemoncentral.it) y a [Pokewiki](https://www.pokewiki.de/Hauptseite) por toda la información de nombres de pokémon, movimientos y habilidades
- Gracias a @camunza por crear el favicon usado en la web

# English
You can visit and make normal use of all the functions of this website here:
- https://lorei-pokemon-team-planner.web.app

## Overview

Lorei Pokémon Team Planner is a web app that lets you create and organize your favorite Pokémon from the games and easily plan your teams for adventures or competitive play.

The site features a simple form where you can search for any Pokémon from the official games, including alternate forms. You’ll also find a full list of moves and abilities that can affect a Pokémon’s resistances to enemy attacks.
![](/gif_readme/gif_form_en.gif)


All Pokémon created in the form are stored in the box on the left. You can create multiple boxes, rename them, and organize, edit, or delete your Pokémon however you like.
![](/gif_readme/png_boxes_en.png)

You can build a team by dragging Pokémon from your boxes into the team slots below. The app will automatically calculate move effectiveness, resistances, and weaknesses for your team in real time.!
[](/gif_readme/png_team_en.png)


Users can register to save their Pokémon and teams permanently, allowing access from any device.

## Installation

If you wish, you can download the project to run your own version of this Pokémon team planner. Download the project and set up your Firebase project. The default path for the firebaseConfig file is js/.

The project includes scripts to upload all necessary Pokémon, moves, and abilities data to Firebase (js/firebaseSubirDatos.js). By default, names are in Spanish, but you can upload files in other languages or even add your own using the admin page (/admin/actualizarFirebase.html).

## Do you plan to add more functions or languages?

I don’t plan to add major features or languages at the moment. I created this site because I love experimenting with Pokémon and found existing online team planners limited. I wanted something more complete and professional—and that’s what I built.

That said, I welcome contributions from the community to add more languages or features for serious Pokémon players. All contributions will be properly credited on the website.

## Acknowledgements

- Thanks to [PokéAPI](https://github.com/PokeAPI/sprites) for the Pokémon sprites

- Thanks to [Pokemondb](https://pokemondb.net/tools/text-list) for the database of Pokémon names, forms, and types

- Thanks to [Wikidex](https://www.wikidex.net/wiki/WikiDex), [Bulbapedia](https://bulbagarden.net/home), [Poképedia](https://www.pokepedia.fr/Portail:Accueil), [Pokecentral](https://wiki.pokemoncentral.it) and [Pokewiki](https://www.pokewiki.de/Hauptseite) for Pokémon names, moves, and abilities information

- Thanks to @camunza for creating the favicon used on the website

