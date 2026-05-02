import React from 'react';
import styled from 'styled-components';

interface YFlowCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

interface CardContainerProps {
  hover: boolean;
  padding: string;
  clickable: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  /* Padding Variants */
  ${({ padding }) => {
    switch (padding) {
      case 'sm':
        return 'padding: 16px;';
      case 'lg':
        return 'padding: 32px;';
      default:
        return 'padding: 24px;';
    }
  }}

  /* Hover Effect */
  ${({ hover, clickable }) => {
    if (hover || clickable) {
      return `
        &:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-4px);
          border-color: #6366F1;
        }
      `;
    }
  }}

  /* Clickable */
  ${({ clickable }) => {
    if (clickable) {
      return `
        cursor: pointer;

        &:active {
          transform: translateY(-2px);
        }
      `;
    }
  }}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
`;

const CardTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  color: white;
  font-size: 18px;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  color: #374151;
  line-height: 1.6;
`;

const YFlowCard: React.FC<YFlowCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  actions,
  hover = true,
  padding = 'md',
  className,
  onClick,
}) => {
  const hasHeader = title || subtitle || icon || actions;
  const clickable = !!onClick;

  return (
    <CardContainer
      hover={hover}
      padding={padding}
      clickable={clickable}
      onClick={onClick}
      className={className}
    >
      {hasHeader && (
        <CardHeader>
          <CardTitleSection>
            {icon && <CardIcon>{icon}</CardIcon>}
            {(title || subtitle) && (
              <CardContent>
                {title && <CardTitle>{title}</CardTitle>}
                {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
              </CardContent>
            )}
          </CardTitleSection>
          {actions && <CardActions>{actions}</CardActions>}
        </CardHeader>
      )}
      {children && <CardBody>{children}</CardBody>}
    </CardContainer>
  );
};

export default YFlowCard;
