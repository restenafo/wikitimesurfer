declare module 'node-htmldiff' {
  /**
   * Diffs two HTML strings and returns merged HTML where changes are
   * wrapped in <ins> / <del> tags.
   */
  function htmldiff(
    before: string,
    after: string,
    className?: string | null,
    dataPrefix?: string | null,
    atomicTags?: string | null,
  ): string;
  export = htmldiff;
}
