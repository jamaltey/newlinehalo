export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * @param {string} email
 */
export const isValidEmail = email => emailRegex.test(email);
