import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    cookieConfig:{
        cookieName: "session_token",
        cookiePrefix: "better-auth",
        useSecureCookies: false,
    }
});
