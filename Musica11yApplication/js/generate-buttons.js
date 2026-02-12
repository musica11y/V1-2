import { Component, Property } from '@wonderlandengine/api';

/**
 * generate-buttons
 * Creates a series of buttons with control over amount (X,Y), size and spacing
 */
export class GenerateButtons extends Component {
	static TypeName = 'generate-buttons';
	/* Properties that are configurable in the editor */
	static Properties = {
		param: Property.float(1.0),
		buttonPrefab: Property.object(),
		rows: Property.int(3), // Number of rows
		columns: Property.int(3), // Number of columns
		buttonSize: Property.float(1.0), // Size of each button
		spacing: Property.float(0.2),  // Space between buttons
		InitalNote: Property.int(-1), //-1 is blank, else 1==A

		NoteSelector: Property.object(),
		isSlotSelector: Property.bool(),
		isNoteSelector: Property.bool(),
		isScaleSelector: Property.bool(),
		isLayerSelector: Property.bool(),

		MusicMan: Property.object(),
		LayerManager: Property.object(),
		backpanel: Property.object(),
	};

	start() {

		this.musicmanref = this.MusicMan.getComponent('MusicManagement');

		console.log('start() generate buttons with param', this.param);
		this.buttons = []; // Store references to the generated buttons
		if (!this.buttonPrefab) {
			console.error('Button Prefab is required!');
			return;
		}

		this.noteColliderSize = this.buttonPrefab.getComponent('collision').radius;

		var CurrentNote = this.InitalNote;
		// Generate buttons in a grid
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {

				//const button = WL.scene.addObject(this.buttonPrefab);
				const button = this.buttonPrefab.clone();

				// Position the button in a grid layout
				const x = col * (this.buttonSize + this.spacing);
				const y = -row * (this.buttonSize + this.spacing); // Negative y to grow downwards
				button.setTranslationLocal([x, y, 0]);


				if (this.isNoteSelector)
					this.NoteSelector.getComponent('NoteSelector').storeButtonNoteSelector(button)
				if (this.isSlotSelector)
					this.NoteSelector.getComponent('NoteSelector').storeButtonMainSpanchor(button)

				if (this.isScaleSelector) {
					//	button.children[0].getComponent('text').text=this.musicmanref.GetScaleName(CurrentNote)
					//button.getComponent('UI_Button').setScaleText(CurrentNote);

					button.getComponent('UI_Button').notevalue = CurrentNote;
					button.getComponent('UI_Button').object.children[0].getComponent('text').text = this.musicmanref.GetScaleName(CurrentNote);
				}
				else if (this.isNoteSelector) {
					button.getComponent('UI_Button').notevalue = this.musicmanref.GetMidiValueOfNoteInScale(CurrentNote, 0, false);//octave will be added when using
					button.getComponent('UI_Button').intervalValue = CurrentNote;//this.musicmanref.GetIntervalValueOfPosition(CurrentNote);
					//console.log("set interval ",button.getComponent('UI_Button').intervalValue," for button ",CurrentNote);
				}
				else if (this.InitalNote > -1) {
					//var character = (char) ('A' + CurrentNote - 1);
					//let character = String.fromCharCode('A'.charCodeAt(0) + CurrentNote - 1);
					button.getComponent('UI_Button').notevalue = CurrentNote;//setNoteText(CurrentNote);	
					//button.getComponent('UI_Button').octave=null;
					//button.children[0].getComponent('text').text=this.musicmanref.GetStringOfNoteInScale(CurrentNote);//String(character);					
				}
				else {
					button.children[0].getComponent('text').text = "";
				}
				CurrentNote++;

				if (this.isLayerSelector) {
					this.LayerManager.getComponent('LayerManager').storeLayerButton(button);
				}
				//if(!this.isScaleSelector && CurrentNote>this.musicmanref.GetCurrentScalelength())
				//{
				//	CurrentNote=1;
				//}

				//console.log(x,y);
				// Adjust button size
				//button.scale([this.buttonSize, this.buttonSize, this.buttonSize]);

				// Optionally, assign unique data or behavior to each button
				// const hoverScript = button.getComponent('UIButton');//button-hover');
				// if (hoverScript) {
				//   hoverScript.defaultMaterial = this.defaultMaterial;
				// hoverScript.hoverMaterial = this.hoverMaterial;
				//}
				this.buttons.push(button); // Store the button for further use

				this.scene.addObject(button);

				button.parent = this.object;

				//	if (button.parent) {
				//		console.log('Parent Object Name:', button.parent.name);
				//	} else { console.log('This object has no parent.'); }
			}
		}

		if (this.isNoteSelector) {
			this.NoteSelector.getComponent('NoteSelector').UpdateNotesOnNoteSelectorActive(this.noteColliderSize);
			this.alignsinglerowbuttons();
		}


		this.buttonPrefab.active = false;
		let children = this.buttonPrefab.children;
		children.forEach(function (element) { element.active = false; });

		this.currentRowCntr = this.rows;
		this.currentColCntr = this.columns;

		if(this.isSlotSelector)
		{
			this.currentColCntr = 8*2;
			this.currentRowCntr = 8;//6;
	
			this.do_updateButtons();
		}

		if (this.isLayerSelector) 
		{
			this.LayerManager.getComponent('LayerManager').setInitialPanel();
		}
	}


	setButtonCount(x, y) {

		console.log("LOADED XY at ",x," ",y);

		this.currentColCntr = x;
		this.currentRowCntr = y;
		this.do_updateButtons();
	}

	updateButtonCount(x, y) {
		this.currentColCntr += x;
		this.currentRowCntr += y;

		this.do_updateButtons();
	}

	do_updateButtons() {

		if (this.currentColCntr < 1) this.currentColCntr = 1;
		if (this.currentColCntr > this.columns) this.currentColCntr = this.columns;
		if (this.currentRowCntr < 1) this.currentRowCntr = 1;
		if (this.currentRowCntr > this.rows) this.currentRowCntr = this.rows;


		//for (let row = 0; row < this.rows; row++) {
		//	for (let col = 0; col < this.columns; col++) 
		//this.buttons
		let xcntr = 0;
		let ycntr = 0;
		this.buttons.forEach((element, index) => {
			//console.log(`Element at index ${index}: ${element}`); 
			//let t=element.getComponent('UI_Button').updateButtonText(false);//(true,false);
			//if(t=="-")
			//if (element.getComponent('UI_Button').notevalue == -1) {
			if (xcntr >= this.currentColCntr || ycntr >= this.currentRowCntr) {
				element.active = false;

				element.getComponent('collision').radius = 0;

				let children = element.children;
				////for (let i = 0; i < children.length; i++) { children[i].active=false; }
				children.forEach(function (element) {
					element.active = false;
				});
			}
			else {
				element.getComponent('UI_Button').updateButtonText(true);//(true,false);			
				element.active = true;

	//			element.getComponent('collision').radius = 0.1;//this.noteColliderSize;
				element.getComponent('collision').radius = this.noteColliderSize;

				let children = element.children;
				////for (let i = 0; i < children.length; i++) { children[i].active=false; }
				//children.forEach(function (element) { element.active = true; });
				for (let i = 0; i < children.length; i++) { 
					if(this.musicmanref.in_drum || i<2) children[i].active=true; }//#2 is the drum
			}
			xcntr++;
			if (xcntr >= this.columns) {
				ycntr++;
				xcntr = 0;
			}
		});

		if(this.backpanel!=null)
		{
			let xsize=this.currentColCntr * (this.buttonSize+ this.spacing) *0.5;
			let ysize=this.currentRowCntr * (this.buttonSize+ this.spacing) *0.5;

			this.backpanel.setScalingLocal([(this.currentColCntr * (this.buttonSize+ this.spacing) *0.5)+0.1, (this.currentRowCntr+1) * (this.buttonSize+ this.spacing)*0.5, 1]);
			this.backpanel.setPositionLocal([-1.6+(xsize),0.8-(ysize),this.backpanel.getPositionLocal()[2]]);
		}
	}

	//handle the offset of the sharps in the note selector panel
	alignsinglerowbuttons() {
		let y = 0
		let lastwassharp = false;
		let firstletter = true;
		this.NoteSelector.getComponent('NoteSelector').NoteSelector.reverse().forEach((element, index) => {
			// Position the button in a grid layout
			let x = 1 * (this.buttonSize + this.spacing);
			y -= (this.buttonSize + this.spacing); // Negative y to grow downwards

			let t = element.getComponent('UI_Button').updateButtonText(false);

			if (t.length > 1)//we are sharp (left and offset)
			{
				x = x - 0.0825;
				if (!lastwassharp && !firstletter) {
					y += (this.buttonSize + this.spacing) / 2;
				}
				element.setTranslationLocal([x, y, 0]);
				lastwassharp = true;
			}
			else {
				if (lastwassharp) {
					y += (this.buttonSize + this.spacing) / 2;
				}
				lastwassharp = false;
				element.setTranslationLocal([x, y, 0]);
			}
			firstletter = false;
			element.getComponent('UI_Button').startposition = element.getPositionWorld();
		});
	}


	update(dt) {
		/* Called every frame. */
	}
}
