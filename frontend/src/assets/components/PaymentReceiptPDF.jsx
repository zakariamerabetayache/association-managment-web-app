import React, { useRef } from 'react';
import { Button, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import dayjs from 'dayjs';
import logo from '../img/algeria.jpg';

const PaymentReceiptPDF = ({ payment, onDownload, type = "primary", buttonText }) => {
  const { translate } = useLanguage();
  const { user } = useStateContext();
  const contentRef = useRef();

  const generatePDF = async () => {
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      const userName = user?.nom_ar || user?.nom_fr || 'member';
      const fileName = `وصل_اشتراك_${userName}_${dayjs(payment?.date || new Date()).format('YYYY-MM-DD')}.pdf`;

      pdf.save(fileName);

      if (onDownload) {
        onDownload(fileName);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  return (
    <div style={{ display: 'inline-block' }}>
      {/* Download Button */}
      <Button
        type={type}
        icon={<DownloadOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          generatePDF();
        }}
        size="small"
        style={type === 'primary' ? {
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
        } : {}}
      >
        {buttonText || translate('download_payment_receipt') || 'تحميل وصل الدفع'}
      </Button>

      {/* PDF Content - Hidden from view but used for generation */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          backgroundColor: 'white',
          fontFamily: 'Arial, Tahoma, sans-serif',
          direction: 'rtl',
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333'
        }}
      >
        {/* Professional Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '2px solid #006233'
        }}>
          {/* Left Logo */}
          <img
            src={logo}
            crossOrigin="anonymous"
            alt="Logo"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain'
            }}
          />

          {/* Center Content */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            padding: '0 20px'
          }}>
            <h1 style={{
              fontSize: '22px',
              margin: '0 0 10px 0',
              color: '#000',
              fontFamily: 'Arial, Tahoma, sans-serif',
              fontWeight: 'bold'
            }}>
              {translate('republic_of_algeria') || 'الجمهورية الجزائرية الديمقراطية الشعبية'}
            </h1>

            {/* Establishment Name */}
            <h2 style={{
              fontSize: '20px',
              margin: '0 0 5px 0',
              color: '#006233',
              fontFamily: 'Arial, Tahoma, sans-serif',
              fontWeight: 'bold'
            }}>
              {user?.etablissement?.designation_ar || translate('association_name') || 'الجمعية'}
            </h2>

            {/* Establishment Phone */}
            {user?.etablissement?.phone && (
              <p style={{
                fontSize: '14px',
                margin: '0 0 10px 0',
                color: '#666',
                fontFamily: 'Arial, Tahoma, sans-serif'
              }}>
                {translate('phone') || 'الهاتف'}: {user?.etablissement?.phone}
              </p>
            )}

            {/* Document Title */}
            <div style={{
              display: 'inline-block',
              color: 'black',
              padding: '8px 25px',
              borderRadius: '25px',
              marginTop: '10px'
            }}>
              <h3 style={{
                fontSize: '20px',
                margin: '0',
                color: 'black',
                fontFamily: 'Arial, Tahoma, sans-serif',
                fontWeight: 'bold',
              }}>
                وصل اشتراك بالجمعية
              </h3>
            </div>

            {/* Receipt Number */}
            {/* <div style={{
              marginTop: '15px',
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Arial, Tahoma, sans-serif'
            }}>
              رقم الوصل: REC-{dayjs(payment?.date || new Date()).format('YYYYMMDD')}-{payment?.id || Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
            </div> */}
          </div>

          {/* Right Logo (Establishment) */}
          <div style={{
            width: '140px',
            height: '140px',
            display: 'flex',

            borderRadius: '50%',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}>

            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/api/logo-proxy?path=${user?.etablissement?.logo}`}
              crossOrigin="anonymous"
              alt="Establishment Logo"
              style={{
                width: '100%',
                height: '140px',
              }}
            />

          </div>
        </div>

        {/* Payment Statement */}
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#006233',
              margin: '0 0 15px 0'
            }}>
              بيان المدفوعات
            </h2>
          </div>

          <p style={{
            fontSize: '18px',
            lineHeight: '2.4',
            textAlign: 'justify',
            margin: '0',
            color: '#2c3e50',
            fontWeight: '500'
          }}>
            تشهد الجمعية بموجب هذا الوصل أن العضو <strong style={{ color: '#006233' }}>{user?.nom_ar || ''} {user?.prenom_ar || ''}</strong> قد سدد مبلغاً قدره <strong style={{ color: '#e74c3c' }}>{payment?.amount || user?.etablissement?.price || '______'} دينار جزائري</strong> كرسوم اشتراك وانخراط، وقد تم استلام المبلغ بنجاح بتاريخ <strong style={{ color: '#27ae60' }}>{dayjs(payment?.date || new Date()).format('DD/MM/YYYY')}</strong>.
          </p>
        </div>

        {/* Member Information */}
        <div style={{
          marginBottom: '40px'
        }}>
          <div style={{
            padding: '25px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#006233',
              margin: '0 0 20px 0',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '10px'
            }}>
              معلومات العضو المنخرط
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '16px',
              lineHeight: '2'
            }}>
              <p style={{ margin: '0' }}>
                <strong style={{ color: '#555' }}>الاسم الكامل:</strong> {user?.nom_ar || ''} {user?.prenom_ar || ''}
              </p>
              <p style={{ margin: '0' }}>
                <strong style={{ color: '#555' }}>رقم الهاتف:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{user?.telephone || '-'}</span>
              </p>
              <p style={{ margin: '0' }}>
                <strong style={{ color: '#555' }}>رقم التعريف الوطني:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{user?.nin || '-'}</span>
              </p>
              <p style={{ margin: '0' }}>
                <strong style={{ color: '#555' }}>البريد الإلكتروني:</strong> {user?.email || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '60px',
          marginBottom: '30px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '80px', width: '250px' }}>
            <div style={{
              borderTop: '2px solid #ccc',
              width: '100%',
              marginBottom: '15px'
            }}></div>
            <span style={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: '18px',
            }}>
              توقيع العضو
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '80px', width: '250px' }}>
            <div style={{
              borderTop: '2px solid #ccc',
              width: '100%',
              marginBottom: '15px'
            }}></div>
            <span style={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: '18px',
            }}>
              توقيع وحاتم الجمعية
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          position: "absolute",
          bottom: '20mm',
          width: 'calc(100% - 30mm)',
          borderTop: '1px solid #eee',
          fontSize: '13px',
          color: '#888',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 5px 0' }}>
            {translate('document_generated_on') || 'تم استخراج هذا الوصل إلكترونياً بتاريخ'} {dayjs().format('DD/MM/YYYY HH:mm')}
          </p>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#666' }}>
            {user?.etablissement?.designation_ar || translate('association_name') || 'الجمعية'}
          </p>
          <p style={{ margin: 0 }}>
            {user?.etablissement?.adress || translate('establishment_address') || 'عنوان الجمعية'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptPDF;
