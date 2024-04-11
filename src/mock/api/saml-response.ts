type SamlAttributeValue =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean>;

interface SamlResponseState {
  attributes: Record<string, SamlAttributeValue>;
  createUpnClaim: boolean;
  passthroughClaimsWithNoMapping: boolean;
  mapUnknownClaimsAsIs: boolean;
  mapIdentities: boolean;
  signResponse: boolean;
  lifetimeInSeconds: number;
  nameIdentifierFormat: string;
  nameIdentifierProbes: string[];
  authnContextClassRef: string;
  includeAttributeNameFormat: boolean;
  typedAttributes: boolean;
  audience: string;
  recipient: string;
  destination: string;
  cert?: string;
  encryptionCert?: string;
  encryptionPublicKey?: string;
  key?: string;
  signingCert?: string;
}

interface SamlResponse {
  setAttribute(
    attribute: string,
    value: string | number | boolean | null | (string | number | boolean)[]
  ): void;
  setAudience(audience: string): void;
  setRecipient(recipient: string): void;
  setCreateUpnClaim(createUpnClaim: boolean): void;
  setPassthroughClaimsWithNoMapping(
    passthroughClaimsWithNoMapping: boolean
  ): void;
  setMapUnknownClaimsAsIs(mapUnknownClaimsAsIs: boolean): void;
  setMapIdentities(mapIdentities: boolean): void;
  setSignatureAlgorithm(signatureAlgorithm: "rsa-sha256"): void;
  setSignatureAlgorithm(signatureAlgorithm: "rsa-sha1"): void;
  setDigestAlgorithm(digestAlgorithm: "sha256"): void;
  setDigestAlgorithm(digestAlgorithm: "sha1"): void;
  setDestination(destination: string): void;
  setLifetimeInSeconds(lifetimeInSeconds: number): void;
  setSignResponse(signResponse: boolean): void;
  setNameIdentifierFormat(nameIdentifierFormat: string): void;
  setNameIdentifierProbes(nameIdentifierProbes: string[]): void;
  setAuthnContextClassRef(authnContextClassRef: string): void;
  setSigningCert(signingCert: string): void;
  setIncludeAttributeNameFormat(includeAttributeNameFormat: boolean): void;
  setTypedAttributes(typedAttributes: boolean): void;
  setEncryptionCert(encryptionCert: string): void;
  setEncryptionPublicKey(encryptionPublicKey: string): void;
  setCert(cert: string): void;
  setKey(key: string): void;
}

export function samlResponseMock(flow: string) {
  const state: SamlResponseState = {
    // Custom attributes
    attributes: {},

    // Default literal values
    createUpnClaim: true,
    passthroughClaimsWithNoMapping: true,
    mapUnknownClaimsAsIs: false,
    mapIdentities: true,
    signResponse: false,
    includeAttributeNameFormat: true,
    typedAttributes: true,
    lifetimeInSeconds: 3600,

    nameIdentifierFormat:
      "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",

    nameIdentifierProbes: [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    ],

    authnContextClassRef:
      "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified",

    // Default dynamic values
    audience: "default-audience",
    recipient: "default-recipient",
    destination: "default-destination",
  };

  const samlResponse = {
    setAttribute: (attribute: string, value: SamlAttributeValue) => {
      state.attributes[attribute] = value;
    },
  } as SamlResponse;

  for (const property in state) {
    if (state.hasOwnProperty(property)) {
      const key = property as keyof SamlResponseState;

      if (key === "attributes") {
        continue;
      }

      const setter = `set${key[0].toUpperCase()}${key.slice(
        1
      )}` as keyof SamlResponse;

      samlResponse[setter] = (value: unknown) => {
        state[key] = value as never;
      };
    }
  }

  const build = <T>(api: T) => samlResponse;

  return { state, build };  
}
