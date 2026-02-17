'use client';

import { CldImage } from 'next-cloudinary';
import { useState, useEffect, useRef } from 'react';

export default function CloudinaryGallery({ ids }: { ids: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const close = () => {
    // Go back in history to remove the lightbox state
    if (window.history.state?.lightbox) {
      window.history.back();
    }
    setIndex(null);
    setIsImageLoaded(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const prev = () => {
    setIndex((i) => (i === null ? null : (i + ids.length - 1) % ids.length));
    setIsImageLoaded(false);
    resetZoom();
  };
  const next = () => {
    setIndex((i) => (i === null ? null : (i + 1) % ids.length));
    setIsImageLoaded(false);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Distribute images across columns for balanced layout
  const getColumnImages = () => {
    const cols = typeof window !== 'undefined' 
      ? window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2
      : 4;
    const columns: string[][] = Array.from({ length: cols }, () => []);
    ids.forEach((id, i) => {
      columns[i % cols].push(id);
    });
    return columns;
  };

  const [columns, setColumns] = useState<string[][]>([]);

  useEffect(() => {
    setColumns(getColumnImages());
    const handleResize = () => setColumns(getColumnImages());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ids]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (index !== null && !e.state?.lightbox) {
        setIndex(null);
        setIsImageLoaded(false);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [index]);

  // Push history state when lightbox opens
  useEffect(() => {
    if (index !== null && !window.history.state?.lightbox) {
      window.history.pushState({ lightbox: true }, '');
    }
  }, [index]);

  // Touch handlers for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging.current = true;
      lastTouchCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      if (newDistance && lastTouchDistance.current) {
        const delta = newDistance / lastTouchDistance.current;
        setScale((s) => Math.min(Math.max(s * delta, 1), 4));
        lastTouchDistance.current = newDistance;
      }
    } else if (e.touches.length === 1 && isDragging.current && scale > 1) {
      const touch = e.touches[0];
      if (lastTouchCenter.current) {
        const dx = touch.clientX - lastTouchCenter.current.x;
        const dy = touch.clientY - lastTouchCenter.current.y;
        setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
        lastTouchCenter.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
    isDragging.current = false;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
            {col.map((publicId) => {
              const i = ids.indexOf(publicId);
              return (
                <button
                  key={publicId}
                  className="relative w-full overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
                  onClick={() => setIndex(i)}
                  aria-label={`Open image ${i + 1}`}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <CldImage
                    src={publicId}
                    width={600}
                    height={900}
                    crop="limit"
                    quality="auto"
                    format="auto"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    alt={`Gallery image ${i + 1}`}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Invisible overlay to prevent right-click save */}
                  <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {index !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50"
            aria-label="Close"
          >
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white text-5xl hover:text-gray-300 z-50"
            aria-label="Previous"
          >
            ‹
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8 touch-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={resetZoom}
          >
            {/* Low quality placeholder */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CldImage
                  src={ids[index]}
                  width={100}
                  height={100}
                  crop="fill"
                  quality={10}
                  format="auto"
                  alt="Loading..."
                  className="blur-lg w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain"
                  draggable={false}
                />
              </div>
            )}
            
            {/* High quality image with zoom transform */}
            <div
              className="flex items-center justify-center"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: scale === 1 ? 'transform 0.2s ease-out' : 'none',
              }}
            >
              <CldImage
                src={ids[index]}
                width={1920}
                height={1080}
                crop="limit"
                quality={90}
                format="auto"
                alt="Fullscreen"
                style={{ 
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain'
                }}
                className={`transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
                draggable={false}
              />
            </div>
            {/* Invisible overlay to prevent saving */}
            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
            
            {/* Zoom indicator */}
            {scale > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-50">
                {Math.round(scale * 100)}% - Double tap to reset
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white text-5xl hover:text-gray-300 z-50"
            aria-label="Next"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm z-50">
            {index + 1} / {ids.length}
          </div>
        </div>
      )}
    </>
  );
}
