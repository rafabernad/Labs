/*

 InfiniteSlidingPane v 1.0
 Copyright 2012 Rafael Bernad de Castro

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

enyo.kind({
	name : "newness.InfiniteSlidingPane",
	classes : "onyx enyo-fit",
	style: "overflow: hidden;",
	published : {
		defaultViewType : "",
		viewTypes : [],
	},
	viewsProps: {
		onAnimateFinish: "viewAnimateFinish"
	},
	create : function() {
		this.inherited(arguments);
		this.views = [];
		this.viewTypesChanged();
		var that = this;
		setTimeout(function() {
			that.reset(undefined, true);
		}, 10);
	},
	viewTypesChanged : function(oldViewTypes) {
		if(!Array.isArray(this.viewTypes)) {
			this.error("View types must be an array!  Reverting to old view types.");
			this.viewTypes = oldViewTypes;
		}
	},
	push: function(viewTypeName) {
		var newView = this.createView(viewTypeName);
		
		var createdView = this.createComponent(newView, {owner: this});
		createdView.render();
		this.views.push(createdView);
		this.viewsHaveChanged();
		
		return newView;
	},
	pop: function () {
		var curViews = this.getViewList();
		if (curViews.length <= 1) {
			return false;
		}
		this.popping = true;
		this.view = this.views[(this.views.length - 2)];
		this._popSingleView();
		
		this.viewsHaveChanged();
		
		return true;
	},
	reset : function(viewTypeName) {
		this._popAll();

		var initialViewType = viewTypeName || this.defaultViewType;
		var newView = this.push(initialViewType);
		newView.value = 0;
		this.viewsHaveChanged();
		
		return newView;
	},
	getView : function() {
		return this.views[((this.popping)? (this.getViewCount() - 2) : (this.getViewCount() - 1))];
	},
	getViewCount : function() {
		return this.getViewList().length;
	},
	getViewList : function() {
		return this.views;
	},
	viewsHaveChanged: function () {
		
		this.views.forEach(function (view, index) {
			view.index = index;
		});
		var prevView = this.views.length -3;
		if(this.views[prevView])this.views[prevView].hide();
		if(this.views[prevView+1])this.views[prevView+1].show();
	},
	viewAnimateFinish: function(inSender, inEvent) {
		var deletableView = null
		this.views.forEach(function (view, index) {
			if(view.name === inSender.name) {
				view.value = inSender.value;
				if(view.value ==100) deletableView = view;
				return;
			}
		});
		if(deletableView) this.deleteView(deletableView);
		this.popping = false;
		
	},
	createView : function(viewTypeName) {
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
		if(this.views.length === 0) {
			viewConfig.value = 0;
			viewConfig.draggable = false;
		}
		return viewConfig;
	},
	deleteView: function(inView) {
		var newViewIndex;
		for(var i = (this.views.length - 1), view; view = this.views[i]; i--) {
			if(view.name == inView.name) {
				this.views[i].destroy();
				this.views.splice(i,1);
				this.viewsHaveChanged();
				break;
			}
		}
		
		
	},
	_popAll : function() {
		var viewCount = this.getViewCount();
		for(var i = 0; i < viewCount; i += 1) {
			this._popSingleView();
		}
	},
	/*
	 * Pops a single view and destroys it.  A no-op if there are no views.
	 */
	_popSingleView : function() {
		if(this.getViewCount() === 0) {
			return;
		}
		var viewBeingPopped = this.getView();
		console.log("Popping")
		this.deleteView(viewBeingPopped);
	},
	_getViewTypeByName : function(viewTypeName) {
		var viewTypeToReturn;
		this.viewTypes.forEach(function(viewType) {
			console.log(viewType.name, viewTypeName, viewType)
			if(!viewTypeToReturn && viewType.name === viewTypeName) {
				viewTypeToReturn = viewType;
			}
		});
		return viewTypeToReturn;
	},
	_generateUniqueViewName : (function() {
		var counter = 0;
		return function(baseViewName) {
			var viewName = "" + baseViewName + counter;
			counter += 1;
			return viewName;
		};
	})(),
});