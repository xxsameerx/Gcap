import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaBuilding, FaUsers, FaFileAlt, FaBullseye, FaMapMarkedAlt, FaLanguage, FaFlag } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { GOVERNMENT_STATS } from '../../utils/constants';
import { FaScaleBalanced } from 'react-icons/fa6';

const GovernmentImpact = () => {
  const { t } = useLanguage();

  const impactMetrics = [
    {
      icon: <FaBuilding />,
      number: GOVERNMENT_STATS.MINISTRIES_CONNECTED,
      label: t('ministriesConnected'),
      description: 'All major departments',
      color: 'saffron',
      position: 'top-left'
    },
    {
      icon: <FaUsers />,
      number: GOVERNMENT_STATS.CITIZEN_RESPONSES,
      label: t('citizenResponses'),
      description: '+25% this month',
      color: 'green',
      position: 'top-right'
    },
    {
      icon: <FaFileAlt />,
      number: GOVERNMENT_STATS.POLICIES_ANALYZED,
      label: t('policiesAnalyzed'),
      description: 'Last fiscal year',
      color: 'navy',
      position: 'bottom-left'
    },
    {
      icon: <FaBullseye />,
      number: GOVERNMENT_STATS.DECISION_ACCURACY,
      label: t('decisionAccuracy'),
      description: 'Improving quality',
      color: 'saffron',
      position: 'bottom-right'
    },
    {
      icon: <FaMapMarkedAlt />,
      number: GOVERNMENT_STATS.STATES_COVERED,
      label: t('statesCovered'),
      description: 'All Union Territories',
      color: 'green',
      position: 'center'
    },
    {
      icon: <FaLanguage />,
      number: GOVERNMENT_STATS.LANGUAGES_SUPPORTED,
      label: t('languagesSupported'),
      description: 'Constitutional languages',
      color: 'navy',
      position: 'center-right'
    }
  ];

  const quadrantFeatures = [
    {
      title: t('dataDrivenPolicies'),
      description: 'Evidence-based policy making through comprehensive citizen feedback analysis and ML-powered insights',
      icon: <FaFileAlt />,
      position: 'top-left',
      color: 'saffron'
    },
    {
      title: t('enhancedTransparency'),
      description: 'Open government initiatives with full audit trails and public participation records for accountability',
      icon: <FaUsers />,
      position: 'top-right',
      color: 'green'
    },
    {
      title: t('advancedAnalytics'),
      description: 'ML-powered sentiment analysis, topic clustering, and predictive policy impact modeling for better outcomes',
      icon: <FaBullseye />,
      position: 'bottom-left',
      color: 'navy'
    },
    {
      title: t('citizenEngagement'),
      description: 'Structured feedback collection with demographic analysis and regional insights for inclusive governance',
      icon: <FaBuilding />,
      position: 'bottom-right',
      color: 'saffron'
    }
  ];

  return (
    <section className="government-impact-section-fullwidth">
      <Container fluid>
        {/* Section Header */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} className="text-center">
            <h2 className="section-title mb-3">{t('heroTitle')}</h2>
            <p className="section-subtitle mb-4">{t('heroSubtitle')}</p>
          </Col>
        </Row>

        <Row className="g-0">
          {/* Left Side - Quadrant Features (Keep Same) */}
          <Col lg={6} className="pe-lg-3">
            <div className="features-quadrant-container-enhanced">
              <div className="quadrant-header mb-4">
                <h3 className="quadrant-section-title">Core Capabilities</h3>
                <p className="quadrant-section-subtitle">Four pillars of modern governance analytics</p>
              </div>
              
              {/* Axis Lines */}
              <div className="quadrant-axis horizontal-axis"></div>
              <div className="quadrant-axis vertical-axis"></div>
              
              {/* Quadrant Grid */}
              <div className="quadrant-grid-enhanced">
                {quadrantFeatures.map((feature, index) => (
                  <div key={index} className={`quadrant-item-enhanced ${feature.position} quadrant-${feature.color}`}>
                    <div className="quadrant-content-enhanced">
                      <div className={`quadrant-icon-enhanced icon-${feature.color}`}>
                        {feature.icon}
                      </div>
                      <h5 className="quadrant-title-enhanced">{feature.title}</h5>
                      <p className="quadrant-description-enhanced">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
{/* Right Side - Modern Grid */}
<Col lg={6} className="ps-lg-3">
  <div className="modern-grid-container">
    <div className="grid-header text-center mb-4">
      <h3 className="grid-title">Government Impact Metrics</h3>
      <p className="grid-subtitle">Real-time Performance Dashboard</p>
    </div>
    
    <div className="metrics-modern-grid">
      {impactMetrics.slice(0, 6).map((metric, index) => (
        <div key={index} className={`modern-metric-card card-${metric.color}`}>
          <div className="modern-card-header">
            <div className={`modern-icon bg-${metric.color}`}>
              {metric.icon}
            </div>
          </div>
          <div className="modern-card-body">
            <div className="modern-number">{metric.number}</div>
            <div className="modern-label">{metric.label}</div>
            <div className="modern-description">{metric.description}</div>
          </div>
          <div className="modern-card-accent"></div>
        </div>
      ))}
    </div>
  </div>
</Col>




        </Row>
      </Container>
    </section>
  );
};

export default GovernmentImpact;
