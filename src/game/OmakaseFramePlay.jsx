import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Play, RotateCcw } from 'lucide-react';
import favicon from '../../Assets/Web/favicon.png';
import fattyTunaCard from '../../Assets/Web/Sushi_cards/fatty_tuna.png';
import salmonRoeCard from '../../Assets/Web/Sushi_cards/salmon_roe.png';
import sakeCard from '../../Assets/Web/Action_cards/sake.png';
import shoyuCard from '../../Assets/Web/Action_cards/Shoyu.png';
import matchaCard from '../../Assets/Web/Action_cards/matcha.png';

const difficulties = [
  { id: 'easy', sims: 500, dots: 1 },
  { id: 'advanced', sims: 2000, dots: 2 },
  { id: 'expert', sims: 6000, dots: 3 }
];

function playText(t) {
  return {
    eyebrow: t.play?.eyebrow || 'Against AI',
    title: t.play?.title || 'Play Omakase',
    body: t.play?.body || 'Choose a chef and play against the browser AI.',
    start: t.play?.start || 'Start match',
    restart: t.play?.restart || 'New match',
    choose: t.play?.choose || 'Choose your opponent',
    easy: t.play?.easy || 'Easy',
    advanced: t.play?.advanced || 'Advanced',
    expert: t.play?.expert || 'Expert'
  };
}

export function OmakaseFramePlay({ t }) {
  const copy = playText(t);
  const [difficulty, setDifficulty] = useState('advanced');
  const [started, setStarted] = useState(false);
  const [chromeShown, setChromeShown] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const selectedDifficulty = difficulties.find((item) => item.id === difficulty) || difficulties[1];
  const gameUrl = useMemo(() => {
    const base = import.meta.env.BASE_URL || '/';
    return `${base}play-game/index.html?autostart=1&sims=${selectedDifficulty.sims}&v=${frameKey}`;
  }, [selectedDifficulty.sims, frameKey]);

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'omakase-game-change-opponent') {
        setStarted(false);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Immersive play: while a match runs, `game-active` on <body> hides the site
  // chrome and pins the frame fullscreen on small screens (see styles.css).
  // The platform back gesture exits the match instead of leaving the page.
  useEffect(() => {
    document.body.classList.toggle('game-active', started);
    if (!started) return undefined;

    window.history.pushState({ omakaseMatch: true }, '');
    function onPopState() {
      setStarted(false);
    }
    window.addEventListener('popstate', onPopState);
    return () => {
      document.body.classList.remove('game-active');
      window.removeEventListener('popstate', onPopState);
      if (window.history.state?.omakaseMatch) {
        window.history.back();
      }
    };
  }, [started]);

  function startMatch() {
    setFrameKey((value) => value + 1);
    setChromeShown(false);
    setStarted(true);
  }

  function exitMatch() {
    setChromeShown(false);
    setStarted(false);
  }

  return (
    <section className={`play-frame-page ${started ? 'is-playing' : ''}`}>
      {!started ? (
        <>
          <div className="play-game-hero">
            <div>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <p>{copy.body}</p>
            </div>
            <div className="difficulty-panel" aria-label={copy.choose}>
              {difficulties.map((item) => (
                <button
                  key={item.id}
                  className={difficulty === item.id ? 'active' : ''}
                  onClick={() => setDifficulty(item.id)}
                >
                  <span>{copy[item.id]}</span>
                  <DifficultyDots count={item.dots} />
                </button>
              ))}
              <button className="button primary play-start" onClick={startMatch}>
                <Play size={18} />
                {copy.start}
              </button>
            </div>
          </div>

          <div className="play-splash">
            <img src={favicon} alt="" />
            <div className="play-splash-cards" aria-hidden="true">
              {[fattyTunaCard, shoyuCard, sakeCard, matchaCard, salmonRoeCard].map((src, index) => (
                <img key={src} src={src} alt="" style={{ '--tilt': `${(index - 2) * 7}deg` }} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={`play-frame-shell ${chromeShown ? 'chrome-open' : ''}`}>
          <div className="play-frame-toolbar">
            <button className="button secondary small" onClick={exitMatch}>
              {copy.choose}
            </button>
            <button className="button primary small" onClick={startMatch}>
              <RotateCcw size={16} />
              {copy.restart}
            </button>
            <button
              className="button secondary small chrome-close"
              onClick={() => setChromeShown(false)}
              aria-label="Hide menu"
            >
              <ChevronUp size={16} />
            </button>
          </div>
          <button
            className="chrome-handle"
            onClick={() => setChromeShown(true)}
            aria-label="Show menu"
          >
            <ChevronDown size={14} />
          </button>
          <iframe
            key={gameUrl}
            src={gameUrl}
            title="Omakase game"
            className="play-game-frame"
            allow="fullscreen"
          />
        </div>
      )}
    </section>
  );
}

function DifficultyDots({ count }) {
  return (
    <span className="difficulty-dots" aria-hidden="true">
      {[0, 1, 2].map((item) => <i key={item} className={item < count ? 'on' : ''} />)}
    </span>
  );
}
