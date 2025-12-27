import React, { useEffect, useRef, useCallback } from 'react';
import PokemonCard from './PokemonCard';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import styles from './PokemonList.module.css';

/**
 * Pokemon list component with infinite scroll
 * @param {Object} props - Component props
 * @param {Array} props.pokemons - Array of Pokemon data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.hasMore - Whether more items can be loaded
 * @param {Function} props.loadMore - Function to load more Pokemon
 * @param {Function} props.onRetry - Optional retry callback
 * @returns {JSX.Element} PokemonList component
 */
const PokemonList = ({ pokemons, loading, error, hasMore, loadMore, onRetry }) => {
  const observerTarget = useRef(null);

  /**
   * Intersection Observer callback for infinite scroll
   */
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  /**
   * Setup Intersection Observer for infinite scroll
   */
  useEffect(() => {
    const element = observerTarget.current;
    const option = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Show error if initial load fails
  if (error && pokemons.length === 0) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  // Show loader for initial load
  if (loading && pokemons.length === 0) {
    return <Loader text="Loading Pokémon..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className={styles.observerTarget}>
        {loading && <Loader text="Loading more Pokémon..." />}
      </div>

      {/* End of list message */}
      {!hasMore && pokemons.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've seen all Pokémon! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
