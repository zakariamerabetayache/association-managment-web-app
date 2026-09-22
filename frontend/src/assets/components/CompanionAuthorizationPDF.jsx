import React, { useRef } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import dayjs from 'dayjs';
import rawdaLogo from '../img/rawda.png';

// Add Arabic font support
const arabicFont = {
  fontFamily: 'Arial, Tahoma, sans-serif',
  lineHeight: '1.8',
  color: '#333'
};

const headerStyle = {
  ...arabicFont,
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center',
  paddingBottom: '10px',
  borderBottom: '2px solid #000'
};

const sectionTitle = {
  ...arabicFont,
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  paddingBottom: '5px',
  borderBottom: '1px solid #ddd'
};

const infoRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '5px'
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#555'
};

const { Title, Text, Paragraph } = Typography;

const CompanionAuthorizationPDF = ({ companion, onDownload }) => {
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
      
      // Generate filename with companion name and date
      const companionName = companion?.nom_ar || companion?.nom_fr || 'companion';
      const fileName = `تصريح_بالمرافقة_${companionName}_${dayjs().format('YYYY-MM-DD')}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      if (onDownload) {
        onDownload(fileName);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const newLocal = translate('relationship') || 'صلة القرابة';
  return (
    <div>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={generatePDF}
        style={{
          backgroundColor: '#22ee77',
          borderColor: '#22ee77',
          fontFamily: 'Arial, Tahoma, sans-serif'
        }}
      >
        {translate('download_companion_authorization') || 'تحميل التصريح'}
      </Button>

      <div 
        ref={contentRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          backgroundColor: '#fff',
          fontFamily: 'Arial, Tahoma, sans-serif',
          direction: 'rtl',
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#333'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
              margin: '0 0 10px 0',
              color: '#000',
              fontFamily: 'Arial, Tahoma, sans-serif',
              fontWeight: 'bold'
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
              {translate('companion_authorization_document') || 'تصريح مرافق'}
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

        {/* Document Content */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{ ...arabicFont, textAlign: 'justify', marginBottom: '20px' }}>
            {translate('to_whom_it_may_concern') || 'إلى من يهمه الأمر،'}
          </p>

          <p style={{ ...arabicFont, textAlign: 'justify', marginBottom: '20px' }}>
            {translate('companion_authorization_intro') || 
            'أنا الموقع أدناه، أصرح بموجب هذا الوثيقة بأنني أفوض الشخص المذكور أدناه بمرافقة أطفالي وتمثيلي في مركز رعاية الأطفال، وأتحمل كامل المسؤولية عن تصرفاته نيابة عني.'}
          </p>

          {/* Parent Information */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={sectionTitle}>
              {translate('parent_information') || 'معلومات الولي'}
            </h3>
            
            <div style={infoRow}>
              <p><span style={labelStyle}>{translate('name') || 'الاسم'}:</span> {user?.nom_ar || ''} {user?.prenom_ar || ''}</p>
              <p><span style={labelStyle}>{ 'رقم التعريف الوطني'}:</span> {user?.nin || '________'}</p>
              <p><span style={labelStyle}>{ 'الهاتف'}:</span> {user?.telephone || '________'}</p>
              <p><span style={labelStyle}>{translate('address') || 'العنوان'}:</span> {user?.adress || '________'}</p>
            </div>
          </div>

          {/* Companion Information */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={sectionTitle}>
              {translate('companion_information') || 'معلومات المرافق'}
            </h3>
            
            <div style={infoRow}>
              <p><span style={labelStyle}>{translate('name') || 'الاسم'}:</span> {companion?.nom_ar || '________'} {companion?.prenom_ar || ''}</p>
              {/* <p><span style={labelStyle}>{newLocal}:</span> ________</p> */}
              {/* <p><span style={labelStyle}>{translate('id_number') || 'رقم الهوية'}:</span> ________</p> */}
            </div>
          </div>

          {/* Authorization Statement */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={sectionTitle}>
              {translate('authorization_statement') || 'بيان التفويض'}
            </h3>
            
            <div style={{ ...arabicFont, textAlign: 'justify' }}>
              <p style={{ marginBottom: '15px' }}>
                {translate('companion_authorization_text') || 
                'بموجب هذا التصريح، أفوض الشخص المذكور أعلاه بمرافقة أطفالي إلى مركز رعاية الأطفال واستلامهم منه، والتوقيع نيابة عني على أي وثائق ضرورية متعلقة برعاية أطفالي في المركز.'}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                {translate('companion_responsibility_text') || 
                'أتحمل كامل المسؤولية القانونية والمالية عن تصرفات هذا المرافق نيابة عني، وأؤكد أنه شخص موثوق ومؤهل لرعاية أطفالي.'}
              </p>

              <p style={{ marginBottom: '15px' }}>
                {translate('companion_validity_text') || 
                'هذا التفويض ساري المفعول من تاريخ توقيعه وحتى إشعار آخر كتابي مني، ويحق للمركز الاعتماد عليه في التعامل مع المرافق المذكور.'}
              </p>
            </div>
          </div>

          {/* Authorized Actions */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              borderBottom: '2px solid #722ed1',
              paddingBottom: '5px'
            }}>
              {translate('authorized_actions') || 'الصلاحيات المفوضة'}
            </h3>
            
            <ul style={{ paddingLeft: isRTL ? '0' : '20px', paddingRight: isRTL ? '20px' : '0' }}>
              <li style={{ marginBottom: '8px' }}>
                {translate('pickup_dropoff_children') || 'إحضار واستلام الأطفال من وإلى المركز'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {translate('sign_daily_reports') || 'التوقيع على التقارير اليومية'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {translate('receive_information') || 'استلام المعلومات المتعلقة بالأطفال'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {translate('emergency_decisions') || 'اتخاذ القرارات في حالات الطوارئ البسيطة'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {translate('communicate_with_staff') || 'التواصل مع موظفي المركز'}
              </li>
            </ul>
          </div>

          {/* Date and Signature */}
          <div style={{ marginTop: '50px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ marginBottom: '10px' }}>
                  <span style={labelStyle}>{translate('date') || 'التاريخ'}:</span> {dayjs().format('DD/MM/YYYY')}

                </p>
                <p style={{ marginBottom: '30px' }}>
                {user?.etablissement?.adress || translate('establishment_address') || 'عنوان المؤسسة'}

                </p>

             
              </div>
              <div style={{ display:"flex",justifyContent:"space-between"}}>
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ borderTop: '1px solid #000', width: '200px', marginBottom: '5px' }}></div>
                  <span style={labelStyle}>{'توقيع الولي'}</span>
                </div>
                <div>
                  <div style={{ borderTop: '1px solid #000', width: '200px', marginBottom: '5px' }}></div>
                  <span style={labelStyle}>{'توقيع المرافق'}</span>
                </div>
              </div>
            </div>
          </div>

       
       
        </div>
      </div>
    </div>
  );
};

export default CompanionAuthorizationPDF;
