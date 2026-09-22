import { useEffect, useState } from "react";

import { Select, Badge, Button, Modal, List, Typography, Tag, Upload, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, ToolOutlined, LogoutOutlined, BellOutlined, FileTextOutlined, UploadOutlined, SettingOutlined } from "@ant-design/icons";
import { useLanguage } from "../locale/LanguageContext";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";
import digitToDesignation from "../utils/digitToDesignation";
import logo from "../img/algeria.jpg"
import LogoDisplay from "./LogoDisplay";
import UploadFile from "../components/uploadComponent/UploadFile";

export default function Header({ isMobile }) {
  const { isRTL, translate, changeLanguage, currentLanguage } = useLanguage();
  const [currentLang, setCurrentLang] = useState(currentLanguage);
  const { user, setUser, setToken } = useStateContext();

  // Notification state
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [joinerRequests, setJoinerRequests] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    getJoinerRequests();
    console.log("it is time to get joiner requests")
  }, [user?.id]);
  // Notification functions
  const getJoinerRequests = async () => {
    try {
      const params = {
        joiner_id: user?.id, // Filter by current user ID (requests for this joiner)
      };

      const response = await axiosClient.get("/joiner-requests", {
        params,
      });

      setJoinerRequests(
        response.data.data.filter(
          (request) =>
            request.state != 2 &&
            request.state != 1
        ) || []
      );
      setNotificationCount(
        response.data.data.filter(
          (request) =>
            request.state != 2 &&
            request.state != 1
        ).length || 0
      );
    } catch (error) {
      console.error("Error fetching joiner requests:", error);
    }
  };



  const handleNotificationClick = () => {
    setNotificationVisible(true);
  };

  const handleUploadClick = (request) => {
    setSelectedRequest(request);
    setUploadModalVisible(true);
  };

  // const handleFileUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("pdf", file);

  //   try {
  //     await axiosClient.post(
  //       `/joiner-requests/${selectedRequest.id}/upload-pdf`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     message.success("تم رفع الملف بنجاح");
  //     setUploadModalVisible(false);
  //     getJoinerRequests(); // Refresh notifications
  //   } catch (error) {
  //     message.error("حدث خطأ أثناء رفع الملف");
  //   }
  //   return false; // Prevent default upload
  // };

  useEffect(() => {
    changeLanguage(currentLang);
  }, [currentLang]);

  const changeState = (data) => {
    setUser({ ...user, pdf_path: data.pdf_path, pdf_state: data.pdf_state });
  }


  // Fetch notifications on component mount and when user changes

  const headerStyle = {
    height: 80,
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: isMobile ? "flex-end" : "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderBottom: "1px solid #e9ecef",
    width: "100%",
    float: isRTL ? "left" : "right",
    position: "fixed",
    zIndex: 99,
  };
  const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#339393",
  };
  const ProfileDropdown = () => {
    const navigate = useNavigate();

    return (
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          minWidth: "200px",
          fontWeight: "600",
        }}
        onClick={() => navigate("/profile")}
      >
        <Avatar
          size="large"
          src={undefined}
          style={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
            boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 6px 1px",
            marginRight: 30,
          }}
        >
          {user?.nom_fr?.charAt(0).toUpperCase()}
          {user?.prenom_fr?.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ float: "left", display: "inline", paddingLeft: "15px" }}>
          <p>
            {isRTL
              ? `${user?.nom_ar?.toUpperCase()} ${user?.prenom_ar?.toUpperCase()}`
              : `${user?.nom_fr?.toUpperCase()} ${user?.prenom_fr?.toUpperCase()}`}
          </p>
          <p> {user?.email}</p>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "10px",
              color: "#2e7d32", // green text
              backgroundColor: "#fff9d5", // light yellow background
              border: "1px solid #fbc02d", // stronger yellow border
              padding: "2px 5px",
              borderRadius: "5px",
              marginTop: "6px",
              marginBottom: "6px",
              display: "inline-block",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {digitToDesignation("role_id", user?.role_id)}
          </span>
        </div>
      </div>
    );
  };
  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown />,
      key: "ProfileDropdown",
    },
    {
      type: "divider",
    },
    // {
    //   icon: <UserOutlined />,
    //   key: "settingProfile",
    //   label: (
    //     <Link to={"/profile"}>
    //       <DropdownMenu text={translate("profile_settings")} />
    //     </Link>
    //   ),
    // },
    // {
    //   icon: <ToolOutlined />,
    //   key: "settingApp",
    //   label: <Link to={"/settings"}>{translate("app_settings")}</Link>,
    // },
    // Establishment Settings - Only for admin, manager, and associate
    (user?.role_id === "admin" || user?.role_id === "manager" || user?.role_id === "associate") && {
      icon: <SettingOutlined />,
      key: "etablissementSettings",
      label: <Link to={"/mainLayout/etablissement-settings"}>{translate("etablissement_settings")}</Link>,
    },

    {
      type: "divider",
    },

    {
      icon: <LogoutOutlined />,
      key: "logout",
      label: translate("logout"),
      onClick: () => {
        axiosClient
          .post(`/logout`)
          .then(() => {
            setUser(null);
            setToken(null);
          })
          .catch((err) => {
            ErrorHandling(err);
          });
      },
    },
  ].filter(Boolean);

  return (
    <header style={headerStyle}>
      {!isMobile && <LogoDisplay user={user} defaultLogo={logo} />}

      <div
        style={{
          minWidth: user?.role_id === 'joiner' ? "280px" : "220px",
          display: "flex",
          justifyContent: user?.role_id === 'joiner' ? "flex-end" : "space-between",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <div>
          <Select
            value={currentLang}
            defaultValue="ar"
            style={{ width: "100px", fontSize: "12px" }}
            options={[
              {
                value: "ar",
                label: <span>🇸🇦 العربية</span>,
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
            onChange={(e) => setCurrentLang(e)}
          ></Select>
        </div>

        {/* Notification Badge - Only show for joiners */}
        {user?.role_id === 'joiner' && (
          <Badge
            count={notificationCount}
            size="small"
            style={{
              margin: "0 85px"

            }}
          >
            <Button
              type="link"
              icon={<BellOutlined />}
              onClick={handleNotificationClick}
              style={{
                backgroundColor: "#006233",
                color: "white",
                height: "35px",
                width: "35px",
                padding: "6px 8px",
                borderRadius: "6px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                margin: "0 50px",
              }}
            />
          </Badge>
        )}
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          placement="bottomRight"
          style={{
            width: "280px",
            // float: "right",
            fontWeight: "bold",
          }}
        >
          {/* <Badge dot> */}
          <Avatar
            src={undefined}
            style={{
              fontWeight: "bold",
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 10px 2px",
              //   float: "right",
              cursor: "pointer",
              position: "absolute",
              ...(!isRTL ? { right: 0 } : { left: 0 }),
            }}
            size="large"
          >
            {user?.nom_fr?.charAt(0).toUpperCase()}
            {user?.prenom_fr?.charAt(0).toUpperCase()}
          </Avatar>
          {/* </Badge> */}
        </Dropdown>
      </div>

      {/* Notification Modal */}
      <Modal
        title={translate("joiner_requests") || "طلبات المنخرط"}
        open={notificationVisible}
        onCancel={() => setNotificationVisible(false)}
        footer={null}
        width={600}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <List
          dataSource={joinerRequests}
          renderItem={(request) => (
            <List.Item
              actions={[
                request.type === 1 && (
                  <UploadFile
                    storage={"joiner_requests"}
                    modal={"joinerrequest"}
                    text="upload_file"
                    buttonStyle={{
                      width: "100px",
                      height: "35px",
                      fontSize: "12px",
                    }}
                    accept=".pdf"
                    id={request.id}
                    changeState={changeState}
                  />

                ),
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{request.type === 0 ? 'أمر بإستدعاء' : 'إدراج ملف'}</span>
                    <Tag color={request.state === 0 ? 'orange' : 'green'}>
                      {request.state === 0 ? 'تم الإرسال' : 'تم الحضور'}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Typography.Text>{request.description}</Typography.Text>
                    <br />

                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: 'لا توجد طلبات جديدة'
          }}
        />
      </Modal>
    </header>
  );
}
