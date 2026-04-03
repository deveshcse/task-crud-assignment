// In-memory Auth Store for Access Token
let accessToken: string | null = null;

export const authStore = {
    setToken: (token: string) => {
        accessToken = token;
    },
    getToken: () => {
        return accessToken;
    },
    clearToken: () => {
        accessToken = null;
    }
};
