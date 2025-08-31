import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navbar
    home: 'Home',
    analysis: 'Analysis',
    aiAssistant: 'AI Assistant',
    login: 'Login',
    signup: 'Sign Up',
    profile: 'Profile',
    settings: 'Settings',
    reports: 'Reports',
    logout: 'Logout',
    welcome: 'Welcome',
    
    // Hero Section
    tagline: 'Your Voice, Government\'s Choice',
    heroTitle: 'Transform Government Decision-Making',
    heroSubtitle: 'Empowering democratic governance through advanced analytics and citizen-centric policy development',
    getStarted: 'Get Started Free',
    startAnalysis: 'Start Analysis',
    tryAI: 'Try AI Assistant',
    signIn: 'Sign In',
    
    // Features
    dataDrivenPolicies: 'Data-Driven Policies',
    enhancedTransparency: 'Enhanced Transparency',
    advancedAnalytics: 'Advanced Analytics',
    citizenEngagement: 'Citizen Engagement',
    
    // Stats
    ministriesConnected: 'Ministries Connected',
    citizenResponses: 'Citizen Responses',
    policiesAnalyzed: 'Policies Analyzed',
    decisionAccuracy: 'Decision Accuracy',
    statesCovered: 'States Covered',
    languagesSupported: 'Languages Supported',
    
    // Government Impact
    governmentImpact: 'Government Impact',
    realtimeMetrics: 'Real-time platform metrics',
    viewAnalytics: 'View Detailed Analytics',
    
    // Trust
    certifiedBy: 'Certified by Government of India',
    secure: 'ISO 27001 Secure',
    digitalIndia: 'Digital India Initiative',
    
    // FeatureCards Section
    featuresSectionBadge: 'Digital India Innovation',
    featuresMainTitle: 'Transforming Governance Through Advanced Technology',
    featuresSubtitle: 'Empowering democratic institutions with cutting-edge AI solutions designed specifically for Indian governance challenges and citizen engagement at scale.',
    featuresFooterText: 'Built for India, By Indians - Designed with deep understanding of Indian governance structures, languages, and cultural nuances.',
    
    // Feature Cards Individual
    sentimentAnalysisTitle: 'AI-Powered Sentiment Analysis',
    sentimentAnalysisSubtitle: 'Emotion Intelligence at Scale',
    sentimentAnalysisDesc: 'Transform raw citizen feedback into actionable insights with our state-of-the-art Natural Language Processing engine. Our advanced AI models analyze emotional context, detect sentiment nuances, and provide granular analysis across multiple languages and cultural contexts.',
    sentimentAnalysisBadge: 'AI-Powered',
    
    documentSummarizationTitle: 'Intelligent Document Summarization',
    documentSummarizationSubtitle: 'From Complexity to Clarity',
    documentSummarizationDesc: 'Convert lengthy consultation documents, policy papers, and stakeholder responses into digestible, accurate summaries. Our extractive and abstractive summarization techniques ensure no critical information is lost while making content accessible to all stakeholders.',
    documentSummarizationBadge: 'Smart AI',
    
    dataVisualizationTitle: 'Dynamic Data Visualization',
    dataVisualizationSubtitle: 'Insights Made Visual',
    dataVisualizationDesc: 'Create compelling visual narratives from complex datasets through interactive word clouds, sentiment heat maps, and trend visualizations. Our dynamic charts adapt in real-time, revealing patterns and insights that traditional reports often miss.',
    dataVisualizationBadge: 'Visual AI',
    
    policyAssistantTitle: 'Conversational Policy Assistant',
    policyAssistantSubtitle: 'Your 24/7 Governance Companion',
    policyAssistantDesc: 'Meet your intelligent policy assistant that understands government processes, legal frameworks, and citizen queries. Trained on comprehensive policy databases and updated continuously, it provides instant, accurate responses to complex governance questions.',
    policyAssistantBadge: 'Conversational',
    
    analyticsEngineTitle: 'Advanced Analytics Engine',
    analyticsEngineSubtitle: 'Data-Driven Decision Making',
    analyticsEngineDesc: 'Unlock the power of comprehensive analytics with demographic breakdowns, trend forecasting, and predictive modeling. Our analytics engine provides deep insights into citizen behavior, policy impact, and consultation effectiveness.',
    analyticsEngineBadge: 'Analytics',
    
    realTimeProcessingTitle: 'Real-Time Processing Pipeline',
    realTimeProcessingSubtitle: 'Speed Meets Accuracy',
    realTimeProcessingDesc: 'Process massive volumes of citizen feedback instantaneously with our high-performance computing infrastructure. Built for scale, our system handles peak consultation periods while maintaining accuracy and providing immediate insights.',
    realTimeProcessingBadge: 'Real-Time',
    
    // Feature Details
    sentimentFeature1: '95%+ accuracy across 22+ Indian languages',
    sentimentFeature2: 'Real-time emotion detection and classification',
    sentimentFeature3: 'Cultural context understanding for Indian demographics',
    sentimentFeature4: 'Bias detection and fairness monitoring',
    
    documentFeature1: 'Multi-document synthesis and cross-referencing',
    documentFeature2: 'Key point extraction with relevance scoring',
    documentFeature3: 'Executive summary generation in multiple formats',
    documentFeature4: 'Automated citation and source attribution',
    
    visualizationFeature1: 'Interactive word clouds with semantic grouping',
    visualizationFeature2: 'Geographic sentiment mapping across constituencies',
    visualizationFeature3: 'Temporal trend analysis with predictive modeling',
    visualizationFeature4: 'Customizable dashboards for different stakeholder groups',
    
    assistantFeature1: 'Trained on Indian Constitution and legal frameworks',
    assistantFeature2: 'Multi-modal support: text, voice, and document queries',
    assistantFeature3: 'Integration with government knowledge bases',
    assistantFeature4: 'Contextual understanding of policy implications',
    
    analyticsFeature1: 'Demographic segmentation and analysis',
    analyticsFeature2: 'Predictive policy impact modeling',
    analyticsFeature3: 'Cross-consultation comparative analysis',
    analyticsFeature4: 'ROI measurement for public engagement initiatives',
    
    processingFeature1: 'Sub-second processing for up to 100K+ comments',
    processingFeature2: 'Auto-scaling infrastructure for peak loads',
    processingFeature3: 'Real-time dashboard updates and notifications',
    processingFeature4: 'Guaranteed 99.9% uptime with redundancy',
    
    // Footer Section
    footerDescription: 'Transforming public consultation through AI-powered analytics, enabling evidence-based policy making and enhanced citizen engagement for better democratic governance.',
    certificationsCompliance: 'Certifications & Compliance:',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    contactInformation: 'Contact Information',
    supportTitle: '24/7 Government Support',
    callSupport: 'Call Support',
    emailUs: 'Email Us',
    
    // Quick Links
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    dataSecurity: 'Data Security',
    accessibility: 'Accessibility',
    helpCenter: 'Help Center',
    apiDocumentation: 'API Documentation',
    
    // Certifications
    iso27001: 'ISO 27001:2013',
    informationSecurity: 'Information Security',
    stqcCertified: 'STQC Certified',
    softwareTesting: 'Software Testing',
    digitalIndiaReady: 'Digital India Ready',
    governmentCompliance: 'Government Compliance',
    certInApproved: 'CERT-In Approved',
    cybersecurity: 'Cybersecurity',
    
    // Government Agencies
    ministryOfCorporateAffairs: 'Ministry of Corporate Affairs',
    digitalIndiaCorporation: 'Digital India Corporation',
    nationalInformaticsCentre: 'National Informatics Centre',
    departmentOfAdministrativeReforms: 'Department of Administrative Reforms',
    
    // Footer Bottom
    allRightsReserved: 'Government of India. All rights reserved.',
    developedBy: 'Developed by REGULARIZERS λEGION',
    securePlatform: 'Secure Platform',
    governmentVerified: 'Government Verified',
    
    // Contact Details
    addressLine: 'Shastri Bhawan, New Delhi - 110001',
    phoneNumber: '+91-11-2338-4659',
    emailAddress: 'support@gcap.gov.in',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close'
  },
  hi: {
    // Navbar
    home: 'गृह | Home',
    analysis: 'विश्लेषण | Analysis',
    aiAssistant: 'AI सहायक | Assistant',
    login: 'प्रवेश | Login',
    signup: 'पंजीकरण | Sign Up',
    profile: 'प्रोफ़ाइल | Profile',
    settings: 'सेटिंग्स | Settings',
    reports: 'रिपोर्ट्स | Reports',
    logout: 'लॉगआउट | Logout',
    welcome: 'नमस्ते',
    
    // Hero Section
    tagline: 'आपकी आवाज़, सरकार की पसंद',
    heroTitle: 'सरकारी निर्णय लेने में रूपांतरण',
    heroSubtitle: 'उन्नत एनालिटिक्स और नागरिक-केंद्रित नीति विकास के माध्यम से लोकतांत्रिक शासन को सशक्त बनाना',
    getStarted: 'निःशुल्क शुरू करें',
    startAnalysis: 'विश्लेषण शुरू करें',
    tryAI: 'AI सहायक आज़माएं',
    signIn: 'साइन इन करें',
    
    // Features
    dataDrivenPolicies: 'डेटा-संचालित नीतियां',
    enhancedTransparency: 'बढ़ी हुई पारदर्शिता',
    advancedAnalytics: 'उन्नत एनालिटिक्स',
    citizenEngagement: 'नागरिक सहभागिता',
    
    // Stats
    ministriesConnected: 'मंत्रालय जुड़े',
    citizenResponses: 'नागरिक प्रतिक्रियाएं',
    policiesAnalyzed: 'नीतियां विश्लेषित',
    decisionAccuracy: 'निर्णय सटीकता',
    statesCovered: 'राज्य शामिल',
    languagesSupported: 'भाषाएं समर्थित',
    
    // Government Impact
    governmentImpact: 'सरकारी प्रभाव',
    realtimeMetrics: 'वास्तविक समय प्लेटफॉर्म मेट्रिक्स',
    viewAnalytics: 'विस्तृत विश्लेषण देखें',
    
    // Trust
    certifiedBy: 'भारत सरकार द्वारा प्रमाणित',
    secure: 'ISO 27001 सुरक्षित',
    digitalIndia: 'डिजिटल इंडिया पहल',
    
    // FeatureCards Section
    featuresSectionBadge: 'डिजिटल इंडिया नवाचार',
    featuresMainTitle: 'उन्नत प्रौद्योगिकी के माध्यम से शासन में रूपांतरण',
    featuresSubtitle: 'भारतीय शासन चुनौतियों और नागरिक सहभागिता के लिए विशेष रूप से डिज़ाइन किए गए अत्याधुनिक AI समाधानों के साथ लोकतांत्रिक संस्थानों को सशक्त बनाना।',
    featuresFooterText: 'भारत के लिए, भारतीयों द्वारा निर्मित - भारतीय शासन संरचनाओं, भाषाओं और सांस्कृतिक बारीकियों की गहरी समझ के साथ डिज़ाइन किया गया।',
    
    // Feature Cards Individual
    sentimentAnalysisTitle: 'AI-संचालित भावना विश्लेषण',
    sentimentAnalysisSubtitle: 'बड़े पैमाने पर भावनात्मक बुद्धि',
    sentimentAnalysisDesc: 'हमारे अत्याधुनिक प्राकृतिक भाषा प्रसंस्करण इंजन के साथ कच्ची नागरिक फीडबैक को कार्यशील अंतर्दृष्टि में रूपांतरित करें। हमारे उन्नत AI मॉडल भावनात्मक संदर्भ का विश्लेषण करते हैं, भावना की बारीकियों का पता लगाते हैं।',
    sentimentAnalysisBadge: 'AI-संचालित',
    
    documentSummarizationTitle: 'बुद्धिमान दस्तावेज़ सारांशीकरण',
    documentSummarizationSubtitle: 'जटिलता से स्पष्टता तक',
    documentSummarizationDesc: 'लंबे परामर्श दस्तावेज़ों, नीति पत्रों और हितधारक प्रतिक्रियाओं को पचने योग्य, सटीक सारांश में परिवर्तित करें। हमारी निष्कर्षण और सार तकनीकें सुनिश्चित करती हैं कि कोई महत्वपूर्ण जानकारी न खोए।',
    documentSummarizationBadge: 'स्मार्ट AI',
    
    dataVisualizationTitle: 'गतिशील डेटा विज़ुअलाइज़ेशन',
    dataVisualizationSubtitle: 'अंतर्दृष्टि को दृश्य बनाना',
    dataVisualizationDesc: 'इंटरैक्टिव वर्ड क्लाउड, भावना हीट मैप्स और ट्रेंड विज़ुअलाइज़ेशन के माध्यम से जटिल डेटासेट से आकर्षक दृश्य कहानियां बनाएं। हमारे गतिशील चार्ट वास्तविक समय में अनुकूलित होते हैं।',
    dataVisualizationBadge: 'विज़ुअल AI',
    
    policyAssistantTitle: 'संवादात्मक नीति सहायक',
    policyAssistantSubtitle: 'आपका 24/7 शासन साथी',
    policyAssistantDesc: 'अपने बुद्धिमान नीति सहायक से मिलें जो सरकारी प्रक्रियाओं, कानूनी ढांचे और नागरिक प्रश्नों को समझता है। व्यापक नीति डेटाबेस पर प्रशिक्षित और निरंतर अपडेट किया जाता है।',
    policyAssistantBadge: 'संवादात्मक',
    
    analyticsEngineTitle: 'उन्नत एनालिटिक्स इंजन',
    analyticsEngineSubtitle: 'डेटा-संचालित निर्णय लेना',
    analyticsEngineDesc: 'जनसांख्यिकीय विभाजन, ट्रेंड पूर्वानुमान और भविष्यवाणी मॉडलिंग के साथ व्यापक एनालिटिक्स की शक्ति को अनलॉक करें। हमारा एनालिटिक्स इंजन नागरिक व्यवहार में गहरी अंतर्दृष्टि प्रदान करता है।',
    analyticsEngineBadge: 'एनालिटिक्स',
    
    realTimeProcessingTitle: 'वास्तविक-समय प्रसंस्करण पाइपलाइन',
    realTimeProcessingSubtitle: 'गति मिलती है सटीकता से',
    realTimeProcessingDesc: 'हमारे उच्च-प्रदर्शन कंप्यूटिंग इंफ्रास्ट्रक्चर के साथ नागरिक फीडबैक के बड़े आयामों को तुरंत प्रोसेस करें। पैमाने के लिए निर्मित, हमारा सिस्टम चरम परामर्श अवधि को संभालता है।',
    realTimeProcessingBadge: 'वास्तविक-समय',
    
    // Feature Details
    sentimentFeature1: '22+ भारतीय भाषाओं में 95%+ सटीकता',
    sentimentFeature2: 'वास्तविक समय भावना का पता लगाना और वर्गीकरण',
    sentimentFeature3: 'भारतीय जनसांख्यिकी के लिए सांस्कृतिक संदर्भ समझ',
    sentimentFeature4: 'पूर्वाग्रह का पता लगाना और निष्पक्षता निगरानी',
    
    documentFeature1: 'बहु-दस्तावेज़ संश्लेषण और क्रॉस-रेफरेंसिंग',
    documentFeature2: 'प्रासंगिकता स्कोरिंग के साथ मुख्य बिंदु निष्कर्षण',
    documentFeature3: 'कई प्रारूपों में कार्यकारी सारांश उत्पादन',
    documentFeature4: 'स्वचालित उद्धरण और स्रोत आरोपण',
    
    visualizationFeature1: 'शब्दार्थ समूहीकरण के साथ इंटरैक्टिव वर्ड क्लाउड',
    visualizationFeature2: 'निर्वाचन क्षेत्रों में भौगोलिक भावना मानचित्रण',
    visualizationFeature3: 'भविष्यवाणी मॉडलिंग के साथ अस्थायी प्रवृत्ति विश्लेषण',
    visualizationFeature4: 'विभिन्न हितधारक समूहों के लिए अनुकूलन योग्य डैशबोर्ड',
    
    assistantFeature1: 'भारतीय संविधान और कानूनी ढांचे पर प्रशिक्षित',
    assistantFeature2: 'मल्टी-मोडल समर्थन: टेक्स्ट, आवाज़ और दस्तावेज़ प्रश्न',
    assistantFeature3: 'सरकारी ज्ञान डेटाबेस के साथ एकीकरण',
    assistantFeature4: 'नीति प्रभावों की प्रासंगिक समझ',
    
    analyticsFeature1: 'जनसांख्यिकीय विभाजन और विश्लेषण',
    analyticsFeature2: 'भविष्यवाणी नीति प्रभाव मॉडलिंग',
    analyticsFeature3: 'क्रॉस-परामर्श तुलनात्मक विश्लेषण',
    analyticsFeature4: 'सार्वजनिक सहभागिता पहलों के लिए ROI माप',
    
    processingFeature1: '100K+ टिप्पणियों के लिए सब-सेकंड प्रसंस्करण',
    processingFeature2: 'चरम भार के लिए ऑटो-स्केलिंग अवसंरचना',
    processingFeature3: 'वास्तविक समय डैशबोर्ड अपडेट और सूचनाएं',
    processingFeature4: 'रिडंडेंसी के साथ गारंटीशुदा 99.9% अपटाइम',
    
    // Footer Section
    footerDescription: 'AI-संचालित विश्लेषण के माध्यम से सार्वजनिक परामर्श में रूपांतरण, साक्ष्य-आधारित नीति निर्माण और बेहतर लोकतांत्रिक शासन के लिए नागरिक सहभागिता को सक्षम बनाना।',
    certificationsCompliance: 'प्रमाणन और अनुपालन:',
    quickLinks: 'त्वरित लिंक',
    legal: 'कानूनी',
    contactInformation: 'संपर्क जानकारी',
    supportTitle: '24/7 सरकारी समर्थन',
    callSupport: 'समर्थन कॉल करें',
    emailUs: 'हमें ईमेल करें',
    
    // Quick Links
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    dataSecurity: 'डेटा सुरक्षा',
    accessibility: 'पहुंच',
    helpCenter: 'सहायता केंद्र',
    apiDocumentation: 'API दस्तावेज़',
    
    // Certifications
    iso27001: 'ISO 27001:2013',
    informationSecurity: 'सूचना सुरक्षा',
    stqcCertified: 'STQC प्रमाणित',
    softwareTesting: 'सॉफ्टवेयर परीक्षण',
    digitalIndiaReady: 'डिजिटल इंडिया तैयार',
    governmentCompliance: 'सरकारी अनुपालन',
    certInApproved: 'CERT-In अनुमोदित',
    cybersecurity: 'साइबर सुरक्षा',
    
    // Government Agencies
    ministryOfCorporateAffairs: 'कॉर्पोरेट मामलों का मंत्रालय',
    digitalIndiaCorporation: 'डिजिटल इंडिया निगम',
    nationalInformaticsCentre: 'राष्ट्रीय सूचना विज्ञान केंद्र',
    departmentOfAdministrativeReforms: 'प्रशासनिक सुधार विभाग',
    
    // Footer Bottom
    allRightsReserved: 'भारत सरकार। सभी अधिकार सुरक्षित।',
    developedBy: 'REGULARIZERS λEGION द्वारा विकसित',
    securePlatform: 'सुरक्षित प्लेटफॉर्म',
    governmentVerified: 'सरकार सत्यापित',
    
    // Contact Details
    addressLine: 'शास्त्री भवन, नई दिल्ली - 110001',
    phoneNumber: '+91-11-2338-4659',
    emailAddress: 'support@gcap.gov.in',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    close: 'बंद करें'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('gcap-language');
    if (savedLanguage && ['en', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (['en', 'hi'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('gcap-language', lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isHindi: language === 'hi'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
