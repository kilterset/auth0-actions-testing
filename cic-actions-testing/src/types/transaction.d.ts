export interface Transaction {
  acr_values: string[];
  locale: string;
  requested_scopes: string[];
  ui_locales: string[];
  protocol: string;
  redirect_uri: string;
  prompt: string[];
  login_hint: string;
  response_mode: string;
  response_type: string[];
  state: string;
  requested_authorization_details: {
    type: string;
  }[];
  linking_id: string;
}
