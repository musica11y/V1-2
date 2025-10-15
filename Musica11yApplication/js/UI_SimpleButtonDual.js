import {Component, Property} from '@wonderlandengine/api';

import { MusicManagement } from './MusicManagement';

/**
 * UI_SimpleButton
 */
export class UISimpleButtonDual extends Component {
    static TypeName = 'UI_SimpleButtonDual';
    /* Properties that are configurable in the editor */
    static Properties = {
		ActionOnObject: Property.object(),
		ActionOnComponent: Property.string("None"),
		Action: Property.string("None"),
		ActionOnObject2: Property.object(),
		ActionOnComponent2: Property.string("None"),
		Action2: Property.string("None"),
		DisableDuringTestPlay: Property.bool(false),
    };

	start()
	{
		this.ourScale = this.object.getScalingLocal();
		const target = this.object.getComponent('cursor-target');
		target.addClickFunction(this.onClick.bind(this));
		target.addHoverFunction(this.onHoover.bind(this));
		target.addUnHoverFunction(this.onUnHoover.bind(this));

		this.object.getComponent('mesh').material = this.object.getComponent('mesh').material.clone();
	}

	//when mouse hooveed
	onHoover() {
		let cb = [0, 0, 0];
		cb[0] = this.ourScale[0] * 1.1;
		cb[1] = this.ourScale[1] * 1.1;
		cb[2] = this.ourScale[2] * 1.1;
		this.object.setScalingLocal(cb);
	}

	//when mouses leaves
	onUnHoover() {
		this.object.setScalingLocal(this.ourScale);//[0.15,0.1,0.1]); // Revert to normal
	}

    //when the mouse has clicked
	onClick()
	{
		if (this.DisableDuringTestPlay &&(MusicManagement.InTestMode || MusicManagement.InKeySelect))
			return;

      //  this.ActionOnObject.getComponent(this.ActionOnComponent)."this.Action"();
	  let methodName = this.Action; // The method name as a string
	  let component = this.ActionOnObject.getComponent(this.ActionOnComponent); // Get the component

		if (component && typeof component[methodName] === 'function') {
			component[this.Action](); // Dynamically call the method
		} else {
			if (component==null)
				console.error("component not found ",this.ActionOnComponent);
			else
				console.error(`Method ${methodName} not found on the component.`);
		}

		let methodName2 = this.Action2; // The method name as a string
		let component2 = this.ActionOnObject2.getComponent(this.ActionOnComponent2); // Get the component
  
		  if (component2 && typeof component2[methodName2] === 'function') {
			  component2[this.Action2](); // Dynamically call the method
		  } else {
			  if (component2==null)
				  console.error("component not found ",this.ActionOnComponent2);
			  else
				  console.error(`Method ${methodName2} not found on the component.`);
		  }
	}
}
