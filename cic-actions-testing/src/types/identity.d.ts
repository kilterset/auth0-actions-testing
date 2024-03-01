export interface Identity {
  connection: string;
  isSocial: boolean;
  provider: string;
  profileData: Record<string, string>;
  user_id: string;
  [additionalProperties: string]: any;
}
