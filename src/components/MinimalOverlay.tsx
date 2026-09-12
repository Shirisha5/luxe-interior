import { useEffect, useRef } from 'react';
import './MinimalOverlay.css';

interface MinimalOverlayProps {
  progress: number;
  heroSlideProgress?: number;
  isNight?: boolean;
  isAboutVisible?: boolean;
  isLoaded?: boolean;
}

interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
}

const STAGES: StageInfo[] = [
  {
    id: 1,
    title: 'THE BLUEPRINT',
    subtitle: 'Pure geometry emerges from the void',
  },
  {
    id: 2,
    title: 'MATERIALIZATION',
    subtitle: 'Transforming abstract shapes into tangible reality',
  },
  {
    id: 3,
    title: 'THE SANCTUARY',
    subtitle: 'A breathing interior shaped by light and life',
  },
  {
    id: 4,
    title: 'DAY & NIGHT',
    subtitle: 'Toggle between natural sunlight and ambient evening warmth',
  },
];

export function MinimalOverlay({
  progress,
  heroSlideProgress = 1,
  isNight = false,
  isAboutVisible = false,
  isLoaded = false,
}: MinimalOverlayProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }
  }, [progress]);

  let activeStage = 1;
  if (progress >= 0.86) {
    activeStage = 4;
  } else if (progress >= 0.68) {
    activeStage = 3;
  } else if (progress >= 0.22) {
    activeStage = 2;
  } else {
    activeStage = 1;
  }

  const isNarrativeVisible = isLoaded && (progress > 0 || heroSlideProgress >= 0.65) && !isAboutVisible;

  return (
    <>
      <aside
        className={`stage-narrative-container ${isNarrativeVisible ? 'visible' : ''} ${
          isNight ? 'night-mode' : ''
        }`}
        aria-live="polite"
      >
        <div className="stage-narrative-stack">
          {STAGES.map((stage) => {
            let stateClass = 'upcoming';
            if (stage.id === activeStage) {
              stateClass = 'active';
            } else if (stage.id < activeStage) {
              stateClass = 'exited';
            }

            return (
              <div
                key={stage.id}
                className={`stage-narrative-card ${stateClass}`}
              >
                <h2 className="stage-title">{stage.title}</h2>
                <p className="stage-subtitle">{stage.subtitle}</p>
              </div>
            );
          })}
        </div>
      </aside>

      <div className={`minimal-progress-track ${!isLoaded ? 'minimal-progress-hidden' : ''}`}>
        <div ref={barRef} className="minimal-progress-bar" />
      </div>
    </>
  );
}


