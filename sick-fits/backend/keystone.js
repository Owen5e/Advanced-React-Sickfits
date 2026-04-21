// Re-export the keystone config for the generated admin UI
// This is a workaround for a bug in Keystone 9.3.0 that generates
// malformed import paths on Windows
module.exports = require('./keystone.ts').default;
