'use strict';
(function () {
  var $ = window.$;

  // Model
  function createListModel(items) {
    items = items || [];
    var eventHandlers = [];
    function fireEvent(eventName) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (eventHandlers[eventName] && eventHandlers[eventName].length) {
        eventHandlers[eventName].forEach(function (handler) {
          handler.apply(null, args);
        });
      }
    }
    return {
      addItem: function (item) {
        items.push(item);
        fireEvent('add', items, item);
        return items;
      },
      removeItem: function (index) {
        var removed = items.splice(index, 1)[0];
        fireEvent('remove', items, removed);
        return items;
      },
      on: function (eventName, handler) {
        eventHandlers[eventName] = eventHandlers[eventName] || [];
        eventHandlers[eventName].push(handler);
      }
    };
  }

  // Controller
  function createController(model) {
    return {
      model: model,
      addItem: function (itemName) {
        if (typeof itemName !== 'string' || itemName.trim().length === 0) {
          return false;
        }
        model.addItem(itemName);
      },
      removeItem: function (index) {
        if (index > -1) {
          model.removeItem(index);
        }
      }
    };
  }

  // Component
  function createShoppingList(config) {
    config = config || {};

    // FixMe: Use a template engine
    var html = '<div class="shopping-list">'
      + '<h2 class="title">Shopping List</h2>'
      + '<input name="new-item">'
      + '<button class="add-item">Add item</button>'
      + '<div class="items-container"></div>'
      + '</div>';

    // FixMe: Use a template engine
    function itemTemplate(value) {
      return '<li><span class="item-name">' + value
        + '</span><a class="remove">x</a></li>';
    }

    function itemsTemplate(items) {
      return items.map(function (item) {
        return itemTemplate(item);
      });
    }

    var model = createListModel(config.items);
    var ctrl = createController(model);

    return {
      html: html,
      build: function ($target) {
        $target.on('click', 'button.add-item', function () {
          ctrl.addItem($('input', $target).val());
        });
        $target.on('keyup', 'input', function (event) {
          if (event.keyCode === 13) {
            ctrl.addItem($('input', $target).val());
          }
        });
        $target.on('click', 'a.remove', function () {
          ctrl.removeItem($(this).closest('li').index());
        });

        ctrl.model.on('add', function (items) {
          if (!$('.items-container ul', $target).length) {
            $('.items-container', $target).html('<ul class="items" />');
          }
          $('ul.items', $target).html(itemsTemplate(items));
          $('input', $target).val('');
        });

        ctrl.model.on('remove', function (items) {
          $('ul.items', $target).html(itemsTemplate(items));
        });
      }
    };
  }

  window.createShoppingList = createShoppingList;
}());
