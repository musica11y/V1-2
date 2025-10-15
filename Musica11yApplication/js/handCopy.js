import {Component, Property} from '@wonderlandengine/api';

import { quat } from 'gl-matrix';

/**
 * handCopy
 */
export class HandCopy extends Component {
    static TypeName = 'handCopy';
    /* Properties that are configurable in the editor */
    static Properties = {       
        sourceWrist: Property.object(),
        targetWrist: Property.object(),

        sourceBone_t1: Property.object(),
        targetBone_t1: Property.object(),
        sourceBone_t2: Property.object(),
        targetBone_t2: Property.object(),
        sourceBone_t3: Property.object(),
        targetBone_t3: Property.object(),
        debugtext: Property.object(),

    };

/*
static Properties = {
    names: { type: Properties.Array, elementType: Properties.String },
    values: { type: Properties.Array, elementType: Properties.Int }
};

*/

    start() {
         this.debugtext=this.debugtext.getComponent('text');
      //  this.debugtext.text="ok";

    /*    this.bonePairs = [
            { source: this.sourceBone_t1, target: this.targetBone_t1 },
            { source: this.sourceBone_t2, target: this.targetBone_t2 },
            { source: this.sourceBone_t3, target: this.targetBone_t3 },
        ];
*/
    }

    //src X = Z dest, Src Y is X dest, Src Z is Y dest
    quaternionToEuler(q) {
        let x = Math.atan2(2 * (q[3] * q[0] + q[1] * q[2]), 1 - 2 * (q[0] * q[0] + q[1] * q[1]));
        let y = Math.asin(2 * (q[3] * q[1] - q[2] * q[0]));
        let z = Math.atan2(2 * (q[3] * q[2] + q[0] * q[1]), 1 - 2 * (q[1] * q[1] + q[2] * q[2]));
        return [x, y, z];
    }
    

    //dest X is twist Y tilt and Z up down
    //source X is updown  Y twst Z is tile
    update(dt) {
        /* Called every frame. */
        /*for (const pair of this.bonePairs) {
            if (pair.source && pair.target) {
                pair.target.transformLocal.set(pair.source.transformLocal);
            }
        }*/
       //but.setPositionLocal(topLeftLocal);//center of panel

       this.targetWrist.setPositionWorld(this.sourceWrist.getPositionWorld());

//       this.targetBone_t1.setRotationLocal(this.sourceBone_t1.getRotationLocal());
//       this.targetBone_t2.setRotationLocal(this.sourceBone_t2.getRotationLocal());
//       this.targetBone_t3.setRotationLocal(this.sourceBone_t3.getRotationLocal());


       let originalRotation = this.sourceBone_t1.getRotationLocal();
       let eulerAngles = this.quaternionToEuler(originalRotation);
       quat.fromEuler(originalRotation, eulerAngles[1], eulerAngles[2], eulerAngles[0]);
       this.targetBone_t1.setRotationLocal(originalRotation);

         //source X is updown  Y twst Z is tile
 
       //destination
       //[0] twist
       //[1] lr
       //[2] ud

       // Pre-adjust axes: X → Z, Y → X, Z → Y
//       let adjustedRotation = quat.fromValues(originalRotation[2], originalRotation[0], originalRotation[1], originalRotation[3]);
  //     this.targetBone_t1.transformLocal.rotation.set(adjustedRotation);

      


       this.debugtext.text=this.sourceBone_t2.getRotationLocal()[2].toString();
    }
}
