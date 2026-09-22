import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useLanguage } from "../locale/LanguageContext";
import { QRCode, Typography, Card, Space, Divider } from "antd";
import { HeartOutlined, SafetyOutlined, TeamOutlined, BookOutlined, SmileOutlined } from "@ant-design/icons";
import useResponsive from "../hooks/useResponsive";

const { Title, Paragraph, Text } = Typography;
export default function GuestLayout() {
  const { translate } = useLanguage();
  const { isMobile: isSmallScreen } = useResponsive();
  const handleAppModeChange = () => {
    const appmode = localStorage.getItem("appmode");
    switch (appmode) {
      case "0":
        return {
          title: translate("staff_administration"),
          subtitle: translate("childcare_management_system"),
          color: "#2563eb",
          bgGradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          description: translate("staff_platform_description"),
          features: [
            { text: translate("multi_level_management"), icon: <SafetyOutlined /> },
            { text: translate("member_tracking"), icon: <TeamOutlined /> },
            { text: translate("advanced_reporting"), icon: <BookOutlined /> }
          ]
        };
      case "1":
        return {
          title: translate("parent_portal"),
          subtitle: translate("your_child_journey"),
          color: "#006233",
          bgGradient: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
          description: translate("parent_platform_description"),
          features: [
            { text: translate("membership_status"), icon: <SafetyOutlined /> },
            { text: translate("activity_calendar"), icon: <TeamOutlined /> },
            { text: translate("direct_communication"), icon: <SmileOutlined /> }
          ]
        };
      default:
        return null;
    }
  };

  const { token } = useStateContext();

  if (token) {
    const appmode = localStorage.getItem("appmode");
    if (appmode == 0) return <Navigate to={"/mainLayout"} />;
    if (appmode == 1) return <Navigate to={"/joiner-layout"} />;
  }

  const appModeData = handleAppModeChange();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: !isSmallScreen ? "row" : "column-reverse",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Login Form Section */}
      <div
        style={{
          flexBasis: !isSmallScreen ? "50%" : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <Outlet />

        </div>
      </div>

      {/* Info and Image Section */}
      <div
        style={{
          flexBasis: !isSmallScreen ? "50%" : "100%",
          padding: "40px 30px",
          background: appModeData?.bgGradient || "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            zIndex: 0
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            zIndex: 0
          }}
        />

        {appModeData && (
          <div style={{ zIndex: 1, textAlign: "center", maxWidth: "90%" }}>
            {/* Logo/Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                fontSize: "32px",
                color: appModeData.color
              }}
            >
              <HeartOutlined />
            </div>

            {/* Title */}
            <Title
              level={1}
              style={{
                color: appModeData.color,
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "8px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              {appModeData.title}
            </Title>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: "1.1rem",
                color: "rgba(0, 0, 0, 0.7)",
                fontWeight: "500",
                display: "block",
                marginBottom: "24px"
              }}
            >
              {appModeData.subtitle}
            </Text>

            {/* Description */}
            <Paragraph
              style={{
                fontSize: "1rem",
                color: "rgba(0, 0, 0, 0.8)",
                lineHeight: "1.6",
                marginBottom: "32px",
                textAlign: "center"
              }}
            >
              {appModeData.description}
            </Paragraph>

            {/* Features */}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {appModeData.features.map((feature, index) => (
                <Card
                  key={index}
                  size="small"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    backdropFilter: "blur(10px)"
                  }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <Space align="center">
                    <div
                      style={{
                        color: appModeData.color,
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {feature.icon}
                    </div>
                    <Text
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        color: "rgba(0, 0, 0, 0.8)"
                      }}
                    >
                      {feature.text}
                    </Text>
                  </Space>
                </Card>
              ))}
            </Space>

          </div>
        )}
      </div>
    </div>
  );
}
