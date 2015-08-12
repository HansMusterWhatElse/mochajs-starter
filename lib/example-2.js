'use strict';
(function () {
  var $ = window.$;

  function createShoppingList(config) {
    config = config || {};

    // FixMe: Use a template engine
    var html = '<div class="shopping-list">'
      + '<h2 class="title">Shopping List</h2>'
      + '<input name="new-item">'
      + '<button class="add-item">Add item</button>'
      + '<div class="items-container"></div>'
      + '</div>';

    function itemTemplate(value) {
      return '<li><span class="item-name">' + value
        + '</span><a class="remove">x</a></li>';
    }

    // config.items ???

    return {
      html: html,
      build: function ($target) {
        $target.on('click', 'button.add-item', function () {
          if (!$('.items-container ul', $target).length) {
            $('.items-container', $target).html('<ul class="items" />');
          }
          var $items = $('ul.items', $target);
          var newItem = $('input', $target).val();
          $items.append(itemTemplate(newItem));
          $('input', $target).val('');
        });

        $target.on('click', 'a.remove', function () {
          $(this).closest('li').remove();
        });
      }
    };
  }

  window.createShoppingList = createShoppingList;
}());
