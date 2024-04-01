import Auth0 from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const organization = define<Auth0.Organization>(({ params }) => {
  const display_name = params.display_name || chance.company();

  const name = display_name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return {
    display_name,
    name,
    id: `org_${chance.string({ alpha: true, length: 16 })}`,
    metadata: {},
  };
});
