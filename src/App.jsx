import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe2,
  MapPin,
  Menu,
  Play,
  ShoppingBag,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import rules from '../rules.json';
import favicon from '../Assets/Web/favicon.png';
import frontShot from '../Assets/Web/Product_shots/front.jpg';
import menuShot from '../Assets/Web/Product_shots/menu.jpg';
import cardsShot from '../Assets/Web/Product_shots/cards.jpg';
import sleeveShot from '../Assets/Web/Product_shots/sleeve.jpg';
import gingerCard from '../Assets/Web/Action_cards/ginger.png';
import sakeCard from '../Assets/Web/Action_cards/sake.png';
import umeshuCard from '../Assets/Web/Action_cards/umeshu.png';
import chefsChoiceCard from '../Assets/Web/Action_cards/chefs_choice.png';
import wasabiCard from '../Assets/Web/Action_cards/wasabi.png';
import matchaCard from '../Assets/Web/Action_cards/matcha.png';
import chopsticksCard from '../Assets/Web/Action_cards/chopsticks.png';
import forkCard from '../Assets/Web/Action_cards/fork.png';
import shoyuCard from '../Assets/Web/Action_cards/Shoyu.png';
import fattyTunaCard from '../Assets/Web/Sushi_cards/fatty_tuna.png';
import congerEelCard from '../Assets/Web/Sushi_cards/conger_eel.png';
import crabCard from '../Assets/Web/Sushi_cards/crab.png';
import tunaCard from '../Assets/Web/Sushi_cards/tuna.png';
import salmonRoeCard from '../Assets/Web/Sushi_cards/salmon_roe.png';
import salmonCard from '../Assets/Web/Sushi_cards/salmon.png';
import shrimpCard from '../Assets/Web/Sushi_cards/shrimp.png';
import salmonRollCard from '../Assets/Web/Sushi_cards/salmon_roll.png';
import tunaRollCard from '../Assets/Web/Sushi_cards/tuna_roll.png';
import octopusCard from '../Assets/Web/Sushi_cards/octopus.png';
import assortedSashimiCard from '../Assets/Web/Sushi_cards/assorted_sashimi.png';
import omeletteCard from '../Assets/Web/Sushi_cards/omelette.png';
import tofuSkinCard from '../Assets/Web/Sushi_cards/tofu.png';
import cucumberRollCard from '../Assets/Web/Sushi_cards/cucumber_roll.png';
import karaageCard from '../Assets/Web/Sushi_cards/Karaage.png';
import flowDraw from '../Assets/Web/gifs/draw.gif';
import flowAction from '../Assets/Web/gifs/act.gif';
import flowSwap from '../Assets/Web/gifs/swap.gif';
import flowRotate from '../Assets/Web/gifs/move.gif';
import tokoroLogo from '../Assets/Web/retailers/tokoro.png';
import neverStopReadingLogo from '../Assets/Web/retailers/never-stop-reading.png';
import homuLogo from '../Assets/Web/retailers/Homu.png';
import analphLogo from '../Assets/Web/retailers/thumb_analph_kopf_mail_2.png';
import kamiyaLogo from '../Assets/Web/retailers/kamiya.png';
import volkshausLogo from '../Assets/Web/retailers/buchhandlung-volkshaus.ico';
import mudacLogo from '../Assets/Web/retailers/mudac.png';
import yugenlabLogo from '../Assets/Web/retailers/yugenlab.svg';
import chuoLogo from '../Assets/Web/retailers/chuo.ico';
import noiLogo from '../Assets/Web/retailers/noi-libreria.png';
import loveStoryLogo from '../Assets/Web/retailers/lovestory.webp';
import alaskaLogo from '../Assets/Web/retailers/alaska-libreria.png';
import gamesLogo from '../Assets/Web/retailers/games-kobenhavn.png';
import gudbergNergerLogo from '../Assets/Web/retailers/gudberg-nerger.png';
import poromagiaLogo from '../Assets/Web/retailers/poromagia.png';
import rulebookPdf from '../Rules.pdf';
import shops from './data/shops.json';
import { dictionaries, localeLabels } from './i18n.js';
import { StoreMap } from './StoreMap.jsx';
import { OmakasePlay } from './game/OmakasePlay.jsx';

const pages = ['home', 'rules', 'stores', 'play'];
const tutorialUrl = 'https://www.youtube.com/watch?v=lOHlmx0hAdM';

const actionCardImages = {
  Ginger: gingerCard,
  Sake: sakeCard,
  Umeshu: umeshuCard,
  "Chef's Choice": chefsChoiceCard,
  Wasabi: wasabiCard,
  Matcha: matchaCard,
  Chopsticks: chopsticksCard,
  Fork: forkCard,
  Shoyu: shoyuCard
};

const sushiCardImages = {
  'Fatty Tuna': fattyTunaCard,
  'Conger Eel': congerEelCard,
  Crab: crabCard,
  Tuna: tunaCard,
  'Salmon Roe': salmonRoeCard,
  Salmon: salmonCard,
  Shrimp: shrimpCard,
  'Salmon Roll': salmonRollCard,
  'Tuna Roll': tunaRollCard,
  Octopus: octopusCard,
  'Assorted Sashimi': assortedSashimiCard,
  Omelette: omeletteCard,
  'Tofu Skin': tofuSkinCard,
  'Cucumber Roll': cucumberRollCard,
  Karaage: karaageCard
};

const productMedia = [
  { type: 'image', titleKey: 'menu', src: menuShot },
  { type: 'image', titleKey: 'cards', src: cardsShot },
  { type: 'image', titleKey: 'sleeve', src: sleeveShot }
];

const flowImages = [flowDraw, flowAction, flowSwap, flowRotate];

const scoringCardLayouts = [
  {
    total: 4000,
    cards: [
      { kind: 'sushi', name: 'Octopus' },
      { kind: 'sushi', name: 'Conger Eel' },
      { kind: 'sushi', name: 'Crab' },
      { kind: 'sushi', name: 'Tuna' },
      { kind: 'sushi', name: 'Tuna' },
      { kind: 'sushi', name: 'Salmon Roll' },
      { kind: 'sushi', name: 'Karaage' },
      { kind: 'action', name: 'Umeshu' }
    ],
    math: [
      { label: 'Octopus', amount: 1100 },
      { label: 'Conger Eel', amount: 700 },
      { label: 'Crab', amount: 600 },
      { label: 'Tuna x2', amount: 800 },
      { label: 'Salmon Roll', amount: 300 },
      { label: 'Karaage', amount: 500 },
      { label: 'Umeshu', amount: 0 }
    ]
  },
  {
    total: 7000,
    cards: [
      { kind: 'sushi', name: 'Fatty Tuna' },
      { kind: 'sushi', name: 'Conger Eel' },
      { kind: 'sushi', name: 'Crab' },
      { kind: 'sushi', name: 'Tuna' },
      { kind: 'sushi', name: 'Salmon Roe' },
      { kind: 'sushi', name: 'Salmon' },
      { kind: 'action', name: 'Shoyu' },
      { kind: 'sushi', name: 'Karaage', doubled: true },
      { kind: 'action', name: 'Ginger' }
    ],
    math: [
      { label: 'Omakase Set', amount: 6000 },
      { label: 'Karaage doubled by Shoyu', amount: 1000 },
      { label: 'Ginger', amount: 0 }
    ]
  },
  {
    total: 5500,
    cards: [
      { kind: 'sushi', name: 'Assorted Sashimi', doubled: true },
      { kind: 'sushi', name: 'Conger Eel', doubled: true },
      { kind: 'sushi', name: 'Salmon' },
      { kind: 'sushi', name: 'Shrimp' },
      { kind: 'sushi', name: 'Tuna Roll' },
      { kind: 'action', name: 'Shoyu' },
      { kind: 'action', name: 'Shoyu' }
    ],
    math: [
      { label: 'Assorted Sashimi doubled by Shoyu', amount: 3000 },
      { label: 'Conger Eel doubled by Shoyu', amount: 1400 },
      { label: 'Salmon', amount: 400 },
      { label: 'Shrimp', amount: 400 },
      { label: 'Tuna Roll', amount: 300 }
    ]
  },
  {
    total: 2000,
    cards: [
      { kind: 'sushi', name: 'Omelette' },
      { kind: 'sushi', name: 'Tofu Skin' },
      { kind: 'sushi', name: 'Cucumber Roll' },
      { kind: 'sushi', name: 'Karaage' },
      { kind: 'action', name: 'Shoyu' }
    ],
    math: [
      { label: "Kid's Set", amount: 2000 },
      { label: 'Shoyu with no eligible sushi', amount: 0 }
    ]
  },
  {
    total: 8000,
    cards: [
      { kind: 'sushi', name: 'Fatty Tuna' },
      { kind: 'sushi', name: 'Conger Eel' },
      { kind: 'sushi', name: 'Crab' },
      { kind: 'sushi', name: 'Tuna' },
      { kind: 'sushi', name: 'Salmon Roe' },
      { kind: 'sushi', name: 'Salmon' },
      { kind: 'sushi', name: 'Omelette' },
      { kind: 'sushi', name: 'Tofu Skin' },
      { kind: 'sushi', name: 'Cucumber Roll' },
      { kind: 'sushi', name: 'Karaage' }
    ],
    math: [
      { label: 'Omakase Set', amount: 6000 },
      { label: "Kid's Set", amount: 2000 }
    ]
  }
];

const retailerLogos = {
  'home-japanese-living': homuLogo,
  tokoro: tokoroLogo,
  'never-stop-reading': neverStopReadingLogo,
  analph: analphLogo,
  kamiya: kamiyaLogo,
  'buchhandlung-volkshaus': volkshausLogo,
  mudac: mudacLogo,
  yugenlab: yugenlabLogo,
  chuo: chuoLogo,
  'noi-libreria': noiLogo,
  'love-story-of-berlin': loveStoryLogo,
  'alaska-libreria': alaskaLogo,
  'games-kobenhavn': gamesLogo,
  'gudberg-nerger': gudbergNergerLogo,
  poromagia: poromagiaLogo
};

export function App({ route, navigate }) {
  const t = dictionaries[route.locale] || dictionaries.en;
  const [mobileOpen, setMobileOpen] = useState(false);
  const page = pages.includes(route.page) ? route.page : 'home';

  const go = (targetPage) => {
    setMobileOpen(false);
    navigate(route.locale, targetPage);
  };

  return (
    <div className="site-shell">
      <Header
        page={page}
        locale={route.locale}
        t={t}
        navigate={navigate}
        go={go}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main>
        {page === 'home' && <HomePage t={t} go={go} />}
        {page === 'rules' && <RulesPage t={t} locale={route.locale} />}
        {page === 'stores' && <StoresPage t={t} />}
        {page === 'play' && <PlayPage t={t} />}
      </main>
      <Footer t={t} go={go} />
    </div>
  );
}

function Header({ page, locale, t, navigate, go, mobileOpen, setMobileOpen }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => go('home')} aria-label="Omakase home">
        <span className="brand-mark image-mark">
          <img src={favicon} alt="" />
        </span>
        <span>
          <strong>Omakase</strong>
          <small>{t.nav.tagline}</small>
        </span>
      </button>

      <nav className={`nav-tabs ${mobileOpen ? 'is-open' : ''}`} aria-label={t.nav.main}>
        {pages.map((item) => (
          <button
            key={item}
            className={page === item ? 'active' : ''}
            onClick={() => go(item)}
          >
            {t.nav[item]}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="locale-picker" aria-label={t.nav.language}>
          <Globe2 size={18} aria-hidden="true" />
          {Object.entries(localeLabels).map(([code, label]) => (
            <button
              key={code}
              className={locale === code ? 'active' : ''}
              onClick={() => navigate(code, page)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="icon-button mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function HomePage({ t, go }) {
  return (
    <>
      <section className="hero">
        <div className="hero-product" aria-label={t.hero.productLabel}>
          <img src={frontShot} alt={t.media.frontAlt} />
          <div className="floating-card card-one">
            <img src={fattyTunaCard} alt="Fatty Tuna sushi card" />
          </div>
          <div className="floating-card card-two">
            <img src={shoyuCard} alt="Shoyu action card" />
          </div>
          <div className="floating-card card-three">
            <img src={salmonRoeCard} alt="Salmon Roe sushi card" />
          </div>
          <div className="floating-card card-four">
            <img src={sakeCard} alt="Sake action card" />
          </div>
        </div>
        <div className="hero-copy">
          <h1>Omakase</h1>
          <p className="hero-lede">{t.hero.lede}</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => go('stores')}>
              <ShoppingBag size={18} />
              {t.hero.buy}
            </button>
            <button className="button secondary" onClick={() => go('rules')}>
              <BookOpen size={18} />
              {t.hero.learn}
            </button>
          </div>
        </div>
      </section>
      <ProductMedia t={t} />
      <PartnerRetailers t={t} />
      <HomeRulesPreview t={t} go={go} />
    </>
  );
}

function ProductMedia({ t }) {
  return (
    <section className="section media-section" id="media" aria-label={t.media.aria}>
      <div className="media-grid">
        {productMedia.map((item) => (
          <article className="media-tile" key={item.titleKey}>
            <div className="media-tile-frame">
              <img src={item.src} alt={t.media.items[item.titleKey]} />
            </div>
            <h2>{t.media.items[item.titleKey]}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeRulesPreview({ t, go }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section flow-section">
      <div className="section-heading">
        <p className="eyebrow">{t.preview.eyebrow}</p>
      </div>
      <div className="flow-stepper">
        <div className="flow-visual">
          <img src={flowImages[activeStep]} alt="" />
        </div>
        <div className="flow-controls">
          {t.preview.steps.map((step, index) => (
            <button
              key={step.title}
              className={index === activeStep ? 'active' : ''}
              onClick={() => setActiveStep(index)}
            >
              <span>{index + 1}</span>
              <strong>{step.title}</strong>
              <small>{step.body}</small>
            </button>
          ))}
        </div>
      </div>
      <button className="button primary centered" onClick={() => go('rules')}>
        <ArrowRight size={18} />
        {t.preview.cta}
      </button>
    </section>
  );
}

function RulesPage({ t, locale }) {
  const [selectedCard, setSelectedCard] = useState(rules.action_cards[0]);
  const [previewCard, setPreviewCard] = useState(null);
  const [cornerCasesOpen, setCornerCasesOpen] = useState(false);
  const manualSections = t.rules.sections.filter((_, index) => index !== 5);
  const scoringSection = t.rules.sections[5];
  const actionCopy = t.actionCards[selectedCard.name] || {
    effect: selectedCard.effect,
    detail: selectedCard.scoring_effect || selectedCard.after_effect || ''
  };

  return (
    <>
      <section className="page-hero compact rules-hero">
        <p className="eyebrow">{t.rules.eyebrow}</p>
        <h1>{t.rules.title}</h1>
        <p>{t.rules.intro}</p>
        <div className="hero-actions">
          <a className="button secondary" href={rulebookPdf} target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            {t.rules.download}
          </a>
          <a className="button primary" href={tutorialUrl} target="_blank" rel="noreferrer">
            <Play size={18} />
            {t.rules.tutorial}
          </a>
        </div>
      </section>

      <section className="section rule-manual">
        {manualSections.map((section, index) => (
          <article className="manual-block" key={section.title}>
            <div>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>
            <div>
              <p>{section.body}</p>
              {section.items && (
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <RulesFlowStrip t={t} />

      <section className="section action-section">
        <div className="section-heading">
          <p className="eyebrow">{t.rules.cardsEyebrow}</p>
          <h2>{t.rules.cardsTitle}</h2>
          <p>{t.rules.cardsIntro}</p>
        </div>
        <div className="action-lab">
          <div className="action-card-grid">
            {rules.action_cards.map((card) => (
              <button
                key={card.name}
                className={selectedCard.name === card.name ? 'selected' : ''}
                onClick={() => {
                  setSelectedCard(card);
                  setCornerCasesOpen(false);
                }}
              >
                <img src={actionCardImages[card.name]} alt={card.name} />
              </button>
            ))}
          </div>
          <article className="action-detail">
            <img src={actionCardImages[selectedCard.name]} alt={selectedCard.name} />
            <div>
              <p className="eyebrow">{t.rules.actionCount(selectedCard.name)}</p>
              <h3>{selectedCard.name}</h3>
              <p>{actionCopy.effect}</p>
              {actionCopy.detail && <p className="muted">{actionCopy.detail}</p>}
              {actionCopy.cornerCases && (
                <div className="action-corner-cases">
                  <button
                    type="button"
                    onClick={() => setCornerCasesOpen(!cornerCasesOpen)}
                    aria-expanded={cornerCasesOpen}
                  >
                    <span>{t.rules.cornerCasesLabel}</span>
                    <span aria-hidden="true">{cornerCasesOpen ? '−' : '+'}</span>
                  </button>
                  {cornerCasesOpen && (
                    <ul>
                      {actionCopy.cornerCases.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="section scoring-section">
        <div className="section-heading">
          <p className="eyebrow">{t.rules.setsEyebrow}</p>
          <h2>{t.rules.setsTitle}</h2>
          <p>{t.rules.setsBody}</p>
        </div>
        <div className="set-grid">
          {rules.sushi_sets.map((set) => (
            <article key={set.name} className="set-card">
              <div className="set-card-heading">
                <strong>{set.name}</strong>
                <span>{set.value_yen.toLocaleString(locale)} ¥</span>
              </div>
              <div className="set-sushi-grid">
                {set.members.map((member) => (
                  <button
                    key={`${set.name}-${member}`}
                    className="sushi-thumb"
                    onClick={() => setPreviewCard({ name: member, src: sushiCardImages[member] })}
                    aria-label={`${t.rules.previewCard} ${member}`}
                  >
                    <img src={sushiCardImages[member]} alt={member} />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section scoring-examples">
        {scoringSection && (
          <article className="scoring-rule-block">
            <div>
              <p className="eyebrow">{t.rules.scoringEyebrow}</p>
              <h2>{scoringSection.title}</h2>
            </div>
            <div>
              <p>{scoringSection.body}</p>
              {scoringSection.items && (
                <ul>
                  {scoringSection.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </article>
        )}
        <div className="section-heading">
          <h2>{t.rules.scoringTitle}</h2>
          <p>{t.rules.scoringBody}</p>
        </div>
        <div className="score-example-grid">
          {t.rules.scoringExamples.map((example, index) => (
            <article className="score-example" key={example.title}>
              <ScoringCardRow cards={scoringCardLayouts[index].cards} onPreview={setPreviewCard} />
              <div>
                <ul className="score-math">
                  {scoringCardLayouts[index].math.map((line) => (
                    <li key={line.label}>
                      <span>{line.label}</span>
                      <strong>{line.amount.toLocaleString(locale)} ¥</strong>
                    </li>
                  ))}
                </ul>
                <div className="score-example-title">
                  <h3>{example.title}</h3>
                  <strong>{scoringCardLayouts[index].total.toLocaleString(locale)} ¥</strong>
                </div>
                <p>{example.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {previewCard && (
        <button className="card-preview-backdrop" onClick={() => setPreviewCard(null)} aria-label={t.rules.closePreview}>
          <img src={previewCard.src} alt={previewCard.name} />
        </button>
      )}
    </>
  );
}

function RulesFlowStrip({ t }) {
  return (
    <section className="section rules-flow">
      <div className="section-heading">
        <p className="eyebrow">{t.preview.eyebrow}</p>
      </div>
      <div className="rules-gif-grid">
        {t.preview.steps.map((step, index) => (
          <article key={step.title} className="rules-gif-step">
            <img src={flowImages[index]} alt="" loading="lazy" />
            <div>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScoringCardRow({ cards, onPreview }) {
  return (
    <div className="score-card-row">
      {cards.map((card, index) => {
        const src = card.kind === 'action' ? actionCardImages[card.name] : sushiCardImages[card.name];

        return (
          <button
            type="button"
            className={`score-mini-card ${card.kind}`}
            key={`${card.name}-${index}`}
            onClick={() => onPreview({ name: card.name, src })}
            aria-label={card.name}
          >
            <img src={src} alt="" />
            {card.doubled && <span className="card-count">x2</span>}
          </button>
        );
      })}
    </div>
  );
}

function StoresPage({ t }) {
  const [query, setQuery] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const filteredShops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shops.filter((shop) => {
      const matchesQuery = !q || [shop.name, shop.city, shop.country, shop.address]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q));
      const matchesOnline = !onlineOnly || shop.sellsOnline;
      return matchesQuery && matchesOnline;
    });
  }, [query, onlineOnly]);
  const popupLabels = useMemo(() => ({
    buyOnline: t.stores.buyOnline,
    website: t.stores.website,
    online: t.stores.buyOnline
  }), [t]);

  useEffect(() => {
    if (selectedShopId && !filteredShops.some((shop) => shop.id === selectedShopId)) {
      setSelectedShopId(null);
    }
  }, [filteredShops, selectedShopId]);

  return (
    <>
      <section className="section store-layout">
        <div className="store-controls">
          <label>
            <span>{t.stores.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.stores.searchPlaceholder}
            />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(event) => setOnlineOnly(event.target.checked)}
            />
            <span>{t.stores.onlineOnly}</span>
          </label>
        </div>
        <StoreMap
          shops={filteredShops}
          emptyLabel={t.stores.empty}
          selectedShopId={selectedShopId}
          onSelectShop={setSelectedShopId}
          popupLabels={popupLabels}
        />
        <aside className="shop-list shop-tile-panel" aria-label={t.partners.title}>
          <div className="shop-panel-heading">
            <h2>{t.partners.title}</h2>
          </div>
          {filteredShops.length === 0 ? (
            <article className="empty-state">
              <MapPin size={28} />
              <h2>{t.stores.emptyTitle}</h2>
              <p>{t.stores.empty}</p>
            </article>
          ) : (
            filteredShops.map((shop) => (
              <ShopTile
                key={shop.id}
                shop={shop}
                t={t}
                selected={shop.id === selectedShopId}
                onSelect={() => setSelectedShopId(shop.id)}
              />
            ))
          )}
        </aside>
      </section>
    </>
  );
}

function PartnerRetailers({ t, compact = false }) {
  return (
    <section className={`section partner-section ${compact ? 'compact-partners' : ''}`}>
      <div className="section-heading">
        <h2>{t.partners.title}</h2>
        <p>{t.partners.body}</p>
      </div>
      <div className="partner-grid">
        {shops.map((shop) => (
          <a
            key={shop.id}
            href={shop.productUrl || shop.websiteUrl || undefined}
            target={shop.productUrl || shop.websiteUrl ? '_blank' : undefined}
            rel={shop.productUrl || shop.websiteUrl ? 'noreferrer' : undefined}
            className="partner-logo"
            aria-label={shop.name}
          >
            <RetailerLogo shop={shop} />
            <span>{shop.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ShopTile({ shop, t, selected, onSelect }) {
  const link = shop.productUrl || shop.websiteUrl;

  return (
    <article
      className={`shop-tile ${selected ? 'is-selected' : ''}`}
      tabIndex={0}
      onClick={onSelect}
      onFocus={onSelect}
      onMouseEnter={onSelect}
    >
      <RetailerLogo shop={shop} />
      <div>
        <h2>{shop.name}</h2>
        <p>{[shop.city, shop.country].filter(Boolean).join(', ')}</p>
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          aria-label={`${shop.productUrl ? t.stores.buyOnline : t.stores.website}: ${shop.name}`}
        >
          <ExternalLink size={16} />
        </a>
      )}
    </article>
  );
}

function ShopCard({ shop, t, selected, onSelect }) {
  return (
    <article
      className={`shop-card ${selected ? 'is-selected' : ''}`}
      tabIndex={0}
      onClick={onSelect}
      onFocus={onSelect}
      onMouseEnter={onSelect}
    >
      <RetailerLogo shop={shop} />
      <div>
        <h2>{shop.name}</h2>
        <p>{[shop.address, shop.city, shop.country].filter(Boolean).join(', ')}</p>
        {shop.notes && <small>{shop.notes}</small>}
      </div>
      <div className="shop-actions">
        {shop.productUrl && (
          <a className="button primary small" href={shop.productUrl} target="_blank" rel="noreferrer">
            <ShoppingBag size={16} />
            {t.stores.buyOnline}
          </a>
        )}
        {shop.websiteUrl && (
          <a className="button secondary small" href={shop.websiteUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            {t.stores.website}
          </a>
        )}
      </div>
    </article>
  );
}

function RetailerLogo({ shop }) {
  const logo = shop.logoId ? retailerLogos[shop.logoId] : null;

  if (logo) {
    return (
      <span className="retailer-logo">
        <img src={logo} alt="" loading="lazy" />
      </span>
    );
  }

  return <span className="retailer-logo fallback">{shop.name.slice(0, 2).toUpperCase()}</span>;
}

function PlayPage({ t }) {
  return <OmakasePlay t={t} />;
}

function Footer({ t, go }) {
  return (
    <footer className="site-footer">
      <button className="brand footer-brand" onClick={() => go('home')}>
        <span className="brand-mark image-mark">
          <img src={favicon} alt="" />
        </span>
        <span>
          <strong>Omakase</strong>
          <small>{t.footer.line}</small>
        </span>
      </button>
      <div>
        <button onClick={() => go('rules')}>{t.nav.rules}</button>
        <button onClick={() => go('stores')}>{t.nav.stores}</button>
        <button onClick={() => go('play')}>{t.nav.play}</button>
      </div>
    </footer>
  );
}
