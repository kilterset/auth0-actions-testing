export interface User {
  /** (unique) User's unique identifier. */
  user_id: string;

  /** (unique) User's username. */
  username?: string;

  /** User's full name. */
  name?: string;

  /** User's given name. */
  given_name?: string;

  /** User's family name. */
  family_name?: string;

  /** User's nickname. */
  nickname?: string;

  /** (unique) User's email address. */
  email?: string;

  /** Indicates whether the user has verified their email address. */
  email_verified: boolean;

  /** User's phone number. Only valid for users with SMS connections. */
  phone_number?: string;

  /** Indicates whether the user has verified their phone number. Only valid for users with SMS connections. */
  phone_verified?: boolean;

  /** URL pointing to the [user's profile picture](https://auth0.com/docs/users/change-user-picture). */
  picture?: string;

  /** Custom fields that store info about a user that does not impact what they can or cannot access, such as work address, home address, or user preferences. */
  user_metadata: {
    [additionalProperties: string]: any;
  };

  /** Custom fields that store info about a user that influences the user's access, such as support plan, security roles, or access control groups. */
  app_metadata: {
    [additionalProperties: string]: any;
  };

  /** Timestamp indicating when the user profile was first created. */
  created_at: string;

  /** Timestamp indicating when the user's profile was last updated/modified. */
  updated_at: string;

  /** Timestamp indicating the last time the user's password was reset/changed. At user creation, this field does not exist. This property is only available for Database connections. */
  last_password_reset?: string;

  identities?: Identity[];

  [additionalProperties: string]: any;
}
