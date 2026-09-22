import React, { useState } from "react";
import { Button, Input, Modal, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import concernsService from "../services/concernsService";

const { Paragraph } = Typography;

const ConcernResponse = ({ record, onSuccess }) => {
    const [visible, setVisible] = useState(false);
    const [responseText, setResponseText] = useState(record.response || "");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setVisible(true);
    const handleClose = () => {
        setVisible(false);
        setResponseText(record.response || "");
    };

    const handleSendResponse = async () => {
        if (!responseText.trim()) {
            Swal.fire({
                icon: "warning",
                title: "تحذير",
                text: "يرجى إدخال نص الرد",
            });
            return;
        }

        setLoading(true);
        try {
            await concernsService.updateResponse(record.id, { response: responseText });
            Swal.fire({
                icon: "success",
                title: "تم الإرسال بنجاح",
                showConfirmButton: false,
                timer: 1500,
            });
            setVisible(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                icon={<MessageOutlined />}
                style={{ backgroundColor: "#1890FF", color: "white" }}
                onClick={handleOpen}
            >
                {record.response ? "تعديل الرد" : "الإجابة على الشكوى"}
            </Button>
            <Modal
                title={
                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        الإجابة على الشكوى
                    </div>
                }
                open={visible}
                onCancel={handleClose}
                centered
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        إلغاء
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSendResponse}
                    >
                        إرسال
                    </Button>,
                ]}
            >
                <div style={{ textAlign: "right", direction: "rtl" }}>
                    <br />
                    <Paragraph
                        style={{
                            margin: "40px 0 20px",
                            backgroundColor: "#f8f9fa",
                            padding: "12px",
                            borderRadius: "8px",
                        }}
                    >
                        <strong>وصف الشكوى:</strong> {record.description}
                    </Paragraph>
                    <Input.TextArea
                        rows={4}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="أدخل إجابتك هنا..."
                    />
                </div>
            </Modal>
        </>
    );
};

export default ConcernResponse;
