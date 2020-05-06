import responder from '../../lib/expressResponder';
import errorHandler from '../handlers/errorHandler';
import { DBUtility } from '../utility';
import * as _ from 'lodash';
import { logger } from '../../lib';

class AnalyticsController {

  static analysis(req, res, next) {
    
    let { filters, methods, filterOperation } = req.body;

    if(_.isUndefined(methods) || _.isNull(methods) || _.isNaN(methods) || _.isEmpty(methods) || _.isNumber(methods)) {
      errorHandler.sendError(res, 400);
      return;
    }
    const statisticOperations = {
      mean: false,
      median: false,
      variance: false
    }
    
    if(_.isString(methods)) {
      methods = methods.split(",");
    }
    _.forEach(methods, methodName => statisticOperations[methodName] = true)
    if(_.some(statisticOperations, !_.isEmpty)) {
      errorHandler.sendError(res, 400);
      return;
    }

    // Expecting only object
    filters = typeof filters === 'object' ? filters : {};

    filterOperation = filterOperation && filterOperation.toUpperCase() === "OR" ? "or" : "and";

    DBUtility
      .doStatisticOperationOnFilteredUsers(filters, filterOperation, statisticOperations)
      .then(result => {
        logger.info(typeof result, _.isArray(result));
        responder.success(res, {"Result": result});
      })
      .catch(error => {
        logger.error(error);
        errorHandler.sendError(res, 500)
      });

      
  }

}

export default AnalyticsController;