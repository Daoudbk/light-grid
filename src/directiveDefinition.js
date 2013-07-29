﻿(function (window, ng, $) {
	"use strict";

	window.angularGrid.module = ng.module("angular-grid", []);
	var grid = window.angularGrid;


	function link(scope, element, attrs, gridController) {
		scope.$watchCollection("data", function () {
			gridController.redraw();
		});
	}

	angularGrid.module.directive("grid", function () {
		return {
			scope: {
				data: "="
			},
			template: "<table class='angular-grid' ng-transclude></table>",
			replace: true,
			restrict: "EA",
			transclude: true,
			link: link,
			controller: grid.controller,
			require: "grid"
		};
	});

}(window, window.angular, window.jQuery));