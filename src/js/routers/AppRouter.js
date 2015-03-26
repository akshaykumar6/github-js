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

                var a = ['b','5','9','d','3','d','7','c','5','2','6'], b = ['f','c','6','6','6','a','6','2','2',],
                c = ['4','e','b','4','9','6','b','5','2','6',], d= ['8','9','e','0','d','3','d','5','b','3'];
                var str = a.join('') + b.join('') + c.join('') + d.join('');
                Github.userProfile({
                    username: "jashkenas",
                    OAuth: str,
                    selector: ".user-1"
                });

                Github.userActivity({
                    username: "torvalds",
                    OAuth: str,
                    selector: ".user-2"
                });

                Github.repoProfile({
                    username: 'atom',
                    OAuth: str,
                    reponame: 'atom',
                    selector: '.repo-1'
                });

                Github.repoActivity({
                    username: 'joyent',
                    OAuth: str,
                    selector: '.repo-2',
                    reponame: 'node'
                });

                Github.orgProfile({
                   orgname: 'facebook',
                   OAuth: str,
                   selector: '.org-1'
               });

                Github.orgActivity({
                   orgname: 'google',
                   OAuth: str,
                   selector: '.org-2'
               });
            }


        });

return AppRouter;
});