import { isArray, isEmpty, isString, omit, upperFirst } from 'lodash';
import { formatBytes } from '../helpers/app.helper';

interface MessageInterface {
  field: string;
  message: string;
}

export class ResponseUtils {
  public success(data: any, meta?: {}) {
    return { data, meta };
  }

  public error(
    status: number,
    error?: string,
    message?: any,
    error_code?: string,
  ) {
    return {
      status,
      error: error || null,
      message: message ? this.getMessage(message) : null,
      timestamp: new Date().toISOString(),
      error_code,
    };
  }

  public getMessage(message: string | MessageInterface | MessageInterface[]) {
    if (isString(message)) return upperFirst(message);
    if (isArray(message))
      return message.map((msg) => {
        msg.message = upperFirst(msg.message);

        return msg;
      });
    if (message?.field)
      return [
        {
          message: upperFirst(message.message),
          field: message.field,
        },
      ];

    return [{ message: upperFirst(message.message), field: message.field }];
  }
}

export const filterKeys = (object: any, keys = ['password']) => {
  if (!isEmpty(object)) {
    return omit(object, keys);
  }

  return null;
};

export const getMeta = (
  start: number,
  requestId: string,
  obj: Record<string, any>,
) => {
  return {
    requestId,
    success: true,
    duration: Date.now() - start,
    size: formatBytes(JSON.stringify(obj || {}).length),
    timestamp: new Date(),
  };
};
