import { Component, Property } from '@wonderlandengine/api';
import { mat4, vec4 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import { MaterialScheme } from './MaterialScheme';

/**
 * UI_Button
 */
export class UIButton extends Component {
	static TypeName = 'UI_Button';
	/* Properties that are configurable in the editor */
	static Properties = {
		// param: Property.float(1.0),
		hoverMaterial: Property.material(),  // Material for hover state
		defaultMaterial: Property.material(), // Material for default state
		//hilitedMaterial: Property.material(),
		NoteSelectorObject: Property.object(),
		Action: Property.string("None"),
		Draggable: Property.bool(),
		clearSpanchorAfterDrag: Property.bool(),
		MusicMan: Property.object(),
		//	cameraObject: Property.object(),
		//	planeObject:  Property.object(),
		viewObject: Property.object(), // Assign the view (camera) object in the editor
		ScreenBlocker: Property.object(), // Assign the inpput blocker (optional)
		ScreenFader: Property.object(), // Assign the screenfader (optional)
		planeZ: Property.float(0.0),// Z-plane depth for alignment
		//: Property.object(),//button has an linked extension
		MiscDataPtr: Property.object(),//data specific to anything
		TheHeldDurationType: Property.string("short"),
		playnoteonHoover: Property.bool(false),
		playnoteonHooverTextMode: Property.bool(false),
		//DrumImage: Property.object(),
	};

	static LastButton = null;
	static ButtonDNDReleased = null;

	//todo
	//drop on button scale etc show not activate button
	//button manager handles the onmouseevent so there is only one
	//test on phone[does not work on mouse down does not seem to active, onclick does]
	//drag then release then dragon nothing onto button sets it need to fix this

	//mysterous bug where sometimes it stops allowing buttons to dock


	/*init()
	{
		//document.addEventListener('mousemove', this.onMouseMove.bind(this));	
		document.addEventListener('mousemove', this.onMouseMove);		
	}
*/

	//Initialise default values and set up the event listeners
	start() {



		document.addEventListener('mousemove', this.onMouseMove.bind(this));//only one should be added
		document.documentElement.addEventListener('mouseup', this.onMouseUp.bind(this)); //if the mouse is not on button the other wont work


		// WL.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
		document.addEventListener('pointermove', this.onMouseMove.bind(this));
		document.documentElement.addEventListener('pointerup', this.onMouseUp.bind(this));
		//document.addEventListener('pointerdown', this.onMouseDown.bind(this));//onPointerDown

		this.object.getComponent('mesh').material = this.object.getComponent('mesh').material.clone();

		if (this.object.childrenCount > 1){
			//this.surround = this.findChildByName(this.object, "Surround");
			//if(this.surround)
			//	this.surround.getComponent('mesh').material = this.surround.getComponent('mesh').material.clone();

			this.object.children[1].getComponent('mesh').material = this.object.children[1].getComponent('mesh').material.clone();
		}

		if (this.MusicMan == null)
			console.log("Musicman reference is null.", this.object.parent.name);
		//this.backupMaterial = this.defaultMaterial;
		this.ourScale = this.object.getScalingLocal();
		const target = this.object.getComponent('cursor-target');
		target.addClickFunction(this.onClick.bind(this));
		target.addHoverFunction(this.onHooverMouse.bind(this));
		target.addUnHoverFunction(this.onUnHoover.bind(this));
		target.addDownFunction(this.onMouseDown.bind(this));
		//	target.onPointerDown = this.onMouseDown.bind(this);

		//	target.onPointerUp = this.onPointerUp.bind(this);
		target.addUpFunction(this.onMouseUpTarget.bind(this))


		if (this.MusicMan != null) {
			const loadsave = this.MusicMan.getComponent('loadsave');
			if (loadsave && loadsave.SettingsWin) {
				this.settingsWindow = loadsave.SettingsWin;//.getComponent('SettingsWindow');//.SettingsWin;
				if (this.settingsWindow) {
					//console.log(">>" + this.object.name);
					//console.log(loadsave.SettingsWin);
					//console.log(this.settingsWindow.name);
					//console.log(this.settingsWindow);
					//console.log(this.settingsWindow.type);
					if (this.settingsWindow.type != 'SettingsWindow') {
						//console.log("need to change type");
						this.settingsWindow = this.settingsWindow.getComponent('SettingsWindow');
					}
					if (this.settingsWindow == null)
						console.log("Missing settings window");
				}
				else {
					console.log("NOOOOOOOO SETTINGS window");
				}
			}
		}

		//target.onTouch = this.onClick.bind(this);//nothing
		//target.fingerUp=this.onClick.bind(this);


		this.musicmanref = this.MusicMan.getComponent('MusicManagement');
		this.isDragging = false;

		if (this.Draggable) {
			this.view = this.viewObject.getComponent('view');
		}

		//	if (this.ChildWindowExtension != null)
		//		this.ChildWindowExtension = this.ChildWindowExtension.getComponent('ChildWindowExtension');

		this.backupMaterial = this.object.getComponent('mesh').material.color;

		if (this.Action == "SelectSpanchorSlot" || this.Action == "SelectNote") {
			this.backupMaterial = MaterialScheme.KEY_Colour_NULL;
			this.setBackgroundColour(this.backupMaterial);
		}
		if (this.Action == "CTRL-TogglePlayMode")
			this.setBackgroundColour(MaterialScheme.BUTTON_TestMode_Inactive);


		//if(this.DrumImage!=null) {
		if (this.object.childrenCount > 1 && this.object.children[1].childrenCount>0) {
			this.DrumImage =this.object.children[1].children[0];//  this.findChildByName(this.object, "Drum_Image"); //.children[2];
			if (this.DrumImage != null) {
				//let localpos=this.DrumImage.getPositionLocal();
				//localpos[2]=-0.002;
				//this.DrumImage.setPositionLocal(localpos);//getComponent('mesh').active=false;
				this.DrumImage.getComponent('mesh').active = false;
				console.log("SET THE DRUM to false");
			}
		}
	}

   findChildByName(parent, targetName) {
	for (let i = 0; i < parent.children.length; i++) {
		const child = parent.children[i];
		if (child.name === targetName) {
		return child;
		}
	}
	return null; // Not found
	}

	//restores material to original material
	restoreMaterial() {
		//this.defaultMaterial = this.backupMaterial;
		//this.object.getComponent('mesh').material = this.defaultMaterial;
		this.setBackgroundColour(this.backupMaterial);
		//console.log("restored");
	}

	setBackgroundColour(colour) {
		//	if (colour != MaterialScheme.KEY_Colour_NULL)
		//		this.backupMaterial = colour;
		this.object.getComponent('mesh').material.color = colour;
		//console.log("my background is now ", this.object.getComponent('mesh').material.color);

		let material = this.object.getComponent('mesh').material;
		if (material.diffuseColor) {
			material.diffuseColor = colour;//.set(1, 0, 0); // Example: setting it to red
		} else if (material.color) {
			material.color = colour;//.set(1, 0, 0);
		}

	}

	//
	//Convert from screen position to 3d world
	//
	UpdateMouseScreenToWorldPosition(event) {
		const mouseX = event.clientX;
		const mouseY = event.clientY;

		const rect = WL.canvas.getBoundingClientRect();
		const dpi = window.devicePixelRatio || 1;

		const ndcX = (mouseX / rect.width) * 2 - 1;
		const ndcY = 1 - (mouseY / rect.height) * 2;

		// Near and far points in NDC space
		const nearPointNDC = vec4.fromValues(ndcX, ndcY, -1, 1); // Near plane
		const farPointNDC = vec4.fromValues(ndcX, ndcY, 1, 1);   // Far plane

		// Get view and projection matrices
		const viewMatrix = mat4.create();
		mat4.invert(viewMatrix, this.viewObject.transformWorld);

		const projectionMatrix = this.view.projectionMatrix;

		// Combine view and projection matrices
		const viewProjectionMatrix = mat4.create();
		mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

		// Invert the view-projection matrix
		const inverseVP = mat4.create();
		mat4.invert(inverseVP, viewProjectionMatrix);

		// Unproject near and far points to world space
		const nearPointWorld = vec4.create();
		const farPointWorld = vec4.create();

		vec4.transformMat4(nearPointWorld, nearPointNDC, inverseVP);
		vec4.transformMat4(farPointWorld, farPointNDC, inverseVP);

		// Perspective divide to convert from homogeneous coordinates
		vec3.scale(nearPointWorld, nearPointWorld, 1 / nearPointWorld[3]);
		vec3.scale(farPointWorld, farPointWorld, 1 / farPointWorld[3]);

		// Compute ray origin and direction
		const rayOrigin = vec3.fromValues(nearPointWorld[0], nearPointWorld[1], nearPointWorld[2]);
		const rayDirection = vec3.create();
		vec3.sub(rayDirection, vec3.fromValues(farPointWorld[0], farPointWorld[1], farPointWorld[2]), rayOrigin);
		vec3.normalize(rayDirection, rayDirection);

		// Calculate intersection with Z-plane
		const t = (this.planeZ - rayOrigin[2]) / rayDirection[2];
		const intersectionPoint = vec3.create();
		vec3.scaleAndAdd(intersectionPoint, rayOrigin, rayDirection, t);

		// Move the object to the intersection point
		// this.objectToMove.setTranslationWorld(intersectionPoint);
		//	this.object.setPositionWorld(intersectionPoint);

		const worldX = intersectionPoint[0];
		//const worldX = this.object.getPositionWorld()[0];
	const worldY = intersectionPoint[1];//+1.8;//this.object.getPositionWorld()[1];
	 //  const worldY = this.object.getPositionWorld()[1];
		const worldZ = intersectionPoint[2];//this.object.getPositionWorld()[2];
//	const worldZ = this.object.getPositionWorld()[2];

		//		const interpolatedPosition = [worldX, worldY + 1.8, worldZ + 1.8];
		//const interpolatedPosition = [worldX, worldY + 1.25, worldZ + 1.8];
		const interpolatedPosition = [worldX, worldY+0.8 , worldZ];
	//	this.object.setPositionWorld(interpolatedPosition);
	
	// camera position in world:
	const camPos = vec3.fromValues(nearPointWorld[0], nearPointWorld[1], nearPointWorld[2]); // rayOrigin
	// view forward direction (from camera toward scene):
	const forward = vec3.create();
	vec3.sub(forward, vec3.fromValues(farPointWorld[0], farPointWorld[1], farPointWorld[2]), camPos);
	vec3.normalize(forward, forward);

	// offset distance (tweak positive value, e.g., 0.5)
	const offset = 0.8;

	// Move the object toward the camera: newPos = intersection - forward * offset
	const offsetVec = vec3.create();
	vec3.scale(offsetVec, forward, offset);
	let newPos = vec3.create();
	vec3.sub(newPos, intersectionPoint, offsetVec);
	newPos[1]+=0.8;
	//add the offset player position
	
	//if(this.musicmanref.PlayModeManager.PlayCameraRef==null)
		// console.log("PlayModeManager is none!");
	 
	 const playerObject = this.engine.scene.findByName('Player')[0];
	 if(playerObject==null)
		 console.log("playerObject is none!");
	else
	{
		let oldplayerpos = playerObject.getTranslationLocal();
		newPos[0]+=oldplayerpos[0];
		newPos[1]+=oldplayerpos[1];
	}	 
	//let oldplayerpos = this.musicmanref.PlayModeManager.PlayCameraRef.getTranslationLocal();
	//newPos[0]+=oldplayerpos[0];
	
	
	this.object.setPositionWorld(newPos);

	}
	/*
	 rayPlaneIntersection(rayOrigin, rayDirection, planePoint, planeNormal) {
		// Calculate the dot product of the ray direction and the plane normal
		const denom = vec3.dot(rayDirection, planeNormal);
		// If denom is close to zero, the ray is parallel to the plane (no intersection)
		if (Math.abs(denom) < 1e-6) {
			return null;
		}

		// Compute the vector from the ray origin to the plane point
		const rayToPlane = vec3.create();
		vec3.sub(rayToPlane, planePoint, rayOrigin);

		// Calculate the distance to the plane along the ray direction
		const t = vec3.dot(rayToPlane, planeNormal) / denom;

		// If t < 0, the plane is behind the ray origin (no valid intersection)
		if (t < 0) {
			return null;
		}

		// Compute the intersection point
		const intersection = vec3.create();
		vec3.scaleAndAdd(intersection, rayOrigin, rayDirection, t);

		return intersection;
	}*/


	//		
	//	For drag and drop, update the position of the object in hand
	//
	onMouseMove(event) {
		if (this.held && this.Draggable && !this.musicmanref.InTestMode) {
			this.UpdateMouseScreenToWorldPosition(event);
		}
	}



	static CurrentButton = null;

	//
	//	Event called when clicking/tapping on an object
	//
	onMouseDown(event) {
		console.log("MOUSE DOWN on ", this.object.name);
		if (this.object.name == "UI_Button") {
			console.log(this.object.children[0].getComponent('text').text); //if this is undefined we have detected the ghost button bug! TOFIX
		}

		UIButton.CurrentButton = null;
		if (this.Draggable) {
			UIButton.CurrentButton = this;
			this.object.getComponent("collision").active = false;//test so we can see below it
		}


		UIButton.ButtonDNDReleased = null;
		//Drag n drop start
		if (this.Draggable && !this.musicmanref.InTestMode) {
			//if (this.startposition == null)
			this.startposition = this.object.getPositionWorld();
			this.held = true;
		}
		//
		// Play the note (if in test/play mode)
		//
		if (this.Action == "SelectSpanchorSlot") {
			if (!this.musicmanref.InKeySelect) {
				if (this.musicmanref.InTestMode && this.notevalue >= 0) {//} || this.octave > 0)) {					
					this.musicmanref.SoundFontPlayer.playnote(this.notevalue, 80);
					console.log("Playing note:", this.notevalue)
				}
				else if (this.musicmanref.InTestMode) {
					console.log("NO playing note:", this.notevalue)
				}
			}
		}
	}

	//
	// Event mouse/tap released
	//
	onMouseUp(event) {
		//console.log("mouseupdetected ");
		//console.log(this.held);
		//console.log(this.Action);
		if (this.held) {
			UIButton.ButtonDNDReleased = this;
			console.log('Mouse button released on', this.object.name);
			this.held = false;
			this.isDragging = false;
			this.object.setPositionWorld(this.startposition);
			//	if(this.object.getComponent("UI_Button"))
			//		this.object.getComponent("UI_Button").onClick();
		}
		//stop playing the note if in playmode
		if (this.Action == "SelectSpanchorSlot") {
			if (!this.musicmanref.InKeySelect) {
				if (this.musicmanref.InTestMode && this.notevalue > 0)
					this.musicmanref.SoundFontPlayer.stopnote();
			}
		}
		//IF this was finger down then issue onClick 

		if (this.Draggable) {
			UIButton.CurrentButton = this;
			this.object.getComponent("collision").active = true;//test so we can see below it
		}
	}

	onMouseUpTarget() {
		console.log("UP on", this.object.name, " ", UIButton.ButtonDNDReleased, " ", UIButton.CurrentButton);
		if (this.object.name == "UI_SpanchorButton" && UIButton.CurrentButton != null && UIButton.CurrentButton != this) {
			UIButton.ButtonDNDReleased = UIButton.CurrentButton;// needs set to the initial button

			if (!this.musicmanref.InKeySelect && !this.musicmanref.InTestMode) {
				console.log("I could help?");
				//this.oktodrop=true;
				//this.object.getComponent("UI_Button").onClick();//update to drop for drag n drop only
				//this.oktodrop=false;
				//Could put the dragndrop here???
				//console.log("*",UIButton.ButtonDNDReleased.notevalue ," ",UIButton.ButtonDNDReleased.Action);
				if (UIButton.ButtonDNDReleased.notevalue != null) {
					if (UIButton.ButtonDNDReleased.Action == "SelectNote")//From leftwindow
					{
						//console.log("no");
						this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
						this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(UIButton.ButtonDNDReleased.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), UIButton.ButtonDNDReleased.intervalValue);//, UIButton.ButtonDNDReleased.octave);
					}
					else {//within self
						this.notevalue = UIButton.ButtonDNDReleased.notevalue;
						this.intervalValue = UIButton.ButtonDNDReleased.intervalValue;
						//this.octave = UIButton.ButtonDNDReleased.octave;
						this.object.children[0].getComponent('text').text = UIButton.ButtonDNDReleased.object.children[0].getComponent('text').text;
						this.backupMaterial = MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));
						this.restoreMaterial();
						//console.log("ME BALLS");
					}
					//clear current note
					if (UIButton.ButtonDNDReleased.clearSpanchorAfterDrag) {
						UIButton.ButtonDNDReleased.notevalue = null;
						UIButton.ButtonDNDReleased.setNoteText(null, null);
					}
				}
				else {
					this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
					this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(null, null);
				}
				UIButton.ButtonDNDReleased = null;
			}
		}
	}


	/*optionsOpen = false;

	toggleOptions() {
		this.optionsOpen = !this.optionsOpen;
		if (this.ScreenBlocker)
			this.ScreenBlocker.active = this.optionsOpen;
		if (this.ScreenFader)
			this.ScreenFader.active = this.optionsOpen;

		let children = this.object.parent.children;
		children.forEach((element) => {
			let b = element.getComponent("ButtonFanOut");
			if (b) {
				b.fadingin = this.optionsOpen;
				b.fadingout = !this.optionsOpen;
			}
		});
	}*/

	//
	//	button has been clicked (ie left mouse down and up on the same object)
	//
	onClick() {
		console.log("ONCLICK: ", this.object.name);
		switch (this.Action) {
			/*case "CTRL-LOGOUT":
				if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
					break;
				this.ChildWindowExtension.enableme();
				break;
			case "ConfirmLogOUTOK":
				//LOGOUT should send them back to the start log in page really
				this.ChildWindowExtension.disableme();
				this.MiscDataPtr.getComponent("UI_Button").toggleOptions();
				this.MusicMan.getComponent("loadsave").dologout();
				break;
			case "ConfirmLogOUTOKCancel":
				this.ChildWindowExtension.disableme();
				this.MiscDataPtr.getComponent("UI_Button").toggleOptions();
				break;
			case "CTRL-Save":
				this.MiscDataPtr.getComponent('UI_Button').toggleOptions();
				this.MusicMan.getComponent('loadsave').doSave();
				break;
			case "CTRL-Options":
				this.toggleOptions();
				break;*/
			/*case "CTRL-Deletelayer":
				if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
					break;
				//open confirm box
				this.ChildWindowExtension.enableme();
				break;
			//clear note all OK
			case "DeleteLayerOK":
				this.ChildWindowExtension.disableme();
				this.MiscDataPtr.getComponent('LayerManager').deletelayer();
				//this.musicmanref.clearAllSpanchors();
				break;
			//clear note all cancel
			case "DeleteLayerCancel":
				this.ChildWindowExtension.disableme();//.parent.parent
				break;
				*/
			case "CTRL-SelectLayer":
				this.MiscDataPtr.getComponent('LayerManager').setcurrentLayer(this.notevalue, this.musicmanref.InTestMode);
				break;
			/*case "CTRL-LeftPanel":
				this.MiscDataPtr.getComponent('LayerManager').setLeftPanel();
				break;
			case "CTRL-RightPanel":
				this.MiscDataPtr.getComponent('LayerManager').setRightPanel();
				break;*/
			//fill
			/*case "CTRL-FillAllAnchors":
				this.musicmanref.fillAllSpanchors(
					this.MiscDataPtr.getComponent('generate-buttons').columns,
					this.MiscDataPtr.getComponent('generate-buttons').rows - 1);
				break;
			//play/stop
			case "CTRL-TogglePlayMode":
				this.toggleValue = !this.toggleValue;
				if (this.toggleValue) {
					this.object.children[0].getComponent('text').text = "Exit\n PLAY Mode";
					this.musicmanref.InTestMode = true;
					this.setBackgroundColour(MaterialScheme.BUTTON_TestMode_Active);
				}
				else {
					this.object.children[0].getComponent('text').text = "Enter\n PLAY Mode";
					this.musicmanref.InTestMode = false;
					this.setBackgroundColour(MaterialScheme.BUTTON_TestMode_Inactive);
				}
				break;
			//set the current octave
			case "CTRL-OctaveUp":
				if (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave < 10) {
					this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave++;
					if (!this.musicmanref.InKeySelect) {
						this.NoteSelectorObject.getComponent('NoteSelector').updateCurrentNoteText();//.TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:" + this.musicmanref.CurrentKey+"-"+ String(this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave);
						this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(false);
					}
				}
				break;
			//set the current octave
			case "CTRL-OctaveDown":
				if (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave >= 0) {
					this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave--;
					if (!this.musicmanref.InKeySelect) {
						this.NoteSelectorObject.getComponent('NoteSelector').updateCurrentNoteText();// TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:" + this.musicmanref.CurrentKey+"-" + String(this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave);
						this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(false);
					}
				}
				break;
			//toggle key set window
			case "CTRL-OpenSetKeyWindow":
				if (this.musicmanref.InKeySelect) {
					//restore normal mode
					this.musicmanref.SelectKey("Cancel");
					this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(false);

					if (this.ScreenBlocker) this.ScreenBlocker.active = false;
					if (this.ScreenFader) this.ScreenFader.active = false;
				}
				else {
					//Set text of notes window				
					this.musicmanref.changeScale(0);
					this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(true);

					if (this.ScreenBlocker) this.ScreenBlocker.active = true;
					if (this.ScreenFader) this.ScreenFader.active = true;
				}
				break;*/
			//select scale select window
			case "SelectScale": //set the scale in the scale panel
				if (!this.musicmanref.InKeySelect) {
					this.musicmanref.changeScale(this.notevalue);
					this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(false);
				}
				break;
			//clear all notes
			/*case "ClearNoteAll":
				if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
					break;
				//open confirm box
				this.ChildWindowExtension.enableme();
				break;
			//clear note all OK
			case "ClearNoteAllOK":
				this.ChildWindowExtension.disableme();
				this.musicmanref.clearAllSpanchors();
				break;
			//clear note all cancel
			case "ClearNoteAllCancel":
				this.ChildWindowExtension.disableme();
				break;*/
			//select a note to be cleared
			case "ClearNote":
				if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
					break;
				if (this.NoteSelectorObject.getComponent('NoteSelector').selectedSpanchorSlot.length <= 0) {
					//select this
					if (UIButton.LastNoteButton != null) {
						UIButton.LastNoteButton.restoreMaterial();
						UIButton.LastNoteButton = null;
					}
					if (UIButton.LastButton) {
						UIButton.LastButton.restoreMaterial();
						UIButton.LastButton = null;
					}
					//this.defaultMaterial = this.hilitedMaterial;
					this.setBackgroundColour(MaterialScheme.BUTTON_KeyColour_SELECTED);
					//this.object.getComponent('mesh').material = this.defaultMaterial;
					UIButton.LastNoteButton = this;
					this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(-1);
				}
				else {
					//clear button
					//if (UIButton.LastButton != null) {
					//this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
					this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(null, null);
					UIButton.ButtonDNDReleased = null;
					//console.log("we will restore ",UIButton.LastButton);
					//	UIButton.LastButton.restoreMaterial();
					//	UIButton.LastButton = null;
					this.NoteSelectorObject.getComponent('NoteSelector').clearSelected();
					//this.NoteSelectorObject.getComponent('NoteSelector').selectedSpanchorSlot = [];
					this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(-1);
					//}
				}
				this.NoteSelectorObject.getComponent('NoteSelector').updateCurrentNoteText();
				break;
			//select a note on the left side
			case "SelectNote": //set the note of the notes panel
				if (this.musicmanref.InKeySelect) {
					//this.object.children[0].getComponent('text').text=
					//console.log(this.notevalue);
					//console.log(this.musicmanref.GetStringOfNoteInScale(this.notevalue, true, true, this.octave));
					//console.log("set key to note ", this.notevalue);
					this.musicmanref.SelectKey(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));//.getNoteAtInterval(this.notevalue));//, true));
					this.NoteSelectorObject.getComponent('NoteSelector').setBackgroundColour(false);
					if (this.ScreenBlocker) {
						console.log("disable blocker");
						this.ScreenBlocker.active = false;
					}
					if (this.ScreenFader) {
						console.log("disable fader");
						this.ScreenFader.active = false;
					}
				}
				else {
					if (this.musicmanref.InTestMode)
						break;
					//if no anchor slot is selected then hi lite us instead

					if (this.NoteSelectorObject.getComponent('NoteSelector').selectedSpanchorSlot.length <= 0) {
						//console.log("highlite this slot");
						//this.NoteSelectorObject.getComponent('NoteSelector').ChooseNote(this);
						if (UIButton.LastNoteButton != null) {
							UIButton.LastNoteButton.restoreMaterial();
							UIButton.LastNoteButton = null;
						}
						if (UIButton.LastButton) {
							UIButton.LastButton.restoreMaterial();
							UIButton.LastButton = null;
						}
						this.setBackgroundColour(MaterialScheme.BUTTON_KeyColour_SELECTED);
						//this.defaultMaterial = this.hilitedMaterial;
						//this.object.getComponent('mesh').material = this.defaultMaterial;
						UIButton.LastNoteButton = this;
						this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(this.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12));
					}
					this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(this.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), this.intervalValue);//, this.octave);//this.object.children[0].getComponent('text').text);
					console.log("TIme to restore ", UIButton.LastButton);
					if (UIButton.LastButton) {
						UIButton.LastButton.restoreMaterial();
						UIButton.LastButton = null;
						this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(-1);
					}
				}
				break;
			//select a anchor on the main panel
			case "SelectSpanchorSlot"://Main panel 
				//console.log("set sp 1");
				if (!this.musicmanref.InKeySelect) {
					if (this.musicmanref.InTestMode)
						break;

					//if(this.musicmanref.InTestMode && this.notevalue>0)
					//	this.musicmanref.SoundFontPlayer.playnote(55+this.notevalue,80);

					if (UIButton.LastButton == this) {
						console.log("we will restore ", UIButton.LastButton);
						UIButton.LastButton.restoreMaterial();
						UIButton.LastButton = null;
						this.NoteSelectorObject.getComponent('NoteSelector').clearSelected();
						//this.NoteSelectorObject.getComponent('NoteSelector').selectedSpanchorSlot = [];
						this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(-1);
					}
					else {
						console.log("We have been released upon or have we been pressed ", UIButton.ButtonDNDReleased);
						if (UIButton.ButtonDNDReleased != null && UIButton.ButtonDNDReleased != this) {
							console.log("set button");
							//set the button to the one we dropped on it
							//this.NoteSelectorObject.getComponent('NoteSelector').selectedSlot=this;

							//DO THE DRAG n DROP elsewhere to be more finger friendly
							/*if(!this.oktodrop)//only allow this when we come from mouseup HACK
							{
								console.log("NOPE");
								break;
							}
							//console.log("*",UIButton.ButtonDNDReleased.notevalue ," ",UIButton.ButtonDNDReleased.Action);
							if (UIButton.ButtonDNDReleased.notevalue != null) {
								if (UIButton.ButtonDNDReleased.Action == "SelectNote")//From leftwindow
								{
									//console.log("no");
									this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
									this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(UIButton.ButtonDNDReleased.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), UIButton.ButtonDNDReleased.intervalValue);//, UIButton.ButtonDNDReleased.octave);
								}
								else {//within self
									this.notevalue = UIButton.ButtonDNDReleased.notevalue;
									this.intervalValue = UIButton.ButtonDNDReleased.intervalValue;
									//this.octave = UIButton.ButtonDNDReleased.octave;
									this.object.children[0].getComponent('text').text = UIButton.ButtonDNDReleased.object.children[0].getComponent('text').text;
									this.backupMaterial=MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));
									this.restoreMaterial();
									//console.log("ME BALLS");
								}
								//clear current note
								if (UIButton.ButtonDNDReleased.clearSpanchorAfterDrag) {
									UIButton.ButtonDNDReleased.notevalue = null;
									UIButton.ButtonDNDReleased.setNoteText(null, null);									
								}
							}
							else {
								this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
								this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(null, null);
							}
							*/
							UIButton.ButtonDNDReleased = null;
						}
						else {
							if (UIButton.LastButton) {
								//console.log("and restore ", UIButton.LastButton);
								UIButton.LastButton.restoreMaterial();
								UIButton.LastButton = null;
							}
							if (UIButton.LastNoteButton != null) {
								//console.log("REVERSE SET");
								if (UIButton.LastNoteButton.Action == "ClearNote") {
									this.setNoteText(null, null);
								}
								else {
									this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
									this.NoteSelectorObject.getComponent('NoteSelector').SetSpanchorSlotToNote(UIButton.LastNoteButton.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), UIButton.LastNoteButton.intervalValue);//, UIButton.LastNoteButton.octave);
								}
								UIButton.LastNoteButton.restoreMaterial();
								UIButton.LastNoteButton = null;
								this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(-1);
							}
							else {
								//console.log("Add me");
								if (this.NoteSelectorObject.getComponent('NoteSelector').IfHereRemoveSlotOnSpanchorPanel(this)) {
									this.restoreMaterial();
								}
								else {
									this.NoteSelectorObject.getComponent('NoteSelector').ChooseSlotOnSpanchorPanel(this);
									//this.defaultMaterial = this.hilitedMaterial;
									//this.object.getComponent('mesh').material = this.defaultMaterial;
									this.setBackgroundColour(MaterialScheme.BUTTON_KeyColour_SELECTED);
									//UIButton.LastButton = this;//uncomment for single selection
									//console.log("restore");
									this.NoteSelectorObject.getComponent('NoteSelector').setCurrentNoteValue(this.notevalue);
								}
							}
						}
					}
				}
				break;
		}
	}

	//
	// hoover mouse over button
	//
	onHooverMouse() {
		this.wasmouse = true;
		this.onHoover();
		this.wasmouse = false;
	}
	onHoover() {
		let cb = [0, 0, 0];
		cb[0] = this.ourScale[0] * 1.1;
		cb[1] = this.ourScale[1] * 1.1;
		cb[2] = this.ourScale[2] * 1.1;
		this.object.setScalingLocal(cb);

		if (this.playnoteonHooverTextMode && this.settingsWindow != null) {
			if(!this.musicmanref.newNoteHoverMute)
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on))
				if (this.musicmanref.InTestMode && this.notevalue >= 0) {//} || this.octave > 0)) {					
					this.musicmanref.SoundFontPlayer.playnote(this.notevalue, 80);
				}
		}
		//if(this.settingsWindow==null)
		//console.log("IT WAS NULL");
		if (this.playnoteonHoover && this.settingsWindow != null) {
			//if (this.settingsWindow == null)
			//	console.log("IT WAS NULL");

			//console.log("Hooover");
			//this.object.children[0].getComponent('text').text = 'X';
			//auto_ray_on
			if(!this.musicmanref.newNoteHoverMute)
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on))
			//todo also check for enabled status on this
			{
				this.musicmanref.SoundFontPlayer.playnote(this.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), 80);
			}

		}
	}

	//
	//no longer hoover mouse over button
	//
	onUnHoover() {
		/* Print the message that was configured in the editor) */
		//console.log("unHoovering...");
		//this.object.getComponent('mesh').material = this.defaultMaterial;
		this.object.setScalingLocal(this.ourScale);//[0.15,0.1,0.1]); // Revert to normal

		if (this.playnoteonHooverTextMode && this.settingsWindow != null) {
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on))
				if (this.musicmanref.InTestMode && this.notevalue >= 0) {//} || this.octave > 0)) {					
					this.musicmanref.SoundFontPlayer.stopnote();
				}
		}

		if (this.playnoteonHoover && this.settingsWindow != null) {
			if ((this.wasmouse && this.settingsWindow.auto_mouse_on) || (!this.wasmouse && this.settingsWindow.auto_ray_on)) {
				this.musicmanref.SoundFontPlayer.stopnote();
			}
		}
	}

	//
	//set the text of the button
	//
	updateButtonText(showOct) {
		//was called updateText(doNotLoop, showOct) {
		if (this.notevalue) {
			//console.log("We are note ", this.notevalue);
			if (this.MusicMan == null)
				console.log("WARNING Musicman reference is null.", this.object.parent.name);
			if (showOct) {
				let t = this.musicmanref.midiToNoteName(this.notevalue);//.GetStringOfNoteInScale(this.notevalue, doNotLoop, showOct, this.octave);
				this.object.children[0].getComponent('text').text = t;

				this.backupMaterial = MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));
				this.setBackgroundColour(this.backupMaterial);
				return t;
			}
			else {
				let t = this.musicmanref.midiToNoteNameNoOctave(this.notevalue);
				this.object.children[0].getComponent('text').text = t;

				this.backupMaterial = MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));
				this.setBackgroundColour(this.backupMaterial);
				return t;
			}
		}
		return "-";
	}

	//Sets the bottom text to scale text
	/*setScaleText(t) {
		this.notevalue = t;
		//this.octave=octave;//this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave;
		this.object.children[0].getComponent('text').text = this.musicmanref.GetScaleName(t);
	}*/

	//sets the text on the button
	setNoteText(t) {//}, oct) {
		this.notevalue = t;
		//this.octave = oct;//this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave;
		//console.log("We set note ", this.notevalue);
		//this.OurText.getComponent('text').text=t;
		if (t == null) {
			this.object.children[0].getComponent('text').text = "";
			this.backupMaterial = MaterialScheme.KEY_Colour_NULL;
			this.setBackgroundColour(MaterialScheme.KEY_Colour_NULL);
			if (this.DrumImage)
				this.DrumImage.getComponent('mesh').active = false;
		}
		//else this.object.children[0].getComponent('text').text=this.musicmanref.GetStringOfNoteInScale(t,true,true); //could just have used this.ourText.getComponent('text') NO THIS WOULD FAIL as it would point to the first instance...
		else {
			this.object.children[0].getComponent('text').text = this.musicmanref.midiToNoteName(this.notevalue);//GetStringOfNoteInScale(this.notevalue, false, true, this.octave);
			this.backupMaterial = MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));
			this.setBackgroundColour(this.backupMaterial);
			console.log("WE we tried ", this.musicmanref.in_drum);
			if (this.musicmanref.in_drum) {
				if (this.DrumImage) {

					let o = this.MusicMan.getComponent('DrumImageHolder').set2drum(true, this.notevalue, this.DrumImage.getComponent('mesh'));
					this.DrumImage.getComponent('mesh').active = o;
				}
			}
		}
	}

	/*setNoteTextLoop(t, oct) {
		let retstring = "--";
		this.notevalue = t;
		this.octave = oct;//this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave;
		//console.log("We set note ",this.notevalue);
		//this.OurText.getComponent('text').text=t;
		if (t == null)
			this.object.children[0].getComponent('text').text = "";
		else {
			retstring = this.musicmanref.GetStringOfNoteInScale(t, false, true, oct); //could just have used this.ourText.getComponent('text') NO THIS WOULD FAIL as it would point to the first instance...
			this.object.children[0].getComponent('text').text = retstring;
		}
		return retstring;
	}*/
}
