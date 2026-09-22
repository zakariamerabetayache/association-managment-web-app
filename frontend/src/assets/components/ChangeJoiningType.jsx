import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Select, message, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useLanguage } from "../locale/LanguageContext";
import joiningTypesService from "../services/joiningTypesService";
import joinersService from "../services/joinersService";
import ErrorHandling from "./ErrorHandling";

/**
 * Component to change the joining type of a joiner (user)
 * This triggers an update of joining_type_id and re-calculates expiration_date
 */
export default function ChangeJoiningType({ record, onSuccess }) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [joiningTypes, setJoiningTypes] = useState([]);
    const [form] = Form.useForm();
    const { translate } = useLanguage();

    useEffect(() => {
        if (visible) {
            fetchJoiningTypes();
            form.setFieldsValue({
                joining_type_id: record.joining_type_id
            });
        }
    }, [visible, record.joining_type_id]);

    const fetchJoiningTypes = async () => {
        try {
            // Get data for dropdown
            const response = await joiningTypesService.getAll();
            setJoiningTypes(response?.data || []);
        } catch (error) {
            ErrorHandling(error);
        }
    };

    const showModal = () => setVisible(true);
    const closeModal = () => {
        setVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await joinersService.updateJoiningType(record.id, values.joining_type_id);
            message.success(translate("update_success") || "تم التحديث بنجاح");
            closeModal();
            if (onSuccess) onSuccess();
        } catch (error) {
            ErrorHandling(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                icon={<HistoryOutlined />}
                onClick={showModal}
                style={{
                    backgroundColor: "#87d068",
                    borderColor: "#87d068",
                    color: "white",
                }}
                title={translate("change_period_of_card") || "تغيير مدة البطاقة"}
                size="small"
            >
                {translate("card_period") || "المدة"}
            </Button>

            <Modal
                title={translate("change_period_of_card") || "تغيير نوع الانخراط ومدة البطاقة"}
                open={visible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                confirmLoading={loading}
                okText={translate("submit") || "تأكيد"}
                cancelText={translate("cancel") || "إلغاء"}
            >
                <div style={{ marginBottom: '16px' }}>
                    <Typography.Text type="secondary">
                        {translate("update_joining_type_hint") || "تغيير نوع الانخراط سيقوم بإعادة حساب تاريخ انتهاء صلاحية البطاقة بناءً على عدد السنوات المحدد لكل نوع."}
                    </Typography.Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="joining_type_id"
                        label={translate("joining_type") || "نوع الانخراط"}
                        rules={[{ required: true, message: translate("please_select_joining_type") || 'يرجى اختيار نوع الانخراط' }]}
                    >
                        <Select
                            placeholder={translate("select_joining_type") || "اختر نوع الانخراط"}
                            loading={joiningTypes.length === 0}
                        >
                            {joiningTypes.map(type => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.designation_ar} ({type.card_validity} {translate("years") || "سنوات"})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
