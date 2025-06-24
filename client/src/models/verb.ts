export type PresentTenseConjugations = {
  singular: {
    male: string;
    female: string;
  };
  plural: {
    male: string;
    female: string;
  };
};
export type PastTenseConjugations = {
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

export type VerbConjugations = {
  infinitive: string;
  present: PresentTenseConjugations;
  past: PastTenseConjugations;
  future?: {
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
      };
      plural: {
        male: string;
        female: string;
      };
    };
  };
};
