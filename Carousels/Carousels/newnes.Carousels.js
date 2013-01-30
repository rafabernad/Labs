eenyo.kind({
	name: "newnes.CarouselInternal",
	kind: "Panels",
	arrangerKind: "CarouselArranger",
	//arrangerKind: "LeftRightArranger"
	classes: "newness-carousel",
	events: {
		/*
		Fired when center view is changed
		*/
		onViewIndexChange: ""
	},
	kindComponents: [{
		name: "left",
		classes: "newness-carousel-page"
	}, {
		name: "center",
		classes: "newness-carousel-page"
	}, {
		name: "right",
		classes: "newness-carousel-page"
	}],
	_centerIndex: 1,
	/**
	Fetches the view corresponding to the view position "center", "left" or "right".
	"center" would always refer to the view currently displayed.  "left" and "right" would be the left/right of currently displayed.
	Use this function to update the view already being shown.
	@param {String} position of the view to be fetched.  Possible values are "center", "left" or "right".
	*/
	fetchView: function(inViewPos) {
		switch(inViewPos) {
		case "left":
			return this.findView(this.$.left);
		case "right":
			return this.findView(this.$.right);
		case "center":
		default:
			return this.findView(this.$.center);
		}
	},
	/**
	Returns the currently displayed view.
	*/
	fetchCurrentView: function() {
		return this.fetchView("center");
	},
	newView: function(inViewHolder, inInfo, inRender) {
		if(inViewHolder === undefined) {
			this._info = inInfo;
		} else {
			inViewHolder.setShowing(inInfo ? true : false);
			if(inInfo) {
				inViewHolder.destroyClientControls();
				inViewHolder.createComponent(inInfo, {
					owner: this.owner
				});
				inRender && this.render();
			}
		}
	},
	moveView: function(inViewHolder, inView) {
		if(!inViewHolder.showing) {
			inViewHolder.show();
		}
		inViewHolder.destroyClientControls();
		inView.setContainer(inViewHolder);
		inView.setParent(inViewHolder);
	},
	findView: function(inControl) {
		var c = inControl.getControls();
		if(c.length) {
			return c[0];
		}
	},
	previous: function() {
		if(this.index !== this._centerIndex || this.$.left.showing) {
			if(this.index !== this._centerIndex) this._adjustViews();
			this.bAdjustViews = true;
			this.inherited(arguments);
		}
	},
	next: function() {
		if(this.index !== this._centerIndex || this.$.right.showing) {
			if(this.index !== this._centerIndex) this._adjustViews();
			this.bAdjustViews = true;
			this.inherited(arguments);
		}
	},
	dragstart: function(inSender, inEvent) {
		var f = this.fromIndex = this.index;
		this.toIndex = f - (this.layout ? this.layout.calcDragDirection(inEvent) : 0);

		if((this.toIndex === 0 && this.fromIndex === 1 && this.$.left.showing) || (this.toIndex === 2 && this.fromIndex === 1 && this.$.right.showing)) {
			this.bAdjustViews = true;
			this.inherited(arguments);
		}
		return true;
	},
	fireTransitionFinish: function() {
		this.inherited(arguments);
		if(this.bAdjustViews === true) {
			this.bAdjustViews = false;
			this._adjustViews();
		}
	},
	_getCurrentViewName: function() {
		switch(this.index) {
		case 0:
			return "left";
		case 1:
			return "center";
		case 2:
			return "right";
		}
	}
});

/**
A control that provides the ability to slide back and forth between different views without having to load all the views initially.

A single carousel could contain thousands of views/images.  Loading all of them into memory at once would not be feasible.
Carousel solves this problem by only holding onto the center view (C), the previous view (P), and the next view (N).
Additional views are loaded as the user flips through the items in the Carousel.

	| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
	              P   C   N

To initialize a carousel:

	{name: "carousel", kind: "newness.Carousel", fit: true, onGetLeft: "getLeft", onGetRight: "getRight"}

Use <code>setCenterView</code> to set the center view, and the <code>onGetLeft</code> and <code>onGetRight</code> events to build a scrolling list of views.

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
*/
enyo.kind({
	name: "newnes.Carousel",
	kind: newnes.CarouselInternal,
	events: {
		/**
		Gets the left view and also indicates if it is fired after a left transition.
		*/
		onGetLeft: "",
		/**
		Gets the right view and also indicates if it is fired after a right transition.
		*/
		onGetRight: ""
	},
	setCenterView: function(inInfo) {
		this.$.left.setShowing(this.doGetLeft({
			originator: this.$.left,
			snap: false
		}));
		this.newView(this.$.center, inInfo);
		this.$.right.setShowing(this.doGetRight({
			originator: this.$.right,
			snap: false
		}));
		this.setIndexDirect(this._centerIndex);
		if(this.hasNode()) {
			this.render();
		}
	},
	updateView: function(inView, inInfo) {
		this.newView(this.$[inView], inInfo, true);
	},
	panelTransitionFinishHandler: function(inSender, inEvent) {
		if(inEvent.fromIndex !== 1) {
			this.doViewIndexChange({
				fromView: (inEvent.fromIndex > inEvent.toIndex ? "Right" : "Left")
			});
		}
		this.inherited(arguments);
	},
	_adjustViews: function() {
		var goRight = this.index > this._centerIndex;

		var addView = false;
		if(this.index != this._centerIndex || !this._info) {
			addView = this["doGet" + (goRight ? "Right" : "Left")]({
				originator: undefined,
				snap: true
			});
		}
		if(this.index != this._centerIndex) {
			if(addView === true) {
				var vh1 = goRight ? this.$.right : this.$.left;
				var vh2 = goRight ? this.$.left : this.$.right;
				var v = this.$.center;
				this.moveView(vh2, this.findView(v));
				this.moveView(v, this.findView(vh1));
				this.newView(vh1, this._info, true);
				this.setIndexDirect(this._centerIndex);
			}
		}
	}
});

enyo.kind({
	name: "newnes.FlyweightCarousel",
	kind: newnes.CarouselInternal,
	published: {
		viewKind: null,
		viewIndex: null
	},
	events: {
		onSetupView: ""
	},
	create: function() {
		this.inherited(arguments);
		this.viewKindChanged();
	},
	viewIndexChanged: function() {
		this._renderViews(this.viewIndex);
	},
	viewKindChanged: function(inOldViewKind) {
		if(this.viewKind === null) {
			console.error("No viewKind defined");
		} else {
			this._createViewsFromViewKind(true);
		}
	},
	//* @protected
	_renderViews: function(inIndex, inForceCreate) {
		this.viewIndex = inIndex || 0;
		this.index = this._centerIndex;
		this._createViewsFromViewKind(inForceCreate);
		this.updateView(this.$.left, this.viewIndex - 1, true);
		this.updateView(this.$.center, this.viewIndex, true);
		this.updateView(this.$.right, this.viewIndex + 1, true);
		this.doViewIndexChange({
			view: this._getCurrentViewName,
			viewIndex: this.viewIndex
		});
	},

	_createViewsFromViewKind: function(inForce) {
		if(!this._viewsCreated || inForce) {
			this.newView(this.$.left, this.viewKind);
			this.newView(this.$.center, this.viewKind);
			this.newView(this.$.right, this.viewKind);
			if(this.hasNode()) {
				this.render();
			}
			this._viewsCreated = true;
		}
	},
	moveView: function(inViewHolder, inView) {
		if(!inViewHolder.showing) {
			inViewHolder.show();
		}
		inView.setContainer(inViewHolder);
		inView.setParent(inViewHolder);
	},
	updateView: function(inViewHolder, inViewIndex, inSetup) {
		var show = this.doSetupView({
			originator: this.findView(inViewHolder),
			viewIndex: inViewIndex
		});
		inSetup && inViewHolder.setShowing(show ? true : false);
		show && this.findView(inViewHolder).render();
		this.flow();
		this.reflow();
		return show;
	},
	_adjustViews: function() {

		var currentView = "center";
		var goRight = this.index > this._centerIndex;
		var vh1 = goRight ? this.$.right : this.$.left;
		var vh2 = goRight ? this.$.left : this.$.right;
		goRight ? this.viewIndex++ : this.viewIndex--;

		if(this.index !== this._centerIndex) {
			var bShowVh1 = this.updateView(vh2, (goRight ? this.viewIndex + 1 : this.viewIndex - 1))
			var v = this.findView(this.$.center);
			this.moveView(this.$.center, this.findView(vh1));
			this.moveView(vh1, this.findView(vh2));
			this.moveView(vh2, v);
			vh1.setShowing(bShowVh1);
			this.render();
			this.setIndexDirect(this._centerIndex);
		}
		this.doViewIndexChange({
			view: this._getCurrentViewName(),
			viewIndex: this.viewIndex
		});

	}
});
