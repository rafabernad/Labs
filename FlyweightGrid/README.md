newness.FlyWeightGrid
===========================


A control that displays a repeating list of cells. It is suitable for displaying medium-sized
lists (maximum of ~100 items). A flyweight strategy is employed to render one 
set of cell controls as needed for as many cells as are contained in the repeater.

Demo
----

[Live Demo](http://www.newnessdevelopments.com/demos/FlyweightGrid/)

Basic Use
---------

A FlyweightGrid's components block contains the controls to be used for a single cell.
This set of controls will be rendered for each cell.

The onSetupCell event allows for customization of cell rendering. Here's a simple example:

	components: [
		{kind: "FlyweightGrid", cells: 100, onSetupCell: "setupCell", components: [
			{name: "item"}
		]}
	],
	setupCell: function(inSender, inEvent) {
		this.$.item.setContent("I am cell: " + inEvent.index);
	}
	
Modifying Cells
---------------

Controls inside a FlyweightGrid are non-interactive. This means that outside the onSetupCell event, 
calling methods that would otherwise cause rendering to occur will not do so (e.g. setContent).
A cell can be forced to render by calling the renderCell(inCell) method. In addition, a cell can be 
temporarily made interactive by calling the prepareCell(inCell) method. When interaction is complete, the
lockCell method should be called.

Dependencies
------------

enyo.FlyweightRepeater

License
-------

Released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).