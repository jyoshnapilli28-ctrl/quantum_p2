import React from 'react';
import { getAssetUrl } from '../../utils/assetPath';

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
  const [srcPath, setSrcPath] = React.useState(() => getAssetUrl(`assets/icons/${category}/${name}.svg`));

  // Reset error/path when props change
  React.useEffect(() => {
    setHasError(false);
    setSrcPath(getAssetUrl(`assets/icons/${category}/${name}.svg`));
  }, [category, name]);

  const handleError = () => {
    const quantumPath = getAssetUrl(`assets/icons/quantum/${name}.svg`);
    const corePath = getAssetUrl(`assets/icons/core/${name}.svg`);

    // Multi-tiered search: if requested category isn't quantum, try quantum
    if (srcPath !== quantumPath) {
      setSrcPath(quantumPath);
    } else if (srcPath !== corePath) {
      // If quantum failed, try core category
      setSrcPath(corePath);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Secondary safety fallback — retains UI stability without breaking
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
