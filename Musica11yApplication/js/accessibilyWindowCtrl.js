import {Component, Property} from '@wonderlandengine/api';

/**
 * accessibilyWindowCtrl
 */
export class AccessibilyWindowCtrl extends Component {
    static TypeName = 'accessibilyWindowCtrl';
    /* Properties that are configurable in the editor */
    static Properties = {
			EyeRayCastlnk: Property.object(),
            ToggleRayImageOn: Property.object(),
			ToggleRayImageOff: Property.object(),
			SettingsWindowlnk: Property.object()
    };

    start() {
     //   console.log('start() with param', this.param);
	 
		let ison=this.EyeRayCastlnk.getComponent('EyeRayCast').settings.weareactive;
		this.ToggleRayImageOn.getComponent('mesh').active=ison;
		this.ToggleRayImageOff.getComponent('mesh').active=!ison;
    }

	ToggleRay(){
		console.log('tog');
		let sison=!this.EyeRayCastlnk.getComponent('EyeRayCast').settings.weareactive;
		this.EyeRayCastlnk.getComponent('EyeRayCast'). set_active(sison);
		let ison=this.EyeRayCastlnk.getComponent('EyeRayCast').settings.weareactive;
		this.ToggleRayImageOn.getComponent('mesh').active=ison;
		this.ToggleRayImageOff.getComponent('mesh').active=!ison;
	}
	
	SetRaySmall(){
			console.log('ssmall');
		//press_gazeicon_Smaller
		const objref=this.SettingsWindowlnk.getComponent('SettingsWindow').eyeraycastmachine.children[0];
		if(objref)
		{
			let ourScale=objref.getScalingLocal();
			let cb = [0, 0, 0];
			cb[0] = 1;//ourScale[0] * 0.5;
			cb[1] = 1;//ourScale[1] * 0.5;
			cb[2] = 1;//ourScale[2] * 0.5;
			objref.setScalingLocal(cb);
		}
	}
   SetRayMedium(){
			console.log('smedium');
			const objref=this.SettingsWindowlnk.getComponent('SettingsWindow').eyeraycastmachine.children[0];
		if(objref)
		{
			let ourScale=objref.getScalingLocal();
			let cb = [0, 0, 0];
			cb[0] = 1.5;//ourScale[0] * 0.5;
			cb[1] = 1.5;//ourScale[1] * 0.5;
			cb[2] = 1.5;//ourScale[2] * 0.5;
			objref.setScalingLocal(cb);
		}
	}
	SetRayLarge(){
			console.log('slarge');
		const objref=this.SettingsWindowlnk.getComponent('SettingsWindow').eyeraycastmachine.children[0];
		if(objref)
		{
			let ourScale=objref.getScalingLocal();
			let cb = [0, 0, 0];
			cb[0] = 3;//ourScale[0] * 0.5;
			cb[1] = 3;//ourScale[1] * 0.5;
			cb[2] = 3;//ourScale[2] * 0.5;
			objref.setScalingLocal(cb);
		}
	}
	
	SetRayHover1(){
			console.log('1delay');
		//	press_medium_sub press_short_add
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeShort=1;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeMedium=2;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeLong=3;
	}
	SetRayHover2(){
			console.log('2delay');
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeShort=1+1;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeMedium=2+1;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeLong=3+1;
	}
	SetRayHover3(){
			console.log('3delay');
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeShort=1+2;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeMedium=2+2;
		this.SettingsWindowlnk.getComponent('SettingsWindow').HeldTimeLong=3+2;
	}
}
