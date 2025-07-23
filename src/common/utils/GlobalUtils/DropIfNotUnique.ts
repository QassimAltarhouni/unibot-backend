const DropIfNotUnique = (arg1: any[], arg2: any[]): any[] => {
  // returns arg1 but drops values which also in arg2
  const arg1Copy = [...arg1];
  const keys1 = [
    ...new Set(arg1.map(x => [...Object.values(x), ...Object.keys(x)].join())),
  ];
  const keys2 = [
    ...new Set(arg2.map(x => [...Object.values(x), ...Object.keys(x)].join())),
  ];
  keys2.every((key, i) => (keys1.includes(key) ? arg1Copy.splice(i, 1) : true));

  return arg1Copy;
};

export default DropIfNotUnique;
