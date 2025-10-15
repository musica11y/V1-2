import { Component, Property } from '@wonderlandengine/api';

/**
 * VrFingerCollisionDetection
 */
export class VrFingerCollisionDetection extends Component {
    static TypeName = 'VrFingerCollisionDetection';
    /* Properties that are configurable in the editor */
    static Properties = {
        // matStart: Property.material(),
        // matCollision: Property.material()
        JustHoover: Property.bool(false),
        debugtext: Property.object(),
    };

    start() {
        // this.debugtext = this.debugtext.getComponent('text');
       
        this.collision = this.object.getComponent('collision');
        // this.objects = [];
        this.uibuttons = [];
        this.uisimplebuttons = [];

        this.lastCollisionTime = 0;
        this.collisionCooldown = 1000; // ms delay

    }

    update(dt) {
        /* Called every frame. */

        //const collision = object.getComponent('collision');
        const overlaps = this.collision.queryOverlaps();
        const currentTime = Date.now();

        // this.debugtext.text=overlaps.length;

        if (currentTime - this.lastCollisionTime > this.collisionCooldown)
            for (let i = 0; i < overlaps.length; ++i) {

                let uiButton = overlaps[i].object.getComponent('UI_Button');
                if (uiButton && !this.uibuttons.includes(overlaps[i].object)) {
                    if (this.JustHoover) {
                        uiButton.onHoover();
                    }
                    else {
                        uiButton.onClick();
                    }
                    this.uibuttons.push(overlaps[i].object);
                    this.lastCollisionTime = currentTime;
                }
                let uisimplebutton = overlaps[i].object.getComponent('UI_SimpleButton');
                if (uisimplebutton && !this.uisimplebuttons.includes(overlaps[i].object)) {
                    if (this.JustHoover) {
                        uisimplebutton.onHoover();
                    }
                    else {
                        uisimplebutton.onClick();
                    }
                    this.uisimplebuttons.push(overlaps[i].object);
                    this.lastCollisionTime = currentTime;
                }
            }
        if (overlaps.length < 2) {//it always overlaps its own tip!
            if (this.uibuttons.length > 0) {
                for (var i1 = 0; i1 < this.uibuttons.length; i1++) {
                    if (this.JustHoover)
                        this.uibuttons[i1].getComponent('UI_Button').onUnHoover();
                }
                this.uibuttons = [];
            }
            if (this.uisimplebuttons.length > 0) {
                for (var i2 = 0; i2 < this.uisimplebuttons.length; i2++) {
                    if (this.JustHoover)
                        this.uisimplebuttons[i2].getComponent('UI_SimpleButton').onUnHoover();
                }
                this.uisimplebuttons = [];
            }
        }
    }
}
