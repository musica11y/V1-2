import { Component, Property } from '@wonderlandengine/api';

/**
 * SettingsWindow
 */
export class SettingsWindow extends Component {
	static TypeName = 'SettingsWindow';
	/* Properties that are configurable in the editor */
	static Properties = {
		//ScreenBlocker: Property.object(), // Assign the inpput blocker (optional)
		//ScreenFader: Property.object(), // Assign the screenfader (optional)
		SPanchorWindow: Property.object(),
		Musicman: Property.object(),
		BPMText: Property.object(),

		RayCastToggleOn: Property.object(),
		RayCastToggleOff: Property.object(),
		AutoplayToggleRayOn: Property.object(),
		AutoplayToggleRayOff: Property.object(),
		AutoplayToggleMouseOn: Property.object(),
		AutoplayToggleMouseOff: Property.object(),

		HooverShortText: Property.object(),
		HooverMediumText: Property.object(),
		HooverLongText: Property.object(),


		HeldTimeShort: Property.int(1),
		HeldTimeMedium: Property.int(2),
		HeldTimeLong: Property.int(3),
		UseEyeRaycast: Property.bool(true),
		UsePanelAutoPlayEye: Property.bool(true),
		UsePanelAutoPlayMouse: Property.bool(true),

		accesswindow: Property.object(),
		eyeraycastmachine: Property.object(),

		loadsave: Property.object(),
	};


	start() {
		
		this.loadsave = this.loadsave.getComponent('loadsave');
		

		this.PlayModeManager = this.Musicman.getComponent('MusicManagement').PlayModeManager.getComponent('PlayModeManager');
		//    console.log('start() with param', this.param);
		this._BPM_text = this.BPMText.getComponent('text');
		

		this._BPM_text.text = "" + String(this.Musicman.getComponent('MusicManagement').bpm);
		

		this.HooverShortText = this.HooverShortText.getComponent('text');
		this.shorttext = this.HooverShortText.text;
		

		this.HooverMediumText = this.HooverMediumText.getComponent('text');
		this.mediumtext = this.HooverMediumText.text;
		

		this.HooverLongText = this.HooverLongText.getComponent('text');
		this.longtext = this.HooverLongText.text;
		

		//todo should load in the values from a save
		this.raycaston = true;
		this.auto_ray_on = true;
		this.auto_mouse_on = true;
		this.update_values();
	}


	press_gazeicon_Larger()
	{
		const objref=this.eyeraycastmachine.children[0];
		if(objref)
		{
			let ourScale=objref.getScalingLocal();
			let cb = [0, 0, 0];
			cb[0] = ourScale[0] * 2;
			cb[1] = ourScale[1] * 2;
			cb[2] = ourScale[2] * 2;
			objref.setScalingLocal(cb);
		}
	}

	press_gazeicon_Smaller()
	{
		const objref=this.eyeraycastmachine.children[0];
		if(objref)
		{
			let ourScale=objref.getScalingLocal();
			let cb = [0, 0, 0];
			cb[0] = ourScale[0] * 0.5;
			cb[1] = ourScale[1] * 0.5;
			cb[2] = ourScale[2] * 0.5;
			objref.setScalingLocal(cb);
		}
	}


	MoveCameraDown() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[1]+=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[1]+=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}
	MoveCameraUp() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[1]-=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[1]-=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}



	MoveCameraLeft() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[0]+=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[0]+=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}
	MoveCameraRight() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[0]-=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[0]-=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}


	MoveCameraAway() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[2]+=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[2]+=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}
	MoveCameraTowards() {
		let oldplayerpos = this.PlayModeManager.PlayCameraRef.getTranslationWorld();
		oldplayerpos[2]-=0.04;
		this.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);

		let olddes=this.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
		olddes[2]-=0.04;
		this.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(olddes);
	}


	press_RayCastToggle() {
		this.raycaston = !this.raycaston;
		this.update_values();
		this.eyeraycastmachine.getComponent('EyeRayCast').set_active(this.raycaston);
	}

	press_AutoplayToggleRay() {
		this.auto_ray_on = !this.auto_ray_on;
		this.update_values();
	}

	press_AutoplayToggleMouse() {
		this.auto_mouse_on = !this.auto_mouse_on;
		this.update_values();
	}

	press_short_sub() {
		this.HeldTimeShort -= 0.5;
		if (this.HeldTimeShort < 0.5)
			this.HeldTimeShort = 0.5;
		this.update_values();
	}
	press_short_add() {
		this.HeldTimeShort += 0.5;
		if (this.HeldTimeShort > 5)
			this.HeldTimeShort = 5;
		this.update_values();
	}

	press_medium_sub() {
		this.HeldTimeMedium -= 0.5;
		if (this.HeldTimeMedium < 0.5)
			this.HeldTimeMedium = 0.5;
		this.update_values();
	}
	press_medium_add() {
		this.HeldTimeMedium += 0.5;
		if (this.HeldTimeMedium > 5)
			this.HeldTimeMedium = 5;
		this.update_values();
	}

	press_long_sub() {
		this.HeldTimeLong -= 0.5;
		if (this.HeldTimeLong < 0.5)
			this.HeldTimeLong = 0.5;
		this.update_values();
	}
	press_long_add() {
		this.HeldTimeLong += 0.5;
		if (this.HeldTimeLong > 5)
			this.HeldTimeLong = 5;
		this.update_values();
	}

	update_values() {
		///console.log("1");
		//this.RayCastToggleOn.getComponent('text').active = this.raycaston;
		if(this.raycaston)
			this.RayCastToggleOn.getComponent('text').text="RAYCAST: ON";
		else 
			this.RayCastToggleOn.getComponent('text').text="RAYCAST: OFF";
		//console.log("2");
		//this.RayCastToggleOff.getComponent('text').active = !this.raycaston;
		//console.log("3");

		//this.AutoplayToggleRayOn.getComponent('text').active = this.auto_ray_on;
		//console.log("4");
		//this.AutoplayToggleRayOff.getComponent('text').active = !this.auto_ray_on;
		//console.log("5");
		if(this.auto_ray_on)
			this.AutoplayToggleRayOn.getComponent('text').text="PANEL AUTOPLAY\nEYE Cast: ON";
		else 
			this.AutoplayToggleRayOn.getComponent('text').text="PANEL AUTOPLAY\nEYE Cast: OFF";

		//this.AutoplayToggleMouseOn.getComponent('text').active = this.auto_mouse_on;
		//this.AutoplayToggleMouseOff.getComponent('text').active = !this.auto_mouse_on;
		if(this.auto_mouse_on)
			this.AutoplayToggleMouseOn.getComponent('text').text="PANEL AUTOPLAY\nWith Mouse: ON";
		else
			this.AutoplayToggleMouseOn.getComponent('text').text="PANEL AUTOPLAY\nWith Mouse: OFF";
	//	console.log("6");

		this.HooverShortText.text = this.shorttext + this.HeldTimeShort;
		this.HooverMediumText.text = this.mediumtext + this.HeldTimeMedium;
		this.HooverLongText.text = this.longtext + this.HeldTimeLong;
	}

	OpenAccessSettingsWindow() {
		console.log("OPENING accessSETTINGS WINDOW");
		this.accesswindow.getComponent('ChildWindowExtension').enableme();
	}

	OpenSettingsWindow() {
		console.log("OPENING SETTINGS WINDOW");
		this.object.getComponent('ChildWindowExtension').enableme();
	}

	CloseSettingsWindow() {
		this.object.getComponent('ChildWindowExtension').disableme();
	}

	CloseAccessSettingsWindow() {
		this.accesswindow.getComponent('ChildWindowExtension').disableme();
		this.loadsave.doSaveSettings();
	}

	Spanchor_X_minus() {
		console.log("X -");
		this.SPanchorWindow.getComponent('generate-buttons').updateButtonCount(-1, 0);
	}
	Spanchor_X_add() {
		console.log("X +");
		this.SPanchorWindow.getComponent('generate-buttons').updateButtonCount(1, 0);
	}
	Spanchor_Y_minus() {
		console.log("Y -");
		this.SPanchorWindow.getComponent('generate-buttons').updateButtonCount(0, -1);
	}
	Spanchor_Y_add() {
		console.log("Y +");
		this.SPanchorWindow.getComponent('generate-buttons').updateButtonCount(0, 1);
	}

	Spanchor_BPM_add() {
		this.Musicman.getComponent('MusicManagement').bpm += 1;
		this._BPM_text.text = "" + String(this.Musicman.getComponent('MusicManagement').bpm);
	}

	Spanchor_BPM_minus() {
		if (this.Musicman.getComponent('MusicManagement').bpm > 2)
			this.Musicman.getComponent('MusicManagement').bpm -= 1;
		this._BPM_text.text = "" + String(this.Musicman.getComponent('MusicManagement').bpm);
	}

	Spanchor_BPM_add5() {
		this.Musicman.getComponent('MusicManagement').bpm += 5;
		this._BPM_text.text = "" + String(this.Musicman.getComponent('MusicManagement').bpm);
	}

	Spanchor_BPM_minus5() {
		if (this.Musicman.getComponent('MusicManagement').bpm > 5)
			this.Musicman.getComponent('MusicManagement').bpm -= 5;
		this._BPM_text.text = "" + String(this.Musicman.getComponent('MusicManagement').bpm);
	}


	getheldtime(whichtime) {
		if (whichtime == null)
			return this.HeldTimeShort;

		switch (whichtime.toLowerCase()) {
			case "short": return this.HeldTimeShort; break;
			case "medium": return this.HeldTimeMedium; break;
			case "long": return this.HeldTimeLong; break;
		}
		return this.HeldTimeShort;
	}
}
