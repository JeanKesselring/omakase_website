import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe2,
  MapPin,
  Menu,
  Play,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import rules from '../rules.json';
import favicon from '../Assets/Web/favicon.png';
import frontShot from '../Assets/Web/Product_shots/front.jpg';
import menuShot from '../Assets/Web/Product_shots/menu.jpg';
import cardsShot from '../Assets/Web/Product_shots/cards.jpg';
import sleeveShot from '../Assets/Web/Product_shots/sleeve.jpg';
import cardsBack from '../Assets/Web/cards_back.jpg';
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
import omeletteCard from '../Assets/Web/Sushi_cards/omelette.png';
import tofuSkinCard from '../Assets/Web/Sushi_cards/tofu.png';
import cucumberRollCard from '../Assets/Web/Sushi_cards/cucumber_roll.png';
import karaageCard from '../Assets/Web/Sushi_cards/Karaage.png';
import productVideoA from '../Assets/Web/video/product-loop-1.mp4';
import productVideoB from '../Assets/Web/video/product-loop-2.mp4';
import productPosterA from '../Assets/Web/video_posters/product-loop-1.jpg';
import productPosterB from '../Assets/Web/video_posters/product-loop-2.jpg';
import flowDraw from '../Assets/Web/how_to/draw.jpg';
import flowAction from '../Assets/Web/how_to/action.jpg';
import flowSwap from '../Assets/Web/how_to/swap.jpg';
import flowRotate from '../Assets/Web/how_to/rotate.jpg';
import scoringOne from '../Assets/Web/how_to/scoring.jpg';
import scoringTwo from '../Assets/Web/how_to/scoring2.jpg';
import scoringThree from '../Assets/Web/how_to/scoring3.jpg';
import scoringFour from '../Assets/Web/how_to/scoring4.jpg';
import scoringFive from '../Assets/Web/how_to/scoring5.jpg';
import tokoroLogo from '../Assets/Web/retailers/tokoro.png';
import neverStopReadingLogo from '../Assets/Web/retailers/never-stop-reading.png';
import analphLogo from '../Assets/Web/retailers/analph.ico';
import kamiyaLogo from '../Assets/Web/retailers/kamiya.png';
import volkshausLogo from '../Assets/Web/retailers/buchhandlung-volkshaus.ico';
import mudacLogo from '../Assets/Web/retailers/mudac.png';
import yugenlabLogo from '../Assets/Web/retailers/yugenlab.svg';
import chuoLogo from '../Assets/Web/retailers/chuo.ico';
import noiLogo from '../Assets/Web/retailers/noi-libreria.png';
import alaskaLogo from '../Assets/Web/retailers/alaska-libreria.png';
import gamesLogo from '../Assets/Web/retailers/games-kobenhavn.png';
import gudbergNergerLogo from '../Assets/Web/retailers/gudberg-nerger.png';
import rulebookPdf from '../Rules.pdf';
import shops from './data/shops.json';
import { dictionaries, localeLabels } from './i18n.js';
import { StoreMap } from './StoreMap.jsx';

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
  Omelette: omeletteCard,
  'Tofu Skin': tofuSkinCard,
  'Cucumber Roll': cucumberRollCard,
  Karaage: karaageCard
};

const productMedia = [
  { type: 'image', titleKey: 'menu', src: menuShot },
  { type: 'image', titleKey: 'cards', src: cardsShot },
  { type: 'image', titleKey: 'sleeve', src: sleeveShot },
  { type: 'video', titleKey: 'videoOne', src: productVideoA, poster: productPosterA },
  { type: 'video', titleKey: 'videoTwo', src: productVideoB, poster: productPosterB }
];

const flowImages = [flowDraw, flowAction, flowSwap, flowRotate];
const scoringImages = [scoringOne, scoringTwo, scoringThree, scoringFour, scoringFive];

const retailerLogos = {
  tokoro: tokoroLogo,
  'never-stop-reading': neverStopReadingLogo,
  analph: analphLogo,
  kamiya: kamiyaLogo,
  'buchhandlung-volkshaus': volkshausLogo,
  mudac: mudacLogo,
  yugenlab: yugenlabLogo,
  chuo: chuoLogo,
  'noi-libreria': noiLogo,
  'alaska-libreria': alaskaLogo,
  'games-kobenhavn': gamesLogo,
  'gudberg-nerger': gudbergNergerLogo
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
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={16} /> {t.hero.eyebrow}</p>
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
          <article className={`media-tile ${item.type === 'video' ? 'video-tile' : ''}`} key={item.titleKey}>
            <div className="media-tile-frame">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={item.src} alt={t.media.items[item.titleKey]} />
              )}
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
  const current = t.preview.steps[activeStep];

  return (
    <section className="section flow-section">
      <div className="section-heading">
        <p className="eyebrow">{t.preview.eyebrow}</p>
        <h2>{t.preview.title}</h2>
        <p>{t.preview.body}</p>
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
        {t.rules.sections.map((section) => (
          <article className="manual-block" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && (
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>

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
                onClick={() => setSelectedCard(card)}
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
        <div className="section-heading">
          <p className="eyebrow">{t.rules.scoringEyebrow}</p>
          <h2>{t.rules.scoringTitle}</h2>
          <p>{t.rules.scoringBody}</p>
        </div>
        <div className="score-example-grid">
          {t.rules.scoringExamples.map((example, index) => (
            <article className="score-example" key={example.title}>
              <img src={scoringImages[index]} alt="" />
              <div>
                <h3>{example.title}</h3>
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

function StoresPage({ t }) {
  const [query, setQuery] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
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

  return (
    <>
      <section className="page-hero compact stores-hero">
        <p className="eyebrow">{t.stores.eyebrow}</p>
        <h1>{t.stores.title}</h1>
        <p>{t.stores.intro}</p>
      </section>
      <PartnerRetailers t={t} compact />
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
        <StoreMap shops={filteredShops} emptyLabel={t.stores.empty} />
        <div className="shop-list">
          {filteredShops.length === 0 ? (
            <article className="empty-state">
              <MapPin size={28} />
              <h2>{t.stores.emptyTitle}</h2>
              <p>{t.stores.empty}</p>
            </article>
          ) : (
            filteredShops.map((shop) => <ShopCard key={shop.id} shop={shop} t={t} />)
          )}
        </div>
      </section>
    </>
  );
}

function PartnerRetailers({ t, compact = false }) {
  return (
    <section className={`section partner-section ${compact ? 'compact-partners' : ''}`}>
      <div className="section-heading">
        <p className="eyebrow">{t.partners.eyebrow}</p>
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

function ShopCard({ shop, t }) {
  return (
    <article className="shop-card">
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
  return (
    <section className="play-page">
      <div className="play-panel">
        <p className="eyebrow">{t.play.eyebrow}</p>
        <h1>{t.play.title}</h1>
        <p>{t.play.body}</p>
        <div className="mock-game">
          {[sakeCard, wasabiCard, matchaCard, shoyuCard].map((src, index) => (
            <img key={src} src={src} alt="" style={{ '--tilt': `${(index - 1.5) * 4}deg` }} />
          ))}
        </div>
      </div>
    </section>
  );
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
