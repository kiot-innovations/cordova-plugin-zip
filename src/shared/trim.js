export const trimObject = obj => {
  return Object.entries(obj)
    .map(([k, v]) => ({
      [k]: typeof v === 'string' || v instanceof String ? v.trim() : v
    }))
    .reduce((acc, kv) => ({ ...acc, ...kv }), {})
}
