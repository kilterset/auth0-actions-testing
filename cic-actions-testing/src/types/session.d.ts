export interface Session {
  id: string;
  device: {
    last_asn: string;
    last_ip: string;
  };
}
