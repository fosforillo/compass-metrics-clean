// Configuración centralizada para todas las APIs de redes sociales y publicidad

// Meta (Facebook/Instagram) API Configuration
export const META_CONFIG = {
  APP_ID: import.meta.env.VITE_META_APP_ID || '',
  APP_SECRET: import.meta.env.VITE_META_APP_SECRET || '',
  ACCESS_TOKEN: import.meta.env.VITE_META_ACCESS_TOKEN || '',
  API_VERSION: 'v18.0',
  BASE_URL: 'https://graph.facebook.com',
  SCOPES: [
    'ads_management',
    'ads_read',
    'business_management',
    'pages_read_engagement',
    'pages_show_list',
    'instagram_basic',
    'instagram_manage_insights'
  ]
};

// Google Ads API Configuration
export const GOOGLE_ADS_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  DEVELOPER_TOKEN: import.meta.env.VITE_GOOGLE_ADS_DEVELOPER_TOKEN || '',
  CUSTOMER_ID: import.meta.env.VITE_GOOGLE_ADS_CUSTOMER_ID || '',
  API_VERSION: 'v14',
  BASE_URL: 'https://googleads.googleapis.com',
  SCOPES: [
    'https://www.googleapis.com/auth/adwords'
  ]
};

// TikTok Ads API Configuration
export const TIKTOK_CONFIG = {
  APP_ID: import.meta.env.VITE_TIKTOK_APP_ID || '',
  SECRET: import.meta.env.VITE_TIKTOK_SECRET || '',
  ACCESS_TOKEN: import.meta.env.VITE_TIKTOK_ACCESS_TOKEN || '',
  API_VERSION: 'v1.3',
  BASE_URL: 'https://business-api.tiktok.com',
  SCOPES: [
    'advertisement.read',
    'advertisement.write',
    'campaign.read',
    'campaign.write'
  ]
};

// LinkedIn Ads API Configuration
export const LINKEDIN_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
  ACCESS_TOKEN: import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN || '',
  API_VERSION: 'v2',
  BASE_URL: 'https://api.linkedin.com',
  SCOPES: [
    'r_ads',
    'r_ads_reporting',
    'rw_ads'
  ]
};

// Twitter Ads API Configuration
export const TWITTER_CONFIG = {
  API_KEY: import.meta.env.VITE_TWITTER_API_KEY || '',
  API_SECRET: import.meta.env.VITE_TWITTER_API_SECRET || '',
  ACCESS_TOKEN: import.meta.env.VITE_TWITTER_ACCESS_TOKEN || '',
  ACCESS_TOKEN_SECRET: import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET || '',
  API_VERSION: '12',
  BASE_URL: 'https://ads-api.twitter.com',
  SCOPES: [
    'ads.read',
    'ads.write'
  ]
};

// Verificar configuración de APIs
export const checkApiConfiguration = () => {
  const configs = {
    meta: {
      configured: !!(META_CONFIG.APP_ID && META_CONFIG.ACCESS_TOKEN),
      missing: []
    },
    google: {
      configured: !!(GOOGLE_ADS_CONFIG.CLIENT_ID && GOOGLE_ADS_CONFIG.DEVELOPER_TOKEN),
      missing: []
    },
    tiktok: {
      configured: !!(TIKTOK_CONFIG.APP_ID && TIKTOK_CONFIG.ACCESS_TOKEN),
      missing: []
    },
    linkedin: {
      configured: !!(LINKEDIN_CONFIG.CLIENT_ID && LINKEDIN_CONFIG.ACCESS_TOKEN),
      missing: []
    },
    twitter: {
      configured: !!(TWITTER_CONFIG.API_KEY && TWITTER_CONFIG.ACCESS_TOKEN),
      missing: []
    }
  };

  // Identificar variables faltantes
  if (!META_CONFIG.APP_ID) configs.meta.missing.push('VITE_META_APP_ID');
  if (!META_CONFIG.ACCESS_TOKEN) configs.meta.missing.push('VITE_META_ACCESS_TOKEN');
  
  if (!GOOGLE_ADS_CONFIG.CLIENT_ID) configs.google.missing.push('VITE_GOOGLE_CLIENT_ID');
  if (!GOOGLE_ADS_CONFIG.DEVELOPER_TOKEN) configs.google.missing.push('VITE_GOOGLE_ADS_DEVELOPER_TOKEN');
  
  if (!TIKTOK_CONFIG.APP_ID) configs.tiktok.missing.push('VITE_TIKTOK_APP_ID');
  if (!TIKTOK_CONFIG.ACCESS_TOKEN) configs.tiktok.missing.push('VITE_TIKTOK_ACCESS_TOKEN');
  
  if (!LINKEDIN_CONFIG.CLIENT_ID) configs.linkedin.missing.push('VITE_LINKEDIN_CLIENT_ID');
  if (!LINKEDIN_CONFIG.ACCESS_TOKEN) configs.linkedin.missing.push('VITE_LINKEDIN_ACCESS_TOKEN');
  
  if (!TWITTER_CONFIG.API_KEY) configs.twitter.missing.push('VITE_TWITTER_API_KEY');
  if (!TWITTER_CONFIG.ACCESS_TOKEN) configs.twitter.missing.push('VITE_TWITTER_ACCESS_TOKEN');

  return configs;
};

// Funciones de utilidad para cada API
export class MetaAPI {
  static async getAccountInfo(accessToken: string) {
    try {
      const response = await fetch(
        `${META_CONFIG.BASE_URL}/${META_CONFIG.API_VERSION}/me/adaccounts?access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Meta API Error:', error);
      throw error;
    }
  }

  static async getCampaigns(accountId: string, accessToken: string) {
    try {
      const response = await fetch(
        `${META_CONFIG.BASE_URL}/${META_CONFIG.API_VERSION}/${accountId}/campaigns?fields=id,name,status,objective&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Meta Campaigns API Error:', error);
      throw error;
    }
  }

  static async getInsights(accountId: string, accessToken: string, dateRange: string = 'last_30_days') {
    try {
      const response = await fetch(
        `${META_CONFIG.BASE_URL}/${META_CONFIG.API_VERSION}/${accountId}/insights?fields=spend,impressions,clicks,ctr,cpm,cpp&date_preset=${dateRange}&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Meta Insights API Error:', error);
      throw error;
    }
  }
}

export class GoogleAdsAPI {
  static async getCustomers(accessToken: string) {
    try {
      const response = await fetch(
        `${GOOGLE_ADS_CONFIG.BASE_URL}/${GOOGLE_ADS_CONFIG.API_VERSION}/customers:listAccessibleCustomers`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': GOOGLE_ADS_CONFIG.DEVELOPER_TOKEN
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Google Ads API Error:', error);
      throw error;
    }
  }

  static async getCampaigns(customerId: string, accessToken: string) {
    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type
        FROM campaign
        WHERE campaign.status != 'REMOVED'
      `;

      const response = await fetch(
        `${GOOGLE_ADS_CONFIG.BASE_URL}/${GOOGLE_ADS_CONFIG.API_VERSION}/customers/${customerId}/googleAds:search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': GOOGLE_ADS_CONFIG.DEVELOPER_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Google Ads Campaigns API Error:', error);
      throw error;
    }
  }
}

export class TikTokAPI {
  static async getAdvertisers(accessToken: string) {
    try {
      const response = await fetch(
        `${TIKTOK_CONFIG.BASE_URL}/${TIKTOK_CONFIG.API_VERSION}/advertiser/get/`,
        {
          headers: {
            'Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('TikTok API Error:', error);
      throw error;
    }
  }

  static async getCampaigns(advertiserId: string, accessToken: string) {
    try {
      const response = await fetch(
        `${TIKTOK_CONFIG.BASE_URL}/${TIKTOK_CONFIG.API_VERSION}/campaign/get/`,
        {
          method: 'GET',
          headers: {
            'Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('TikTok Campaigns API Error:', error);
      throw error;
    }
  }
}

export class LinkedInAPI {
  static async getAdAccounts(accessToken: string) {
    try {
      const response = await fetch(
        `${LINKEDIN_CONFIG.BASE_URL}/${LINKEDIN_CONFIG.API_VERSION}/adAccountsV2`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      throw error;
    }
  }

  static async getCampaigns(accountId: string, accessToken: string) {
    try {
      const response = await fetch(
        `${LINKEDIN_CONFIG.BASE_URL}/${LINKEDIN_CONFIG.API_VERSION}/campaigns?q=search&search.account.values[0]=urn:li:sponsoredAccount:${accountId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('LinkedIn Campaigns API Error:', error);
      throw error;
    }
  }
}

// Función para inicializar todas las APIs
export const initializeAPIs = () => {
  const status = checkApiConfiguration();
  
  if (import.meta.env.DEV) {
    console.log('Social Media APIs Configuration Status:', status);
  }
  
  return status;
};