import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonSpecies, getEvolutionChain } from '../services/pokeapi';
import { parseEvolutionChain, formatPokemonName, getPokemonImageUrl } from '../utils/pokemonUtils';
import Loader from './Loader';
import styles from './EvolutionChain.module.css';

/**
 * Evolution chain component
 * @param {Object} props - Component props
 * @param {string} props.pokemonName - Pokemon name to fetch evolution chain
 * @returns {JSX.Element} EvolutionChain component
 */
const EvolutionChain = ({ pokemonName }) => {
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvolutions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get species data
        const speciesData = await getPokemonSpecies(pokemonName);

        // Get evolution chain
        const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);

        // Parse evolution chain
        const evolutionList = parseEvolutionChain(evolutionData.chain);

        setEvolutions(evolutionList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pokemonName) {
      fetchEvolutions();
    }
  }, [pokemonName]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader text="Loading evolutions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Could not load evolution chain</p>
      </div>
    );
  }

  if (evolutions.length <= 1) {
    return (
      <div className={styles.container}>
        <p className={styles.noEvolution}>This Pokémon does not evolve.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Evolution Chain</h2>
      <div className={styles.chain}>
        {evolutions.map((evolution, index) => (
          <React.Fragment key={evolution.id}>
            <Link to={`/pokemon/${evolution.name}`} className={styles.evolutionItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={getPokemonImageUrl(evolution.id)}
                  alt={evolution.name}
                  className={styles.image}
                />
              </div>
              <p className={styles.name}>{formatPokemonName(evolution.name)}</p>
            </Link>

            {index < evolutions.length - 1 && (
              <div className={styles.arrow}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EvolutionChain;
