/*

 InfiniteSlidingView v 1.0
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
	name : "newness.InfiniteSlidingView",
	kind : "onyx.Slideable",
	value : 100,
	max : 100,
	unit : "%",
	pushed: true,
	draggable : true,
	classes : "newness-infinite-sliding-view onyx enyo-fit",
	rendered: function() {
		this.inherited(arguments);
		if(this.pushed && this.value !== this.min) {
			this.pushed = false;
			this.animateToMin();
		}
		
	},
	pop: function() {
		this.animateToMax();
	}
});
