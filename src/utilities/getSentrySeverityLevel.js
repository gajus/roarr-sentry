// @flow

export default (logLevel: number) => {
  // @todo Do not hardcode; pull from Roarr
  if (logLevel <= 10) {
    return 'trace';
  }

  if (logLevel <= 20) {
    return 'debug';
  }

  if (logLevel <= 30) {
    return 'info';
  }

  if (logLevel <= 40) {
    return 'warn';
  }

  if (logLevel <= 50) {
    return 'error';
  }

  return 'fatal';
};
