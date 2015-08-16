'use strict';
(function () {
  var $ = window.$;
  var localStorage = window.localStorage;

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function storeItems(items) {
    localStorage.setItem('items', JSON.stringify(items));
  }

  // FixMe: Use a template engine
  var html = '<div class="shopping-list">'
    + '<h2 class="title">Shopping List</h2>'
    + '<input name="new-item">'
    + '<button class="add-item">Add item</button>'
    + '<div class="items-container"></div>'
    + '</div>';

  // Model
  function createListModel(items) {
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
      items: items,
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

  // View
  function createView($target, ctrl) {
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

    function renderItems() {
      $('.items-container ul', $target).remove();
      $('.items-container', $target).html('<ul class="items" />');
      $('ul.items', $target).html(itemsTemplate(ctrl.model.items));
    }

    ctrl.model.on('add', function () {
      renderItems();
      $('input', $target).val('').focus();
    });

    ctrl.model.on('remove', function () {
      renderItems();
      $('input', $target).focus();
    });

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

    renderItems();
  }

  // Controller
  function createController(model) {
    return {
      model: model,
      addItem: function (itemName) {
        if (typeof itemName !== 'string') {
          return false;
        }
        itemName = itemName.trim();
        if (itemName.trim().length < 2) {
          return false;
        }
        if (model.items.indexOf(itemName) > -1) {
          return false;
        }
        model.addItem(escapeHtml(itemName));
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
    var initialItems = [];
    var storedItems = localStorage.getItem('items');

    if (storedItems) {
      initialItems = JSON.parse(storedItems);
    } else if (config.items) {
      initialItems = config.items;
    }

    var model = createListModel(initialItems);
    var ctrl = createController(model);

    return {
      html: html,
      controller: ctrl,
      build: function ($target) {
        createView($target, ctrl);
        ctrl.model.on('add', storeItems);
        ctrl.model.on('remove', storeItems);
      }
    };
  }

  window.createShoppingList = createShoppingList;
}());
