import { Component, Property } from '@wonderlandengine/api';

import { MusicManagement } from './MusicManagement';

/**
 * UI_SimpleButton
 */
export class UISimpleButton extends Component {
	static TypeName = 'UI_SimpleButton';
	/* Properties that are configurable in the editor */
	static Properties = {
		ActionOnObject: Property.object(),
		ActionOnComponent: Property.string("None"),
		Action: Property.string("None"),
		DisableDuringTestPlay: Property.bool(false),
		usemouseup: Property.bool(false),
		UpAction: Property.string("None"),
		passSelfReference: Property.bool(false),
		TheHeldDurationType: Property.string("short"),
		playnoteonHoover: Property.bool(false),
		MusicMan: Property.object(),
	};

	start() {
		this.wasmouse = false;
		this.ourScale = this.object.getScalingLocal();
		const target = this.object.getComponent('cursor-target');
		target.addClickFunction(this.onClick.bind(this));
		target.addHoverFunction(this.onHooverMouse.bind(this));
		target.addUnHoverFunction(this.onUnHoover.bind(this));

		if (this.object.getComponent('mesh'))
			this.object.getComponent('mesh').material = this.object.getComponent('mesh').material.clone();

		if (this.usemouseup) {
			const target = this.object.getComponent('cursor-target');
			target.addDownFunction(this.onMouseDown.bind(this));
			document.documentElement.addEventListener('mouseup', this.onMouseUp.bind(this));
		}


		if (this.MusicMan != null) {
			const loadsave = this.MusicMan.getComponent('loadsave');
			if (loadsave && loadsave.SettingsWin) {
				this.settingsWindow = loadsave.SettingsWin;
				if (this.settingsWindow) {
					if (this.settingsWindow.type != 'SettingsWindow') {
						this.settingsWindow = this.settingsWindow.getComponent('SettingsWindow');
					}
					if (this.settingsWindow == null)
						console.log("Missing settings window");
				}
				else {
					console.log("NOOOOOOOO SETTINGS window");
				}
			}
			this.musicmanref = this.MusicMan.getComponent('MusicManagement');
		}

		if (this.DrumImage ==null && this.object.childrenCount > 1 && this.object.children[1].name=="Drum_Image") {
			this.DrumImage = this.object.children[1];
			if (this.DrumImage != null) {
				//let localpos=this.DrumImage.getPositionLocal();
				//localpos[2]=-0.002;
				//this.DrumImage.setPositionLocal(localpos);//getComponent('mesh').active=false;
				this.DrumImage.getComponent('mesh').active = false;
				//console.log("SET THE DRUM");
			}
		}
	}

	//mouse is up
	onMouseUp(event) {
		if (this.mousewasdown) {
			console.log("mouse is up");
			this.mousewasdown = false;


			//  this.ActionOnObject.getComponent(this.ActionOnComponent)."this.Action"();
			let methodName = this.UpAction; // The method name as a string
			let component = this.ActionOnObject.getComponent(this.ActionOnComponent); // Get the component

			if (component && typeof component[methodName] === 'function') {
				if (this.passSelfReference) {
					component[this.UpAction](this.object); // Dynamically call the method
				}
				else {
					component[this.UpAction](); // Dynamically call the method
				}
			} else {
				if (component == null)
					console.error("component not found ", this.ActionOnComponent);
				else
					console.error(`Method ${methodName} not found on the component.`);
			}
		}
	}

	onMouseDown(event) {
		//console.log("mouse is down");
		this.mousewasdown = true;

		//  this.ActionOnObject.getComponent(this.ActionOnComponent)."this.Action"();
		let methodName = this.Action; // The method name as a string
		let component = this.ActionOnObject.getComponent(this.ActionOnComponent); // Get the component

		if (component && typeof component[methodName] === 'function') {
			if (this.passSelfReference) {
				component[this.Action](this.object); // Dynamically call the method
			}
			else {
				component[this.Action](); // Dynamically call the method
			}
		} else {
			if (component == null)
				console.error("component not found ", this.ActionOnComponent);
			else
				console.error(`Method ${methodName} not found on the component.`);
		}
	}

	onHooverMouse() {
		this.wasmouse = true;
		this.onHoover();
		this.wasmouse = false;
	}
	//when mouse hooveed
	onHoover() {
		let cb = [0, 0, 0];
		cb[0] = this.ourScale[0] * 1.1;
		cb[1] = this.ourScale[1] * 1.1;
		cb[2] = this.ourScale[2] * 1.1;
		this.object.setScalingLocal(cb);


		if (this.playnoteonHoover && this.settingsWindow != null) {
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on))
			{
				this.onMouseDown(null);
			}
		}
	}

	//when mouses leaves
	onUnHoover() {
		this.object.setScalingLocal(this.ourScale);//[0.15,0.1,0.1]); // Revert to normal

		if (this.playnoteonHoover && this.settingsWindow != null) {
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on)) {
				this.musicmanref.SoundFontPlayer.stopnote();
			}
		}
	}

	//when the mouse has clicked
	onClick() {
		if (!this.usemouseup) {
			if (this.DisableDuringTestPlay && (MusicManagement.InTestMode || MusicManagement.InKeySelect))
				return;

			//  this.ActionOnObject.getComponent(this.ActionOnComponent)."this.Action"();
			let methodName = this.Action; // The method name as a string
			let component = this.ActionOnObject.getComponent(this.ActionOnComponent); // Get the component

			if (component && typeof component[methodName] === 'function') {
				if (this.passSelfReference) {
					component[this.Action](this.object); // Dynamically call the method
				}
				else {
					component[this.Action](); // Dynamically call the method
				}
			} else {
				if (component == null)
					console.error("component not found ", this.ActionOnComponent);
				else
					console.error(`Method ${methodName} not found on the component.`);
			}
		}
	}
}
