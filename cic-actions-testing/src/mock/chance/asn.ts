declare global {
  namespace Chance {
    interface Chance {
      asn: () => string;
    }
  }
}

/**
 * AS numbers, or ASNs, are unique 16 bit numbers between 1 and 65534 or
 * 32 bit numbers between 131072 and 4294967294.
 */
export const asn = (chance: Chance.Chance) =>
  chance.integer({ min: 1, max: 65534 }).toString();
