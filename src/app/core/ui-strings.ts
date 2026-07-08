import { UiLang } from './language.service';

/**
 * Tutti i testi dell'interfaccia, centralizzati per lingua.
 * `UiStrings` deriva dal builder italiano: il type-checker garantisce che
 * ogni lingua abbia esattamente le stesse chiavi.
 *
 * Nota: esposti tramite funzioni (non `const` top-level) per aggirare un bug
 * di inizializzazione dei chunk condivisi nel build multi-entry dei test
 * (@angular/build 22.0.x): le dichiarazioni di funzione restano utilizzabili
 * anche quando l'init "lazy" del chunk non viene eseguito.
 */

function buildIt() {
  return {
    appName: 'WikiTimeSurfer',
    tagline: 'Naviga nel tempo dentro le voci di Wikipedia',
    heroLead:
      'Scegli una voce e scorri tutta la sua storia, modifica dopo modifica: chi ha scritto cosa, quando, con le differenze evidenziate.',

    // home / ricerca
    wikiLabel: 'Edizione di Wikipedia',
    searchPlaceholder: 'Cerca una voce…',
    searchButton: 'Esplora la storia',
    examplesLabel: 'Prova con:',
    howTitle: 'Come funziona',
    how1: 'Cerca una voce in una qualsiasi edizione di Wikipedia.',
    how2: 'Scorri la cronologia con le frecce, la tastiera o la timeline.',
    how3: 'Le aggiunte sono in verde, le rimozioni in rosso. Clicca un autore per seguire solo le sue modifiche.',

    // viewer — intestazione e stati
    newSearch: 'Nuova ricerca',
    viewOnWikipedia: 'Voce su Wikipedia',
    notFound: 'Voce non trovata in questa edizione di Wikipedia.',
    historyError: 'Errore nel caricamento della cronologia. Riprova più tardi.',
    retry: 'Riprova',
    loadingHistory: 'Caricamento cronologia…',
    loadedRevisions: 'revisioni caricate',

    // filtro per utente
    filterActive: 'Stai navigando solo le modifiche di',
    filterEdits: 'modifiche',
    filterClear: 'Mostra tutte le modifiche',
    filterByUser: 'Naviga solo le modifiche di questo utente',
    userContribs: 'Contributi su Wikipedia',
    userHidden: 'utente nascosto',

    // navigazione
    firstVersion: 'Prima versione',
    prevVersion: 'Versione precedente',
    nextVersion: 'Versione successiva',
    lastVersion: 'Versione attuale',
    scrubber: 'Scorri le versioni',
    kbdVersions: 'versione precedente / successiva',
    kbdChanges: 'modifica precedente / successiva',
    kbdFirstLast: 'prima / attuale',
    kbdTop: 'inizio pagina',
    backToTop: 'Torna a inizio pagina (T)',

    // navigazione tra le modifiche nella pagina
    changeLabel: 'modifica',
    changeOf: 'di',
    prevChange: 'Modifica precedente nella pagina (↑ oppure W)',
    nextChange: 'Modifica successiva nella pagina (↓ oppure S)',

    // tema e lingua
    themeTitle: 'Cambia tema (auto → chiaro → scuro)',
    themeAuto: 'Auto',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',
    uiLangLabel: 'Lingua',

    // scheda revisione
    version: 'Versione',
    of: 'di',
    minorEdit: 'modifica minore',
    commentHidden: 'oggetto della modifica nascosto',
    thisVersionOnWiki: 'Questa versione su Wikipedia',
    bytes: 'byte',

    // diff
    diffLoading: 'Calcolo delle differenze…',
    diffError:
      'Impossibile caricare il contenuto di questa versione (potrebbe essere stata oscurata).',
    firstVersionNote:
      'Questa è la prima versione della voce: non c’è una versione precedente con cui confrontarla.',
    legendAdded: 'testo aggiunto',
    legendRemoved: 'testo rimosso',
    disambigNote:
      'Questa è una pagina di disambiguazione: clicca una delle voci nel testo per esplorarne la cronologia.',

    // timeline
    timelineTitle: 'Modifiche per mese',
    timelineEdits: 'modifiche',
    timelineEditsOne: 'modifica',
    legendUser: 'Modifiche di',
    legendOthers: 'Altre modifiche',

    // attribuzione e footer
    attributionPre: 'Contenuto della voce da',
    historyAuthors: 'cronologia e autori',
    attributionLicense: 'disponibile con licenza',
    footerLicense:
      'I contenuti delle voci provengono da Wikipedia e sono disponibili con licenza',
    footerDisclaimer:
      'WikiTimeSurfer è un progetto indipendente, non affiliato a Wikimedia Foundation.',
    footerSupport: 'Supporta il progetto',
    footerPrivacy: 'Privacy & Cookie',
  };
}

export type UiStrings = ReturnType<typeof buildIt>;

function buildEn(): UiStrings {
  return {
    appName: 'WikiTimeSurfer',
    tagline: 'Time-travel through Wikipedia articles',
    heroLead:
      'Pick an article and browse its whole history, edit by edit: who wrote what, when, with every difference highlighted.',

    wikiLabel: 'Wikipedia edition',
    searchPlaceholder: 'Search for an article…',
    searchButton: 'Explore the history',
    examplesLabel: 'Try:',
    howTitle: 'How it works',
    how1: 'Search for an article in any Wikipedia edition.',
    how2: 'Browse the history with the arrows, the keyboard or the timeline.',
    how3: 'Additions are green, removals red. Click an author to follow only their edits.',

    newSearch: 'New search',
    viewOnWikipedia: 'Article on Wikipedia',
    notFound: 'Article not found in this Wikipedia edition.',
    historyError: 'Error loading the history. Please try again later.',
    retry: 'Retry',
    loadingHistory: 'Loading history…',
    loadedRevisions: 'revisions loaded',

    filterActive: 'You are browsing only edits by',
    filterEdits: 'edits',
    filterClear: 'Show all edits',
    filterByUser: 'Browse only this user’s edits',
    userContribs: 'Contributions on Wikipedia',
    userHidden: 'user hidden',

    firstVersion: 'First version',
    prevVersion: 'Previous version',
    nextVersion: 'Next version',
    lastVersion: 'Current version',
    scrubber: 'Scrub through the versions',
    kbdVersions: 'previous / next version',
    kbdChanges: 'previous / next change',
    kbdFirstLast: 'first / current',
    kbdTop: 'top of page',
    backToTop: 'Back to top (T)',

    changeLabel: 'change',
    changeOf: 'of',
    prevChange: 'Previous change on the page (↑ or W)',
    nextChange: 'Next change on the page (↓ or S)',

    themeTitle: 'Switch theme (auto → light → dark)',
    themeAuto: 'Auto',
    themeLight: 'Light',
    themeDark: 'Dark',
    uiLangLabel: 'Language',

    version: 'Version',
    of: 'of',
    minorEdit: 'minor edit',
    commentHidden: 'edit summary hidden',
    thisVersionOnWiki: 'This version on Wikipedia',
    bytes: 'bytes',

    diffLoading: 'Computing differences…',
    diffError: 'Could not load this version’s content (it may have been redacted).',
    firstVersionNote:
      'This is the first version of the article: there is no previous version to compare it with.',
    legendAdded: 'added text',
    legendRemoved: 'removed text',
    disambigNote:
      'This is a disambiguation page: click one of the entries in the text to explore its history.',

    timelineTitle: 'Edits per month',
    timelineEdits: 'edits',
    timelineEditsOne: 'edit',
    legendUser: 'Edits by',
    legendOthers: 'Other edits',

    attributionPre: 'Article content from',
    historyAuthors: 'history and authors',
    attributionLicense: 'licensed under',
    footerLicense: 'Article contents come from Wikipedia and are available under the',
    footerDisclaimer:
      'WikiTimeSurfer is an independent project, not affiliated with the Wikimedia Foundation.',
    footerSupport: 'Support the project',
    footerPrivacy: 'Privacy & Cookies',
  };
}

function buildDe(): UiStrings {
  return {
    appName: 'WikiTimeSurfer',
    tagline: 'Zeitreise durch die Artikel der Wikipedia',
    heroLead:
      'Wähle einen Artikel und durchstöbere seine gesamte Versionsgeschichte, Änderung für Änderung: wer wann was geschrieben hat, mit hervorgehobenen Unterschieden.',

    wikiLabel: 'Wikipedia-Ausgabe',
    searchPlaceholder: 'Artikel suchen…',
    searchButton: 'Geschichte erkunden',
    examplesLabel: 'Probiere:',
    howTitle: 'So funktioniert es',
    how1: 'Suche einen Artikel in einer beliebigen Wikipedia-Ausgabe.',
    how2: 'Blättere mit den Pfeilen, der Tastatur oder der Zeitleiste durch die Versionen.',
    how3: 'Hinzugefügtes ist grün, Entferntes rot. Klicke auf einen Autor, um nur seinen Änderungen zu folgen.',

    newSearch: 'Neue Suche',
    viewOnWikipedia: 'Artikel auf Wikipedia',
    notFound: 'Artikel in dieser Wikipedia-Ausgabe nicht gefunden.',
    historyError: 'Fehler beim Laden der Versionsgeschichte. Bitte versuche es später erneut.',
    retry: 'Erneut versuchen',
    loadingHistory: 'Versionsgeschichte wird geladen…',
    loadedRevisions: 'Versionen geladen',

    filterActive: 'Du siehst nur Änderungen von',
    filterEdits: 'Änderungen',
    filterClear: 'Alle Änderungen anzeigen',
    filterByUser: 'Nur die Änderungen dieser Person durchblättern',
    userContribs: 'Beiträge auf Wikipedia',
    userHidden: 'Benutzer ausgeblendet',

    firstVersion: 'Erste Version',
    prevVersion: 'Vorherige Version',
    nextVersion: 'Nächste Version',
    lastVersion: 'Aktuelle Version',
    scrubber: 'Durch die Versionen blättern',
    kbdVersions: 'vorherige / nächste Version',
    kbdChanges: 'vorherige / nächste Änderung',
    kbdFirstLast: 'erste / aktuelle',
    kbdTop: 'Seitenanfang',
    backToTop: 'Zum Seitenanfang (T)',

    changeLabel: 'Änderung',
    changeOf: 'von',
    prevChange: 'Vorherige Änderung auf der Seite (↑ oder W)',
    nextChange: 'Nächste Änderung auf der Seite (↓ oder S)',

    themeTitle: 'Design wechseln (Auto → Hell → Dunkel)',
    themeAuto: 'Auto',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    uiLangLabel: 'Sprache',

    version: 'Version',
    of: 'von',
    minorEdit: 'kleine Änderung',
    commentHidden: 'Bearbeitungskommentar ausgeblendet',
    thisVersionOnWiki: 'Diese Version auf Wikipedia',
    bytes: 'Bytes',

    diffLoading: 'Unterschiede werden berechnet…',
    diffError:
      'Der Inhalt dieser Version konnte nicht geladen werden (er wurde möglicherweise versionsgelöscht).',
    firstVersionNote:
      'Dies ist die erste Version des Artikels: Es gibt keine frühere Version zum Vergleichen.',
    legendAdded: 'hinzugefügter Text',
    legendRemoved: 'entfernter Text',
    disambigNote:
      'Dies ist eine Begriffsklärungsseite: Klicke im Text auf einen Eintrag, um seine Versionsgeschichte zu erkunden.',

    timelineTitle: 'Änderungen pro Monat',
    timelineEdits: 'Änderungen',
    timelineEditsOne: 'Änderung',
    legendUser: 'Änderungen von',
    legendOthers: 'Andere Änderungen',

    attributionPre: 'Artikelinhalt von',
    historyAuthors: 'Versionsgeschichte und Autoren',
    attributionLicense: 'lizenziert unter',
    footerLicense: 'Die Artikelinhalte stammen aus Wikipedia und stehen unter der Lizenz',
    footerDisclaimer:
      'WikiTimeSurfer ist ein unabhängiges Projekt und nicht mit der Wikimedia Foundation verbunden.',
    footerSupport: 'Projekt unterstützen',
    footerPrivacy: 'Datenschutz & Cookies',
  };
}

function buildFr(): UiStrings {
  return {
    appName: 'WikiTimeSurfer',
    tagline: 'Voyagez dans le temps à travers les articles de Wikipédia',
    heroLead:
      'Choisissez un article et parcourez toute son histoire, modification après modification : qui a écrit quoi, quand, avec les différences mises en évidence.',

    wikiLabel: 'Édition de Wikipédia',
    searchPlaceholder: 'Rechercher un article…',
    searchButton: 'Explorer l’histoire',
    examplesLabel: 'Essayez :',
    howTitle: 'Comment ça marche',
    how1: 'Recherchez un article dans n’importe quelle édition de Wikipédia.',
    how2: 'Parcourez l’historique avec les flèches, le clavier ou la frise chronologique.',
    how3: 'Les ajouts sont en vert, les suppressions en rouge. Cliquez sur un auteur pour suivre uniquement ses modifications.',

    newSearch: 'Nouvelle recherche',
    viewOnWikipedia: 'Article sur Wikipédia',
    notFound: 'Article introuvable dans cette édition de Wikipédia.',
    historyError: 'Erreur lors du chargement de l’historique. Réessayez plus tard.',
    retry: 'Réessayer',
    loadingHistory: 'Chargement de l’historique…',
    loadedRevisions: 'révisions chargées',

    filterActive: 'Vous parcourez uniquement les modifications de',
    filterEdits: 'modifications',
    filterClear: 'Afficher toutes les modifications',
    filterByUser: 'Parcourir uniquement les modifications de cette personne',
    userContribs: 'Contributions sur Wikipédia',
    userHidden: 'utilisateur masqué',

    firstVersion: 'Première version',
    prevVersion: 'Version précédente',
    nextVersion: 'Version suivante',
    lastVersion: 'Version actuelle',
    scrubber: 'Faire défiler les versions',
    kbdVersions: 'version précédente / suivante',
    kbdChanges: 'modification précédente / suivante',
    kbdFirstLast: 'première / actuelle',
    kbdTop: 'haut de page',
    backToTop: 'Retour en haut (T)',

    changeLabel: 'modification',
    changeOf: 'sur',
    prevChange: 'Modification précédente dans la page (↑ ou W)',
    nextChange: 'Modification suivante dans la page (↓ ou S)',

    themeTitle: 'Changer de thème (auto → clair → sombre)',
    themeAuto: 'Auto',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    uiLangLabel: 'Langue',

    version: 'Version',
    of: 'sur',
    minorEdit: 'modification mineure',
    commentHidden: 'résumé de modification masqué',
    thisVersionOnWiki: 'Cette version sur Wikipédia',
    bytes: 'octets',

    diffLoading: 'Calcul des différences…',
    diffError:
      'Impossible de charger le contenu de cette version (il a peut-être été masqué).',
    firstVersionNote:
      'Ceci est la première version de l’article : il n’y a pas de version précédente à comparer.',
    legendAdded: 'texte ajouté',
    legendRemoved: 'texte supprimé',
    disambigNote:
      'Ceci est une page d’homonymie : cliquez sur une entrée du texte pour explorer son historique.',

    timelineTitle: 'Modifications par mois',
    timelineEdits: 'modifications',
    timelineEditsOne: 'modification',
    legendUser: 'Modifications de',
    legendOthers: 'Autres modifications',

    attributionPre: 'Contenu de l’article issu de',
    historyAuthors: 'historique et auteurs',
    attributionLicense: 'sous licence',
    footerLicense:
      'Les contenus des articles proviennent de Wikipédia et sont disponibles sous licence',
    footerDisclaimer:
      'WikiTimeSurfer est un projet indépendant, non affilié à la Wikimedia Foundation.',
    footerSupport: 'Soutenir le projet',
    footerPrivacy: 'Confidentialité & cookies',
  };
}

function buildEs(): UiStrings {
  return {
    appName: 'WikiTimeSurfer',
    tagline: 'Viaja en el tiempo por los artículos de Wikipedia',
    heroLead:
      'Elige un artículo y recorre toda su historia, edición a edición: quién escribió qué y cuándo, con las diferencias resaltadas.',

    wikiLabel: 'Edición de Wikipedia',
    searchPlaceholder: 'Buscar un artículo…',
    searchButton: 'Explorar la historia',
    examplesLabel: 'Prueba con:',
    howTitle: 'Cómo funciona',
    how1: 'Busca un artículo en cualquier edición de Wikipedia.',
    how2: 'Recorre el historial con las flechas, el teclado o la línea de tiempo.',
    how3: 'Lo añadido está en verde, lo eliminado en rojo. Haz clic en un autor para seguir solo sus ediciones.',

    newSearch: 'Nueva búsqueda',
    viewOnWikipedia: 'Artículo en Wikipedia',
    notFound: 'Artículo no encontrado en esta edición de Wikipedia.',
    historyError: 'Error al cargar el historial. Inténtalo de nuevo más tarde.',
    retry: 'Reintentar',
    loadingHistory: 'Cargando historial…',
    loadedRevisions: 'revisiones cargadas',

    filterActive: 'Estás viendo solo las ediciones de',
    filterEdits: 'ediciones',
    filterClear: 'Mostrar todas las ediciones',
    filterByUser: 'Recorrer solo las ediciones de este usuario',
    userContribs: 'Contribuciones en Wikipedia',
    userHidden: 'usuario oculto',

    firstVersion: 'Primera versión',
    prevVersion: 'Versión anterior',
    nextVersion: 'Versión siguiente',
    lastVersion: 'Versión actual',
    scrubber: 'Desplázate por las versiones',
    kbdVersions: 'versión anterior / siguiente',
    kbdChanges: 'cambio anterior / siguiente',
    kbdFirstLast: 'primera / actual',
    kbdTop: 'inicio de página',
    backToTop: 'Volver arriba (T)',

    changeLabel: 'cambio',
    changeOf: 'de',
    prevChange: 'Cambio anterior en la página (↑ o W)',
    nextChange: 'Cambio siguiente en la página (↓ o S)',

    themeTitle: 'Cambiar tema (auto → claro → oscuro)',
    themeAuto: 'Auto',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    uiLangLabel: 'Idioma',

    version: 'Versión',
    of: 'de',
    minorEdit: 'edición menor',
    commentHidden: 'resumen de edición oculto',
    thisVersionOnWiki: 'Esta versión en Wikipedia',
    bytes: 'bytes',

    diffLoading: 'Calculando diferencias…',
    diffError:
      'No se pudo cargar el contenido de esta versión (puede haber sido ocultado).',
    firstVersionNote:
      'Esta es la primera versión del artículo: no hay una versión anterior con la que compararla.',
    legendAdded: 'texto añadido',
    legendRemoved: 'texto eliminado',
    disambigNote:
      'Esta es una página de desambiguación: haz clic en una de las entradas del texto para explorar su historial.',

    timelineTitle: 'Ediciones por mes',
    timelineEdits: 'ediciones',
    timelineEditsOne: 'edición',
    legendUser: 'Ediciones de',
    legendOthers: 'Otras ediciones',

    attributionPre: 'Contenido del artículo de',
    historyAuthors: 'historial y autores',
    attributionLicense: 'bajo licencia',
    footerLicense:
      'Los contenidos de los artículos provienen de Wikipedia y están disponibles bajo licencia',
    footerDisclaimer:
      'WikiTimeSurfer es un proyecto independiente, no afiliado a la Fundación Wikimedia.',
    footerSupport: 'Apoya el proyecto',
    footerPrivacy: 'Privacidad y cookies',
  };
}

let cache: Map<UiLang, UiStrings> | undefined;

export function uiStrings(lang: UiLang): UiStrings {
  cache ??= new Map();
  let s = cache.get(lang);
  if (!s) {
    switch (lang) {
      case 'it':
        s = buildIt();
        break;
      case 'de':
        s = buildDe();
        break;
      case 'fr':
        s = buildFr();
        break;
      case 'es':
        s = buildEs();
        break;
      default:
        s = buildEn();
    }
    cache.set(lang, s);
  }
  return s;
}
