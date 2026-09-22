import React from "react";
import { Button, Space, Tooltip } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import documentTypesService from "../services/documentTypesService";
import joinersService from "../services/joinersService";
import axios from "axios";

// Helper function to force download
const handleDownload = async (fileUrl, fileName) => {
    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'blob', // Important for downloading files
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error("Error downloading document:", error);
    }
};

export const getDocumentsConfig = () => ({
    entityName: 'document',
    title: 'documents',
    entityDisplayName: 'document',
    filters: [
        {
            key: 'document_type_id',
            label: 'document_type',
            type: 'select',
            loadOptions: async () => await documentTypesService.getAllForDropdown(),
        },
        {
            key: 'document_date',
            label: 'document_date',
            type: 'date',
        },
        {
            key: 'joiner_id',
            label: 'member_name',
            type: 'select',
            loadOptions: async () => await joinersService.getAllForDropdown(),
        },
        {
            key: 'is_privet',
            label: 'is_privet',
            type: 'select',
            options: [
                { label: 'yes', value: 1 },
                { label: 'no', value: 0 },
            ]
        },
    ],
    columns: [
        {
            title: 'designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'document_type',
            dataIndex: ['document_type', 'designation_fr'],
            key: 'document_type',
        },
        {
            title: 'document_date',
            dataIndex: 'document_date',
            key: 'document_date',
        },
        {
            title: 'document_deposite_date',
            dataIndex: 'document_deposite_date',
            key: 'document_deposite_date',
        },
        {
            title: 'is_privet',
            dataIndex: 'is_privet',
            key: 'is_privet',
            render: (val) => val ? 'نعم' : 'لا'
        },
        {
            title: 'pdf_file',
            dataIndex: 'pdf_path',
            key: 'pdf_file',
            render: (pdfPath, record) => {
                if (!pdfPath) return "-";

                const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${pdfPath}`;
                const fileName = record.designation ? `${record.designation}.pdf` : 'document.pdf';

                return React.createElement(Space, {}, [
                    React.createElement(Tooltip, { title: "view", key: "view" }, [
                        React.createElement(Button, {
                            type: "link",
                            size: "small",
                            icon: React.createElement(EyeOutlined),
                            onClick: () => {
                                window.open(fileUrl, '_blank');
                            }
                        })
                    ]),

                ]);
            },
        },
    ],
    fields: [
        {
            key: 'designation',
            label: 'designation',
            type: 'text',
            rules: [{ required: true }],
        },
        {
            key: 'document_type_id',
            label: 'document_type',
            type: 'select',
            rules: [{ required: true }],
            loadOptions: async () => await documentTypesService.getAllForDropdown(),
        },
        {
            key: 'document_date',
            label: 'document_date',
            type: 'date',
            rules: [{ required: true }],
        },
        {
            key: 'document_deposite_date',
            label: 'document_deposite_date',
            type: 'date',
            rules: [{ required: true }],
        },
        {
            key: 'is_privet',
            label: 'is_privet',
            type: 'switch',
            rules: [{ required: true }],
            initialValue: false,
        },
        {
            key: 'joiner_id',
            label: 'member_name',
            type: 'select',
            required: false,
            depends: 'is_privet',
            dependsIn: [true],
            loadOptions: async () => await joinersService.getAllForDropdown(),
        },
        {
            key: 'description',
            label: 'description',
            type: 'textarea',
            required: false,
        },
        {
            key: 'file',
            label: 'pdf_file',
            type: 'pdf',
            required: false,
        },
    ],
    viewFields: [
        { key: 'designation', label: 'designation' },
        {
            key: 'document_type',
            label: 'document_type',
            render: (_, record) => record?.document_type?.designation_fr || '-'
        },
        { key: 'document_date', label: 'document_date' },
        { key: 'document_deposite_date', label: 'document_deposite_date' },
        {
            key: 'is_privet',
            label: 'is_privet',
            render: (val) => val ? 'Yes' : 'No'
        },
        {
            key: 'joiner_id',
            label: 'member_name',
            render: (_, record) => record?.joiner ? `${record.joiner.nom_fr || ''} ${record.joiner.prenom_fr || ''}` : '-'
        },
        { key: 'description', label: 'description' },
        {
            key: 'pdf_path',
            label: 'pdf_file',
            render: (pdfPath, record) => {
                if (!pdfPath) return "-";

                const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${pdfPath}`;
                const fileName = record.designation ? `${record.designation}.pdf` : 'document.pdf';

                return React.createElement(Space, {}, [
                    React.createElement(Button, {
                        type: "link",
                        icon: React.createElement(EyeOutlined),
                        onClick: () => {
                            window.open(fileUrl, '_blank');
                        }
                    }, "View Document"),

                ]);
            }
        },
    ],
    actions: {
        create: true,
        edit: true,
        delete: true,
        view: true,
    }
});
