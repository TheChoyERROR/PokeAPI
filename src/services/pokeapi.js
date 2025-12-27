import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch paginated list of Pokemon
 * @param {number} limit - Number of Pokemon to fetch
 * @param {number} offset - Starting position
 * @returns {Promise} Promise with Pokemon list data
 */
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Pokemon list: ' + error.message);
  }
};

/**
 * Fetch detailed information about a specific Pokemon
 * @param {string} nameOrId - Pokemon name or ID
 * @returns {Promise} Promise with Pokemon details
 */
export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await api.get(`/pokemon/${nameOrId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon '${nameOrId}': ` + error.message);
  }
};

/**
 * Fetch Pokemon species data (needed for evolution chain)
 * @param {string} nameOrId - Pokemon name or ID
 * @returns {Promise} Promise with species data
 */
export const getPokemonSpecies = async (nameOrId) => {
  try {
    const response = await api.get(`/pokemon-species/${nameOrId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch species for '${nameOrId}': ` + error.message);
  }
};

/**
 * Fetch evolution chain from URL
 * @param {string} url - Evolution chain URL
 * @returns {Promise} Promise with evolution chain data
 */
export const getEvolutionChain = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch evolution chain: ' + error.message);
  }
};

/**
 * Fetch all Pokemon types for filtering
 * @returns {Promise} Promise with types list
 */
export const getPokemonTypes = async () => {
  try {
    const response = await api.get('/type');
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to fetch Pokemon types: ' + error.message);
  }
};

/**
 * Fetch Pokemon by type
 * @param {string} type - Pokemon type name
 * @returns {Promise} Promise with Pokemon of that type
 */
export const getPokemonByType = async (type) => {
  try {
    const response = await api.get(`/type/${type}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon of type '${type}': ` + error.message);
  }
};

/**
 * Search Pokemon by name (case-insensitive)
 * @param {string} query - Search query
 * @returns {Promise} Promise with search results
 */
export const searchPokemon = async (query) => {
  try {
    const response = await api.get(`/pokemon/${query.toLowerCase()}`);
    return [response.data];
  } catch (error) {
    throw new Error(`Pokemon '${query}' not found`);
  }
};
