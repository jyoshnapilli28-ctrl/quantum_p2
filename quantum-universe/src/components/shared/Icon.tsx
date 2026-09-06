import React from 'react';

interface IconProps {
  category: 'core' | 'gates' | 'hardware' | 'math' | 'physics' | 'states' | 'ui';
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
  return (
    <img 
      src={`/assets/icons/${category}/${name}.svg`} 
      alt={alt || `${name} icon`}
      width={size}
      height={size}
      className={className}
      style={{ userSelect: 'none' }}
    />
  );
};
