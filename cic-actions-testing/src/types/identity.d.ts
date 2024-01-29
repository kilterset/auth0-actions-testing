export interface Identity {
  connection: string;
  isSocial: boolean;
  provider: string;
  userId: string;
  profileData: Record<string, unknown>;
  user_id: string;
  accessToken?: string;
}
