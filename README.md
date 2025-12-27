# Pokédex App - React

Una aplicación frontend moderna en React que consume la [PokeAPI](https://pokeapi.co/) para mostrar información detallada de Pokémon con diseño responsivo tipo Pokédex.

## Características

### Funcionalidades Principales

- **Listado de Pokémon con Scroll Infinito**: Muestra una lista paginada de Pokémon que carga automáticamente más elementos al hacer scroll
- **Búsqueda por Nombre**: Encuentra cualquier Pokémon escribiendo su nombre en tiempo real
- **Filtro por Tipo**: Filtra Pokémon por sus tipos (Fuego, Agua, Planta, etc.)
- **Vista Detallada**: Al hacer clic en un Pokémon, navega a una página con información completa:
  - Imagen oficial de alta calidad
  - Nombre y número de Pokédex
  - Tipos
  - Altura y peso
  - Habilidades (incluyendo habilidades ocultas)
  - Estadísticas base con barras visuales
- **Cadena de Evolución**: Visualiza la línea evolutiva completa de cada Pokémon con imágenes
- **Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
- **Manejo de Errores**: Mensajes amigables cuando falla la API o no se encuentra un Pokémon
- **Estados de Carga**: Animación de Pokébola mientras se cargan los datos

## Tecnologías

- **React 19** - Librería UI
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para consumir la API
- **CSS Modules** - Estilos encapsulados y modulares
- **PokeAPI** - API REST de Pokémon

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ErrorMessage.js  # Componente de error
│   ├── EvolutionChain.js # Cadena evolutiva
│   ├── Loader.js        # Spinner de carga
│   ├── PokemonCard.js   # Tarjeta de Pokémon
│   └── PokemonList.js   # Lista con scroll infinito
├── hooks/               # Custom hooks
│   └── usePokemonList.js # Hook para gestión de lista
├── pages/               # Páginas/rutas
│   ├── Home.js          # Página principal
│   └── PokemonDetail.js # Página de detalle
├── services/            # Servicios de API
│   └── pokeapi.js       # Cliente de PokeAPI
├── utils/               # Utilidades
│   └── pokemonUtils.js  # Funciones auxiliares
└── styles/              # Estilos globales
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos

1. **Clonar o navegar al proyecto**

```bash
cd pokeapi
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

4. **Compilar para producción**

```bash
npm run build
```

Genera una versión optimizada en la carpeta `build/`

## Uso de la Aplicación

### Página Principal

- **Scroll Infinito**: Desplázate hacia abajo para cargar más Pokémon automáticamente
- **Búsqueda**: Escribe el nombre de un Pokémon en el campo de búsqueda
- **Filtro por Tipo**: Selecciona un tipo del dropdown para filtrar
- **Limpiar Filtros**: Haz clic en "Clear Filters" para resetear búsqueda y filtros

### Página de Detalle

- **Navegación**: Haz clic en cualquier tarjeta de Pokémon
- **Información**: Visualiza todos los detalles del Pokémon
- **Evoluciones**: Navega a otras evoluciones haciendo clic en ellas
- **Regresar**: Usa el botón "Back to Pokédex" para volver al listado

## Arquitectura de Código

### Principios Aplicados

- **DRY (Don't Repeat Yourself)**: Código reutilizable en componentes, hooks y utilidades
- **Separación de Responsabilidades**:
  - Componentes enfocados en UI
  - Servicios para lógica de API
  - Hooks para lógica de estado
  - Utilidades para funciones auxiliares
- **Clean Code**:
  - Funciones pequeñas y enfocadas
  - Nombres descriptivos
  - Comentarios JSDoc para documentación
  - Código bien estructurado y legible

### Patrones Implementados

- **Custom Hooks**: `usePokemonList` para manejar estado y lógica del listado
- **Intersection Observer API**: Para implementar scroll infinito eficiente
- **CSS Modules**: Evita colisión de estilos y mejora mantenibilidad
- **Componentes Controlados**: Inputs manejados por estado de React
- **Error Boundaries**: Manejo elegante de errores de API

## Optimizaciones

- **Lazy Loading de Imágenes**: Atributo `loading="lazy"` para mejorar performance
- **Memoización**: `useMemo` para evitar cálculos innecesarios
- **Scroll Infinito**: Carga bajo demanda en lugar de todos los datos de una vez
- **CSS Modules**: Solo carga estilos necesarios para cada componente
- **Axios Timeout**: Límite de 10 segundos para evitar esperas infinitas

## APIs Consumidas

### PokeAPI Endpoints

- `GET /pokemon` - Lista paginada de Pokémon
- `GET /pokemon/{name}` - Detalles de un Pokémon
- `GET /pokemon-species/{name}` - Información de especie
- `GET /evolution-chain/{id}` - Cadena evolutiva
- `GET /type` - Lista de tipos
- `GET /type/{name}` - Pokémon por tipo

## Créditos

- **PokeAPI**: [https://pokeapi.co/](https://pokeapi.co/)
- **Sprites Oficiales**: [PokeAPI Sprites](https://github.com/PokeAPI/sprites)

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo.
