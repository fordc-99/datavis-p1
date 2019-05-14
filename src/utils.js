// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful
export function myExampleUtil(x) {
  return x * 2;
}

export function getDomain(data, accessor) {
  return data.reduce((acc, row) => {
    const val = Number(row[accessor]);
    return {
      min: Math.min(val, acc.min),
      max: Math.max(val, acc.max)
    };
  }, {min: Infinity, max: -Infinity});
}
