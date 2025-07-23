import mongoose from 'mongoose';
import config from 'config';
import { Logger } from '@/Utils/index';

const ConnectToDb = async () => {
  const mongoConfig = config.get<{
    url: string;
  }>('mongo');

  // log.debug(mongoConfig)
  await mongoose.connect(mongoConfig.url, { retryWrites: true, w: 'majority' });
  Logger.info('Mongo connected successfully.');
};

export default ConnectToDb;
