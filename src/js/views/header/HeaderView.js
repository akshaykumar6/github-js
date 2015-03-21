/**
 * @author: Akshay Sharma
 * @since: 21/02/2015@12:23:06
 * @file: HeaderView.js
 *
 **/

/**
 * FILE DESCRIPTION
 *
 **/

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/header/HeaderTpl.tpl'
], function ($, _, Backbone, HeaderTpl) {
	'use strict';

	var HeaderView = Backbone.View.extend({
		template: _.template(HeaderTpl),

		tagName: 'div',

		id: '',

		className: 'container',

		events: {},

		initialize: function (options) {
			this.vars = options;
			_.bindAll(this, 'render');
		},

		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});

	return HeaderView;
});
