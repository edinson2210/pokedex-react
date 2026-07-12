# Pokédex

Pokédex personal construida con React, Vite y la [PokéAPI](https://pokeapi.co/), con foco en un diseño vivo (glassmorfismo, gradientes por tipo, tipografía retro) y en cubrir los ~1025 Pokémon con buen rendimiento.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Framer Motion
- react-router-dom
- pnpm

## Funcionalidades

- Grilla principal con sprites, búsqueda expandible y filtro por tipo, cargada de forma gradual (scroll infinito) sin fetch por card.
- Ficha de detalle por Pokémon: stats animados, habilidades traducidas al español, cadena evolutiva, sprite shiny, cry de audio, y formas alternativas (regionales, megaevoluciones, gigamax) cuando existen.
- Modo claro/oscuro.
- Diseño con glassmorfismo, glow por color de tipo y layout tipo bento en el detalle.

## Desarrollo

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # build de producción
pnpm lint
```
