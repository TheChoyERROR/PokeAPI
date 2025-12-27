import { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getPokemonDetails } from '../services/pokeapi';

/**
 * Custom hook for managing Pokemon list with infinite scroll
 * @returns {Object} Pokemon list state and functions
 */
const usePokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  /**
   * Fetch Pokemon list with details
   */
  const fetchPokemons = useCallback(async (currentOffset) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPokemonList(LIMIT, currentOffset);

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

      setPokemons(prev => [...prev, ...validPokemons]);
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  /**
   * Load more Pokemon (for infinite scroll)
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      fetchPokemons(newOffset);
    }
  }, [offset, hasMore, loading, fetchPokemons]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchPokemons(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pokemons,
    loading,
    error,
    hasMore,
    loadMore,
  };
};

export default usePokemonList;
