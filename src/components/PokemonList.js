import React from 'react';
import PokemonCard from './PokemonCard';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import styles from './PokemonList.module.css';

/**
 * Pokemon list component with numeric pagination
 * @param {Object} props - Component props
 * @param {Array} props.pokemons - Array of Pokemon data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.goToPage - Function to go to specific page
 * @param {Function} props.nextPage - Function to go to next page
 * @param {Function} props.prevPage - Function to go to previous page
 * @param {Function} props.onRetry - Optional retry callback
 * @returns {JSX.Element} PokemonList component
 */
const PokemonList = ({
  pokemons,
  loading,
  error,
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  onRetry
}) => {
  /**
   * Generate page numbers to display
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Show error if initial load fails
  if (error && pokemons.length === 0) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  // Show loader for initial load
  if (loading && pokemons.length === 0) {
    return <Loader text="Loading Pokémon..." />;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Loading overlay for page changes */}
      {loading && pokemons.length > 0 && (
        <div className={styles.loadingOverlay}>
          <Loader text="Loading Pokémon..." />
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pokemons.length > 0 && (
        <div className={styles.paginationContainer}>
          {/* Previous Button */}
          <button
            className={`${styles.paginationButton} ${styles.navButton}`}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className={styles.pageNumbers}>
            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`${styles.paginationButton} ${
                    currentPage === page ? styles.active : ''
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next Button */}
          <button
            className={`${styles.paginationButton} ${styles.navButton}`}
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Page Info */}
      {!loading && pokemons.length > 0 && (
        <div className={styles.pageInfo}>
          Page {currentPage} of {totalPages} • Showing {pokemons.length} Pokémon
        </div>
      )}
    </div>
  );
};

export default PokemonList;
