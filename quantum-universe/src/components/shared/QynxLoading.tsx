import React from 'react';
import { getAssetUrl } from '../../utils/assetPath';

interface QynxLoadingProps {
  message?: string;
  size?: number;
}

export const QynxLoading: React.FC<QynxLoadingProps> = ({
  message = 'Loading Quantum State...',
  size = 48
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-8)',
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={getAssetUrl('assets/images/branding/qynx-icon.png')}
          alt="QYNX"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'contain',
          }}
        />
      </div>

      {message && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--text-secondary, #4D3E6B)',
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
};
