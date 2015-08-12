/*globals mocha, chai, describe, it, beforeEach, afterEach */
(function () {
  'use strict';

  mocha.traceIgnores = ['mocha.js', 'chai.js'];
  mocha.setup('bdd');
  var assert = chai.assert;
  var $ = window.$;

  describe('Shopping List', function () {
    var div;
    var $newItemInput;

    beforeEach(function () {
      div = document.createElement('div');
      document.body.appendChild(div);

      var component = window.createShoppingList();
      $(div).html(component.html);
      component.build($('.shopping-list', div));
      $newItemInput = $('input[name="new-item"]', div);
    });

    afterEach(function () {
      div.parentNode.removeChild(div);
    });

    it('adds new item on click', function () {
      $newItemInput.val('Milk');

      $('button.add-item', div).trigger('click');

      assert.equal($('.items li', div).length, 1, 'should be 1 item');
      assert.equal($newItemInput.val(), '', 'input should be empty');
    });

    it('adds new item on enter', function () {
      $newItemInput.val('Milk');

      var e = $.Event("keyup");
      e.which = 13;
      e.keyCode = 13;
      $('input', div).trigger(e);

      assert.equal($('.items li', div).length, 1, 'should be 1 item');
      assert.equal($newItemInput.val(), '', 'input should be empty');
    });

    function addItem(item) {
      $newItemInput.val(item);
      $('button.add-item', div).trigger('click');
    }

    it('removes item', function () {
      addItem('Milk');
      addItem('Apple');
      addItem('Eggs');

      assert.equal($('.items li', div).length, 3, 'should be 3');

      $('.items li:nth-child(2) a.remove', div).trigger('click');

      assert.equal($('.items li', div).length, 2);
    });

    it('ignores empty strings', function () {
      addItem('');

      assert.equal($('.items li', div).length, 0);
    });

    // Fixme
    it('ignores duplicate items', function () {
      addItem('Milk');
      addItem('Milk');

      assert.equal($('.items li', div).length, 1);
    });
  });

  mocha.run();
}());
