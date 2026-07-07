/**
 * Raggruppa i marcatori di modifica (<ins>/<del>) della voce in "blocchi di
 * modifica" navigabili: elementi contigui dentro lo stesso blocco di testo
 * (paragrafo, voce di elenco, cella…) contano come una modifica sola,
 * altrimenti una frase riscritta produrrebbe decine di tappe minuscole.
 *
 * (Solo dichiarazioni di funzione: vedi nota in core/ui-strings.ts sul bug
 * dei chunk condivisi nei build di test.)
 */

function blockSelector(): string {
  return 'p, li, dd, dt, td, th, caption, figcaption, h1, h2, h3, h4, h5, h6, blockquote, pre, table, ul, ol, section, div';
}

/** true se il marcatore avvolge esso stesso contenuto a blocchi (es. interi paragrafi inseriti) */
function isBlockMark(el: HTMLElement): boolean {
  return el.querySelector(blockSelector()) !== null;
}

export function collectChangeGroups(root: HTMLElement): HTMLElement[][] {
  const marks = Array.from(root.querySelectorAll<HTMLElement>('ins, del')).filter(
    // ignora i marcatori annidati dentro altri marcatori: conta solo il più esterno
    (el) => !el.parentElement?.closest('ins, del'),
  );

  const groups: HTMLElement[][] = [];
  let lastKey: Element | null = null;
  for (const el of marks) {
    const key = isBlockMark(el) ? el : (el.closest(blockSelector()) ?? root);
    if (key === lastKey && groups.length) {
      groups[groups.length - 1].push(el);
    } else {
      groups.push([el]);
      lastKey = key;
    }
  }
  return groups;
}
