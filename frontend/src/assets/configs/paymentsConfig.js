import React from "react";
import { Tag, Button, Space, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import paymentsService from "../services/paymentsService";
import usersService from "../services/usersService";
import ErrorHandling from "../components/ErrorHandling";
import PaymentStateToggle from "../components/PaymentStateToggle";

// Payments CRUD Configuration
export const getPaymentsConfig = (user) => ({
  title: "payments",
  entityName: "payment",
  entityDisplayName: "payment",

  filters: [
    {
      key: "state",
      label: "payment_status",
      type: "select",
      options: [
        { value: 0, label: "pending" },
        { value: 1, label: "completed" },
      ],
    },
  ].filter(Boolean),

  // Table columns configuration
  columns: [
    {
      title: "joiner_name",
      dataIndex: "user",
      key: "joiner_name",
      render: (user) => {
        if (!user) return "-";
        return React.createElement('div', { style: { lineHeight: '1.2' } }, [
          React.createElement('div', {
            key: 'ar',
            style: { fontWeight: '500', color: '#1f2937' }
          }, `${user.prenom_ar || ''} ${user.nom_ar || ''}`),
          React.createElement('div', {
            key: 'fr',
            style: { fontSize: '12px', color: '#6b7280' }
          }, `${user.prenom_fr || ''} ${user.nom_fr || ''}`)
        ]);
      },
      width: 250,
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount} DA`,
      sorter: true,
      width: 150,
    },
    {
      title: "payment_date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      width: 150,
    },
    {
      title: "status",
      dataIndex: "state",
      key: "state",
      render: (state) => {
        const statusConfig = {
          0: { color: "orange", text: "pending" },
          1: { color: "green", text: "completed" },
        };
        const config = statusConfig[state] || { color: "default", text: "unknown" };
        return React.createElement(Tag, { color: config.color }, config.text);
      },
      width: 120,
    },
    {
      title: "receipt",
      dataIndex: "pdf_path",
      key: "receipt",
      render: (pdfPath, record) => {
        if (!pdfPath) return "-";

        return React.createElement(Space, {}, [
          React.createElement(Tooltip, { title: "View Receipt", key: "view" }, [
            React.createElement(Button, {
              type: "link",
              size: "small",
              icon: React.createElement(EyeOutlined),
              title: "View Receipt",
              onClick: () => {
                window.open(`${import.meta.env.VITE_API_BASE_URL}/storage/${pdfPath}`, '_blank');
              }
            })
          ])
        ]);
      },
      width: 120,
    },
    {
      title: "toggle_payment_state",
      dataIndex: "toggle_state",
      key: "toggle_state",
      render: (text, record) => {
        return React.createElement(PaymentStateToggle, { record });
      },
      width: 180,
    },
  ],

  // Form fields configuration - Note: No add/edit forms as per requirement
  fields: [], // Empty because payments cannot be added/edited from frontend
  actions: {
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
});

export default getPaymentsConfig;
