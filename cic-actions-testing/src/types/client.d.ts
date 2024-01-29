export interface Client {
  client_id: string;
  name: string;
  metadata: {
    [key: string]: string;
  };
}
