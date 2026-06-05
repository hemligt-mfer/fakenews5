import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
import { ac, admin, editor, subscriber } from "./permissions";

export const authClient = createAuthClient(
    {
        plugins: [
            adminClient({
                ac,
                roles: {
                    admin,
                    subscriber,
                    editor
                }
            })
        ]
    }
);
