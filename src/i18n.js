export const locales = ['en', 'fr', 'de', 'ja'];

export const localeLabels = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  ja: '日本語'
};

const englishActionCards = {
  Ginger: {
    effect: 'Ginger is a dead card: it has no helpful ability and mainly takes up space in your hand.',
    detail: 'You do not play Ginger as an action card. Keep it in hand unless another rule explicitly moves it.',
    cornerCases: [
      'Ginger cannot normally be exchanged with the conveyor belt.',
      'Ginger cannot normally be discarded when reducing your hand size; choose a non-Ginger card instead.',
      'Only exception: if you had zero cards, draw Ginger, and must exchange a card with the belt, you may exchange that Ginger.',
      'Ginger can still move through effects such as Sake, Umeshu, or Chef’s Choice.'
    ]
  },
  Sake: {
    effect: 'Choose an eligible opponent, take one random card from their hand, then give that opponent one card from your hand.',
    detail: 'Sake is a swap with an unknown first half: you gain a random card before choosing what to give back.',
    cornerCases: [
      'You cannot choose the player who called check, because check protection blocks player-targeting actions.',
      'You cannot choose a player with zero cards.',
      'If the random card you take is Wasabi, Wasabi triggers because it came from another player’s hand.',
      'The card you give back may be any card currently in your hand unless another rule forbids that specific movement.'
    ]
  },
  Umeshu: {
    effect: 'Choose an eligible opponent, combine both hands into one pile, shuffle it, then alternate drawing cards from that pile.',
    detail: 'You draw first, then the chosen opponent, continuing until the shared pile is empty.',
    cornerCases: [
      'You cannot choose the protected player after check.',
      'You cannot choose a player with zero cards.',
      'Wasabi drawn from the shared pile triggers because it is being acquired from another player’s hand through Umeshu.',
      'Ginger may move through Umeshu; the normal exchange and discard restrictions do not stop this effect.'
    ]
  },
  "Chef's Choice": {
    effect: 'Draw three cards from the deck, then return any two cards from your hand to the deck in any positions.',
    detail: 'The two returned cards can include cards you just drew or cards you already had.',
    cornerCases: [
      'If the deck runs out during the draw and reshuffles remain, shuffle the trash into a new deck before continuing.',
      'Because this is an action draw, complete the action as far as the deck lifecycle allows.',
      'Returned cards go into the deck in positions you choose, not into the trash.',
      'Chef’s Choice can remove Ginger from your hand by placing it back into the deck.'
    ]
  },
  Wasabi: {
    effect: 'When you acquire Wasabi from the deck or another player’s hand, you must skip your next turn.',
    detail: 'Wasabi is triggered by how you get it, not by playing it from hand.',
    cornerCases: [
      'Wasabi triggers when drawn from the deck.',
      'Wasabi triggers when drawn by Chef’s Choice, because the card comes from the deck.',
      'Wasabi triggers when taken from another player through effects such as Sake, Umeshu, or Chopsticks.',
      'Wasabi does not trigger when you take it from the conveyor belt during the exchange step.',
      'Multiple Wasabi stack, so multiple skipped turns can be pending.',
      'If Wasabi skips your final turn after check, that final turn is still consumed.'
    ]
  },
  Matcha: {
    effect: 'Draw one card, then place Matcha in front of you instead of discarding it.',
    detail: 'Each Matcha in front of you permanently increases your maximum hand size by one.',
    cornerCases: [
      'Matcha stays in front of you and does not go to the trash after resolving.',
      'If the deck is empty and reshuffles remain, reshuffle before drawing for Matcha.',
      'If the card drawn by Matcha is Wasabi, Wasabi triggers because it was drawn from the deck.',
      'Multiple Matcha cards stack, increasing your hand limit by one each.'
    ]
  },
  Chopsticks: {
    effect: 'Choose an eligible opponent and draw one random card from that player’s hand.',
    detail: 'Unlike Sake, you do not give a card back.',
    cornerCases: [
      'You cannot choose the protected player after check.',
      'You cannot choose a player with zero cards.',
      'If you draw Wasabi from the opponent, Wasabi triggers because it came from another player’s hand.',
      'The chosen card is random; you do not inspect the hand first.'
    ]
  },
  Fork: {
    effect: 'Every other unprotected player discards their most expensive sushi card.',
    detail: 'Fork affects multiple players, but it skips anyone protected by check.',
    cornerCases: [
      'The player who called check is not affected by Fork.',
      'Players discard sushi cards only; action cards are not considered for “most expensive sushi”.',
      'If a player has no sushi cards, that player discards nothing.',
      'If several sushi cards tie for highest price, the owner chooses which tied card to discard.'
    ]
  },
  Shoyu: {
    effect: 'At scoring, double your most expensive sushi card that is not part of a completed set.',
    detail: 'Shoyu is kept until scoring. It is worth zero by itself, but can increase the value of loose sushi.',
    cornerCases: [
      'Shoyu never doubles a sushi card that is being counted inside a completed set.',
      'Each Shoyu must apply to a different eligible sushi card.',
      'If multiple eligible sushi cards tie for most expensive, you choose which one Shoyu doubles.',
      'If all your sushi cards are inside completed sets, Shoyu has no eligible target and adds no value.',
      'Shoyu doubles the card’s printed value; it does not double an entire set.'
    ]
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
    cornerCasesLabel: 'Corner cases',
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
      { title: 'Two completed sets', body: 'Non-overlapping completed sets can both score. Add each set value, then add any loose sushi outside those sets.' }
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
    cornerCasesLabel: 'Cas particuliers',
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
      { title: 'Deux sets complétés', body: 'Des sets complétés qui ne se chevauchent pas peuvent tous les deux marquer. Additionnez chaque valeur de set, puis les sushis restants.' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Ginger est une carte morte : elle n’aide pas et occupe surtout de la place dans votre main.', detail: 'Vous ne jouez pas Ginger comme une action. Gardez-la en main, sauf si un autre effet la déplace explicitement.', cornerCases: ['Ginger ne peut normalement pas être échangé avec le tapis roulant.', 'Ginger ne peut normalement pas être défaussé pour réduire votre main ; choisissez une carte autre que Ginger.', 'Seule exception : si vous aviez zéro carte, piochez Ginger et devez échanger, vous pouvez échanger ce Ginger.', 'Ginger peut quand même bouger avec Sake, Umeshu ou Chef’s Choice.'] },
    Sake: { effect: 'Choisissez un adversaire éligible, prenez une carte aléatoire de sa main, puis donnez-lui une carte de votre main.', detail: 'Sake est un échange dont la première moitié est inconnue : vous gagnez une carte aléatoire avant de choisir quoi rendre.', cornerCases: ['Vous ne pouvez pas choisir le joueur qui a appelé l’addition : sa protection bloque les actions qui ciblent un joueur.', 'Vous ne pouvez pas choisir un joueur sans carte.', 'Si la carte prise au hasard est Wasabi, Wasabi se déclenche car elle vient de la main d’un autre joueur.', 'La carte donnée peut être n’importe quelle carte de votre main, sauf si une autre règle interdit ce déplacement précis.'] },
    Umeshu: { effect: 'Choisissez un adversaire éligible, mélangez vos deux mains ensemble, puis repiochez à tour de rôle.', detail: 'Vous piochez en premier, puis l’adversaire choisi, jusqu’à ce que la pile soit vide.', cornerCases: ['Vous ne pouvez pas choisir le joueur protégé après l’addition.', 'Vous ne pouvez pas choisir un joueur sans carte.', 'Wasabi pioché dans la pile commune se déclenche, car il est acquis depuis la main d’un autre joueur via Umeshu.', 'Ginger peut bouger avec Umeshu ; ses restrictions normales d’échange et de défausse ne bloquent pas cet effet.'] },
    "Chef's Choice": { effect: 'Piochez trois cartes du deck, puis remettez deux cartes de votre main dans le deck à n’importe quelle position.', detail: 'Les deux cartes remises peuvent être des cartes tout juste piochées ou des cartes que vous aviez déjà.', cornerCases: ['Si le deck se vide pendant la pioche et qu’il reste des remélanges, mélangez la défausse pour former un nouveau deck avant de continuer.', 'Comme il s’agit d’une pioche d’action, résolvez l’action aussi loin que le cycle du deck le permet.', 'Les cartes remises vont dans le deck aux positions choisies, pas dans la défausse.', 'Chef’s Choice peut retirer Ginger de votre main en le replaçant dans le deck.'] },
    Wasabi: { effect: 'Quand vous obtenez Wasabi depuis le deck ou la main d’un autre joueur, vous devez sauter votre prochain tour.', detail: 'Wasabi dépend de la manière dont vous l’obtenez, pas d’un jeu depuis la main.', cornerCases: ['Wasabi se déclenche quand il est pioché du deck.', 'Wasabi se déclenche quand il est pioché par Chef’s Choice, car la carte vient du deck.', 'Wasabi se déclenche quand il est pris chez un autre joueur avec Sake, Umeshu ou Chopsticks.', 'Wasabi ne se déclenche pas quand vous le prenez du tapis roulant pendant l’échange.', 'Plusieurs Wasabi se cumulent : plusieurs tours sautés peuvent être en attente.', 'Si Wasabi saute votre dernier tour après l’addition, ce dernier tour est quand même consommé.'] },
    Matcha: { effect: 'Piochez une carte, puis placez Matcha devant vous au lieu de le défausser.', detail: 'Chaque Matcha devant vous augmente durablement votre taille de main maximale de un.', cornerCases: ['Matcha reste devant vous et ne va pas dans la défausse après résolution.', 'Si le deck est vide et qu’il reste des remélanges, remélangez avant de piocher pour Matcha.', 'Si la carte piochée par Matcha est Wasabi, Wasabi se déclenche car elle vient du deck.', 'Plusieurs Matcha se cumulent et augmentent chacun la limite de main de un.'] },
    Chopsticks: { effect: 'Choisissez un adversaire éligible et piochez une carte aléatoire de sa main.', detail: 'Contrairement à Sake, vous ne donnez aucune carte en retour.', cornerCases: ['Vous ne pouvez pas choisir le joueur protégé après l’addition.', 'Vous ne pouvez pas choisir un joueur sans carte.', 'Si vous piochez Wasabi chez l’adversaire, Wasabi se déclenche car elle vient de la main d’un autre joueur.', 'La carte choisie est aléatoire ; vous ne regardez pas la main avant.'] },
    Fork: { effect: 'Tous les autres joueurs non protégés défaussent leur sushi le plus cher.', detail: 'Fork affecte plusieurs joueurs, mais ignore toute personne protégée par l’addition.', cornerCases: ['Le joueur qui a appelé l’addition n’est pas affecté par Fork.', 'Les joueurs défaussent uniquement des cartes sushi ; les actions ne comptent pas comme “sushi le plus cher”.', 'Si un joueur n’a aucun sushi, il ne défausse rien.', 'Si plusieurs sushis sont à égalité au prix le plus élevé, leur propriétaire choisit lequel défausser.'] },
    Shoyu: { effect: 'Au score, doublez votre sushi le plus cher qui ne fait pas partie d’un set complété.', detail: 'Shoyu est gardé jusqu’au score. Il vaut zéro seul, mais peut augmenter la valeur d’un sushi hors set.', cornerCases: ['Shoyu ne double jamais un sushi compté dans un set complété.', 'Chaque Shoyu doit s’appliquer à une carte sushi éligible différente.', 'Si plusieurs sushis éligibles sont à égalité, vous choisissez celui que Shoyu double.', 'Si tous vos sushis sont dans des sets complétés, Shoyu n’a aucune cible et n’ajoute rien.', 'Shoyu double la valeur imprimée de la carte ; il ne double pas un set entier.'] }
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
    cornerCasesLabel: 'Sonderfälle',
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
      { title: 'Zwei vollständige Sets', body: 'Nicht überlappende vollständige Sets können beide zählen. Addiere jeden Setwert und danach übrige Sushi außerhalb der Sets.' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Ginger ist eine tote Karte: Sie hilft nicht und nimmt vor allem Platz auf deiner Hand ein.', detail: 'Du spielst Ginger nicht als Aktionskarte. Behalte ihn auf der Hand, außer ein anderer Effekt bewegt ihn ausdrücklich.', cornerCases: ['Ginger darf normalerweise nicht mit dem Förderband getauscht werden.', 'Ginger darf beim Reduzieren der Handgröße normalerweise nicht abgeworfen werden; wähle eine Nicht-Ginger-Karte.', 'Einzige Ausnahme: Wenn du null Karten hattest, Ginger ziehst und tauschen musst, darfst du diesen Ginger tauschen.', 'Ginger kann trotzdem durch Sake, Umeshu oder Chef’s Choice bewegt werden.'] },
    Sake: { effect: 'Wähle einen berechtigten Gegner, nimm zufällig eine Karte aus seiner Hand und gib ihm danach eine Karte aus deiner Hand.', detail: 'Sake ist ein Tausch mit unbekannter erster Hälfte: Du bekommst zuerst zufällig eine Karte und entscheidest danach, was zurückgeht.', cornerCases: ['Der Spieler, der Check gerufen hat, darf nicht gewählt werden, weil Check-Schutz spielerzielende Aktionen blockiert.', 'Ein Spieler ohne Karten darf nicht gewählt werden.', 'Wenn die zufällig genommene Karte Wasabi ist, löst Wasabi aus, weil sie aus der Hand eines anderen Spielers kommt.', 'Die zurückgegebene Karte kann jede Karte in deiner Hand sein, sofern keine andere Regel genau diese Bewegung verbietet.'] },
    Umeshu: { effect: 'Wähle einen berechtigten Gegner, mische beide Hände zu einem Stapel und zieht dann abwechselnd daraus.', detail: 'Du ziehst zuerst, dann der gewählte Gegner, bis der gemeinsame Stapel leer ist.', cornerCases: ['Der geschützte Spieler nach Check darf nicht gewählt werden.', 'Ein Spieler ohne Karten darf nicht gewählt werden.', 'Wasabi aus dem gemeinsamen Stapel löst aus, weil es durch Umeshu aus der Hand eines anderen Spielers erworben wird.', 'Ginger kann durch Umeshu bewegt werden; die normalen Tausch- und Abwurfverbote blockieren diesen Effekt nicht.'] },
    "Chef's Choice": { effect: 'Ziehe drei Karten vom Deck und lege dann zwei Karten aus deiner Hand an beliebige Positionen ins Deck zurück.', detail: 'Die zurückgelegten Karten dürfen gerade gezogene oder bereits vorhandene Karten sein.', cornerCases: ['Wenn das Deck während des Ziehens leer wird und noch Durchläufe übrig sind, mische den Abwurf zu einem neuen Deck, bevor du weiterziehst.', 'Da dies ein Aktionszug ist, führe die Aktion so weit aus, wie der Deckzyklus es erlaubt.', 'Zurückgelegte Karten kommen an gewählte Positionen ins Deck, nicht in den Abwurf.', 'Chef’s Choice kann Ginger aus deiner Hand entfernen, indem du ihn ins Deck zurücklegst.'] },
    Wasabi: { effect: 'Wenn du Wasabi vom Deck oder aus der Hand eines anderen Spielers erhältst, musst du deinen nächsten Zug aussetzen.', detail: 'Wasabi hängt davon ab, wie du die Karte bekommst; sie wird nicht aus der Hand gespielt.', cornerCases: ['Wasabi löst aus, wenn sie vom Deck gezogen wird.', 'Wasabi löst aus, wenn sie durch Chef’s Choice gezogen wird, weil die Karte vom Deck kommt.', 'Wasabi löst aus, wenn sie durch Sake, Umeshu oder Chopsticks von einem anderen Spieler genommen wird.', 'Wasabi löst nicht aus, wenn du sie beim Tausch vom Förderband nimmst.', 'Mehrere Wasabi stapeln sich, also können mehrere ausgesetzte Züge anstehen.', 'Wenn Wasabi deinen letzten Zug nach Check überspringt, ist dieser letzte Zug trotzdem verbraucht.'] },
    Matcha: { effect: 'Ziehe eine Karte und lege Matcha danach vor dich, statt ihn abzuwerfen.', detail: 'Jeder Matcha vor dir erhöht dein maximales Handlimit dauerhaft um eins.', cornerCases: ['Matcha bleibt nach dem Ausführen vor dir und kommt nicht in den Abwurf.', 'Wenn das Deck leer ist und noch Durchläufe übrig sind, mische vor dem Matcha-Zug neu.', 'Wenn die durch Matcha gezogene Karte Wasabi ist, löst Wasabi aus, weil sie vom Deck gezogen wurde.', 'Mehrere Matcha stapeln sich und erhöhen das Handlimit jeweils um eins.'] },
    Chopsticks: { effect: 'Wähle einen berechtigten Gegner und ziehe zufällig eine Karte aus seiner Hand.', detail: 'Anders als bei Sake gibst du keine Karte zurück.', cornerCases: ['Der geschützte Spieler nach Check darf nicht gewählt werden.', 'Ein Spieler ohne Karten darf nicht gewählt werden.', 'Wenn du Wasabi vom Gegner ziehst, löst Wasabi aus, weil sie aus der Hand eines anderen Spielers kommt.', 'Die Karte wird zufällig gewählt; du siehst dir die Hand vorher nicht an.'] },
    Fork: { effect: 'Alle anderen ungeschützten Spieler werfen ihr teuerstes Sushi ab.', detail: 'Fork betrifft mehrere Spieler, überspringt aber jeden mit Check-Schutz.', cornerCases: ['Der Spieler, der Check gerufen hat, ist von Fork nicht betroffen.', 'Es werden nur Sushi-Karten abgeworfen; Aktionskarten zählen nicht als “teuerstes Sushi”.', 'Wenn ein Spieler keine Sushi-Karten hat, wirft er nichts ab.', 'Bei mehreren gleich teuren teuersten Sushi entscheidet der Besitzer, welche Karte abgeworfen wird.'] },
    Shoyu: { effect: 'Bei der Wertung verdoppelst du dein teuerstes Sushi, das nicht Teil eines vollständigen Sets ist.', detail: 'Shoyu bleibt bis zur Wertung auf der Hand. Allein zählt er null, kann aber den Wert loser Sushi erhöhen.', cornerCases: ['Shoyu verdoppelt nie ein Sushi, das in einem vollständigen Set gezählt wird.', 'Jeder Shoyu muss auf eine andere berechtigte Sushi-Karte angewendet werden.', 'Wenn mehrere berechtigte Sushi gleich teuer sind, entscheidest du, welches Shoyu verdoppelt.', 'Wenn alle deine Sushi in vollständigen Sets liegen, hat Shoyu kein Ziel und bringt keinen Wert.', 'Shoyu verdoppelt den gedruckten Kartenwert; er verdoppelt kein ganzes Set.'] }
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
    cornerCasesLabel: '例外と注意点',
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
      { title: '完成セットが2つ', body: '重ならない完成セットは両方得点できます。各セット点を足し、その後セット外の寿司を加えます。' }
    ]
  },
  actionCards: {
    Ginger: { effect: 'Gingerは役に立たないカードです。効果はなく、主に手札を圧迫します。', detail: 'Gingerはアクションとして使いません。他の効果で明示的に動かされない限り、手札に残ります。', cornerCases: ['Gingerは通常、コンベアベルトと交換できません。', '手札上限で捨てる時も、通常Gingerは捨てられません。Ginger以外を選びます。', '唯一の例外：手札0枚からGingerを引き、交換が必要な場合だけ、そのGingerを交換できます。', 'Sake、Umeshu、Chef’s Choiceの効果ではGingerが移動することがあります。'] },
    Sake: { effect: '対象にできる相手を選び、その手札からランダムに1枚取り、その後自分の手札から1枚渡します。', detail: 'Sakeは前半が不確定な交換です。先にランダムなカードを得てから、返すカードを選びます。', cornerCases: ['チェックを宣言したプレイヤーは保護されているため、対象にできません。', '手札0枚のプレイヤーは対象にできません。', 'ランダムに取ったカードがWasabiなら、他のプレイヤーの手札から得たためWasabiが発動します。', '渡すカードは、他のルールがその移動を禁止していない限り、現在の手札から選べます。'] },
    Umeshu: { effect: '対象にできる相手を選び、両方の手札を1つの山にして混ぜ、交互に引き直します。', detail: 'あなたから引き、次に相手が引きます。山がなくなるまで続けます。', cornerCases: ['チェック後に保護されたプレイヤーは選べません。', '手札0枚のプレイヤーは選べません。', '共有の山からWasabiを引いた場合、Umeshuで他のプレイヤーの手札から得た扱いになるため発動します。', 'GingerはUmeshuで移動できます。通常の交換・捨て札制限はこの効果を止めません。'] },
    "Chef's Choice": { effect: '山札から3枚引き、その後手札から任意の2枚を山札の好きな位置に戻します。', detail: '戻す2枚は、今引いたカードでも、元から持っていたカードでもかまいません。', cornerCases: ['3枚引く途中で山札がなくなり、混ぜ直しが残っていれば、捨て札を混ぜて新しい山札にしてから続けます。', 'これはアクションによるドローなので、山札の処理が許す限り効果を完了します。', '戻したカードは捨て札ではなく、選んだ位置の山札に入ります。', 'Chef’s ChoiceはGingerを山札に戻すことで手札から取り除けます。'] },
    Wasabi: { effect: '山札または他のプレイヤーの手札からWasabiを得た場合、次の自分のターンを飛ばします。', detail: 'Wasabiは手札から使うカードではなく、どこから得たかで発動します。', cornerCases: ['山札から引いたWasabiは発動します。', 'Chef’s Choiceで引いたWasabiも、カードが山札から来るため発動します。', 'Sake、Umeshu、Chopsticksなどで他のプレイヤーから取ったWasabiも発動します。', '交換ステップでコンベアベルトから取ったWasabiは発動しません。', '複数のWasabiは重なり、複数ターンを飛ばすことがあります。', 'チェック後の最後のターンをWasabiで飛ばした場合、その最後のターンは消費されます。'] },
    Matcha: { effect: '1枚引き、その後Matchaを捨て札にせず自分の前に置きます。', detail: '自分の前にあるMatcha1枚ごとに、手札上限が恒久的に1増えます。', cornerCases: ['解決後、Matchaは自分の前に残り、捨て札には行きません。', '山札が空で混ぜ直しが残っていれば、Matchaのドロー前に混ぜ直します。', 'Matchaで引いたカードがWasabiなら、山札から引いたためWasabiが発動します。', '複数のMatchaは重なり、それぞれ手札上限を1増やします。'] },
    Chopsticks: { effect: '対象にできる相手を選び、その手札からランダムに1枚引きます。', detail: 'Sakeと違い、カードを返す必要はありません。', cornerCases: ['チェック後に保護されたプレイヤーは選べません。', '手札0枚のプレイヤーは選べません。', '相手からWasabiを引いた場合、他のプレイヤーの手札から得たためWasabiが発動します。', 'カードはランダムに選ばれます。先に手札を見ることはできません。'] },
    Fork: { effect: '保護されていない他の全プレイヤーは、自分の最高値の寿司を1枚捨てます。', detail: 'Forkは複数のプレイヤーに影響しますが、チェックで保護されたプレイヤーには効きません。', cornerCases: ['チェックを宣言したプレイヤーはForkの影響を受けません。', '捨てるのは寿司カードだけです。アクションカードは「最高値の寿司」に含めません。', '寿司カードを持っていないプレイヤーは何も捨てません。', '最高値の寿司が複数ある場合、その持ち主がどれを捨てるか選びます。'] },
    Shoyu: { effect: '得点計算時、完成セットに入っていない最高値の寿司を倍にします。', detail: 'Shoyuは得点計算まで持ちます。単体では0点ですが、セット外の寿司の価値を上げられます。', cornerCases: ['Shoyuは完成セットとして数える寿司を倍にできません。', '各Shoyuは別々の対象寿司カードに使います。', '対象にできる最高値の寿司が複数同点なら、どれを倍にするか選びます。', 'すべての寿司が完成セット内なら、Shoyuの対象はなく、得点は増えません。', 'Shoyuはカードの印刷値を倍にします。セット全体は倍にしません。'] }
  },
  stores: { ...en.stores, eyebrow: '購入場所', title: 'Omakaseを買える店舗', intro: '店舗はJSONファイルに追加できます。オンライン購入リンクがある場合は表示されます。', search: '店舗検索', searchPlaceholder: '都市、国、店舗名', onlineOnly: 'オンライン販売のみ', buyOnline: 'オンラインで買う', website: 'ウェブサイト', emptyTitle: '店舗はまだありません', empty: 'src/data/shops.json に店舗を追加すると、ここ と地図に表示されます。' },
  partners: { eyebrow: '取扱店', title: 'Omakaseを扱う信頼できるショップ', body: '書店、コンセプトストア、ミュージアムショップ、ゲーム店など、取扱店の一覧です。' },
  play: { ...en.play, eyebrow: 'AI対戦', title: 'デジタル卓は準備中です', body: 'このタブは、今後のAIゲームリポジトリ統合のために用意されています。' },
  footer: { line: 'Jean Kesselring 制作' }
};

export const dictionaries = { en, fr, de, ja };
