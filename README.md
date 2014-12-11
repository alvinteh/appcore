ampedjs
=========

A JavaScript MV* framework for modern web apps.

![Build status](https://travis-ci.org/alvinteh/ampedjs.svg?branch=dev)

Usage
-------

Documentation coming soon. In the mean time, check test/index.html for basic tests, or view the annotated source code.

Dependencies
-------

* RequireJS 2.1+

To-do
-------

* Implement dependency injection
  * Implement support for calling Am.Controller.create() using model names (as opposed to references)
  * Implement default routes for controller actions based on a provided list of controller names
* Implement support for model relationships
* Implement support for isomorphic usage
  * Implement support for Am.View in node.js/io.js environments
  * Implement support for Am.Ajax.Xhr in node.js/io.js environments
* Implement support for quick framework-wide bootstrap configuration through Am.Config
  * Allow users to define the type (client/server-side) of view that AmpedJS should work with 
  * Allow users to enable/disable automatic route bindings for controller actions
  

License
-------
Copyright 2014 Alvin Teh.
Licensed under the MIT license.
