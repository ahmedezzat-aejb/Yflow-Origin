import React from 'react';
import styled from 'styled-components';

interface YFlowPaymentCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const PaymentCardContainer = styled.div<{
  hover: boolean;
}>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  /* Hover Effect */
  ${({ hover }) => {
    if (hover) {
      return `
        transform: translateY(-4px);
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
        border-color: #6366F1;
      `;
    }
    return '';
  }}
`;

const PaymentCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 24px;
  border-bottom: 1px solid #f3f4f6;
`;

const PaymentCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  color: white;
  font-size: 20px;
`;

const PaymentCardContent = styled.div`
  flex: 1;
`;

const PaymentCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
`;

const PaymentCardSubtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

const PaymentCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const YFlowPaymentCard: React.FC<YFlowPaymentCardProps> = ({
  title,
  subtitle,
  icon,
  actions,
  hover = false,
  className,
  onClick,
}) => {
  return (
    <PaymentCardContainer hover={hover} onClick={onClick} className={className}>
      <PaymentCardHeader>
        <PaymentCardIcon>{icon}</PaymentCardIcon>
        <PaymentCardContent>
          <PaymentCardTitle>{title}</PaymentCardTitle>
          {subtitle && <PaymentCardSubtitle>{subtitle}</PaymentCardSubtitle>}
        </PaymentCardContent>
      </PaymentCardHeader>
      {actions && <PaymentCardActions>{actions}</PaymentCardActions>}
    </PaymentCardContainer>
  );
};

export default YFlowPaymentCard;
