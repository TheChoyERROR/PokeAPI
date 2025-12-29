import React, { useState, useEffect, useMemo } from 'react';
import PokemonList from '../components/PokemonList';
import usePokemonList from '../hooks/usePokemonList';
import { getPokemonTypes, getPokemonByType, searchPokemon } from '../services/pokeapi';
import styles from './Home.module.css';

const ITEMS_PER_PAGE = 20;

/**
 * Home page component with search and filter
 * @returns {JSX.Element} Home page
 */
const Home = () => {
  const { pokemons, loading, error, currentPage, totalPages, goToPage, nextPage, prevPage } = usePokemonList();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filteredPage, setFilteredPage] = useState(1);

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
            results = results.filter(p =>
              p.types.some(t => t.type.name === selectedType)
            );
          } else {
            const typeData = await getPokemonByType(selectedType);
            
            const typePokemons = await Promise.all(
              typeData.pokemon.map(async (p) => {
                const existingPokemon = pokemons.find(
                  existing => existing.name === p.pokemon.name
                );
                if (existingPokemon) {
                  return existingPokemon;
                }
                
                try {
                  const response = await fetch(p.pokemon.url);
                  const data = await response.json();
                  
                  if (!data.id || !data.name || !data.types) {
                    return null;
                  }
                  
                  return {
                    id: data.id,
                    name: data.name,
                    types: data.types
                  };
                } catch (err) {
                  console.error(`Error fetching ${p.pokemon.name}:`, err);
                  return null;
                }
              })
            );
            
            // Eliminar duplicados por id
            const uniquePokemons = typePokemons
              .filter(Boolean)
              .filter((pokemon, index, self) => 
                index === self.findIndex(p => p.id === pokemon.id)
              );
            
            results = uniquePokemons;
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
   * Reset filtered page when filters change
   */
  useEffect(() => {
    setFilteredPage(1);
  }, [searchQuery, selectedType]);

  /**
   * Get display pokemons with pagination
   */
  const { displayPokemons, paginatedPokemons, filteredTotalPages } = useMemo(() => {
    const isFiltered = searchQuery || selectedType;
    const source = isFiltered ? filteredPokemons : pokemons;

    // Eliminar duplicados por id
    const uniquePokemons = source.reduce((acc, pokemon) => {
      if (pokemon && pokemon.id && !acc.some(p => p.id === pokemon.id)) {
        acc.push(pokemon);
      }
      return acc;
    }, []);

    // Si está filtrado, aplicar paginación manual
    if (isFiltered) {
      const totalPages = Math.ceil(uniquePokemons.length / ITEMS_PER_PAGE);
      const startIndex = (filteredPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginated = uniquePokemons.slice(startIndex, endIndex);

      return {
        displayPokemons: uniquePokemons,
        paginatedPokemons: paginated,
        filteredTotalPages: totalPages
      };
    }

    return {
      displayPokemons: uniquePokemons,
      paginatedPokemons: uniquePokemons,
      filteredTotalPages: 1
    };
  }, [searchQuery, selectedType, filteredPokemons, pokemons, filteredPage]);

  /**
   * Pagination functions for filtered results
   */
  const goToFilteredPage = (page) => {
    if (page >= 1 && page <= filteredTotalPages) {
      setFilteredPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextFilteredPage = () => {
    if (filteredPage < filteredTotalPages) {
      setFilteredPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevFilteredPage = () => {
    if (filteredPage > 1) {
      setFilteredPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    setFilteredPage(1);
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
        pokemons={paginatedPokemons}
        loading={searching || loading}
        error={error}
        currentPage={isFiltered ? filteredPage : currentPage}
        totalPages={isFiltered ? filteredTotalPages : totalPages}
        goToPage={isFiltered ? goToFilteredPage : goToPage}
        nextPage={isFiltered ? nextFilteredPage : nextPage}
        prevPage={isFiltered ? prevFilteredPage : prevPage}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
};

export default Home;
