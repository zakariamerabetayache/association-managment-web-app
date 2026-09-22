import React, { useState } from "react";
import { Select, Button, message, Space, Tag, Popconfirm } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";
import axiosClient from "../../axios-client";
import { useLanguage } from "../locale/LanguageContext";

const PaymentStateManager = ({ record, onUpdate }) => {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(record.state);

  const stateOptions = [
    { 
      value: 0, 
      label: translate("pending_approval") || "Pending Approval",
      color: "orange",
      icon: <ClockCircleOutlined />
    },
    { 
      value: 1, 
      label: translate("approved_needs_payment") || "Approved - Needs Payment",
      color: "blue",
      icon: <DollarOutlined />
    },
    { 
      value: 2, 
      label: translate("paid") || "Paid",
      color: "green",
      icon: <CheckCircleOutlined />
    },
  ];

  const currentStateOption = stateOptions.find(opt => opt.value === selectedState);

  const handleStateChange = async () => {
    try {
      setLoading(true);
      await axiosClient.put(`/users/${record.id}/payment-state`, {
        state: selectedState
      });

      message.success(translate("payment_state_updated") || "Payment state updated successfully");
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating payment state:", error);
      message.error(
        error.response?.data?.message || 
        translate("failed_to_update_state") || 
        "Failed to update payment state"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Tag 
        color={currentStateOption?.color} 
        icon={currentStateOption?.icon}
        style={{ marginBottom: 8 }}
      >
        {currentStateOption?.label}
      </Tag>
      
      <Space.Compact style={{ width: "100%" }}>
        <Select
          value={selectedState}
          onChange={setSelectedState}
          style={{ width: "70%" }}
          size="small"
          options={stateOptions.map(opt => ({
            value: opt.value,
            label: opt.label
          }))}
        />
        
        <Popconfirm
          title={translate("confirm_state_change") || "Confirm state change?"}
          description={translate("state_change_description") || "This will update the parent's payment status."}
          onConfirm={handleStateChange}
          okText={translate("yes") || "Yes"}
          cancelText={translate("no") || "No"}
          disabled={selectedState === record.state}
        >
          <Button 
            type="primary" 
            size="small"
            loading={loading}
            disabled={selectedState === record.state}
            style={{ width: "30%" }}
          >
            {translate("update") || "Update"}
          </Button>
        </Popconfirm>
      </Space.Compact>
    </Space>
  );
};

export default PaymentStateManager;
