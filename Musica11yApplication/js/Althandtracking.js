/*var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};*/
import { Component, MeshComponent, Property } from '@wonderlandengine/api';
//import { property } from '@wonderlandengine/api/decorators.js';
import { mat4, mat3, vec3, quat } from 'gl-matrix';
//import { setXRRigidTransformLocal } from './utils/webxr.js';
import { setXRRigidTransformLocal } from '@wonderlandengine/components/dist/utils/webxr.js';
//C:\Users\pc\Documents\GitHub\Musica11y\Musica11yApplication\node_modules\@wonderlandengine\components\dist\utils

const ORDERED_JOINTS = [
    'wrist',//0
    'thumb-metacarpal',//1
    'thumb-phalanx-proximal',//2
    'thumb-phalanx-distal',//3
    'thumb-tip',//4
    'index-finger-metacarpal',//5
    'index-finger-phalanx-proximal',//6
    'index-finger-phalanx-intermediate',//7
    'index-finger-phalanx-distal',//8
    'index-finger-tip',//9
    'middle-finger-metacarpal',//10
    'middle-finger-phalanx-proximal',//11
    'middle-finger-phalanx-intermediate',//12
    'middle-finger-phalanx-distal',//13
    'middle-finger-tip',//14
    'ring-finger-metacarpal',//15
    'ring-finger-phalanx-proximal',//16
    'ring-finger-phalanx-intermediate',//17
    'ring-finger-phalanx-distal',//18
    'ring-finger-tip',//19
    'pinky-finger-metacarpal',//20
    'pinky-finger-phalanx-proximal',//21
    'pinky-finger-phalanx-intermediate',//22
    'pinky-finger-phalanx-distal',//23
    'pinky-finger-tip',//24
];
const invTranslation = vec3.create();
const invRotation = quat.create();
const tempVec0 = vec3.create();
const tempVec1 = vec3.create();
/**
 * Easy hand tracking through the WebXR Device API
 * ["Hand Input" API](https://immersive-web.github.io/webxr-hand-input/).
 *
 * Allows displaying hands either as sphere-joints or skinned mesh.
 *
 * To react to grabbing, use `this.isGrabbing()`. For other gestures, refer
 * to `this.joints` - an array of [Object3D](/jsapi/object3d) and use the joint
 * indices listed [in the WebXR Hand Input specification](https://immersive-web.github.io/webxr-hand-input/#skeleton-joints-section).
 *
 * It is often desired to use either hand tracking or controllers, not both.
 * This component provides `deactivateChildrenWithoutPose` to hide the hand
 * tracking visualization if no pose is available and `controllerToDeactivate`
 * for disabling another object once a hand tracking pose *is* available.
 * Outside of XR sessions, tracking or controllers are neither enabled nor disabled
 * to play well with the [vr-mode-active-switch](#vr-mode-active-switch) component.
 *
 * **Requirements:**
 *  - To use hand-tracking, enable "joint tracking" in `chrome://flags` on
 *    Oculus Browser for Oculus Quest/Oculus Quest 2.
 *
 * See [Hand Tracking Example](/showcase/hand-tracking).
 */
export class AltHandTracking extends Component {
    static TypeName = 'Althand-tracking';

    static Properties = {

        handedness: Property.enum(['left', 'right']),
        jointMesh: Property.mesh(),
        jointMaterial: Property.material(),
        handSkin: Property.skin(),
        deactivateChildrenWithoutPose: Property.bool(true),
        controllerToDeactivate: Property.object(),
        RightHandrtWrist: Property.object(),
        RightHandrtIndexBase: Property.object(),
        RightHandrtMiddleBase: Property.object(),
        RightHandrtRingBase: Property.object(),
        RightHandrtLittleBase: Property.object(),

        RightHandrtIndexMid: Property.object(),
        RightHandrtMiddleMid: Property.object(),
        RightHandrtRingMid: Property.object(),
        RightHandrtLittleMid: Property.object(),

        RightHandrtIndexTip: Property.object(),
        RightHandrtMiddleTip: Property.object(),
        RightHandrtRingTip: Property.object(),
        RightHandrtLittleTip: Property.object(),

        RightHandrtThumbBase: Property.object(),
        RightHandrtThumbMid: Property.object(),
        RightHandrtThumbTip: Property.object(),

        SpawnJointsIfNoSkin: Property.bool(true),

        CopyHandrtIndexBase: Property.object(),
        CopyHandrtMiddleBase: Property.object(),
        CopyHandrtRingBase: Property.object(),
        CopyHandrtLittleBase: Property.object(),

        CopyHandrtIndexMid: Property.object(),
        CopyHandrtMiddleMid: Property.object(),
        CopyHandrtRingMid: Property.object(),
        CopyHandrtLittleMid: Property.object(),

        CopyHandrtIndexTip: Property.object(),
        CopyHandrtMiddleTip: Property.object(),
        CopyHandrtRingTip: Property.object(),
        CopyHandrtLittleTip: Property.object(),
        CopyHandrtThumbBase: Property.object(),
        CopyHandrtThumbMid: Property.object(),
        CopyHandrtThumbTip: Property.object(),

        HideFingerCubes: Property.bool(false),
        HandRenderer: Property.object(),
		   Debugtxt: Property.object(),
    };

    /** Handedness determining whether to receive tracking input from right or left hand */
    handedness = 0;
    /** (optional) Mesh to use to visualize joints */
    jointMesh = null;
    /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
    jointMaterial = null;
    /** (optional) Skin to apply tracked joint poses to. If not present,
     * joint spheres will be used for display instead. */
    handSkin = null;
    /** Deactivate children if no pose was tracked */
    deactivateChildrenWithoutPose = true;
    /** Controller objects to activate including children if no pose is available */
    controllerToDeactivate = null;
    init() {
        this.handedness = ['left', 'right'][this.handedness];

    }
    joints = {};
    session = null;
    /* Whether last update had a hand pose */
    hasPose = false;
    _childrenActive = true;



    //translates form the VR joint to the Joint on the screen
    updateJoint(jointnumber, Targetfingerref, inputSource, invRotation) {
        const jointName = ORDERED_JOINTS[jointnumber];
        const joint = this.joints[jointName];
        if (!joint)
            return;
        let jointPose = null;
        const jointSpace = inputSource.hand.get(jointName);
        //   const jointSpace = inputSource.hand.get('intermediate-finger-phalanx-distal');
        if (jointSpace) {
            let jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
            if (jointPose) {
                Targetfingerref.setRotationLocal(invRotation);//this works to remove the parent rotation



                //  const rotationMatrix = mat3.create();
                //  mat3.fromQuat(rotationMatrix, jointPose.transform.orientation);

                //  const q = quat.create();
                //   quat.fromMat3(q, rotationMatrix);


                //if this fails 1: Check the demo of non-hands-skin
                //and also check if we can add an offset to the original code

                // Step 1: Get the current quaternion rotation
                const originalQuat = jointPose.transform.orientation;

                // Step 2: Swap Y and Z components
                const swappedQuat = quat.clone(originalQuat);
                const tempY = swappedQuat[1]; // Store Y
                swappedQuat[1] = swappedQuat[2]; // Set Y to Z
                swappedQuat[2] = tempY; // Set Z to stored Y

                // Step 3: Apply the modified quaternion
                quat.normalize(swappedQuat, swappedQuat); // Ensure normalization
                //object.setTransformLocal(swappedQuat);

                //ok   const rotationMatrix = mat3.create(); // Your rotation matrix
                //ok    mat3.fromQuat(rotationMatrix,jointPose.transform.orientation);
                //ok    const eulerAngles = vec3.create();

                //ok  eulerAngles[0] = Math.atan2(rotationMatrix[7], rotationMatrix[8]); // Roll
                //ok eulerAngles[1] = Math.asin(-rotationMatrix[6]); // Pitch
                //ok    eulerAngles[2] = Math.atan2(rotationMatrix[3], rotationMatrix[0]); // Yaw

                /*
                const radToDeg = 180 / Math.PI;
                eulerAngles[0] *= radToDeg;
                eulerAngles[1] *= radToDeg;
                eulerAngles[2] *= radToDeg;
                
                quat.normalize(quaternion, quaternion);
                
                 */

                //ok  const quaternion = quat.create();
                //ok   quat.fromEuler(quaternion, eulerAngles[0], eulerAngles[1], eulerAngles[2]);

                // console.log(quaternion); // [qx, qy, qz, qw]

                //   const matrix = mat4.create();
                //   mat4.fromQuat(matrix, jointPose.transform.orientation);
                //     const eulerAngles = vec3.create();
                // mat4.getRotation(eulerAngles, matrix);

                //      mat3.fromQuat(eulerAngles,jointPose.transform.orientation);
                // let e=eulerAngles.fromQuaternion(jointPose.transform.orientation);
                //console.log(eulerAngles); // [x, y, z] in degrees
                //    let q=quaternion.fromEuler(e);

                //   const r = [0, 0, 0]; // Angles in degrees
                //     const q= quat.create();
                //quat.fromEuler(q, eulerAngles[0], eulerAngles[1], eulerAngles[2]);

                //new quat().fromMat3(q, eulerAngles[0], eulerAngles[1], eulerAngles[2]);
                Targetfingerref.rotateObject([
                    swappedQuat.x,//jointPose.transform.orientation.x,
                    swappedQuat.y,//.transform.orientation.y,
                    swappedQuat.z,//jointPose.transform.orientation.z,
                    swappedQuat.w,//jointPose.transform.orientation.w,
                ]);
            }
        }
    }


    start() {
        //   if(this.HideFingerCubes)
        //  {
        /*     this.RightHandrtWrist.children[0].getComponent('mesh').active=false;
             this.RightHandrtIndexBase.getComponent('mesh').active=false;
             this.RightHandrtMiddleBase.getComponent('mesh').active=false;
             this.RightHandrtRingBase.getComponent('mesh').active=false;
             this.RightHandrtLittleBase.getComponent('mesh').active=false;
 
             this.RightHandrtIndexMid.getComponent('mesh').active=false;
             this.RightHandrtMiddleMid.getComponent('mesh').active=false;
             this.RightHandrtRingMid.getComponent('mesh').active=false;
             this.RightHandrtLittleMid.getComponent('mesh').active=false;
 
             this.RightHandrtIndexTip.getComponent('mesh').active=false;
             this.RightHandrtMiddleTip.getComponent('mesh').active=false;
             this.RightHandrtRingTip.getComponent('mesh').active=false;
             this.RightHandrtLittleTip.getComponent('mesh').active=false;
 
             this.RightHandrtThumbBase.getComponent('mesh').active=false;
              this.RightHandrtThumbMid.getComponent('mesh').active=false;
             this.RightHandrtThumbTip.getComponent('mesh').active=false;
 */
        //   console.warn('HIDDEN');

        //  }
        //  this.RightHandrtIndexMid.setPositionWorld(this.RightHandrtIndexBase.children[0].getPositionWorld());
        //  console.warn('**********************************************************');


        //this.RightHandrtIndexBase.setRotationLocal(rotation);

        //this.roffset= this.RightHandrtWrist.getPositionWorld()- this.RightHandrtIndexBase.getPositionWorld();

		this.set_active(false);
		  this.setitup();
	}
	
	
	setitup()
	{
        if (!('XRHand' in window)) {
            console.warn('WebXR Hand Tracking not supported by this browser.');
          //this.active = false;
            return;
        }
        if (this.handSkin) {
            const skin = this.handSkin;
            const jointIds = skin.jointIds;
            /* Map the wrist */
            this.joints[ORDERED_JOINTS[0]] = this.engine.wrapObject(jointIds[0]);
            /* Index in ORDERED_JOINTS that we are mapping to our joints */
            /* Skip thumb0 joint, start at thumb1 */
            for (let j = 0; j < jointIds.length; ++j) {
                const joint = this.engine.wrapObject(jointIds[j]);
                /* tip joints are only needed for joint rendering, so we skip those while mapping */
                this.joints[joint.name] = joint;
            }
            /* If we have a hand skin, no need to spawn the joints-based one */
            return;
        }

        /* Spawn joints */
        const jointObjects = this.engine.scene.addObjects(ORDERED_JOINTS.length, this.object, ORDERED_JOINTS.length);
        for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
            const joint = jointObjects[j];
            if (!this.SpawnJointsIfNoSkin) {
                joint.addComponent(MeshComponent, {
                    mesh: null,
                    material: null,
                });
            }
            else {
                joint.addComponent(MeshComponent, {
                    mesh: this.jointMesh,
                    material: this.jointMaterial,
                });
            }
            this.joints[ORDERED_JOINTS[j]] = joint;
            joint.name = ORDERED_JOINTS[j];
        }
    }


    set_active(on) {
        this.weareactive = on;
        //hide the hand (or show it)
        if (this.HandRenderer != null)
            this.HandRenderer.getComponent("mesh").active = on;

        if (this.HideFingerCubes) {
            this.go_hidefingercubes();
        }
    }

    update(dt) {
        if (!this.engine.xr)// this.weareactive == false)
            return;
		if(! this.weareactive){
			setitup();
			 set_active(true);//
		}
	//	if(this.Debugtxt)
		//    this.Debugtxt.getComponent('text').text = this.getRotationWorld();
		
        this.hasPose = false;

        const correction = quat.create();
        quat.fromEuler(correction, -90, 0, 0); // angles in degrees
        const adjustedRot = quat.create();

        if (this.engine.xr.session.inputSources) {
            for (let i = 0; i < this.engine.xr.session.inputSources.length; ++i) {
                const inputSource = this.engine.xr.session.inputSources[i];
                if (!inputSource?.hand || inputSource?.handedness != this.handedness)
                    continue;


                // 1. Position the root of the hand at the wrist
                const wristSpace = inputSource.hand.get('wrist');
                if (wristSpace) {
                    const p = this.engine.xr.frame.getJointPose(wristSpace, this.engine.xr.currentReferenceSpace);
                    if (p) {
                        setXRRigidTransformLocal(this.object, p.transform);
                        /* this.object.setPositionLocal([
                             p.transform.position.x,
                             p.transform.position.y,
                             p.transform.position.z
                         ]);
                         this.object.setRotationLocal([
                             p.transform.orientation.x,
                             p.transform.orientation.y,
                             p.transform.orientation.z,
                             p.transform.orientation.w
                         ]);*/
                    }
                }
                this.object.getRotationLocal(invRotation);
                quat.conjugate(invRotation, invRotation);
                this.object.getPositionLocal(invTranslation);
                this.joints['wrist'].resetTransform();
                // 2. Update joint positions AND rotations (no inverse math)
                for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
                    const jointName = ORDERED_JOINTS[j];
                    const joint = this.joints[jointName];
                    if (!joint) continue;

                    const jointSpace = inputSource.hand.get(jointName);
                    if (!jointSpace) continue;

                    const jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
                    if (!jointPose) continue;

                    this.hasPose = true;

                    // Reset first if needed (optional depending on engine)
                    // joint.resetTransform();
                    joint.resetPositionRotation();

                    joint.translateLocal([
                        jointPose.transform.position.x - invTranslation[0],
                        jointPose.transform.position.y - invTranslation[1],
                        jointPose.transform.position.z - invTranslation[2],
                    ]);
                    joint.rotateLocal(invRotation);
                    joint.rotateObject([
                        jointPose.transform.orientation.x,
                        jointPose.transform.orientation.y,
                        jointPose.transform.orientation.z,
                        jointPose.transform.orientation.w,
                    ]);

                    const q = quat.create();
                    quat.setAxisAngle(q, [1, 0, 0], Math.PI / 2); // 90° in radians
                    this.object.rotateObject(q);
                    //   this.object.rotateObject([1, 0, 0, Math.PI / 2]);
                    //    this.object.rotateAxisAngleRadLocal([1, 0, 0], 90); 
                    //     this.object.rotateAxisAngleDeg([1, 0, 0], 90); 
                    /*
                     'wrist',//0
                        'thumb-metacarpal',//1
                        'thumb-phalanx-proximal',//2
                        'thumb-phalanx-distal',//3
                        'thumb-tip',//4
                        'index-finger-metacarpal',//5
                        'index-finger-phalanx-proximal',//6
                        'index-finger-phalanx-intermediate',//7
                        'index-finger-phalanx-distal',//8
                        'index-finger-tip',//9
                        'middle-finger-metacarpal',//10
                        'middle-finger-phalanx-proximal',//11
                        'middle-finger-phalanx-intermediate',//12
                        'middle-finger-phalanx-distal',//13
                        'middle-finger-tip',//14
                        'ring-finger-metacarpal',//15
                        'ring-finger-phalanx-proximal',//16
                        'ring-finger-phalanx-intermediate',//17
                        'ring-finger-phalanx-distal',//18
                        'ring-finger-tip',//19
                        'pinky-finger-metacarpal',//20
                        'pinky-finger-phalanx-proximal',//21
                        'pinky-finger-phalanx-intermediate',//22
                        'pinky-finger-phalanx-distal',//23
                        'pinky-finger-tip',//24
                    
                    */
                   const jointRot = joint.getRotationLocal();

                   /* if (this.handedness==1) {//RIGHT HAND
                        jointRot[0] = -jointRot[0]; // X
                        jointRot[3] = -jointRot[3]; // W
                    }*/

                    quat.multiply(adjustedRot, correction, jointRot);
                    switch (j) {
                        //these have the Y and Z mixed up

                        case 1://thumb base
                            this.RightHandrtThumbBase.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtThumbBase)
                                this.CopyHandrtThumbBase.setRotationLocal(this.RightHandrtThumbBase.getRotationLocal())
                            break;
                        case 2://thumbmid
                            this.RightHandrtThumbMid.setPositionWorld(this.RightHandrtThumbBase.children[0].getPositionWorld());
                            this.RightHandrtThumbMid.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtThumbMid) {
                                //     this.CopyHandrtThumbTip.setPositionWorld(this.RightHandrtThumbTip.getPositionWorld());
                                //     this.CopyHandrtThumbTip.setRotationLocal(this.RightHandrtThumbTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtThumbBase.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtThumbMid.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtThumbMid.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 3://thumbtip
                            this.RightHandrtThumbTip.setPositionWorld(this.RightHandrtThumbMid.children[0].getPositionWorld());
                            this.RightHandrtThumbTip.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtThumbTip) {
                                //     this.CopyHandrtThumbTip.setPositionWorld(this.RightHandrtThumbTip.getPositionWorld());
                                //     this.CopyHandrtThumbTip.setRotationLocal(this.RightHandrtThumbTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.RightHandrtThumbMid.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtThumbTip.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtThumbTip.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 6://indexbase
                            this.RightHandrtIndexBase.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtIndexBase)
                                this.CopyHandrtIndexBase.setRotationLocal(this.RightHandrtIndexBase.getRotationLocal());
                                if(this.handedness=== 'right'){
                                    //const q = quat.create();
                                    //quat.setAxisAngle(q, [1, 0, 0], Math.PI / 2); // 90° in radians
                                    this.CopyHandrtIndexBase.rotateObject(q);
                                }
                            break;
                        case 7:
                            this.RightHandrtIndexMid.setPositionWorld(this.RightHandrtIndexBase.children[0].getPositionWorld());
                            this.RightHandrtIndexMid.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtIndexMid) {
                                //   this.CopyHandrtIndexMid.setPositionWorld(this.RightHandrtIndexMid.getPositionWorld());
                                //    this.CopyHandrtIndexMid.setRotationLocal(this.RightHandrtIndexMid.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtIndexBase.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtIndexMid.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtIndexMid.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 8:
                            this.RightHandrtIndexTip.setPositionWorld(this.RightHandrtIndexMid.children[0].getPositionWorld());
                            this.RightHandrtIndexTip.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtIndexTip) {
                                //    this.CopyHandrtIndexTip.setPositionWorld(this.RightHandrtIndexTip.getPositionWorld());
                                //    this.CopyHandrtIndexTip.setRotationLocal(this.RightHandrtIndexTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtIndexMid.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtIndexTip.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtIndexTip.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 11://middle base
                            this.RightHandrtMiddleBase.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtMiddleBase)
                                this.CopyHandrtMiddleBase.setRotationLocal(this.RightHandrtMiddleBase.getRotationLocal());
                             if(this.handedness=== 'right'){
                                    //const q = quat.create();
                                    //quat.setAxisAngle(q, [1, 0, 0], Math.PI / 2); // 90° in radians
                                    this.CopyHandrtMiddleBase.rotateObject(q);
                                }
                            break;
                        case 12:
                            this.RightHandrtMiddleMid.setPositionWorld(this.RightHandrtMiddleBase.children[0].getPositionWorld());
                            this.RightHandrtMiddleMid.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtMiddleMid) {
                                //   this.CopyHandrtMiddleMid.setPositionWorld(this.RightHandrtMiddleMid.getPositionWorld());
                                //    this.CopyHandrtMiddleMid.setRotationLocal(this.RightHandrtMiddleMid.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtMiddleBase.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtMiddleMid.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtMiddleMid.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 13:
                            this.RightHandrtMiddleTip.setPositionWorld(this.RightHandrtMiddleMid.children[0].getPositionWorld());
                            this.RightHandrtMiddleTip.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtMiddleTip) {
                                //    this.CopyHandrtMiddleTip.setPositionWorld(this.RightHandrtMiddleTip.getPositionWorld());
                                //    this.CopyHandrtMiddleTip.setRotationLocal(this.RightHandrtMiddleTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtMiddleMid.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtMiddleTip.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtMiddleTip.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 16://ring base
                            this.RightHandrtRingBase.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtRingBase)
                                this.CopyHandrtRingBase.setRotationLocal(this.RightHandrtRingBase.getRotationLocal());
                            if(this.handedness=== 'right'){
                                    //const q = quat.create();
                                    //quat.setAxisAngle(q, [1, 0, 0], Math.PI / 2); // 90° in radians
                                    this.CopyHandrtRingBase.rotateObject(q);
                                }
                            break;
                        case 17:
                            this.RightHandrtRingMid.setPositionWorld(this.RightHandrtRingBase.children[0].getPositionWorld());
                            this.RightHandrtRingMid.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtRingMid) {
                                //    this.CopyHandrtRingMid.setPositionWorld(this.RightHandrtRingMid.getPositionWorld());
                                //    this.CopyHandrtRingMid.setRotationLocal(this.RightHandrtRingMid.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtRingBase.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtRingMid.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtRingMid.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 18:
                            this.RightHandrtRingTip.setPositionWorld(this.RightHandrtRingMid.children[0].getPositionWorld());
                            this.RightHandrtRingTip.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtRingTip) {
                                //    this.CopyHandrtRingTip.setPositionWorld(this.RightHandrtRingTip.getPositionWorld());
                                //    this.CopyHandrtRingTip.setRotationLocal(this.RightHandrtRingTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtRingMid.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtRingTip.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtRingTip.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 21://little base
                            this.RightHandrtLittleBase.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtLittleBase)
                                this.CopyHandrtLittleBase.setRotationLocal(this.RightHandrtLittleBase.getRotationLocal());
                             if(this.handedness=== 'right'){
                                    //const q = quat.create();
                                    //quat.setAxisAngle(q, [1, 0, 0], Math.PI / 2); // 90° in radians
                                    this.CopyHandrtLittleBase.rotateObject(q);
                                }
                            break;
                        case 22:
                            this.RightHandrtLittleMid.setPositionWorld(this.RightHandrtLittleBase.children[0].getPositionWorld());
                            this.RightHandrtLittleMid.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtLittleMid) {
                                //   this.CopyHandrtLittleMid.setPositionWorld(this.RightHandrtLittleMid.getPositionWorld());
                                //    this.CopyHandrtLittleMid.setRotationLocal(this.RightHandrtLittleMid.getRotationLocal());

                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtLittleBase.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtLittleMid.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtLittleMid.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                        case 23:
                            this.RightHandrtLittleTip.setPositionWorld(this.RightHandrtLittleMid.children[0].getPositionWorld());
                            this.RightHandrtLittleTip.setRotationLocal(adjustedRot);
                            if (this.CopyHandrtLittleTip) {
                                //   this.CopyHandrtLittleTip.setPositionWorld(this.RightHandrtLittleTip.getPositionWorld());
                                //   this.CopyHandrtLittleTip.setRotationLocal(this.RightHandrtLittleTip.getRotationLocal());
                                const invParentRot = quat.create();
                                const parentWorldRot = this.CopyHandrtLittleMid.getRotationWorld(); // parent in rig
                                quat.invert(invParentRot, parentWorldRot);
                                const sourceWorldRot = this.RightHandrtLittleTip.getRotationWorld(); // unparented source joint
                                const localRot = quat.create();
                                quat.multiply(localRot, invParentRot, sourceWorldRot);
                                this.CopyHandrtLittleTip.setRotationLocal(localRot); // destination rig joint
                            }
                            break;
                    }
                    // Optional: set scale to joint radius (usually OK for spheres)
                    if (!this.handSkin && this.SpawnJointsIfNoSkin) {
                        const r = jointPose.radius || 0.007;
                        joint.setScalingLocal([r, r, r]);
                    }
                }

            }


        }


        //hide all the children as the hand is not in use
        if (!this.hasPose && this._childrenActive) {
            this._childrenActive = false;
            if (this.deactivateChildrenWithoutPose) {
                this.setChildrenActive(false);
            }
            if (this.controllerToDeactivate) {
                this.controllerToDeactivate.active = true;
                this.setChildrenActive(true, this.controllerToDeactivate);
            }
        }
        else if (this.hasPose && !this._childrenActive) {
            this._childrenActive = true;
            if (this.deactivateChildrenWithoutPose) {
                this.setChildrenActive(true);
            }
            if (this.controllerToDeactivate) {
                this.controllerToDeactivate.active = false;
                this.setChildrenActive(false, this.controllerToDeactivate);
            }
        }
    }

    go_hidefingercubes() {
        this.RightHandrtWrist.children[0].getComponent('mesh').active = false;
        this.RightHandrtIndexBase.getComponent('mesh').active = false;
        this.RightHandrtMiddleBase.getComponent('mesh').active = false;
        this.RightHandrtRingBase.getComponent('mesh').active = false;
        this.RightHandrtLittleBase.getComponent('mesh').active = false;

        this.RightHandrtIndexMid.getComponent('mesh').active = false;
        this.RightHandrtMiddleMid.getComponent('mesh').active = false;
        this.RightHandrtRingMid.getComponent('mesh').active = false;
        this.RightHandrtLittleMid.getComponent('mesh').active = false;

        this.RightHandrtIndexTip.getComponent('mesh').active = false;
        this.RightHandrtMiddleTip.getComponent('mesh').active = false;
        this.RightHandrtRingTip.getComponent('mesh').active = false;
        this.RightHandrtLittleTip.getComponent('mesh').active = false;

        this.RightHandrtThumbBase.getComponent('mesh').active = false;
        this.RightHandrtThumbMid.getComponent('mesh').active = false;
        this.RightHandrtThumbTip.getComponent('mesh').active = false;
    }
    setChildrenActive(active, object) {
        object = object || this.object;
        const children = object.children;
        for (const o of children) {
            o.active = active;
            this.setChildrenActive(active, o);
        }


        if (this.HideFingerCubes) {
            this.go_hidefingercubes();
        }
    }
    isGrabbing() {
        this.joints['index-finger-tip'].getPositionLocal(tempVec0);
        this.joints['thumb-tip'].getPositionLocal(tempVec1);
        return vec3.sqrDist(tempVec0, tempVec1) < 0.001;
    }




}
/*__decorate([
    property.enum(['left', 'right'])
], AltHandTracking.prototype, "handedness", void 0);
__decorate([
    property.mesh()
], AltHandTracking.prototype, "jointMesh", void 0);
__decorate([
    property.material()
], AltHandTracking.prototype, "jointMaterial", void 0);
__decorate([
    property.skin()
], AltHandTracking.prototype, "handSkin", void 0);
__decorate([
    property.bool(true)
], AltHandTracking.prototype, "deactivateChildrenWithoutPose", void 0);
__decorate([
    property.object()
], AltHandTracking.prototype, "controllerToDeactivate", void 0);
export { AltHandTracking };*/
