/**
 * Tutti i testi dell'interfaccia, centralizzati.
 * Per una futura traduzione basta sostituire/estendere questo oggetto.
 *
 * Nota: esposti tramite funzione (non `const` top-level) per aggirare un bug
 * di inizializzazione dei chunk condivisi nel build multi-entry dei test
 * (@angular/build 22.0.x): le dichiarazioni di funzione restano utilizzabili
 * anche quando l'init "lazy" del chunk non viene eseguito.
 */

function buildStrings() {
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

    // tema
    themeTitle: 'Cambia tema (auto → chiaro → scuro)',
    themeAuto: 'Auto',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',

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

    // timeline
    timelineTitle: 'Modifiche per mese',
    timelineEdits: 'modifiche',
    timelineEditsOne: 'modifica',
    legendUser: 'Modifiche di',
    legendOthers: 'Altre modifiche',

    // attribuzione e footer
    attributionPre: 'Contenuto della voce da',
    attributionLicense: 'disponibile con licenza',
    footerLicense:
      'I contenuti delle voci provengono da Wikipedia e sono disponibili con licenza',
    footerDisclaimer:
      'WikiTimeSurfer è un progetto indipendente, non affiliato a Wikimedia Foundation.',
    footerSupport: 'Supporta il progetto',
    footerPrivacy: 'Privacy & Cookie',
  } as const;
}

export type UiStrings = ReturnType<typeof buildStrings>;

let cached: UiStrings | undefined;

export function uiStrings(): UiStrings {
  return (cached ??= buildStrings());
}
