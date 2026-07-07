import { collectChangeGroups } from './change-groups';

function root(html: string): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el;
}

describe('collectChangeGroups', () => {
  it('groups contiguous ins/del within the same paragraph', () => {
    const el = root(
      '<p>La <del>vecchia</del><ins>nuova</ins> frase con <ins>altre</ins> parole.</p>',
    );
    const groups = collectChangeGroups(el);
    expect(groups.length).toBe(1);
    expect(groups[0].length).toBe(3);
  });

  it('separates changes in different paragraphs', () => {
    const el = root(
      '<p>Prima <ins>modifica</ins>.</p><p>Testo invariato.</p><p>Seconda <del>modifica</del>.</p>',
    );
    const groups = collectChangeGroups(el);
    expect(groups.length).toBe(2);
  });

  it('treats a block-level insertion as its own group and skips nested marks', () => {
    const el = root(
      '<p>Testo <ins>uno</ins>.</p>' +
        '<ins><p>Nuovo paragrafo con <ins>nidificato</ins>.</p><p>Altro.</p></ins>' +
        '<p>Coda <del>due</del>.</p>',
    );
    const groups = collectChangeGroups(el);
    expect(groups.length).toBe(3);
    // il gruppo centrale è il solo <ins> esterno; quello nidificato non conta
    expect(groups[1].length).toBe(1);
    expect(groups[1][0].tagName).toBe('INS');
  });

  it('separates changes in different list items and table cells', () => {
    const el = root(
      '<ul><li><ins>a</ins></li><li><ins>b</ins></li></ul>' +
        '<table><tr><td><del>c</del></td><td><del>d</del></td></tr></table>',
    );
    expect(collectChangeGroups(el).length).toBe(4);
  });

  it('returns empty for a page without changes', () => {
    expect(collectChangeGroups(root('<p>Niente da vedere.</p>'))).toEqual([]);
  });
});
