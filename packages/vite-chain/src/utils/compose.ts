

export function compose(funcs: ((...args: any[]) => any)[]) {
  return funcs.reduce((acc, func) => {
    return (...args) => func(acc(...args));
  });
}