const DataAndMsgWrapper = (
  data: any,
  message: string,
  success: boolean = true
) => {
  return { data: data, message: message, success: success };
};
export default DataAndMsgWrapper;
