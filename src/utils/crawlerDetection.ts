/**
 * Определяет, является ли запрос от поискового краулера
 */
export function isCrawler(userAgent: string | undefined): boolean {
  if (!userAgent) return false;

  const crawlerPatterns = [
    // Google
    /googlebot/i,
    /google-inspectiontool/i,
    /mediapartners-google/i,
    /adsbot-google/i,
    
    // Yandex
    /yandex/i,
    /yandexbot/i,
    /yandexmobilebot/i,
    /yandeximages/i,
    /yandexvideo/i,
    /yandexmedia/i,
    /yandexblogs/i,
    /yandexfavicons/i,
    /yandexwebmaster/i,
    /yandexdirect/i,
    /yandexmetrika/i,
    /yandexnews/i,
    /yandexadnet/i,
    /yandexdirectory/i,
    /yandexmobileapp/i,
    
    // Bing
    /bingbot/i,
    /msnbot/i,
    /adidxbot/i,
    
    // Other search engines
    /baiduspider/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i, // Alexa
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /applebot/i,
    /petalbot/i, // Huawei
  ];

  return crawlerPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Получает User-Agent из заголовков запроса
 */
export function getUserAgent(headers: Record<string, string | string[] | undefined>): string | undefined {
  const ua = headers['user-agent'] || headers['User-Agent'];
  if (Array.isArray(ua)) {
    return ua[0];
  }
  return ua;
}


