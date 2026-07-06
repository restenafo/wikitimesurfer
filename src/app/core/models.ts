export interface WikiEdition {
  code: string;
  label: string;
}

export interface RevisionMeta {
  revid: number;
  parentid: number;
  /** ISO 8601 */
  timestamp: string;
  user: string;
  userHidden: boolean;
  anon: boolean;
  comment: string;
  commentHidden: boolean;
  minor: boolean;
  /** page size in bytes at this revision */
  size: number;
  /** bytes added/removed vs previous revision (computed once history is ordered) */
  delta: number | null;
}
