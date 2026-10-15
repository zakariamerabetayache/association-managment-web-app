import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Card,
  Space,
  Tag,
  DatePicker,
  Button,
  List,
  Avatar,
  Badge,
  Typography,
  Row,
  Col,
  Statistic,
  theme,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../../locale/LanguageContext';
import useResponsive from '../../hooks/useResponsive';
import axiosClient from '../../../axios-client';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { useToken } = theme;

const JoinerChecksHistory = () => {
  const { translate, isRTL } = useLanguage();
  const { isMobile } = useResponsive();
  const { token } = useToken();
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const exportRef = useRef(null);

  // Helper function to format date and time properly
  const formatDateOnly = (date) => {
    if (!date) {
      return '—';
    }
    return dayjs(date).format(isRTL ? 'YYYY/MM/DD' : 'DD MMM YYYY');
  };

  const formatTime = (hourStr) => {
    if (!hourStr) {
      return '';
    }
    return dayjs(`2000-01-01 ${hourStr}`).format(isRTL ? 'HH:mm' : 'hh:mm A');
  };

  const formatDateTime = (dateStr, hourStr) => {
    if (!dateStr || !hourStr) {
      return '—';
    }
    const date = formatDateOnly(dateStr);
    const time = formatTime(hourStr);
    return `${date}, ${time}`;
  };
  const [checkRecords, setCheckRecords] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('day')
  ]);
  const [filters, setFilters] = useState({
    start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
    end_date: dayjs().endOf('day').format('YYYY-MM-DD')
  });
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    totalCheckOuts: 0,
  });

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCheckRecords();
  }, [filters]);

  const fetchCheckRecords = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/check-in-outs/joiner/history', {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          per_page: 15
        }
      });

      // Handle new API response format
      const records = Array.isArray(response.data.data) ? response.data.data : [];
      setCheckRecords(records);

      // Use statistics from backend
      if (response.data.statistics) {
        setStats({
          totalCheckIns: response.data.statistics.total_check_ins,
          totalCheckOuts: response.data.statistics.total_check_outs,
        });
      }
    } catch (error) {
      console.error('Error fetching check records:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      // Set empty data on error
      setCheckRecords([]);
      setStats({
        totalCheckIns: 0,
        totalCheckOuts: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      setFilters({
        ...filters,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD')
      });
    }
  };

  const resetFilters = () => {
    const newFilters = {
      start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
      end_date: dayjs().endOf('day').format('YYYY-MM-DD')
    };
    setDateRange([dayjs().startOf('month'), dayjs().endOf('day')]);
    setFilters(newFilters);
  };

  const dateRangeInfo = {
    startDate: filters.start_date,
    endDate: filters.end_date,
  };

  const formatDisplayDate = formatDateOnly;

  const handleDownloadReport = async () => {
    if (!checkRecords.length || pdfLoading || !exportRef.current) {
      return;
    }

    try {
      setPdfLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfDoc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdfDoc.internal.pageSize.getWidth();
      const pageHeight = pdfDoc.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdfDoc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdfDoc.addPage();
        pdfDoc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdfDoc.save(`checks-history-${filters.start_date}_${filters.end_date}.pdf`);
    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const columns = [
    {
      title: translate('child'),
      key: 'child',
      render: (text, record) => {
        const childName = record.child ?
          `${record.child.prenom_ar || record.child.prenom_fr || ''} ${record.child.nom_ar || record.child.nom_fr || ''}`.trim() :
          'Unknown Child';
        return (
          <Space>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: token.colorPrimary }}
            >
              {childName?.charAt(0) || 'C'}
            </Avatar>
            <Text strong>{childName}</Text>
          </Space>
        );
      },
    },
    {
      title: translate('type'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag
          color={type === 0 ? 'green' : 'orange'}
          icon={type === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          style={{
            borderRadius: '12px',
            padding: '0 10px',
            margin: 0,
            textTransform: 'capitalize'
          }}
        >
          {type === 0 ? translate('check_in') : translate('check_out')}
        </Tag>
      ),
    },
    {
      title: translate('date'),
      key: 'datetime',
      render: (text, record) => (
        <Space>
          <CalendarOutlined style={{ color: token.colorTextSecondary }} />
          <Text>{formatDateTime(record.date, record.hour)}</Text>
        </Space>
      ),
    },
    {
      title: translate('checked_by'),
      key: 'checker',
      render: (text, record) => {
        const checkerName = record.checker ?
          `${record.checker.prenom_ar || record.checker.prenom_fr || ''} ${record.checker.nom_ar || record.checker.nom_fr || ''}`.trim() :
          'System';
        return <Text type="secondary">{checkerName}</Text>;
      },
    },
  ];

  const mobileList = (
    <List
      dataSource={checkRecords}
      loading={loading}
      renderItem={(item) => (
        <List.Item style={{ padding: '12px 0' }}>
          <Card
            size="small"
            style={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${token.colorBorderSecondary}`
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                size="large"
                style={{
                  backgroundColor: token.colorPrimaryBg,
                  color: token.colorPrimary,
                  marginRight: '12px'
                }}
              >
                {item.child ? (item.child.prenom_ar || item.child.prenom_fr || 'C').charAt(0) : 'C'}
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <Text strong style={{ fontSize: '15px' }}>
                    {item.child ?
                      `${item.child.prenom_ar || item.child.prenom_fr || ''} ${item.child.nom_ar || item.child.nom_fr || ''}`.trim() :
                      'Unknown Child'
                    }
                  </Text>
                  <Tag
                    color={item.type === 0 ? 'green' : 'orange'}
                    icon={item.type === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                    style={{
                      borderRadius: '12px',
                      padding: '0 8px',
                      margin: 0,
                      fontSize: '12px'
                    }}
                  >
                    {item.type === 0 ? translate('check_in') : translate('check_out')}
                  </Tag>
                </div>

                <div style={{ marginBottom: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <CalendarOutlined style={{ marginRight: '4px' }} />
                    {formatDateTime(item.date, item.hour)}
                  </Text>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {translate('by')} {item.checker ?
                      `${item.checker.prenom_ar || item.checker.prenom_fr || ''} ${item.checker.nom_ar || item.checker.nom_fr || ''}`.trim() :
                      'System'
                    }
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  const statCardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: `1px solid ${token.colorBorderSecondary}`,
    width: '100%',
    height: '100%'
  };

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: `1px solid ${token.colorBorderSecondary}`,
    width: '100%',
    height: '100%'
  };

  return (
    <>
      <div style={{
        padding: isMobile ? '16px' : '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0 }}>{translate('checks_history')}</Title>
          <Text type="secondary">
            {translate('showing_records_from')}{' '}
            {formatDateOnly(filters.start_date)} {translate('to')}{' '}
            {formatDateOnly(filters.end_date)}
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={12}>
            <Card style={statCardStyle} bodyStyle={{ padding: '16px' }}>
              <Statistic
                title={translate('total_check_ins')}
                value={stats.totalCheckIns}
                prefix={<ArrowDownOutlined style={{ color: token.colorSuccess }} />}
                valueStyle={{ color: token.colorSuccess }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Card style={statCardStyle} bodyStyle={{ padding: '16px' }}>
              <Statistic
                title={translate('total_check_outs')}
                value={stats.totalCheckOuts}
                prefix={<ArrowUpOutlined style={{ color: token.colorWarning }} />}
                valueStyle={{ color: token.colorWarning }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          style={cardStyle}
          bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              allowClear={false}
              style={{ width: isMobile ? '100%' : 300 }}
              size={isMobile ? 'large' : 'middle'}
              format="DD/MM/YYYY"
            />
            <div
              style={{
                display: 'flex',
                gap: '8px',
                width: isMobile ? '100%' : 'auto',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}
            >
              <Button
                type="primary"
                onClick={fetchCheckRecords}
                loading={loading}
                size={isMobile ? 'large' : 'middle'}
                style={{ flex: isMobile ? 1 : 'none' }}
                icon={<SearchOutlined />}
              >
                {translate('apply_filter')}
              </Button>
              <Button
                onClick={resetFilters}
                disabled={loading}
                size={isMobile ? 'large' : 'middle'}
                style={{ flex: isMobile ? 1 : 'none' }}
              >
                {translate('reset')}
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                type="default"
                size={isMobile ? 'large' : 'middle'}
                loading={pdfLoading}
                disabled={pdfLoading || !checkRecords.length}
                style={{ flex: isMobile ? 1 : 'none' }}
                onClick={handleDownloadReport}
              >
                {translate('download_report')}
              </Button>
            </div>
          </div>

          {isMobile ? (
            mobileList
          ) : (
            <Table
              columns={columns}
              dataSource={checkRecords}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `${total} ${translate('records')}`,
                showQuickJumper: true,
                size: 'small',
                style: { marginBottom: 0 }
              }}
              style={{ marginTop: '16px' }}
              rowClassName={(record) => record.status === 'pending' ? 'pending-row' : ''}
            />
          )}
        </Card>
      </div>

      <div
        ref={exportRef}
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '1000px',
          padding: '24px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontFamily: 'Arial, "Segoe UI", sans-serif',
          zIndex: -1,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
            {translate('checks_history_report')}
          </h2>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#4a5568' }}>
            {translate('report_generated_on')}: {dayjs().format('DD MMM YYYY HH:mm')}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#4a5568' }}>
            {translate('period')}: {formatDisplayDate(dateRangeInfo.startDate)} {translate('to')}{' '}
            {formatDisplayDate(dateRangeInfo.endDate)}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ flex: 1, border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{translate('total_records')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{checkRecords.length}</p>
          </div>
          <div style={{ flex: 1, border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{translate('total_check_ins')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{stats.totalCheckIns}</p>
          </div>
          <div style={{ flex: 1, border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{translate('total_check_outs')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{stats.totalCheckOuts}</p>
          </div>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  textAlign: 'center',
                }}
              >
                #
              </th>
              <th
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {translate('child')}
              </th>
              <th
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  textAlign: 'center',
                }}
              >
                {translate('type')}
              </th>
              <th
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {translate('date')}
              </th>
              <th
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {translate('checked_by')}
              </th>
            </tr>
          </thead>
          <tbody>
            {checkRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: '1px solid #d1d5db',
                    padding: '16px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  {translate('no_data')}
                </td>
              </tr>
            ) : (
              checkRecords.map((record, index) => {
                const childName = record.child
                  ? `${record.child.prenom_ar || record.child.prenom_fr || ''} ${record.child.nom_ar || record.child.nom_fr || ''
                    }`.trim() || translate('child')
                  : translate('child');
                const checkerName = record.checker
                  ? `${record.checker.prenom_ar || record.checker.prenom_fr || ''} ${record.checker.nom_ar || record.checker.nom_fr || ''
                    }`.trim() || translate('checked_by')
                  : translate('checked_by');
                const typeLabel =
                  record.type === 0 ? translate('check_in') : translate('check_out');

                return (
                  <tr key={record.id || `${record.date}-${index}`}>
                    <td
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {childName}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                      }}
                    >
                      {typeLabel}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {formatDateTime(record.date, record.hour)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {checkerName}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default JoinerChecksHistory;
