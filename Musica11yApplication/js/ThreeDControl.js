import { Component, Property } from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';
import { quat } from 'gl-matrix';

/**
 * ThreeDControl
 */
export class ThreeDControl extends Component {
    static TypeName = 'ThreeDControl';
    /* Properties that are configurable in the editor */
    static Properties = {
        //PtrCurrentPanel: Property.object(),
    };

    start() {
        //console.log('start() with param', this.param);
        this.rotatingH = 0;
        this.rotatingV = 0;
        this.rotatingT = 0;
        this.rotationQuat = quat.create();
        this.movedelay = 0;
    }

    update(dt) {
        /* Called every frame. */
       /* if (this.moving == 1) {
            this._move_up(10);//dt);
             this.movedelay=1;
        }
        if (this.moving == 2) {
            this._move_up(-10);//-dt);
             this.movedelay=1;
        }*/

        if (this.movedelay < 1) {
            if (this.rotatingH != 0 || this.rotatingV != 0 || this.rotatingT != 0) {
              //  quat.fromEuler(this.rotationQuat, this.rotatingT * dt, this.rotatingV * dt, this.rotatingH * dt);
                quat.fromEuler(this.rotationQuat, this.rotatingT, this.rotatingV, this.rotatingH);
                this.PtrCurrentPanel.rotateObject(this.rotationQuat);
                 this.movedelay=1;
            }
        }
        else
        {
            this.movedelay+=dt;
            if(this.movedelay>1.5)
                this.movedelay=0;
        }
    }

    //todo set PtrCurrentPanel to middlePanel,leftPanel or rightPanel depending on active panel

    move_uploop_start() {
      //  this.movedelay = 0;
      //  this.moving = 1;      
    }
    move_uploop_end() {
        //this.movedelay = 0;
        //this.moving = 0;
        this._move_up(0.1);
    }
    move_downloop_start() {
       // this.movedelay = 0;
       // this.moving = 2;
    }
    move_downloop_end() {
        console.log("down");
       // this.movedelay = 0;
       // this.moving = 0;
       this._move_up(-0.1);
    }

    move_up() {
        this._move_up(0.1);
    }

    _move_up(speed) {
        let position = this.PtrCurrentPanel.getPositionLocal();
        position[1] += speed;
        this.PtrCurrentPanel.setPositionLocal(position);
    }

    move_down() {
        this._move_down(-0.1);
    }
    _move_down(speed) {
        let position = this.PtrCurrentPanel.getPositionLocal();
        position[1] -= speed;
        this.PtrCurrentPanel.setPositionLocal(position);
    }
    move_left() {
        let position = this.PtrCurrentPanel.getPositionLocal();
        let rotation = this.PtrCurrentPanel.getRotationLocal();

        let forward = [-1, 0, 0];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.PtrCurrentPanel.setPositionLocal(position);
    }
    move_right() {
        let position = this.PtrCurrentPanel.getPositionLocal();
        let rotation = this.PtrCurrentPanel.getRotationLocal();

        let forward = [1, 0, 0];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.PtrCurrentPanel.setPositionLocal(position);
    }
    move_towards() {
        let position = this.PtrCurrentPanel.getPositionLocal();
        let rotation = this.PtrCurrentPanel.getRotationLocal();

        let forward = [0, 0, 1];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.PtrCurrentPanel.setPositionLocal(position);
    }
    move_away() {
        let position = this.PtrCurrentPanel.getPositionLocal();
        let rotation = this.PtrCurrentPanel.getRotationLocal();

        let forward = [0, 0, -1];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.PtrCurrentPanel.setPositionLocal(position);
    }

    rotate_horz_anticlockwise_start() {
        //  console.log("Hantistart");
        this.rotatingH = 10;
        this.movedelay = 0;
    }
    rotate_horz_clockwise_start() {
        // console.log("Hclockstart");
        this.rotatingH = -10;
        this.movedelay = 0;
    }

    rotate_horz_anticlockwise_end() {
        //  console.log("Hantiend");
        this.rotatingH = 0;
        this.movedelay = 0;
    }
    rotate_horz_clockwise_end() {
        //  console.log("Hend");
        this.rotatingH = 0;
        this.movedelay = 0;
    }

    rotate_vert_anticlockwise_start() {
        //  console.log("vantistart");
        this.rotatingV = 10;
        this.movedelay = 0;
    }

    rotate_vert_clockwise_start() {
        //  console.log("vstart");
        this.rotatingV = -10;
        this.movedelay = 0;
    }
    rotate_vert_anticlockwise_end() {
        // console.log("vantiend");
        this.rotatingV = 0;
        this.movedelay = 0;
    }

    rotate_vert_clockwise_end() {
        // console.log("vend");
        this.rotatingV = 0;
        this.movedelay = 0;
    }

    rotate_vert_tiltaway_start() //added by damian
    {
        //console.log("tstart");
        this.rotatingT = -10;
        this.movedelay = 0;
    }
    rotate_vert_tiltaway_end() //added by damian
    {
        //console.log("tend");
        this.rotatingT = 0;
        this.movedelay = 0;
    }

    rotate_vert_tilttoward_start() //added by damian
    {
        //console.log("tstart");
        this.rotatingT = 10;
        this.movedelay = 0;
    }
    rotate_vert_tilttoward_end() //added by damian
    {
        //console.log("tend");
        this.rotatingT = 0;
        this.movedelay = 0;
    }

    scale_bigger() {
        this.ourScale = this.PtrCurrentPanel.getScalingLocal();
        let cb = [0, 0, 0];
        cb[0] = this.ourScale[0] * 1.1;
        cb[1] = this.ourScale[1] * 1.1;
        cb[2] = this.ourScale[2] * 1.1;
        this.PtrCurrentPanel.setScalingLocal(cb);
    }
    scale_smaller() {
        this.ourScale = this.PtrCurrentPanel.getScalingLocal();
        let cb = [0, 0, 0];
        cb[0] = this.ourScale[0] * 0.9;
        cb[1] = this.ourScale[1] * 0.9;
        cb[2] = this.ourScale[2] * 0.9;
        this.PtrCurrentPanel.setScalingLocal(cb);
    }

    toggle_visible_background()
    {
      let m=this.PtrCurrentPanel.getComponent('mesh');
      if(m) m.active=!m.active;
    }
}
