const DataAndErrorWrapper = (data: any, error: any) => {
  return { data: data, error: error, success: false };
};

export default DataAndErrorWrapper;
