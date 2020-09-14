// @flow

import test from 'ava';
import getSentrySeverityLevel from '../../../src/utilities/getSentrySeverityLevel';

test('maps Roarr log levels to Sentry', (t) => {
  t.is(getSentrySeverityLevel(10), 'trace');
});
