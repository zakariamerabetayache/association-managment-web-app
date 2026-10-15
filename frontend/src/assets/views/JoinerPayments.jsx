import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Upload,
  message,
  Tag,
  Space,
  Tooltip,
  Row,
  Col,
  Statistic,
  Select,
  Spin,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import useResponsive from '../hooks/useResponsive';
import joinerPaymentsService from '../services/joinerPaymentsService';
import ErrorHandling from '../components/ErrorHandling';
import PaymentReceiptPDF from '../components/PaymentReceiptPDF';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';


const { Title, Text } = Typography;

const JoinerPayments = () => {
  const { translate, isRTL } = useLanguage();
  const { user } = useStateContext();
  const { isMobile } = useResponsive();

  // State management
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });


  // Load data on component mount
  useEffect(() => {
    if (user.id) {
      fetchPayments();
      fetchStatistics();
    }

  }, [user.id]);

  const [filters, setFilters] = useState({
    state: undefined,
  });

  // Fetch payments with current filters and pagination
  const fetchPayments = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        state: filters.state,
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const response = await joinerPaymentsService.getAll(params);
      setPayments(response.data);
      setPagination({
        current: response.current_page,
        pageSize: response.per_page,
        total: response.total,
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fetch payments with specific params
  const fetchPaymentsWithParams = async (params) => {
    try {
      setLoading(true);

      const response = await joinerPaymentsService.getAll(params);
      setPayments(response.data);
      setPagination({
        current: response.current_page,
        pageSize: response.per_page,
        total: response.total,
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      message.error(translate('error_loading_payments') || 'Error loading payments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await joinerPaymentsService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Handle table pagination change
  const handleTableChange = (pagination, filters, sorter) => {
    fetchPayments(pagination.current, pagination.pageSize);
  };



  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Use the new filters for the API call
    const params = {
      page: 1,
      limit: pagination.pageSize,
      state: newFilters.state,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };

    fetchPaymentsWithParams(params);
  };

  // Handle payment creation
  const handleCreatePayment = async () => {
    try {
      if (!selectedFile) {
        message.error(translate('please_select_pdf') || 'Please select a PDF file');
        return;
      }


      setUploading(true);

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      for (let [key, value] of formData.entries()) {
      }

      const response = await joinerPaymentsService.create(formData);
      Swal.fire({
        title: translate('payment_created_successfully') || 'Payment Created Successfully',
        text: translate('payment_waiting_validation_joiner') || 'Your payment is now waiting until the manager validates it to activate your membership.',
        icon: 'success',
        confirmButtonText: translate('ok') || 'OK',
      })
      setModalVisible(false);
      setSelectedFile(null);
      fetchPayments();
      fetchStatistics();
    } catch (error) {
      console.error('Error creating payment:', error);
      ErrorHandling(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle PDF upload for existing payment
  const handlePdfUpload = async (values) => {
    try {
      const formData = new FormData();
      if (values.pdf && values.pdf.fileList && values.pdf.fileList[0]) {
        formData.append('pdf', values.pdf.fileList[0].originFileObj);
      }

      await joinerPaymentsService.uploadPdf(selectedPayment.id, formData);
      Swal.fire({
        icon: 'success',
        title: translate('success') || 'Success',
        text: translate('pdf_uploaded_successfully') || 'PDF uploaded successfully',
      });
      setUploadModalVisible(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      message.error(translate('error_uploading_pdf') || 'Error uploading PDF');
    }
  };

  const columns = [



    {
      title: translate('amount') || 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount} DA`,
      width: 120,
    },

    {
      title: translate('payment_date') || 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: translate('status') || 'Status',
      dataIndex: 'state',
      key: 'state',
      render: (state) => {
        const statusConfig = {
          0: { color: 'orange', text: translate('pending') || 'Pending' },
          1: { color: 'green', text: translate('completed') || 'Completed' },
        };
        const config = statusConfig[state] || { color: 'default', text: translate('unknown') || 'Unknown' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      width: 100,
    },
    {
      title: translate('receipt') || 'Receipt',
      dataIndex: 'pdf_path',
      key: 'receipt',
      render: (pdfPath, record) => {
        return (
          <Space>
            {pdfPath ? (
              <>

                <Tooltip title={translate('view_receipt') || 'View Receipt'}>
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      window.open(`${import.meta.env.VITE_API_BASE_URL}/storage/${pdfPath}`, '_blank');
                    }}
                  >
                    {translate('view_receipt') || 'View Receipt'}
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Button
                type="link"
                size="small"
                icon={<UploadOutlined />}
                onClick={() => {
                  setSelectedPayment(record);
                  setUploadModalVisible(true);
                }}
              >
                {translate('upload_pdf') || 'Upload PDF'}
              </Button>
            )}

          </Space>
        );
      },
      width: 150,
    },
    {
      title: translate('actions') || 'Actions',
      key: 'actions',
      render: (record) => {
        return (
          <Space>
            {record.state === 1 && (
              <PaymentReceiptPDF payment={record} type="default" />
            )}
          </Space>
        );
      },
      width: 150,
    },


  ].filter(Boolean);



  // PaymentCard component for mobile view
  const PaymentCard = ({ payment }) => (
    <Card
      key={payment.id}
      style={{
        marginBottom: '16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #f5f7fa, #e4e7f1)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '16px' }}
      hoverable
    >
      {/* Payment Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <DollarOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0, color: '#1a2b50' }}>
            {payment.amount} DA
          </Title>
          <Text style={{ fontSize: '12px', color: '#6b7280' }}>
            {dayjs(payment.date).format('DD/MM/YYYY')}
          </Text>
        </div>
        <Tag
          color={payment.state === 0 ? 'orange' : 'green'}
          style={{ borderRadius: '12px', fontWeight: 'bold' }}
        >
          {payment.state === 0 ? (translate('pending') || 'Pending') : (translate('completed') || 'Completed')}
        </Tag>
      </div>



      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>

        </div>
        <Space>
          {payment.pdf_path ? (
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                window.open(`${import.meta.env.VITE_API_BASE_URL}/storage/${payment.pdf_path}`, '_blank');
              }}
              style={{
                background: '#52c41a',
                borderColor: '#52c41a',
                borderRadius: '6px'
              }}
            >
              {translate('view_receipt') || 'View Receipt'}
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setSelectedPayment(payment);
                setUploadModalVisible(true);
              }}
              style={{
                background: '#006233',
                borderColor: '#006233',
                borderRadius: '6px'
              }}
            >
              {translate('upload_pdf') || 'Upload PDF'}
            </Button>
          )}
          {payment.state === 1 && (
            <PaymentReceiptPDF
              payment={payment}
              type="default"
              buttonText={translate('official_receipt') || 'الوصل الرسمي'}
            />
          )}
        </Space>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <Col xs={8} sm={8}>
          <Card>
            <Statistic
              title={translate('total_payments') || 'Total Payments'}
              value={statistics.total || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={8} sm={8}>
          <Card>
            <Statistic
              title={translate('pending_payments') || 'Pending'}
              value={statistics.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#D52B1E' }}
            />
          </Card>
        </Col>
        <Col xs={8} sm={8}>
          <Card>
            <Statistic
              title={translate('completed_payments') || 'Completed'}
              value={statistics.completed || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: isMobile ? '16px' : '20px' }} />
            <span style={{ fontSize: isMobile ? '16px' : '18px' }}>
              {translate('my_payments') || 'My Payments'}
            </span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            size={isMobile ? 'small' : 'default'}
            block={isMobile}
            style={isMobile ? { marginTop: '8px' } : {}}
          >
            {isMobile ? translate('add') || 'Add' : translate('add_payment') || 'Add Payment'}
          </Button>
        }
      >
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>

          <Col xs={24} sm={12}>
            <Select
              placeholder={translate('filter_by_status') || 'Filter by status'}
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('state', value)}
              size={isMobile ? 'default' : 'large'}
            >
              <Select.Option value={0}>{translate('pending') || 'Pending'}</Select.Option>
              <Select.Option value={1}>{translate('completed') || 'Completed'}</Select.Option>
            </Select>
          </Col>
        </Row>

        {/* Payments Table/Cards */}
        {isMobile ? (
          <div>
            {loading ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px' }}>
                    {translate('loading') || 'Loading...'}
                  </div>
                </div>
              </Card>
            ) : payments.length === 0 ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  {translate('no_payments_found') || 'No payments found'}
                </div>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={payments}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* Add Payment Modal */}
      <Modal
        title={translate('add_payment') || 'Add Payment'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedFile(null);
        }}
        footer={null}
        width={isMobile ? '90%' : 600}
        centered={isMobile}
      >
        <div>
          <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f0f2f5', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
              {translate('payment_info') || 'Payment Information'}
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              {translate('rip') || 'RIP'}: <strong>{user?.etablissement?.rip || 0}</strong>
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              {translate('amount') || 'Amount'}: <strong>{user?.etablissement?.price || 0} DA</strong>
            </p>

          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              {translate('receipt_pdf') || 'Receipt PDF'} <span style={{ color: 'red' }}>*</span>
            </label>
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false; // Prevent automatic upload
              }}
              onRemove={() => {
                setSelectedFile(null);
              }}
              accept=".pdf"
              maxCount={1}
              fileList={selectedFile ? [{
                uid: '1',
                name: selectedFile.name,
                status: 'done',
              }] : []}
            >
              <Button icon={<UploadOutlined />}>
                {translate('select_pdf') || 'Select PDF'}
              </Button>
            </Upload>
            {selectedFile && (
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
            <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: isMobile ? '100%' : 'auto' }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setSelectedFile(null);
                }}
                size={isMobile ? 'default' : 'large'}
                block={isMobile}
              >
                {translate('cancel') || 'Cancel'}
              </Button>
              <Button
                type="primary"
                loading={uploading}
                disabled={!selectedFile}
                onClick={handleCreatePayment}
                size={isMobile ? 'default' : 'large'}
                block={isMobile}
              >
                {translate('create_payment') || 'Create Payment'}
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* Upload PDF Modal */}
      <Modal
        title={translate('upload_receipt') || 'Upload Receipt'}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setSelectedPayment(null);
        }}
        footer={null}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={handlePdfUpload}
        >
          <Form.Item
            name="pdf"
            label={translate('receipt_pdf') || 'Receipt PDF'}
            rules={[
              { required: true, message: translate('please_select_pdf') || 'Please select PDF file' },
            ]}
          >
            <Upload
              beforeUpload={() => false}
              accept=".pdf"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                {translate('select_pdf') || 'Select PDF'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setUploadModalVisible(false);
                setSelectedPayment(null);
              }}>
                {translate('cancel') || 'Cancel'}
              </Button>
              <Button type="primary" htmlType="submit">
                {translate('upload') || 'Upload'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JoinerPayments;
