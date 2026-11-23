/** Primary vs supporting is a presentation choice, not a proficiency ranking. */
export interface SkillGroup {
  category: string;
  primary: string[];
  supporting: string[];
  /** Optional labelled sub-list, e.g. AI-assisted tools under Development Tools. */
  subgroup?: { label: string; items: string[] };
}
