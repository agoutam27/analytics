import { AuthenticationError, ForbiddenError, ParameterInvalidError, 
  RateLimitError, ServiceUnavailableError} from '../errors';
import responder from '../../lib/expressResponder';

class errorHandler {

  static sendError(res, status) {
    if(!status || typeof status !== 'number') status = 503;
    switch(status) {
      case 101:
        responder.operationFailed(res, new ParameterInvalidError('Resource Not Found'));
        break;
      case 50:
      case 401:
        responder.operationFailed(res, new AuthenticationError('Authentication Failed'));
        break;
      case 403:
        responder.operationFailed(res, new ForbiddenError('User Unauthorised'));
        break;
      case 404:
        responder.operationFailed(res, new ParameterInvalidError('Resource Not Found'));
        break;
      default:
        responder.operationFailed(res, new ServiceUnavailableError('Server Down'));
    }
  }
}

export default errorHandler;
