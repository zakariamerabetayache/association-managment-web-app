import React, { useRef } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import dayjs from 'dayjs';
import rawdaLogo from '../img/rawda.png';

// Arabic font stack for better Arabic text rendering
const arabicFont = {
  fontFamily: '"Amiri", Arial, Tahoma, sans-serif',
  lineHeight: '1.8',
  color: '#333'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '2px solid #000'
};

const sectionStyle = {
  marginBottom: '15px',
  padding: '10px',
  border: '1px solid #eee',
  borderRadius: '4px'
};

const labelStyle = {
  fontWeight: 'bold',
  display: 'inline-block',
  minWidth: '120px',
  color: '#000'
};

const ParentalAuthorizationPDF = ({ child, onDownload }) => {
  const { translate, isRTL } = useLanguage();
  const { user } = useStateContext();
  const contentRef = useRef();

  const generatePDF = async () => {
    try {
      const element = contentRef.current;
      
      // Configure html2canvas for better Arabic text rendering
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
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the content
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Generate filename with child name and date
      const childName = child?.nom_ar || child?.nom_fr || 'child';
      const fileName = `تصريح_أبوي_${childName}_${dayjs().format('YYYY-MM-DD')}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      if (onDownload) {
        onDownload(fileName);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      {/* Download Button */}
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={generatePDF}
        style={{
          backgroundColor: '#18eef3',
          borderColor: '#18eef3',
          fontFamily: 'Arial, Tahoma, sans-serif',
          fontWeight: 'bold'
        }}
      >
        {translate('download_parental_authorization') || 'تحميل التصريح الأبوي'}
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
          padding: '10mm',
          backgroundColor: 'white',
          fontFamily: 'Arial, Tahoma, sans-serif',
          direction: 'rtl',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#000'
        }}
      >
        {/* Header */}
        <div style={{
          ...headerStyle,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '20px',
          marginBottom: '20px'
        }}>
          {/* Logo Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '15px'
          }}>
            {/* Left Logo */}
            <img 
              src={rawdaLogo} 
              alt="Logo" 
              style={{
                width: '180px',
               
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
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                color: '#000',
                fontFamily: 'Arial, Tahoma, sans-serif'
              }}>
                {translate('republic_of_algeria') || 'الجمهورية الجزائرية الديمقراطية الشعبية'}
              </h1>
              
              {/* Establishment Name */}
              <h2 style={{
                fontSize: '18px',
                margin: '0 0 5px 0',
                color: '#2c5aa0',
                fontFamily: 'Arial, Tahoma, sans-serif',
                fontWeight: 'bold'
              }}>
                {user?.etablissement?.designation_ar || user?.etablissement?.designation_fr || 'روضة الأطفال'}
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
              <h3 style={{ 
                fontSize: '20px', 
                margin: '10px 0 0 0',
                color: '#d32f2f',
                fontFamily: 'Arial, Tahoma, sans-serif',
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}>
                {translate('parental_authorization_document') || 'تصريح أبوي'}
              </h3>
            </div>
            
            {/* Right Logo */}
            <img 
              src={rawdaLogo} 
              alt="Logo" 
              style={{
                width: '180px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Document Content */}
        <div style={{ marginBottom: '15px' }}>
          <p style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            borderRight: '4px solid #000'
          }}>
            {translate('to_whom_it_may_concern') || 'إلى من يهمه الأمر'}
          </p>

          <p style={{ 
            marginBottom: '20px', 
            textAlign: 'justify',
            lineHeight: '2',
            fontSize: '15px'
          }}>
            {translate('parental_authorization_intro') || 
            'أنا الموقع أدناه، أصرح بموجب هذا الوثيقة بأنني الولي الشرعي للطفل المذكور أدناه، وأفوض مركز رعاية الأطفال برعايته والإشراف عليه خلال فترة تواجده بالمركز.'}
          </p>
          {/* Parent Information */}
          <div style={sectionStyle}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 15px 0',
              paddingBottom: '8px',
              borderBottom: '1px solid #000',
              color: '#000'
            }}>
              {translate('parent_information') || 'معلومات الولي'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{'الاسم الكامل'}:</span>
                <span>{(user?.prenom_ar || '') + ' ' + (user?.nom_ar || '')}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{'رقم البطاقة الوطنية'}:</span>
                <span>{user?.nin || '________________'}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{translate('phone_number') || 'رقم الهاتف'}:</span>
                <span>{user?.telephone || '________________'}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{translate('address') || 'العنوان'}:</span>
                <span>{user?.adress || '________________'}</span>
              </p>
            </div>
          </div>

          {/* Child Information */}
          <div style={{ ...sectionStyle, marginBottom: '15px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 10px 0',
              paddingBottom: '5px',
              borderBottom: '1px solid #000',
              color: '#000'
            }}>
              {translate('child_information') || 'معلومات الطفل'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{'الاسم الكامل'}:</span>
                <span>{(child?.prenom_ar || '') + ' ' + (child?.nom_ar || '')}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{'تاريخ الميلاد'}:</span>
                <span>{child?.date_nais ? dayjs(child.date_nais).format('DD/MM/YYYY') : '________________'}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{translate('blood_type') || 'فصيلة الدم'}:</span>
                <span>{child?.bloodsign || '________________'}</span>
              </p>
              <p style={{ margin: '5px 0' }}>
                <span style={labelStyle}>{translate('gender') || 'الجنس'}:</span>
                <span>{child?.sex === 0 ? (translate('male') || 'ذكر') : child?.sex === 1 ? (translate('female') || 'أنثى') : '________________'}</span>
              </p>
            </div>
          </div>

          {/* Authorization Statement */}
          <div style={sectionStyle}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 10px 0',
              paddingBottom: '5px',
              borderBottom: '1px solid #000',
              color: '#000'
            }}>
              {translate('authorization_statement') || 'بيان التفويض'}
            </h3>
            
            <p style={{ 
              textAlign: 'justify', 
              marginBottom: '10px',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {translate('authorization_text') || 
              'بموجب هذا التصريح، أفوض مركز رعاية الأطفال والموظفين المؤهلين به بالإشراف على طفلي المذكور أعلاه، وتقديم الرعاية اللازمة له، واتخاذ القرارات الضرورية في حالات الطوارئ الطبية إذا تعذر الاتصال بي.'}
            </p>
            
            <p style={{ 
              textAlign: 'justify', 
              marginBottom: '10px',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {translate('emergency_authorization') || 
              'كما أفوض المركز بطلب العناية الطبية الطارئة لطفلي في حالة الضرورة، وأتحمل كامل المسؤولية عن أي تكاليف طبية قد تنشأ عن ذلك.'}
            </p>
          </div>

          {/* Date and Signature */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
             
               
              </div>
              <div style={{ display:"flex",justifyContent:"space-between"}}>
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ borderTop: '1px solid #000', width: '200px', marginBottom: '5px' }}></div>
                  <span style={labelStyle}>{ 'توقيع الولي'}</span>
                </div>
                <div>
                  <div style={{ borderTop: '1px solid #000', width: '200px', marginBottom: '5px' }}></div>
                  <span style={labelStyle}>{'توقيع مدير المركز'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            position:"absolute",
            bottom: '20px',
            borderTop: '1px solid #eee',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0' }}>
              {translate('document_generated_on') || 'تم إنشاء هذا المستند في'} {dayjs().format('DD/MM/YYYY HH:mm')}
            </p>
            <p style={{ margin: 0 }}>
              {user?.etablissement?.adress || translate('establishment_address') || 'عنوان المؤسسة'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalAuthorizationPDF;
