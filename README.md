ampedjs
=========

A JavaScript MV* framework for modern web apps.

Usage
-------

Documentation coming soon. In the mean time, check test/index.html for basic tests, or view the annotated source code.

Dependencies
-------

* RequireJS 2.1+

To-do
-------

* Implement unit tests for Ajax, Collections and Persistence modules
* Fix issues with persistence module
* Implement routes
	* Implement client and server routes as separate things
	* Users should be able to bind client routes  using Am.Route.bind(route, controller, action) or  Am.Route.bind(route, controller)
	* Users should be able to to navigate between routes by using Am.go(route)
	* Implement raising of enter(route) and leave(route) events on views
  * Implement dependency injection
	* Implement support for calling Am.Controller.create() using model names (as opposed to references)
	* Implement default routes for controller actions based on a provided list of controller names
 
License
-------
Copyright 2014 Alvin Teh.
Licensed under the MIT license.
