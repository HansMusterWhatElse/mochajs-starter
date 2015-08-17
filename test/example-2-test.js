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

    function render() {
      component = window.createShoppingList();
      $(div).html(component.html);
      component.build($('.shopping-list', div));
      $newItemInput = $('input[name="new-item"]', div);
    }

    beforeEach(function () {
      div = document.createElement('div');
      document.body.appendChild(div);
      sinon.stub(window.localStorage, 'setItem');
      sinon.stub(window.localStorage, 'getItem');
    });

    afterEach(function () {
      div.parentNode.removeChild(div);
      window.localStorage.setItem.restore();
      window.localStorage.getItem.restore();
    });

    it('adds new item on click', function () {
      render();
      $newItemInput.val('Milk');

      $('button.add-item', div).trigger('click');

      assert.equal($('.items li', div).length, 1, 'should be 1 item');
      assert.equal($newItemInput.val(), '', 'input should be empty');
    });

    it('adds new item on enter', function () {
      render();
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
      render();

      addItem('Milk');
      addItem('Apple');
      addItem('Eggs');

      assert.equal($('.items li', div).length, 3, 'should be 3');

      $('.items li:nth-child(2) a.remove', div).trigger('click');

      assert.equal($('.items li', div).length, 2);
    });

    it('ignores empty strings', function () {
      render();

      addItem('');

      assert.equal($('.items li', div).length, 0);
    });

    it('ignores duplicate items', function () {
      render();

      addItem('Milk');
      addItem('Milk');

      assert.equal($('.items li', div).length, 1);
    });

    it('has min width of 2 for item name', function () {
      render();

      addItem('E');
      addItem('E ');
      addItem('Ei');

      assert.equal($('.items li', div).length, 1);
    });

    it('escapes input', function () {
      render();

      addItem('<script>');

      assert.equal(component.controller.model.items[0], '&lt;script&gt;');
    });

    it('reads items from localStorage', function () {
      window.localStorage.getItem.returns('["Milk"]');

      render();

      assert.equal(component.controller.model.items[0], 'Milk');
    });

    it('sets focus on input after add/remove', function () {
      render();

      addItem('Milk');

      assert.equal(document.activeElement, $('input', div)[0]);
    });

    it('clears list', function () {
      assert();
    });

  });

  mocha.run();
}());
