/* globals NodeJS */

/**
 * This is necessary when we want to use information available on a Nodejs specific `ErrnoException` object.
 * Since the runtime instance is one from just `Error`, this function helps us narrowing at the type level.
 */
export function isInstanceOfNodeError(value: unknown): value is NodeJS.ErrnoException {
  return value instanceof Error;
}
