import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ChevronRight, Play, RotateCcw, Sparkles } from 'lucide-react';
import { OmakaseEnv, MAX_BELT_SIZE } from './engine/env.js';
import { Phase } from './engine/gameState.js';
import { CARD_DISPLAY_NAMES, PASSIVE_ACTION_CARDS, cardName } from './engine/cards.js';
import { calculateScore, scoreBreakdown } from './engine/scoring.js';
import { SimpleGreedyAgent } from './agents/greedy.js';
import cardBack from '../../Assets/Web/cards_back.jpg';
import favicon from '../../Assets/Web/favicon.png';
import chopsticksCard from '../../Assets/Web/Action_cards/chopsticks.png';
import sakeCard from '../../Assets/Web/Action_cards/sake.png';
import umeshuCard from '../../Assets/Web/Action_cards/umeshu.png';
import chefsChoiceCard from '../../Assets/Web/Action_cards/chefs_choice.png';
import wasabiCard from '../../Assets/Web/Action_cards/wasabi.png';
import matchaCard from '../../Assets/Web/Action_cards/matcha.png';
import shoyuCard from '../../Assets/Web/Action_cards/Shoyu.png';
import forkCard from '../../Assets/Web/Action_cards/fork.png';
import gingerCard from '../../Assets/Web/Action_cards/ginger.png';
import assortedSashimiCard from '../../Assets/Web/Sushi_cards/assorted_sashimi.png';
import premiumEelCard from '../../Assets/Web/Sushi_cards/premium_eel.png';
import octopusCard from '../../Assets/Web/Sushi_cards/octopus.png';
import fattyTunaCard from '../../Assets/Web/Sushi_cards/fatty_tuna.png';
import congerEelCard from '../../Assets/Web/Sushi_cards/conger_eel.png';
import crabCard from '../../Assets/Web/Sushi_cards/crab.png';
import karaageCard from '../../Assets/Web/Sushi_cards/Karaage.png';
import salmonRoeCard from '../../Assets/Web/Sushi_cards/salmon_roe.png';
import tunaCard from '../../Assets/Web/Sushi_cards/tuna.png';
import salmonCard from '../../Assets/Web/Sushi_cards/salmon.png';
import shrimpCard from '../../Assets/Web/Sushi_cards/shrimp.png';
import cucumberRollCard from '../../Assets/Web/Sushi_cards/cucumber_roll.png';
import salmonRollCard from '../../Assets/Web/Sushi_cards/salmon_roll.png';
import tunaRollCard from '../../Assets/Web/Sushi_cards/tuna_roll.png';
import omeletteCard from '../../Assets/Web/Sushi_cards/omelette.png';
import tofuCard from '../../Assets/Web/Sushi_cards/tofu.png';

const PLAYER = 0;
const AI = 1;

const difficulties = [
  { id: 'easy', sims: 500, dots: 1 },
  { id: 'advanced', sims: 2000, dots: 2 },
  { id: 'expert', sims: 6000, dots: 3 }
];

const phaseOrder = [Phase.PHASE_1, Phase.PHASE_2, Phase.PHASE_3, Phase.PHASE_4];

const actionImages = {
  chopsticks: chopsticksCard,
  sake: sakeCard,
  umeshu: umeshuCard,
  chefs_choice: chefsChoiceCard,
  wasabi: wasabiCard,
  matcha: matchaCard,
  shoyu: shoyuCard,
  fork: forkCard,
  ginger: gingerCard
};

const sushiImages = {
  assorted_sashimi: assortedSashimiCard,
  premium_eel: premiumEelCard,
  octopus: octopusCard,
  fatty_tuna: fattyTunaCard,
  conger_eel: congerEelCard,
  crab: crabCard,
  karaage: karaageCard,
  salmon_roe: salmonRoeCard,
  tuna: tunaCard,
  salmon: salmonCard,
  shrimp: shrimpCard,
  cucumber_roll: cucumberRollCard,
  salmon_roll: salmonRollCard,
  tuna_roll: tunaRollCard,
  omelette: omeletteCard,
  tofu: tofuCard
};

function imageForCard(card) {
  if (!card) return cardBack;
  return card.isSushi ? sushiImages[card.sushiCard] : actionImages[card.actionCard];
}

function displayName(cardOrName) {
  const name = typeof cardOrName === 'string' ? cardOrName : cardName(cardOrName);
  return CARD_DISPLAY_NAMES[name] || name.replace(/_/g, ' ');
}

function defaultPlayText(t) {
  return {
    eyebrow: t.play?.eyebrow || 'Against AI',
    title: t.play?.title || 'Play Omakase',
    body: t.play?.body || 'Choose a chef and play against the browser AI.',
    start: t.play?.start || 'Start match',
    restart: t.play?.restart || 'New match',
    choose: t.play?.choose || 'Choose your opponent',
    easy: t.play?.easy || 'Easy',
    advanced: t.play?.advanced || 'Advanced',
    expert: t.play?.expert || 'Expert',
    you: t.play?.you || 'You',
    chef: t.play?.chef || 'Chef',
    score: t.play?.score || 'Score',
    deck: t.play?.deck || 'Deck',
    trash: t.play?.trash || 'Trash',
    hand: t.play?.hand || 'Hand',
    belt: t.play?.belt || 'Conveyor belt',
    passAction: t.play?.passAction || 'Skip action',
    endTurn: t.play?.endTurn || 'End turn',
    check: t.play?.check || 'Call check',
    selectHand: t.play?.selectHand || 'Select one hand card',
    selectBelt: t.play?.selectBelt || 'Select a belt card',
    playAction: t.play?.playAction || 'Play action',
    thinking: t.play?.thinking || 'Chef is thinking',
    discard: t.play?.discard || 'Discard down to your hand limit',
    chefsChoice: t.play?.chefsChoice || 'Choose two cards to return to the deck',
    chefPositions: t.play?.chefPositions || 'Choose where those cards return. 0 is the top of the deck.',
    confirm: t.play?.confirm || 'Return selected cards',
    confirmPositions: t.play?.confirmPositions || 'Place cards in deck',
    won: t.play?.won || 'You win',
    lost: t.play?.lost || 'Chef wins',
    tied: t.play?.tied || 'Tie game',
    activeEffects: t.play?.activeEffects || 'Active effects',
    passive: t.play?.passive || 'Passive',
    noExchange: t.play?.noExchange || 'No legal exchange, continue',
    phaseLabels: t.play?.phaseLabels || ['Action', 'Exchange', 'Action', 'Check']
  };
}

export function OmakasePlay({ t }) {
  const copy = defaultPlayText(t);
  const envRef = useRef(null);
  const workerRef = useRef(null);
  const aiBusyRef = useRef(false);
  const [difficulty, setDifficulty] = useState('advanced');
  const [version, setVersion] = useState(0);
  const [selectedHandIdx, setSelectedHandIdx] = useState(null);
  const [chefSelections, setChefSelections] = useState([]);
  const [chefPositions, setChefPositions] = useState([0, 0]);
  const [message, setMessage] = useState(copy.body);

  const env = envRef.current;
  const state = env?.state;
  const selectedDifficulty = difficulties.find((item) => item.id === difficulty) || difficulties[1];
  const human = state?.players[PLAYER];
  const chef = state?.players[AI];
  const legalActions = useMemo(() => env?.getLegalActions() || [], [env, version]);
  const gameStarted = Boolean(state);
  const isHumanTurn = state && !state.gameOver && state.currentPlayer === PLAYER;
  const phase = state?.phase;

  useEffect(() => () => {
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  useEffect(() => {
    if (!state || state.gameOver || state.currentPlayer !== AI || aiBusyRef.current) return;

    let cancelled = false;
    aiBusyRef.current = true;
    setMessage(copy.thinking);

    async function runAi() {
      const greedy = new SimpleGreedyAgent({ checkThreshold: 0 });
      await delay(450);

      while (!cancelled && envRef.current?.state && !envRef.current.state.gameOver && envRef.current.state.currentPlayer === AI) {
        const activeEnv = envRef.current;
        const activeState = activeEnv.state;
        const legal = activeEnv.getLegalActions();
        let action = legal[0] ?? 0;

        if (activeState.phase === Phase.PHASE_2 && legal.length > 1) {
          action = await getMctsAction(activeEnv, legal, selectedDifficulty.sims);
        } else {
          action = greedy.chooseAction(activeEnv, legal);
        }

        activeEnv.step(action);
        setVersion((value) => value + 1);
        await delay(activeState.phase === Phase.PHASE_2 ? 550 : 300);
      }

      aiBusyRef.current = false;
      if (!cancelled) {
        setMessage(currentMessage(envRef.current?.state, copy));
        setVersion((value) => value + 1);
      }
    }

    runAi();

    return () => {
      cancelled = true;
      aiBusyRef.current = false;
    };
  }, [state?.currentPlayer, state?.gameOver, selectedDifficulty.sims]);

  function ensureWorker() {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('./workers/mcts_worker.js', import.meta.url), { type: 'module' });
    }
    return workerRef.current;
  }

  function startMatch(nextDifficulty = difficulty) {
    workerRef.current?.terminate();
    workerRef.current = null;
    const nextEnv = new OmakaseEnv(2);
    nextEnv.reset();
    envRef.current = nextEnv;
    setDifficulty(nextDifficulty);
    setSelectedHandIdx(null);
    setChefSelections([]);
    setChefPositions([0, 0]);
    setMessage(currentMessage(nextEnv.state, copy));
    setVersion((value) => value + 1);
  }

  function getMctsAction(activeEnv, legal, sims) {
    return new Promise((resolve) => {
      const worker = ensureWorker();
      const fallback = window.setTimeout(() => resolve(legal[0] ?? 0), 3500);
      worker.onmessage = (event) => {
        if (event.data?.type !== 'result') return;
        window.clearTimeout(fallback);
        resolve(event.data.action);
      };
      worker.onerror = () => {
        window.clearTimeout(fallback);
        resolve(legal[0] ?? 0);
      };
      worker.postMessage({
        type: 'choose',
        envState: structuredClone(activeEnv.state),
        turnCount: activeEnv.turnCount,
        numPlayers: activeEnv.numPlayers,
        legalActions: legal,
        nSimulations: sims,
        timeBudgetMs: 0,
        agentType: 'mcts2'
      });
    });
  }

  function step(action, choices = null) {
    if (!envRef.current || envRef.current.state.gameOver) return;
    envRef.current._nextActionChoices = choices;
    envRef.current.step(action);
    setSelectedHandIdx(null);
    setChefSelections([]);
    setChefPositions([0, 0]);
    setMessage(currentMessage(envRef.current.state, copy));
    setVersion((value) => value + 1);
  }

  function exchangeWithBelt(beltIdx) {
    if (selectedHandIdx == null || !legalActions.includes(selectedHandIdx * MAX_BELT_SIZE + beltIdx)) return;
    step(selectedHandIdx * MAX_BELT_SIZE + beltIdx);
  }

  function toggleChefSelection(index) {
    setChefSelections((current) => {
      if (current.includes(index)) return current.filter((item) => item !== index);
      if (current.length >= 2) return current;
      return [...current, index];
    });
  }

  function confirmChefsChoice() {
    if (!envRef.current || chefSelections.length !== 2) return;
    [...chefSelections].sort((a, b) => b - a).forEach((index) => envRef.current.step(index));
    setChefSelections([]);
    setChefPositions([0, 0]);
    setMessage(currentMessage(envRef.current.state, copy));
    setVersion((value) => value + 1);
  }

  function confirmChefPositions() {
    if (!envRef.current || envRef.current.state.phase !== Phase.CHEFS_CHOICE_SELECT_POSITIONS) return;
    envRef.current.step(chefPositions[0]);
    envRef.current.step(chefPositions[1]);
    setChefPositions([0, 0]);
    setMessage(currentMessage(envRef.current.state, copy));
    setVersion((value) => value + 1);
  }

  const playerScore = human ? calculateScore(human.hand) : 0;
  const chefScore = chef ? calculateScore(chef.hand) : 0;

  return (
    <section className="play-game-page">
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
              onClick={() => gameStarted ? startMatch(item.id) : setDifficulty(item.id)}
            >
              <span>{copy[item.id]}</span>
              <DifficultyDots count={item.dots} />
            </button>
          ))}
          <button className="button primary play-start" onClick={() => startMatch(difficulty)}>
            {gameStarted ? <RotateCcw size={18} /> : <Play size={18} />}
            {gameStarted ? copy.restart : copy.start}
          </button>
        </div>
      </div>

      {!gameStarted ? (
        <div className="play-splash">
          <img src={favicon} alt="" />
          <div className="play-splash-cards" aria-hidden="true">
            {[fattyTunaCard, shoyuCard, sakeCard, matchaCard, salmonRoeCard].map((src, index) => (
              <img key={src} src={src} alt="" style={{ '--tilt': `${(index - 2) * 7}deg` }} />
            ))}
          </div>
        </div>
      ) : state.gameOver ? (
        <GameOver
          copy={copy}
          playerScore={playerScore}
          chefScore={chefScore}
          human={human}
          chef={chef}
          restart={() => startMatch(difficulty)}
        />
      ) : (
        <div className="play-table">
          <div className="play-status">
            <ScoreBadge label={copy.you} score={playerScore} active={state.currentPlayer === PLAYER} />
            <div className="phase-strip">
              {phaseOrder.map((item, index) => (
                <span
                  key={item}
                  className={Math.min(phase, Phase.PHASE_4) === item ? 'active' : Math.min(phase, Phase.PHASE_4) > item ? 'done' : ''}
                >
                  {index + 1}
                  <small>{copy.phaseLabels[index]}</small>
                </span>
              ))}
            </div>
            <ScoreBadge label={copy.chef} score={chefScore} active={state.currentPlayer === AI} />
          </div>

          <div className="table-message" aria-live="polite">
            {aiBusyRef.current && <Bot size={18} />}
            <span>{message}</span>
          </div>

          <section className="opponent-row" aria-label={copy.chef}>
            <div>
              <strong>{copy.chef}</strong>
              <span>{chef.hand.length} {copy.hand}</span>
            </div>
            <div className="opponent-hand">
              {chef.hand.map((card) => <CardBack key={card.cardId} />)}
            </div>
          </section>

          <section className="belt-row" aria-label={copy.belt}>
            <Pile label={copy.deck} count={state.deck.length} image={cardBack} />
            <div className="belt-cards">
              {state.conveyorBelt.map((card, index) => {
                const isTarget = phase === Phase.PHASE_2 && selectedHandIdx != null && legalActions.includes(selectedHandIdx * MAX_BELT_SIZE + index);
                return (
                  <GameCard
                    key={card.cardId}
                    card={card}
                    target={isTarget}
                    disabled={!isTarget}
                    onClick={() => exchangeWithBelt(index)}
                  />
                );
              })}
            </div>
            <Pile
              label={copy.trash}
              count={state.trash.length}
              image={state.trash.length ? imageForCard(state.trash[state.trash.length - 1]) : null}
            />
          </section>

          <section className="player-row" aria-label={copy.you}>
            <div className="player-meta">
              <div>
                <strong>{copy.you}</strong>
                <span>{human.hand.length} / {human.maxHandSize} {copy.hand}</span>
              </div>
              <PassiveBadges player={human} copy={copy} />
            </div>

            {phase === Phase.CHEFS_CHOICE_SELECT_CARDS ? (
              <div className="choice-panel">
                <p>{copy.chefsChoice}</p>
                <div className="player-hand">
                  {human.hand.map((card, index) => (
                    <GameCard
                      key={card.cardId}
                      card={card}
                      selected={chefSelections.includes(index)}
                      onClick={() => toggleChefSelection(index)}
                    />
                  ))}
                </div>
                <button className="button primary" disabled={chefSelections.length !== 2} onClick={confirmChefsChoice}>
                  {copy.confirm}
                </button>
              </div>
            ) : phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS ? (
              <div className="choice-panel">
                <p>{copy.chefPositions}</p>
                <div className="chef-position-list">
                  {state.chefChoiceSelectedCards.map((card, index) => (
                    <label key={card.cardId}>
                      <GameCard card={card} disabled />
                      <span>{displayName(card)}</span>
                      <input
                        type="range"
                        min="0"
                        max={state.deck.length}
                        value={chefPositions[index] ?? 0}
                        onChange={(event) => {
                          const next = [...chefPositions];
                          next[index] = Number(event.target.value);
                          setChefPositions(next);
                        }}
                      />
                      <strong>{chefPositions[index] ?? 0}</strong>
                    </label>
                  ))}
                </div>
                <button className="button primary" onClick={confirmChefPositions}>
                  {copy.confirmPositions}
                </button>
              </div>
            ) : phase === Phase.PHASE_DISCARD ? (
              <div className="choice-panel">
                <p>{copy.discard}</p>
                <div className="player-hand">
                  {human.hand.map((card, index) => (
                    <GameCard
                      key={card.cardId}
                      card={card}
                      disabled={!legalActions.includes(index)}
                      onClick={() => legalActions.includes(index) && step(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="player-hand">
                {human.hand.map((card, index) => {
                  const action = actionForCard(human.hand, card);
                  const canPlayAction = isHumanTurn &&
                    (phase === Phase.PHASE_1 || phase === Phase.PHASE_3) &&
                    action != null &&
                    legalActions.includes(action);
                  const canSelectForExchange = isHumanTurn &&
                    phase === Phase.PHASE_2 &&
                    legalActions.some((item) => Math.floor(item / MAX_BELT_SIZE) === index);
                  const isSelected = selectedHandIdx === index;

                  return (
                    <GameCard
                      key={card.cardId}
                      card={card}
                      playable={canPlayAction}
                      selected={isSelected}
                      disabled={!canPlayAction && !canSelectForExchange}
                      onClick={() => {
                        if (canPlayAction) step(action);
                        if (canSelectForExchange) {
                          setSelectedHandIdx(isSelected ? null : index);
                          setMessage(isSelected ? copy.selectHand : copy.selectBelt);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <div className="play-controls">
            {phase === Phase.PHASE_1 && (
              <button className="button secondary" disabled={!isHumanTurn} onClick={() => step(0)}>
                {copy.passAction}
              </button>
            )}
            {phase === Phase.PHASE_2 && legalActions.length === 1 && legalActions[0] === 0 && (
              <button className="button secondary" disabled={!isHumanTurn} onClick={() => step(0)}>
                {copy.noExchange}
              </button>
            )}
            {phase === Phase.PHASE_3 && (
              <button className="button secondary" disabled={!isHumanTurn} onClick={() => step(0)}>
                {copy.endTurn}
              </button>
            )}
            {phase === Phase.PHASE_4 && (
              <>
                <button className="button secondary" disabled={!isHumanTurn} onClick={() => step(0)}>
                  {copy.endTurn}
                </button>
                <button className="button primary" disabled={!isHumanTurn || !legalActions.includes(1)} onClick={() => step(1)}>
                  <Sparkles size={18} />
                  {copy.check}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function currentMessage(state, copy) {
  if (!state) return copy.body;
  if (state.gameOver) return '';
  if (state.currentPlayer === AI) return copy.thinking;
  if (state.phase === Phase.PHASE_1) return copy.playAction;
  if (state.phase === Phase.PHASE_2) return copy.selectHand;
  if (state.phase === Phase.PHASE_3) return copy.playAction;
  if (state.phase === Phase.PHASE_4) return copy.check;
  if (state.phase === Phase.CHEFS_CHOICE_SELECT_CARDS) return copy.chefsChoice;
  if (state.phase === Phase.PHASE_DISCARD) return copy.discard;
  return copy.body;
}

function actionForCard(hand, card) {
  if (card.isSushi || PASSIVE_ACTION_CARDS.has(card.actionCard)) return null;
  const playable = hand.filter((item) => !item.isSushi && !PASSIVE_ACTION_CARDS.has(item.actionCard));
  const index = playable.indexOf(card);
  return index >= 0 ? index + 1 : null;
}

function GameCard({ card, selected = false, playable = false, target = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      className={`game-card ${selected ? 'is-selected' : ''} ${playable ? 'is-playable' : ''} ${target ? 'is-target' : ''}`}
      disabled={disabled}
      onClick={onClick}
      title={displayName(card)}
    >
      <img src={imageForCard(card)} alt={displayName(card)} />
      {playable && <span>{displayName(card)}</span>}
      {!card.isSushi && PASSIVE_ACTION_CARDS.has(card.actionCard) && <small>{displayName(card)}</small>}
    </button>
  );
}

function CardBack() {
  return (
    <span className="card-back">
      <img src={cardBack} alt="" />
    </span>
  );
}

function Pile({ label, count, image }) {
  return (
    <div className="game-pile">
      <div>{image ? <img src={image} alt="" /> : <span />}</div>
      <strong>{label}</strong>
      <small>{count}</small>
    </div>
  );
}

function ScoreBadge({ label, score, active }) {
  return (
    <div className={`score-badge ${active ? 'active' : ''}`}>
      <span>{label}</span>
      <strong>{score.toLocaleString()} ¥</strong>
    </div>
  );
}

function DifficultyDots({ count }) {
  return (
    <span className="difficulty-dots" aria-hidden="true">
      {[0, 1, 2].map((item) => <i key={item} className={item < count ? 'on' : ''} />)}
    </span>
  );
}

function PassiveBadges({ player, copy }) {
  const badges = [];
  if (player.matchaCount > 0) badges.push(`Matcha x${player.matchaCount}`);
  if (player.wasabiSkipFlag > 0) badges.push(`Wasabi x${player.wasabiSkipFlag}`);
  if (player.hand.some((card) => !card.isSushi && card.actionCard === 'shoyu')) badges.push('Shoyu');
  if (player.hand.some((card) => !card.isSushi && card.actionCard === 'ginger')) badges.push('Ginger');

  if (!badges.length) return null;

  return (
    <div className="passive-badges" aria-label={copy.activeEffects}>
      {badges.map((badge) => <span key={badge}>{badge}</span>)}
    </div>
  );
}

function GameOver({ copy, playerScore, chefScore, human, chef, restart }) {
  const verdict = playerScore === chefScore ? copy.tied : playerScore > chefScore ? copy.won : copy.lost;

  return (
    <div className="game-over-panel">
      <p className="eyebrow">{copy.score}</p>
      <h2>{verdict}</h2>
      <div className="game-over-scores">
        <ScoreBadge label={copy.you} score={playerScore} active={playerScore >= chefScore} />
        <ScoreBadge label={copy.chef} score={chefScore} active={chefScore >= playerScore} />
      </div>
      <div className="breakdown-grid">
        <Breakdown title={copy.you} hand={human.hand} />
        <Breakdown title={copy.chef} hand={chef.hand} />
      </div>
      <button className="button primary" onClick={restart}>
        <RotateCcw size={18} />
        {copy.restart}
      </button>
    </div>
  );
}

function Breakdown({ title, hand }) {
  return (
    <article className="score-breakdown">
      <h3>{title}</h3>
      <div className="mini-hand">
        {hand.map((card) => <img key={card.cardId} src={imageForCard(card)} alt={displayName(card)} />)}
      </div>
      <ul>
        {scoreBreakdown(hand).map((line, index) => (
          <li key={`${line.label}-${index}`}>
            <span>{line.label}</span>
            <strong>{line.points.toLocaleString()} ¥</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
