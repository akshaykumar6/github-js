/**
 * @author: Akshay Sharma
 *
 * @since: 31/01/2015 @ 00:20:52
 * @file: main.js
 *
 *
 **/

/**
 * FILE DESCRIPTION
 *
 **/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        github: {
            deps: ['underscore'],
            exports: 'github'
        }
    },
    paths: {
        jquery: '../com/vendor/jquery/dist/jquery',
        backbone: '../com/vendor/backbone/backbone',
        underscore: '../com/vendor/underscore/underscore',
        text: '../com/vendor/text/text',
        bootstrap: '../com/vendor/bootstrap/dist/js/bootstrap.min',
        nprogress: '../com/vendor/nprogress/nprogress',
        github: '../com/vendor/github-js/dist/github.min'
        // github: '../../../github-js/src/github'
        
    }
});

require([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'nprogress',
    'routers/AppRouter'
], function($, _, Backbone, Bootstrap, NProgress, AppRouter) {

    $(document).ready(function() {
        NProgress.set(0.0);
        window.app = new AppRouter();
        Backbone.history.start();

    });

});