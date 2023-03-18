export function objectMap<T, R extends T>(obj: { [key: string]: T; }, mapper: (t: T, i?: number) => R): { [key: string]: R; } {
  return Object.keys(obj).reduce((acc: { [key: string]: R; }, k: string, i?: number) => {
    const t: T = obj[k];
    acc[k] = mapper(t, i);
    return acc;
  }, {} as { [key: string]: R; });
}
