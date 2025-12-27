import React, { useState, useEffect, useMemo } from 'react';
import PokemonList from '../components/PokemonList';
import usePokemonList from '../hooks/usePokemonList';
import { getPokemonTypes, getPokemonByType, searchPokemon } from '../services/pokeapi';
import styles from './Home.module.css';

/**
 * Home page component with search and filter
 * @returns {JSX.Element} Home page
 */
const Home = () => {
  const { pokemons, loading, error, hasMore, loadMore } = usePokemonList();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searching, setSearching] = useState(false);

  /**
   * Fetch Pokemon types on mount
   */
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await getPokemonTypes();
        setTypes(typesData);
      } catch (err) {
        console.error('Failed to fetch types:', err);
      }
    };

    fetchTypes();
  }, []);

  /**
   * Filter Pokemon by search query and type
   */
  useEffect(() => {
    const filterPokemons = async () => {
      // Reset to all Pokemon if no filters
      if (!searchQuery && !selectedType) {
        setFilteredPokemons(pokemons);
        setSearching(false);
        return;
      }

      setSearching(true);

      try {
        let results = pokemons;

        // Search by name
        if (searchQuery) {
          try {
            const searchResults = await searchPokemon(searchQuery);
            results = searchResults;
          } catch (err) {
            // If exact search fails, filter locally
            results = pokemons.filter(p =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
        }

        // Filter by type
        if (selectedType) {
          if (searchQuery) {
            // Filter results by type
            results = results.filter(p =>
              p.types.some(t => t.type.name === selectedType)
            );
          } else {
            // Fetch Pokemon by type
            const typeData = await getPokemonByType(selectedType);
            const typePokemons = typeData.pokemon.map(p => {
              const existingPokemon = pokemons.find(
                existing => existing.name === p.pokemon.name
              );
              return existingPokemon;
            }).filter(Boolean);
            results = typePokemons;
          }
        }

        setFilteredPokemons(results);
      } catch (err) {
        console.error('Filter error:', err);
        setFilteredPokemons([]);
      } finally {
        setSearching(false);
      }
    };

    filterPokemons();
  }, [searchQuery, selectedType, pokemons]);

  /**
   * Get display pokemons (filtered or all)
   */
  const displayPokemons = useMemo(() => {
    return searchQuery || selectedType ? filteredPokemons : pokemons;
  }, [searchQuery, selectedType, filteredPokemons, pokemons]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handle type filter change
   */
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
  };

  const isFiltered = searchQuery || selectedType;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Pokédex</h1>
          <p className={styles.subtitle}>Search and explore Pokémon</p>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <select
            value={selectedType}
            onChange={handleTypeChange}
            className={styles.typeSelect}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button className={styles.clearButton} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {isFiltered && (
          <div className={styles.resultsInfo}>
            {searching ? (
              <span>Searching...</span>
            ) : (
              <span>{displayPokemons.length} Pokémon found</span>
            )}
          </div>
        )}
      </div>

      {/* Pokemon List */}
      <PokemonList
        pokemons={displayPokemons}
        loading={searching || loading}
        error={error}
        hasMore={!isFiltered && hasMore}
        loadMore={loadMore}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
};

export default Home;
