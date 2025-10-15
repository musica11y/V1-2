import { Component, Property } from '@wonderlandengine/api';

/**
 * FinalFingerTest
 */
export class FinalFingerTest extends Component {
    static TypeName = 'FinalFingerTest';
    /* Properties that are configurable in the editor */
    static Properties = {
        param: Property.float(1.0)
    };

    start() {
        console.log('start() with param', this.param);
    }

    update(dt) {
        /* Called every frame. */
    }

    init() {
        // Called when the component is initialized
        this.collider = this.object.getComponent('collision');

        if (this.collider) {
            // Setup collision event listeners
            this.collider.on('collisionstart', this.onCollisionStart.bind(this));
            this.collider.on('collisionend', this.onCollisionEnd.bind(this));
        }
    }

    onCollisionStart(event) {
        console.log('Collision started with:', event.target.name);

        // Check if the collided object is the target
        if (event.target.name === this.targetObjectName) {
            console.log('Collided with target object!');

            // Change the color of the target object
            const mesh = event.target.getComponent('mesh');
            if (mesh) {
                const material = mesh.material;
                if (material) {
                    material.diffuseColor.set(this.newColor[0], this.newColor[1], this.newColor[2]);
                    material.update();
                }
            }
        }
    }

    onCollisionEnd(event) {
        console.log('Collision ended with:', event.target.name);
        // Optional: reset color or handle end of collision
    }
}
/*


WL.registerComponent('Rcollision-check', {
    targetObjectName: { type: WL.Type.String, default: '' },
    newColor: { type: WL.Type.FloatArray, default: [1.0, 0.0, 0.0] } // RGB color values
}, {
    init: function() {
        // Get the collision component attached to this object
        this.collider = this.object.getComponent('collision');

        if (this.collider) {
            // Set up collision event listeners
            this.collider.on('collisionstart', this.onCollisionStart.bind(this));
            this.collider.on('collisionend', this.onCollisionEnd.bind(this));
        }
    },

    onCollisionStart: function(event) {
        console.log('Collision started with:', event.target.name);

        // Check if the collided object is the target object
        if (event.target.name === this.targetObjectName) {
            console.log('Collided with target object!');

            // Change the color of the collided object
            const mesh = event.target.getComponent('mesh');
            if (mesh) {
                const material = mesh.material;
                if (material) {
                    // Change the color to the new color
                    material.diffuseColor.set(this.newColor[0], this.newColor[1], this.newColor[2]);
                    material.update(); // Apply the color change
                }
            }
        }
    },

    onCollisionEnd: function(event) {
        console.log('Collision ended with:', event.target.name);
        // Optionally, you can reset the color or perform other actions here
    }
});

*/