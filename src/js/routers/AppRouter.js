/**
 * @author: Akshay Sharma
 * @since: 31/01/2015@01:00:10
 * @file: AppRouter.js
 *
 **/


/**
 * Application routes are registered here
 **/

 define([
    'jquery',
    'underscore',
    'backbone',
    'github',
    'nprogress', 
    'views/base/BaseView'
    ], function($, _, Backbone, Github, NProgress, BaseView) {

        var AppRouter = Backbone.Router.extend({

            initialize: function() {
                NProgress.set(0.4);
            },

            routes: {
                '': 'initApp',
                'home': 'initApp',
                'examples': 'initApp'
            },

            initApp: function() {

                if (!this.baseView) {
                    this.baseView = new BaseView();

                    $('#root').html(this.baseView.render().$el);
                    
                    this.renderExamples();
                    
                    NProgress.done();
                }
                

            },

            renderExamples: function(){

                Github.userProfile({
                    username: "jashkenas",
                    selector: ".user-1"
                });

                Github.userActivity({
                    username: "torvalds",
                    selector: ".user-2"
                });

                Github.repoProfile({
                    username: 'atom',
                    reponame: 'atom',
                    selector: '.repo-1'
                });

                Github.repoActivity({
                    username: 'joyent',
                    selector: '.repo-2',
                    reponame: 'node'
                });

                Github.orgProfile({
                   orgname: 'facebook',
                   selector: '.org-1'
               });

                Github.orgActivity({
                   orgname: 'google',
                   selector: '.org-2'
               });
            }


        });

return AppRouter;
});