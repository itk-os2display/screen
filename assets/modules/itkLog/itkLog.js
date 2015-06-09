/**
 * @file
 * Contains the log Module.
 */

/**
 * itkLog module.
 *
 * Consists of
 *   itkLog that is used to log messages.
 *   itk-log (itkLog) directive that is used to display log messages.
 *
 * requires stacktrace.js - http://www.stacktracejs.com/
 *   tested with v0.6.4
 */
var app = angular.module('itkLog', ['itkLogConfig']);

/**
 * itkLog
 */
app.factory('itkLog', ['$http', '$timeout', '$log', 'itkLogConfig',
    function ($http, $timeout, $log, itkLogConfig) {
      'use strict';

      var factory = {};

      factory.message = null;

      /**
       * Log an error.
       * And post to backend.
       *
       * @param message
       *   Error message.
       * @param cause
       *   Cause of error.
       */
      factory.error = function error(message, cause) {
        if (itkLogConfig.logLevel !== 'none') {
          var error = {
            "type": "error",
            "date": new Date(),
            "message": "" + message,
            "cause": cause,
            "stacktrace": printStackTrace()
          };

          factory.message = error;

          if (itkLogConfig.logToConsole) {
            $log.error(error);
          }

          if (itkLogConfig.errorCallback) {
            $http.post(itkLogConfig.errorCallback, error);
          }
        }
      };

      /**
       * Log a message.
       *
       * @param message
       *   Message to log.
       * @param timeout
       *   Clear log after timeout, if set.
       */
      factory.log = function log(message, timeout) {
        if (itkLogConfig.logLevel === 'all') {
          factory.message = {
            "type": "log",
            "date": new Date(),
            "message": message
          };

          if (itkLogConfig.logToConsole) {
            $log.log(message);
          }

          if (timeout) {
            $timeout(function () {
              factory.message = null;
            }, timeout);
          }
        }
      };

      /**
       * Info message.
       *
       * @param message
       *   Info message.
       * @param timeout
       *   Clear log after timeout, if set.
       */
      factory.info = function log(message, timeout) {
        if (itkLogConfig.logLevel === 'all') {
          factory.message = {
            "type": "info",
            "date": new Date(),
            "message": message
          };

          if (itkLogConfig.logToConsole) {
            $log.info(message);
          }

          if (timeout) {
            $timeout(function () {
              factory.message = null;
            }, timeout);
          }
        }
      };

      /**
       * Warn message.
       *
       * @param message
       *   Warn message.
       * @param timeout
       *   Clear log after timeout, if set.
       */
      factory.warn = function warn(message, timeout) {
        if (itkLogConfig.logLevel === 'all') {
          factory.message = {
            "type": "warn",
            "date": new Date(),
            "message": message
          };

          if (itkLogConfig.logToConsole) {
            $log.warn(message);
          }

          if (timeout) {
            $timeout(function () {
              factory.message = null;
            }, timeout);
          }
        }
      };

      /**
       * Clear latest exception.
       */
      factory.clear = function () {
        factory.message = null;
      };

      return factory;
    }
  ]
);

/**
 * itk-log directive.
 *
 * Displays the current message from itkLog.
 */
app.directive('itkLog', ['itkLog', 'itkLogConfig',
    function (itkLog, itkLogConfig) {
      'use strict';

      return {
        restrict: 'E',
        templateUrl: 'assets/modules/itkLog/log.html?' + itkLogConfig.version,
        link: function (scope) {
          scope.expanded = false;

          /**
           * Expand/Collapse extra info.
           */
          scope.toggleExpanded = function toggleExpanded() {
            scope.expanded = !scope.expanded;
          };

          /**
           * Clear log.
           */
          scope.clearLog = function clearLog() {
            itkLog.clear();
          };

          /**
           * Get exception.
           */
          scope.getLogMessage = function getLogMessage() {
            return itkLog.message;
          };
        }
      };
    }
  ]);
