# Roarr Sentry Integration

[![Travis build status](http://img.shields.io/travis/gajus/roarr-sentry/master.svg?style=flat-square)](https://travis-ci.org/gajus/roarr-sentry)
[![Coveralls](https://img.shields.io/coveralls/gajus/roarr-sentry.svg?style=flat-square)](https://coveralls.io/github/gajus/roarr-sentry)
[![NPM version](http://img.shields.io/npm/v/@roarr/sentry.svg?style=flat-square)](https://www.npmjs.org/package/@roarr/sentry)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

[Sentry](https://sentry.io/) integration that adds [Roarr](https://github.com/gajus/roarr) logs to Sentry breadcrumbs.

## Motivation

Sentry [breadcrumbs](https://sentry.io/features/breadcrumbs/) allow one to trace down the root cause of an error. Breadcrumbs can include arbitrary data, including log messages. Roarr Sentry integration adds Roarr logs to Sentry breadcrumbs to give a richer context about every issue raised on Sentry.

## Usage

```js
import {
  createRoarrSentryIntegration,
} from '@roarr/sentry';

createSentry({
  integrations: [
    createRoarrSentryIntegration(),
  ],
});

```
