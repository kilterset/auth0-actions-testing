export interface Client {
  // The client id of the application the user is logging in to.
  client_id: string;

  // The name of the application (as defined in the Dashboard).
  name: string;

  metadata: Record<string, string>;
}
