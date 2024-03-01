export interface Organization {
  display_name: string;
  id: string;
  metadata: Record<string, string>;
  name: string;
  [addtionalProperties: string]: unknown;
}
