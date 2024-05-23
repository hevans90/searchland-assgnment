/**
 * A regex that most likely misses some extreme edge cases, but good enough
 */
export const validateEmail = (email: string) => {
  return Boolean(
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ),
  );
};

/**
 * Simple alphanumeric validation, allowing names between 3-16 characters
 */
export const validateUsername = (username: string) => {
  return Boolean(
    String(username)
      .toLowerCase()
      .match(/^[a-z0-9_-]{3,16}$/),
  );
};
