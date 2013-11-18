﻿/* global grid */

grid.module.directive("lgColumn", function () {
	"use strict";
	
	return {
		scope: {
			title: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		transclude: true,
		controller: ["$scope", function($scope) {
			var templateColumnController = {};

			$scope.views = {};
			$scope.viewCount = 0;

			templateColumnController.registerView = function(name, viewLinker) {
				name = name || "*";
				var separatedNames = name.split(",");

				for (var i = 0; i < separatedNames.length; ++i) {
					var separatedName = separatedNames[i].trim();
					if (separatedName === "") {
						continue;
					}

					$scope.views[separatedName] = viewLinker;
					$scope.viewCount += 1;
				}
			};

			return templateColumnController;
		}],
		controllerAs: "templateColumnController",
		compile: function (tElem, tAttr, linker) {
			return function(scope, instanceElement, instanceAttrs, gridController) {
				
				linker(scope, function(clone) {
					instanceElement.append(clone);
				});
				
				if (scope.viewCount === 0) {
					scope.templateColumnController.registerView("*", linker);
				}

				gridController.defineColumn({
					title: scope.title,
					views: scope.views,
					attributes: instanceAttrs
				});
				
				instanceElement.remove();
			};
		}
	};
});