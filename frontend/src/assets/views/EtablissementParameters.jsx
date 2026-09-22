import React, { useEffect, useState } from "react";
import {
    Form,
    Card,
    Switch,
    message,
    Spin,
    Typography,
    Space,
    Row,
    Col,
    Badge,
} from "antd";
import {
    SettingOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import etablissementsService from "../services/etablissementsService";
import { useStateContext } from "../contexts/ContextProvider";
import { useLanguage } from "../locale/LanguageContext";
import ErrorHandling from "../components/ErrorHandling";

const { Title, Text } = Typography;

const EtablissementParameters = () => {
    const [form] = Form.useForm();
    const { translate } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [updatingFields, setUpdatingFields] = useState({});
    const [etablissement, setEtablissement] = useState(null);
    const { user, setUser } = useStateContext();

    useEffect(() => {
        fetchEtablissement();
    }, []);

    const fetchEtablissement = async () => {
        try {
            const id = user?.etablissement?.id;
            if (!id) {
                setLoading(false);
                return;
            }

            const response = await etablissementsService.getById(id);
            const data = response.data || response;
            setEtablissement(data);

            form.setFieldsValue({
                is_validation: !!data.is_validation,
            });
        } catch (error) {
            ErrorHandling(error);
        } finally {
            setLoading(false);
        }
    };

    const updateParameter = async (fieldName, checked) => {
        const etablissementId = user?.etablissement?.id || etablissement?.id;

        if (!etablissementId) {
            message.error(translate("no_establishment_associated") || "No establishment found");
            return;
        }

        try {
            setUpdatingFields((prev) => ({ ...prev, [fieldName]: true }));

            const parameterData = { [fieldName]: checked };

            const updateResponse = await etablissementsService.updateParameters(etablissementId, parameterData);
            const updatedEtab = updateResponse.etablissement?.data || updateResponse.etablissement || updateResponse.data || updateResponse;

            setEtablissement(updatedEtab);

            form.setFieldsValue({
                is_validation: !!updatedEtab.is_validation,
            });

            setUser({
                ...user,
                etablissement: updatedEtab,
            });

            message.success(translate("parameter_updated") || "Parameter updated successfully");
        } catch (error) {
            ErrorHandling(error);

            if (etablissement) {
                form.setFieldsValue({ [fieldName]: !!etablissement[fieldName] });
            }
        } finally {
            setUpdatingFields((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const ParameterItem = ({
        icon,
        title,
        desc,
        name,
        iconColor,
        bgColor,
        checkedChildren,
        unCheckedChildren,
        onChange,
    }) => (
        <div
            style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#fff",
                transition: "all 0.3s ease",
                border: "1px solid #f0f0f0",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
            }}
            className="parameter-item-hover"
        >
            <Row align="middle" gutter={24}>
                <Col>
                    <div
                        style={{
                            background: bgColor,
                            padding: "12px",
                            borderRadius: "12px",
                            color: iconColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 4px 10px ${bgColor}80`,
                        }}
                    >
                        {React.cloneElement(icon, { style: { fontSize: "24px" } })}
                    </div>
                </Col>
                <Col flex="1">
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: "17px", color: "#1a1a1a" }}>
                            {title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                            {desc}
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Form.Item name={name} valuePropName="checked" style={{ margin: 0 }}>
                        <Switch
                            size="large"
                            loading={updatingFields[name]}
                            checkedChildren={checkedChildren}
                            unCheckedChildren={unCheckedChildren}
                            onChange={(checked) => {
                                if (onChange && typeof onChange === 'function') {
                                    onChange(name, checked);
                                }
                            }}
                            style={{
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                minWidth: checkedChildren ? "80px" : "auto",
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            {updatingFields[name] && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "#006233",
                        animation: "loading-bar 1.5s infinite linear",
                    }}
                />
            )}
        </div>
    );

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" tip={translate("loading") || "Loading..."} />
            </div>
        );
    }

    return (
        <div style={{ padding: "20px 24px", maxWidth: "900px", margin: "0 auto" }}>
            <style>
                {`
                    @keyframes loading-bar {
                        0% { left: -100%; width: 100%; }
                        100% { left: 100%; width: 100%; }
                    }
                    .parameter-item-hover:hover {
                        border-color: #006233 !important;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        transform: translateY(-2px);
                    }
                `}
            </style>

            <div style={{ marginBottom: "40px", textAlign: "center" }}>
                <Badge count={<SettingOutlined style={{ color: "#006233", fontSize: "24px" }} />} offset={[10, 10]}>
                    <div
                        style={{
                            background: "#e8f5e9",
                            width: "80px",
                            height: "80px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}
                    >
                        <SettingOutlined style={{ fontSize: "40px", color: "#006233" }} />
                    </div>
                </Badge>
                <Title level={2} style={{ marginBottom: "8px", fontWeight: 700 }}>
                    {translate("establishment_parameters") || "إعدادات المؤسسة"}
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                    {translate("manage_establishment_settings_desc") || "قم بتعديل إعدادات المؤسسة حسب إحتياجاتك"}
                </Text>
            </div>

            <Card
                bordered={false}
                style={{
                    borderRadius: "24px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    background: "#fcfcfc",
                    padding: "12px",
                }}
            >
                <Form form={form} layout="vertical">
                    <ParameterItem
                        name="is_validation"
                        icon={<SafetyCertificateOutlined />}
                        iconColor="#006233"
                        bgColor="#e8f5e9"
                        title={translate("identity_verification") || "التحقق من الهوية"}
                        desc={translate("identity_verification_desc") || "عند تفعيل هذا الخيار، سيتم مطالبة المنخرطين الجدد بإرفاق وثيقة الهوية وصورة شخصية عند التسجيل وانتظار الموافقة"}
                        checkedChildren={translate("active") || "فعال"}
                        unCheckedChildren={translate("inactive") || "غير فعال"}
                        onChange={updateParameter}
                    />
                </Form>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <Space size="small" style={{ color: "#8c8c8c" }}>
                        <CheckCircleOutlined />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {translate("changes_saved_automatically") || "يتم حفظ التغييرات تلقائيا"}
                        </Text>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default EtablissementParameters;
