const MergeUniquely = (arg1: any[], arg2: any[]): any[] => {
  const arg1Copy = [...arg1];
  const keys1 = [
    ...new Set(arg1.map(x => [...Object.values(x), ...Object.keys(x)].join())),
  ];
  const keys2 = [
    ...new Set(arg2.map(x => [...Object.values(x), ...Object.keys(x)].join())),
  ];
  keys2.every(key =>
    keys1.includes(key) ? true : arg1Copy.push(arg2[keys2.indexOf(key)])
  );

  return arg1Copy;
};

export default MergeUniquely;
