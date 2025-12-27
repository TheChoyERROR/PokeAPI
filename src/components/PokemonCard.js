import React from 'react';
import { Link } from 'react-router-dom';
import { formatPokemonName, getTypeColor, getPokemonImageUrl } from '../utils/pokemonUtils';
import styles from './PokemonCard.module.css';

/**
 * Pokemon card component for list display
 * @param {Object} props - Component props
 * @param {Object} props.pokemon - Pokemon data
 * @returns {JSX.Element} PokemonCard component
 */
const PokemonCard = ({ pokemon }) => {
  const { id, name, types } = pokemon;
  const imageUrl = getPokemonImageUrl(id);

  return (
    <Link to={`/pokemon/${name}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.idBadge}>#{id.toString().padStart(3, '0')}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{formatPokemonName(name)}</h3>

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
      </div>
    </Link>
  );
};

export default PokemonCard;
