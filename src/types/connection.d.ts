export interface Connection {
  id: string;
  name: string;
  strategy: string;
  metadata: {
    [key: string]: string;
  };
}
