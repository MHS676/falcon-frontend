import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

const sendToAnalytics = (metric: WebVitalsMetric) => {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta
      }
    });
  }

  // Send to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        url: window.location.pathname,
        timestamp: Date.now()
      })
    }).catch(() => {
      // Fail silently
    });
  }
};

export const useWebVitals = () => {
  useEffect(() => {
    // Dynamic import of web-vitals library
    const loadWebVitals = async () => {
      try {
        const webVitals = await import('web-vitals');
        const handleMetric = (metric: any) => {
          const webVitalMetric: WebVitalsMetric = {
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            rating: getRating(metric.name, metric.value)
          };
          sendToAnalytics(webVitalMetric);
        };

        webVitals.onCLS(handleMetric);
        webVitals.onFCP(handleMetric);
        webVitals.onLCP(handleMetric);
        webVitals.onTTFB(handleMetric);
      } catch (error) {
        // web-vitals library not available
        console.warn('Web vitals not available');
      }
    };
    
    loadWebVitals();
  }, []);
};

// Performance monitoring utilities
export const measureResourceTiming = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        
        // Log slow resources
        if (resource.duration > 1000) {
          console.warn('Slow resource detected:', {
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: resource.initiatorType
          });
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });

  // Cleanup after 30 seconds
  setTimeout(() => {
    observer.disconnect();
  }, 30000);
};

export const measureNavigationTiming = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.fetchStart
        };

        console.log('Navigation Timing:', metrics);

        // Send to analytics
        if ((window as any).gtag) {
          Object.entries(metrics).forEach(([key, value]) => {
            (window as any).gtag('event', 'timing_complete', {
              name: key,
              value: Math.round(value)
            });
          });
        }
      }
    }, 0);
  });
};

// Image loading optimization
export const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return;

  // Preload critical images
  const preloadCriticalImages = () => {
    const criticalImages = [
      '/images/hero-banner.jpg',
      '/images/falcon-security-logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  };

  // Lazy load non-critical images
  const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };

  preloadCriticalImages();
  lazyLoadImages();
};

// Font loading optimization
export const optimizeFontLoading = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const preloadFonts = () => {
    const criticalFonts = [
      '/fonts/inter-regular.woff2',
      '/fonts/inter-semibold.woff2'
    ];

    criticalFonts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = src;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  preloadFonts();
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
};

export default useWebVitals;