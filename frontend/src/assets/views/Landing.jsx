import React, { useState, useEffect } from "react";
import "../../index.css";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../locale/LanguageContext";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Avatar,
  Badge,
  Statistic,
  Select,
} from "antd";
import {
  HeartOutlined,
  SafetyOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  StarFilled,
  HomeOutlined,
  SmileOutlined,
  UserAddOutlined,
  LoginOutlined,
  RocketOutlined,
  GlobalOutlined,
  TrophyOutlined,
  CalendarOutlined,
  SolutionOutlined,
  BankOutlined,
  AuditOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import etablissementsService from "../services/etablissementsService";
import ErrorHandling from "../components/ErrorHandling";
const { Title, Paragraph, Text } = Typography;

import heroImage from "../img/association_hero.png";

const Landing = () => {
  const { translate, changeLanguage, currentLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(currentLanguage);
  const [etablissements, setEtablissements] = useState(() => {
    const cached = localStorage.getItem("etablissement");
    try {
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(!localStorage.getItem("etablissement"));

  const getEtablisments = async () => {
    try {
      const response = await etablissementsService.getAll();
      const data = response.data[0];
      setEtablissements(data);
      localStorage.setItem("etablissement", JSON.stringify(data));
    } catch (error) {
      ErrorHandling(error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };



  useEffect(() => {
    changeLanguage(currentLang);
  }, [currentLang]);

  useEffect(() => {
    getEtablisments();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0f7f4 0%, #ffffff 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}>
        <style>
          {`
            @keyframes pulse-ring {
              0% { transform: scale(0.33); opacity: 0.8; }
              80%, 100% { opacity: 0; }
            }
            @keyframes pulse-dot {
              0% { transform: scale(0.8); }
              50% { transform: scale(1); }
              100% { transform: scale(0.8); }
            }
            .loading-pulse {
              position: relative;
              width: 100px;
              height: 100px;
              background: #006233;
              border-radius: 50%;
              animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 20px rgba(0, 98, 51, 0.3);
            }
            .loading-pulse::before {
              content: '';
              position: absolute;
              display: block;
              width: 300%;
              height: 300%;
              box-sizing: border-box;
              margin-left: -100%;
              margin-top: -100%;
              border-radius: 50%;
              background-color: #006233;
              animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
              opacity: 0.1;
            }
          `}
        </style>

        <div className="loading-pulse">
          <TeamOutlined style={{ fontSize: '40px', color: '#fff' }} />
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            color: '#1a1a1a',
            marginBottom: '10px',
            fontWeight: '700',
          }}>
            {translate("loading")}
          </h2>
          <p style={{
            color: '#666',
            fontSize: '16px',
          }}>
            {translate("please_wait")}
          </p>
        </div>
      </div>
    );
  }

  const handleGetStarted = (mode) => {
    localStorage.setItem("appmode", mode.toString());
    navigate("/login");
  };

  const handleAdminLogin = () => {
    handleGetStarted(0);
  };

  const handleMemberSignup = () => {
    handleGetStarted(1);
  };

  return (
    <div className="landing-container" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Header etablissements={etablissements} currentLang={currentLang} setCurrentLang={setCurrentLang} translate={translate} handleAdminLogin={handleAdminLogin} handleMemberSignup={handleMemberSignup} isRTL={isRTL} />
      <HeroSection handleAdminLogin={handleAdminLogin} handleMemberSignup={handleMemberSignup} translate={translate} isRTL={isRTL} />
      <FeaturesSection translate={translate} isRTL={isRTL} />
      <StatsSection translate={translate} isRTL={isRTL} joinerCount={etablissements?.joiners_count} />
      <CTASection handleAdminLogin={handleAdminLogin} handleMemberSignup={handleMemberSignup} translate={translate} isRTL={isRTL} />
      <Footer etablissements={etablissements} currentLang={currentLang} translate={translate} isRTL={isRTL} />
    </div>
  );
};

// Header Component
const Header = ({ etablissements, currentLang, setCurrentLang, translate, handleAdminLogin, handleMemberSignup, isRTL }) => {
  const logo = etablissements?.logo ? `${import.meta.env.VITE_API_BASE_URL}/${etablissements?.logo}` : null;
  const designation = currentLang === 'ar' ? etablissements?.designation_ar : etablissements?.designation_fr;

  return (
    <header className="landing-header">
      <div className="header-container">
        <div className={"header-content-ltr"}>
          <div className="header-logo-assoc">
            <div className="logo-icon-assoc" style={logo ? { background: 'none', boxShadow: 'none' } : {}}>
              {logo ? (
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <TeamOutlined />
              )}
            </div>
            <span className="logo-text-assoc">{designation || translate("association_name")}</span>
          </div>

          <nav className={isRTL ? "header-nav-rtl" : "header-nav-ltr"}>
            <a href="#features" className="nav-link">
              {translate("assoc_our_services")}
            </a>
            <a href="#about" className="nav-link">
              {translate("assoc_about_us")}
            </a>
            <a href="#contact" className="nav-link">
              {translate("assoc_contact")}
            </a>

            {/* Language Selector */}
            <Select
              value={currentLang}
              style={{
                width: "120px",
                marginRight: isRTL ? "0" : "16px",
                marginLeft: isRTL ? "16px" : "0"
              }}
              options={[
                {
                  value: "ar",
                  label: <span>🇩🇿 العربية</span>,
                },
                {
                  value: "en",
                  label: <span>🇺🇸 English</span>,
                },
                {
                  value: "fr",
                  label: <span>🇫🇷 Français</span>,
                },
              ]}
              onChange={(value) => setCurrentLang(value)}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = ({ handleAdminLogin, handleMemberSignup, translate, isRTL }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <Row gutter={[48, 48]} align="middle" className="hero-row" style={{ justifyContent: "space-between", direction: isRTL ? 'rtl' : 'ltr' }}>
          <Col xs={24} lg={12} >
            <div className="hero-content" style={{ textAlign: isRTL ? 'right' : 'left', margin: isRTL ? '0 16px 0 0' : '0 0 16px 16px' }}>
              <Badge.Ribbon
                text={translate("assoc_badge_text")}
                color="#006233"
                className="hero-badge"
                placement={isRTL ? 'start' : 'end'}
              >
                <div>
                  <Text className="hero-badge-text">

                  </Text>
                </div>
              </Badge.Ribbon>

              <Title level={1} className="hero-title" style={{ textAlign: isRTL ? 'right' : 'left', padding: isRTL ? '0 0 30px 0' : '0 0 16px 16px' }}>
                {translate("assoc_hero_title")}
                <br />
                <span className="hero-gradient-text">{translate("assoc_hero_subtitle")}</span>
              </Title>

              <Paragraph className="hero-description" style={{ textAlign: isRTL ? 'right' : 'left', padding: isRTL ? '0 16px 0 0' : '0 0 16px 16px' }}>
                {translate("assoc_hero_description")}
              </Paragraph>

              <Space
                size="large"
                className="hero-buttons"
                style={{
                  justifyContent: isRTL ? 'flex-end' : 'flex-start',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  className="hero-primary-button assoc-btn-primary"
                  icon={<UserAddOutlined />}
                  onClick={handleMemberSignup}
                >
                  {translate("assoc_join_now")}
                </Button>

                <Button
                  size="large"
                  className="hero-secondary-button"
                  icon={<LoginOutlined />}
                  onClick={handleAdminLogin}
                >
                  {translate("assoc_admin_login")}
                </Button>
              </Space>

              <div className="hero-features" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="hero-feature" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <CheckCircleOutlined style={{ marginLeft: isRTL ? '8px' : '0', marginRight: isRTL ? '0' : '8px' }} />
                  <Text className="hero-feature-text">
                    {translate("assoc_feature_1")}
                  </Text>
                </div>
                <div className="hero-feature" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <CheckCircleOutlined style={{ marginLeft: isRTL ? '8px' : '0', marginRight: isRTL ? '0' : '8px' }} />
                  <Text className="hero-feature-text">{translate("assoc_feature_2")}</Text>
                </div>
                <div className="hero-feature" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <CheckCircleOutlined style={{ marginLeft: isRTL ? '8px' : '0', marginRight: isRTL ? '0' : '8px' }} />
                  <Text className="hero-feature-text">{translate("assoc_feature_3")}</Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12} style={{ order: isRTL ? 1 : 2, width: "100%" }}>
            <img style={{ border: "1px solid #d1d5db", margin: "0px auto", borderRadius: "16px", height: "80vh" }} src={heroImage} alt="" />
          </Col>
        </Row>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = ({ translate, isRTL }) => {
  const features = [
    {
      icon: <TeamOutlined className="text-3xl" />,
      title: translate("assoc_svc_community"),
      description: translate("assoc_svc_community_desc"),
      color: "#006233",
    },
    {
      icon: <SolutionOutlined className="text-3xl" />,
      title: translate("assoc_svc_rights"),
      description: translate("assoc_svc_rights_desc"),
      color: "#D52B1E",
    },
    {
      icon: <FundProjectionScreenOutlined className="text-3xl" />,
      title: translate("assoc_svc_projects"),
      description: translate("assoc_svc_projects_desc"),
      color: "#2563eb",
    },
    {
      icon: <BookOutlined className="text-3xl" />,
      title: translate("assoc_svc_training"),
      description: translate("assoc_svc_training_desc"),
      color: "#9333ea",
    },
    {
      icon: <GlobalOutlined className="text-3xl" />,
      title: translate("assoc_svc_network"),
      description: translate("assoc_svc_network_desc"),
      color: "#059669",
    },
    {
      icon: <AuditOutlined className="text-3xl" />,
      title: translate("assoc_svc_transparency"),
      description: translate("assoc_svc_transparency_desc"),
      color: "#d97706",
    },
  ];

  return (
    <section id="features" className="features-section" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="features-container">
        <div className="features-header" style={{ textAlign: isRTL ? 'right' : 'center' }}>
          <Title level={2} className="features-title">
            {translate("assoc_why_join")}
          </Title>
          <Paragraph className="features-description">
            {translate("assoc_why_join_desc")}
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card className="feature-card" bodyStyle={{ padding: "2rem" }}>
                <div className="feature-content">
                  <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = ({ translate, isRTL, joinerCount }) => {
  const stats = [
    {
      title: translate("assoc_stat_members"),
      value: joinerCount || 0,
      suffix: joinerCount > 500 ? "+" : "",
      icon: <TeamOutlined />,
      color: "#006233"
    },
    {
      title: translate("assoc_stat_events"),
      value: 120,
      suffix: "+",
      icon: <CalendarOutlined />,
      color: "#D52B1E"
    },
    {
      title: translate("assoc_stat_projects"),
      value: 45,
      suffix: "+",
      icon: <TrophyOutlined />,
      color: "#2563eb"
    },
    {
      title: translate("assoc_stat_years"),
      value: 10,
      suffix: "+",
      icon: <StarFilled />,
      color: "#faad14"
    },
  ];

  return (
    <section className="stats-section assoc-stats" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="stats-container">
        <Row gutter={[32, 32]}>
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: stat.color, fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

// Call to Action Section
const CTASection = ({ handleAdminLogin, handleMemberSignup, translate, isRTL }) => {
  return (
    <section className="cta-section assoc-cta" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="cta-container">
        <div className="cta-content" style={{ textAlign: isRTL ? 'right' : 'center' }}>
          <Title level={2} className="cta-title">
            {translate("assoc_cta_title")}
          </Title>
          <Paragraph className="cta-description">
            {translate("assoc_cta_description")}
          </Paragraph>
          <Space size="large" className="cta-buttons" style={{ direction: isRTL ? 'rtl' : 'ltr', justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              className="cta-primary-button"
              icon={<UserAddOutlined />}
              onClick={handleMemberSignup}
            >
              {translate("assoc_join_now")}
            </Button>
          </Space>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ translate, isRTL, etablissements, currentLang }) => {
  const logo = etablissements?.logo ? `${import.meta.env.VITE_API_BASE_URL}/${etablissements?.logo}` : null;
  const designation = currentLang === 'ar' ? etablissements?.designation_ar : etablissements?.designation_fr;

  return (
    <footer id="contact" className="footer" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div className="footer-logo">
              <div className="logo-icon-assoc" style={{ width: "2.5rem", height: "2.5rem", background: logo ? 'none' : undefined, boxShadow: logo ? 'none' : undefined }}>
                {logo ? (
                  <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <TeamOutlined style={{ fontSize: "1.25rem" }} />
                )}
              </div>
              <Title level={4} className="footer-logo-title">
                {designation || translate("association_name")}
              </Title>
            </div>
            <Paragraph className="footer-description">
              {translate("assoc_footer_description")}
            </Paragraph>
          </Col>

          <Col xs={24} md={8}>
            <Title level={5} className="footer-section-title">
              {translate("quick_links")}
            </Title>
            <div className="footer-links">
              <div>
                <a href="#features" className="footer-link">
                  {translate("assoc_our_services")}
                </a>
              </div>
              <div>
                <a href="#about" className="footer-link">
                  {translate("assoc_about_us")}
                </a>
              </div>
              <div>
                <a href="/login" className="footer-link">
                  {translate("assoc_member_registration")}
                </a>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <Title level={5} className="footer-section-title">
              {translate("assoc_contact_info")}
            </Title>
            <div className="footer-contact">
              <div>
                <strong>{translate("email")}:</strong> {etablissements?.email || "contact@association-dz.org"}
              </div>
              <div>
                <strong>{translate("phone") || "Phone"}:</strong> {etablissements?.phone || "+213 XX XX XX XX"}
              </div>
              <div>
                <strong>{translate("address") || "Address"}:</strong> {etablissements?.adress || translate("assoc_default_address")}
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <div className="footer-copyright">
          <Text style={{ color: "white" }}>
            {translate("assoc_copyright")}
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Landing;
