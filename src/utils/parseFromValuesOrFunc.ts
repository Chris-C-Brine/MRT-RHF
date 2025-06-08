export const parseFromValuesOrFunc = <T, U extends Record<string, any>, V = T>(
  fn: ((arg: U) => T) | V | undefined,
  arg: U,
): T | V | undefined => (fn instanceof Function ? fn(arg) : fn);