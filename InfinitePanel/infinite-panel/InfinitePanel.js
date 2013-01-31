enyo.kind({
	name: "newnes.InfinitePanel",
	kind: "Panels",
	//classes: "enyo-fit",
	draggable: false,
	published: {
		defaultViewType: "",
		viewTypes: []
	},
	handlers: {
		onTransitionFinish: "transitionFinishHandler"
	},
	arrangerKind: "CardSlideInArranger",
	arrangerKindChanged: function(inOldValue) {
		if(this.arrangerKind !== "CardSlideInOutArranger" &&
		this.arrangerKind !== "PushPopArranger"	&&
		this.arrangerKind !== "CardSlideInArranger"	&&
		this.arrangerKind !== "CardArranger") {
			console.error("Allowed arrangers are CardSlideInOutArranger, PushPopArranger, CardSlideInArranger and CardArranger. Reverting to previous value.");
			this.arrangerKind = inOldValue;
		}
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		this.views = [];
		this.viewTypesChanged();
		this.reset();
	},
	viewTypesChanged: function(oldViewTypes) {
		if(!Array.isArray(this.viewTypes)) {
			console.error("View types must be an array!  Reverting to old view types.");
			this.viewTypes = oldViewTypes;
		}
	},
	push: function(viewTypeName, inParams) {

		var newView = this.createView(viewTypeName);
		if(inParams) {
			delete inParams.name;
			enyo.mixin(newView, inParams);
		}
		var createdView = this.createComponent(newView, {
			owner: this.owner
		});


		createdView.render();
		createdView.reflow();
		this.views.push(createdView);
		this.next();
		return newView;
	},
	pop: function() {
		var curViews = this.getViewList();
		if(curViews.length <= 1) {
			return false;
		}
		this._popSingleView(true);
		return true;
	},
	reset: function(viewTypeName) {
		this._popAll();
		var initialViewType = viewTypeName || this.defaultViewType;
		var newView = this.push(initialViewType);
		return newView;
	},
	getView: function() {
		return this.views[(this.getViewCount() - 1)];
	},
	getViewCount: function() {
		return this.getViewList().length;
	},
	getViewList: function() {
		return this.views;
	},
	createView: function(viewTypeName) {
		var viewType = this._getViewTypeByName(viewTypeName);
		var viewConfig;
		if(viewType) {
			viewConfig = enyo.clone(viewType);
			enyo.mixin(viewConfig, this.viewsProps);
		} else {
			viewConfig = this.inherited(arguments);
		}
		//ensure that the view name is unique
		viewConfig.name = this._generateUniqueViewName(viewConfig.name);

		return viewConfig;
	},
	deleteView: function(inView) {
		var newViewIndex;
		for(var i = (this.views.length - 1), view; view = this.views[i]; i--) {
			if(view.name == inView.name) {
				this.deleteViewByIndex(i);
				break;
			}
		}
	},
	deleteViewByIndex: function(inViewIndex) {
		this.views[inViewIndex].destroy();
		this.views.splice(inViewIndex, 1);
	},
	transitionFinishHandler: function(inSender, inEvent) {
		if(inSender === this && inEvent.toIndex < inEvent.fromIndex) {
			this.deleteViewByIndex(inEvent.fromIndex);
		}
	},
	_popAll: function() {
		this.setIndexDirect(0);
		var viewCount = this.getViewCount();
		for(var i = 0; i < viewCount; i += 1) {
			this._popSingleView();
		}
	},
	/*
	 * Pops a single view and destroys it.  A no-op if there are no views.
	 */
	_popSingleView: function(inAnimated) {
		if(this.getViewCount() === 0) {
			return;
		}
		var viewBeingPopped = this.getView();
		if(inAnimated) {
			this.previous();
		} else {
			this.deleteView(viewBeingPopped);
		}
	},
	_getViewTypeByName: function(viewTypeName) {
		var viewTypeToReturn;
		this.viewTypes.forEach(function(viewType) {
			if(!viewTypeToReturn && viewType.name === viewTypeName) {
				viewTypeToReturn = viewType;
			}
		});
		return viewTypeToReturn;
	},
	_generateUniqueViewName: (function() {
		var counter = 0;
		return function(baseViewName) {
			var viewName = "" + baseViewName + counter;
			counter += 1;
			return viewName;
		};
	})()
});