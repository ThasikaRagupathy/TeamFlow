const NodeEnvironment = require('jest-environment-node').default;

class CustomNodeEnvironment extends NodeEnvironment {
  constructor(config, context) {
    // Node 25+ introduced built-in experimental web storage that throws SecurityError if accessed without --localstorage-file
    // Intercepting or removing it from global prevents jest-environment-node from throwing during global property inspection
    try {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        configurable: true,
        writable: true,
      });
    } catch (e) {}

    super(config, context);
  }
}

module.exports = CustomNodeEnvironment;
