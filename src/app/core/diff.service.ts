import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import htmldiff from 'node-htmldiff';

@Injectable({ providedIn: 'root' })
export class DiffService {
  private sanitizer = inject(DomSanitizer);

  /**
   * Costruisce la vista della voce con le differenze evidenziate:
   * aggiunte in <ins>, rimozioni in <del>. Con `beforeHtml === null`
   * (prima versione) restituisce la voce senza confronto.
   */
  buildDiffView(beforeHtml: string | null, afterHtml: string, lang: string): SafeHtml {
    const after = this.prepare(afterHtml, lang);
    const merged = beforeHtml === null ? after : htmldiff(this.prepare(beforeHtml, lang), after);
    const clean = DOMPurify.sanitize(merged, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['target', 'rel'],
      FORBID_TAGS: ['script', 'iframe', 'form', 'input', 'button'],
    });
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }

  /**
   * Normalizza l'HTML del parser di Wikipedia per l'uso fuori sede:
   * link e immagini assoluti, niente link di modifica sezione.
   */
  private prepare(html: string, lang: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const base = `https://${lang}.wikipedia.org`;

    doc.querySelectorAll('.mw-editsection').forEach((el) => el.remove());

    doc.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href')!;
      if (href.startsWith('#')) return; // ancore interne (note): gestite al click nel viewer
      let abs = href;
      if (href.startsWith('//')) abs = 'https:' + href;
      else if (href.startsWith('/')) abs = base + href;
      a.setAttribute('href', abs);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') ?? '';
      if (src.startsWith('//')) img.setAttribute('src', 'https:' + src);
      else if (src.startsWith('/')) img.setAttribute('src', base + src);
      const srcset = img.getAttribute('srcset');
      if (srcset) img.setAttribute('srcset', srcset.replace(/(^|,\s*)\/\//g, '$1https://'));
    });

    return doc.body.innerHTML;
  }
}
