declare module "reverso-api" {
  interface Conjugation {
    ok: boolean;
    infinitive: string;
    verbForms: Array<{ id: number; conjugation: string; verbs: string[] }>;
  }
  class Reverso {
    constructor();
    getConjugation(
      verb: string,
      language: string,
      cb?: (err: any, res: Conjugation) => void
    ): Promise<Conjugation>;
  }
  export = Reverso;
}
