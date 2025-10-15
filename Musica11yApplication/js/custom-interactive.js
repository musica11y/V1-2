import { Component, Property } from '@wonderlandengine/api';

/**
 * custom-interactive
 */
export class CustomInteractive extends Component {
	static TypeName = 'custom-interactive';
	/* Properties that are configurable in the editor */
	static Properties = {
		param: Property.float(1.0)
	};

	start() {
		///  console.log('start() with param', this.param);
		const cursor = WL.scene.activeCursor;
		if (!cursor) {
			console.error('No active cursor found! Ensure a Cursor Component is set up.');
			return;
		}

		this.object.addComponent('cursor-target');
		const cursorTarget = this.object.getComponent('cursor-target');

		// Define hover enter and exit behavior
		cursorTarget.onHover = () => {
			console.log('Hovered over object!');
			this.object.scale([1.1, 1.1, 1.1]); // Example hover effect
		};

		cursorTarget.onUnhover = () => {
			console.log('Hover exited!');
			this.object.scale([1.0, 1.0, 1.0]); // Reset scale
		};

		// Define click behavior
		cursorTarget.onClick = () => {
			console.log('Object clicked!');
		};
	}

	update(dt) {
		/* Called every frame. */
	}
}
