import React, { useRef, useState } from "react";
import { Button, Tooltip, Dropdown } from "antd";
import { IdcardOutlined, DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { useLanguage } from "../locale/LanguageContext";

// Standard credit card dimensions: 85.6mm x 53.98mm
// At 3x scale for good print quality
const CARD_WIDTH_PX = 640;
const CARD_HEIGHT_PX = 403;

const JoinerCardPDF = ({ record }) => {
    const { translate } = useLanguage();
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const generatePDF = async (elementRef, filename) => {
        if (!elementRef.current) return;
        setLoading(true);
        try {
            const element = elementRef.current;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                width: CARD_WIDTH_PX,
                height: CARD_HEIGHT_PX,
                scrollX: 0,
                scrollY: 0,
            });

            const imgData = canvas.toDataURL("image/png");
            // PDF: 85.6mm x 53.98mm
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [85.6, 53.98],
            });
            pdf.addImage(imgData, "PNG", 0, 0, 85.6, 53.98);
            pdf.save(filename);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadFront = () => {
        const userName = record.nom_ar || record.nom_fr || 'member';
        const name = `بطاقة_${userName}_recto.pdf`;
        generatePDF(frontRef, name);
    };

    const handleDownloadBack = () => {
        const userName = record.nom_ar || record.nom_fr || 'member';
        const name = `بطاقة_${userName}_verso.pdf`;
        generatePDF(backRef, name);
    };

    const menuItems = [
        {
            key: "front",
            label: translate("download_front") || "تحميل الوجه الأمامي",
            icon: <DownloadOutlined />,
            onClick: handleDownloadFront,
        },
        {
            key: "back",
            label: translate("download_back") || "تحميل الوجه الخلفي",
            icon: <DownloadOutlined />,
            onClick: handleDownloadBack,
        },
    ];

    // Images using proxy to avoid CORS
    const logoUrl = record?.etablissement?.logo
        ? `${import.meta.env.VITE_API_BASE_URL}/api/logo-proxy?path=${record.etablissement.logo}`
        : null;

    const identityImageUrl = record?.self_photo
        ? `${import.meta.env.VITE_API_BASE_URL}/api/logo-proxy?path=${record.self_photo}`
        : null;

    // Matching style, but simplified since container handles hiding
    const containerStyle = {
        position: 'relative',
        width: `${CARD_WIDTH_PX}px`,
        height: `${CARD_HEIGHT_PX}px`,
        fontFamily: 'Arial, Tahoma, sans-serif',
        direction: 'rtl',
        overflow: "hidden",
        boxSizing: "border-box",
        padding: '25px',
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Tooltip title={translate("download_card") || "تحميل البطاقة"}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<IdcardOutlined />}
                        loading={loading}
                        style={{
                            backgroundColor: "#006233",
                            borderColor: "#006233",
                            borderRadius: "6px",
                        }}
                    >
                        {translate("card") || "البطاقة"}
                    </Button>
                </Tooltip>
            </Dropdown>

            {/* Generation container - Shifted off-screen but still visible to DOM for html2canvas */}
            <div style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                zIndex: -9999,
            }}>
                {/* ========== FRONT FACE ========== */}
                <div
                    ref={frontRef}
                    style={{
                        ...containerStyle,
                        background: "#ffffff",
                        color: "#000",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid #ddd',
                        position: 'relative'
                    }}
                >
                    {/* Decorative lines (Algerian flag colors) from top-right */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-80px',
                            width: '400px',
                            height: '15px',
                            background: '#d21034', // Red
                            transform: 'rotate(45deg)',
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            top: '-35px',
                            right: '-80px',
                            width: '400px',
                            height: '15px',
                            background: '#ffffff', // White
                            transform: 'rotate(45deg)',
                            border: '0.5px solid #eee'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-80px',
                            width: '400px',
                            height: '15px',
                            background: '#006233', // Green
                            transform: 'rotate(45deg)',
                        }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%', position: 'relative', zIndex: 1 }}>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flex: 1 }}>
                            <div style={{ textAlign: 'right', marginRight: '50px' }}>
                                <h2 style={{ color: '#000', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
                                    {translate("membership_card") || "بطاقة العضوية"}
                                </h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#000', direction: 'ltr', textAlign: 'right' }}>
                                    CARTE DE MEMBRE
                                </p>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ textAlign: 'right', padding: '10px 0' }}>
                                    <h1 style={{ color: '#000', margin: '0 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                                        {record.nom_ar || ''} {record.prenom_ar || ''}
                                    </h1>
                                    <p style={{ margin: 0, fontSize: '18px', color: '#000', fontWeight: '500' }}>
                                        {record.profession || ''}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '30px', padding: '10px 0 20px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#000' }}>{translate("joining_date") || "تاريخ الانخراط"}</p>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{record.joining_date ? moment(record.joining_date).format("DD/MM/YYYY") : "—"}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#000' }}>{translate("expiration_date") || "تاريخ الانتهاء"}</p>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{record.expiration_date ? moment(record.expiration_date).format("DD/MM/YYYY") : "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginLeft: '10px' }}>
                            {identityImageUrl && (
                                <div style={{
                                    width: '180px',
                                    height: '210px',
                                    border: '3px solid #006233',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={identityImageUrl}
                                        crossOrigin="anonymous"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        borderTop: '2px solid #006233',
                        paddingTop: '8px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#d21034', // Red for notice
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {translate("personal_card_notice") || "هذه البطاقة شخصية ولا يمكن استخدامها من طرف الغير"}
                    </div>
                </div>

                {/* ========== BACK FACE ========== */}
                <div
                    ref={backRef}
                    style={{
                        ...containerStyle,
                        background: "#ffffff",
                        color: "#000",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ddd',
                    }}
                >
                    {/* Algerian flag stripes on back too for consistency */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: '#006233' }}></div>
                    <div style={{ position: 'absolute', top: '5px', left: 0, width: '100%', height: '5px', background: '#ffffff' }}></div>
                    <div style={{ position: 'absolute', top: '10px', left: 0, width: '100%', height: '5px', background: '#d21034' }}></div>

                    {logoUrl && (
                        <img
                            src={logoUrl}
                            crossOrigin="anonymous"
                            style={{ maxWidth: '180px', maxHeight: '110px', marginBottom: '15px', objectFit: 'contain' }}
                        />
                    )}

                    <h3 style={{ color: '#000', margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                        {record?.etablissement?.designation_ar || ''}
                    </h3>

                    <div style={{ display: 'flex', gap: '50px', marginBottom: '30px', background: '#f5f5f5', padding: '15px 30px', borderRadius: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#000' }}>{translate("joining_date") || "تاريخ الانخراط"}</p>
                            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{record.joining_date ? moment(record.joining_date).format("DD/MM/YYYY") : "—"}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#000' }}>{translate("expiration_date") || "تاريخ الانتهاء"}</p>
                            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{record.expiration_date ? moment(record.expiration_date).format("DD/MM/YYYY") : "—"}</p>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '15px', textAlign: 'center', fontSize: '11px', color: '#000' }}>
                        {record?.etablissement?.designation_fr || ''}
                    </div>

                    <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, height: '40px', backgroundColor: '#1a1a1a' }}></div>
                </div>
            </div>
        </div>
    );
};

export default JoinerCardPDF;
