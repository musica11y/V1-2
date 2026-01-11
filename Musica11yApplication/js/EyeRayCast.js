import { Component, Property } from '@wonderlandengine/api';


/**
 * EyeRayCast
 */
export class EyeRayCast extends Component {
  static TypeName = 'EyeRayCast';
  /* Properties that are configurable in the editor */
  static Properties = {
    EyeMarker: Property.object(),
    debugtext: Property.object(),
    ProgressTimerMarker: Property.object(),
    OverAButtonMaterial: Property.material(),
    settings: Property.object(),
    background: Property.object(),
    Debugtext: Property.object(),
  };

  start() {

   // this.set_active(false);

    this.ourScale = this.ProgressTimerMarker.getScalingLocal();

    this.debugtext = this.debugtext.getComponent('text');
    // this.debugtext.text = "ok8";


    this.settings = this.settings.getComponent('SettingsWindow');

    this.defaultmaterial = this.EyeMarker.getComponent('mesh').material;

    this.overSimpleButton = null;
    this.overButton = null;
    this.heldtimeMax = 0;
    this.currentTime = 0;
    this.clicked = false;
  }


  set_active(on) {
    
    this.Debugtext.getComponent('text').text = "seteyeactive  "+ on;

    if (on) {
      if (!this.settings.raycaston)
        return;
    }
    this.weareactive = on;
    this.EyeMarker.getComponent('mesh').active = on;
    this.ProgressTimerMarker.getComponent('mesh').active = on;
    this.background.getComponent('mesh').active = on;
  }


  updatering() {
    if (this.currentTime >= this.heldtimeMax) {
      this.currentTime = this.heldtimeMax;
      if (this.clicked == false) {

        if (this.overButton != null) {
          // this.overButton.onClick();
          // this.debugtext.text = "pop";
          let tmp = this.overButton.getComponent('UI_SimpleButton');
          if (tmp != null) {
            if (this.overButton.getComponent('UI_SimpleButton').usemouseup) {
                if(this.releaseneeded)
                  this.releaseneeded.onMouseUp(null);
                this.releaseneeded=this.overButton.getComponent('UI_SimpleButton');
                this.overButton.getComponent('UI_SimpleButton').onMouseDown(null);
            }
            else {
              this.overButton.getComponent('UI_SimpleButton').onClick();
            }
          }
          let tmp2 = this.overButton.getComponent('UI_Button');
          if (tmp2 != null)
            this.overButton.getComponent('UI_Button').onClick();
        }
        this.clicked = true;
      }
    }
    let scaleFactor = 1 + (this.currentTime / this.heldtimeMax);

    let cb = [0, 0, 0];
    cb[0] = this.ourScale[0] * scaleFactor;
    cb[1] = this.ourScale[1] * scaleFactor;
    cb[2] = this.ourScale[2] * scaleFactor;
    this.ProgressTimerMarker.setScalingLocal(cb);

  }

  update(dt) {

    if (this.weareactive != true)
    {
   //   this.Debugtext.getComponent('text').text = "NOACTIVE";
     // return;
    }
    //raycast to the scene

    let _origin = this.object.getPositionWorld();
    let forwardWorld = new Float32Array(3);
    this.object.getForwardWorld(forwardWorld);
    // const _collisionMask = 1 << 0 | 1 << 4;

    const rayHit = this.engine.scene.rayCast(
      _origin,
      forwardWorld,
      1 << 0 | 1 << 4, // Only check against components in groups 0 and 4
      2500);

    // const rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(this._origin, this._direction, this._collisionMask) : this.engine.physics.rayCast(this._origin, this._direction, this._collisionMask, this.maxDistance);

this.Debugtext.getComponent('text').text = "hit "+ rayHit.hitCount;

    if (rayHit.hitCount > 0) {
      this.EyeMarker.setPositionWorld(rayHit.locations[0]);
      //change colour
      this.EyeMarker.getComponent('mesh').material = this.OverAButtonMaterial;



      let obj = rayHit.objects[0];
      // let uisimplebutton = obj.getComponent('UI_SimpleButton');
      // let uiButton = obj.getComponent('UI_Button');

      if (this.overButton != null && this.overButton != obj) {
        this.overButton.getComponent('UI_SimpleButton')?.onUnHoover();
        this.overButton.getComponent('UI_Button')?.onUnHoover();
        this.overButton = null;

        if(this.releaseneeded)
                  this.releaseneeded.onMouseUp(null);
        this.releaseneeded=null;
      }

      if (obj != null && this.overButton != obj) {
        this.overButton = obj;
        this.overButton.getComponent('UI_SimpleButton')?.onHoover();
        this.overButton.getComponent('UI_Button')?.onHoover();

        if(this.releaseneeded)
                  this.releaseneeded.onMouseUp(null);
        this.releaseneeded=null;


        // let tmp = 0;
        let tmp = this.overButton.getComponent('UI_SimpleButton');
        if (tmp != null)
          this.heldtimeMax = this.settings.getheldtime(this.overButton.getComponent('UI_SimpleButton').TheHeldDurationType);
        let tmp2 = this.overButton.getComponent('UI_Button');
        if (tmp2 != null)
          this.heldtimeMax = this.settings.getheldtime(this.overButton.getComponent('UI_Button').TheHeldDurationType);
        // this.heldtimeMax += this.settings.getheldtime(this.overButton.HeldDurationType);
        this.currentTime = 0;
        this.clicked = false;
      }


      this.currentTime += dt;
      //   if (this.clicked == false)
      //     this.debugtext.text = this.currentTime;
      this.updatering();
    }
    else {
      this.EyeMarker.getComponent('mesh').material = this.defaultmaterial;


      if (this.overButton != null) {
        this.overButton.getComponent('UI_SimpleButton')?.onUnHoover();
        this.overButton.getComponent('UI_Button')?.onUnHoover();
        this.overButton = null;

        if(this.releaseneeded)
                  this.releaseneeded.onMouseUp(null);
        this.releaseneeded=null;

      }


      this.currentTime = 0;
      this.updatering();
    }
  }
}
