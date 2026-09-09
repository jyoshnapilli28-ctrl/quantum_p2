import React from 'react';

interface IconProps {
  category: 'core' | 'gates' | 'hardware' | 'math' | 'physics' | 'states' | 'ui' | 'quantum' | 'circuit' | 'experiments' | 'navigation' | 'visualization';
  name: string;
  size?: number | string;
  className?: string;
  alt?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  category, 
  name, 
  size = 24, 
  className = '', 
  alt = '' 
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [srcPath, setSrcPath] = React.useState(`/assets/icons/${category}/${name}.svg`);

  // Reset error/path when props change
  React.useEffect(() => {
    setHasError(false);
    setSrcPath(`/assets/icons/${category}/${name}.svg`);
  }, [category, name]);

  const handleError = () => {
    // If it failed on a non-quantum category, try quantum category first
    if (category !== 'quantum' && srcPath !== `/assets/icons/quantum/${name}.svg`) {
      setSrcPath(`/assets/icons/quantum/${name}.svg`);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Intentional QYNX fallback component — no broken browser icon
    return (
      <div
        className={`icon-fallback ${className}`}
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm, 4px)',
          background: 'var(--color-purple-20, #E8DAFF)',
          border: '1px solid var(--border-default, #D4BBFF)',
          color: 'var(--color-purple-60, #8A3FFC)',
          fontFamily: 'var(--font-mono)',
          fontSize: typeof size === 'number' && size >= 36 ? '12px' : '10px',
          fontWeight: 700,
          userSelect: 'none',
        }}
        title={alt || `${name}`}
        aria-label={alt || `${name}`}
      >
        {name.includes('0') ? '|0⟩' : name.includes('1') ? '|1⟩' : 'Q'}
      </div>
    );
  }

  return (
    <img 
      src={srcPath} 
      alt={alt || `${name.replace(/-/g, ' ')}`}
      width={size}
      height={size}
      className={className}
      onError={handleError}
      style={{ userSelect: 'none', display: 'block' }}
    />
  );
};
