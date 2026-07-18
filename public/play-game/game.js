import { OmakaseEnv, MAX_BELT_SIZE } from './engine/env.js';
import { Phase } from './engine/gameState.js';
import { calculateScore, scoreBreakdown, OMAKASE_SET, SAKURA_SET, UME_SET, KIDS_SET } from './engine/scoring.js';
import { CARD_VALUES, CARD_DISPLAY_NAMES, PASSIVE_ACTION_CARDS } from './engine/cards.js';
import { SimpleGreedyAgent, RandomAgent } from './agents/greedy.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const PLAYER_IDX = 0;
const AI_IDX = 1;
const IMG_OVERRIDES = { karaage: 'Karaage.png', shoyu: 'Shoyu.png' };
const cardImg     = name => `../cards/${IMG_OVERRIDES[name] ?? (name + '.png')}`;
const BACK_IMG    = '../cards/cards_back.png';
const URL_PARAMS = new URLSearchParams(window.location.search);

const ACTION_EFFECTS = {
  chopsticks:   'Steal a card from your opponent\'s hand',
  sake:         'Trade one card with your opponent',
  umeshu:       'Shuffle both hands and redistribute',
  chefs_choice: 'Draw 3, then return 2 to the deck',
  matcha:       'Draw an extra card, increase hand limit',
  fork:         'Opponent discards their most expensive sushi',
  wasabi:       'Whoever draws this skips their next turn (passive)',
  shoyu:        'Doubles one standalone sushi at scoring (passive)',
  ginger:       'No ability — cannot be swapped away (passive)',
};

// ── Game state ────────────────────────────────────────────────────────────────
let env = null;
let selectedAgent = 'mcts2';
let mctsNSims = parseInt(URL_PARAMS.get('sims') || '2000', 10);
let agent = null;
let mctsWorker = null;
let aiThinking = false;

// Phase 2 UI state machine
let p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };

// Chef's Choice selection
let chefsSelectedIndices = [];

// Score change tracking
const lastScores = { [PLAYER_IDX]: -1, [AI_IDX]: -1 };
let _lastPhaseMsg = '';
let _lastPhase = -1;

// Action card chooser overlay state
let actionChoice = null; // { card, phase }
let actionChoiceOverlayEl = null;
let actionChoiceResolver = null;

// Phase 1 swap-intent: card selected for swap before popup confirmation
let swapIntent = null; // { card, handIdx } | null

// Phase 3 card selection: first click selects, second click plays
let phase3Selection = null; // { card } | null

// Belt deal animation state
let beltDealIn = null;      // card object that just entered belt[0]
let beltDealAnimating = false; // true while fly-in animation is running

// One-shot "deck is running low" warning
let deckLowWarned = false;

const SETS_DEF = [
  { name: 'Omakase', value: 6000, cards: [...OMAKASE_SET] },
  { name: 'Sakura',  value: 4500, cards: [...SAKURA_SET] },
  { name: 'Ume',     value: 3500, cards: [...UME_SET] },
  { name: 'Kids',    value: 2000, cards: [...KIDS_SET] },
];

// ── DOM helpers ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
  $(id).classList.add('screen--active');
  hideCardViewer();
}

// ── Card rendering ────────────────────────────────────────────────────────────
function cardName(card) {
  return card.isSushi ? card.sushiCard : card.actionCard;
}

function makeCardEl(card, opts = {}) {
  const el = document.createElement('div');
  el.className = 'card';
  el.setAttribute('role', 'listitem');

  const name = cardName(card);
  const displayName = CARD_DISPLAY_NAMES[name] ?? name;
  el.dataset.cardName = name;

  const img = document.createElement('img');
  img.src = cardImg(name);
  img.alt = displayName;
  img.className = 'card__img';
  img.loading = 'lazy';
  img.draggable = false;
  img.onerror = () => { img.style.visibility = 'hidden'; };
  el.appendChild(img);

  if (!card.isSushi) {
    el.classList.add(PASSIVE_ACTION_CARDS.has(card.actionCard) ? 'card--passive' : 'card--action');
  }

  if (opts.selected)    el.classList.add('card--selected');
  if (opts.validTarget) el.classList.add('card--valid-target');
  if (opts.playable)    el.classList.add('card--playable');
  if (opts.disabled)    el.classList.add('card--disabled');

  return el;
}

// Small face-down back for opp-hand; large=true for full card size in modals
function makeCardBackEl(large = false) {
  const el = document.createElement('div');
  el.className = large ? 'card' : 'card-back';
  el.setAttribute('aria-label', 'Face-down card');
  const img = document.createElement('img');
  img.src = BACK_IMG;
  img.alt = '';
  img.draggable = false;
  if (large) img.className = 'card__img';
  el.appendChild(img);
  return el;
}

// ── Score animation ───────────────────────────────────────────────────────────
function updateScore(elId, newScore, key) {
  const el = $(elId);
  el.textContent = `¥${newScore.toLocaleString()}`;
  if (newScore !== lastScores[key] && newScore > 0) {
    el.classList.remove('ticking');
    void el.offsetWidth;
    el.classList.add('ticking');
    setTimeout(() => el.classList.remove('ticking'), 300);
  }
  lastScores[key] = newScore;
}

// ── Phase message ─────────────────────────────────────────────────────────────
function setPhaseMsg(msg, highlight = false) {
  if (msg === _lastPhaseMsg) return;
  _lastPhaseMsg = msg;
  const el = $('phase-msg');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = msg;
    el.classList.toggle('phase-msg--highlight', highlight);
    el.style.opacity = '';
  }, 200);
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!env || !env.state) return;
  const { state } = env;
  const player = state.players[PLAYER_IDX];
  const opp    = state.players[AI_IDX];

  updateScore('player-score', calculateScore(player.hand), PLAYER_IDX);

  $('deck-count').textContent  = state.deck.length;
  $('deck-count').classList.toggle('pile-count--low', state.deck.length <= 5);

  // One-shot warning as the deck runs dry (the game ends when it empties)
  if (state.deck.length <= 5 && state.deck.length > 0 && !state.gameOver && !deckLowWarned) {
    deckLowWarned = true;
    toast(`Only ${state.deck.length} cards left — the game ends when the deck runs out`, 3500);
  }

  // Update deck pile appearance
  const deckImg = $('deck-pile-img');
  if (deckImg) deckImg.style.opacity = state.deck.length === 0 ? '0.2' : '1';

  // Update trash pile
  renderTrashPile(state);

  // Game-ending banner
  const existingBanner = document.querySelector('.game-ending-banner');
  if (state.gameEnding && !state.gameOver) {
    if (!existingBanner) {
      const banner = document.createElement('div');
      banner.className = 'game-ending-banner';
      const caller = state.players.findIndex(p => p.hasCalledCheck);
      banner.textContent = caller === PLAYER_IDX
        ? 'You called Check! AI gets one more turn.'
        : 'AI called Check! This is your last turn.';
      $('screen-game').appendChild(banner);
    }
  } else if (existingBanner && !state.gameEnding) {
    existingBanner.remove();
  }

  // Opponent hand (face-down)
  const oppHandEl = $('opp-hand');
  oppHandEl.innerHTML = '';
  opp.hand.forEach(() => oppHandEl.appendChild(makeCardBackEl(false)));
  $('opp-hand-count').textContent = `${opp.hand.length} card${opp.hand.length !== 1 ? 's' : ''}`;

  const isPlayerTurn = state.currentPlayer === PLAYER_IDX && !aiThinking;
  const { phase } = state;

  renderBelt(state, isPlayerTurn, phase);
  renderPlayerHand(player, state, isPlayerTurn, phase);
  renderPhaseBar(phase, isPlayerTurn, state);
  renderControls(isPlayerTurn, phase);
  renderPassiveEffects(player);
  renderSetProgress(player);
}

// ── Menu set progress ─────────────────────────────────────────────────────────
function renderSetProgress(player) {
  const el = $('set-progress');
  if (!el) return;
  const owned = new Set(player.hand.filter(c => c.isSushi).map(c => c.sushiCard));

  el.innerHTML = '';
  const title = document.createElement('p');
  title.className = 'set-progress__title';
  title.textContent = 'Menu Sets';
  el.appendChild(title);

  SETS_DEF.forEach(def => {
    const have = def.cards.filter(c => owned.has(c)).length;
    const done = have === def.cards.length;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'set-row' + (done ? ' set-row--done' : '');
    row.setAttribute('aria-label', `${def.name} set: ${have} of ${def.cards.length} cards`);

    const nameEl = document.createElement('span');
    nameEl.textContent = `${def.name} ¥${def.value.toLocaleString()}`;
    const count = document.createElement('span');
    count.className = 'set-row__count';
    count.textContent = done ? '✓' : `${have}/${def.cards.length}`;

    row.append(nameEl, count);
    row.addEventListener('click', showSetsModal);
    el.appendChild(row);
  });
}

function showSetsModal() {
  if (!env?.state) return;
  const player = env.state.players[PLAYER_IDX];
  const owned = new Set(player.hand.filter(c => c.isSushi).map(c => c.sushiCard));

  const body = $('sets-modal-body');
  body.innerHTML = '';

  SETS_DEF.forEach(def => {
    const have = def.cards.filter(c => owned.has(c)).length;
    const done = have === def.cards.length;

    const wrap = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'sets-modal-set__header';
    const nameEl = document.createElement('strong');
    nameEl.textContent = `${def.name} Set`;
    const count = document.createElement('span');
    count.className = 'sets-modal-set__count';
    count.textContent = done ? 'Complete!' : `${have}/${def.cards.length}`;
    const value = document.createElement('span');
    value.className = 'sets-modal-set__value';
    value.textContent = `¥${def.value.toLocaleString()}`;
    header.append(nameEl, count, value);

    const strip = document.createElement('div');
    strip.className = 'sets-cards';
    def.cards.forEach(name => {
      const cardW = document.createElement('div');
      cardW.className = 'sets-card ' + (owned.has(name) ? 'sets-card--owned' : 'sets-card--missing');
      cardW.title = CARD_DISPLAY_NAMES[name] ?? name;
      cardW.dataset.cardName = name; // press-and-hold opens the fullscreen viewer
      const img = document.createElement('img');
      img.src = cardImg(name);
      img.alt = CARD_DISPLAY_NAMES[name] ?? name;
      img.draggable = false;
      cardW.appendChild(img);
      strip.appendChild(cardW);
    });

    wrap.append(header, strip);
    body.appendChild(wrap);
  });

  $('sets-modal-bg').hidden = false;
}

function renderTrashPile(state) {
  const pileEl = $('trash-pile');
  $('trash-count').textContent = state.trash.length;

  // Show top card of trash
  const oldImg = pileEl.querySelector('img');
  if (oldImg) oldImg.remove();
  const emptyEl = $('trash-empty');

  if (state.trash.length > 0) {
    emptyEl && (emptyEl.style.display = 'none');
    const topCard = state.trash[state.trash.length - 1];
    const img = document.createElement('img');
    img.src = cardImg(cardName(topCard));
    img.alt = CARD_DISPLAY_NAMES[cardName(topCard)] ?? '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;';
    img.onerror = () => { img.style.visibility = 'hidden'; };
    pileEl.insertBefore(img, pileEl.firstChild);
  } else {
    emptyEl && (emptyEl.style.display = '');
  }
}

function renderBelt(state, isPlayerTurn, phase) {
  const beltEl = $('belt-slots');
  beltEl.innerHTML = '';

  const showTargets = isPlayerTurn && (
    (phase === Phase.PHASE_2 && p2.step === 'SELECT_BELT') ||
    (phase === Phase.PHASE_1 && swapIntent != null)
  );
  const animEntry = beltDealIn != null || beltDealAnimating;

  state.conveyorBelt.forEach((card, bIdx) => {
    const isTarget = showTargets && (
      phase === Phase.PHASE_2 ? p2.legalBeltIdxs.has(bIdx) : true
    );
    const cardEl = makeCardEl(card, { validTarget: isTarget });

    if (animEntry) {
      if (bIdx === 0) {
        // Hidden while flying card animates in from deck
        cardEl.style.opacity = '0';
        cardEl.dataset.dealTarget = 'true';
      } else {
        // Cards that shifted right: start slightly right and move left to position
        cardEl.classList.add('card--deal-shift');
      }
    }

    if (isTarget) {
      // Tap confirms the swap (long-press previews the card)
      cardEl.style.cursor = 'pointer';
      cardEl.addEventListener('click', e => {
        e.stopPropagation();
        if (swapIntent) onBeltCardClickWithSwapIntent(bIdx);
        else onBeltCardClick(bIdx);
      });
    }

    const slot = document.createElement('div');
    slot.className = 'belt-slot';
    slot.appendChild(cardEl);
    beltEl.appendChild(slot);
  });
}

function renderPassiveEffects(player) {
  const el = $('passive-effects');
  el.innerHTML = '';

  const add = (label, cls) => {
    const b = document.createElement('span');
    b.className = 'effect-badge ' + cls;
    b.textContent = label;
    el.appendChild(b);
  };

  if (player.hand.some(c => !c.isSushi && c.actionCard === 'wasabi'))
    add('Wasabi', 'effect-badge--mustard');
  if (player.wasabiSkipFlag > 0)
    add(`Wasabi Skip ×${player.wasabiSkipFlag}`, 'effect-badge--mustard');
  if (player.hand.some(c => !c.isSushi && c.actionCard === 'shoyu'))
    add('Shoyu', 'effect-badge--peri');
  if (player.hand.some(c => !c.isSushi && c.actionCard === 'ginger'))
    add('Ginger', 'effect-badge--nori');
  if (player.matchaCount > 0)
    add(`Matcha ×${player.matchaCount}`, 'effect-badge--nori');
}

let lastHandSelIdx = -1;

// ── Fullscreen card viewer — press-and-hold any face-up card to inspect it.
// Opens after a 450ms hold, stays while the pointer is down (peek), and a
// quick release before the timer keeps normal tap behavior untouched.
const LONG_PRESS_MS = 450;
const LONG_PRESS_SLOP = 8;
let cardViewerEl = null;
let lpTimer = null;
let lpStart = null;         // { x, y }
let suppressNextClick = false;

function cardInfoText(name) {
  if (name in CARD_VALUES) return `¥${CARD_VALUES[name].toLocaleString()} · Sushi`;
  if (name in ACTION_EFFECTS) return ACTION_EFFECTS[name];
  return '';
}

function showCardViewer(name) {
  hideCardViewer();
  const ov = document.createElement('div');
  ov.className = 'card-viewer';

  const cardWrap = document.createElement('div');
  cardWrap.className = 'card-viewer__card';
  const img = document.createElement('img');
  img.src = cardImg(name);
  img.alt = CARD_DISPLAY_NAMES[name] ?? name;
  img.draggable = false;
  img.onerror = () => { img.style.visibility = 'hidden'; };
  cardWrap.appendChild(img);

  const title = document.createElement('div');
  title.className = 'card-viewer__name';
  title.textContent = CARD_DISPLAY_NAMES[name] ?? name;

  const meta = document.createElement('div');
  meta.className = 'card-viewer__meta';
  meta.textContent = cardInfoText(name);

  ov.append(cardWrap, title, meta);
  document.body.appendChild(ov);
  cardViewerEl = ov;
}

function hideCardViewer() {
  if (cardViewerEl) { cardViewerEl.remove(); cardViewerEl = null; }
}

// ── Drag-and-drop swap — drag a hand card up onto a highlighted belt card.
// CSS `touch-action: pan-x` on hand cards keeps horizontal swipes scrolling
// the hand while vertical movement reaches us as pointermove events.
let dragCandidate = null; // { hIdx, card, legal, startX, startY, el } | null
let dragGhost = null;
let dragActive = false;
let dragHoverEl = null;

// Physical tilt: the ghost leans into horizontal movement, more with speed,
// and settles back upright when the pointer stops.
const DRAG_TILT_MAX = 16;      // degrees
const DRAG_TILT_GAIN = 26;     // degrees per px/ms of horizontal velocity
let dragTilt = 0;
let dragVx = 0;                // smoothed horizontal velocity (px/ms)
let dragLastX = 0;
let dragLastT = 0;
let dragRafId = null;

function dragTick() {
  if (!dragActive || !dragGhost) return;
  dragVx *= 0.86; // velocity fades when no fresh movement arrives
  const target = Math.max(-DRAG_TILT_MAX, Math.min(DRAG_TILT_MAX, dragVx * DRAG_TILT_GAIN));
  dragTilt += (target - dragTilt) * 0.22;
  dragGhost.style.transform = `rotate(${dragTilt.toFixed(2)}deg) scale(1.06)`;
  dragRafId = requestAnimationFrame(dragTick);
}

// Same legality rules as the engine's PHASE_2 getLegalActions
function legalBeltIdxsFor(handCard) {
  const set = new Set();
  if (!env?.state) return set;
  if (!handCard.isSushi && handCard.actionCard === 'ginger') return set;
  env.state.conveyorBelt.forEach((b, i) => {
    if (b.cardId === handCard.cardId) return;
    if (handCard.isSushi && b.isSushi && handCard.sushiCard === b.sushiCard) return;
    if (!handCard.isSushi && !b.isSushi && handCard.actionCard === b.actionCard) return;
    set.add(i);
  });
  return set;
}

function canDragNow() {
  if (!env || env.state.gameOver || aiThinking || actionChoice) return false;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX) return false;
  return state.phase === Phase.PHASE_1 || state.phase === Phase.PHASE_2;
}

function startDrag(e) {
  const { el, legal } = dragCandidate;
  dragActive = true;
  clearTimeout(lpTimer); lpTimer = null;

  const r = el.getBoundingClientRect();
  dragGhost = el.cloneNode(true);
  dragGhost.className = 'card drag-ghost';
  Object.assign(dragGhost.style, {
    width: r.width + 'px', height: r.height + 'px',
    left: (e.clientX - r.width / 2) + 'px',
    top: (e.clientY - r.height * 0.75) + 'px',
  });
  document.body.appendChild(dragGhost);
  el.classList.add('card--drag-source');

  dragTilt = 0;
  dragVx = 0;
  dragLastX = e.clientX;
  dragLastT = performance.now();
  cancelAnimationFrame(dragRafId);
  dragRafId = requestAnimationFrame(dragTick);

  document.querySelectorAll('#belt-slots .card').forEach((c, i) => {
    if (legal.has(i)) c.classList.add('card--valid-target');
  });
}

function moveDrag(e) {
  if (!dragGhost) return;
  const w = parseFloat(dragGhost.style.width);
  const h = parseFloat(dragGhost.style.height);
  dragGhost.style.left = (e.clientX - w / 2) + 'px';
  dragGhost.style.top = (e.clientY - h * 0.75) + 'px';

  // Blend fresh horizontal velocity into the smoothed value
  const now = performance.now();
  const dt = Math.max(1, now - dragLastT);
  dragVx = dragVx * 0.55 + ((e.clientX - dragLastX) / dt) * 0.45;
  dragLastX = e.clientX;
  dragLastT = now;

  const over = beltTargetAt(e.clientX, e.clientY);
  if (over !== dragHoverEl) {
    dragHoverEl?.classList.remove('card--drop-hover');
    dragHoverEl = over;
    dragHoverEl?.classList.add('card--drop-hover');
  }
}

function beltTargetAt(x, y, cand = dragCandidate) {
  if (!cand) return null;
  const beltCards = [...document.querySelectorAll('#belt-slots .card')];
  const hit = document.elementFromPoint(x, y)?.closest('#belt-slots .card');
  if (!hit) return null;
  return cand.legal.has(beltCards.indexOf(hit)) ? hit : null;
}

function endDrag(e, cancelled = false) {
  const cand = dragCandidate;
  dragCandidate = null;
  if (!dragActive) return;
  dragActive = false;
  suppressNextClick = true;
  cancelAnimationFrame(dragRafId);

  const beltCards = [...document.querySelectorAll('#belt-slots .card')];
  const target = cancelled ? null : beltTargetAt(e.clientX, e.clientY, cand);
  const bIdx = target ? beltCards.indexOf(target) : -1;

  dragGhost?.remove(); dragGhost = null;
  dragHoverEl?.classList.remove('card--drop-hover'); dragHoverEl = null;
  cand.el.classList.remove('card--drag-source');
  beltCards.forEach(c => c.classList.remove('card--valid-target'));

  if (bIdx < 0 || !canDragNow()) { render(); return; }
  executeDragSwap(cand.hIdx, bIdx);
}

function executeDragSwap(hIdx, bIdx) {
  const { state } = env;
  swapIntent = null;
  if (actionChoiceOverlayEl) closeActionChoiceOverlay('cancel', true);

  if (state.phase === Phase.PHASE_1) {
    env.step(0); // skip the pre-swap action phase
    if (env.state.gameOver) { endGame(); return; }
  }
  if (env.state.phase !== Phase.PHASE_2) { render(); return; }

  p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };
  env.step(hIdx * MAX_BELT_SIZE + bIdx);
  if (env.state.gameOver) { endGame(); return; }
  if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
    render(); showDiscardModal(); return;
  }
  render();
  postRenderCheck();
  scheduleTurn();
}

// ── Global pointer handlers: long-press (any face-up card) + drag (hand) ─────
document.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const cardEl = e.target.closest('.card[data-card-name], .sets-card[data-card-name]');
  if (!cardEl) return;

  lpStart = { x: e.clientX, y: e.clientY };
  lpTimer = setTimeout(() => {
    lpTimer = null;
    if (dragActive) return;
    dragCandidate = null;
    suppressNextClick = true;
    showCardViewer(cardEl.dataset.cardName);
  }, LONG_PRESS_MS);

  // Hand cards are also drag candidates
  const handEl = $('player-hand');
  if (handEl.contains(cardEl) && canDragNow() && !cardEl.classList.contains('card--disabled')) {
    const hIdx = [...handEl.children].indexOf(cardEl);
    const card = env.state.players[PLAYER_IDX].hand[hIdx];
    if (card) {
      const legal = legalBeltIdxsFor(card);
      if (legal.size > 0) {
        dragCandidate = { hIdx, card, legal, startX: e.clientX, startY: e.clientY, el: cardEl };
      }
    }
  }
}, true);

document.addEventListener('pointermove', e => {
  if (dragActive) { moveDrag(e); return; }

  const moved = lpStart ? Math.hypot(e.clientX - lpStart.x, e.clientY - lpStart.y) : 0;
  if (lpTimer && moved > LONG_PRESS_SLOP) { clearTimeout(lpTimer); lpTimer = null; }

  if (dragCandidate && !dragActive) {
    const dx = e.clientX - dragCandidate.startX;
    const dy = e.clientY - dragCandidate.startY;
    // Vertical intent starts a drag; horizontal is the hand scrolling
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) startDrag(e);
    else if (Math.abs(dx) > 16) dragCandidate = null;
  }
}, true);

document.addEventListener('pointerup', e => {
  if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
  lpStart = null;
  if (cardViewerEl) hideCardViewer();
  if (dragActive) endDrag(e);
  else dragCandidate = null;
}, true);

document.addEventListener('pointercancel', e => {
  if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
  lpStart = null;
  hideCardViewer();
  if (dragActive) endDrag(e, true);
  else dragCandidate = null;
}, true);

// Swallow the click that follows a long-press or a drag
document.addEventListener('click', e => {
  if (suppressNextClick) {
    suppressNextClick = false;
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

// No native context menu / image callout on cards (long-press is ours)
document.addEventListener('contextmenu', e => {
  if (e.target.closest('.card, .card-back')) e.preventDefault();
});

// Clicking anywhere outside the hand, belt, or controls deselects
// (swapIntent has its own click-away handler already).
// Capture phase: card handlers re-render the hand, which detaches the
// clicked element and would break the closest() containment check.
document.addEventListener('click', e => {
  if (!env || env.state.gameOver) return;
  if (e.target.closest('#player-hand')) return;
  if (e.target.closest('#belt-slots, .controls, .modal-bg, .card-popover')) return;
  let changed = false;
  if (env.state.phase === Phase.PHASE_2 && p2.step === 'SELECT_BELT') {
    p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };
    changed = true;
  }
  if (phase3Selection) {
    phase3Selection = null;
    changed = true;
  }
  if (changed) render();
}, true);

function renderPlayerHand(player, state, isPlayerTurn, phase) {
  const handEl = $('player-hand');
  const prevScroll = handEl.scrollLeft;
  handEl.innerHTML = '';

  const legalActions = isPlayerTurn ? env.getLegalActions() : [];
  const playable = player.hand.filter(c => !c.isSushi && !PASSIVE_ACTION_CARDS.has(c.actionCard));

  player.hand.forEach((card, hIdx) => {
    let selected = false, isPlayable = false, disabled = false;

    if (isPlayerTurn && phase === Phase.PHASE_2) {
      if (p2.step === 'SELECT_HAND') {
        selected  = p2.handIdx === hIdx;
        disabled  = !legalActions.some(a => Math.floor(a / MAX_BELT_SIZE) === hIdx);
      } else {
        // SELECT_BELT: other swappable cards stay enabled so a click switches
        // the selection instead of trapping the player in this state
        selected  = p2.handIdx === hIdx;
        disabled  = !selected && !legalActions.some(a => Math.floor(a / MAX_BELT_SIZE) === hIdx);
      }
    } else if (isPlayerTurn && (phase === Phase.PHASE_1 || phase === Phase.PHASE_3)) {
      if (!card.isSushi && !PASSIVE_ACTION_CARDS.has(card.actionCard)) {
        const idx = playable.indexOf(card);
        isPlayable = idx >= 0 && legalActions.includes(idx + 1);
        if (phase === Phase.PHASE_3) {
          selected = phase3Selection?.card === card;
          disabled = phase3Selection ? (!selected && !isPlayable) : !isPlayable;
        } else {
          // Phase 1
          selected = (actionChoice?.card === card) || (swapIntent?.card === card);
          if (swapIntent) {
            // All non-passive action cards stay enabled so player can change strategy
            disabled = false;
          } else {
            disabled = actionChoice ? !selected : !isPlayable;
          }
        }
      } else {
        // Sushi/passive cards are interactive in Phase 1:
        // clicking deselects swapIntent, or auto-skips to Phase 2 to initiate a swap.
        disabled = phase !== Phase.PHASE_1;
      }
    } else {
      disabled = !isPlayerTurn;
    }

    const el = makeCardEl(card, { selected, playable: isPlayable, disabled });

    if (isPlayerTurn) {
      if (phase === Phase.PHASE_2 && p2.step === 'SELECT_HAND' && !disabled) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => onHandCardClick(hIdx));
      } else if (phase === Phase.PHASE_2 && p2.step === 'SELECT_BELT' && selected) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', onHandCardDeselect);
      } else if (phase === Phase.PHASE_2 && p2.step === 'SELECT_BELT' && !disabled) {
        // Switch the popped-up card to this one
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };
          onHandCardClick(hIdx);
        });
      } else if (phase === Phase.PHASE_3 && isPlayable) {
        el.style.cursor = 'pointer';
        if (phase3Selection?.card === card) {
          el.addEventListener('click', () => onActionCardPlayDirect(card, player));
        } else {
          el.addEventListener('click', () => { phase3Selection = { card }; render(); });
        }
      } else if (phase === Phase.PHASE_1) {
        if (swapIntent?.card === card) {
          el.style.cursor = 'pointer';
          el.addEventListener('click', e => { e.stopPropagation(); swapIntent = null; render(); });
        } else if (!actionChoice) {
          el.style.cursor = 'pointer';
          if (swapIntent) {
            // Clicking another card moves the pop-up to that card
            el.addEventListener('click', e => {
              e.stopPropagation();
              swapIntent = null;
              render();
              if (isPlayable) {
                onActionCardClick(card, player);
              } else if (env && env.state.phase === Phase.PHASE_1) {
                env.step(0);
                render();
                onHandCardClick(hIdx);
              }
            });
          } else if (isPlayable) {
            // Active action card: show play/swap popup
            el.addEventListener('click', () => onActionCardClick(card, player));
          } else {
            // Sushi or passive action card: skip Phase 1 and pre-select for swap
            el.addEventListener('click', () => {
              if (!env || env.state.phase !== Phase.PHASE_1) return;
              env.step(0);
              render();
              onHandCardClick(hIdx);
            });
          }
        }
      }
    }

    handEl.appendChild(el);
  });

  // Keep the hand's scroll position across re-renders; when a new card gets
  // selected, bring it fully into view (the hand scrolls on small screens).
  handEl.scrollLeft = prevScroll;
  const selEl = handEl.querySelector('.card--selected');
  const selIdx = selEl ? [...handEl.children].indexOf(selEl) : -1;
  if (selEl && selIdx !== lastHandSelIdx) {
    selEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
  lastHandSelIdx = selIdx;
}

const PHASE_MSGS = [
  'Play an action card, or skip to swap',
  'Select a hand card, then a belt card to swap',
  'Play another action card, or skip',
  'Call Check to end the game, or end your turn',
];

const PASS_BTN_LABELS = {
  [Phase.PHASE_1]: 'Skip',
  [Phase.PHASE_2]: 'Skip',
  [Phase.PHASE_3]: 'End Turn',
  [Phase.PHASE_4]: 'End Turn',
};

function renderPhaseBar(phase, isPlayerTurn, state) {
  const displayPhase = Math.min(phase, Phase.PHASE_4);
  document.querySelectorAll('.phase-pip').forEach((pip, i) => {
    pip.classList.toggle('phase-pip--active', i === displayPhase);
    pip.classList.toggle('phase-pip--done',   i < displayPhase);
  });

  if (displayPhase !== _lastPhase && _lastPhase !== -1) {
    const bar = document.querySelector('.phase-bar');
    bar.classList.remove('phase-bar--flash');
    void bar.offsetWidth;
    bar.classList.add('phase-bar--flash');
  }
  _lastPhase = displayPhase;

  let msg = '', highlight = false;
  if (swapIntent && isPlayerTurn && phase === Phase.PHASE_1) {
    const n = cardName(swapIntent.card);
    msg = `${CARD_DISPLAY_NAMES[n] ?? n}: select a belt card to swap`;
    highlight = true;
  } else if (phase3Selection && isPlayerTurn && phase === Phase.PHASE_3) {
    const n = cardName(phase3Selection.card);
    msg = `${CARD_DISPLAY_NAMES[n] ?? n}: click again to play`;
    highlight = true;
  } else if (actionChoice && isPlayerTurn && (phase === Phase.PHASE_1 || phase === Phase.PHASE_3)) {
    const n = cardName(actionChoice.card);
    const secondary = phase === Phase.PHASE_1 ? 'Swap' : 'Skip';
    msg = `${CARD_DISPLAY_NAMES[n] ?? n}: choose Play or ${secondary}`;
    highlight = true;
  } else if (phase === Phase.CHEFS_CHOICE_SELECT_CARDS || phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS) {
    msg = isPlayerTurn ? "Chef's Choice — pick 2 cards to return" : "Opponent using Chef's Choice…";
    highlight = isPlayerTurn;
  } else if (phase === Phase.PHASE_DISCARD) {
    msg = isPlayerTurn ? 'Discard a card — hand is over limit' : 'Opponent discarding…';
    highlight = isPlayerTurn;
  } else if (isPlayerTurn) {
    if (phase === Phase.PHASE_4 && !(env?.getLegalActions().includes(1))) {
      msg = 'No complete menu set yet — end your turn';
    } else {
      msg = PHASE_MSGS[phase] ?? 'Waiting…';
    }
    highlight = phase === Phase.PHASE_2;
  } else {
    msg = 'Opponent is thinking…';
  }
  setPhaseMsg(msg, highlight);
}

function renderControls(isPlayerTurn, phase) {
  const passBtn  = $('btn-pass');
  const checkBtn = $('btn-check');

  const canPass  = isPlayerTurn && (phase === Phase.PHASE_1 || phase === Phase.PHASE_3 || phase === Phase.PHASE_4);
  const canCheck = isPlayerTurn && phase === Phase.PHASE_4 && (env?.getLegalActions().includes(1) ?? false);

  passBtn.disabled  = !canPass || !!actionChoice || !!swapIntent;
  checkBtn.disabled = !canCheck || !!actionChoice || !!swapIntent;
  checkBtn.classList.toggle('btn--check-avail', canCheck);
  checkBtn.title = canCheck
    ? 'Call Check — everyone else gets one last turn'
    : 'Complete a menu set to call Check';

  // Dynamic label
  if (canPass) {
    passBtn.textContent = PASS_BTN_LABELS[phase] ?? 'Pass';
  }
}

// Anchored popover next to the tapped action card: Play / Swap (or Skip)
function showActionChoiceOverlay(card, phase) {
  if (actionChoiceOverlayEl) closeActionChoiceOverlay('cancel', true);

  actionChoice = { card, phase };
  render();

  return new Promise(resolve => {
    const anchor = document.querySelector('#player-hand .card--selected');
    const name = cardName(card);

    const pop = document.createElement('div');
    pop.className = 'card-popover';
    pop.setAttribute('role', 'dialog');

    const title = document.createElement('div');
    title.className = 'card-popover__title';
    title.textContent = CARD_DISPLAY_NAMES[name] ?? name;

    const desc = document.createElement('div');
    desc.className = 'card-popover__desc';
    desc.textContent = ACTION_EFFECTS[name] ?? '';

    const actions = document.createElement('div');
    actions.className = 'card-popover__actions';
    const playBtn = document.createElement('button');
    playBtn.className = 'btn btn--salmon btn--sm';
    playBtn.textContent = 'Play';
    const secondaryBtn = document.createElement('button');
    secondaryBtn.className = 'btn btn--secondary btn--sm';
    secondaryBtn.textContent = phase === Phase.PHASE_1 ? 'Swap' : 'Skip';
    actions.append(playBtn, secondaryBtn);

    pop.append(title, desc, actions);
    document.body.appendChild(pop);

    // Position above the card, clamped to the viewport
    const place = () => {
      const a = anchor?.getBoundingClientRect();
      const p = pop.getBoundingClientRect();
      if (!a) {
        pop.style.left = (window.innerWidth - p.width) / 2 + 'px';
        pop.style.top = (window.innerHeight - p.height) / 2 + 'px';
        return;
      }
      let left = a.left + a.width / 2 - p.width / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - p.width - 8));
      let top = a.top - p.height - 10;
      if (top < 8) top = Math.min(a.bottom + 10, window.innerHeight - p.height - 8);
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
    };
    place();

    const onKeydown = e => {
      if (e.key === 'Escape') closeActionChoiceOverlay('cancel');
    };
    const onDocClick = e => {
      if (!pop.contains(e.target)) closeActionChoiceOverlay('cancel');
    };
    const onScrollAway = () => closeActionChoiceOverlay('cancel');

    playBtn.addEventListener('click', () => closeActionChoiceOverlay('play'));
    secondaryBtn.addEventListener('click', () => closeActionChoiceOverlay(phase === Phase.PHASE_1 ? 'exchange' : 'skip'));
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', place);
    $('player-hand').addEventListener('scroll', onScrollAway);
    // Register click-away on the next tick so the opening tap doesn't cancel
    setTimeout(() => document.addEventListener('click', onDocClick), 0);

    actionChoiceOverlayEl = pop;
    actionChoiceResolver = result => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('resize', place);
      $('player-hand').removeEventListener('scroll', onScrollAway);
      resolve(result);
    };
  });
}

function closeActionChoiceOverlay(result = 'cancel', immediate = false) {
  if (!actionChoiceOverlayEl) {
    actionChoice = null;
    return;
  }

  const overlay = actionChoiceOverlayEl;
  const resolver = actionChoiceResolver;
  actionChoiceOverlayEl = null;
  actionChoiceResolver = null;

  const finish = () => {
    overlay.remove();
    actionChoice = null;
    render();
    resolver?.(result);
  };

  if (immediate) {
    finish();
    return;
  }

  overlay.classList.add('card-popover--out');
  setTimeout(finish, 140);
}

// ── Phase 2 handlers ──────────────────────────────────────────────────────────
function onHandCardClick(hIdx) {
  if (!env || p2.step !== 'SELECT_HAND') return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX || state.phase !== Phase.PHASE_2) return;

  if (p2.handIdx === hIdx) { onHandCardDeselect(); return; }

  const legalBeltIdxs = new Set(
    env.getLegalActions()
      .filter(a => Math.floor(a / MAX_BELT_SIZE) === hIdx)
      .map(a => a % MAX_BELT_SIZE)
  );
  if (legalBeltIdxs.size === 0) return;

  p2 = { step: 'SELECT_BELT', handIdx: hIdx, legalBeltIdxs };
  render();
}

function onHandCardDeselect() {
  p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };
  render();
}

function onBeltCardClick(bIdx) {
  if (!env || p2.step !== 'SELECT_BELT') return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX || state.phase !== Phase.PHASE_2) return;
  if (!p2.legalBeltIdxs.has(bIdx)) return;

  const action   = p2.handIdx * MAX_BELT_SIZE + bIdx;
  const handCards = document.querySelectorAll('#player-hand .card');
  const beltCards = document.querySelectorAll('#belt-slots .card');
  const handEl    = handCards[p2.handIdx];
  const beltEl    = beltCards[bIdx];

  p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };

  const afterSwap = () => {
    env.step(action);
    if (env.state.gameOver) { endGame(); return; }
    if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
      render(); showDiscardModal(); return;
    }
    render();
    postRenderCheck();
    scheduleTurn();
  };

  handEl && beltEl ? animateSwap(handEl, beltEl, afterSwap) : afterSwap();
}

// Belt card clicked while player has a swap intent (phase 1 → skip to swap)
function onBeltCardClickWithSwapIntent(bIdx) {
  if (!env || !swapIntent) return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX || state.phase !== Phase.PHASE_1) return;

  const { handIdx } = swapIntent;
  swapIntent = null;

  // Grab DOM elements BEFORE phase transition — hand & belt are the same in phase 2
  const handCards = document.querySelectorAll('#player-hand .card');
  const beltCards = document.querySelectorAll('#belt-slots .card');
  const handEl = handCards[handIdx];
  const beltEl = beltCards[bIdx];

  // Skip phase 1 (action = 0)
  env.step(0);
  if (env.state.gameOver) { endGame(); return; }

  // Drain any wasabi events from the phase 1 skip (shouldn't happen but be safe)
  // Now in phase 2 — execute the swap
  const action = handIdx * MAX_BELT_SIZE + bIdx;
  p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };

  const afterSwap = () => {
    env.step(action);
    if (env.state.gameOver) { endGame(); return; }
    if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
      render(); showDiscardModal(); return;
    }
    render();
    postRenderCheck();
    scheduleTurn();
  };

  handEl && beltEl ? animateSwap(handEl, beltEl, afterSwap) : afterSwap();
}

// Phase 3: play action card directly (no popup — already selected by first click)
async function onActionCardPlayDirect(card, player) {
  if (!env) return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX || state.phase !== Phase.PHASE_3) return;

  phase3Selection = null;

  const playable = player.hand.filter(c => !c.isSushi && !PASSIVE_ACTION_CARDS.has(c.actionCard));
  const idx = playable.indexOf(card);
  if (idx < 0) return;
  const action = idx + 1;
  if (!env.getLegalActions().includes(action)) return;

  await resolveAndPlayActionCard(card, action);
}

// Shared tail of playing an action card: interactive choices (cancellable,
// BEFORE anything commits), then the play animation, then the engine step.
async function resolveAndPlayActionCard(card, action) {
  const { state } = env;
  const name = cardName(card);
  const oppPlayer = state.players[AI_IDX];
  const oppHasCards = !oppPlayer.checkProtected && oppPlayer.hand.length > 0;

  if (name === 'chopsticks' && oppHasCards) {
    const victimIdx = await showPickOppCardModal(
      'Chopsticks — Steal a Card',
      "Pick one of your opponent's face-down cards",
      oppPlayer.hand.length
    );
    if (victimIdx === null) { render(); return; } // cancelled — card stays in hand
    env._nextActionChoices = { victimCardIdx: victimIdx };
  }

  if (name === 'sake' && oppHasCards) {
    const victimIdx = await showPickOppCardModal(
      'Sake — Step 1 of 2',
      'Take a face-down card from your opponent',
      oppPlayer.hand.length
    );
    if (victimIdx === null) { render(); return; }
    // Exclude the sake card itself — engine removes it before looking up returnCardIdx,
    // so the filtered indices map 1:1 to the post-removal hand.
    const handForReturn = state.players[PLAYER_IDX].hand.filter(
      c => !(!c.isSushi && c.actionCard === 'sake')
    );
    const returnIdx = await showSakeReturnModal(handForReturn);
    if (returnIdx === null) { render(); return; }
    env._nextActionChoices = { victimCardIdx: victimIdx, returnCardIdx: returnIdx };
  }

  await playActionCardAnimation(name, CARD_DISPLAY_NAMES[name] ?? name);

  // Capture hand IDs before step so we can find the gained card afterwards
  const preHandIds = (name === 'chopsticks' || name === 'sake')
    ? new Set(state.players[PLAYER_IDX].hand.map(c => c.cardId))
    : null;
  const forkPreIds = name === 'fork'
    ? new Set(state.players[AI_IDX].hand.map(c => c.cardId))
    : null;

  env.step(action);
  if (env.state.gameOver) { endGame(); return; }

  // Reveal the card gained from the opponent
  if (preHandIds) {
    const gained = env.state.players[PLAYER_IDX].hand.find(c => !preHandIds.has(c.cardId));
    if (gained) await revealCardAnimation(gained, 'You received');
  }
  if (forkPreIds) await revealForkLoss(AI_IDX, forkPreIds);

  await drainWasabiEvents();

  if (env.state.phase === Phase.CHEFS_CHOICE_SELECT_CARDS && env.state.currentPlayer === PLAYER_IDX) {
    render();
    const drawn = env.state.chefChoiceDrawnCards ?? [];
    if (drawn.length > 0) await revealCardsAnimation(drawn, "Chef's Choice — you drew:");
    showChefsChoiceModal();
    return;
  }
  if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
    render(); showDiscardModal(); return;
  }

  render();
  postRenderCheck();
}

// ── Action card handler ───────────────────────────────────────────────────────
async function onActionCardClick(card, player) {
  if (!env) return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX) return;
  if (state.phase !== Phase.PHASE_1 && state.phase !== Phase.PHASE_3) return;

  const playable = player.hand.filter(c => !c.isSushi && !PASSIVE_ACTION_CARDS.has(c.actionCard));
  const idx = playable.indexOf(card);
  if (idx < 0) return;
  const action = idx + 1;
  if (!env.getLegalActions().includes(action)) return;

  const choice = await showActionChoiceOverlay(card, state.phase);
  if (choice !== 'play') {
    if (choice === 'exchange' && state.phase === Phase.PHASE_1) {
      // Mark this card for swap — don't advance phase yet, wait for belt card click
      const handIdx = state.players[PLAYER_IDX].hand.indexOf(card);
      swapIntent = { card, handIdx };
      render();
      // Click anywhere other than a belt target or the selected card deselects
      setTimeout(() => {
        document.addEventListener('click', function swapClickAway() {
          document.removeEventListener('click', swapClickAway);
          if (swapIntent) { swapIntent = null; render(); }
        });
      }, 0);
    } else if (choice === 'skip') {
      await onPassOrCheck(0);
    }
    return;
  }

  // Fork: auto-picks most expensive card — no player choice needed
  await resolveAndPlayActionCard(card, action);
}

// ── Pass / Check handler ──────────────────────────────────────────────────────
async function onPassOrCheck(action) {
  if (!env) return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX) return;
  const { phase } = state;

  swapIntent = null;
  phase3Selection = null;
  if (actionChoiceOverlayEl) closeActionChoiceOverlay('cancel', true);

  if (phase !== Phase.PHASE_1 && phase !== Phase.PHASE_3 && phase !== Phase.PHASE_4) return;
  if (action === 1 && !env.getLegalActions().includes(1)) return;

  const prevBelt = phase === Phase.PHASE_4 ? capturePreStepBelt() : null;
  env.step(action);
  if (env.state.gameOver) { endGame(); return; }

  if (prevBelt) {
    checkAndSetBeltAnim(prevBelt);
    render();
    if (beltDealIn) await animateBeltDeal();
  }

  await drainWasabiEvents();

  if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
    render(); showDiscardModal(); return;
  }

  render();
  postRenderCheck();
  scheduleTurn();
}

// ── Chef's Choice modal (card selection) ──────────────────────────────────────
function showChefsChoiceModal() {
  const player = env.state.players[PLAYER_IDX];
  chefsSelectedIndices = [];
  $('chefs-modal-instr').textContent = 'Select 2 cards to return to the deck';
  $('chefs-select-count').textContent = '0 / 2 selected';
  $('btn-chefs-confirm').disabled = true;

  const cardsEl = $('chefs-modal-cards');
  cardsEl.innerHTML = '';
  player.hand.forEach((card, idx) => {
    const el = makeCardEl(card);
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => onChefsModalCardClick(idx, cardsEl));
    cardsEl.appendChild(el);
  });

  $('chefs-modal-bg').hidden = false;
}

function onChefsModalCardClick(idx, cardsEl) {
  if (!env || env.state.phase !== Phase.CHEFS_CHOICE_SELECT_CARDS) return;

  const cardEls = cardsEl.querySelectorAll('.card');
  const selPos  = chefsSelectedIndices.indexOf(idx);

  if (selPos >= 0) {
    chefsSelectedIndices.splice(selPos, 1);
    cardEls[idx]?.classList.remove('card--selected');
  } else if (chefsSelectedIndices.length < 2) {
    chefsSelectedIndices.push(idx);
    cardEls[idx]?.classList.add('card--selected');
  }

  $('chefs-select-count').textContent = `${chefsSelectedIndices.length} / 2 selected`;
  $('btn-chefs-confirm').disabled = chefsSelectedIndices.length !== 2;
}

function onChefsConfirm() {
  if (!env || env.state.phase !== Phase.CHEFS_CHOICE_SELECT_CARDS) return;
  if (chefsSelectedIndices.length !== 2) return;

  const sorted = [...chefsSelectedIndices].sort((a, b) => b - a);
  env.step(sorted[0]);
  env.step(sorted[1]);

  chefsSelectedIndices = [];
  $('chefs-modal-bg').hidden = true;

  if (env.state.phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS) {
    render();
    showChefsPositionModal();
    return;
  }

  if (env.state.gameOver) { endGame(); return; }
  render();
  postRenderCheck();
  scheduleTurn();
}

// ── Chef's Choice position modal ──────────────────────────────────────────────
// Visual deck strip: tap or drag on the face-down stack to slot each card
// anywhere in the deck. A caption translates the raw position into what it
// means at the table (cards are dealt top-first: belt, opponent, belt, you…).
function chefsPosLabel(k, deckLen) {
  if (deckLen === 0) return 'Top of the deck';
  if (k >= deckLen)  return `Bottom of the deck (${deckLen} cards deep)`;
  if (k === 0) return 'Top — next card dealt to the belt';
  if (k === 1) return "Opponent's next draw";
  if (k === 2) return 'Dealt to the belt after opponent’s turn';
  if (k === 3) return 'Your next draw';
  return `${k} cards deep`;
}

function showChefsPositionModal() {
  const cards   = env.state.chefChoiceSelectedCards;
  const deckLen = env.state.deck.length;
  const positions = [0, deckLen]; // sensible defaults: one on top, one at the bottom
  let active = 0;

  $('chefs-pos-modal-instr').textContent = deckLen === 0
    ? 'The deck is empty — both cards go back on top.'
    : 'Select a card, then tap or drag on the deck to slide it in anywhere.';

  const body = $('chefs-pos-modal-body');
  body.innerHTML = '';

  // Card thumbnails — click to choose which card you are placing
  const thumbsRow = document.createElement('div');
  thumbsRow.className = 'chefs-place-thumbs';
  const thumbEls = cards.map((card, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chefs-place-thumb';
    const cardEl = makeCardEl(card);
    cardEl.style.cssText = 'width:72px;height:100px;pointer-events:none;';
    const lbl = document.createElement('span');
    lbl.className = 'chefs-place-thumb__label';
    btn.append(cardEl, lbl);
    btn.addEventListener('click', () => { active = i; update(); });
    thumbsRow.appendChild(btn);
    return { btn, lbl };
  });

  // Deck strip with side rails and per-card insertion markers
  const stripWrap = document.createElement('div');
  stripWrap.className = 'deck-strip';
  const railTop = document.createElement('span');
  railTop.className = 'deck-strip__rail';
  railTop.textContent = 'Top';
  const railBottom = document.createElement('span');
  railBottom.className = 'deck-strip__rail';
  railBottom.textContent = 'Bottom';

  const stack = document.createElement('div');
  stack.className = 'deck-strip__stack';
  const markers = cards.map((card, i) => {
    const m = document.createElement('div');
    m.className = 'deck-marker' + (i === 1 ? ' deck-marker--right' : '');
    const bar = document.createElement('span');
    bar.className = 'deck-marker__bar';
    const chip = document.createElement('span');
    chip.className = 'deck-marker__chip';
    const img = document.createElement('img');
    img.src = cardImg(cardName(card));
    img.alt = '';
    img.draggable = false;
    chip.appendChild(img);
    m.append(bar, chip);
    stack.appendChild(m);
    return m;
  });

  const caption = document.createElement('p');
  caption.className = 'deck-strip__caption';
  const hint = document.createElement('p');
  hint.className = 'deck-strip__hint';
  hint.textContent = deckLen > 0 ? 'Assumes no skipped turns or extra draws.' : '';

  // Quick chips for the active card
  const chips = document.createElement('div');
  chips.className = 'deck-strip__chips';
  const mkChip = (label, pos) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn--secondary btn--sm';
    b.textContent = label;
    b.addEventListener('click', () => { positions[active] = pos; update(); });
    return b;
  };
  chips.append(mkChip('Top', 0), mkChip('Bottom', deckLen));

  stripWrap.append(railTop, stack, railBottom);
  body.append(thumbsRow, stripWrap, caption, hint, chips);

  function update() {
    thumbEls.forEach(({ btn, lbl }, i) => {
      btn.classList.toggle('chefs-place-thumb--active', i === active);
      lbl.textContent = positions[i] === 0 ? 'Top'
        : positions[i] >= deckLen ? 'Bottom'
        : `${positions[i]} deep`;
    });
    markers.forEach((m, i) => {
      m.style.top = (deckLen === 0 ? 0 : (positions[i] / deckLen) * 100) + '%';
      m.classList.toggle('deck-marker--active', i === active);
    });
    caption.textContent = `${CARD_DISPLAY_NAMES[cardName(cards[active])] ?? ''}: ${chefsPosLabel(positions[active], deckLen)}`;
  }

  // Tap or drag anywhere on the stack to place the active card
  const posFromEvent = e => {
    const r = stack.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    return Math.round(frac * deckLen);
  };
  let placing = false;
  stack.addEventListener('pointerdown', e => {
    placing = true;
    stack.setPointerCapture(e.pointerId);
    positions[active] = posFromEvent(e);
    update();
  });
  stack.addEventListener('pointermove', e => {
    if (!placing) return;
    positions[active] = posFromEvent(e);
    update();
  });
  const stopPlacing = () => { placing = false; };
  stack.addEventListener('pointerup', stopPlacing);
  stack.addEventListener('pointercancel', stopPlacing);

  update();

  const confirmBtn = $('btn-chefs-pos-confirm');
  confirmBtn.onclick = () => {
    env.step(positions[0]);
    env.step(positions[1]);

    $('chefs-pos-modal-bg').hidden = true;

    if (env.state.gameOver) { endGame(); return; }
    render();
    postRenderCheck();
    scheduleTurn();
  };

  $('chefs-pos-modal-bg').hidden = false;
}

// ── Pick opponent card modal (cancellable — cancel aborts playing the card) ──
function showPickOppCardModal(title, instr, numCards) {
  return new Promise(resolve => {
    $('pick-opp-modal-title').textContent = title;
    $('pick-opp-modal-instr').textContent = instr;

    const container = $('pick-opp-modal-cards');
    container.innerHTML = '';

    const finish = result => {
      $('pick-opp-modal-bg').hidden = true;
      document.removeEventListener('keydown', onKeydown);
      $('btn-pick-opp-cancel').onclick = null;
      $('pick-opp-modal-bg').onclick = null;
      resolve(result);
    };
    const onKeydown = e => { if (e.key === 'Escape') finish(null); };

    for (let i = 0; i < numCards; i++) {
      const back = makeCardBackEl(true); // large back card
      back.style.cursor = 'pointer';
      back.addEventListener('click', () => finish(i));
      container.appendChild(back);
    }

    $('btn-pick-opp-cancel').onclick = () => finish(null);
    $('pick-opp-modal-bg').onclick = e => {
      if (e.target === $('pick-opp-modal-bg')) finish(null);
    };
    document.addEventListener('keydown', onKeydown);

    $('pick-opp-modal-bg').hidden = false;
  });
}

// ── Sake return modal (cancellable — cancel aborts the whole Sake play) ──────
function showSakeReturnModal(hand) {
  return new Promise(resolve => {
    const container = $('sake-return-modal-cards');
    container.innerHTML = '';

    const finish = result => {
      $('sake-return-modal-bg').hidden = true;
      document.removeEventListener('keydown', onKeydown);
      $('btn-sake-return-cancel').onclick = null;
      resolve(result);
    };
    const onKeydown = e => { if (e.key === 'Escape') finish(null); };

    hand.forEach((card, idx) => {
      const el = makeCardEl(card);
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => finish(idx));
      container.appendChild(el);
    });

    $('btn-sake-return-cancel').onclick = () => finish(null);
    document.addEventListener('keydown', onKeydown);

    $('sake-return-modal-bg').hidden = false;
  });
}

// ── Discard modal (PHASE_DISCARD for human player) ────────────────────────────
function showDiscardModal() {
  if (!env || env.state.phase !== Phase.PHASE_DISCARD || env.state.currentPlayer !== PLAYER_IDX) return;
  const player = env.state.players[PLAYER_IDX];
  const excess = player.hand.length - player.maxHandSize;

  $('discard-modal-instr').textContent =
    `Hand limit: ${player.maxHandSize}. You have ${player.hand.length}. Discard ${excess} card${excess !== 1 ? 's' : ''}.`;

  const cardsEl = $('discard-modal-cards');
  cardsEl.innerHTML = '';

  player.hand.forEach((card, idx) => {
    const el = makeCardEl(card);
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      env.step(idx);

      if (env.state.gameOver) { $('discard-modal-bg').hidden = true; endGame(); return; }

      if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
        // Need more discards — refresh modal
        $('discard-modal-bg').hidden = true;
        render();
        showDiscardModal();
      } else {
        $('discard-modal-bg').hidden = true;
        render();
        postRenderCheck();
        scheduleTurn();
      }
    });
    cardsEl.appendChild(el);
  });

  $('discard-modal-bg').hidden = false;
}

// ── Trash viewer modal ────────────────────────────────────────────────────────
function showTrashModal() {
  if (!env || !env.state) return;
  const trash = env.state.trash;
  $('trash-modal-count').textContent = `${trash.length} card${trash.length !== 1 ? 's' : ''}`;

  const container = $('trash-modal-cards');
  container.innerHTML = '';

  // Show most recent first; cards stay interactive so press-and-hold inspects them
  [...trash].reverse().forEach(card => {
    const el = makeCardEl(card, {});
    el.style.cursor = 'zoom-in';
    container.appendChild(el);
  });

  $('trash-modal-bg').hidden = false;
}

// ── Auto-advance through trivial phases ───────────────────────────────────────
function postRenderCheck() {
  if (!env || env.state.gameOver || aiThinking) return;
  const { state } = env;
  if (state.currentPlayer !== PLAYER_IDX) return;

  const { phase } = state;
  const legal = env.getLegalActions();

  if ((phase === Phase.PHASE_1 || phase === Phase.PHASE_3) && legal.length === 1 && legal[0] === 0) {
    env.step(0);
    if (env.state.gameOver) { endGame(); return; }
    if (env.state.phase === Phase.PHASE_DISCARD && env.state.currentPlayer === PLAYER_IDX) {
      render(); showDiscardModal(); return;
    }
    render();
    postRenderCheck();
    scheduleTurn();
    return;
  }

  if (phase === Phase.PHASE_2 && legal.length === 1 && legal[0] === 0) {
    toast('No valid swaps available');
    setTimeout(() => {
      if (!env || env.state.gameOver) return;
      env.step(0);
      if (env.state.gameOver) { endGame(); return; }
      render();
      postRenderCheck();
      scheduleTurn();
    }, 900);
    return;
  }

  if (phase === Phase.PHASE_4 && legal.length === 1 && legal[0] === 0) {
    setTimeout(() => {
      if (!env || env.state.gameOver || env.state.currentPlayer !== PLAYER_IDX) return;
      const prevBelt = capturePreStepBelt();
      env.step(0);
      checkAndSetBeltAnim(prevBelt);
      if (env.state.gameOver) { endGame(); return; }
      render();
      if (beltDealIn) {
        animateBeltDeal().then(() => { postRenderCheck(); scheduleTurn(); });
      } else {
        postRenderCheck();
        scheduleTurn();
      }
    }, 400);
    return;
  }
}

// ── Turn scheduling ───────────────────────────────────────────────────────────
function scheduleTurn() {
  if (!env || env.state.gameOver) return;
  const { state } = env;

  if (state.phase === Phase.PHASE_DISCARD) {
    if (state.currentPlayer === PLAYER_IDX) {
      showDiscardModal();
    } else {
      runAiDiscard();
    }
    return;
  }

  if (state.phase === Phase.CHEFS_CHOICE_SELECT_CARDS || state.phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS) {
    if (state.currentPlayer !== PLAYER_IDX) {
      runAiChefsChoice();
      return;
    }
    return;
  }

  if (state.currentPlayer !== PLAYER_IDX) {
    runAiTurn();
  }
}

function runAiChefsChoice() {
  while (!env.state.gameOver &&
    (env.state.phase === Phase.CHEFS_CHOICE_SELECT_CARDS ||
     env.state.phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS)) {
    env.step(agent.chooseAction(env, env.getLegalActions()));
  }
  if (env.state.gameOver) { endGame(); return; }
  render();
  scheduleTurn();
}

async function runAiDiscard() {
  if (!env || env.state.gameOver) return;
  await delay(400);
  while (!env.state.gameOver && env.state.phase === Phase.PHASE_DISCARD) {
    const aiPlayer = env.state.players[env.state.currentPlayer];
    env.step(agent.chooseAction(env, env.getLegalActions()));
    render();
  }
  if (env.state.gameOver) { endGame(); return; }
  postRenderCheck();
  scheduleTurn();
}

async function runAiTurn() {
  if (!env || env.state.gameOver) return;
  swapIntent = null;
  phase3Selection = null;
  if (actionChoiceOverlayEl) closeActionChoiceOverlay('cancel', true);
  (selectedAgent === 'mcts' || selectedAgent === 'mcts2') ? await runMctsAiTurn() : await runSyncAiTurn();
}

async function runSyncAiTurn() {
  aiThinking = true;
  render();
  await delay(800);

  while (!env.state.gameOver && env.state.currentPlayer === AI_IDX) {
    await drainWasabiEvents();
    const { phase } = env.state;
    const legal = env.getLegalActions();
    const action = agent.chooseAction(env, legal);

    if (phase === Phase.PHASE_DISCARD) {
      await delay(1200);
      env.step(action);
      render();
      continue;
    }

    if (phase === Phase.CHEFS_CHOICE_SELECT_CARDS || phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS) {
      await delay(1000);
      env.step(action);
      render();
      continue;
    }

    if (phase === Phase.PHASE_1 || phase === Phase.PHASE_3) {
      let forkPreIds = null;
      if (action !== 0) {
        const aiPlayer = env.state.players[AI_IDX];
        const playable = aiPlayer.hand.filter(c => !c.isSushi && !PASSIVE_ACTION_CARDS.has(c.actionCard));
        const card = playable[action - 1];
        if (card) {
          const name = cardName(card);
          if (name === 'fork') forkPreIds = new Set(env.state.players[PLAYER_IDX].hand.map(c => c.cardId));
          setPhaseMsg(`Opponent plays ${CARD_DISPLAY_NAMES[name] ?? name}…`, true);
          await playActionCardAnimation(name, CARD_DISPLAY_NAMES[name] ?? name, 2800);
        }
      } else {
        setPhaseMsg('Opponent skips action…');
        await delay(1500);
      }
      env.step(action);
      render();
      if (forkPreIds) await revealForkLoss(PLAYER_IDX, forkPreIds);

    } else if (phase === Phase.PHASE_2) {
      const hIdx = Math.floor(action / MAX_BELT_SIZE);
      const bIdx = action % MAX_BELT_SIZE;

      // Step 1: lift and highlight the chosen hand card
      setPhaseMsg('Opponent picks a card from hand…');
      const handCards = document.querySelectorAll('#opp-hand .card-back');
      const handEl = handCards[hIdx];
      if (handEl) handEl.classList.add('card-back--ai-pick');
      await delay(2500);

      // Step 2: highlight the belt target with a pulsing ring
      setPhaseMsg('Opponent targets a belt card…');
      const beltCards = document.querySelectorAll('#belt-slots .card');
      const targetEl = beltCards[bIdx];
      if (targetEl) targetEl.classList.add('card--ai-target');
      await delay(2500);

      // Step 3: remove highlights and animate swap
      if (handEl) handEl.classList.remove('card-back--ai-pick');
      if (targetEl) targetEl.classList.remove('card--ai-target');

      const doStep = () => { env.step(action); render(); };
      if (handEl && targetEl) {
        await new Promise(resolve => animateSwap(handEl, targetEl, () => { doStep(); resolve(); }));
      } else {
        doStep();
        await delay(200);
      }

    } else if (phase === Phase.PHASE_4) {
      setPhaseMsg('Opponent ends their turn…');
      await delay(1800);
      const prevBelt = capturePreStepBelt();
      env.step(action);
      checkAndSetBeltAnim(prevBelt);
      if (action === 1) toast('Opponent calls Check!');
      render();
      if (beltDealIn) await animateBeltDeal();
      await drainWasabiEvents();

    } else {
      env.step(action);
      render();
    }
  }

  aiThinking = false;
  if (env.state.gameOver) { endGame(); return; }
  await drainWasabiEvents();
  render();
  postRenderCheck();
}

async function runMctsAiTurn() {
  const greedy = new SimpleGreedyAgent();
  while (!env.state.gameOver && env.state.currentPlayer === AI_IDX) {
    await drainWasabiEvents();
    const { phase } = env.state;
    const legal = env.getLegalActions();

    if (phase === Phase.PHASE_DISCARD) {
      await delay(300);
      env.step(agent.chooseAction(env, legal));
      render();
      continue;
    }

    if (phase === Phase.CHEFS_CHOICE_SELECT_CARDS || phase === Phase.CHEFS_CHOICE_SELECT_POSITIONS) {
      await delay(600);
      env.step(greedy.chooseAction(env, legal));
      render();
      continue;
    }

    if (phase === Phase.PHASE_1 || phase === Phase.PHASE_3) {
      const action = greedy.chooseAction(env, legal);
      let forkPreIds = null;
      if (action !== 0) {
        const aiPlayer = env.state.players[AI_IDX];
        const playable = aiPlayer.hand.filter(c => !c.isSushi && !PASSIVE_ACTION_CARDS.has(c.actionCard));
        const card = playable[action - 1];
        if (card) {
          const name = cardName(card);
          if (name === 'fork') forkPreIds = new Set(env.state.players[PLAYER_IDX].hand.map(c => c.cardId));
          setPhaseMsg(`Opponent plays ${CARD_DISPLAY_NAMES[name] ?? name}…`, true);
          await playActionCardAnimation(name, CARD_DISPLAY_NAMES[name] ?? name, 2000);
        }
      } else {
        await delay(300);
      }
      env.step(action);
      render();
      if (forkPreIds) await revealForkLoss(PLAYER_IDX, forkPreIds);

    } else if (phase === Phase.PHASE_2) {
      showThinking(true);
      const action = await getMctsAction(structuredClone(env.state), legal);
      showThinking(false);

      const hIdx = Math.floor(action / MAX_BELT_SIZE);
      const bIdx = action % MAX_BELT_SIZE;

      setPhaseMsg('Opponent picks a card from hand…');
      const handCards = document.querySelectorAll('#opp-hand .card-back');
      const handEl = handCards[hIdx];
      if (handEl) handEl.classList.add('card-back--ai-pick');
      await delay(1200);

      setPhaseMsg('Opponent targets a belt card…');
      const beltCards = document.querySelectorAll('#belt-slots .card');
      const targetEl = beltCards[bIdx];
      if (targetEl) targetEl.classList.add('card--ai-target');
      await delay(1200);

      if (handEl) handEl.classList.remove('card-back--ai-pick');
      if (targetEl) targetEl.classList.remove('card--ai-target');

      const doStep = () => { env.step(action); render(); };
      if (handEl && targetEl) {
        await new Promise(resolve => animateSwap(handEl, targetEl, () => { doStep(); resolve(); }));
      } else {
        doStep();
        await delay(200);
      }

    } else if (phase === Phase.PHASE_4) {
      await delay(600);
      const action = greedy.chooseAction(env, legal);
      const prevBelt = capturePreStepBelt();
      env.step(action);
      checkAndSetBeltAnim(prevBelt);
      if (action === 1) toast('Opponent calls Check!');
      render();
      if (beltDealIn) await animateBeltDeal();
      await drainWasabiEvents();

    } else {
      env.step(greedy.chooseAction(env, legal));
      render();
    }
  }
  if (env.state.gameOver) { endGame(); return; }
  render();
  postRenderCheck();
}

// Never let a broken/slow worker wedge the game: requests are id-tagged so a
// stale reply can't resolve a newer turn, and errors/timeouts fall back to
// the greedy agent.
const MCTS_TIMEOUT_MS = 20000;
let mctsReqId = 0;

function getMctsAction(stateSnapshot, legalActions) {
  return new Promise(resolve => {
    const reqId = ++mctsReqId;
    let settled = false;
    const finish = action => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(action);
    };
    const fallback = () => {
      if (settled) return;
      toast('AI is unavailable — using a quicker strategy');
      finish(new SimpleGreedyAgent().chooseAction(env, legalActions));
    };
    const timer = setTimeout(fallback, MCTS_TIMEOUT_MS);

    mctsWorker.onmessage = e => {
      if (e.data.type === 'result' && e.data.reqId === reqId) finish(e.data.action);
    };
    mctsWorker.onerror = fallback;
    mctsWorker.postMessage({
      type: 'choose',
      envState: stateSnapshot,
      turnCount: env.turnCount,
      numPlayers: env.numPlayers,
      legalActions,
      nSimulations: mctsNSims,
      timeBudgetMs: 0,
      agentType: selectedAgent,
      reqId,
    });
  });
}

let thinkingTimer = null;
function showThinking(show) {
  aiThinking = show;
  clearTimeout(thinkingTimer);
  if (show) {
    // Only surface the overlay when the AI actually takes a moment
    thinkingTimer = setTimeout(() => {
      if (aiThinking) $('thinking-overlay').hidden = false;
    }, 350);
  } else {
    thinkingTimer = null;
    $('thinking-overlay').hidden = true;
  }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Belt deal animation helpers ───────────────────────────────────────────────
function capturePreStepBelt() {
  return env?.state?.conveyorBelt.map(c => c.cardId) ?? [];
}

function checkAndSetBeltAnim(prevBeltIds) {
  if (!env?.state) return;
  const newBelt = env.state.conveyorBelt;
  if (newBelt.length === 0) return;
  const newFirstId = newBelt[0]?.cardId;
  const oldFirstId = prevBeltIds[0];
  if (newFirstId !== oldFirstId) beltDealIn = newBelt[0];
}

async function animateBeltDeal() {
  const newCard = beltDealIn;
  beltDealIn = null;
  beltDealAnimating = true;

  const deckEl  = $('deck-pile');
  const beltEl  = $('belt-slots');
  const firstSlot = beltEl?.querySelector('.belt-slot');
  if (!deckEl || !firstSlot) { beltDealAnimating = false; return; }

  const deckRect = deckEl.getBoundingClientRect();
  const slotRect = firstSlot.getBoundingClientRect();

  // Flying card-back clone starting at deck pile position
  const flying = document.createElement('div');
  flying.className = 'card';
  Object.assign(flying.style, {
    position: 'fixed', margin: '0', zIndex: '1000', pointerEvents: 'none',
    width:  deckRect.width  + 'px',
    height: deckRect.height + 'px',
    top:  deckRect.top  + 'px',
    left: deckRect.left + 'px',
    overflow: 'hidden', borderRadius: 'var(--card-r)', transition: 'none',
  });
  const flyImg = document.createElement('img');
  flyImg.src = BACK_IMG;
  flyImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
  flying.appendChild(flyImg);
  document.body.appendChild(flying);

  // Animate to belt slot 0
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  flying.style.transition =
    'top 370ms cubic-bezier(.2,.8,.4,1), left 370ms cubic-bezier(.2,.8,.4,1),' +
    'width 370ms cubic-bezier(.2,.8,.4,1), height 370ms cubic-bezier(.2,.8,.4,1)';
  flying.style.top    = slotRect.top  + 'px';
  flying.style.left   = slotRect.left + 'px';
  flying.style.width  = slotRect.width  + 'px';
  flying.style.height = slotRect.height + 'px';
  await delay(370);

  // Flip to reveal: scaleX 1 → 0 (half-turn)
  flying.style.transition = 'transform 110ms ease-in';
  flying.style.transform  = 'scaleX(0)';
  await delay(110);

  // Swap to front face during the "edge" moment
  flyImg.src = cardImg(cardName(newCard));
  flyImg.onerror = () => { flyImg.style.visibility = 'hidden'; };
  if (!newCard.isSushi) {
    flying.classList.add(PASSIVE_ACTION_CARDS.has(newCard.actionCard) ? 'card--passive' : 'card--action');
  }

  // Flip: scaleX 0 → 1 (second half)
  flying.style.transition = 'transform 110ms ease-out';
  flying.style.transform  = 'scaleX(1)';
  await delay(110);

  // Reveal the real belt slot 0 card and remove flying clone
  flying.remove();
  const targetCard = firstSlot.querySelector('[data-deal-target]');
  if (targetCard) {
    targetCard.style.opacity = '';
    delete targetCard.dataset.dealTarget;
  }

  beltDealAnimating = false;
}

// ── Action card play animation ────────────────────────────────────────────────
function playActionCardAnimation(name, displayName, holdMs = 1640) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'action-play-overlay';

    const inner = document.createElement('div');
    inner.className = 'action-play-inner';

    const bigCard = document.createElement('div');
    bigCard.className = 'action-play-card';

    const cardImgEl = document.createElement('img');
    cardImgEl.src = cardImg(name);
    cardImgEl.className = 'action-play-img';
    cardImgEl.onerror = () => { cardImgEl.style.visibility = 'hidden'; };
    bigCard.appendChild(cardImgEl);

    const cardNameEl = document.createElement('div');
    cardNameEl.className = 'action-play-card-name';
    cardNameEl.textContent = displayName;

    const desc = document.createElement('div');
    desc.className = 'action-play-desc';
    desc.textContent = ACTION_EFFECTS[name] ?? 'Action card played';

    inner.appendChild(bigCard);
    inner.appendChild(cardNameEl);
    inner.appendChild(desc);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add('action-play-overlay--out');
      setTimeout(() => { overlay.remove(); resolve(); }, 310);
    }, holdMs);
  });
}

// ── Card reveal — single card, starts face-down then flips ───────────────────
function revealCardAnimation(card, header = 'You received') {
  const name = cardName(card);
  const displayName = CARD_DISPLAY_NAMES[name] ?? name;

  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'action-play-overlay';

    const inner = document.createElement('div');
    inner.className = 'action-play-inner';

    const headerEl = document.createElement('div');
    headerEl.className = 'action-play-desc';
    headerEl.textContent = header;

    const cardEl = document.createElement('div');
    cardEl.className = 'action-play-card';
    cardEl.style.transformOrigin = 'center';

    const img = document.createElement('img');
    img.src = BACK_IMG;
    img.className = 'action-play-img';
    cardEl.appendChild(img);

    const nameEl = document.createElement('div');
    nameEl.className = 'action-play-card-name';
    nameEl.textContent = '?';

    inner.append(headerEl, cardEl, nameEl);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Flip to face-up after 650ms
    setTimeout(() => {
      cardEl.style.transition = 'transform 130ms ease-in';
      cardEl.style.transform = 'scaleX(0)';
      setTimeout(() => {
        img.src = cardImg(name);
        img.onerror = () => { img.style.visibility = 'hidden'; };
        if (!card.isSushi)
          cardEl.classList.add(PASSIVE_ACTION_CARDS.has(card.actionCard) ? 'card--passive' : 'card--action');
        nameEl.textContent = displayName;
        cardEl.style.transition = 'transform 130ms ease-out';
        cardEl.style.transform = 'scaleX(1)';
        // Fade out after showing face
        setTimeout(() => {
          overlay.classList.add('action-play-overlay--out');
          setTimeout(() => { overlay.remove(); resolve(); }, 310);
        }, 1100);
      }, 130);
    }, 650);
  });
}

// ── Card reveal — multiple cards, staggered flip (for Chef's Choice) ──────────
function revealCardsAnimation(cards, header = "You drew:") {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'action-play-overlay';

    const inner = document.createElement('div');
    inner.className = 'action-play-inner';

    const headerEl = document.createElement('div');
    headerEl.className = 'action-play-card-name';
    headerEl.textContent = header;

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;align-items:center;margin-top:4px;';

    const entries = cards.map(c => {
      const wrap = document.createElement('div');
      wrap.className = 'action-play-card';
      wrap.style.cssText = 'width:100px;height:140px;transform-origin:center;flex-shrink:0;';
      const img = document.createElement('img');
      img.src = BACK_IMG;
      img.className = 'action-play-img';
      wrap.appendChild(img);
      row.appendChild(wrap);
      return { wrap, img, card: c };
    });

    inner.append(headerEl, row);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Stagger the flip of each card by 280ms
    entries.forEach(({ wrap, img, card: c }, i) => {
      const name = cardName(c);
      setTimeout(() => {
        wrap.style.transition = 'transform 120ms ease-in';
        wrap.style.transform = 'scaleX(0)';
        setTimeout(() => {
          img.src = cardImg(name);
          img.onerror = () => { img.style.visibility = 'hidden'; };
          if (!c.isSushi)
            wrap.classList.add(PASSIVE_ACTION_CARDS.has(c.actionCard) ? 'card--passive' : 'card--action');
          wrap.style.transition = 'transform 120ms ease-out';
          wrap.style.transform = 'scaleX(1)';
        }, 120);
      }, 300 + i * 300);
    });

    const totalMs = 300 + (cards.length - 1) * 300 + 240 + 1200;
    setTimeout(() => {
      overlay.classList.add('action-play-overlay--out');
      setTimeout(() => { overlay.remove(); resolve(); }, 310);
    }, totalMs);
  });
}

// ── Fork result — show which card the victim lost ─────────────────────────────
async function revealForkLoss(victimIdx, preIds) {
  const vp = env.state.players[victimIdx];
  const lostId = [...preIds].find(id => !vp.hand.some(c => c.cardId === id));
  if (lostId == null) return;
  const lost = env.state.trash.find(c => c.cardId === lostId);
  if (lost) {
    await revealCardAnimation(lost, victimIdx === PLAYER_IDX ? 'Fork! You lost' : 'Fork! Opponent lost');
  }
}

// ── Wasabi events — drain and show notifications ──────────────────────────────
async function drainWasabiEvents() {
  if (!env?.state?.wasabiEvents?.length) return;
  const events = env.state.wasabiEvents.splice(0);
  for (const ev of events) {
    if (ev.type === 'draw') {
      const isPlayer = ev.playerIdx === PLAYER_IDX;
      const drawn = env.state.players[ev.playerIdx].hand.find(c => !c.isSushi && c.actionCard === 'wasabi');
      if (drawn) {
        const header = isPlayer ? 'You drew Wasabi!' : 'Opponent drew Wasabi!';
        await revealCardAnimation(drawn, header);
      }
      const skipWho = isPlayer ? 'your' : "opponent's";
      toast(`Wasabi! ${isPlayer ? 'Your' : "Opponent's"} next turn will be skipped.`, 3000);
    } else if (ev.type === 'skip') {
      const isPlayer = ev.playerIdx === PLAYER_IDX;
      toast(`${isPlayer ? 'Your' : "Opponent's"} turn is skipped by Wasabi!`, 2800);
      await delay(1000);
    }
  }
}

// ── Swap animation ────────────────────────────────────────────────────────────
function animateSwap(handEl, beltEl, onComplete) {
  const hRect = handEl.getBoundingClientRect();
  const bRect = beltEl.getBoundingClientRect();

  const base = 'position:fixed;margin:0;z-index:999;pointer-events:none;transition:none;';
  const hClone = handEl.cloneNode(true);
  const bClone = beltEl.cloneNode(true);
  document.body.append(hClone, bClone);

  [hClone, bClone].forEach(el => {
    el.style.cssText = base;
    el.classList.remove('card--valid-target', 'card--selected', 'card--entering');
    el.style.transform = '';
  });

  hClone.style.top = hRect.top + 'px'; hClone.style.left = hRect.left + 'px';
  hClone.style.width = hRect.width + 'px'; hClone.style.height = hRect.height + 'px';
  bClone.style.top = bRect.top + 'px'; bClone.style.left = bRect.left + 'px';
  bClone.style.width = bRect.width + 'px'; bClone.style.height = bRect.height + 'px';

  handEl.style.opacity = '0';
  beltEl.style.opacity = '0';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const t = 'top 340ms cubic-bezier(.4,0,.2,1), left 340ms cubic-bezier(.4,0,.2,1)';
    hClone.style.transition = t; bClone.style.transition = t;
    hClone.style.top = bRect.top + 'px'; hClone.style.left = bRect.left + 'px';
    bClone.style.top = hRect.top + 'px'; bClone.style.left = hRect.left + 'px';
  }));

  setTimeout(() => {
    hClone.remove(); bClone.remove();
    handEl.style.opacity = ''; beltEl.style.opacity = '';
    onComplete();
  }, 360);
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, duration = 2500) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 400ms ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, duration);
}

// ── Game start / end ──────────────────────────────────────────────────────────
function startGame() {
  if (mctsWorker) { mctsWorker.terminate(); mctsWorker = null; }

  agent = new SimpleGreedyAgent();
  mctsWorker = new Worker(new URL('./workers/mcts_worker.js', import.meta.url), { type: 'module' });

  env = new OmakaseEnv(2);
  env.reset();

  p2 = { step: 'SELECT_HAND', handIdx: null, legalBeltIdxs: new Set() };
  chefsSelectedIndices = [];
  aiThinking = false;
  actionChoiceOverlayEl?.remove();
  actionChoice = null;
  actionChoiceOverlayEl = null;
  actionChoiceResolver = null;
  swapIntent = null;
  phase3Selection = null;
  beltDealIn = null;
  beltDealAnimating = false;
  deckLowWarned = false;
  lastScores[PLAYER_IDX] = -1;
  lastScores[AI_IDX] = -1;
  _lastPhaseMsg = '';
  _lastPhase = -1;

  document.querySelector('.game-ending-banner')?.remove();
  $('chefs-modal-bg').hidden    = true;
  $('chefs-pos-modal-bg').hidden = true;
  $('pick-opp-modal-bg').hidden  = true;
  $('sake-return-modal-bg').hidden = true;
  $('discard-modal-bg').hidden   = true;
  $('trash-modal-bg').hidden     = true;
  $('sets-modal-bg').hidden      = true;
  $('thinking-overlay').hidden   = true;

  const aiName = agentDisplayName(selectedAgent);
  $('opp-label').textContent = aiName;
  $('go-opp-label').textContent = aiName;

  showScreen('screen-game');
  render();
  postRenderCheck();
  scheduleTurn();
}

function agentDisplayName(_a) {
  const sims = mctsNSims;
  if (sims <= 500)  return 'Easy';
  if (sims <= 2000) return 'Advanced';
  return 'Expert';
}

function endGame() {
  if (actionChoiceOverlayEl) closeActionChoiceOverlay('cancel', true);
  aiThinking = false;
  $('thinking-overlay').hidden = true;

  const results = env.getGameResults();
  const pScore = results[PLAYER_IDX] ?? 0;
  const aScore = results[AI_IDX]     ?? 0;
  const won    = pScore > aScore;
  const tied   = pScore === aScore;

  $('gameover-verdict').textContent = won ? 'OMAKASE!' : tied ? "It's a Tie!" : 'Better Luck Next Time';
  $('go-player-score').textContent  = `¥${pScore.toLocaleString()}`;
  $('go-opp-score').textContent     = `¥${aScore.toLocaleString()}`;
  $('go-player-card').classList.toggle('winner', won);
  $('go-opp-card').classList.toggle('winner', !won && !tied);

  renderMiniHand('go-player-hand', env.state.players[PLAYER_IDX].hand);
  renderMiniHand('go-opp-hand',    env.state.players[AI_IDX].hand);
  renderBreakdown(pScore, aScore);

  setTimeout(() => showScreen('screen-gameover'), 300);
}

function renderMiniHand(elId, hand) {
  const el = $(elId);
  el.innerHTML = '';
  hand.forEach(card => {
    const mini = document.createElement('div');
    mini.className = 'card-mini';
    const img = document.createElement('img');
    img.src = cardImg(cardName(card));
    img.alt = CARD_DISPLAY_NAMES[cardName(card)] ?? '';
    img.loading = 'lazy';
    mini.appendChild(img);
    el.appendChild(mini);
  });
}

function renderBreakdown() {
  const container = $('go-breakdown');
  container.innerHTML = '';
  const isNarrow = window.matchMedia('(max-width: 600px)').matches
    || window.matchMedia('(max-width: 1024px) and (max-height: 500px) and (orientation: landscape)').matches;
  container.style.cssText = `display:flex;flex-direction:${isNarrow ? 'column' : 'row'};gap:${isNarrow ? '10px' : '20px'};align-items:flex-start;`;

  const makeCol = (hand, header) => {
    const col = document.createElement('div');
    col.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:5px;min-width:0';

    const h = document.createElement('div');
    h.style.cssText = 'font-size:11px;text-transform:uppercase;letter-spacing:.1em;font-weight:600;color:var(--muted);margin-bottom:6px;font-family:var(--font-b)';
    h.textContent = header;
    col.appendChild(h);

    scoreBreakdown(hand).forEach(line => {
      const row = document.createElement('div');
      row.className = 'gameover__breakdown-line';
      if (line.label.includes('Set')) row.classList.add('set-line');
      const lbl = document.createElement('span');
      lbl.textContent = line.label;
      lbl.style.overflow = 'hidden';
      lbl.style.textOverflow = 'ellipsis';
      const pts = document.createElement('span');
      pts.style.cssText = 'font-family:var(--font-d);color:var(--salmon);white-space:nowrap;margin-left:8px;flex-shrink:0;font-variant-numeric:tabular-nums';
      pts.textContent = `+¥${line.points.toLocaleString()}`;
      row.appendChild(lbl);
      row.appendChild(pts);
      col.appendChild(row);
    });

    return col;
  };

  container.appendChild(makeCol(env.state.players[PLAYER_IDX].hand, 'Your cards'));
  container.appendChild(makeCol(env.state.players[AI_IDX].hand, `${agentDisplayName(selectedAgent)}'s cards`));
}

// ── Setup ─────────────────────────────────────────────────────────────────────
function setupNewGameScreen() {
  document.querySelectorAll('.agent-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const alreadyActive = btn.classList.contains('agent-card--active');
      document.querySelectorAll('.agent-card').forEach(b => {
        b.classList.remove('agent-card--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('agent-card--active');
      btn.setAttribute('aria-checked', 'true');
      selectedAgent = 'mcts2';
      mctsNSims = parseInt(btn.dataset.sims ?? '2000', 10);
      if (alreadyActive) startGame();
    });
  });

  $('btn-start').addEventListener('click', startGame);
}

function requestExternalStartScreen() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'omakase-game-change-opponent' }, window.location.origin);
  } else {
    // Standalone (no wrapping site) — go back to the in-game start screen
    showScreen('screen-newgame');
  }
}

function setupGameScreen() {
  $('btn-pass').addEventListener('click',  () => onPassOrCheck(0));
  $('btn-check').addEventListener('click', () => onPassOrCheck(1));

  $('btn-chefs-confirm').addEventListener('click', onChefsConfirm);

  // Sets progress modal
  $('btn-sets').addEventListener('click', showSetsModal);
  $('btn-close-sets-modal').addEventListener('click', () => { $('sets-modal-bg').hidden = true; });
  $('sets-modal-bg').addEventListener('click', e => {
    if (e.target === $('sets-modal-bg')) $('sets-modal-bg').hidden = true;
  });

  // Trash pile click → open viewer
  $('trash-pile').addEventListener('click', showTrashModal);
  $('trash-pile').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showTrashModal(); }
  });

  // Close trash modal
  $('btn-close-trash-modal').addEventListener('click', () => {
    $('trash-modal-bg').hidden = true;
  });
  $('trash-modal-bg').addEventListener('click', e => {
    if (e.target === $('trash-modal-bg')) $('trash-modal-bg').hidden = true;
  });
}

function setupGameOverScreen() {
  $('btn-rematch').addEventListener('click',     startGame);
  $('btn-change-opp').addEventListener('click', requestExternalStartScreen);

  // Re-lay-out the score breakdown when the device rotates on the results screen
  window.addEventListener('resize', () => {
    if (env && $('screen-gameover').classList.contains('screen--active')) {
      renderBreakdown();
    }
  });
}

setupNewGameScreen();
setupGameScreen();
setupGameOverScreen();

// Opt-in hooks for local testing (?debug=1) — never used by the app itself
if (URL_PARAMS.get('debug') === '1') {
  window.__omakase = {
    get env() { return env; },
    render,
    showChefsPositionModal,
    showChefsChoiceModal,
  };
}

if (URL_PARAMS.get('autostart') === '1') {
  const activeCard = [...document.querySelectorAll('.agent-card')]
    .find((btn) => parseInt(btn.dataset.sims || '0', 10) === mctsNSims);
  if (activeCard) {
    document.querySelectorAll('.agent-card').forEach((btn) => {
      btn.classList.toggle('agent-card--active', btn === activeCard);
      btn.setAttribute('aria-checked', btn === activeCard ? 'true' : 'false');
    });
  }
  startGame();
}
