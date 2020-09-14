// @flow

import test from 'ava';
import {
  ROARR,
} from 'roarr';
import sinon from 'sinon';
import createRoarrSentryIntegration from '../../../src/factories/createRoarrSentryIntegration';

test('creates class with CaptureRoarr constructor name', (t) => {
  t.is(createRoarrSentryIntegration().constructor.name, 'CaptureRoarr');
});

test('overrides ROARR.write method', (t) => {
  const originalWrite = ROARR.write;

  createRoarrSentryIntegration().setupOnce();

  t.not(ROARR.write, originalWrite);
});

test('passes-through calls to ROARR.write', (t) => {
  const spy = sinon.stub();

  ROARR.write = spy;

  createRoarrSentryIntegration()
    .setupOnce(
      null,
      () => {
        return {
          addBreadcrumb: () => {},
        };
      },
    );

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
  const spy = sinon.stub();

  ROARR.write = spy;

  const hub = {
    addBreadcrumb: () => {},
  };

  const addBreadcrumbSpy = sinon.spy(hub, 'addBreadcrumb');

  createRoarrSentryIntegration()
    .setupOnce(
      null,
      () => {
        return hub;
      },
    );

  const payload = JSON.stringify({
    context: {
      namespace: 'bar',
    },
    message: 'foo',
  });

  ROARR.write(payload);

  t.like(addBreadcrumbSpy.firstCall.firstArg, {
    category: 'bar',
    data: {
      context: {
        namespace: 'bar',
      },
    },
    level: 'fatal',
    message: 'foo',
    type: 'default',
  });
});
