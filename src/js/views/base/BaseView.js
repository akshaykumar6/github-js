/**
 * @author: Akshay Sharma
 * @since: 31/01/2015@01:00:10
 * @file: BaseView.js
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
    'github',
    'views/header/HeaderView',
    'text!templates/base/BaseTpl.tpl'
], function($, _, Backbone, Github, HeaderView, BaseTpl) {
    'use strict';

    var BaseView = Backbone.View.extend({
        template: _.template(BaseTpl),

        tagName: 'div',

        id: '',

        className: '',

        initialize: function(options) {
            this.vars = options;
            _.bindAll(this, 'render');
        },

        events: {
            'keyup .gthub-username': 'onUsernameChangeEvent',
            'keyup .gthub-orgname': 'onOrgnameChangeEvent'
        },

        render: function() {
            this.$el.html(this.template());

            this.headerView = new HeaderView();
            this.$('.header-cnt').html(this.headerView.render().$el);

            return this;
        },

        onUsernameChangeEvent: function (e) {
            e.preventDefault();
            if (e.keyCode==13) {
                var guestname = _.escape($('.gthub-username').val());
                Github.userProfile({
                    username: guestname,
                    selector: ".user-1"
                });

                Github.userActivity({
                    username: guestname,
                    selector: ".user-2"
                });
            }
        },

        onOrgnameChangeEvent: function (e) {
            e.preventDefault();
            if (e.keyCode==13) {
                var guestname = _.escape($('.gthub-orgname').val());
                Github.orgProfile({
                    orgname: guestname,
                    selector: ".org-1"
                });

                Github.orgActivity({
                    orgname: guestname,
                    selector: ".org-2"
                });
            }
        }
    });

    return BaseView;
});