export interface Transaction {
  acr_values: string[];
  linking_id?: string;
  locale: string;
  login_hint?: string;
  prompt?: string[];

  protocol?: (
    | "oidc-basic-profile"
    | "oidc-implicit-profile"
    | "oauth2-device-code"
    | "oauth2-resource-owner"
    | "oauth2-resource-owner-jwt-bearer"
    | "oauth2-password"
    | "oauth2-access-token"
    | "oauth2-refresh-token"
    | "oauth2-token-exchange"
    | "oidc-hybrid-profile"
    | "samlp"
    | "wsfed"
    | "wstrust-usernamemixed"
  ) &
    string;

  redirect_uri?: string;

  requested_authorization_details?: {
    type: string;
    [additionalProperties: string]: unknown;
  }[];

  requested_scopes: string[];
  response_mode?: ("query" | "fragment" | "form_post" | "web_message") & string;
  response_type?: (("code" | "token" | "id_token") & string)[];
  state?: string;
  ui_locales: string[];
  [additionalProperties: string]: unknown;
}
