import React, { useState, useEffect } from "react";
import { Card, Button, Upload, App, Spin, Typography, Descriptions, Tag } from "antd";
import { DollarOutlined, UploadOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import axiosClient from "../../axios-client";
import { useLanguage } from "../locale/LanguageContext";
import { useStateContext } from "../contexts/ContextProvider";
import ErrorHandling from "../components/ErrorHandling"
import UploadFile from "./uploadComponent/UploadFile";
import { useNavigate } from "react-router-dom";

import paymentsService from "../services/paymentsService";
const { Title, Text, Paragraph } = Typography;

const PaymentCard = () => {
  const { translate } = useLanguage();
  const { user, setUser } = useStateContext();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [iscard, setIsCard] = useState(false);

  const [etablissement, setEtablissement] = useState(null);
  const navigate = useNavigate();

  let getIsCad = async () => {
    try {
      let response = await paymentsService.IsCard(user.id);
      setIsCard(response.data);
    } catch (error) {
      console.error("Error checking card status:", error);
    } finally {
      if (!user?.etablissement?.id) {
        setLoading(false);
      }
    }
  };


  useEffect(() => {
    if (user?.etablissement?.id) {
      fetchEtablissement();
    } else {
      setLoading(false);
    }

  }, [user?.etablissement?.id]);
  useEffect(() => {
    getIsCad()
  }, []);

  const changeState = (state) => {
    setUser({
      ...user,
      price_receipt: state.receipt_path
    });
  }
  const fetchEtablissement = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/etablissements/${user.etablissement_id}`);
      setEtablissement(response.data);
    } catch (error) {
      console.error("Error fetching etablissement:", error);
      message.error(translate("failed_to_load_etablissement") || "Failed to load establishment details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);

      const response = await axiosClient.post(
        `/joiner/${user.id}/upload-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      message.success(response.data.message || "تم رفع الملف بنجاح");

      // Update user context with new receipt path
      setUser({
        ...user,
        price_receipt: response.data.receipt_path
      });


      return false;
    } catch (error) {
      console.error("Upload error:", error);
      ErrorHandling(error);
      return false;
    } finally {
      setUploading(false);
    }
  };




  if (user?.state !== 1) {
    return null; // Don't show card if user is not in payment state
  }

  if (loading) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <Spin />
      </Card>
    );
  }

  if (!iscard) {
    return <div></div>
  }
  else {
    return (
      <Card
        style={{ marginBottom: 24 }}
        styles={{
          body: { background: "linear-gradient(135deg, #006233 0%, #00873a 100%)", color: "white" }
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <DollarOutlined style={{ fontSize: 32, marginRight: 12 }} />
          <Title level={3} style={{ margin: 0, color: "white" }}>
            {translate("payment_required") || "Payment Required"}
          </Title>
        </div>

        <Paragraph style={{ color: "white", fontSize: 16 }}>
          {translate("payment_instruction") ||
            "Your account has been approved! Please complete the payment via BaridiMob to activate your account."}
        </Paragraph>

        {etablissement && (
          <Card
            style={{ marginBottom: 16, background: "rgba(255,255,255,0.95)" }}
            size="small"
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={<strong>{translate("owner_name") || "Owner Name"}</strong>}
              >
                {etablissement.owner_name_fr && etablissement.owner_last_name_fr
                  ? `${etablissement.owner_name_fr.toUpperCase() + " " + etablissement.owner_last_name_fr.toUpperCase()}`
                  : etablissement.owner_name_fr && etablissement.owner_last_name_fr
                    ? `${etablissement.owner_name_fr.toUpperCase() + " " + etablissement.owner_last_name_fr.toUpperCase()}`
                    : translate("not_available") || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>{translate("rip") || "RIP"}</strong>}
              >
                {etablissement.rip || (translate("not_available") || "N/A")}
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>{translate("amount_to_pay") || "Amount to Pay"}</strong>}
              >
                <Tag color="green" style={{ fontSize: 16, padding: "4px 12px" }}>
                  {etablissement.price
                    ? `${parseFloat(etablissement.price).toFixed(2)} DA`
                    : (translate("not_specified") || "Not specified")}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        <div style={{ marginTop: 16 }}>


          <Button
            type="primary"
            size="large"
            icon={<DollarOutlined />}
            style={{
              width: "100%",
              height: "50px",
              background: "rgba(255, 255, 255, 0.15)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              marginTop: "16px",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background = "rgba(255, 255, 255, 0.25)";
              e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.background = "rgba(255, 255, 255, 0.15)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onClick={() => navigate("/joiner-layout/payments")}
          >
            {translate("manage_my_payments") || "إدارة مدفوعاتي"}
          </Button>


        </div>

        <div style={{ marginTop: 16, padding: 12, background: "rgba(255,255,255,0.2)", borderRadius: 8 }}>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          <Text style={{ color: "white", fontSize: 14 }}>
            {translate("payment_verification_note") ||
              "After uploading your receipt, our team will verify your payment within 24-48 hours."}
          </Text>
        </div>
      </Card>
    );
  }

};

export default PaymentCard;
