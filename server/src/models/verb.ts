export interface ReversoVerb {
  ok: boolean;
  infinitive: string;
  verbForms: Array<{ id: number; conjugation: string; verbs: string[] }>;
}

export type VerbConjugations = {
  infinitive: string;
  present: {
    singular: {
      male: string;
      female: string;
    };
    plural: {
      male: string;
      female: string;
    };
  };
  past: {
    1: {
      singular: string;
      plural: string;
    };
    2: {
      singular: {
        male: string;
        female: string;
      };
      plural: {
        male: string;
        female: string;
      };
    };
    3: {
      singular: {
        male: string;
        female: string;
      };
      plural: string;
    };
  };
  future: {
    1: {
      singular: string;
      plural: string;
    };
    2: {
      singular: {
        male: string;
        female: string;
      };
      plural: {
        male: string;
        female: string;
      };
    };
    3: {
      singular: {
        male: string;
        female: string;
      };
      plural: {
        male: string;
        female: string;
      };
    };
  };
};
