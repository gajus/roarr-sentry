/* eslint-disable @typescript-eslint/no-explicit-any */

import test from 'ava';
import {
  ROARR,
} from 'roarr';
import * as sinon from 'sinon';
import {
  createRoarrSentryIntegration,
} from '../../../src/factories/createRoarrSentryIntegration';

test('creates class with CaptureRoarr constructor name', (t) => {
  t.is(
    createRoarrSentryIntegration({
      addBreadcrumb: () => {},
    }).constructor.name,
    'CaptureRoarr',
  );
});

test('overrides ROARR.write method', (t) => {
  const originalWrite = ROARR.write;

  createRoarrSentryIntegration({
    addBreadcrumb: () => {},
  }).setupOnce();

  t.not(ROARR.write, originalWrite);
});

test('passes-through calls to ROARR.write', (t) => {
  const spy = sinon.stub();

  ROARR.write = spy;

  createRoarrSentryIntegration({
    addBreadcrumb: () => {},
  }).setupOnce();

  const payload = JSON.stringify({
    context: {
      namespace: 'bar',
    },
    message: 'foo',
  });

  ROARR.write(payload);

  t.true(spy.called);
});

test('adds logs to breadcrumbs', (t) => {
  const addBreadcrumb = sinon.stub();

  ROARR.write = () => {};

  createRoarrSentryIntegration({
    addBreadcrumb,
  }).setupOnce();

  const payload = JSON.stringify({
    context: {
      namespace: 'bar',
    },
    message: 'foo',
  });

  ROARR.write(payload);

  t.like(addBreadcrumb.firstCall.firstArg, {
    category: 'bar',
    data: {
      context: {
        namespace: 'bar',
      },
    },
    level: 'error',
    message: 'foo',
    type: 'default',
  });
});
