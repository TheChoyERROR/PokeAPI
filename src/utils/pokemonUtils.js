/**
 * Get Pokemon ID from URL
 * @param {string} url - Pokemon URL
 * @returns {number} Pokemon ID
 */
export const getPokemonIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1]);
};

/**
 * Format Pokemon name (capitalize first letter)
 * @param {string} name - Pokemon name
 * @returns {string} Formatted name
 */
export const formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Get Pokemon type colors for styling
 * @param {string} type - Pokemon type
 * @returns {string} Hex color code
 */
export const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type.toLowerCase()] || '#777';
};

/**
 * Convert height from decimeters to meters
 * @param {number} height - Height in decimeters
 * @returns {string} Height in meters
 */
export const formatHeight = (height) => {
  return (height / 10).toFixed(1) + ' m';
};

/**
 * Convert weight from hectograms to kilograms
 * @param {number} weight - Weight in hectograms
 * @returns {string} Weight in kilograms
 */
export const formatWeight = (weight) => {
  return (weight / 10).toFixed(1) + ' kg';
};

/**
 * Parse evolution chain recursively
 * @param {Object} chain - Evolution chain object
 * @returns {Array} Array of evolution stages
 */
export const parseEvolutionChain = (chain) => {
  const evolutions = [];

  const traverse = (evolutionData) => {
    if (!evolutionData) return;

    evolutions.push({
      name: evolutionData.species.name,
      id: getPokemonIdFromUrl(evolutionData.species.url),
    });

    if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
      evolutionData.evolves_to.forEach(evolution => traverse(evolution));
    }
  };

  traverse(chain);
  return evolutions;
};

/**
 * Get official artwork URL for Pokemon
 * @param {number} id - Pokemon ID
 * @returns {string} Image URL
 */
export const getPokemonImageUrl = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};
