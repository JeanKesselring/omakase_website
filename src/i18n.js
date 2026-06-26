export const locales = ['en', 'fr', 'de', 'ja'];

export const localeLabels = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  ja: '日本'
};

const englishActionCards = {
  Ginger: {
    effect: 'Ginger has no helpful effect and takes up space in your hand.',
    detail: 'It normally cannot be exchanged or discarded. If you had zero cards, drew Ginger, and must exchange, you may exchange it only then.'
  },
  Sake: {
    effect: 'Take one random card from an eligible opponent, then give them one card from your hand.',
    detail: 'You cannot target a protected player or a player with zero cards.'
  },
  Umeshu: {
    effect: 'Shuffle your hand with an eligible opponent’s hand, then alternate drawing from the pile.',
    detail: 'You draw first. Protected players and players with zero cards cannot be chosen.'
  },
  "Chef's Choice": {
    effect: 'Draw three cards, then return any two cards from your hand to the deck in any positions.',
    detail: 'If reshuffles remain, reshuffle before continuing a draw from an empty deck.'
  },
  Wasabi: {
    effect: 'When drawn from the deck or another player, skip your next turn.',
    detail: 'It does not trigger when picked from the conveyor belt. Multiple Wasabi stack.'
  },
  Matcha: {
    effect: 'Draw one card and place Matcha in front of you.',
    detail: 'Each Matcha in front of you increases your hand size by one.'
  },
  Chopsticks: {
    effect: 'Draw one random card from an eligible opponent’s hand.',
    detail: 'You cannot target protected players or players with zero cards.'
  },
  Fork: {
    effect: 'Every other unprotected player discards their most expensive sushi card.',
    detail: 'If there is a tie, each affected player chooses which tied card they discard.'
  },
  Shoyu: {
    effect: 'At the end of the game, double your most expensive sushi card that is not part of a completed set.',
    detail: 'Each Shoyu must apply to a different eligible card. Ties are chosen by the card owner.'
  }
};

const en = {
  nav: {
    main: 'Main navigation',
    home: 'Home',
    rules: 'Rules',
    stores: 'Stores',
    play: 'Play',
    tagline: 'Sushi card game',
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  },
  hero: {
    eyebrow: 'A tactical sushi card game',
    lede: 'Collect elegant sushi, complete menu sets, and time your action cards before the conveyor belt changes everything.',
    buy: 'Find a store',
    learn: 'Learn the rules',
    productLabel: 'Omakase product presentation'
  },
  media: {
    aria: 'Product media',
    frontAlt: 'Omakase game box front',
    items: {
      menu: 'Menu leporello',
      cards: 'Cards on the table',
      sleeve: 'Sleeve and packaging',
      videoOne: 'Product video',
      videoTwo: 'Table video'
    }
  },
  preview: {
    eyebrow: 'How it flows',
    title: 'A turn is simple. The timing is not.',
    body: 'The conveyor belt creates a small decision every turn: take what helps now, or set up something stronger.',
    cta: 'Open the full rules',
    steps: [
      { title: 'Draw', body: 'Start by drawing one card from the deck.' },
      { title: 'Act', body: 'You may play one action card before or after the exchange.' },
      { title: 'Exchange', body: 'Swap one card from your hand with one card on the conveyor belt.' },
      { title: 'Move the belt', body: 'Add a new card, shift the belt, and trash the card that falls off.' }
    ]
  },
  rules: {
    eyebrow: 'Learn to play',
    title: 'Rules',
    intro: 'Everything needed to play Omakase: setup, turn flow, action cards, sets, end game, and scoring.',
    download: 'Open rulebook',
    tutorial: 'Watch tutorial',
    cardsEyebrow: 'Action cards',
    cardsTitle: 'Action cards change the table',
    cardsIntro: 'You may play only one action card during your turn, so timing matters.',
    setsEyebrow: 'Sushi sets',
    setsTitle: 'Complete the menu sets',
    setsBody: 'A sushi card can belong to one or two sets. A physical card can only count toward one scored set.',
    previewCard: 'Preview card',
    closePreview: 'Close card preview',
    scoringEyebrow: 'Scoring examples',
    scoringTitle: 'Score sets first, then loose sushi',
    scoringBody: 'Completed sets replace the individual values of the cards inside them. Shoyu doubles your best eligible sushi outside completed sets.',
    actionCount: (name) => `${name} card`,
    sections: [
      {
        title: 'Setup',
        body: 'Shuffle the deck. Deal one card to each player. Place six cards face up in a row to form the conveyor belt, with the deck at one end and the trash pile at the other.',
        items: ['Hands are private.', 'The conveyor belt always has six face-up cards when maintained normally.', 'Used and discarded cards go to the trash.']
      },
      {
        title: 'Turn sequence',
        body: 'On your turn, draw one card, optionally play one action card, exchange one card with the belt, optionally play an action card if you have not already, then move the belt.',
        items: ['You cannot exchange two identical cards.', 'Ginger cannot normally be exchanged.', 'You may play at most one action card per turn.']
      },
      {
        title: 'Hand size',
        body: 'Your maximum hand size starts at eight cards. At the end of your turn, discard down to your limit if needed.',
        items: ['Each Matcha in front of you increases the limit by one.', 'When discarding, choose cards other than Ginger.', 'If you had zero cards, draw Ginger, and must exchange, Ginger may be exchanged only in that case.']
      },
      {
        title: 'Deck lifecycle',
        body: 'Play through the full deck a number of times equal to the number of players minus one.',
        items: ['Two players use one full deck pass.', 'Three players use two full deck passes.', 'Four players use three full deck passes.', 'If a draw is required and no reshuffle remains, the game ends immediately.']
      },
      {
        title: 'Calling check',
        body: 'If you have a completed set as you conclude your turn, you may call check. Each other player then gets one final turn.',
        items: ['The player who called check cannot be targeted or affected by later action cards.', 'Fork may still be played, but skips the protected player.', 'A final turn skipped by Wasabi is still consumed.']
      },
      {
        title: 'Scoring',
        body: 'Count completed sets at their set value. Cards not used in a scored set count at their printed value. Most action cards are worth zero.',
        items: ['Multiple copies of the same sushi count separately.', 'Overlapping sets require you to choose which set gets the shared card.', 'If scores tie, tied players simply tie.']
      }
    ],
    scoringExamples: [
      { title: 'No completed set', body: 'Add the value of every sushi card. Action cards without a printed price add zero.' },
      { title: 'Omakase Set plus Shoyu', body: 'Score the set as 6000 yen. Shoyu doubles the best sushi outside that set.' },
      { title: 'Two Shoyu cards', body: 'Each Shoyu must double a different eligible sushi card.' },
      { title: 'Kids Set only', body: 'If all sushi cards are inside a set, Shoyu has no eligible card to double.' },
      { title: 'Set choice matters', body: 'When cards could fit overlapping sets, choose the scoring combination before adding loose sushi.' }
    ]
  },
  actionCards: englishActionCards,
  stores: {
    eyebrow: 'Where to buy',
    title: 'Find Omakase near you',
    intro: 'Stores can be added by editing one JSON file. Online product links appear when available.',
    search: 'Search stores',
    searchPlaceholder: 'City, country, or shop name',
    onlineOnly: 'Online shops only',
    buyOnline: 'Buy online',
    website: 'Website',
    emptyTitle: 'No stores listed yet',
    empty: 'Add shops to src/data/shops.json and they will appear here and on the map.'
  },
  partners: {
    eyebrow: 'Retail partners',
    title: 'Trusted shops carrying Omakase',
    body: 'A growing list of bookshops, concept stores, museum shops, and game stores where you can find the game.'
  },
  play: {
    eyebrow: 'Against AI',
    title: 'The digital table is coming soon',
    body: 'This tab is ready for the AI game repo. For now it keeps the site structure and visual language in place.'
  },
  footer: {
    line: 'Created by Jean Kesselring'
  }
};

const fr = {
  nav: { ...en.nav, home: 'Accueil', rules: 'Règles', stores: 'Boutiques', play: 'Jouer', tagline: 'Jeu de cartes sushi', language: 'Langue', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu' },
  hero: { ...en.hero, eyebrow: 'Un jeu de cartes tactique autour du sushi', lede: 'Collectionnez des sushis, complétez des menus et jouez vos cartes action avant que le tapis ne change tout.', buy: 'Trouver une boutique', learn: 'Apprendre les règles' },
  media: { ...en.media, aria: 'Médias produit', frontAlt: 'Boîte du jeu Omakase', items: { menu: 'Menu leporello', cards: 'Cartes sur la table', sleeve: 'Étui et packaging', videoOne: 'Vidéo produit', videoTwo: 'Vidéo de table' } },
  preview: { eyebrow: 'Déroulement', title: 'Un tour est simple. Le timing ne l’est pas.', body: 'Le tapis roulant crée une petite décision à chaque tour : prendre ce qui aide maintenant ou préparer un meilleur coup.', cta: 'Ouvrir toutes les règles', steps: [{ title: 'Piocher', body: 'Commencez par piocher une carte du deck.' }, { title: 'Agir', body: 'Vous pouvez jouer une carte action avant ou après l’échange.' }, { title: 'Échanger', body: 'Échangez une carte de votre main avec une carte du tapis.' }, { title: 'Déplacer le tapis', body: 'Ajoutez une carte, décalez le tapis et défaussez la carte qui sort.' }] },
  rules: {
    ...en.rules,
    eyebrow: 'Apprendre à jouer',
    title: 'Règles',
    intro: 'Tout ce qu’il faut pour jouer à Omakase : mise en place, tour, cartes action, sets, fin de partie et score.',
    download: 'Ouvrir le livret',
    tutorial: 'Voir le tutoriel',
    cardsEyebrow: 'Cartes action',
    cardsTitle: 'Les cartes action changent la table',
    cardsIntro: 'Vous ne pouvez jouer qu’une seule carte action pendant votre tour : choisissez bien le moment.',
    setsEyebrow: 'Sets de sushi',
    setsTitle: 'Complétez les menus',
    setsBody: 'Une carte sushi peut appartenir à un ou deux sets. Une carte physique ne peut compter que dans un seul set marqué.',
    previewCard: 'Aperçu de la carte',
    closePreview: 'Fermer l’aperçu',
    scoringEyebrow: 'Exemples de score',
    scoringTitle: 'Marquez les sets, puis les sushis restants',
    scoringBody: 'Un set complété remplace la valeur individuelle des cartes qui le composent. Shoyu double le meilleur sushi éligible hors set.',
    actionCount: (name) => `Carte ${name}`,
    sections: [
      { title: 'Mise en place', body: 'Mélangez le deck. Donnez une carte à chaque joueur. Placez six cartes visibles pour former le tapis roulant, avec le deck à une extrémité et la défausse à l’autre.', items: ['Les mains sont privées.', 'Le tapis contient normalement six cartes visibles.', 'Les cartes utilisées et défaussées vont dans la défausse.'] },
      { title: 'Tour de jeu', body: 'À votre tour, piochez une carte, jouez éventuellement une carte action, échangez une carte avec le tapis, jouez éventuellement une action si vous ne l’avez pas déjà fait, puis déplacez le tapis.', items: ['Vous ne pouvez pas échanger deux cartes identiques.', 'Ginger ne peut normalement pas être échangé.', 'Une seule carte action peut être jouée par tour.'] },
      { title: 'Taille de main', body: 'Votre limite commence à huit cartes. À la fin de votre tour, défaussez jusqu’à cette limite si nécessaire.', items: ['Chaque Matcha devant vous augmente la limite de un.', 'Quand vous défaussez, choisissez une carte autre que Ginger.', 'Si vous aviez zéro carte, piochez Ginger et devez échanger, Ginger peut être échangé uniquement dans ce cas.'] },
      { title: 'Deck', body: 'Jouez un nombre de passages complets du deck égal au nombre de joueurs moins un.', items: ['Deux joueurs : un passage.', 'Trois joueurs : deux passages.', 'Quatre joueurs : trois passages.', 'Si une pioche est requise et qu’aucun remélange ne reste, la partie se termine immédiatement.'] },
      { title: 'Appeler l’addition', body: 'Si vous avez un set complété à la fin de votre tour, vous pouvez appeler l’addition. Chaque autre joueur joue alors un dernier tour.', items: ['Le joueur protégé ne peut plus être ciblé ou affecté par les actions adverses.', 'Fork peut être joué, mais ignore ce joueur.', 'Un dernier tour sauté par Wasabi est quand même consommé.'] },
      { title: 'Score', body: 'Comptez les sets complétés à leur valeur de menu. Les cartes hors set comptent à leur valeur imprimée. La plupart des actions valent zéro.', items: ['Les copies multiples comptent séparément.', 'Des sets qui se chevauchent vous obligent à choisir où va la carte partagée.', 'En cas d’égalité, les joueurs restent à égalité.'] }
    ],
    scoringExamples: [
      { title: 'Aucun set complété', body: 'Additionnez la valeur de chaque sushi. Les actions sans prix valent zéro.' },
      { title: 'Set Omakase avec Shoyu', body: 'Le set vaut 6000 yens. Shoyu double le meilleur sushi hors set.' },
      { title: 'Deux Shoyu', body: 'Chaque Shoyu doit doubler une carte sushi éligible différente.' },
      { title: 'Seulement le Kids Set', body: 'Si tous les sushis sont dans un set, Shoyu n’a aucune carte à doubler.' },
      { title: 'Le choix du set compte', body: 'Si des cartes peuvent former des sets qui se chevauchent, choisissez la combinaison avant d’ajouter les sushis restants.' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Ginger n’apporte aucun avantage et prend de la place dans votre main.', detail: 'Il ne peut normalement pas être échangé ni défaussé. Si vous aviez zéro carte, piochez Ginger et devez échanger, vous pouvez l’échanger uniquement alors.' },
    Sake: { effect: 'Prenez une carte aléatoire chez un adversaire éligible, puis donnez-lui une carte de votre main.', detail: 'Vous ne pouvez pas cibler un joueur protégé ou sans carte.' },
    Umeshu: { effect: 'Mélangez votre main avec celle d’un adversaire éligible, puis piochez à tour de rôle.', detail: 'Vous piochez en premier. Les joueurs protégés ou sans carte ne peuvent pas être choisis.' },
    "Chef's Choice": { effect: 'Piochez trois cartes, puis remettez deux cartes de votre main dans le deck à n’importe quelle position.', detail: 'S’il reste des remélanges, remélangez avant de continuer une pioche depuis un deck vide.' },
    Wasabi: { effect: 'Si vous le piochez du deck ou d’un autre joueur, sautez votre prochain tour.', detail: 'Il ne se déclenche pas depuis le tapis roulant. Plusieurs Wasabi se cumulent.' },
    Matcha: { effect: 'Piochez une carte et placez Matcha devant vous.', detail: 'Chaque Matcha devant vous augmente votre taille de main de un.' },
    Chopsticks: { effect: 'Piochez une carte aléatoire dans la main d’un adversaire éligible.', detail: 'Vous ne pouvez pas cibler un joueur protégé ou sans carte.' },
    Fork: { effect: 'Tous les autres joueurs non protégés défaussent leur sushi le plus cher.', detail: 'En cas d’égalité, chaque joueur concerné choisit quelle carte liée il défausse.' },
    Shoyu: { effect: 'En fin de partie, doublez votre sushi le plus cher qui ne fait pas partie d’un set complété.', detail: 'Chaque Shoyu doit s’appliquer à une carte différente. Les égalités sont choisies par le propriétaire.' }
  },
  stores: { ...en.stores, eyebrow: 'Où acheter', title: 'Trouver Omakase près de vous', intro: 'Ajoutez des boutiques dans un fichier JSON. Les liens d’achat en ligne apparaissent quand ils existent.', search: 'Rechercher', searchPlaceholder: 'Ville, pays ou boutique', onlineOnly: 'Boutiques en ligne seulement', buyOnline: 'Acheter en ligne', website: 'Site web', emptyTitle: 'Aucune boutique pour le moment', empty: 'Ajoutez des boutiques dans src/data/shops.json pour les afficher ici et sur la carte.' },
  partners: { eyebrow: 'Revendeurs', title: 'Boutiques partenaires qui proposent Omakase', body: 'Une sélection de librairies, concept stores, boutiques de musée et magasins de jeux où trouver le jeu.' },
  play: { ...en.play, eyebrow: 'Contre IA', title: 'La table numérique arrive bientôt', body: 'Cet onglet est prêt pour le futur dépôt du jeu contre IA.' },
  footer: { line: 'Créé par Jean Kesselring' }
};

const de = {
  nav: { ...en.nav, home: 'Start', rules: 'Regeln', stores: 'Läden', play: 'Spielen', tagline: 'Sushi-Kartenspiel', language: 'Sprache', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' },
  hero: { ...en.hero, eyebrow: 'Ein taktisches Sushi-Kartenspiel', lede: 'Sammle edle Sushi, vervollständige Menüs und spiele Aktionskarten, bevor das Förderband alles verändert.', buy: 'Laden finden', learn: 'Regeln lernen' },
  media: { ...en.media, aria: 'Produktmedien', frontAlt: 'Omakase Spielschachtel', items: { menu: 'Menü-Leporello', cards: 'Karten auf dem Tisch', sleeve: 'Hülle und Verpackung', videoOne: 'Produktvideo', videoTwo: 'Tischvideo' } },
  preview: { eyebrow: 'Spielablauf', title: 'Ein Zug ist einfach. Das Timing nicht.', body: 'Das Förderband erzeugt in jedem Zug eine kleine Entscheidung: sofort nehmen, was hilft, oder etwas Stärkeres vorbereiten.', cta: 'Alle Regeln öffnen', steps: [{ title: 'Ziehen', body: 'Ziehe zuerst eine Karte vom Deck.' }, { title: 'Aktion', body: 'Du darfst eine Aktionskarte vor oder nach dem Tausch spielen.' }, { title: 'Tauschen', body: 'Tausche eine Karte aus deiner Hand mit einer Karte vom Band.' }, { title: 'Band bewegen', body: 'Lege eine neue Karte an, verschiebe das Band und wirf die herausfallende Karte ab.' }] },
  rules: {
    ...en.rules,
    eyebrow: 'Spiel lernen',
    title: 'Regeln',
    intro: 'Alles zum Spielen von Omakase: Aufbau, Zugablauf, Aktionskarten, Sets, Spielende und Wertung.',
    download: 'Regelheft öffnen',
    tutorial: 'Tutorial ansehen',
    cardsEyebrow: 'Aktionskarten',
    cardsTitle: 'Aktionskarten verändern den Tisch',
    cardsIntro: 'Du darfst nur eine Aktionskarte pro Zug spielen, deshalb zählt das Timing.',
    setsEyebrow: 'Sushi-Sets',
    setsTitle: 'Vervollständige die Menüs',
    setsBody: 'Eine Sushi-Karte kann zu einem oder zwei Sets gehören. Eine physische Karte kann nur in einem gewerteten Set zählen.',
    previewCard: 'Karte ansehen',
    closePreview: 'Kartenansicht schließen',
    scoringEyebrow: 'Wertungsbeispiele',
    scoringTitle: 'Erst Sets werten, dann übrige Sushi',
    scoringBody: 'Vollständige Sets ersetzen die Einzelwerte der enthaltenen Karten. Shoyu verdoppelt dein bestes berechtigtes Sushi außerhalb vollständiger Sets.',
    actionCount: (name) => `${name}-Karte`,
    sections: [
      { title: 'Aufbau', body: 'Mischt das Deck. Jeder Spieler erhält eine Karte. Legt sechs Karten offen als Förderband aus, mit Deck an einem Ende und Ablage am anderen.', items: ['Hände sind geheim.', 'Das Band hat normalerweise sechs offene Karten.', 'Benutzte und abgelegte Karten kommen in den Abwurf.'] },
      { title: 'Zugablauf', body: 'Ziehe eine Karte, spiele optional eine Aktionskarte, tausche eine Karte mit dem Band, spiele optional eine Aktion, falls noch keine gespielt wurde, und bewege dann das Band.', items: ['Zwei identische Karten dürfen nicht getauscht werden.', 'Ginger darf normalerweise nicht getauscht werden.', 'Pro Zug darf höchstens eine Aktionskarte gespielt werden.'] },
      { title: 'Handlimit', body: 'Dein Handlimit beginnt bei acht Karten. Am Ende deines Zuges wirfst du bis zu diesem Limit ab, falls nötig.', items: ['Jeder Matcha vor dir erhöht das Limit um eins.', 'Beim Abwerfen wählst du Karten außer Ginger.', 'Wenn du null Karten hattest, Ginger ziehst und tauschen musst, darf Ginger nur in diesem Fall getauscht werden.'] },
      { title: 'Deck', body: 'Das Deck wird so oft komplett durchgespielt wie Spieleranzahl minus eins.', items: ['Zwei Spieler: ein Durchlauf.', 'Drei Spieler: zwei Durchläufe.', 'Vier Spieler: drei Durchläufe.', 'Wenn gezogen werden muss und kein Mischen mehr erlaubt ist, endet das Spiel sofort.'] },
      { title: 'Check rufen', body: 'Wenn du am Ende deines Zuges ein vollständiges Set hast, darfst du Check rufen. Alle anderen spielen noch einen letzten Zug.', items: ['Der geschützte Spieler kann nicht mehr von gegnerischen Aktionen betroffen oder gewählt werden.', 'Fork darf gespielt werden, überspringt aber diesen Spieler.', 'Ein letzter Zug, der durch Wasabi ausfällt, ist verbraucht.'] },
      { title: 'Wertung', body: 'Vollständige Sets zählen ihren Menüwert. Karten außerhalb gewerteter Sets zählen ihren gedruckten Wert. Die meisten Aktionskarten zählen null.', items: ['Mehrere Kopien zählen separat.', 'Bei überlappenden Sets musst du entscheiden, welches Set die geteilte Karte nutzt.', 'Bei Gleichstand bleibt es ein Gleichstand.'] }
    ],
    scoringExamples: [
      { title: 'Kein vollständiges Set', body: 'Addiere den Wert jeder Sushi-Karte. Aktionskarten ohne Preis zählen null.' },
      { title: 'Omakase Set mit Shoyu', body: 'Das Set zählt 6000 Yen. Shoyu verdoppelt das beste Sushi außerhalb des Sets.' },
      { title: 'Zwei Shoyu', body: 'Jeder Shoyu muss eine andere berechtigte Sushi-Karte verdoppeln.' },
      { title: 'Nur Kids Set', body: 'Wenn alle Sushi im Set liegen, hat Shoyu keine Karte zum Verdoppeln.' },
      { title: 'Setwahl zählt', body: 'Wenn Karten überlappende Sets bilden könnten, wähle die Kombination vor dem Addieren übriger Sushi.' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Ginger bringt keinen Vorteil und blockiert Platz in deiner Hand.', detail: 'Er darf normalerweise nicht getauscht oder abgeworfen werden. Wenn du null Karten hattest, Ginger ziehst und tauschen musst, darfst du ihn nur dann tauschen.' },
    Sake: { effect: 'Nimm eine zufällige Karte von einem berechtigten Gegner und gib ihm dann eine Karte aus deiner Hand.', detail: 'Geschützte Spieler und Spieler ohne Karten dürfen nicht gewählt werden.' },
    Umeshu: { effect: 'Mische deine Hand mit der Hand eines berechtigten Gegners und zieht dann abwechselnd.', detail: 'Du ziehst zuerst. Geschützte Spieler und Spieler ohne Karten dürfen nicht gewählt werden.' },
    "Chef's Choice": { effect: 'Ziehe drei Karten und lege dann zwei Karten aus deiner Hand an beliebige Stellen ins Deck zurück.', detail: 'Wenn noch Durchläufe übrig sind, mische den Abwurf, bevor du aus einem leeren Deck weiterziehst.' },
    Wasabi: { effect: 'Wenn du Wasabi vom Deck oder von einem Spieler ziehst, setzt du deinen nächsten Zug aus.', detail: 'Vom Förderband löst Wasabi nicht aus. Mehrere Wasabi stapeln sich.' },
    Matcha: { effect: 'Ziehe eine Karte und lege Matcha vor dich.', detail: 'Jeder Matcha vor dir erhöht dein Handlimit um eins.' },
    Chopsticks: { effect: 'Ziehe eine zufällige Karte aus der Hand eines berechtigten Gegners.', detail: 'Geschützte Spieler und Spieler ohne Karten dürfen nicht gewählt werden.' },
    Fork: { effect: 'Alle anderen ungeschützten Spieler werfen ihr teuerstes Sushi ab.', detail: 'Bei Gleichstand entscheidet jeder betroffene Spieler selbst, welche gebundene Karte er abwirft.' },
    Shoyu: { effect: 'Am Spielende verdoppelst du dein teuerstes Sushi, das nicht Teil eines vollständigen Sets ist.', detail: 'Jeder Shoyu muss auf eine andere berechtigte Karte angewendet werden. Gleichstände entscheidet der Besitzer.' }
  },
  stores: { ...en.stores, eyebrow: 'Kaufen', title: 'Omakase in deiner Nähe finden', intro: 'Läden werden über eine JSON-Datei ergänzt. Online-Links erscheinen, wenn vorhanden.', search: 'Läden suchen', searchPlaceholder: 'Stadt, Land oder Laden', onlineOnly: 'Nur Online-Shops', buyOnline: 'Online kaufen', website: 'Webseite', emptyTitle: 'Noch keine Läden eingetragen', empty: 'Ergänze Läden in src/data/shops.json, dann erscheinen sie hier und auf der Karte.' },
  partners: { eyebrow: 'Handelspartner', title: 'Ausgewählte Shops mit Omakase', body: 'Eine wachsende Liste aus Buchhandlungen, Concept Stores, Museumsshops und Spieleläden, in denen du das Spiel findest.' },
  play: { ...en.play, eyebrow: 'Gegen KI', title: 'Der digitale Tisch kommt bald', body: 'Dieser Tab ist bereit für das spätere KI-Spiel-Repository.' },
  footer: { line: 'Erstellt von Jean Kesselring' }
};

const ja = {
  nav: { ...en.nav, home: 'ホーム', rules: 'ルール', stores: '店舗', play: 'プレイ', tagline: '寿司カードゲーム', language: '言語', openMenu: 'メニューを開く', closeMenu: 'メニューを閉じる' },
  hero: { ...en.hero, eyebrow: '戦略的な寿司カードゲーム', lede: '美しい寿司を集め、メニューセットを完成させ、ベルトが動く前にアクションカードを使いこなしましょう。', buy: '店舗を探す', learn: 'ルールを見る' },
  media: { ...en.media, aria: '商品メディア', frontAlt: 'Omakaseの箱', items: { menu: 'メニュー冊子', cards: 'テーブルのカード', sleeve: 'スリーブとパッケージ', videoOne: '商品動画', videoTwo: 'テーブル動画' } },
  preview: { eyebrow: '流れ', title: '手番は簡単。でもタイミングが大事。', body: 'コンベアベルトは毎ターン小さな選択を生みます。今ほしいカードを取るか、もっと強い手を準備するか。', cta: '詳しいルールを見る', steps: [{ title: '引く', body: 'まず山札から1枚引きます。' }, { title: '行動', body: '交換の前か後に、アクションカードを1枚だけ使えます。' }, { title: '交換', body: '手札1枚とベルト上のカード1枚を交換します。' }, { title: 'ベルトを動かす', body: '新しいカードを加え、ベルトをずらし、落ちたカードを捨てます。' }] },
  rules: {
    ...en.rules,
    eyebrow: '遊び方',
    title: 'ルール',
    intro: 'Omakaseを遊ぶための準備、手番、アクションカード、セット、終了条件、得点計算です。',
    download: 'ルールブックを開く',
    tutorial: 'チュートリアルを見る',
    cardsEyebrow: 'アクションカード',
    cardsTitle: 'アクションカードが場を変える',
    cardsIntro: '1ターンに使えるアクションカードは1枚だけ。使うタイミングが重要です。',
    setsEyebrow: '寿司セット',
    setsTitle: 'メニューセットを完成させる',
    setsBody: '寿司カードは1つまたは2つのセットに属します。同じカードを複数の得点セットに使うことはできません。',
    previewCard: 'カードを見る',
    closePreview: 'カード表示を閉じる',
    scoringEyebrow: '得点例',
    scoringTitle: 'まずセット、次に残りの寿司',
    scoringBody: '完成したセットは、その中のカードの個別点ではなくセット点で数えます。Shoyuは完成セット外の対象寿司を倍にします。',
    actionCount: (name) => `${name}カード`,
    sections: [
      { title: '準備', body: '山札を混ぜます。各プレイヤーに1枚配ります。6枚を表向きに並べてコンベアベルトを作り、片側に山札、反対側に捨て札を置きます。', items: ['手札は自分だけが見ます。', '通常、ベルトには6枚の表向きカードがあります。', '使ったカードや捨てたカードは捨て札に置きます。'] },
      { title: '手番の流れ', body: '1枚引き、任意でアクションを使い、ベルトと1枚交換し、まだ使っていなければ任意でアクションを使い、最後にベルトを動かします。', items: ['同じカード同士は交換できません。', 'Gingerは通常交換できません。', '1ターンに使えるアクションカードは最大1枚です。'] },
      { title: '手札上限', body: '手札上限は8枚から始まります。ターン終了時に上限を超えていれば、上限まで捨てます。', items: ['前に置いたMatcha1枚につき上限が1増えます。', '捨てる時はGinger以外を選びます。', '手札0枚からGingerを引いて交換しなければならない場合だけ、Gingerを交換できます。'] },
      { title: '山札', body: '山札はプレイヤー人数マイナス1回、最後まで使います。', items: ['2人なら1回。', '3人なら2回。', '4人なら3回。', '引く必要があり、もう混ぜ直せない場合、ゲームはすぐ終了します。'] },
      { title: 'チェック', body: '自分のターン終了時に完成セットがあれば、チェックを宣言できます。他のプレイヤーは最後に1ターンずつ行います。', items: ['チェックしたプレイヤーは以後の相手のアクション対象にならず、効果も受けません。', 'Forkは使えますが、そのプレイヤーには効きません。', 'Wasabiで最後のターンを飛ばした場合、その最後のターンは消費されます。'] },
      { title: '得点', body: '完成セットはセット点で数えます。セットに使わないカードは印刷された点で数えます。ほとんどのアクションカードは0点です。', items: ['同じ寿司が複数あれば別々に数えます。', '重なるセットでは、共有カードをどちらに使うか選びます。', '同点ならそのまま同点です。'] }
    ],
    scoringExamples: [
      { title: '完成セットなし', body: 'すべての寿司カードの値を足します。価格のないアクションカードは0点です。' },
      { title: 'Omakase SetとShoyu', body: 'セットは6000円。Shoyuはセット外の最高値の寿司を倍にします。' },
      { title: 'Shoyuが2枚', body: 'それぞれのShoyuは別の対象寿司を倍にしなければなりません。' },
      { title: 'Kids Setのみ', body: 'すべての寿司がセット内なら、Shoyuで倍にできるカードはありません。' },
      { title: 'セット選択が重要', body: 'カードが重なるセットを作れる場合、残りの寿司を足す前に組み合わせを選びます。' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Gingerは役に立つ効果がなく、手札の場所を取ります。', detail: '通常は交換も捨てることもできません。手札0枚からGingerを引いて交換が必要な場合だけ交換できます。' },
    Sake: { effect: '対象にできる相手からランダムに1枚取り、その後自分の手札から1枚渡します。', detail: '保護されたプレイヤーや手札0枚のプレイヤーは対象にできません。' },
    Umeshu: { effect: '自分と対象にできる相手の手札を混ぜ、交互に引き直します。', detail: 'あなたから引きます。保護されたプレイヤーや手札0枚のプレイヤーは選べません。' },
    "Chef's Choice": { effect: '3枚引き、手札から任意の2枚を山札の好きな位置に戻します。', detail: '混ぜ直しが残っていれば、空の山札から引き続ける前に捨て札を混ぜます。' },
    Wasabi: { effect: '山札または他のプレイヤーから引いた場合、次のターンを飛ばします。', detail: 'ベルトから取った場合は発動しません。複数のWasabiは重なります。' },
    Matcha: { effect: '1枚引き、Matchaを自分の前に置きます。', detail: '前にあるMatcha1枚ごとに手札上限が1増えます。' },
    Chopsticks: { effect: '対象にできる相手の手札からランダムに1枚引きます。', detail: '保護されたプレイヤーや手札0枚のプレイヤーは対象にできません。' },
    Fork: { effect: '保護されていない他の全プレイヤーは、最高値の寿司を1枚捨てます。', detail: '最高値が同点なら、そのカードの持ち主がどれを捨てるか選びます。' },
    Shoyu: { effect: 'ゲーム終了時、完成セットに入っていない最高値の寿司を倍にします。', detail: '各Shoyuは別の対象カードに使います。同点は持ち主が選びます。' }
  },
  stores: { ...en.stores, eyebrow: '購入場所', title: 'Omakaseを買える店舗', intro: '店舗はJSONファイルに追加できます。オンライン購入リンクがある場合は表示されます。', search: '店舗検索', searchPlaceholder: '都市、国、店舗名', onlineOnly: 'オンライン販売のみ', buyOnline: 'オンラインで買う', website: 'ウェブサイト', emptyTitle: '店舗はまだありません', empty: 'src/data/shops.json に店舗を追加すると、ここ と地図に表示されます。' },
  partners: { eyebrow: '取扱店', title: 'Omakaseを扱う信頼できるショップ', body: '書店、コンセプトストア、ミュージアムショップ、ゲーム店など、取扱店の一覧です。' },
  play: { ...en.play, eyebrow: 'AI対戦', title: 'デジタル卓は準備中です', body: 'このタブは、今後のAIゲームリポジトリ統合のために用意されています。' },
  footer: { line: 'Jean Kesselring 制作' }
};

export const dictionaries = { en, fr, de, ja };
