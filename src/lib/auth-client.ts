import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
import { ac, admin, editor, user } from "./permissions";

export const authClient = createAuthClient(
    {
        plugins: [
            adminClient({
                ac,
                roles: {
                    admin,
                    user,
                    editor
                }
            })
        ]
    }
);
