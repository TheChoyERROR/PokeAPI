import React from 'react';
import styles from './Loader.module.css';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.text - Optional loading text
 * @returns {JSX.Element} Loader component
 */
const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.pokeball}>
        <div className={styles.pokeballButton}></div>
      </div>
      <p className={styles.loadingText}>{text}</p>
    </div>
  );
};

export default Loader;
