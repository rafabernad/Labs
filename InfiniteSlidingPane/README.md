newness.InfiniteSlidingPane
===========================

An InfiniteSlidingPane is view selector that supports pane sliding, showing one view at a time.

The Panes slide in/out when pushed/popped can be dragged around and swiped off. `newness.InfiniteSlidingPane`'s default view is `newness.InfiniteSlidingView` or any derivative from it.

Dependencies
------------

Onyx


Example Usage
-------------

		components: [{
			name: "Infinite",
			kind: "newness.InfiniteSlidingPane",
			defaultViewType: "viewA",
			viewTypes: [{
				name: "viewA",
				kind: "AppTestView"
			}, {
				name: "viewB",
				kind: "AppTestView"
			}, {
				name: "viewC",
				kind: "AppTestView"
			}]
		}]

		this.$.Infinite.push("viewA");
		this.$.Infinite.pop();
		this.$.Infinite.reset(); //resets to the defaultViewType - viewA
		this.$.Infinite.reset("viewB"); //resets to the specified viewType

You can access to any of the views pushed by calling:

		this.$.Infinite.getViewList();

But you can access to the upmost view by calling:

		this.$.Infinite.getView();
		
And also know how many views are pushed by calling:

		this.$.Infinite.getViewCount();

License
-------

Released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).