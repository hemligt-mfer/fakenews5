import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    article: ["create", "update", "delete", "comment", "like", "dislike", "read"],
} as const;

export const ac = createAccessControl(statement);

export const subscriber = ac.newRole({
    article: ["comment", "like", "dislike", "read"],
});

export const admin = ac.newRole({
    article: ["create", "update", "delete", "comment", "like", "dislike", "read"],
    ...adminAc.statements,
});

export const editor = ac.newRole({
    article: ["create", "update", "delete", "comment", "like", "dislike"]
})

export const roles = ["user", "subscriber","admin", "editor"] as const;
