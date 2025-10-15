import {Component, Property} from '@wonderlandengine/api';
//import { vec3 } from 'gl-matrix';
import { vec3, quat, mat4 } from 'gl-matrix';


/**
 * SpringMovement
 */
export class SpringMovement extends Component {
    static TypeName = 'SpringMovement';
    /* Properties that are configurable in the editor */
    static Properties = {
        distance: Property.float(0.2),
        speedIn: Property.float(1),
        speedOut: Property.float(3),       
    };

    start() {
      
        this.objects = this.object.children; // Get all child objects
        this.sharedTimer = 0;
        this.sharedDirection = 1; // 1 = moving in, -1 = springing back

        // Store each object's original & target position
        this.data = this.objects.map(obj => {
            const originalPosition = vec3.clone(obj.getPositionLocal());
            const targetPosition = vec3.clone(originalPosition);

            // Determine local X-axis movement based on rotation
            const right = vec3.create();
            const rotationMatrix = mat4.create();
            mat4.fromQuat(rotationMatrix, obj.getRotationWorld());
            vec3.set(right, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]); // Local X direction
            vec3.scale(right, right, this.distance);
            vec3.add(targetPosition, originalPosition, right);

            return { obj, originalPosition, targetPosition };
        });
    }

    update(dt) {

        this.sharedTimer += dt * (this.sharedDirection === 1 ? this.speedIn : this.speedOut);
        const t = this.sharedDirection === 1 ? Math.min(this.sharedTimer, 1) : Math.max(1 - this.sharedTimer, 0);

        // Apply shared interpolation to all objects
        this.data.forEach(entry => {
            const currentPosition = vec3.create();
            vec3.lerp(currentPosition, entry.originalPosition, entry.targetPosition, t);
            entry.obj.setPositionLocal(currentPosition);
        });

 
        if (this.sharedTimer >= 1) {
            this.sharedTimer = 0;
            this.sharedDirection *= -1;
        }

    }
}
