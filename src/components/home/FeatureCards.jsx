import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  FaHeart, 
  FaFileAlt, 
  FaCloud, 
  FaRobot, 
  FaChartBar, 
  FaClock,
  FaShieldAlt,
  FaLanguage,
  FaUsers
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const FeatureCards = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <FaHeart />,
      titleKey: 'sentimentAnalysisTitle',
      subtitleKey: 'sentimentAnalysisSubtitle',
      descriptionKey: 'sentimentAnalysisDesc',
      detailKeys: ['sentimentFeature1', 'sentimentFeature2', 'sentimentFeature3', 'sentimentFeature4'],
      color: 'saffron',
      badgeKey: 'sentimentAnalysisBadge'
    },
    {
      icon: <FaFileAlt />,
      titleKey: 'documentSummarizationTitle',
      subtitleKey: 'documentSummarizationSubtitle',
      descriptionKey: 'documentSummarizationDesc',
      detailKeys: ['documentFeature1', 'documentFeature2', 'documentFeature3', 'documentFeature4'],
      color: 'navy',
      badgeKey: 'documentSummarizationBadge'
    },
    {
      icon: <FaCloud />,
      titleKey: 'dataVisualizationTitle',
      subtitleKey: 'dataVisualizationSubtitle',
      descriptionKey: 'dataVisualizationDesc',
      detailKeys: ['visualizationFeature1', 'visualizationFeature2', 'visualizationFeature3', 'visualizationFeature4'],
      color: 'green',
      badgeKey: 'dataVisualizationBadge'
    },
    {
      icon: <FaRobot />,
      titleKey: 'policyAssistantTitle',
      subtitleKey: 'policyAssistantSubtitle',
      descriptionKey: 'policyAssistantDesc',
      detailKeys: ['assistantFeature1', 'assistantFeature2', 'assistantFeature3', 'assistantFeature4'],
      color: 'saffron',
      badgeKey: 'policyAssistantBadge'
    },
    {
      icon: <FaChartBar />,
      titleKey: 'analyticsEngineTitle',
      subtitleKey: 'analyticsEngineSubtitle',
      descriptionKey: 'analyticsEngineDesc',
      detailKeys: ['analyticsFeature1', 'analyticsFeature2', 'analyticsFeature3', 'analyticsFeature4'],
      color: 'navy',
      badgeKey: 'analyticsEngineBadge'
    },
    {
      icon: <FaClock />,
      titleKey: 'realTimeProcessingTitle',
      subtitleKey: 'realTimeProcessingSubtitle',
      descriptionKey: 'realTimeProcessingDesc',
      detailKeys: ['processingFeature1', 'processingFeature2', 'processingFeature3', 'processingFeature4'],
      color: 'green',
      badgeKey: 'realTimeProcessingBadge'
    }
  ];

  return (
    <section className="modern-features-section">
      <Container>
        <Row className="mb-5">
          <Col lg={10} className="mx-auto text-center">
            <div className="features-header">
              <Badge className="section-badge mb-3">{t('featuresSectionBadge')}</Badge>
              <h2 className="features-main-title">
                {t('featuresMainTitle')}
                <span className="title-highlight"> {t('advancedTechnology') || 'Advanced Technology'}</span>
              </h2>
              <p className="features-subtitle">
                {t('featuresSubtitle')}
              </p>
            </div>
          </Col>
        </Row>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className={`modern-feature-card feature-${feature.color} h-100`}>
                <div className="card-accent-top"></div>
                
                <Card.Body className="modern-card-body">
                  <div className="feature-header-section">
                    <div className={`modern-icon-container icon-${feature.color}`}>
                      {feature.icon}
                    </div>
                    <Badge className={`feature-badge badge-${feature.color}`}>
                      {t(feature.badgeKey)}
                    </Badge>
                  </div>
                  
                  <div className="feature-content-section">
                    <Card.Title className="modern-feature-title">
                      {t(feature.titleKey)}
                    </Card.Title>
                    <p className="feature-subtitle">{t(feature.subtitleKey)}</p>
                    <Card.Text className="feature-description">
                      {t(feature.descriptionKey)}
                    </Card.Text>
                  </div>
                  
                  <div className="feature-details-section">
                    <ul className="feature-details-list">
                      {feature.detailKeys.map((detailKey, idx) => (
                        <li key={idx} className="feature-detail-item">
                          <span className="detail-bullet"></span>
                          {t(detailKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
                
                <div className="card-accent-bottom"></div>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row className="mt-5">
          <Col className="text-center">
            <div className="features-footer">
              <p className="footer-text">
                {t('featuresFooterText')}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeatureCards;
