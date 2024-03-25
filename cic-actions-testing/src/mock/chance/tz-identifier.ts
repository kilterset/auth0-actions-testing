declare global {
  namespace Chance {
    interface Chance {
      tzIdentifier: () => string;
    }
  }
}

/**
 * Returns an IANA time zone identifier (e.g. "Pacific/Auckland").
 */
export const tzIdentifier = (chance: Chance.Chance) => {
  let values: string[] = [];

  while (!values.length) {
    values = chance.timezone().utc;
  }

  return chance.pickone(values);
};
