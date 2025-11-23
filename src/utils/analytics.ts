// Analytics tracking function
export const track = (eventName: string, properties?: Record<string, any>) => {
  // In production, this would send events to analytics service
  // For now, we'll log to console and could integrate with Google Analytics, Yandex.Metrica, etc.
  const isDev = (import.meta as { env?: { MODE?: string } }).env?.MODE === 'development';
  if (isDev) {
    console.log('[Analytics]', eventName, properties);
  }
  
  // Example integration with analytics service:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }
};

