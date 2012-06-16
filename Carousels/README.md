
newness.Carousel
===========================


A control that provides the ability to slide back and forth between different views without having to load all the views initially.

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


A control that displays a scrolling list of views.  VirtualCarousel is optimized such that only
3 views are created even if the actual number of views is infinite.  VirtualCarousel doesn't employ
flyweight strategy but takes the same fact that object creation is expensive so instead
of creating new view old view is being reused.

To initialize VirtualCarousel, use `renderViews`.  The `onSetupView` event
allows for updating view for a given view index.  The view returned in the event could contain
old view that is not suitable for the given index, so is the user's responsiblitiy to update
the view.  Here's a simple example:
  
	{name: "carousel", kind: "VirtualCarousel", flex: 1, onSetupView: "setupView"}

	rendered: function() {
		this.inherited(arguments);
		var selectedViewIndex = 5;
		this.$.carousel.renderViews(selectedViewIndex);
	},
	setupView: function(inSender, inView, inViewIndex) {
		if (inViewIndex > 0 && inViewIndex < 30) {
			inView.setHeader("Hello " + inViewIndex);
			return true;
		}
	}
	
An `onSetupView` handler must return true to indicate that the given view should be rendered.

The `onSnap` event fires when the user finishes dragging and snapping occurs.
And the `onSnapFinish` fires when snapping and scroller animation completes.

To get a handle of the currently displayed view, use `fetchCurrentView()`.
For example, to get the current displayed view after snapping is completed:

	{name: "carousel", kind: "VirtualCarousel", flex: 1, onSetupView: "setupView", onSnapFinish: "snapFinish"}
	
	snapFinish: function(inSender) {
		var view = this.$.carousel.fetchCurrentView();
	}

To move the view programmatically, use `next()` or `previous()`.



Demo
----

[Live Demo](http://www.newnessdevelopments.com/demos/Carousels/)
