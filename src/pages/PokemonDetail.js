import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails } from '../services/pokeapi';
import {
  formatPokemonName,
  getTypeColor,
  formatHeight,
  formatWeight,
  getPokemonImageUrl,
} from '../utils/pokemonUtils';
import EvolutionChain from '../components/EvolutionChain';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import styles from './PokemonDetail.module.css';

/**
 * Pokemon detail page component
 * @returns {JSX.Element} PokemonDetail page
 */
const PokemonDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonDetails(name);
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <Loader text="Loading Pokémon details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!pokemon) {
    return <ErrorMessage message="Pokémon not found" />;
  }

  const { id, types, height, weight, abilities, stats } = pokemon;

  return (
    <div className={styles.container}>
      {/* Header with back button */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Back to Pokédex
        </button>
      </div>

      {/* Main info card */}
      <div className={styles.mainCard}>
        <div className={styles.topSection}>
          {/* Image section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img
                src={getPokemonImageUrl(id)}
                alt={name}
                className={styles.image}
              />
            </div>
            <div className={styles.idBadge}>#{id.toString().padStart(3, '0')}</div>
          </div>

          {/* Info section */}
          <div className={styles.infoSection}>
            <h1 className={styles.name}>{formatPokemonName(name)}</h1>

            <div className={styles.types}>
              {types.map(({ type }) => (
                <span
                  key={type.name}
                  className={styles.type}
                  style={{ backgroundColor: getTypeColor(type.name) }}
                >
                  {type.name}
                </span>
              ))}
            </div>

            <div className={styles.physicalInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Height</span>
                <span className={styles.infoValue}>{formatHeight(height)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Weight</span>
                <span className={styles.infoValue}>{formatWeight(weight)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abilities section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Abilities</h2>
          <div className={styles.abilities}>
            {abilities.map(({ ability, is_hidden }) => (
              <div key={ability.name} className={styles.ability}>
                <span className={styles.abilityName}>
                  {formatPokemonName(ability.name)}
                </span>
                {is_hidden && (
                  <span className={styles.hiddenBadge}>Hidden</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Base Stats</h2>
          <div className={styles.stats}>
            {stats.map(({ stat, base_stat }) => (
              <div key={stat.name} className={styles.statRow}>
                <span className={styles.statName}>
                  {stat.name.replace('-', ' ').toUpperCase()}
                </span>
                <div className={styles.statBarContainer}>
                  <div
                    className={styles.statBar}
                    style={{
                      width: `${(base_stat / 255) * 100}%`,
                      backgroundColor: base_stat > 100 ? '#27ae60' : base_stat > 50 ? '#f39c12' : '#e74c3c',
                    }}
                  />
                </div>
                <span className={styles.statValue}>{base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution chain */}
      <EvolutionChain pokemonName={name} />
    </div>
  );
};

export default PokemonDetail;
