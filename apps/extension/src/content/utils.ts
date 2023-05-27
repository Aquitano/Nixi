/**
 * Count the number of words in a string
 *
 * @param {string} str - String to count words
 * @returns {number} - Number of words
 */
export function countWords(str: string): number {
  const arr = str.split(' ');

  return arr.filter((word) => word !== '').length;
}

/**
 * Hash a string/URL
 *
 * @param {string} str - String to hash
 * @returns {number} - Hashed string
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
