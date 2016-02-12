//      Github.js - v0.1.3

//      © 2015, Akshay Sharma Released under the MIT License.

(function (root, factory) {

    // Set up library appropriately for the environment
    if (typeof define === 'function' && define.amd) {
        // Define for AMD
        define(['underscore'], factory);
    } else if (typeof exports === 'object') {
        // Export for Node, CommonJS-like modules
        module.exports = factory(require('underscore'));
    } else {
        // As browser global (root is window here)
        root.Github = factory(root._);
    }

}(this, function (_) {

    var Github = {};

    // Current version of the library. Keep in sync with `package.json`
    Github.version = '0.1.3';

    // Common GitHub API URL
    var gitApiUrl = 'https://api.github.com/';

    //        userProfile - render's the github user details to selector
    //        @param  Type - JSON -> options [username, selector]

    Github.userProfile = function (options) {

      if(options = gitMethods.initialize(options, ['username','selector'], 0)){
        var userUrl = gitApiUrl + 'users/' + options.username;
        gitMethods.getData(userUrl, options, gitMethods.getUserProfileHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    //
    //        repoProfile - render's the github repo details to selector
    //        @param  Type - JSON -> options [username, reponame, selector]
    //
    Github.repoProfile = function (options) {

      if(options = gitMethods.initialize(options, ['username','selector','reponame'], 0)){
        var repoUrl = gitApiUrl + 'repos/' + options.username +'/'+ options.reponame;
        gitMethods.getData(repoUrl, options, gitMethods.getRepoProfileHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    //
    //        orgProfile - render's the github organization details to selector
    //        @param  Type - JSON -> options [orgname, selector]
    //
    Github.orgProfile = function (options) {

      if(options = gitMethods.initialize(options, ['orgname','selector'], 0)){
        var orgUrl = gitApiUrl + 'orgs/' + options.orgname;
        gitMethods.getData(orgUrl, options, gitMethods.getOrgProfileHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    //
    //        userActivity - render's the github user activity to selector
    //        @param  Type - JSON -> options [username, selector and limit (optional)]
    //
    Github.userActivity = function (options) {

      if(options = gitMethods.initialize(options, ['username','selector'], 1)){
        var userUrl = gitApiUrl + 'users/' + options.username,
        eventsUrl = userUrl + '/events';
        gitMethods.getData(userUrl, options, gitMethods.getUserProfileHTML);
        gitMethods.getData(eventsUrl, options, gitMethods.getPublicActivityHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    //
    //        repoActivity - render's the github repository activity to selector
    //        @param  Type - JSON -> options [username, reponame, selector and limit (optional)]
    //
    Github.repoActivity = function (options) {

      if(options = gitMethods.initialize(options, ['username','selector','reponame'], 1)){
        var repoUrl = gitApiUrl + 'repos/' + options.username +'/'+ options.reponame,
        eventsUrl = repoUrl + '/events';
        gitMethods.getData(repoUrl, options, gitMethods.getRepoProfileHTML);
        gitMethods.getData(eventsUrl, options, gitMethods.getPublicActivityHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    //
    //        orgActivity - render's the github organization activity to selector
    //        @param  Type - JSON -> options [orgname, selector and limit (optional)]
    //
    Github.orgActivity = function (options) {

      if(options = gitMethods.initialize(options, ['orgname','selector'], 1)){
        var orgUrl = gitApiUrl + 'orgs/' + options.orgname,
        eventsUrl = orgUrl + '/events';
        gitMethods.getData(orgUrl, options, gitMethods.getOrgProfileHTML);
        gitMethods.getData(eventsUrl, options, gitMethods.getPublicActivityHTML);
      } else{
        console.error("Parameters not passed correctly");
      }

    };

    // Underscore templates for profiles, activities, etc.
    var gitTemplates = {
      // Parent container template
      parentTpl: '<div class="gt-container">'+
                          '<div class="gt-header gt-shadow">'+
                            '<div class="gt-loading-txt">Loading..</div>'+
                          '</div>'+
                          '<%if(type){%><div class="gt-activity-cnt gt-scrollbar">'+
                            '<div class="gt-loading-txt">Loading..</div>'+
                          '</div><%}%>'+
                         '</div>',
      // User profile template
      userProfileTpl:   '<div class="gt-usr-avatar">'+
                          '<a target="_blank" href="<%= html_url%>">'+
                            '<div class="gt-usr-img" style="background-image: url(<%= avatar_url%>)"> </div>'+
                          '</a>'+
                        '</div>'+
                        '<div class="gt-usr-name">'+
                          '<span class="user-name"><%= name%></span>'+
                          '<a target="_blank" href="<%= html_url%>">'+
                            '<span class="user-login"><%= login%></span>'+
                          '</a>'+
                        '</div>'+
                        '<div class="gt-usr-details">'+
                          '<div class="gt-usr-repo">'+
                            '<a target="_blank" href="<%= html_url%>">'+
                            '<span class="gt-usr-txt"><%= public_repos%></span>'+
                            '<span class="gt-usr-dt">Repositories</span>'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-usr-folwr">'+
                            '<a target="_blank" href="<%= html_url + "/followers"%>">'+
                            '<span class="gt-usr-txt"><%= followers%></span>'+
                            '<span class="gt-usr-dt">Followers</span>'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-usr-folng">'+
                            '<a target="_blank" href="<%= html_url + "/following"%>">'+
                            '<span class="gt-usr-txt"><%= following%></span>'+
                            '<span class="gt-usr-dt">Following</span>'+
                            '</a>'+
                          '</div>'+
                        '</div>',
      // Repository profile template
      repoProfileTpl:   '<div class="gt-usr-name">'+
                          '<span class="user-name"><%= name%></span>'+
                          '<a target="_blank" href="<%= owner.html_url%>">'+
                            '<span class="user-login"><%= owner.login%></span>'+
                          '</a>'+
                          '<p>'+
                            '<%= description%>'+
                          '</p>'+
                        '</div>'+
                        '<div class="gt-repo-details">'+
                          '<div class="gt-usr-repo">'+
                            '<a target="_blank" href="<%= html_url%>">'+
                            '<span class="gt-usr-txt"><%= stargazers_count%></span>'+
                            '<span class="gt-usr-dt">Stars</span>'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-usr-folwr">'+
                            '<a target="_blank" href="<%= html_url %>">'+
                            '<span class="gt-usr-txt"><%= subscribers_count%></span>'+
                            '<span class="gt-usr-dt">Watchers</span>'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-usr-folng">'+
                            '<a target="_blank" href="<%= html_url %>">'+
                            '<span class="gt-usr-txt"><%= forks_count%></span>'+
                            '<span class="gt-usr-dt">Forks</span>'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-repo-lg-stat">'+
                          '</div>'+
                        '</div>',
      // Organization profile template
      orgProfileTpl:    '<div class="gt-org-avatar">'+
                          '<a target="_blank" href="<%= html_url%>">'+
                            '<div class="gt-org-img" style="background-image: url(<%= avatar_url%>)"> </div>'+
                          '</a>'+
                        '</div>'+
                        '<div class="gt-org-name">'+
                          '<span class="user-name"><%= name%></span>'+
                          '<%if(blog){%><a target="_blank" href="<%= blog%>" class="gt-org-link">'+
                            '<span class="user-login">Website</span>'+
                          '</a><%}%>'+
                          '<%if(email){%><a target="_blank" href="mailto:<%= email%>" class="gt-org-link">'+
                            '<span class="user-login">Email</span>'+
                          '</a><%}%>'+
                          '<br><span class="gt-org-repos"><%= public_repos%></span>'+
                          '<span class="gt-org-repos"> Public Repositories</span>'+
                        '</div>',
      // Parent activity container template
      gitActivityTpl: '<div class="gt-activity <%=type%>">'+
                          '<div class="gt-avatar-cnt">'+
                            '<a target="_blank" href="https://github.com/<%= actor.login%>">'+
                              '<img src="<%=actor.avatar_url%>" class="gt-usr-avatar">'+
                            '</a>'+
                          '</div>'+
                          '<div class="gt-act-cnt">'+
                              '<div title="<%= created_at%>" class="gt-time-cnt"><div class="gt-time-str"><%= timeString%></div></div>'+
                              '<%= userLink%>'+'<%= message%>'+
                          '</div>'+
                          '<div class="gt-clearfix"></div>'+
                      '</div>',
      // Activity templates keyed with activity type
      CommitCommentEvent:'<span> commented on commit <%= commentLink%> </span>'+
                         '<p><%= payload.comment.body%></p>',
      CreateEvent: '<span> created <%= payload.ref_type%> <%= branchLink%> at <%= repoLink%> </span>',
      DeleteEvent: '<span> deleted <%= payload.ref%> <%= payload.ref_type%> at <%= repoLink%> </span>',
      ForkEvent:  '<span> forked <%= repoLink%> to <%= forkLink%> </span>',
      GollumEvent: '<span> <%= actionType%> the <%= repoLink%> wiki</span>'+
                      '<p><%= wikiMessage%></p>',
      IssueCommentEvent: '<span> commented on issue <%= commentLink%> </span>'+
                              '<p><%= payload.comment.body%></p>',
      IssuesEvent: '<span> <%= payload.action%> issue <%= issueUrl%> </span>',
      MemberEvent: '<span> added <%= memberLink%> to <%= repoLink%> </span>',
      PublicEvent: '<span> open sourced <%= repoLink%> </span>',
      PullRequestEvent: '<span> <%= payload.action%> pull request <%= mergeRequestUrl%> </span>'+
                        '<p><%= payload.pull_request.title%></p>'+
                        '<p class="pull-req-info"><%= payload.pull_request.commits%><%if(payload.pull_request.commits > 1){%> commits <%}else{%> commit <%}%> '+
                        'with <%= payload.pull_request.changed_files%> <%if(payload.pull_request.commits > 1){%> files <%}else{%> file <%}%> changed.</p>',
      PullRequestReviewCommentEvent: '<span> commented on pull request <%= pullCommentUrl%> </span>'+
                                     '<p><%= payload.comment.body%></p>',
      PushEvent: '<span> pushed to <%= branchLink%> at <%= repoLink%> </span>'+
                 '<%= commitsHtml%>',
      ReleaseEvent: '<span> released <%= tagLink%> at <%= repoLink%> </span>'+
                    '<br><%= zipLink%>',
      WatchEvent: '<span> starred <%= repoLink%> </span>',
      noActivityTpl: '<div class="gt-no-activity">'+
                        '<span> There are no public events for this account in past 90 days. </span>'+
                     '</div>',
      notFoundTpl: '<div class="gt-no-activity">'+
                        '<span> This account does not exist. </span>'+
                     '</div>'
    };

    // Object for locally used methods
    var gitMethods = {
      // Check variables and render base template
      initialize: function(options, variables, type){
        // Validate varaibles
        for (var i = 0; i < variables.length; i++) {
          if(!options[variables[i]])
            return false;
        }
        // Type - 0 - only profile

        // Type - 1 - profile and acitivity feed
        gitMethods.renderContent(gitMethods.getRenderedHTML(gitTemplates['parentTpl'],{
          type: type
        }),options.selector);

        // Set limit value
        options.limit = gitMethods.setLimit(options.limit);
        return options;
      },

      // Check if value is integer
      checkInteger: function (value) {
        if (value === parseInt(value, 10))
          return true;
        else
          return false;
      },

      // Get the rendered template with data
      getRenderedHTML: function (template, data) {
        if (data) {
          return _.template(template)(data);
        } else{
          return _.template(template)();
        }
      },

      // Render User profile HTML
      getUserProfileHTML: function (data, options){
        gitMethods.renderContent(gitMethods.getRenderedHTML(gitTemplates.userProfileTpl, data), options.selector,'.gt-header');
      },

      // Render the repository profile HTML with language stats
      getRepoProfileHTML: function (data, options){
        var languageUrl = gitApiUrl + 'repos/' + options.username +'/'+ options.reponame + '/languages';
        // Render template
        gitMethods.renderContent(gitMethods.getRenderedHTML(gitTemplates.repoProfileTpl, data), options.selector,'.gt-header');
        // Fetch language stat for repo
        gitMethods.getData(languageUrl, options, gitMethods.getLanguageHTML);
      },

      // Render organization profile HTML
      getOrgProfileHTML: function (data, options){
        gitMethods.renderContent(gitMethods.getRenderedHTML(gitTemplates.orgProfileTpl, data), options.selector,'.gt-header');
      },

      // Render recent public activities of user/repo/organization
      getPublicActivityHTML: function (data,options) {
        var html = '';
        // Get min of limit of data size
        var length = (options.limit < data.length)? options.limit : data.length;

        if (length==0) {
          // If no activity in last 90 days
          html += gitMethods.getRenderedHTML(gitTemplates['noActivityTpl']);
        }
        else{
          // Loop over all the activities
          for(var index = 0; index < length; index++){
            var activity = data[index];
            var payload = activity.payload;

            // Get attributes common to all activities
            activity.timeString = gitMethods.millisecondsToStr(new Date() - new Date(activity.created_at));
            activity.userLink = gitMethods.getGitHubLink(activity.actor.login, activity.actor.login);
            activity.repoLink = gitMethods.getGitHubLink(activity.repo.name, activity.repo.name);

            // Get the branch name
            activity.branchLink = '';
            if (payload.ref) {
              if (payload.ref.substring(0, 11) === 'refs/heads/') {
                activity.branch = payload.ref.substring(11);
              } else {
                activity.branch = payload.ref;
              }
              activity.branchLink = gitMethods.getGitHubLink(activity.repo.name + '/tree/' + activity.branch, activity.branch);
            }

            // Get the HTML of selected activity type
            switch(activity.type){
              case 'CommitCommentEvent': activity.commentLink = gitMethods.getLink(payload.comment.html_url, activity.repo.name + '@' +payload.comment.commit_id.substring(0,6));
                                  break;
              case 'CreateEvent':
                                  break;
              case 'DeleteEvent':
                                  break;
              case 'ForkEvent':   activity.forkLink = gitMethods.getGitHubLink(payload.forkee.html_url, payload.forkee.full_name);
                                  break;
              case 'GollumEvent': var page = payload.pages[0];
                                  activity.actionType = page.action;
                                  activity.wikiMessage = activity.actionType.charAt(0).toUpperCase() + activity.actionType.slice(1) + ' ';
                                  activity.wikiMessage += gitMethods.getLink(page.html_url, page.title);
                                  break;
              case 'IssueCommentEvent': activity.commentLink= gitMethods.getLink(payload.comment.html_url, activity.repo.name + '#' +payload.issue.number);
                                  break;
              case 'IssuesEvent': activity.issueUrl = gitMethods.getLink(payload.issue.html_url, activity.repo.name + '#' +payload.issue.number);
                                  break;
              case 'MemberEvent': activity.memberLink = gitMethods.getGitHubLink(payload.member.login, payload.member.login);
                                  break;
              case 'PublicEvent':
                                  break;
              case 'PullRequestEvent': activity.mergeRequestUrl = gitMethods.getLink(payload.pull_request.html_url, activity.repo.name + '#' +payload.pull_request.number);
                                  break;
              case 'PullRequestReviewCommentEvent': activity.pullCommentUrl= gitMethods.getLink(payload.comment.html_url, activity.repo.name + '#' +payload.pull_request.number);
                                  break;
              case 'PushEvent':   activity.commitsHtml = gitMethods.getCommitsHTML(activity);
                                  break;
              case 'ReleaseEvent': activity.tagLink = gitMethods.getLink(payload.release.html_url, payload.release.tag_name);
                                   activity.zipLink = gitMethods.getLink(payload.release.zipball_url, 'Download Source Code (zip)')
                                  break;
              case 'WatchEvent':
                                  break;
            }
            // Get activity specific message
            activity.message = gitMethods.getRenderedHTML(gitTemplates[activity.type], activity);
            html += gitMethods.getRenderedHTML(gitTemplates['gitActivityTpl'],activity);

          }
        }
        // Render created activity HTML to DOM
        gitMethods.renderContent(html, options.selector, '.gt-activity-cnt');
      },

      // Form HTML for commits in PushEvent
      getCommitsHTML: function(activity){
          var html = '<ul class="gt-commit-list">',
          liElement, shaLink, commitMessage,  commit, index,
          compareLink = '',
          payload = activity.payload,
          length = payload.commits.length,
          shaDiff = payload.before + '...' + payload.head;

          // Get links for 2 or less commit
          for(index = 0; index < length; index++){
            if (index>1) break;
            commit = payload.commits[index];
            // Create commit li element
            liElement = '<li class="gt-commit-item" >';
            shaLink = gitMethods.getGitHubLink(activity.repo.name + '/commit/' + commit.sha, commit.sha.substring(0, 6));
            commitMessage = '<span class="gt-commit-msg">' + commit.message.substring(0,150) + '</span>';
            liElement += shaLink
            liElement += commitMessage;
            liElement += '</li>'
            html += liElement;
          }

          // Get the diff link between commits
          if (length === 2) {
            compareLink = gitMethods.getGitHubLink(activity.repo.name + '/compare/' + shaDiff, 'View comparison for these 2 commits &raquo;','gt-compare-link');
          } else if (length > 2) {
            compareLink = gitMethods.getGitHubLink(activity.repo.name + '/compare/' + shaDiff, (length-2)+' more ' + gitMethods.getPluralWord(length-2,'commit') + ' &raquo;','gt-compare-link');
          }

          html += '</ul>'
          html += compareLink;

          return html;
      },

      // Utility for asynchronous AJAX calls
      getData: function(url, options, callback){
        var data, request;
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        // Use OAuth token if available
        if (options.OAuth) {
          request.setRequestHeader('Authorization', 'Token ' + options.OAuth);
        }

        request.onload = function(e) {
          if (request.status >= 200 && request.status < 400){
            data = JSON.parse(request.responseText);
            callback(data, options);
          } else {
            // Unsuccessful request - invalid username/ lost internet connectivity/ exceeded rate limit/ API URL not found
            gitMethods.renderContent(gitMethods.getRenderedHTML(gitTemplates.notFoundTpl, data), options.selector,'.gt-container');
            console.error('An error occurred while connecting to GitHub API.');
          }
        };

        request.onerror = function(e) {
          console.error('An error occurred while connecting to GitHub API.');
        };

        request.send();
      },

      // Get anchor tag HTML for URL
      getLink: function(url, title, cssClass) {
        if (!title)
          title = url;
        if (typeof(cssClass) === 'undefined')
          cssClass = '';
        return gitMethods.getRenderedHTML('<a class="' + cssClass + '" href="<%=url%>" target="_blank"><%=title%></a>', { url: url, title: title });
      },

      // Get anchor tag HTML for non-github URL
      getGitHubLink: function(url, title, cssClass) {
        if (!title)
          title = url;
        if (typeof(cssClass) === 'undefined')
          cssClass = '';
        return gitMethods.getLink('https://github.com/' + url, title, cssClass);
      },

      //  Only for plurals ending with 's'. Yeah! this sucks.
      getPluralWord: function (count, word) {
        if (count !== 1) return word + 's';
        return word;
      },

      // Get repository language stat HTML
      getLanguageHTML: function(data, options){
        var languageData = [], sum = 0,
        percentage, languageHtml = '';
        // Get total size and create array which can be sorted by value
        _.each(data, function(value, key){
            var data = {};
            data.language = key;
            data.size = value;
            languageData.push(data);
            sum += value;
        });

        // Sort languages by usage in repo
        languageData = languageData.sort(function(a, b){return b.size - a.size});

        // Get HTML for each language
        _.each(languageData, function(element){
            percentage = (parseInt(element.size)/sum*100).toFixed(1);
            languageHtml +='<div class="gt-repo-lg-cnt" style="width: '+ percentage +'%; background: #'+ gitMethods.getRandomColor() +'; " >'+
                   ' <div class="gt-repo-lg-name" data-title="'+ element.language +' ('+ percentage +'%)"> </div> </div>';
        });

        // Render language HTML to the container
        gitMethods.renderContent(languageHtml, options.selector,'.gt-repo-lg-stat');
      },

      // Get random HEX code for color
      getRandomColor: function(){
        return Math.random().toString(16).substring(2, 8);
      },

      // Convert milliseconds to time string
      millisecondsToStr: function(milliseconds) {
        function numberEnding(number) {
          return (number > 1) ? 's ago' : ' ago';
        }
        var temp = Math.floor(milliseconds / 1000);

        var years = Math.floor(temp / 31536000);
        if (years) return years + ' year' + numberEnding(years);

        var months = Math.floor((temp %= 31536000) / 2592000);
        if (months) return months + ' month' + numberEnding(months);

        var days = Math.floor((temp %= 2592000) / 86400);
        if (days) return days + ' day' + numberEnding(days);

        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) return 'about ' + hours + ' hour' + numberEnding(hours);

        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) return minutes + ' minute' + numberEnding(minutes);

        var seconds = temp % 60;
        if (seconds) return seconds + ' second' + numberEnding(seconds);

        return 'just now';
      },

      // Render the content to the selector or subSelector
      renderContent: function(content, selector, subSelector){
        var selectorDivs = document.querySelectorAll(selector);

        for (var i = 0; i < selectorDivs.length; i++) {
          // if subSelector is passed, find it
          if (subSelector) {
            selectorDiv = selectorDivs[i].querySelector(subSelector);
          } else{
            selectorDiv = selectorDivs[i];
          }
          selectorDiv.innerHTML = content;
        }

      },

      // Set render limit for activities - default is 30
      setLimit: function(value){
        var limit;
        if (value !== 'undefined' && gitMethods.checkInteger(limit = parseInt(value, 10))) {
          limit = (limit>30)?30:limit;
        } else {
          limit = 30;
        }
        return limit;
      }

    };


    return Github;
}));
