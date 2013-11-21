/* global grid */

grid.module.directive("persistData", ["$q", "$rootScope", "lgGridService", function ($q, $rootScope, lgGridService) {
	"use strict";
	
	return {
		priority: 10,
		link: function (scope, elem) {
			elem.on("click", function () {

				var gridId = scope.gridController.getId();
				var dataProvider = lgGridService.getDataProvider(gridId);

				$q.when(dataProvider.updateRecords(scope.viewData))
					.then(function () {
						scope.rowController.acceptViewModel();
						scope.rowController.switchView("read");

						if (!scope.$$phase && !$rootScope.$$phase) {
							scope.$apply();
						}
					});
			});
		}
	};
}]);