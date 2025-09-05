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
      description: t('allMajorDepartments'), // ✅ Added translation
      color: 'saffron',
      position: 'top-left'
    },
    {
      icon: <FaUsers />,
      number: GOVERNMENT_STATS.CITIZEN_RESPONSES,
      label: t('citizenResponses'),
      description: t('increaseThisMonth'), // ✅ Added translation
      color: 'green',
      position: 'top-right'
    },
    {
      icon: <FaFileAlt />,
      number: GOVERNMENT_STATS.POLICIES_ANALYZED,
      label: t('policiesAnalyzed'),
      description: t('lastFiscalYear'), // ✅ Added translation
      color: 'navy',
      position: 'bottom-left'
    },
    {
      icon: <FaBullseye />,
      number: GOVERNMENT_STATS.DECISION_ACCURACY,
      label: t('decisionAccuracy'),
      description: t('improvingQuality'), // ✅ Added translation
      color: 'saffron',
      position: 'bottom-right'
    },
    {
      icon: <FaMapMarkedAlt />,
      number: GOVERNMENT_STATS.STATES_COVERED,
      label: t('statesCovered'),
      description: t('allUnionTerritories'), // ✅ Added translation
      color: 'green',
      position: 'center'
    },
    {
      icon: <FaLanguage />,
      number: GOVERNMENT_STATS.LANGUAGES_SUPPORTED,
      label: t('languagesSupported'),
      description: t('constitutionalLanguages'), // ✅ Added translation
      color: 'navy',
      position: 'center-right'
    }
  ];

  const quadrantFeatures = [
    {
      title: t('dataDrivenPolicies'),
      description: t('dataDrivenPoliciesDesc'), // ✅ Added translation
      icon: <FaFileAlt />,
      position: 'top-left',
      color: 'saffron'
    },
    {
      title: t('enhancedTransparency'),
      description: t('enhancedTransparencyDesc'), // ✅ Added translation
      icon: <FaUsers />,
      position: 'top-right',
      color: 'green'
    },
    {
      title: t('advancedAnalytics'),
      description: t('advancedAnalyticsDesc'), // ✅ Added translation
      icon: <FaBullseye />,
      position: 'bottom-left',
      color: 'navy'
    },
    {
      title: t('citizenEngagement'),
      description: t('citizenEngagementDesc'), // ✅ Added translation
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
          {/* Left Side - Quadrant Features */}
          <Col lg={6} className="pe-lg-3">
            <div className="features-quadrant-container-enhanced">
              <div className="quadrant-header mb-4">
                <h3 className="quadrant-section-title">{t('coreCapabilities')}</h3> {/* ✅ Fixed */}
                <p className="quadrant-section-subtitle">{t('fourPillarsGovernance')}</p> {/* ✅ Fixed */}
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
                <h3 className="grid-title">{t('governmentImpactMetrics')}</h3> {/* ✅ Fixed */}
                <p className="grid-subtitle">{t('realTimePerformanceDashboard')}</p> {/* ✅ Fixed */}
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
