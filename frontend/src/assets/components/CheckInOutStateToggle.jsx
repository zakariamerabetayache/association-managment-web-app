import React, { useState } from 'react';
import { Switch, App, Tooltip } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useLanguage } from '../locale/LanguageContext';
import checkInOutService from '../services/checkInOutService';
import ErrorHandling from './ErrorHandling';

const CheckInOutStateToggle = ({ record, onStateUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState(record.state);
  const { translate } = useLanguage();
  const { message } = App.useApp();

  const handleStateChange = async (checked) => {
    setLoading(true);
    try {
      const newState = checked ? 1 : 0; // 0 = not checked, 1 = checked
      
      // Call the API to update check-in/out state
      await checkInOutService.updateState(record.id, newState);

      setCurrentState(newState);
      
      message.success(
        translate(newState === 1 ? 'state_marked_checked' : 'state_marked_unchecked') || 
        (newState === 1 ? 'State marked as checked' : 'State marked as unchecked')
      );
    } catch (error) {
      ErrorHandling(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Tooltip 
        title={
          currentState === 1 
            ? (translate('mark_as_unchecked') || 'Mark as unchecked')
            : (translate('mark_as_checked') || 'Mark as checked')
        }
      >
        <Switch
          checked={currentState === 1} // Checked state (1) is checked
          loading={loading}
          onChange={handleStateChange}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<StopOutlined />}
          style={{
            backgroundColor: currentState === 1 ? '#52c41a' : '#ff4d4f'
          }}
        />
      </Tooltip>
      <span style={{ 
        fontSize: '12px', 
        color: currentState === 1 ? '#52c41a' : '#ff4d4f',
        fontWeight: 'bold'
      }}>
        {currentState === 1 
          ? (translate('checked') || 'Checked')
          : (translate('unchecked') || 'Unchecked')
        }
      </span>
    </div>
  );
};

export default CheckInOutStateToggle;
