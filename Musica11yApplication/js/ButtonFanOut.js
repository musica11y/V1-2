import { Component, Property } from '@wonderlandengine/api';

/**
 * ButtonFanOut
 */
export class ButtonFanOut extends Component {
	static TypeName = 'ButtonFanOut';
	/* Properties that are configurable in the editor */
	static Properties = {
		ButtonSrcPosition: Property.object(),
		IgnoreCollider: Property.bool(),
		UpdateTheseColliders: Property.object(),//optional
		ButtonDesPosition: Property.object(),//optional

		CloseActionOnObject: Property.object(),//optional
		CloseActionOnComponent: Property.string("None"),//optional
		CloseAction: Property.string("None"),//optional
	};

	movementSpeed = 4;

	start() {
		this.fadingin = false;
		this.fadingout = false;
		this.weareon = false;

		this.elapsedTime = 0;

		this.buttonEndPos = this.object.getPositionWorld();
		if (this.ButtonDesPosition != null)
			this.buttonEndPos = this.ButtonDesPosition.getPositionWorld();

		this.buttonStartPos = this.ButtonSrcPosition.getPositionWorld();
		this.object.setPositionWorld(this.buttonStartPos);

		//disable the collider
		if (!this.IgnoreCollider) {
			this.ColliderSize = this.object.getComponent('collision').radius;
			this.object.getComponent('collision').radius = 0;
		}

		if (this.UpdateTheseColliders != null)
			this.update_these_colliders(this.weareon);
	}

	toggle_faninout() {
		this.fadingin = !this.weareon;
		this.fadingout = !this.fadingin;
		this.elapsedTime = 0;
		//console.log("togge in=",this.fadingin,",",this.fadingout," ",this.active);
		this.active = true;

		if (this.fadingout) {
			this.checkforcloseaction();
		}
	}

	start_fanout() {
		this.fadingin = false;
		this.fadingout = true;
		this.elapsedTime = 0;

		this.checkforcloseaction();
	}

	checkforcloseaction() {
		if (this.CloseAction) {
			console.log("trying for closeaction");
			let methodName = this.CloseAction; // The method name as a string
			let component =null;
			if(this.CloseActionOnObject)
				component = this.CloseActionOnObject.getComponent(this.CloseActionOnComponent); // Get the component

			if (component && typeof component[methodName] === 'function') {
				if (this.passSelfReference) {
					component[this.CloseAction](this.object); // Dynamically call the method
				}
				else {
					component[this.CloseAction](); // Dynamically call the method
				}
			} else {
				if (component == null)
				{
					if(this.CloseActionOnObject)
						console.error("component not found ", this.CloseActionOnComponent);
				}
				else
					console.error(`Method ${methodName} not found on the component.`);
			}
		}
	}

	start_fanin() {
		this.fadingin = true;
		this.fadingout = false;
		this.elapsedTime = 0;
	}

	smoothMove(object, startPosition, targetPosition, dt, duration) {
		//const startPosition = object.getPositionWorld();
		this.elapsedTime += dt * this.movementSpeed;

		// Interpolate between the start position and the target position
		const newPosition = this.lerpArray(startPosition, targetPosition, this.elapsedTime);
		//console.log(this.elapsedTime," ",newPosition);
		object.setPositionWorld(newPosition);

		if (this.elapsedTime >= 1) {
			// Movement is complete, you can stop updating
			if (this.UpdateTheseColliders != null)
				this.update_these_colliders(this.weareon);
			this.fadingin = false;
			this.fadingout = false;
			this.elapsedTime = 0;
		}
	}

	lerp(start, end, t) {
		return start * (1 - t) + end * t;
	}

	lerpArray(startArray, endArray, t) {
		return startArray.map((start, index) => this.lerp(start, endArray[index], t));
	}

	update(dt) {
		if (this.fadingin) {
			console.log("running");
			this.weareon = true;
			this.smoothMove(this.object, this.buttonStartPos, this.buttonEndPos, dt, this.movementDuration);
			if (!this.IgnoreCollider)
				this.object.getComponent('collision').radius = this.ColliderSize;
		}
		if (this.fadingout) {
			this.weareon = false;
			this.smoothMove(this.object, this.buttonEndPos, this.buttonStartPos, dt, this.movementDuration);
			if (!this.IgnoreCollider)
				this.object.getComponent('collision').radius = 0;
		}
	}


	update_these_colliders(on) {
		let children = this.UpdateTheseColliders.children;
		children.forEach(function (element) {
			if (element.getComponent('collision'))
				element.getComponent('collision').active = on;
		});
	}
}
