import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  quality = 85,
  placeholder,
  sizes,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading, priority]);

  // Generate WebP and fallback sources
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.startsWith('http')) {
      // For external images, just return as is
      return baseSrc;
    }
    
    // For internal images, generate different sizes
    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imgProps = {
    ref: imgRef,
    alt,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    ...(width && { width }),
    ...(height && { height }),
    ...(sizes && { sizes })
  };

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Placeholder */}
      {!isLoaded && placeholder && (
        <div
          className={`absolute inset-0 bg-gray-200 ${className}`}
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !placeholder && (
        <div 
          className={`${className} bg-gray-200 animate-pulse`}
          style={{ width, height }}
        />
      )}

      {/* Main image */}
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          {src.startsWith('http') && (
            <source
              srcSet={src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
              type="image/webp"
              sizes={sizes}
            />
          )}
          
          {/* Fallback source */}
          <img
            {...imgProps}
            src={src}
            srcSet={generateSrcSet(src)}
          />
        </picture>
      )}

      {/* Preload hint for priority images */}
      {priority && (
        <>
          <link rel="preload" as="image" href={src} />
          {src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') ? (
            <link 
              rel="preload" 
              as="image" 
              href={src.replace(/\.(jpg|jpeg|png)$/i, '.webp')} 
              type="image/webp" 
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default OptimizedImage;