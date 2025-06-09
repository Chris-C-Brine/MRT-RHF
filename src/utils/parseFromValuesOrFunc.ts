/**
 * Parses a value that can be either a function or a direct value
 *
 * This utility function is used to handle props that can be either a static value
 * or a function that returns a value based on some context.
 *
 * @template T - The return type
 * @template U - The argument type for the function
 * @template V - The default value type (usually same as T)
 * @param fn - Either a function that takes an argument of type U and returns T, or a direct value of type V
 * @param arg - The argument to pass to the function if fn is a function
 * @returns The result of calling fn with arg if fn is a function, otherwise fn itself
 */
export const parseFromValuesOrFunc = <T, U extends Record<string, any>, V = T>(
  fn: ((arg: U) => T) | V | undefined,
  arg: U,
): T | V | undefined => (fn instanceof Function ? fn(arg) : fn);