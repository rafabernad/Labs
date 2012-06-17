newness.Carousel
===========================


An `Enyo.Panels` control that provides the ability to slide back and forth between different views without having to load all the views initially.

A single carousel could contain thousands of views/images.  Loading all of them into memory at once would not be feasible.
Carousel solves this problem by only holding onto the center view (C), the previous view (P), and the next view (N).
Additional views are loaded as the user flips through the items in the Carousel.

	| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
	              P   C   N


Basic Use
---------

To initialize a carousel:

	{name: "carousel", kind: "newness.Carousel", fit: true, onGetLeft: "getLeft", onGetRight: "getRight"}

Use setCenterView to set the center view, and the `onGetLeft` and `onGetRight` events to build a scrolling list of views.

	create: function() {
		this.inherited(arguments);
		this.$.carousel.setCenterView(this.getView(this.index));
	},
	getView: function(inIndex) {
		return {content: inIndex};
	},
	getLeft: function(inSender, inEvent) {
		inEvent.snap && this.index--;
		this.$.carousel.newView(inEvent.originator, this.getView(this.index - 1));
		return true;
	},
	getRight: function(inSender, inEvent) {
		inEvent.snap && this.index++;
		this.$.carousel.newView(inEvent.originator, this.getView(this.index + 1));
		return true;
	}




newness.FlyweightCarousel
===========================


An `Enyo.Panels` that displays a scrolling list of views.  FlyweightCarousel is optimized such that only
3 views are created even if the actual number of views is infinite.  FlyweightCarousel doesn't employ
flyweight strategy but takes the same fact that object creation is expensive so instead
of creating new views each time, the same views are being reused.

To initialize FlyweightCarousel, use `renderViews`.  The `onSetupView` event
allows for updating view for a given view index.  The view returned in the event could contain
old view that is not suitable for the given index, so is the user's responsiblitiy to update
the view.  Here's a simple example:
  
	{name: "carousel", kind: "FlyweightCarousel", fit: true, onSetupView: "setupView"}

	rendered: function() {
		this.inherited(arguments);
		var selectedViewIndex = 5;
		this.$.carousel.renderViews(selectedViewIndex);
	},
	setupView: function(inSender, inEvent) {
		if (inEvent.viewIndex > 0 && inEvent.viewIndex < 30) {
			inEvent.originator.setHeader("Hello " + inEvent.viewIndex);
			return true;
		}
	}
	
An `onSetupView` handler must return true to indicate that the given view should be rendered.

To get a handle of the currently displayed view, use `fetchCurrentView()`.

To move the view programmatically, use `next()` or `previous()`.

Dendencies
----------
[Enyo Panels Library](https://github.com/enyojs/layout/tree/master/panels)

Demo
----

[Live Demo](http://www.newnessdevelopments.com/demos/Carousels/)
