import SessionModel from '@/Model/session.model';

const FindSessionById = async (id: string) => {
  return SessionModel.findById(id).exec();
};

export default FindSessionById;
