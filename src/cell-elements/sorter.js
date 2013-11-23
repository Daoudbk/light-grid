﻿/* global grid */

grid.module.directive("lgSorter", function (lgGridService) {
	"use strict";

	return {
		template: "<span class='sorter {{ cssClass() }}'><span ng-transclude class='columnTitle'></span></span>",
		transclude: true,
		replace: true,
		link: function (scope, elem, attrs) {
			var gridId = scope.gridController.getId();
			var sortProperty = attrs.sortProperty || attrs.lgSorter;

			scope.isSorted = false;
			scope.sortDirectionDescending = true;

			elem.on("click", function () {
				var dataProvider = lgGridService.getDataProvider(gridId);
				dataProvider.sort(sortProperty, !scope.sortDirectionDescending);
			});

			scope.$on("lightGrid.dataSorted", function (event, sortedGridId, sortOptions) {
				if (gridId !== sortedGridId) {
					return;
				}

				if (sortOptions.sortProperty !== sortProperty) {
					scope.isSorted = false;
					scope.sortDirectionDescending = true;
				} else {
					scope.isSorted = true;
					scope.sortDirectionDescending = sortOptions.sortDirectionDescending;
				}

				if (!scope.$$phase) {
					scope.$digest();
				}
			});

			scope.cssClass = function () {
				if (!scope.isSorted) {
					return "";
				}

				return scope.sortDirectionDescending ? "sorter-desc" : "sorter-asc";
			};
		}
	};
});