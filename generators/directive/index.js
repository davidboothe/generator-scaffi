'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

var helperFns = require('../helpers/generatorFns');

module.exports = yeoman.Base.extend({

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' directive time!'
		));


		var prompts = [];

		prompts = [{
			type: 'input',
			name: 'directiveName',
			message: 'What\'s the directive name going to be? (form-addon)',
			validate: function(input) {

				// need to check that this exists already
				return helperFns.validateTagName(input);
			}
		}];
		
		
		prompts.push({
			type: 'confirm',
			name: 'splitControllers',
			message: 'Do you need separate controllers for web and mobile?',
			default: 0,
			choices: ['No', 'Yes']
		});
		
		this.prompt(prompts, function (props) {
			this.props = props;

			this.directiveName = props.directiveName;
			this.splitControllers = props.splitControllers;

			done();
		}.bind(this));


	},

	writing: function () {

		var params = {
			directiveName: this.directiveName,
			className: helperFns.makeDisplayName(this.directiveName)
		};

		var folderName = path.join(this.directiveName, this.directiveName);
		
		if(this.splitControllers) {
			
			this.fs.copyTpl(
				this.templatePath('directive.abstract.js'),
				this.destinationPath(path.join("src", "ui", "app", "directives", folderName + ".js")),
				params);
			
			this.fs.copyTpl(
				this.templatePath('directive.web.js'),
				this.destinationPath(path.join("src", "ui", "app", "directives", folderName + ".web.directive.js")),
				params);
			this.fs.copyTpl(
				this.templatePath('directive.mobile.js'),
				this.destinationPath(path.join("src", "ui", "app", "directives", folderName + ".mobile.directive.js")),
				params);
			
		} else {
			
			this.fs.copyTpl(
				this.templatePath('directive.js'),
				this.destinationPath(path.join("src", "ui", "app", "directives", folderName + ".directive.js")),
				params);
		}


	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var destPath = this.destinationPath(path.join("src", "ui", "app", "directives"));

		helperFns.generateGenericJsIncludes(destPath, done, "directives.js", 'directive.js');
	},
});
