/**@param {string} token */
export const setRefreshToken = (token) => {
    localStorage.setItem("token", token);
};

/**
 * @returns {string|null}
 */

export const getRefreshToken = () => {
    return localStorage.getItem("token");
};

export const clearTokens = () => {
    localStorage.removeItem("token");
};
