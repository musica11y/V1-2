import {Component, Property} from '@wonderlandengine/api';

/**
 * AddToScene
 */
export class AddToScene extends Component {
    static TypeName = 'AddToScene';
    /* Properties that are configurable in the editor */
    static Properties = {
		sceneFile: Property.string("AnotherScene.bin"),
    };

    start() {
        console.log('start() and load ', this.sceneFile);
		//this.engine.scene.load(this.sceneFile);
		// setTimeout(() => {
         this.engine.scene.append(this.sceneFile).then(root => {
    // root contains the loaded scene
			let children = root.children;
				////for (let i = 0; i < children.length; i++) { children[i].active=false; }
			children.forEach(function (element) { console.log(element.name); });
			
			const myObject = root.children.find(obj => obj.name === 'Cube'); 
			
			if (myObject) { console.log('Found object:', myObject); // Do something with the object 
			} else { console.error('Object not found'); }
			});;
			

			
//		const myObject = root.children.find(obj => obj.name === 'Cube'); 
	//	if (myObject) { console.log('Found object:', myObject); // Do something with the object 
		//} else { console.error('Object not found'); }
        //}, 5*1000);
    }

    update(dt) {
        /* Called every frame. */
    }
}
