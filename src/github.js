var GitHub = (function () {

  var gitObj = {};

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
                            '<%= userLink%>'+'<%= message%>'+
                        '</div>'+
                        '<div title="<%= created_at%>" class="gt-time-cnt"><div class="gt-time-str"><%= timeString%></div></div>'+
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
                   '</div>'
  };


  var gitMethods = {

    checkInteger: function (value) {
      if (value === parseInt(value, 10))
        return true;
      else 
        return false;
    },

    getRenderedHTML: function (template, data) {
      return _.template(template)(data);
    },

    getUserProfileHTML: function (data){
      return gitMethods.getRenderedHTML(gitTemplates.userProfileTpl, data);
    },

    getRepoProfileHTML: function (data){
        return gitMethods.getRenderedHTML(gitTemplates.repoProfileTpl, data);
    },

    getOrgProfileHTML: function (data){
        return gitMethods.getRenderedHTML(gitTemplates.orgProfileTpl, data);
    },

    getPublicActivityHTML: function (data) {
      
      var html = '<div class="gt-activity-cnt gt-scrollbar">';
      var length = (gitMethods.activityLimit < data.length)? gitMethods.activityLimit : data.length;

      if (length==0) {
        html += gitMethods.getRenderedHTML(gitTemplates['noActivityTpl'],{});
      } 
      else{
        for(var index = 0; index < length; index++){

          var activity = data[index];
          var payload = activity.payload;
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
          
          activity.message = gitMethods.getRenderedHTML(gitTemplates[activity.type], activity);
          html += gitMethods.getRenderedHTML(gitTemplates['gitActivityTpl'],activity);

        }
      }
      
      html += "</div>";
      return html;
    },

    getCommitsHTML: function(activity){

        var html = '<ul class="gt-commit-list">';
        var liElement, shaLink, commitMessage,  commit, index,
        compareLink = '',
        payload = activity.payload,
        length = payload.commits.length,
        shaDiff = payload.before + '...' + payload.head;
        
        for(index = 0; index < length; index++){

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

      if (!title)
        title = url;
      if (typeof(cssClass) === 'undefined')
        cssClass = '';
      return gitMethods.getRenderedHTML('<a class="' + cssClass + '" href="<%=url%>" target="_blank"><%=title%></a>', { url: url, title: title });
    },

    getGitHubLink: function(url, title, cssClass) {

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

    renderContent: function(content, selector){
      
      var selectorDivs = document.getElementsByClassName(selector);
      content = '<div class="gt-container">'+content+'</div>';
      if (selectorDivs instanceof HTMLCollection) {
        for (var i = 0; i < selectorDivs.length; i++) {
          selectorDivs[i].innerHTML = content;
          selectorDivs[i].style.position = 'relative';
        }
      }
    }

  };

  gitObj.userProfile = function (options) {

    if (!options.username || !options.classname) {
      return false;
    }

    var selector = options.classname,
    userUrl   = 'https://api.github.com/users/' + options.username,

    parentCnt = '';

    var userHtml = gitMethods.getData(userUrl, gitMethods.getUserProfileHTML);
    parentCnt = userHtml;

    gitMethods.renderContent(parentCnt, selector);

  };

  gitObj.repoProfile = function (options) {

    if (!options.username || !options.classname || !options.reponame) {
      return false;
    }

    var selector = options.classname,
    userUrl   = 'https://api.github.com/repos/' + options.username +'/'+ options.reponame,

    parentCnt = '';

    var repoHtml = gitMethods.getData(userUrl, gitMethods.getRepoProfileHTML);
    parentCnt = repoHtml;

    gitMethods.renderContent(parentCnt, selector);

  };

  gitObj.orgProfile = function (options) {

    if (!options.orgname || !options.classname) {
      return false;
    }

    var selector = options.classname,
    userUrl   = 'https://api.github.com/orgs/' + options.orgname;
    parentCnt = '';

    var orgHtml = gitMethods.getData(userUrl, gitMethods.getOrgProfileHTML);
    parentCnt = orgHtml;
    gitMethods.renderContent(parentCnt, selector);
    
  };

  gitObj.userActivity = function (options) {

    if (!options.username || !options.classname) {
      return false;
    }

    var selector = options.classname,
    userUrl   = 'https://api.github.com/users/' + options.username,
    eventsUrl = userUrl + '/events',
    parentCnt = '',
    userHtml = '',
    eventHtml = '';

    var userHtml = gitMethods.getData(userUrl, gitMethods.getUserProfileHTML);

    var limit;
    if (options.limit !== 'undefined' && gitMethods.checkInteger(limit = parseInt(options.limit, 10))) {
      gitMethods.activityLimit = (limit>30)?30:limit;
    } 
    else {
      gitMethods.activityLimit = 30;
    }

    var eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);

    parentCnt = userHtml + eventHtml;
    gitMethods.renderContent(parentCnt, selector);

  };

  gitObj.repoActivity = function (options) {

    if (!options.username || !options.classname || !options.reponame) {
      return false;
    }

    var selector = options.classname,
    repoUrl   = 'https://api.github.com/repos/' + options.username +'/'+ options.reponame,
    eventsUrl = 'https://api.github.com/repos/'+ options.username + '/' + options.reponame + '/events',
    parentCnt = '',
    userHtml = '',
    eventHtml = '';

    var repoHtml = gitMethods.getData(repoUrl, gitMethods.getRepoProfileHTML);

    var limit;
    if (options.limit !== 'undefined' && gitMethods.checkInteger(limit = parseInt(options.limit, 10))) {
      gitMethods.activityLimit = (limit>30)?30:limit;
    } 
    else {
      gitMethods.activityLimit = 30;
    }

    var eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);

    parentCnt = repoHtml + eventHtml;
    gitMethods.renderContent(parentCnt, selector);

  };

  gitObj.orgActivity = function (options) {

    if (!options.orgname || !options.classname) {
      return false;
    }

    var selector = options.classname,
    userUrl   = 'https://api.github.com/orgs/' + options.orgname,
    eventsUrl = 'https://api.github.com/orgs/'+ options.orgname + '/events';

    parentCnt = '';

    var orgHtml = gitMethods.getData(userUrl, gitMethods.getOrgProfileHTML);
    
    var limit;
    if (options.limit !== 'undefined' && gitMethods.checkInteger(limit = parseInt(options.limit, 10))) {
      gitMethods.activityLimit = (limit>30)?30:limit;
    } 
    else {
      gitMethods.activityLimit = 30;
    }

    var eventHtml = gitMethods.getData(eventsUrl, gitMethods.getPublicActivityHTML);

    parentCnt = orgHtml + eventHtml;

    gitMethods.renderContent(parentCnt, selector);

  };

  return gitObj;
})();