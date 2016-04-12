(function($) {
  var methods = {
    init: function(options) {
      options = $.extend({}, $.fn.taskTracker.defaults, options);
      
      return this.each(function() {
        var $this = $(this);
        $this.data('taskTracker', {
          options: options,
          $addButton: $(options.addButton),
          $taskList: $(options.taskList),
        });  
        methods.setup.call($this); 
      });
    },

    setup: function() {
      if (!functions.hasLocalStorage()) {
        alert('Please use a browser that supports localstorage or this is useless.');
        return false;
      }

      var $this = $(this);   
      var data = $this.data('taskTracker');

      data.$addButton.click(function(e) {
        e.preventDefault();
        var newTask = functions.createTaskObj.call($this);
        functions.saveTask.call($this, newTask);
      });
      
      var storedTasks = functions.getLocalList();
      if (storedTasks.length > 0) {
        for (var i = 0, len = storedTasks.length; i < len; i++) {
          data.$taskList.prepend(functions.createTableRow(storedTasks[i]));
        }
      } else {
        for (var i = 0, len = data.options.existingTasks.length; i < len; i++) {
          functions.saveTask.call($this, data.options.existingTasks[i]);
        }
      }
    }
  };
    
  var functions = {
  
    saveTask: function(taskObj) {
      var $this = $(this);         
      var data = $this.data('taskTracker');

      data.$taskList.prepend(functions.createTableRow(taskObj));

      var allTasks = functions.getLocalList();
      allTasks.push(taskObj);

      functions.storeLocalList(allTasks);
    },

    createTaskObj: function() {
      var $this = $(this);
      var task = {};
      var $inpts = $this.find('input[type=text]');
      $inpts.each(function(i, elem) {
        if (jQuery.trim(elem.value) === '') {
          task[elem.getAttribute('name')] = 'TBA';
        } else {
          task[elem.getAttribute('name')] = elem.value;
        }
      });
      return task;
    },

    createTableRow: function(obj) {
      var $tr = $('<tr>');
      for (var prop in obj) {
        $tr.append('<td>' + obj[prop] + '</td>');
      }
      return $tr;
    },
    
    storeLocalList: function(obj) {
      localStorage.setItem('taskTracker', JSON.stringify(obj));
    },  
    
    getLocalList: function(id) {
      var item = localStorage.getItem('taskTracker');
      if (item !== '' && item !== null) {
        return jQuery.parseJSON(item);
      }
      return [];
    },
    
    hasLocalStorage: function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }
  };
  
  jQuery.fn.taskTracker = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist');
    }
  };

  jQuery.fn.taskTracker.defaults = {
    addButton: $(),
    taskList: $(),
    existingTasks: []
  };
})(jQuery);