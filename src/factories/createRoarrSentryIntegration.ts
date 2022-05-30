import type {
  EventProcessor,
  Hub,
  Integration,
  SeverityLevel,
} from '@sentry/types';
import type {
  LogLevelName,
} from 'roarr';
import {
  ROARR,
  getLogLevelName,
} from 'roarr';

const getSeverity = (logLevelName: LogLevelName): SeverityLevel => {
  switch (logLevelName) {
    case 'trace':
    case 'debug':
      return 'debug';
    case 'info':
      return 'info';
    case 'warn':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'error';
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
