import {Component, Property} from '@wonderlandengine/api';
import { quat } from 'gl-matrix';

/**
 * Rotator
 */
export class RotateIt extends Component {
    static TypeName = 'RotateIt';
    /* Properties that are configurable in the editor */
    static Properties = {
        xSpeed: Property.float(.0),
        ySpeed: Property.float(.0),
        zSpeed: Property.float(.0)
    };

    start() {
        this.rotationQuat = quat.create(); 
    }

    update(dt) {
        quat.fromEuler(this.rotationQuat, this.xSpeed * dt, this.ySpeed * dt, this.zSpeed * dt);

        // Apply rotation directly to world space (avoids manual transform handling)
        this.object.rotateObject(this.rotationQuat);
    }
}
