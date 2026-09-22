import React from "react";
import { Button, Tag, Space, Tooltip } from "antd";
import { FilePdfOutlined, EyeOutlined, DownloadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useLanguage } from "../locale/LanguageContext";

const FileSubmissionViewer = ({ record }) => {
    const { translate } = useLanguage();

    if (!record.pdf_path) {
        return (
            <Tag icon={<CloseCircleOutlined />} color="default">
                {translate("no_pdf") || "No PDF"}
            </Tag>
        );
    }

    // Handle both absolute and relative paths
    const pdfUrl = record.pdf_path.startsWith('http')
        ? record.pdf_path
        : `${import.meta.env.VITE_API_BASE_URL}/storage/${record.pdf_path.replace('public/', '')}`;

    return (
        <Space size="small">
            <Tooltip title={translate("view_pdf") || "View PDF"}>
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                />
            </Tooltip>


            <Tag icon={<FilePdfOutlined />} color="blue" style={{ margin: 0 }}>
                PDF
            </Tag>
        </Space>
    );
};

export default FileSubmissionViewer;
