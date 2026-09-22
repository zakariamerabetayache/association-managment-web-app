import React from "react";

/**
 * JoiningTypes CRUD Configuration
 */
export const getJoiningTypesConfig = (user) => ({
    title: "joining_types",
    entityName: "joining_type",
    entityDisplayName: "joining_type",

    // Table columns configuration
    columns: [
        {
            title: "designation_ar",
            dataIndex: "designation_ar",
            key: "designation_ar",
            render: (text) => {
                return React.createElement('div', {
                    style: { fontWeight: '500', color: '#1f2937' }
                }, text || '-');
            },
        },
        {
            title: "designation_fr",
            dataIndex: "designation_fr",
            key: "designation_fr",
            render: (text) => {
                return React.createElement('div', {
                    style: { fontSize: '12px', color: '#6b7280' }
                }, text || '-');
            },
        },
        {
            title: "card_validity",
            dataIndex: "card_validity",
            key: "card_validity",
            render: (text) => `${text} years`,
        },
        {
            title: "enrollment_code",
            dataIndex: "enrollment_code",
            key: "enrollment_code",
        },
    ],

    // Form fields configuration
    fields: [
        {
            key: "designation_ar",
            label: "designation_ar",
            type: "text",
            rules: [{ required: true, message: "please_enter_designation_ar" }],
        },
        {
            key: "designation_fr",
            label: "designation_fr",
            type: "text",
            rules: [{ required: true, message: "please_enter_designation_fr" }],
        },
        {
            key: "card_validity",
            label: "card_validity",
            type: "select",
            options: [
                { value: 1, label: "1 Year" },
                { value: 2, label: "2 Years" },
                { value: 3, label: "3 Years" },
            ],
            rules: [{ required: true, message: "please_select_card_validity" }],
        },
        {
            key: "enrollment_code",
            label: "enrollment_code",
            type: "select",
            options: [
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
            ],
            rules: [{ required: true, message: "please_select_enrollment_code" }],
        },
    ],

    // Default values for new entities
    silencevalues: {
        app_id: 0,
    },

    // View fields configuration
    viewFields: [
        { key: "designation_ar", label: "designation_ar" },
        { key: "designation_fr", label: "designation_fr" },
        { key: "card_validity", label: "card_validity" },
        { key: "enrollment_code", label: "enrollment_code" },
    ],

    // Permissions/Actions
    actions: {
        create: true,
        edit: true,
        delete: true,
        view: true,
    },
});

