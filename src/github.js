var GitHub = (function () {

  var gitObj = {};

  var gitApiUrl = 'https://api.github.com/';

  var gitTemplates = {
    userProfileTpl: '<div class="gt-usr-header gt-shadow">'+
                      '<div class="gt-usr-avatar">'+
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
                      '</div>'+
                    '</div>',

    repoProfileTpl: '<div class="gt-usr-header gt-shadow">'+
                      '<div class="gt-usr-name">'+
                        '<span class="user-name"><%= name%></span>'+
                        '<a target="_blank" href="<%= owner.html_url%>">'+
                          '<span class="user-login"><%= owner.login%></span>'+
                        '</a>'+
                        '<p>'+
                          '<%= description%>'+
                        '</p>'+
                      '</div>'+
                      '<div class="gt-usr-details">'+
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
                          '<%= languageHtml %>'+
                        '</div>'+
                      '</div>'+
                    '</div>',

    orgProfileTpl: '<div class="gt-org-header gt-shadow">'+
                      '<div class="gt-org-avatar">'+
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
                      '</div>'+
                    '</div>',
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


  var gitMethods = {

    checkInteger: function (value) {
      // Check if value is integer
      if (value === parseInt(value, 10))
        return true;
      else 
        return false;
    },

    getRenderedHTML: function (template, data) {
      // Get the rendered template with data
      if (data) {
        return _.template(template)(data);
      } else{
        return _.template(template)();
      }
    },

    getUserProfileHTML: function (username){
      // Get User profile HTML
      var userUrl = gitApiUrl + 'users/' + username;
      return  gitMethods.getData(userUrl, function(data){
        return gitMethods.getRenderedHTML(gitTemplates.userProfileTpl, data);
      });
    },

    getRepoProfileHTML: function (username, reponame){
      // Get the repository profile HTML with language stats
      var repoUrl = gitApiUrl + 'repos/' + username +'/'+ reponame;
      var languageUrl = repoUrl + '/languages';
      var languageHtml = gitMethods.getData(languageUrl, gitMethods.getLanguageHTML);
      
      return  gitMethods.getData(repoUrl, function(data){
        data.languageHtml = languageHtml;
        return gitMethods.getRenderedHTML(gitTemplates.repoProfileTpl, data);
      });
    },

    getOrgProfileHTML: function (orgname){
      // Get organization profile HTML
      var orgUrl = gitApiUrl + 'orgs/' + orgname;
      return  gitMethods.getData(orgUrl, function(data){
        return gitMethods.getRenderedHTML(gitTemplates.orgProfileTpl, data);
      });
    },

    getPublicActivityHTML: function (data) {
      // Get all the public activities of user/repo/organization
      var html = '<div class="gt-activity-cnt gt-scrollbar">';
      var length = (gitMethods.activityLimit < data.length)? gitMethods.activityLimit : data.length;

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
      
      html += "</div>";
      return html;
    },

    getCommitsHTML: function(activity){
        // Form HTML for commits in PushEvent
        var html = '<ul class="gt-commit-list">';
        var liElement, shaLink, commitMessage,  commit, index,
        compareLink = '',
        payload = activity.payload,
        length = payload.commits.length,
        shaDiff = payload.before + '...' + payload.head;
        
        for(index = 0; index < length; index++){
              // Get links for 2 or less commit
              if (index>1) break;
              commit = payload.commits[index];
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

    getData: function(url, callback){
      // Utility for synchronous AJAX calls
      var content, data, request;
      request = new XMLHttpRequest();
      request.open('GET', url, false);
      
      request.onload = function(e) {
        if (request.status >= 200 && request.status < 400){
          data = JSON.parse(request.responseText);
          content = callback(data);
        } else {
          return false;
        }
      };

      request.onerror = function(e) { 
        console.log('An error occurred while connecting to GitHub API.'); 
      };
      request.send();
      return content;
    },

    getLink: function(url, title, cssClass) {
      // Get anchor tag HTML for URL
      if (!title)
        title = url;
      if (typeof(cssClass) === 'undefined')
        cssClass = '';
      return gitMethods.getRenderedHTML('<a class="' + cssClass + '" href="<%=url%>" target="_blank"><%=title%></a>', { url: url, title: title });
    },

    getGitHubLink: function(url, title, cssClass) {
      // Get anchor tag HTML for non-github URL
      if (!title)
        title = url;
      if (typeof(cssClass) === 'undefined')
        cssClass = '';
      return gitMethods.getLink('https://github.com/' + url, title, cssClass);
    },

    getPluralWord: function (count, word) {
      //  Only for plurals ending with 's' 
      if (count !== 1) return word + 's';
      return word;
    },

    getLanguageHTML: function(data){
      // Get repository language stat HTML
      var languageData = [], sum = 0,
      percentage, languageHtml = '';

      _.each(data, function(value, key){ 
          var data = {};
          data.language = key;
          data.size = value;
          languageData.push(data);
          sum += value; 
      });

      // Sort languages by usage in repo 
      languageData = languageData.sort(function(a, b){return b.size - a.size});

      _.each(languageData, function(element){
          // Get HTML for each language
          percentage = (parseInt(element.size)/sum*100).toFixed(1);
          languageHtml +='<div class="gt-repo-lg-cnt" style="width: '+ percentage +'%; background: #'+ gitMethods.getRandomColor() +'; " >'+
                 ' <div class="gt-repo-lg-name" data-title="'+ element.language +' ('+ percentage +'%)"> </div> </div>';
      });
      
      return languageHtml;
    },

    getRandomColor: function(){
      // Get random HEX code for color
      return Math.random().toString(16).substring(2, 8);
    },

    millisecondsToStr: function(milliseconds) {
      // Convert milliseconds to time string
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

    renderContent: function(content, selector){
      // render the content to the selector
      var selectorDivs = document.querySelectorAll(selector);
      content = '<div class="gt-container">'+content+'</div>';
      
      for (var i = 0; i < selectorDivs.length; i++) {
        selectorDivs[i].innerHTML = content;
        selectorDivs[i].style.position = 'relative';
      }
      
    },

    setLimit: function(value){
      // Set render limit for activities - default is 30
      var limit;
      if (value !== 'undefined' && gitMethods.checkInteger(limit = parseInt(value, 10))) {
        gitMethods.activityLimit = (limit>30)?30:limit;
      } 
      else {
        gitMethods.activityLimit = 30;
      }
    }

  };

  /**
   * userProfile - render's the github user details to selector
   * @param  {[JSON]} options [username, selector]
   */
  gitObj.userProfile = function (options) {

    if (!options.username || !options.selector) {
      return false;
    }

    var parentCnt = '';

    var userHtml = gitMethods.getUserProfileHTML(options.username);
    if (userHtml) {
      parentCnt += userHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);

  };
  /**
   * repoProfile - render's the github repo details to selector
   * @param  {[JSON]} options [username, reponame, selector]
   */
  gitObj.repoProfile = function (options) {

    if (!options.username || !options.selector || !options.reponame) {
      return false;
    }

    var parentCnt = '';

    var repoHtml = gitMethods.getRepoProfileHTML(options.username, options.reponame);
    if (repoHtml) {
      parentCnt += repoHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);

  };
  /**
  * orgProfile - render's the github organization details to selector
  * @param  {[JSON]} options [orgname, selector]
  */
  gitObj.orgProfile = function (options) {

    if (!options.orgname || !options.selector) {
      return false;
    }

    var parentCnt = '';

    var orgHtml = gitMethods.getOrgProfileHTML(options.orgname);
    if (orgHtml) {
      parentCnt += orgHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);
    
  };
  /**
  * userActivity - render's the github user activity to selector
  * @param  {[JSON]} options [username, selector and limit (optional)]
  */
  gitObj.userActivity = function (options) {

    if (!options.username || !options.selector) {
      return false;
    }

    gitMethods.setLimit(options.limit);
    var eventsUrl = gitApiUrl + 'users/' + options.username + '/events',
    parentCnt = '';

    var userHtml = gitMethods.getUserProfileHTML(options.username);
    if (userHtml) {
      parentCnt += userHtml;
      eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);
      parentCnt += eventHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);

  };
  /**
  * repoActivity - render's the github repository activity to selector
  * @param  {[JSON]} options [username, reponame, selector and limit (optional)]
  */
  gitObj.repoActivity = function (options) {

    if (!options.username || !options.selector || !options.reponame) {
      return false;
    }

    gitMethods.setLimit(options.limit);
    var eventsUrl = gitApiUrl + 'repos/' + options.username + '/' + options.reponame + '/events',
    parentCnt = '';

    var repoHtml = gitMethods.getRepoProfileHTML(options.username, options.reponame);
    if (repoHtml) {
      parentCnt += repoHtml;
      eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);
      parentCnt += eventHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);

  };
  /**
  * orgActivity - render's the github organization activity to selector
  * @param  {[JSON]} options [orgname, selector and limit (optional)]
  */
  gitObj.orgActivity = function (options) {

    if (!options.orgname || !options.selector) {
      return false;
    }

    gitMethods.setLimit(options.limit);
    var eventsUrl =  gitApiUrl + 'orgs/' + options.orgname + '/events',
    parentCnt = '';

    var orgHtml = gitMethods.getOrgProfileHTML(options.orgname);
    if (orgHtml) {
      parentCnt += orgHtml;
      eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);
      parentCnt += eventHtml;
    } else{
      parentCnt += gitMethods.getRenderedHTML(gitTemplates.notFoundTpl)
    }

    gitMethods.renderContent(parentCnt, options.selector);

  };

  return gitObj;
})();