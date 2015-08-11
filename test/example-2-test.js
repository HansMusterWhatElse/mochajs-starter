/*globals mocha, chai, describe, it, beforeEach, afterEach */
(function () {
  'use strict';

  mocha.traceIgnores = ['mocha.js', 'chai.js'];
  mocha.setup('bdd');
  var assert = chai.assert;
  var $ = window.$;

  describe('Shopping List', function () {
    var div;

    beforeEach(function () {
      div = document.createElement('div');
      document.body.appendChild(div);

      var component = window.createShoppingList();
      $(div).html(component.html);
      component.build($('.shopping-list', div));
    });

    afterEach(function () {
      div.parentNode.removeChild(div);
    });

    it('adds new item', function () {
      var $newItemInput = $('input[name="new-item"]', div);
      $newItemInput.val('Milk');

      $('button.add-item', div).trigger('click');

      assert.equal($('.items li', div).length, 1, 'should be 1 item');
      assert.equal($newItemInput.val(), '', 'input should be empty');
    });

    it('removes item', function () {
      var $newItemInput = $('input[name="new-item"]', div);
      function addItem(item) {
        $newItemInput.val(item);
        $('button.add-item', div).trigger('click');
      }
      addItem('Milk');
      addItem('Apple');
      addItem('Eggs');

      assert.equal($('.items li', div).length, 3, 'should be 3');

      $('.items li:nth-child(2) a.remove', div).trigger('click');

      assert.equal($('.items li', div).length, 2);
    });
  });

  mocha.run();
}());
