export const documentTypesConfig = {
    entityName: 'documentType',
    title: 'document_types',
    entityDisplayName: 'document_types',
    columns: [

        {
            title: 'designation_ar',
            dataIndex: 'designation_ar',
            key: 'designation_ar',
        },
        {
            title: 'designation_fr',
            dataIndex: 'designation_fr',
            key: 'designation_fr',
        },
    ],
    fields: [
        {
            key: 'designation_ar',
            label: 'designation_ar',
            type: 'text',
            rules: [{ required: true }],
        },
        {
            key: 'designation_fr',
            label: 'designation_fr',
            type: 'text',
            rules: [{ required: true }],
        },
    ],
    actions: {
        create: true,
        edit: true,
        delete: true,
    }
};
