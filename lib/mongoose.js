import mongoose from 'mongoose';
import config from 'config';
import logger from './logger'
import { Promise } from 'bluebird';

const constant = config.get('constants');

mongoose.Promise = Promise;

function initDB() {

    mongoose.connect(constant.DB_URL, {
        useNewUrlParser: true,
        keepAlive: true,
        useUnifiedTopology: true
    });

    mongoose.connection
        .on('error', (err) => {
            logger.error("Mongoose connection error", err);
        })
        .once('open', function() {
            logger.info("DB connection is open and ready");
        });

}

export default initDB;