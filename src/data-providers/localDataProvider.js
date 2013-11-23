﻿/* global grid, $ */

grid.module.directive("lgLocalDataProvider", ["lgGridService", "$filter", "$rootScope", function (lgGridService, $filter, $rootScope) {
	"use strict";

	var defaultOptions = {
		sortProperty: null,
		sortDirectionDescending: false,
		pageNumber: 1,
		pageSize: 10,
		filter: null
	};

	function applyFilters(model, options) {
		var viewModel = model;

		if (options.filter) {
			var filter = $filter("filter");
			viewModel = filter(viewModel, options.filter);
		}

		var recordCount = viewModel.length;

		if (options.sortProperty) {
			var orderBy = $filter("orderBy");
			viewModel = orderBy(viewModel, options.sortProperty, options.sortDirectionDescending);
		}

		if (options.pageNumber && options.pageSize) {
			var startIndex = (options.pageNumber - 1) * options.pageSize;
			var endIndex = startIndex + options.pageSize;

			viewModel = viewModel.slice(startIndex, endIndex);
		}

		return {
			model: viewModel,
			recordCount: recordCount
		};
	}

	function updateGridModel(scope) {
		var gridController = lgGridService.getGridController(scope.gridId);
		var modelInfo = applyFilters(scope.model, scope.displayedDataProperties);
		scope.viewModel = modelInfo.model;

		gridController.setData(scope.viewModel);
		$rootScope.$broadcast("lightGrid.dataUpdated", scope.gridId, {
			model: scope.model,
			recordCount: modelInfo.recordCount,
			viewOptions: scope.displayedDataProperties
		});
		
		if (!scope.$$phase && !$rootScope.$$phase) {
			scope.$apply();
		}
	}

	var localDataProviderController = ["$scope", "$q", function ($scope, $q) {
		this.getViewProperties = function () {
			return $scope.displayedDataProperties;
		};

		this.sort = function (sortProperty, descending) {
			$.extend($scope.displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			updateGridModel($scope);
			$rootScope.$broadcast("lightGrid.dataSorted", $scope.gridId, {
				sortProperty: sortProperty,
				sortDirectionDescending: descending
			});
		};

		this.changePage = function (pageNumber, pageSize) {
			$.extend($scope.displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			updateGridModel($scope);
		};

		this.filter = function (filter) {
			$.extend($scope.displayedDataProperties, { filter: filter, pageNumber: 1 });
			updateGridModel($scope);
		};

		this.updateRecords = function () {
			// local model is updated immediately, so nothing to do here
		};

		this.addRecord = function (record) {
			var deferred = $q.defer();

			$scope.model.push(record);

			deferred.resolve();
			return deferred.promise;
		};

		this.deleteRecord = function (record) {
			var deferred = $q.defer();
			var deleteIndex = null;

			for (var i = 0; i < $scope.model.length; ++i) {
				if ($scope.model[i] === record) {
					deleteIndex = i;
					break;
				}
			}

			if (deleteIndex !== null) {
				$scope.model.splice(deleteIndex, 1);
				deferred.resolve();
			} else {
				deferred.reject();
			}

			return deferred.promise;
		};
	}];

	return {
		scope: {
			model: "=",
			initialOptions: "=?"
		},
		restrict: "EA",
		require: "^?lightGrid",
		controllerAs: "controller",
		controller: localDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			if (gridController) {
				scope.gridId = gridController.getId();
			} else {
				scope.gridId = attrs.gridId;
			}

			scope.displayedDataProperties = $.extend({}, defaultOptions, scope.initialOptions);

			scope.$watch("model", function () {
				updateGridModel(scope);
			});

			lgGridService.registerDataProvider(scope.gridId, scope.controller);
			elem.remove();
		}
	};
}]);