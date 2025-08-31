import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaComments, FaFileAlt, FaUsers, FaClock, FaShieldAlt, FaAward } from 'react-icons/fa';

const StatsSection = () => {
  const mainStats = [
    {
      icon: <FaComments />,
      number: '2.5M+',
      label: 'Comments Analyzed',
      description: 'Stakeholder feedback processed with advanced AI',
      color: 'primary'
    },
    {
      icon: <FaFileAlt />,
      number: '500+',
      label: 'Consultations',
      description: 'Draft legislations reviewed and analyzed',
      color: 'success'
    },
    {
      icon: <FaUsers />,
      number: '10K+',
      label: 'Active Users',
      description: 'Government officials using the platform',
      color: 'info'
    },
    {
      icon: <FaClock />,
      number: '95%',
      label: 'Time Saved',
      description: 'Faster analysis compared to manual review',
      color: 'warning'
    }
  ];

  const additionalStats = [
    {
      icon: <FaShieldAlt />,
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable government-grade infrastructure',
      color: 'success'
    },
    {
      icon: <FaAward />,
      number: '28',
      label: 'States Connected',
      description: 'Pan-India government consultation coverage',
      color: 'primary'
    }
  ];

  return (
    <section className="stats-section-redesigned">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold stats-heading mb-3">
              Trusted by Government Agencies Nationwide
            </h2>
            <p className="lead stats-subtitle">
              Making public consultation more efficient and insightful through advanced AI analytics
            </p>
          </Col>
        </Row>

        <Row className="align-items-center">
          {/* Main Stats - Vertical Layout */}
          <Col lg={6} className="mb-4">
            <div className="stats-grid-vertical">
              {mainStats.map((stat, index) => (
                <Card key={index} className="stat-card-vertical">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className={`stat-icon-container stat-${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="stat-content ms-4 flex-grow-1">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                      <small className="stat-description">{stat.description}</small>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* Additional Stats - Vertical Layout */}
          <Col lg={6} className="mb-4">
            <div className="stats-grid-vertical">
              {additionalStats.map((stat, index) => (
                <Card key={index} className="stat-card-vertical">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className={`stat-icon-container stat-${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="stat-content ms-4 flex-grow-1">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                      <small className="stat-description">{stat.description}</small>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              
              {/* Trust Badge */}
              <Card className="trust-badge-card">
                <Card.Body className="text-center p-4">
                  <div className="trust-badge-icon mb-3">
                    <FaShieldAlt size={40} />
                  </div>
                  <h6 className="trust-badge-title">Government Certified</h6>
                  <small className="trust-badge-subtitle">
                    ISO 27001 | Digital India Ready | CERT-In Approved
                  </small>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;
