const {expect} = require('chai');
const mockery = require('mockery');
const {isProduction, isCI} = require('../index');

describe('Yoshi Utils', () => {
  describe('isProduction', () => {
    let originalEnv;
    beforeEach(() => {
      originalEnv = Object.assign({}, process.env);
    });
    afterEach(() => process.env = originalEnv);

    it('should return true', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).to.equal(true);
    });

    it('should return false', () => {
      delete process.env.NODE_ENV;
      expect(isProduction()).to.equal(false);
    });

    it('should handle upper case strings', () => {
      process.env.NODE_ENV = 'Production';
      expect(isProduction()).to.equal(true);
    });
  });
  describe('Is CI', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../index')];
      mockery.enable({
        warnOnUnregistered: false
      });
    });
    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    it('should return true', () => {
      mockery.registerMock('is-ci', true);
      expect(isCI()).to.equal(true);
    });

    it('should return false', () => {
      mockery.registerMock('is-ci', false);
      expect(isCI()).to.equal(false);
    });
  });
});
