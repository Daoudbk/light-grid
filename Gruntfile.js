﻿/* global module*/

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator: "\n\n;",
				banner: "(function (window, angular, $, undefined) {\n\n",
				footer: "\n\n}(window, window.angular, window.jQuery));"
			},
			dist: {
				src: [
					"src/moduleDefinition.js",
					"src/tableRenderer.js",
					"src/controller.js",
					"src/directiveDefinition.js",
					
					"src/cell-elements/*.js",
					"src/column-templates/*.js",
					"src/data-providers/*.js"
				],
				dest: "dist/angular-grid-<%= pkg.version %>.js",
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: "dist/angular-grid-<%= pkg.version %>.min.js.map"
				},
				files: {
					"dist/angular-grid-<%= pkg.version %>.min.js": ["dist/angular-grid-<%= pkg.version %>.js"]
				}
			},
		},
		karma: {
			unit: {
				configFile: "config/karma.conf.js",
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-karma");
};