export interface Organization {
  display_name: string;
  id: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
}
