import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
  BookOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useStateContext();

  const getWelcomeMessage = () => {
    switch (user.role_id) {
      case 'admin':
        return 'Welcome to Association Management System';
      case 'national':
      case 'wilaya':
      case 'baladi':
        return `Welcome back, ${user.prenom_fr || user.prenom_ar}! Manage your association scope effectively.`;
      case 'joiner':
        return `Hello ${user.prenom_fr || user.prenom_ar}! Welcome to your membership portal.`;
      default:
        return 'Welcome to Association Dashboard';
    }
  };

  const getStatsCards = () => {
    if (['admin', 'national', 'wilaya', 'baladi'].includes(user.role_id)) {
      return [
        {
          title: 'Total Joiners',
          value: 156, // Placeholder or fetch actual
          icon: <TeamOutlined style={{ color: '#006233' }} />,
          color: '#006233'
        },
        {
          title: 'Total Applications',
          value: 24,
          icon: <UserOutlined style={{ color: '#52c41a' }} />,
          color: '#52c41a'
        },
        {
          title: 'Active Events',
          value: 4,
          icon: <CalendarOutlined style={{ color: '#faad14' }} />,
          color: '#faad14'
        },
        {
          title: 'Monthly Revenue',
          value: '45,000 DA',
          icon: <DollarOutlined style={{ color: '#1890ff' }} />,
          color: '#1890ff'
        }
      ];
    } else if (user.role_id === 'joiner') {
      return [
        {
          title: 'My Membership',
          value: 'Active',
          icon: <HeartOutlined style={{ color: '#eb2f96' }} />,
          color: '#eb2f96'
        },
        {
          title: 'Upcoming Events',
          value: 2,
          icon: <CalendarOutlined style={{ color: '#1890ff' }} />,
          color: '#1890ff'
        },
        {
          title: 'Payments Status',
          value: 'Paid',
          icon: <BookOutlined style={{ color: '#52c41a' }} />,
          color: '#52c41a'
        }
      ];
    } else {
      return [];
    }
  };

  const statsCards = getStatsCards();

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Welcome Section */}
        <Card style={{ borderTop: '4px solid #006233' }}>
          <Title level={2} style={{ margin: 0, color: '#006233' }}>
            {getWelcomeMessage()}
          </Title>
          <Text type="secondary">
            Role: {user.role_id?.charAt(0).toUpperCase() + user.role_id?.slice(1)}
            {user.etablissement_id && ` | Association: ${user.etablissement?.designation_fr || 'Your Association'}`}
          </Text>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card hoverable>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Card title="Quick Actions" style={{ marginTop: '24px' }}>
          <Row gutter={[16, 16]}>
            {['admin', 'national', 'wilaya', 'baladi'].includes(user.role_id) && (
              <>
                <Col xs={24} sm={12} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => window.location.href = '/mainLayout/joiners'}
                  >
                    <UserOutlined style={{ fontSize: '24px', color: '#006233' }} />
                    <div style={{ marginTop: '8px' }}>Manage Joiners</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => window.location.href = '/mainLayout/joiner-requests'}
                  >
                    <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <div style={{ marginTop: '8px' }}>Joiner Requests</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => window.location.href = '/mainLayout/payments'}
                  >
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <div style={{ marginTop: '8px' }}>Manage Payments</div>
                  </Card>
                </Col>
              </>
            )}

            {user.role_id === 'joiner' && (
              <>
                <Col xs={24} sm={12} md={8}>
                  <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/joiner-layout/payments'}>
                    <DollarOutlined style={{ fontSize: '24px', color: '#006233' }} />
                    <div style={{ marginTop: '8px' }}>My Payments</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card hoverable style={{ textAlign: 'center' }}>
                    <CalendarOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    <div style={{ marginTop: '8px' }}>Events</div>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" style={{ marginTop: '24px' }}>
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Recent activities will be displayed here based on your role and permissions.
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;
