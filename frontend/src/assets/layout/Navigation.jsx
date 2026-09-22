import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Drawer, Layout, Menu } from "antd";

import { MenuOutlined, UserOutlined, EnvironmentOutlined, BankOutlined, BuildOutlined, SettingOutlined, DashboardOutlined, TeamOutlined, DollarOutlined, InboxOutlined, FileTextOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useStateContext } from "../contexts/ContextProvider";
const { Sider } = Layout;
import { useLanguage } from "../locale/LanguageContext";
import useResponsive from "../hooks/useResponsive";
import LogoDisplay from "./LogoDisplay";
import logo from "../img/algeria.jpg";

export default function Navigation() {

  const { isMobile } = useResponsive();
  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible }) {
  const { user } = useStateContext();
  let location = useLocation();

  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const { translate, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Get selected card from localStorage
  const [selectedCard, setSelectedCard] = useState(localStorage.getItem('selectedCard') || 'all');

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSelectedCard(localStorage.getItem('selectedCard') || 'all');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to={"/mainLayout/dashboard-new"}>{translate("dashboard")}</Link>,
      roles: [],
      category: "administration"
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to={"/mainLayout/users"}>{translate("users")}</Link>,
      roles: ["admin", "national", "wilaya"],
      category: "administration"
    },
    {
      key: "wilayas",
      icon: <BankOutlined />,
      label: <Link to={"/mainLayout/wilayas"}>{translate("wilayas")}</Link>,
      roles: ["admin"],
      category: "administration"
    },
    {
      key: "communes",
      icon: <EnvironmentOutlined />,
      label: <Link to={"/mainLayout/communes"}>{translate("communes")}</Link>,
      roles: ["admin"],
      category: "administration"
    },
    {
      key: "etablissements",
      icon: <BuildOutlined />,
      label: <Link to={"/mainLayout/etablissements"}>{translate("etablissements")}</Link>,
      roles: ["admin"],
      category: "administration"
    },
    {
      key: "etablissement-parameters",
      icon: <SettingOutlined />,
      label: <Link to={"/mainLayout/etablissement-parameters"}>{translate("establishment_parameters") || "Establishment Settings"}</Link>,
      roles: ["national"],
      category: "administration"
    },

    // Association Management
    {
      key: "joiners",
      icon: <TeamOutlined />,
      label: <Link to={"/mainLayout/joiners"}>{translate("joiners")}</Link>,
      roles: ["national", "wilaya", "baladi", "printer"],
      category: "administration"
    },
    {
      key: "admin-payments",
      icon: <DollarOutlined />,
      label: <Link to={"/mainLayout/payments"}>{translate("payments")}</Link>,
      roles: ["national"],
      category: "administration"
    },
    {
      key: "joiner-requests",
      icon: <InboxOutlined />,
      label: <Link to={"/mainLayout/joiner-requests"}>{translate("joiner_requests") || "Joiner Requests"}</Link>,
      roles: ["national", "wilaya", "baladi"],
      category: "administration"
    },
    {
      key: "joining-types",
      icon: <SettingOutlined />,
      label: <Link to={"/mainLayout/joining-types"}>{translate("joining_types")}</Link>,
      roles: ["national"],
      category: "administration"
    },
    // GDE Navigation
    {
      key: "document-types",
      icon: <FileTextOutlined />,
      label: <Link to={"/mainLayout/document-types"}>{translate("document_types")}</Link>,
      roles: ["national"],
      category: "administration"
    },
    {
      key: "documents",
      icon: <FolderOpenOutlined />,
      label: <Link to={"/mainLayout/documents"}>{translate("documents")}</Link>,
      roles: ["national"],
      category: "administration"
    },
    // Joiner-specific menu items
    {
      key: "joiner-dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/joiner-layout">{translate("dashboard")}</Link>,
      roles: ["joiner"],
    },
    {
      key: "joiner-payments",
      icon: <DollarOutlined />,
      label: <Link to="/joiner-layout/payments">{translate("payments")}</Link>,
      roles: ["joiner"],
    },
  ].filter(item => {
    if (user.role_id !== "joiner") {
      const hasRole = item?.roles?.includes(user?.role_id);
      if (!hasRole) return false;

      if (!selectedCard || selectedCard === 'all') return true;

      return item.category === selectedCard;
    }
    else {
      return item.roles.includes("joiner")
    }

  });

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        const path = location.pathname;
        if (path === "/" || path === "/mainLayout") {
          setCurrentPath("dashboard");
        } else if (path.startsWith("/mainLayout/dashboard-new")) {
          setCurrentPath("dashboard");
        } else if (path.startsWith("/mainLayout/users")) {
          setCurrentPath("users");
        } else if (path.startsWith("/mainLayout/wilayas")) {
          setCurrentPath("wilayas");
        } else if (path.startsWith("/mainLayout/communes")) {
          setCurrentPath("communes");
        } else if (path.startsWith("/mainLayout/etablissements")) {
          setCurrentPath("etablissements");
        } else if (path.startsWith("/mainLayout/etablissement-parameters")) {
          setCurrentPath("etablissement-parameters");
        } else if (path.startsWith("/mainLayout/joiners")) {
          setCurrentPath("joiners");
        } else if (path.startsWith("/mainLayout/payments")) {
          setCurrentPath("admin-payments");
        } else if (path.startsWith("/mainLayout/joiner-requests")) {
          setCurrentPath("joiner-requests");
        } else if (path.startsWith("/mainLayout/joining-types")) {
          setCurrentPath("joining-types");
        } else if (path.startsWith("/mainLayout/document-types")) {
          setCurrentPath("document-types");
        } else if (path.startsWith("/mainLayout/documents")) {
          setCurrentPath("documents");
        } else if (path === "/joiner-layout" || path === "/joiner-layout/") {
          setCurrentPath("joiner-dashboard");
        } else if (path.startsWith("/joiner-layout/payments")) {
          setCurrentPath("joiner-payments");
        } else if (path.startsWith("/joiner-layout/profile")) {
          setCurrentPath("joiner-profile");
        } else {
          setCurrentPath(path.slice(1));
        }
      }
  }, [location, currentPath]);

  return (
    <Sider
      collapsible={collapsible}
      collapsed={false}
      className="navigation"
      width={256}
      style={{
        overflow: "auto",
        position: "fixed",
        height: "calc(100vh - 80px)",
        left: !isRTL ? 0 : "auto",
        right: !isRTL ? "auto" : 0,
        top: 80,
        backgroundColor: "#f8f9fa",
      }}
      theme={"light"}
    >
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          height: "20px",
        }}
      ></div>
      <Menu
        items={items}
        mode="inline"
        theme={"light"}
        selectedKeys={[currentPath]}
        style={{
          width: 256,
          backgroundColor: "#f8f9fa",
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const { isMobile } = useResponsive();
  const { user } = useStateContext();
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        style={{
          position: "fixed",
          top: 20,
          zIndex: 160,
          height: "40px",
          ...(isRTL ? { right: 10 } : { left: 10 }),
        }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={256}
        placement={isRTL ? "right" : "left"}
        closable={false}
        onClose={onClose}
        open={visible}
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <LogoDisplay user={user} defaultLogo={logo} />
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
