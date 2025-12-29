import { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getPokemonDetails } from '../services/pokeapi';

const ITEMS_PER_PAGE = 20;
const TOTAL_POKEMON = 1025; // Total de Pokémon en PokeAPI

/**
 * Custom hook for managing Pokemon list with pagination
 * @returns {Object} Pokemon list state and functions
 */
const usePokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(Math.ceil(TOTAL_POKEMON / ITEMS_PER_PAGE));

  /**
   * Fetch Pokemon list for a specific page
   */
  const fetchPokemons = useCallback(async (page) => {
    setLoading(true);
    setError(null);

    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const data = await getPokemonList(ITEMS_PER_PAGE, offset);

      // Fetch detailed data for each Pokemon
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            return await getPokemonDetails(pokemon.name);
          } catch (err) {
            console.error(`Error fetching ${pokemon.name}:`, err);
            return null;
          }
        })
      );

      const validPokemons = detailedPokemons.filter(p => p !== null);
      setPokemons(validPokemons);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchPokemons(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, fetchPokemons]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchPokemons(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pokemons,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default usePokemonList;
