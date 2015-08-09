'use strict';

// https://en.wikipedia.org/wiki/Palindrome
function isPalindrome(text) {
  if (typeof text !== 'string') {
    return false;
  }

  if (text.length <= 1) {
    return true;
  }

  text = text.toLowerCase().trim().replace(/[^\w]/g, '');

  if (text[0] === text[text.length - 1]) {
    if (text.length === 2) { return true; }
    return isPalindrome(text.substr(1, text.length - 2));
  }

  return false;
}
