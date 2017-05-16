angular.module('starter.directive.common',['ionic'])
.directive('ionRadio1', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
    '<label class="item item-radio">' +
    '<input type="radio" name="radio-group">' +
    '<div class="radio-content">' +
    '<div class="item-content disable-pointer-events" ng-transclude></div>' +
    '<i class="radio-icon disable-pointer-events icon ion-ios-circle-outline"></i>' +
    '<i class="radio-icon disable-pointer-events icon ion-ios-checkmark-outline"></i>' +
    '</div>' +
    '</label>',

    compile: function(element, attr) {
      if (attr.icon) {
        var iconElm = element.find('i');
        iconElm.removeClass('ion-ios-circle-filled').addClass(attr.icon);
      }

      var input = element.find('input');
      angular.forEach({
        'name': attr.name,
        'value': attr.value,
        'disabled': attr.disabled,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'ng-disabled': attr.ngDisabled,
        'ng-change': attr.ngChange,
        'ng-required': attr.ngRequired,
        'required': attr.required
      }, function(value, name) {
        if (angular.isDefined(value)) {
          input.attr(name, value);
        }
      });

      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
});


