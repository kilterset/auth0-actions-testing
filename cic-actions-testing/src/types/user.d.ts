export interface User {
  /**
   * Data related to the user affect's the application's core functionality.
   */
  app_metadata?: { [key: string]: unknown };
  /**
   * Indicates whether the user has been blocked.
   */
  blocked?: boolean;
  /**
   * A more generic way to provide the users password hash. This can be used in lieu of the
   * password_hash field when the users password hash was created with an alternate algorithm.
   * Note that this field and password_hash are mutually exclusive.
   */
  custom_password_hash?: CustomPasswordHash;
  /**
   * The user's email address.
   */
  email: string;
  /**
   * Indicates whether the user has verified their email address.
   */
  email_verified?: boolean;
  /**
   * The user's family name.
   */
  family_name?: string;
  /**
   * The user's given name.
   */
  given_name?: string;
  mfa_factors?: MfaFactor[];
  /**
   * The user's full name.
   */
  name?: string;
  /**
   * The user's nickname.
   */
  nickname?: string;
  /**
   * Hashed password for the user. Passwords should be hashed using bcrypt $2a$ or $2b$ and
   * have 10 saltRounds.
   */
  password_hash?: string;
  /**
   * URL pointing to the user's profile picture.
   */
  picture?: string;
  /**
   * The user's unique identifier. This will be prepended by the connection strategy.
   */
  user_id?: string;
  /**
   * Data related to the user that does not affect the application's core functionality.
   */
  user_metadata?: { [key: string]: unknown };
  /**
   * The user's username.
   */
  username?: string;
}

/**
 * A more generic way to provide the users password hash. This can be used in lieu of the
 * password_hash field when the users password hash was created with an alternate algorithm.
 * Note that this field and password_hash are mutually exclusive.
 */
export interface CustomPasswordHash {
  /**
   * The algorithm that was used to hash the password.
   */
  algorithm: Algorithm;
  /**
   * Block size parameter used for the scrypt hash. Must be a positive integer. Only used when
   * algorithm is set to scrypt.
   */
  blockSize?: number;
  /**
   * CPU/memory cost parameter used for the scrypt hash. Must be a power of two greater than
   * one. Only used when algorithm is set to scrypt.
   */
  cost?: number;
  hash: Hash;
  /**
   * Desired key length in bytes for the scrypt hash. Must be an integer greater than zero.
   * Required when algorithm is set to scrypt.
   */
  keylen?: number;
  /**
   * Parallelization parameter used for the scrypt hash. Must be a positive integer. Only used
   * when algorithm is set to scrypt.
   */
  parallelization?: number;
  password?: Password;
  salt?: Salt;
}

/**
 * The algorithm that was used to hash the password.
 */
export enum Algorithm {
  Argon2 = "argon2",
  Bcrypt = "bcrypt",
  Hmac = "hmac",
  LDAP = "ldap",
  Md4 = "md4",
  Md5 = "md5",
  Pbkdf2 = "pbkdf2",
  Scrypt = "scrypt",
  Sha1 = "sha1",
  Sha256 = "sha256",
  Sha512 = "sha512",
}

export interface Hash {
  /**
   * The algorithm that was used to generate the HMAC hash
   */
  digest?: Digest;
  /**
   * The encoding of the provided hash. Note that both upper and lower case hex variants are
   * supported, as well as url-encoded base64.
   */
  encoding?: HashEncoding;
  /**
   * The key that was used to generate the HMAC hash
   */
  key?: Key;
  /**
   * The password hash.
   */
  value?: string;
  [property: string]: unknown;
}

/**
 * The algorithm that was used to generate the HMAC hash
 */
export enum Digest {
  Md4 = "md4",
  Md5 = "md5",
  Ripemd160 = "ripemd160",
  Sha1 = "sha1",
  Sha224 = "sha224",
  Sha256 = "sha256",
  Sha384 = "sha384",
  Sha512 = "sha512",
  Whirlpool = "whirlpool",
}

/**
 * The encoding of the provided hash. Note that both upper and lower case hex variants are
 * supported, as well as url-encoded base64.
 *
 * The key encoding
 *
 * The encoding of the provided salt. Note that both upper and lower case hex variants are
 * supported, as well as url-encoded base64.
 */
export enum HashEncoding {
  Base64 = "base64",
  Hex = "hex",
  Utf8 = "utf8",
}

/**
 * The key that was used to generate the HMAC hash
 */
export interface Key {
  /**
   * The key encoding
   */
  encoding?: HashEncoding;
  /**
   * The key value
   */
  value: string;
  [property: string]: unknown;
}

export interface Password {
  /**
   * The encoding of the password used to generate the hash. On login, the user-provided
   * password will be transcoded from utf8 before being checked against the provided hash. For
   * example; if your hash was generated from a ucs2 encoded string, then you would supply
   * "encoding":"ucs2".
   */
  encoding?: PasswordEncoding;
  [property: string]: unknown;
}

/**
 * The encoding of the password used to generate the hash. On login, the user-provided
 * password will be transcoded from utf8 before being checked against the provided hash. For
 * example; if your hash was generated from a ucs2 encoded string, then you would supply
 * "encoding":"ucs2".
 */
export enum PasswordEncoding {
  ASCII = "ascii",
  Binary = "binary",
  Latin1 = "latin1",
  Ucs2 = "ucs2",
  Utf16LE = "utf16le",
  Utf8 = "utf8",
}

export interface Salt {
  /**
   * The encoding of the provided salt. Note that both upper and lower case hex variants are
   * supported, as well as url-encoded base64.
   */
  encoding?: HashEncoding;
  /**
   * The position of the salt when the hash was calculated. For example; MD5('salt' +
   * 'password') = '67A1E09BB1F83F5007DC119C14D663AA' would have "position":"prefix".
   */
  position?: Position;
  /**
   * The salt value used to generate the hash.
   */
  value: string;
  [property: string]: unknown;
}

/**
 * The position of the salt when the hash was calculated. For example; MD5('salt' +
 * 'password') = '67A1E09BB1F83F5007DC119C14D663AA' would have "position":"prefix".
 */
export enum Position {
  Prefix = "prefix",
  Suffix = "suffix",
}

export interface MfaFactor {
  email?: Email;
  phone?: Phone;
  totp?: Totp;
}

export interface Email {
  /**
   * The email address for MFA
   */
  value: string;
}

export interface Phone {
  /**
   * The phone number for SMS MFA. The phone number should include a country code and begin
   * with +, such as: +12125550001
   */
  value: string;
}

export interface Totp {
  /**
   * The OTP secret is used with authenticator apps (Google Authenticator, Microsoft
   * Authenticator, Authy, 1Password, LastPass). It must be supplied in un-padded Base32
   * encoding, such as: JBTWY3DPEHPK3PNP
   */
  secret: string;
}
