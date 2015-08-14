/*globals mocha, chai, sinon, describe, it, beforeEach, afterEach */
(function () {
  'use strict';

  mocha.traceIgnores = ['mocha.js', 'chai.js'];
  mocha.setup('bdd');
  var assert = chai.assert;
  var $ = window.$;

  describe('Shopping List', function () {
    var div;
    var $newItemInput;
    var component;

    beforeEach(function () {
      div = document.createElement('div');
      document.body.appendChild(div);
      sinon.stub(window.localStorage, 'setItem');
      sinon.stub(window.localStorage, 'getItem').returns(undefined);

      component = window.createShoppingList();
      $(div).html(component.html);
      component.build($('.shopping-list', div));
      $newItemInput = $('input[name="new-item"]', div);
    });

    afterEach(function () {
      div.parentNode.removeChild(div);
      window.localStorage.setItem.restore();
      window.localStorage.getItem.restore();
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

    it('ignores duplicate items', function () {
      addItem('Milk');
      addItem('Milk');

      assert.equal($('.items li', div).length, 1);
    });

    it('has min width of 2 for item name', function () {
      addItem('E');
      addItem('E ');
      addItem('Ei');

      assert.equal($('.items li', div).length, 1);
    });

    it('escapes input', function () {
      addItem('<script>');

      assert.equal(component.controller.model.items[0], '&lt;script&gt;');
    });

    it('sets focus on input after add/remove', function () {
      // already implemented. Write test to confirm.
    });

    it('clears list', function () {
      assert();
    });

  });

  mocha.run();
}());
