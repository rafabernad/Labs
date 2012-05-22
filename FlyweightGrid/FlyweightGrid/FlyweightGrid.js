/**
A control that displays a repeating list of cells. It is suitable for displaying medium-sized
lists (maximum of ~100 items). A flyweight strategy is employed to render one 
set of cell controls as needed for as many cells as are contained in the repeater.

##Basic Use

A FlyweightGrid's components block contains the controls to be used for a single cell.
This set of controls will be rendered for each cell.

The onSetupCell event allows for customization of cell rendering. Here's a simple example:

	components: [
		{kind: "FlyweightGrid", cells: 100, minCellWidth: 150, onSetupCell: "setupCell", components: [
			{name: "item"}
		]}
	],
	setupCell: function(inSender, inEvent) {
		this.$.item.setContent("I am cell: " + inEvent.index);
	}
	
##Modifying Cells

Controls inside a FlyweightCell are non-interactive. This means that outside the onSetupCell event, 
calling methods that would otherwise cause rendering to occur will not do so (e.g. setContent).
A cell can be forced to render by calling the renderCell(inCell) method. In addition, a cell can be 
temporarily made interactive by calling the prepareCell(inCell) method. When interaction is complete, the
lockCell method should be called.

*/

enyo.kind({
	name: "newness.FlyweightGrid",
	kind: "FlyweightRepeater",
	published: {
		cells: 0,
		cellOffset: 0,
		minCellWidth: 320
	},
	handlers: {
		onSetupRow: "setupCell"
	},
	events: {
		//* Fired once per cell at render-time, with event object: {index: <index of cell>}
		onSetupCell: ""
	},
	initComponents: function() {
		this.inherited(arguments);
		this.$.client.setClasses("newness-flyweightgrid-cell");
	},
	rendered: function() {
		this.inherited(arguments);
		this.resized();
	},
	setupCell: function(inSender, inEvent) {
		this.doSetupCell({index: inEvent.index});
		return true;
	},
	cellWidthChanged: function() {
		this.resizeHandler();
	},
	generateChildHtml: function() {
		this.rows = this.cells;
		this.rowOffset = this.cellOffset;
		return this.inherited(arguments);
	},
	//* Render the cell specified by inIndex.
	//* It's an alias for original FlyweightRepeater's renderRow()
	renderCell: function(inIndex) {
		return this.renderRow(inIndex);
	},
	//* Fetch the dom node for the given cell index. It's an alias for original FlyweightRepeater's fetchRowNode()
	fetchCellNode: function(inIndex) {
		return this.fetchRowNode(inIndex);
	},
	//* Prepare the cell specified by inIndex such that changes effected on the 
	//* controls inside the repeater will be rendered for the given cell.
	//* It's an alias for original FlyweightRepeater's prepareRow()
	prepareCell: function(inIndex) {
		return this.prepareRow(inIndex);
	},
	//* Prevent changes to the controls inside the repeater from being rendered
	//* It's an alias for original FlyweightRepeater's lockRow()
	lockCell: function() {
		this.$.client.teardownChildren();
	},
	resizeHandler: function() {
		
		var controlBounds = this.getBounds();
		var itemsPerRow = Math.floor(controlBounds.width / this.minCellWidth);
		
		for(var i = this.cellOffset; i<(this.rows + this.cellOffset); i++) {
			var node = this.fetchRowNode(i);
			if(node) {
				node.style.width = (100/itemsPerRow) + "%";
			}
		}
		
	}

});
