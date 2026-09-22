import React, { useState } from "react";
import { Button, Drawer, Form, Input, Select, DatePicker, message, Space, Card, Typography } from "antd";
import { FileTextOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import axiosClient from "../../axios-client";
import { useLanguage } from "../locale/LanguageContext";
import { useStateContext } from "../contexts/ContextProvider";
import dayjs from "dayjs";
import ErrorHandling from "../components/ErrorHandling";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function JoinerRequest({ record, onOrderCreated }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { translate } = useLanguage();
    const { user } = useStateContext();

    const showDrawer = () => {
        setDrawerVisible(true);
        // Pre-fill form with joiner information
        form.setFieldsValue({
            joiner_id: record.id,
            joiner_name: `${record.nom_ar || ''} ${record.prenom_ar || ''}`.trim(),
            joiner_email: record.email,
            order_date: dayjs(),
            priority: "medium"
        });
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const requestData = {
                joiner_id: record.id,
                user_id: user.id, // Current logged-in user (admin) who is creating the request
                type: values.type,
                description: values.description,
                state: 0 // Default state: sent
            };

            const response = await axiosClient.post('/joiner-requests', requestData);

            message.success("تم إنشاء الطلب بنجاح");
            closeDrawer();

            // Refresh joiner list if callback provided
            if (typeof onOrderCreated === 'function') {
                onOrderCreated();
            }
        } catch (error) {
            ErrorHandling(error);
        } finally {
            setLoading(false);
        }
    };

    if (!record) {
        return (
            <Button size="small" disabled>
                {translate("request") || "طلب"}
            </Button>
        );
    }

    return (
        <>
            <Button
                icon={<FileTextOutlined />}
                onClick={showDrawer}
                style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    color: "white",
                }}
                title={translate("set_request") || "إضافة طلب للمنخرط"}
                size="small"
            >
                {translate("request") || "طلب"}
            </Button>

            <Drawer
                title={translate("create_request") || "إضافة طلب منخرط"}
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={400}
                style={{ direction: 'rtl' }}
            >
                {record && (
                    <div>
                        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                            <h4>{translate("joiner_details") || "معلومات المنخرط"}:</h4>
                            <p><strong>{translate("name") || "الاسم"}:</strong> {record.nom_ar} {record.prenom_ar}</p>
                            <p><strong>{translate("email_address") || "البريد الإلكتروني"}:</strong> {record.email}</p>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                name="type"
                                label={translate("request_type") || "نوع الطلب"}
                                rules={[{ required: true, message: translate("please_select_request_type") || 'يرجى اختيار نوع الطلب' }]}
                            >
                                <Select placeholder={translate("select_request_type") || "اختر نوع الطلب"}>
                                    <Select.Option value={0}>{translate("summon_order") || "أمر بإستدعاء"}</Select.Option>
                                    <Select.Option value={1}>{translate("file_order") || "إدراج ملف"}</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={translate("request_description") || "وصف الطلب"}
                                rules={[{ required: true, message: translate("please_enter_description") || 'يرجى إدخال وصف الطلب' }]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder={translate("enter_request_description") || "اكتب وصف مفصل للطلب..."}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        {translate("create_request") || "إضافة الطلب"}
                                    </Button>
                                    <Button onClick={closeDrawer}>
                                        {translate("cancel") || "إلغاء"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Drawer>
        </>
    );
}
