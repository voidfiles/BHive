Javascript Application Platform
================================

A very bland name for sure. I will change it as I define it better. This is the best I can do for now. I want to create and open source enterprize app platform. Something like salesforce but open source. 

At this stage I am just playing around but I do know some things. 

It will be all javascript. Except for building packages I might use some python to help manage some rote tacks. 

It will be based on jquery. 

Forward looking, HTML 5, canvas, location will all be supported.

Updates
=======

2009-08-22
----------
major restructure. Tried to use webworkers as sandbox for modules, didn't work. Instead of making each module its own, app I figured i would make one app and modules are addons to that. Simplified greatly the flow, but had to move things around. Not sure how to run the tests yet. 


2009-08-19
----------
Started looking at data models. How to build them, the hardest part is to make it semantically make sense. 

2009-08-10
----------
Got it to a point where there is a simple module. Lots of things that are wrong still. There are three basic apps. bhive which is the main framework app, all installations will have to have this. example app, is where I am doing an example app. Help\_module, is an app that really only provides a module. I am not sure if this is how I would want modules to end up, but for now I think it works. I am not sure how I will end up de-coupling this stuff, mayby I can't.  The urls are ugly when you use couchdb, not sure if there is a like a mod\_rerwite or anything like that. 


2009-08-04
----------
Deciding to go with couchdb and couchapps for deployment. I think I need to commit to the one database to make the idea of the project work. CouchApp has a bit too much going on, well not couchapp, but couchapps have to many things going on. It handles its self well though. I was able to cut a lot of the cruft out and just start with my attachments and views. By deciding on the database I helps me to solidify other decsiosn like layout. Only thing to worry about is authentication. If they don't support cross db auth somehow, then I will need to setup somekind of proxy, one more server in the way. 

