(function (window){
  "use strict";

  if (typeof window.google === "undefined") {
    window.google = {};
  }
  
  window.google = {
    load: function(type, retries, params) {
      if (params && params.callback) {
        params.callback();
      }
    }
  };

  window.google.visualization = {
    Query: function (url, options) {
      var queryInstance = {
        abort: function () {},
        setRefreshInterval: function (seconds) {},
        setTimeout: function (seconds) {},
        setQuery: function (str) {},
        send: function (callback) {
          if (callback) {
            var queryResponseInstance = {
              getDataTable: function () {
                var cols =[
                    {"id":"A","label":"Column 1","type":"string"},
                    {"id":"B","label":"Column 2","type":"number"},
                    {"id":"C","label":"Column 3","type":"date"}
                  ],
                  rows = [
                    [
                      "test 1",
                      345453,
                      "Date(2013, 7, 10)"
                    ],[
                      "test 2",
                      6565.67,
                      "Date(2014, 2, 24)"
                    ],[
                      "test 3",
                      56,
                      "Date(2005, 10, 29)"
                    ]
                  ];
                
                if (window.gadget && window.gadget.data) {
                  cols = window.gadget.data.cols || cols;
                  rows = window.gadget.data.rows || rows;
                }
                                
                var dataTableInstance = {
                  getColumnId: function (columnIndex) {
                    return cols[columnIndex].id;
                  },
                  getColumnLabel: function (columnIndex) {
                    return cols[columnIndex].label;
                  },
                  getColumnType: function (columnIndex) {
                    return cols[columnIndex].type;
                  },
                  getNumberOfColumns: function () {
                    return cols.length;
                  },
                  getNumberOfRows: function () {
                    return rows.length;
                  },
                  getValue: function (rowIndex, columnIndex) {
                    return rows[rowIndex][columnIndex];
                  },
                  getFormattedValue: function(rowIndex, columnIndex) {
                    return rows[rowIndex][columnIndex];
                  },
                  getProperty: function(rowIndex, columnIndex, name) {
                    return null;
                  },
                  removeColumn: function(columnIndex) {
                    cols.splice(columnIndex,1);
                  }
                };

                return dataTableInstance;
              },
              getDetailedMessage: function () { return "Mock detailed message"; },
              getMessage: function () { return "Mock message" },
              getReasons: function () { return []; },
              hasWarning: function () { return false; },
              isError: function () { return false; }
            };

            setTimeout(function () {
              callback(queryResponseInstance);
            }, 50);
          }
        }
      };
      return queryInstance;
    }
  };

  window.google.setOnLoadCallback = function (callback) {
    if (callback) {
      callback();
    }
  };

})(window);
