import {
  Severity,
} from '@sentry/types';
import type {
  EventProcessor,
  Hub,
  Integration,
} from '@sentry/types';
import type {
  LogLevelName,
} from 'roarr';
import {
  ROARR,
  getLogLevelName,
} from 'roarr';

const getSeverity = (logLevelName: LogLevelName) => {
  switch (logLevelName) {
    case 'trace':
    case 'debug':
      return Severity.Debug;
    case 'info':
      return Severity.Info;
    case 'warn':
      return Severity.Warning;
    case 'error':
      return Severity.Error;
    default:
      return Severity.Error;
  }
};

export const createRoarrSentryIntegration = () => {
  return new class CaptureRoarr implements Integration {
    public name: string = 'CaptureRoarr';

    public setupOnce = (addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub) => {
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
            level: getSeverity(getLogLevelName(message.context.logLevel)),
            message: message.message,
            type: 'default',
          },
        );

        originalWrite(jsonMessage);
      };
    };
  }();
};
