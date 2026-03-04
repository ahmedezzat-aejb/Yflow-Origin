import React from 'react';
import styled from 'styled-components';

interface YFlowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const ButtonContainer = styled.button<{
  variant: string;
  size: string;
  fullWidth: boolean;
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  /* Size Variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 8px 16px;
          font-size: 14px;
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: 16px 32px;
          font-size: 18px;
          min-height: 52px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 16px;
          min-height: 44px;
        `;
    }
  }}
  
  /* Variant Styles */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.15);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: #8B5CF6;
          color: white;
          border: none;
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.15);
          
          &:hover:not(:disabled) {
            background: #7C3AED;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #6366F1;
          border: 2px solid #6366F1;
          
          &:hover:not(:disabled) {
            background: #6366F1;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.15);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: #6B7280;
          border: none;
          
          &:hover:not(:disabled) {
            background: #F3F4F6;
            color: #6366F1;
          }
        `;
      default:
        return '';
    }
  }}
  
  /* Loading State */
  position: relative;
  
  &.loading {
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.span<{ position: string }>`
  display: flex;
  align-items: center;
  order: ${({ position }) => (position === 'right' ? '2' : '0')};
`;

const YFlowButton: React.FC<YFlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className,
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className || ''} ${loading ? 'loading' : ''}`}
    >
      {icon && iconPosition === 'left' && (
        <IconWrapper position="left">{icon}</IconWrapper>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <IconWrapper position="right">{icon}</IconWrapper>
      )}
    </ButtonContainer>
  );
};

export default YFlowButton;
