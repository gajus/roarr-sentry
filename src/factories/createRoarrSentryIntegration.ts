import {
  type Breadcrumb,
  type Integration,
  type SeverityLevel,
} from '@sentry/types';
import {
  ROARR,
  getLogLevelName,
  type LogLevelName,
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

export const createRoarrSentryIntegration = ({
  addBreadcrumb,
}: {
  addBreadcrumb: (breadcrumb: Breadcrumb) => void,
}) => {
  return new class CaptureRoarr implements Integration {
    public name: string = 'CaptureRoarr';

    public setupOnce = () => {
      const originalWrite = ROARR.write;

      ROARR.write = (jsonMessage: string) => {
        const message = JSON.parse(jsonMessage);

        addBreadcrumb(
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
