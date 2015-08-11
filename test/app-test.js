/*globals mocha, chai, describe, it, isPalindrome */
(function () {
  'use strict';

  mocha.traceIgnores = ['mocha.js', 'chai.js'];
  mocha.setup('bdd');
  var assert = chai.assert;

  describe('Palindrome', function () {
    it('recognizes a single letter as palindrom', function () {
      assert(isPalindrome('a'));
    });

    it('accepts empty string as palindrom', function () {
      assert(isPalindrome(''));
    });

    it('ignores null and undefined', function () {
      assert.equal(isPalindrome(null), false);
      assert.equal(isPalindrome(undefined), false);
    });

    it('recognizes 2 letter palindrome', function () {
      assert(isPalindrome('bB '));
    });

    it('recognizes n letter palindromes', function () {
      assert(isPalindrome('Eve'));
      assert(isPalindrome('ABBA'));
      assert(isPalindrome('Rotor'));
      assert(isPalindrome('Lagerregal'));
      assert(isPalindrome('Was it a car or a cat I saw?'));
    });

    it('recognizes non palindrome', function () {
      assert.equal(isPalindrome('foo'), false);
    });
  });

  mocha.run();
}());
