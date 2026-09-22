import React, { useState } from 'react';
import { Switch, message, Tooltip } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import paymentsService from '../services/paymentsService';
import { useLanguage } from '../locale/LanguageContext';
import axiosClient from '../../axios-client';
import ErrorHandling from './ErrorHandling';

const PaymentStateToggle = ({ record }) => {
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState(record.state);
  const { translate } = useLanguage();

  const handleStateChange = async (checked) => {
    setLoading(true);
    try {
      const newState = checked ? 1 : 0;
      
      // Call the API to update payment state
      await axiosClient.put(`/payments/${record.id}/state`,{
        state:newState
      })

      setCurrentState(newState);
      
      message.success(
        translate(newState === 1 ? 'payment_marked_completed' : 'payment_marked_pending') || 
        (newState === 1 ? 'Payment marked as completed' : 'Payment marked as pending')
      );
    } catch (error) {
      ErrorHandling(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Tooltip 
        title={
          currentState === 1 
            ? (translate('mark_as_pending') || 'Mark as pending')
            : (translate('mark_as_completed') || 'Mark as completed')
        }
      >
        <Switch
          checked={currentState === 1}
          loading={loading}
          onChange={handleStateChange}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<ClockCircleOutlined />}
          style={{
            backgroundColor: currentState === 1 ? '#52c41a' : '#faad14'
          }}
        />
      </Tooltip>
      <span style={{ 
        fontSize: '12px', 
        color: currentState === 1 ? '#52c41a' : '#faad14',
        fontWeight: 'bold'
      }}>
        {currentState === 1 
          ? (translate('completed') || 'Completed')
          : (translate('pending') || 'Pending')
        }
      </span>
    </div>
  );
};

export default PaymentStateToggle;
