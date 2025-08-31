export const APP_CONFIG = {
  APP_NAME: 'GCAP',
  FULL_NAME: 'Government Consultation Analytics Platform',
  TAGLINE: 'Your Voice, Government\'s Choice',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '/api',
  SUPPORTED_FILE_TYPES: ['.json', '.csv', '.xlsx'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ANALYSIS: '/analysis',
  CHAT_BOT: '/chat-bot',
};

export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

export const SENTIMENT_COLORS = {
  [SENTIMENT_TYPES.POSITIVE]: '#16a34a',
  [SENTIMENT_TYPES.NEGATIVE]: '#dc2626',
  [SENTIMENT_TYPES.NEUTRAL]: '#ea580c',
};

export const GOVERNMENT_STATS = {
  MINISTRIES_CONNECTED: '25+',
  CITIZEN_RESPONSES: '2.5M+',
  POLICIES_ANALYZED: '500+',
  DECISION_ACCURACY: '96%',
  STATES_COVERED: '28',
  LANGUAGES_SUPPORTED: '22'
};

export const MESSAGES = {
  LOGIN_SUCCESS: 'स्वागत है! Welcome back to GCAP.',
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  SIGNUP_SUCCESS: 'Registration successful! Welcome to digital governance.',
  SIGNUP_ERROR: 'Registration failed. Please try again.',
  FILE_UPLOAD_SUCCESS: 'File uploaded successfully!',
  FILE_UPLOAD_ERROR: 'File upload failed. Please try again.',
  ANALYSIS_COMPLETE: 'Analysis completed successfully!',
  ANALYSIS_ERROR: 'Analysis failed. Please try again.',
};
