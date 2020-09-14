// @flow

/* eslint-disable class-methods-use-this, flowtype/no-weak-types */

import {
  ROARR,
} from 'roarr';
import {
  getSentrySeverityLevel,
} from '../utilities';

export default () => {
  return new class CaptureRoarr {
    static name = 'CaptureRoarr';

    setupOnce (addGlobalEventProcessor: Object, getCurrentHub: Object) {
      const originalWrite = ROARR.write;

      ROARR.write = (jsonMessage: string) => {
        const hub = getCurrentHub();

        const message = JSON.parse(jsonMessage);

        hub.addBreadcrumb(
          {
            category: message.context.namespace,
            data: {
              context: message.context,
            },
            level: getSentrySeverityLevel(message.context.logLevel),
            message: message.message,
            type: 'default',
          },
        );

        originalWrite(jsonMessage);
      };
    }
  }();
};
