import { useCallback, useEffect, useRef, useState } from 'react';
import Particles from './components/Particles';
import SlideHero from './components/SlideHero';
import SlideWhy from './components/SlideWhy';
import SlideAdvantages from './components/SlideAdvantages';
import SlideWorks from './components/SlideWorks';
import SlideManager from './components/SlideManager';

const slides = [SlideHero, SlideWhy, SlideAdvantages, SlideWorks, SlideManager];

const ANIM_MS = 500;
const WHEEL_LOCK_MS = 800;

export default function App() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const animatingRef = useRef(false);
  const total = slides.length;

  const goSlide = useCallback(
    (index: number) => {
      if (animatingRef.current) return;
      if (index < 0 || index >= total) return;
      if (index === currentRef.current) return;

      animatingRef.current = true;
      currentRef.current = index;
      setCurrent(index);
      setTimeout(() => {
        animatingRef.current = false;
      }, ANIM_MS);
    },
    [total],
  );

  // Keyboard / wheel / touch — listeners attach once thanks to stable goSlide + currentRef.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goSlide(currentRef.current + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goSlide(currentRef.current - 1);
    };

    let wheelLock = false;
    const onWheel = (e: WheelEvent) => {
      if (wheelLock) return;
      wheelLock = true;
      if (e.deltaY > 0) goSlide(currentRef.current + 1);
      else goSlide(currentRef.current - 1);
      setTimeout(() => {
        wheelLock = false;
      }, WHEEL_LOCK_MS);
    };

    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goSlide(currentRef.current + 1);
        else goSlide(currentRef.current - 1);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [goSlide]);

  const progress = (current + 1) / total;
  const counter = String(current + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  return (
    <>
      <Particles />

      <img
        src="https://ncottage.ru/app/uploads/2022/02/logo-.png"
        alt="Новый Коттедж"
        className="fixed-logo"
        decoding="async"
      />

      <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />

      <div className="slide-counter">
        <span className="current">{counter}</span> / <span>{totalStr}</span>
      </div>

      <div className="arrow arrow-left" onClick={() => goSlide(currentRef.current - 1)}>
        <svg viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>
      <div className="arrow arrow-right" onClick={() => goSlide(currentRef.current + 1)}>
        <svg viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </div>

      <div className="nav-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`nav-dot${i === current ? ' active' : ''}`}
            onClick={() => goSlide(i)}
          />
        ))}
      </div>

      <div className="kb-hint">
        <span className="kb-key">&larr;</span> <span className="kb-key">&rarr;</span> для навигации
      </div>

      <div className="slider">
        {slides.map((SlideComponent, i) => (
          <SlideComponent key={i} active={i === current} />
        ))}
      </div>
    </>
  );
}
