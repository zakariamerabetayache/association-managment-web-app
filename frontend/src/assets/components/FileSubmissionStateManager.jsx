import React, { useState } from "react";
import { Select, Button, message, Space, Tag, Popconfirm } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import fileSubmissionsService from "../services/fileSubmissionsService";
import { useLanguage } from "../locale/LanguageContext";

const FileSubmissionStateManager = ({ record, onUpdate }) => {
    const { translate } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [selectedState, setSelectedState] = useState(record.state);

    const stateOptions = [
        {
            value: "pending",
            label: translate("pending") || "Pending",
            color: "orange",
            icon: <ClockCircleOutlined />
        },
        {
            value: "approved",
            label: translate("approved") || "Approved",
            color: "green",
            icon: <CheckCircleOutlined />
        },
        {
            value: "rejected",
            label: translate("rejected") || "Rejected",
            color: "red",
            icon: <CloseCircleOutlined />
        },
    ];

    const currentStateOption = stateOptions.find(opt => opt.value === record.state);

    const handleStateChange = async () => {
        try {
            setLoading(true);
            await fileSubmissionsService.updateState(record.id, {
                state: selectedState
            });

            message.success(translate("submission_state_updated") || "Submission state updated successfully");

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Error updating submission state:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space direction="vertical" size="small" style={{ width: "100%", minWidth: "150px" }}>
            []
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
                        {translate("ok") || "OK"}
                    </Button>
                </Popconfirm>
            </Space.Compact>
        </Space>
    );
};

export default FileSubmissionStateManager;
