import React from 'react';
import styled from 'styled-components';

interface YFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'monochrome';
  className?: string;
}

const LogoContainer = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  gap: ${({ size }) =>
    size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px'};
`;

const LogoIcon = styled.div<{ size: string; variant: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '24px';
      case 'md':
        return '32px';
      case 'lg':
        return '48px';
      case 'xl':
        return '64px';
      default:
        return '32px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '24px';
      case 'md':
        return '32px';
      case 'lg':
        return '48px';
      case 'xl':
        return '64px';
      default:
        return '32px';
    }
  }};
  background: ${({ variant }) =>
    variant === 'monochrome'
      ? '#1F2937'
      : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)'};
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(8px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 40%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    backdrop-filter: blur(4px);
  }
`;

const LogoText = styled.span<{ size: string; variant: string }>`
  font-weight: 700;
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '16px';
      case 'md':
        return '20px';
      case 'lg':
        return '28px';
      case 'xl':
        return '36px';
      default:
        return '20px';
    }
  }};
  color: ${({ variant }) => (variant === 'monochrome' ? '#1F2937' : '#6366F1')};
  letter-spacing: -0.025em;
  background: ${({ variant }) =>
    variant === 'full'
      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)'
      : 'none'};
  -webkit-background-clip: ${({ variant }) =>
    variant === 'full' ? 'text' : 'none'};
  -webkit-text-fill-color: ${({ variant }) =>
    variant === 'full' ? 'transparent' : 'inherit'};
  background-clip: ${({ variant }) => (variant === 'full' ? 'text' : 'none')};
`;

const YFlowLogo: React.FC<YFlowLogoProps> = ({
  size = 'md',
  variant = 'full',
  className,
}) => {
  return (
    <LogoContainer size={size} className={className}>
      <LogoIcon size={size} variant={variant} />
      {variant !== 'icon' && (
        <LogoText size={size} variant={variant}>
          YFlow
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default YFlowLogo;
