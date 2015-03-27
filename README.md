# Github.js

Github.js is a JavaScript plugin over [GitHub APIs v3](https://developer.github.com/v3/). It gives an easy way to feature your GitHub open-source contributions on your website or portfolio.

# Demo

[Click here](http://akshaykumar6.github.io/github-js) for live demo.

#Dependency

The plugin has hard dependency on [underscore.js](http://underscorejs.org/)(~v1.6.0). You can download it from [here](https://github.com/jashkenas/underscore/archive/1.6.0.zip).

# Installation

Add **github.js** and **github.css** to your project. [Download](https://github.com/akshaykumar6/github-js/archive/master.zip).

```html
<link rel='stylesheet' href='github.css'/>

// Add underscore.js 
<script type="text/javascript" src="underscore-min.js"></script>
<script type="text/javascript" src='github.js'></script>
```

Github.js is available via [bower](http://bower.io/search/?q=githubjs) and [npm](https://www.npmjs.com/package/githubjs).
```
$ bower install --save githubjs
$ npm install --save githubjs
```

# Usage
### User Profile

```javascript
Github.userProfile({
  username: "jashkenas",
  selector: ".user-1"
});
```
  
### User Activity

```javascript
Github.userActivity({
  username: "torvalds",
  selector: ".user-2"
});
```
  
### Repository Profile
 
```javascript
Github.repoProfile({
  username: 'atom',
  reponame: 'atom',
  selector: '.repo-1'
});
```

### Repository Activity
 
```javascript
Github.repoActivity({
  username: 'joyent',
  reponame: 'node',
  selector: '.repo-2'
});
```
  
### Organization Profile
 
```javascript
Github.orgProfile({
 orgname: 'facebook',
 selector: '.org-1'
});
```
  
### Organization Activity
 
```javascript
Github.orgActivity({
 orgname: 'google',
 selector: '.org-2'
});
``` 
  
# Documentation
 * [Complete Documentation](https://github.com/akshaykumar6/github-js/wiki)
 * [Annotated Source Code](http://akshaykumar6.github.io/github-js/docs/github.html)

# Contribute
 To start contributing to Github.js, clone the repository and start playing.
```
$ git clone git@github.com:akshaykumar6/github-js.git
$ cd github-js
```

If you're not familiar with Git, visit the [Git homepage](http://git-scm.com/) to download Git for your platform.

**Got a bug or a feature request?** [Please open a new issue](https://github.com/akshaykumar6/github-js/issues).

# License
**github-js** © 2015, Akshay Sharma Released under the [MIT License](http://mit-license.org/).

Authored and maintained by [Akshay Sharma](http://akshaykumar6.github.io/).
