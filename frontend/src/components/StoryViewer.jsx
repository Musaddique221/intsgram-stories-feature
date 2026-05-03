import { useState, useEffect, useRef } from 'react';

const DURATION = 5000;

export default function StoryViewer({ stories, initialIndex, onClose, onStoryChange }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [slideDir, setSlideDir] = useState('forward');

  const progressRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const advanceRef = useRef(null);
  const imgRef = useRef(null);

  const story = stories[currentIndex];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [currentIndex]);

  const stopRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Keep a stable ref so the RAF callback never captures a stale closure
  advanceRef.current = () => {
    stopRaf();
    if (currentIndex < stories.length - 1) {
      const next = currentIndex + 1;
      onStoryChange(next);
      setSlideDir('forward');
      setCurrentIndex(next);
      setImageLoaded(false);
    } else {
      onClose();
    }
  };

  const goNext = () => advanceRef.current();

  const goPrev = () => {
    stopRaf();
    if (currentIndex > 0) {
      setSlideDir('back');
      setCurrentIndex(currentIndex - 1);
      setImageLoaded(false);
    }
  };

  useEffect(() => {
    if (!imageLoaded) return;

    startRef.current = performance.now();

    const tick = (now) => {
      if (!progressRef.current) return;
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      progressRef.current.style.width = `${pct}%`;
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        advanceRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopRaf;
  }, [imageLoaded, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black z-50 max-w-[430px] mx-auto overflow-hidden select-none">

      <div
        key={currentIndex}
        className={`absolute inset-0 ${slideDir === 'forward' ? 'slide-from-right' : 'slide-from-left'}`}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <div className="w-11 h-11 rounded-full border-[3px] border-white border-t-transparent animate-spin" />
          </div>
        )}
        <img
          ref={imgRef}
          src={story.image}
          alt={story.username}
          className="w-full h-full object-cover"
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.15s ease' }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />
      </div>

     
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

    
      <div className="absolute inset-x-0 top-24 bottom-0 flex z-20">
        <div className="w-2/5 h-full cursor-pointer" onClick={goPrev} />
        <div className="w-3/5 h-full cursor-pointer" onClick={goNext} />
      </div>

  
      <div className="absolute top-3 inset-x-2 flex gap-[3px] z-30 pointer-events-none">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] rounded-full bg-white/35 overflow-hidden">
            {i < currentIndex && (
              <div className="h-full w-full bg-white rounded-full" />
            )}
            {i === currentIndex && (
              <div
                ref={progressRef}
                className="h-full bg-white rounded-full"
                style={{ width: '0%' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-8 inset-x-0 flex items-center gap-3 px-3 z-40">
        <img
          src={story.avatar}
          alt={story.username}
          className="w-9 h-9 rounded-full border border-white/60 object-cover shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-white text-[13px] font-semibold leading-tight truncate">
            {story.username}
          </span>
          <span className="text-white/55 text-[11px] leading-tight">just now</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 -mr-1 text-white shrink-0"
          aria-label="Close story"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
