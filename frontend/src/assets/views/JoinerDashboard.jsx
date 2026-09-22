import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../locale/LanguageContext";
import { useStateContext } from "../contexts/ContextProvider";
import PaymentCard from "../components/PaymentCard";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Spin,
  Avatar,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const JoinerDashboard = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome Section */}
      <Card
        style={{
          marginBottom: 24,
          background: "linear-gradient(135deg, #006233 0%, #00873a 100%)",
          border: "none",
          borderRadius: 16,
        }}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >{
                user?.self_photo ? (
                  <Avatar
                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${user?.self_photo}`}
                    icon={<UserOutlined />}
                    style={{ width: 64, height: 64, fontSize: 28 }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: 28, color: "#fff" }} />
                )
              }
            </div>
          </Col>
          <Col flex="auto">
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              {translate("welcome")},{" "}
              {user?.prenom_ar || user?.prenom_fr || ""}
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
              {translate("joiner_dashboard_subtitle")}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Payment Card */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <PaymentCard />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            onClick={() => navigate("/joiner-layout/payments")}
            style={{
              borderRadius: 12,
              height: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Space direction="vertical" align="center" style={{ width: "100%", padding: "16px 0" }}>
              <DollarOutlined style={{ fontSize: 40, color: "#006233" }} />
              <Title level={4} style={{ margin: "8px 0 0 0" }}>
                {translate("manage_my_payments")}
              </Title>
              <Text type="secondary">
                {translate("view_payment_history")}
              </Text>
            </Space>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default JoinerDashboard;
