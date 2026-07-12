import {Component, Property} from '@wonderlandengine/api';

/**
 * NonVrSetCameraPosiiton
 */
export class NonVrSetCameraPosiiton extends Component {
    static TypeName = 'NonVrSetCameraPosiiton';
    /* Properties that are configurable in the editor */
    static Properties = {
          Targpos: Property.object()
    };

    start() {
//const dest= this.Targpos.getPositionWorld();
	//	this.object.setPositionWorld(dest);
	//	 console.log("set position at least executed " ,dest);
	//	  console.log("we are at " ,this.object.getPositionLocal());
	//	  console.log("we are on?  " ,this.object.getComponent('view').active);
		//  this.object.getComponent('view').active=false;
		
		  setTimeout(() => {
            // Executes after the current frame initialization wraps up
            this.executeDeferredLogic();
        }, 0);
	}
	
	executeDeferredLogic() {
	//	let pmph = new Float32Array(3); 
     //   this.Targpos.getTranslationWorld(pmph);      
     //   this.object.setTranslationWorld(pmph);
		console.log("set position at least executed " ,this.object.getPositionLocal());
    }

    update(dt) {
        /* Called every frame. */
    }
}
