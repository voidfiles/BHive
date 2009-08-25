BHive was Javascript Application Platform 
==========================================

A very bland name for sure. I will change it as I define it better. This is the best I can do for now. I want to create and open source enterprize app platform. Something like salesforce but open source. 

At this stage I am just playing around but I do know some things. 

It will be all javascript. Except for building packages I might use some python to help manage some rote tacks. 

It will be based on jquery. 

Forward looking, HTML 5, canvas, location will all be supported.


The API as I see it - developing as we go
------------------------------------------
* bh
    * Functions here are very basic like bootstrap.
* bh.document
    * bh.document.Field - The model of a field
        * Field.validate() - can validate the field
        * Field.value - the actually value of the field
        * Field.type - the type of the field 
        * Field.options - on base a list of options and defaults, on an instance the current options for this field
    * bh.document.Manager - A manger object for a group of documents base on a model.
        * Manager.get - gets an object by id
        * Manager.delete - delets an object by id
        * Manager.create - create an document instance 
    * bh.document.Model - The model for an individual document.
        * Model.x - x will represent any fields on the document that you set. 
        * Model.validate - will validate the model
        * Model.save - will validate and then save the object if no validation errors
        * Model.delete - delete this instance of the model
    

* bh.modules - the base module manager. 
    * bh.modules.Module 
        * a basic module object that all modules should inherit from
    * bh.modules.ModuleManager
        * Will manage all the modules in the system 
    * bh.modules.views - all the different views that modules can export 
        * bh.modules.views.Block
            * A block type can be moved around on the page
        * bh.modules.views.TabbedBlock
            * Usually one of these per page contains a number of tabs
        * bh.modules.views.Tab
            * A tab that should reside inside of a TabbedBlock 
        * bh.modules.view.Page
            * A page is the base container type for all others
            
        
    

    
        
    

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

