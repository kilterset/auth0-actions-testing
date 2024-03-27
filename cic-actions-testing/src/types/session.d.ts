export interface Session {
  /** The ID of the current session. */
  id: string;

  device?: {
    /** The last ASN (autonomous system number) of the current session. */
    last_asn?: string;

    /** The last IP address of the current session. */
    last_ip?: string;

    /** The initial ASN (autonomous system number) of the current session. */
    initial_asn?: string;

    /** The initial IP address of the current session. */
    initial_ip?: string;
  };
}
