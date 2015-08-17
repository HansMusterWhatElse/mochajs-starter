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

  var MIN_ITEM_LENGTH = 2;

  // FixMe: Use a template engine
  var html = '<div class="shopping-list">'
    + '<h2 class="title">Shopping List</h2>'
    + '<input name="new-item">'
    + '<button class="add-item">Add item</button>'
    + '<button class="clear">Clear</button>'
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
      removeAll: function () {
        var removed = items.splice(0, items.length);
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

    function showClearButton(show) {
      $('button.clear', $target).toggleClass('hidden', show);
    }

    function toggleAddButtonDisabled(disabled) {
      $('button.add-item', $target)[0].disabled = disabled;
    }

    ctrl.model.on('add', function () {
      renderItems();
      $('input', $target).val('').focus();
      showClearButton(!ctrl.model.items.length);
    });

    ctrl.model.on('remove', function () {
      renderItems();
      $('input', $target).focus();
      showClearButton(!ctrl.model.items.length);
    });

    $target.on('click', 'button.add-item', function () {
      ctrl.addItem($('input', $target).val());
    }).on('keyup', 'input', function (event) {
      if (event.keyCode === 13) { ctrl.addItem($('input', $target).val()); }
    }).on('click', 'a.remove', function () {
      ctrl.removeItem($(this).closest('li').index());
    }).on('click', 'button.clear', function () {
      ctrl.removeAll();
    }).on('keyup change', 'input', function () {
      toggleAddButtonDisabled($('input', $target)
        .val().trim().length < MIN_ITEM_LENGTH);
    });

    showClearButton(!ctrl.model.items.length);
    toggleAddButtonDisabled($('input', $target)
      .val().trim().length < MIN_ITEM_LENGTH);
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
      },
      removeAll: function () {
        model.removeAll();
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
        ctrl.model.on('removeAll', storeItems);
      }
    };
  }

  window.createShoppingList = createShoppingList;
}());
