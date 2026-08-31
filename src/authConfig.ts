import type { BrowserSystemOptions, Configuration } from '@azure/msal-browser';

/**
 * MSAL configuration.
 * Replace the placeholder values below with the Client ID and Tenant ID
 */

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI as string,
        postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI as string,
    },
    cache: {
        // localStorage keeps the user signed in across tabs/refreshes.
        // Switch to "sessionStorage" if you want the session to end when the tab closes.
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
        secureCookies: false
    },
};

// Scopes requested at login — just enough to read basic profile info via MSAL/Graph claims.
export const loginRequest = {
    scopes: ["User.Read", "openid", "profile"],
};

// Scope requested when calling OUR OWN protected backend API.
// This must match the scope you exposed in "Expose an API" during app registration.
export const apiRequest = {
    scopes: ['openid', 'profile', `api://${import.meta.env.VITE_MSAL_TENANT_ID}/access_as_user`],
};

// export const apiConfig = {
//     uri: "http://localhost:4000/api/profile",
// };

/**
 * Construct a configuration object for MSAL
 * See https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
 * @returns MSAL configuration object
 */
const createMSALInstance = (systemOptions?: BrowserSystemOptions): Configuration => {
    return {
        auth: msalConfig.auth,
        cache: msalConfig.cache,
        system: systemOptions,
    };
};
export default createMSALInstance;
