import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Divider,
  Spin,
  Progress,
  Tooltip,
  Space
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import dayjs from 'dayjs';
import { useLanguage } from '../locale/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import dashboardService from '../services/dashboardService';

const { Title, Text } = Typography;
const { Option } = Select;

const DashboardNew = () => {
  const { translate } = useLanguage();
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Generate month options for the dropdown
  const monthOptions = [
    { value: 1, label: translate('january') },
    { value: 2, label: translate('february') },
    { value: 3, label: translate('march') },
    { value: 4, label: translate('april') },
    { value: 5, label: translate('may') },
    { value: 6, label: translate('june') },
    { value: 7, label: translate('july') },
    { value: 8, label: translate('august') },
    { value: 9, label: translate('september') },
    { value: 10, label: translate('october') },
    { value: 11, label: translate('november') },
    { value: 12, label: translate('december') },
  ];

  // Generate year options (current year and previous 5 years)
  const yearOptions = [];
  const currentYear = dayjs().year();
  for (let year = currentYear; year >= currentYear - 5; year--) {
    yearOptions.push(
      <Option key={year} value={year}>
        {year}
      </Option>
    );
  }

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats(selectedMonth, selectedYear);

      if (response && response.data) {
        // Map the backend response to match frontend expected structure
        const statsData = {
          ...response.data,
          // Map RFID data to match frontend expectations
          total_with_rfid: response.data.rfid?.total || 0,
          joiners_with_rfid: response.data.rfid?.joiners || 0,
          companions_with_rfid: response.data.rfid?.companions || 0,
          // Map payment data
          total_payments: response.data.total_payments || 0,
          approved_payments: response.data.approved_payments || 0,
          pending_payments: response.data.pending_payments || 0,
          total_revenue: response.data.total_revenue || 0,
          // Map check-in/out data
          check_ins: response.data.check_ins || 0,
          check_outs: response.data.check_outs || 0,
        };

        setStats(statsData);
      } else {
        console.warn('No data received from API');
        // Set default stats to prevent null reference errors
        setStats({
          total_children: 0,
          total_joiners: 0,
          total_companions: 0,
          total_with_rfid: 0,
          joiners_with_rfid: 0,
          companions_with_rfid: 0,
          total_payments: 0,
          approved_payments: 0,
          pending_payments: 0,
          total_revenue: 0,
          check_ins: 0,
          check_outs: 0,
        });
      }
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      // Set some default data in case of error
      setStats({
        total_children: 0,
        total_joiners: 0,
        total_companions: 0,
        // Add other default values as needed
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  // Handle month change
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  // Handle year change
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // Format number with thousands separator
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Calculate percentage
  const calculatePercentage = (part, total) => {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!stats) return [];

    // Prepare monthly payments data
    const monthlyPayments = stats.monthly_payments || [];
    const paymentsData = monthlyPayments.map(item => ({
      month: item.month,
      approved: item.approved_count || 0,
      pending: item.pending_count || 0,
      total: (item.approved_count || 0) + (item.pending_count || 0)
    }));

    // Prepare check-in/out data
    const checkInOutData = [
      {
        name: translate('check_ins'),
        count: stats.check_ins_count || 0,
        fill: '#52c41a'
      },
      {
        name: translate('check_outs'),
        count: stats.check_outs_count || 0,
        fill: '#f5222d'
      }
    ];

    return { paymentsData, checkInOutData };
  };

  const { paymentsData, checkInOutData } = prepareChartData();

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with title and date selectors */}
      <div className="dashboard-header" style={{ marginBottom: 24, width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              {translate('dashboard')} - {monthOptions[selectedMonth - 1]?.label} {selectedYear}
            </Title>
          </Col>
          <Col>
            <Space style={{ margin: " 0 20px" }}>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                style={{ width: 150 }}
                placeholder={translate('select_month')}
              >
                {monthOptions.map(month => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                style={{ width: 120 }}
                placeholder={translate('select_year')}
              >
                {yearOptions}
              </Select>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Stats Cards - First Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Total National */}
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title={translate('national')}
              value={stats?.total_national || 0}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Total Joiners */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={translate('total_joiners')}
              value={stats?.total_joiners || 0}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            {stats?.total_joiners > 0 && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <Text type="success">
                  <ArrowUpOutlined /> {stats?.approved_joiners || 0} {translate('approved')}
                </Text>
                <Text type="warning" style={{ marginLeft: 8 }}>
                  <ClockCircleOutlined /> {stats?.total_joiners - (stats?.approved_joiners || 0)} {translate('pending')}
                </Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Companions */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={translate('companions')}
              value={stats?.total_companions || 0}
              prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
            {stats?.total_joiners > 0 && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <Progress
                  percent={calculatePercentage(stats?.total_companions || 0, stats?.total_joiners || 1)}
                  size="small"
                  showInfo={false}
                  strokeColor="#13c2c2"
                />
                <Text type="secondary">
                  {translate('of_joiners')} ({calculatePercentage(stats?.total_companions || 0, stats?.total_joiners || 1)}%)
                </Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={`${translate('total_revenue')} (${monthOptions[selectedMonth - 1]?.label})`}
              value={stats?.total_revenue || 0}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="DA"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Second Row - Check-in/Out and RFID Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Check-ins/Check-outs */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <LoginOutlined style={{ marginRight: 8 }} />
                {translate('check_ins_outs')}
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={translate('check_outs')}
                  value={stats?.check_outs_count || 0}
                  valueStyle={{ color: '#f5222d' }}
                  prefix={<LogoutOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={translate('check_ins')}
                  value={stats?.check_ins_count || 0}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<LoginOutlined />}
                />
              </Col>

            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={checkInOutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {checkInOutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* RFID Cards */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <IdcardOutlined style={{ marginRight: 8 }} />
                {translate('rfid_cards')}
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title={translate('total_with_rfid')}
                  value={stats?.total_with_rfid || 0}
                  suffix={`/ ${(stats?.total_users || 0) + (stats?.total_joiners || 0) + (stats?.total_companions || 0)}`}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={`${translate('joiners')} ${translate('with_rfid')}`}
                  value={stats?.joiners_with_rfid || 0}
                  suffix={`/ ${stats?.total_joiners || 0}`}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={`${translate('companions')} ${translate('with_rfid')}`}
                  value={stats?.companions_with_rfid || 0}
                  suffix={`/ ${stats?.total_companions || 0}`}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <Text>{translate('rfid_coverage')}</Text>
                  <Progress
                    percent={calculatePercentage(
                      stats?.total_with_rfid || 0,
                      (stats?.total_users || 0) + (stats?.total_joiners || 0) + (stats?.total_companions || 0)
                    )}
                    status="active"
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text>{translate('joiners')}</Text>
                  <Progress
                    percent={calculatePercentage(stats?.joiners_with_rfid || 0, stats?.total_joiners || 1)}
                    status="active"
                  />
                </div>
                <div>
                  <Text>{translate('companions')}</Text>
                  <Progress
                    percent={calculatePercentage(stats?.companions_with_rfid || 0, stats?.total_companions || 1)}
                    status="active"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Third Row - Monthly Payments */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <span>
                <DollarOutlined style={{ marginRight: 8 }} />
                {translate('monthly_payments')} ({selectedYear})
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="approved" name={translate('approved')} fill="#52c41a" />
                <Bar dataKey="pending" name={translate('pending')} fill="#faad14" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Fourth Row - Associates and Other Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Payment Status */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <DollarOutlined style={{ marginRight: 8 }} />
                {translate('payment_status')} ({monthOptions[selectedMonth - 1]?.label})
              </span>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title={translate('total_payments')}
                  value={stats?.total_payments || 0}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={translate('approved')}
                  value={stats?.approved_payments || 0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={translate('pending')}
                  value={(stats?.total_payments || 0) - (stats?.approved_payments || 0)}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <Text>{translate('payment_completion')}</Text>
              <Progress
                percent={calculatePercentage(stats?.approved_payments || 0, stats?.total_payments || 1)}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardNew;
