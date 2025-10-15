import { Component, Property } from '@wonderlandengine/api';
//import Soundfont from 'soundfont';
//import Soundfont from 'soundfont-player';
//import { AudioContext } from 'standardized-audio-context';

//import { SplendidGrandPiano, Soundfont } from "smplr";
//import { Soundfont2Sampler } from "smplr";
//import { SoundFont2 } from "soundfont2";

/**
 * RTestFingerCollision
 */
export class RTestFingerCollision extends Component {

    static TypeName = 'RTestFingerCollision';
    /* Properties that are configurable in the editor */
    static Properties = {
        param: Property.float(1.0),
        targetObjectName: Property.string("Cube"),
        newColor: Property.color(1, 1, 1, 1), // RGB color values
        oldColor: Property.color(1, 1, 1, 1),
        newMat: Property.material(),
        targetObject: Property.object(),
        matStart: Property.material(),
        matCollision: Property.material()
    };

    //soundfontUrl = 'http://johannes.roussel.free.fr/music/soundfonts/male.sf2';//link does not allow access
    //	soundfontUrl = 'https://rodneymcconnell.com/testarea/male.sf2';
    //		soundfontUrl = 'male.sf2';

    //async loadSoundfont(url) { 
    async loadAndListInstruments(url) {
        console.log('Trying again:', url);
        /*try { 
            const response = await fetch('male.sf2');//url); 
            const arrayBuffer = await response.arrayBuffer(); 
            const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
            // Load the soundfont and list instruments 
            Soundfont.instrument(audioContext, arrayBuffer).then((instrument) => { 
                console.log('Soundfont loaded successfully'); 
                console.log('Available instruments:', instrument.names);
            }).catch((error) => { 
                console.error('Error loading soundfont:', error); 
            }); 
        } catch (error) { 
            console.error('Error fetching soundfont:', error); 
        }*/
        /*fetch(url)//'assets/soundfonts/your-soundfont.sf2')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return Soundfont.instrument(audioContext, arrayBuffer);
        })
        .then(piano => {
            console.log('Soundfont loaded successfully');
            console.log('Available instruments:', piano.names);
        })
        .catch(error => {
            console.error('Error loading soundfont:', error);
        });*/
        /*try {
            const response = await fetch(url);///assets/soundfonts/your-soundfont.sf2');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const instrument = await Soundfont.instrument(audioContext, arrayBuffer);
            console.log('Soundfont loaded successfully');
            console.log('Available instruments:', instrument.names);
        } catch (error) {
            console.error('Error loading soundfont:', error);
        }*/

        /* try {
             // Fetch the local soundfont file
             const response = await fetch('GeneralUser-GS.sf2');//male.sf2');
             if (!response.ok) {
                 throw new Error('Network response was not ok');
             }
             const arrayBuffer = await response.arrayBuffer();
         	
             console.log('ArrayBuffer:', arrayBuffer);
         	
             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
             
             // Use the array buffer to decode the audio data
             audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                 // Create an instrument using the decoded audio data
                 const instrument = Soundfont.instrument(audioContext, audioBuffer);
                 
                 console.log('Soundfont loaded successfully');
                 console.log('Available instruments:', instrument.names);
                 
                 // Example of how to play a note
                 instrument.play('C4');
             });
         } catch (error) {
             console.error('Error loading soundfont:', error);
         }*/
    }


    // Load and play soundfonts
    /*async loadSoundfont() {
        try {
            const instrument = await smplr.loadSoundfont('/assets/soundfonts/your-soundfont.sf2', audioContext);
            console.log('Soundfont loaded successfully');
            console.log('Available instruments:', instrument.names);
            
        } catch (error) {
            console.error('Error loading soundfont:', error);
        }
    }
    */

    //	context = new AudioContext(); // create the audio context
    //  marimba = new SplendidGrandPiano(this.context); // create and load the instrument

    //	context = new AudioContext();
    //	piano = new SplendidGrandPiano(context, { decayTime: 0.5 });
    //marimba = new Soundfont(context, { instrument: "marimba" });

    init() {
        this.collider = this.object.getComponent('collision');
        this.objects = [];
        this.check = false;


        //	document.addEventListener('mousedown', this.onMouseDown.bind(this));//TJHIS WORKS

        //http://johannes.roussel.free.fr/music/soundfonts/male.sf2

        //Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then((piano) => { this.piano = piano; }).catch((error) => { console.error('Error loading soundfont:', error); });
        /*Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then((piano) => { 
            this.piano = piano; 
                // Add event listener after the piano is loaded 
                document.documentElement.addEventListener('mousedown', this.onMouseDown.bind(this)); 
            }).catch((error) => { 
                console.error('Error loading soundfont:', error); 
            });*/

        //const piano = await new SplendidGrandPiano(context).load;
        //ReferenceError: context is not defined
    }

    playNote(note) {
        //if (this.piano) { this.piano.play(note); } 
    }

    resumeAudioContext() {
        //	if (this.piano && this.piano.ac && this.piano.ac.state !== 'running') { 
        //	this.piano.ac.resume(); 
        //} 
    }

    onMouseDown() {
        console.log('play');
        //	this.resumeAudioContext(); 
        //this.playNote('C4'); 
        //piano.start({ note: "C4", velocity: 80, time: 5, duration: 1 });
        //	this.context.resume(); // enable audio context after a user interaction/
        //	this.marimba.start({ note: 60, velocity: 80 }); // play the note

    }

    /*start() {
       // console.log('start() with param', this.param);
       // const collider = this.object.getComponent('collision');



         console.log('has 1...again')

        this.collider = this.object.getComponent('collision');
        this.isColliding = false;
    	
    	
        const sampler = new Soundfont2Sampler(this.context, {
            //url: "https://smpldsnds.github.io/soundfonts/soundfonts/galaxy-electric-pianos.sf2"
            url: "https://rodneymcconnell.com/testarea/male.sf2"
            ,createSoundfont: (data) => new SoundFont2(data),
        });
        sampler.load.then(() => {
                    // list all available instruments for the soundfont
        console.log(sampler.instrumentNames);

            // load the first available instrument
            sampler.loadInstrument(sampler.instrumentNames[0]);
        	
        	
            this.marimba=sampler;
        });*/
    //this.loadSoundfont();

    /*
        try {
            const instrument = await smplr.loadSoundfont('/assets/soundfonts/your-soundfont.sf2', audioContext);
            console.log('Soundfont loaded successfully');
            console.log('Available instruments:', instrument.names);
    
            // Function to play a note on mouse click
            function playSound(event) {
                if (event.button === 0) { // Check if the left mouse button is clicked
                    instrument.play('C4'); // Play the note C4
                }
            }
    
            // Add event listener for mouse down event
            document.addEventListener('mousedown', playSound);
            
        } catch (error) {
            console.error('Error loading soundfont:', error);
        }
        */



    //	const pianoSound = await Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano');


    //this.loadAndListInstruments(this.soundfontUrl);

    //document.documentElement.addEventListener('mousedown', function() { this.playNote(60); });

    //this.collider = this.object.getComponent('collision');
    // this.targetObject = null;

    //  if (collider)
    //	{
    //	collider.onCollision(this.handleCollision.bind(this));
    // Set up a collision start event listener
    // collider.onCollisionStart(this.onCollisionStart.bind(this));
    // Set up a collision end event listener
    //  collider.onCollisionEnd(this.onCollisionEnd.bind(this));
    //   }

    // Get the collision component on this object (the object this script is attached to)
    //   this.collider = this.object.getComponent('collision');

    // Listen for collision events (when this object enters or exits another object's collision area)
    //  this.collider.on('collisionstart', this.onCollisionStart.bind(this));
    // this.collider.on('collisionend', this.onCollisionEnd.bind(this));
    //  }

    update(dt) {

        //this.object.translate([0, 0, -2 * dt]);
        //if (this.object.transformWorld[6] < -2) {
        //   this.object.translate([0, 0, 10]);
        //}
        //Collision Detection & Material Change
        let collidingComps = this.collider.queryOverlaps();
        for (let i = 0; i < collidingComps.length; ++i) {
            if (!this.check) {
                let collidingMesh = collidingComps[i].object.getComponent('mesh');
                collidingMesh.material = this.matCollision;
                this.objects.push(collidingComps[i]);
                this.check = true;
                //playNote(88);
                //	this.resumeAudioContext(); 
                //	this.playNote('C4');
                //piano.start({ note: "C4", velocity: 80, time: 5, duration: 1 });			
            }
        }
        if (collidingComps.length == 0) {
            this.check = false;
            for (var i = 0; i < this.objects.length; i++) {
                let startMesh = this.objects[i].object.getComponent('mesh');
                startMesh.material = this.matStart;
            }
            this.objects = [];
        }

        /* Called every frame. */
        //	 if (this.targetObjectName && !this.targetObject) {

        //	 console.log('has 2')
        //      this.targetObject = WL.scene.findObjectByName(this.targetObjectName);
        // }

        // If a target object is found, check for overlap
        //  if (this.targetObject) {

        //console.log('has 4')
        //    this.checkForCollision();
        //}
    }

    checkForCollision() {
        // Get the collision component of the target object
        const targetCollider = this.targetObject.getComponent('collision');

        if (targetCollider && this.collider) {
            console.log('has 4')
            // Perform manual collision detection here using the collider
            const isOverlapping = this.collider.checkCollision(targetCollider);

            if (isOverlapping && !this.isColliding) {
                // Handle collision (only once when collision starts)
                this.handleCollision();
                this.isColliding = true;
            }
            else if (!isOverlapping && this.isColliding) {
                // Handle when the objects are no longer colliding
                this.handleCollisionEnd();
                this.isColliding = false;
            }
        }
    }

    handleCollision() {
        // Change color of the object that was collided with
        const mesh = this.targetObject.getComponent('mesh');
        if (mesh) {
            const material = mesh.material;
            if (material) {
                material.diffuseColor.set(this.newColor)//this.newColor[0], this.newColor[1], this.newColor[2]);
                material.update();
            }
        }
    }

    handleCollisionEnd() {
        // Change color of the object that was collided with
        const mesh = this.targetObject.getComponent('mesh');
        if (mesh) {
            const material = mesh.material;
            if (material) {
                material.diffuseColor.set(this.oldColor)//this.newColor[0], this.newColor[1], this.newColor[2]);
                material.update();
            }
        }
    }
    //handleCollision(other) {
    //	other.getComponent('mesh').material=this.newMat;
    //}

    //onCollision(obj_enemy) { 
    // Handle collision 
    //health -= 10; // Example action: Reduce health 
    //audio_play_sound(snd_collision, false, false); // Play a collision sound 
    //}

    /*onCollisionStart(other) {
        console.log('Collision started with:', other.object.name);

        // Check if the collided object is the one you want to detect
        if (other.object.name === this.targetObjectName) {
            console.log('Overlapping with the target object!');
            // Add any action you want to take when overlap starts
            const meshComponent = other.object.getComponent('mesh');
            if (meshComponent) {
                const material = meshComponent.material;
                if (material) {
                    // Set the new color
                    material.diffuseColor.set(this.newColor);//[0], this.newColor[1], this.newColor[2]);
                    material.update(); // Update the material to apply the color change
                }
            }
        }
    }*/
}

