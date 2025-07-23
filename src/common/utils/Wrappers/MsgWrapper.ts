const MsgWrapper = (message: string, success: boolean = true) => {
  return { message: message, success: success };
};
export default MsgWrapper;
