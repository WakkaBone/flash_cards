export enum Tenses {
  Present = "present",
  Past = "past",
  Future = "future",
}

export enum Genders {
  Male = "male",
  Female = "female",
}

export enum Quantities {
  Singular = "singular",
  Plural = "plural",
}

export type PresentTenseConjugations = {
  [Quantities.Singular]: {
    [Genders.Male]: string;
    [Genders.Female]: string;
  };
  [Quantities.Plural]: {
    [Genders.Male]: string;
    [Genders.Female]: string;
  };
};

export type PastTenseConjugations = {
  1: {
    [Quantities.Singular]: string;
    [Quantities.Plural]: string;
  };
  2: {
    [Quantities.Singular]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
    [Quantities.Plural]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
  };
  3: {
    [Quantities.Singular]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
    [Quantities.Plural]: string;
  };
};

export type FutureTenseConjugations = {
  1: {
    [Quantities.Singular]: string;
    [Quantities.Plural]: string;
  };
  2: {
    [Quantities.Singular]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
    [Quantities.Plural]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
  };
  3: {
    [Quantities.Singular]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
    [Quantities.Plural]: {
      [Genders.Male]: string;
      [Genders.Female]: string;
    };
  };
};

export type VerbTenses = {
  [Tenses.Present]: PresentTenseConjugations;
  [Tenses.Past]: PastTenseConjugations;
  [Tenses.Future]: FutureTenseConjugations;
};

export type VerbConjugations = VerbTenses & {
  infinitive: string;
};
