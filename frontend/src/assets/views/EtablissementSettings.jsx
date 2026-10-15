import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, TimePicker, Row, Col, Typography, Divider } from 'antd';
import { SaveOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import etablissementsService from '../services/etablissementsService';
import ErrorHandling from '../components/ErrorHandling';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { TextArea } = Input;

const EtablissementSettings = () => {
  const { translate, isRTL } = useLanguage();
  const { user } = useStateContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [etablissement, setEtablissement] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    fetchEtablissementData();
  }, [user]);

  const fetchEtablissementData = async () => {
    
    if (!user?.etablissement_id) {
      return;
    }
    
    setLoading(true);
    try {
      
      // Fetch establishment data
      const etablissementResponse = await etablissementsService.getById(user.etablissement_id);
      
      // Handle different response structures
      let etablissementData;
      if (etablissementResponse.data) {
        // If response has data property
        etablissementData = etablissementResponse.data;
      } else if (etablissementResponse.etablissement) {
        // If response has etablissement property
        etablissementData = etablissementResponse.etablissement;
      } else {
        // If response is the data itself
        etablissementData = etablissementResponse;
      }
      
      
      if (!etablissementData) {
        console.error('❌ No etablissement data found in response');
        return;
      }
      
      setEtablissement(etablissementData);

      // Set form values with null checks
      const formValues = {
        ...etablissementData,
        opening_hour: etablissementData?.opening_hour ? dayjs(etablissementData.opening_hour, 'HH:mm') : null,
        closing_hour: etablissementData?.closing_hour ? dayjs(etablissementData.closing_hour, 'HH:mm') : null,
      };
      
      form.setFieldsValue(formValues);
    } catch (error) {
      console.error('❌ Error fetching etablissement data:', error);
      ErrorHandling(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        opening_hour: values.opening_hour ? values.opening_hour.format('HH:mm') : null,
        closing_hour: values.closing_hour ? values.closing_hour.format('HH:mm') : null,
      };
      
      // Remove wilaya_id and commune_id since we're not editing them
      delete formData.wilaya_id;
      delete formData.commune_id;
      

      const response = await etablissementsService.update(user.etablissement_id, formData);
      Swal.fire({
        icon: 'success',
        title: 'تم تحديث المؤسسة بنجاح',
        showConfirmButton: false,
        timer: 1500
      });
      setIsEditing(false);
      fetchEtablissementData(); // Refresh data
    } catch (error) {
      ErrorHandling(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !etablissement) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
    
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingOutlined style={{ color: '#1890ff' }} />
          {translate('etablissement_settings') || 'إعدادات المؤسسة'}
        </Title>
        <Text type="secondary">
          {translate('manage_etablissement_information') || 'إدارة معلومات المؤسسة'}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        // disabled={!isEditing}
      >
        <Row gutter={[24, 0]}>
          {/* Basic Information */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditOutlined />
                  {translate('basic_information') || 'المعلومات الأساسية'}
                </span>
              }
              style={{ height: '100%' }}
            >
              <Form.Item
                label={translate('designation_ar') || 'الاسم بالعربية'}
                name="designation_ar"
                rules={[
                  { required: true, message: translate('please_enter_designation_ar') || 'يرجى إدخال الاسم بالعربية' }
                ]}
              >
                <Input placeholder={translate('enter_designation_ar') || 'أدخل الاسم بالعربية'} />
              </Form.Item>

              <Form.Item
                label={translate('designation_fr') || 'الاسم بالفرنسية'}
                name="designation_fr"
                rules={[
                  { required: true, message: translate('please_enter_designation_fr') || 'يرجى إدخال الاسم بالفرنسية' }
                ]}
              >
                <Input placeholder={translate('enter_designation_fr') || 'أدخل الاسم بالفرنسية'} />
              </Form.Item>

              <Form.Item
                label={translate('price') || 'السعر'}
                name="price"
              >
                <Input 
                  type="number" 
                  step="0.01"
                  suffix="DA"
                  placeholder={translate('enter_price') || 'أدخل السعر'} 
                />
              </Form.Item>

              <Form.Item
                label={translate('adress') || 'العنوان'}
                name="adress"
              >
                <TextArea 
                  rows={3}
                  placeholder={translate('enter_address') || 'أدخل العنوان'} 
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Contact & Location */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditOutlined />
                  {translate('contact_location') || 'الاتصال والموقع'}
                </span>
              }
              style={{ height: '100%' }}
            >
              <Form.Item
                label={translate('phone') || 'رقم الهاتف'}
                name="phone"
              >
                <Input placeholder={translate('enter_phone') || 'أدخل رقم الهاتف'} />
              </Form.Item>

              <Form.Item
                label={translate('email') || 'البريد الإلكتروني'}
                name="email"
                rules={[
                  { type: 'email', message: translate('invalid_email') || 'بريد إلكتروني غير صحيح' }
                ]}
              >
                <Input placeholder={translate('enter_email') || 'أدخل البريد الإلكتروني'} />
              </Form.Item>


            </Card>
          </Col>
        </Row>

        {/* Operating Hours */}
        <Row gutter={[24, 0]} style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <Card 
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditOutlined />
                  {translate('operating_hours') || 'ساعات العمل'}
                </span>
              }
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('opening_hour') || 'ساعة الافتتاح'}
                    name="opening_hour"
                  >
                    <TimePicker 
                      format="HH:mm"
                      placeholder={translate('select_opening_hour') || 'اختر ساعة الافتتاح'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('closing_hour') || 'ساعة الإغلاق'}
                    name="closing_hour"
                  >
                    <TimePicker 
                      format="HH:mm"
                      placeholder={translate('select_closing_hour') || 'اختر ساعة الإغلاق'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Owner Information */}
        <Row gutter={[24, 0]} style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <Card 
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditOutlined />
                  {translate('owner_information') || 'معلومات المالك'}
                </span>
              }
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('owner_name_ar') || 'اسم المالك بالعربية'}
                    name="owner_name_ar"
                  >
                    <Input placeholder={translate('enter_owner_name_ar') || 'أدخل اسم المالك بالعربية'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('owner_name_fr') || 'اسم المالك بالفرنسية'}
                    name="owner_name_fr"
                  >
                    <Input placeholder={translate('enter_owner_name_fr') || 'أدخل اسم المالك بالفرنسية'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('owner_last_name_ar') || 'لقب المالك بالعربية'}
                    name="owner_last_name_ar"
                  >
                    <Input placeholder={translate('enter_owner_last_name_ar') || 'أدخل لقب المالك بالعربية'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={translate('owner_last_name_fr') || 'لقب المالك بالفرنسية'}
                    name="owner_last_name_fr"
                  >
                    <Input placeholder={translate('enter_owner_last_name_fr') || 'أدخل لقب المالك بالفرنسية'} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div style={{ 
          marginTop: '32px', 
          display: 'flex', 
          justifyContent: isRTL ? 'flex-start' : 'flex-end',
          gap: '12px'
        }}>
          {!isEditing ? (
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              size="large"
            >
              {translate('edit') || 'تعديل'}
            </Button>
          ) : (
            <>
              {/* <Button 
                onClick={() => {
                  setIsEditing(false);
                  form.resetFields();
                  fetchEtablissementData();
                }}
                size="large"
              >
                {translate('cancel') || 'إلغاء'}
              </Button> */}
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {translate('save') || 'حفظ'}
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default EtablissementSettings;
