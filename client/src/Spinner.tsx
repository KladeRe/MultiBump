import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  primaryColor?: string;
  secondaryColor?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  primaryColor = '#372cac',
  secondaryColor = '#7c7efa'
}) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
      } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
};

export default Spinner;
