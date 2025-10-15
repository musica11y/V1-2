import { Component, Property } from '@wonderlandengine/api';

import { MaterialScheme } from './MaterialScheme.js';

/**
 * NoteSelector
 * The link between the main panel and the side panels
 *also keeps a list of all the buttons
 */
export class NoteSelector extends Component {
	static TypeName = 'NoteSelector';
	/* Properties that are configurable in the editor */
	static Properties = {
		// param: Property.float(1.0),
		TextObject: Property.object(),
		MusicMan: Property.object(),
		background: Property.object(),
		noteColliderSize: Property.float(0.1),
		ScreenBlocker: Property.object(), // Assign the inpput blocker (optional)
		ScreenFader: Property.object(), // Assign the screenfader (optional)
	};


	CurrentOctave = 4;//middle C is C4 midi 60


	//var NoteSelector = [];
	//let NoteSlots = [];

	start() {
		this.selectedSpanchorSlot = [];
		//this.NoteSelector = [];
		//this.NoteSlots = [];
		this.musicmanref = this.MusicMan.getComponent('MusicManagement');
		//console.log('start note selector with param', this.param);
		//this.TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:" + this.musicmanref.CurrentKey+"-"+ String(this.CurrentOctave);
		this.updateCurrentNoteText();
		//this.CurrentScale="ABcDEfg";//lowercase are sharps
		this.midivalueselected = -1;

		this.background.getComponent('mesh').material = this.background.getComponent('mesh').material.clone();

		this.setBackgroundColour(false);
	}



	//set the current octave
	CTRL_OctaveUp() {
		if (this.CurrentOctave < 10) {
			this.CurrentOctave++;
			if (!this.musicmanref.InKeySelect) {
				this.updateCurrentNoteText();//.TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:" + this.musicmanref.CurrentKey+"-"+ String(this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave);
				this.setBackgroundColour(false);
			}
		}
	}
	//set the current octave
	CTRL_OctaveDown() {
		if (this.CurrentOctave >= 0) {
			this.CurrentOctave--;
			if (!this.musicmanref.InKeySelect) {
				this.updateCurrentNoteText();// TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:" + this.musicmanref.CurrentKey+"-" + String(this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave);
				this.setBackgroundColour(false);
			}
		}
	}
	//toggle key set window
	CTRL_OpenSetKeyWindow() {
		if (this.musicmanref.InKeySelect) {
			//restore normal mode
			this.musicmanref.SelectKey("Cancel");
			this.setBackgroundColour(false);

			if (this.ScreenBlocker) this.ScreenBlocker.active = false;
			if (this.ScreenFader) this.ScreenFader.active = false;
		}
		else {
			//Set text of notes window				
			this.musicmanref.changeScale(0);
			this.setBackgroundColour(true);

			//if (this.ScreenBlocker) this.ScreenBlocker.active = true;
			if (this.ScreenFader) this.ScreenFader.active = true;
			this.musicmanref.InKeySelect = true;
		}
	}



	setBackgroundColour(inkeySelect) {
		if (inkeySelect)
			this.background.getComponent('mesh').material.color = MaterialScheme.NoteSelect_BackGroundColour_InKeySelect;
		else
			this.background.getComponent('mesh').material.color = MaterialScheme.GetOctaveColour(this.CurrentOctave);// GetNoteColour(this.musicmanref.CurrentKey);
	}

	updateCurrentNoteText() {
		this.TextObject.getComponent('text').text = "Current Octave:" + this.musicmanref.CurrentKey + "+" + String(this.CurrentOctave);
		//if current note is selected lets display that too
		if (this.midivalueselected > -1) {
			this.TextObject.getComponent('text').text += " : Midi Note " + this.midivalueselected;
		}
	}
	setCurrentNoteValue(v) {
		if (v == null)
			this.midivalueselected = -1;
		else
			this.midivalueselected = v;
		this.updateCurrentNoteText();
	}


	IfHereRemoveSlotOnSpanchorPanel(caller) {
		if (this.selectedSpanchorSlot.includes(caller)) {
			this.selectedSpanchorSlot = this.selectedSpanchorSlot.filter(item => item !== caller);
			return true;
		}
		return false;
	}

	//A button on the main planel is click, store it in preparation of the note
	//was called ChooseNote(caller)
	ChooseSlotOnSpanchorPanel(caller) {
		//if(this.selectedSpanchorSlot.includes(caller))
		//	return true;
		//store which button was pressed
		this.selectedSpanchorSlot.push(caller);
		//return false;
	}

	//set the note in the button
	//was called SelectActualNote(nt,oct)
	SetSpanchorSlotToNote(nt, intervalV)//,oct)	
	{
		//if(oct==null)
		//	oct=this.CurrentOctave;
		if (this.selectedSpanchorSlot.length > 0) {
			//console.log("nt is ",nt);
			this.selectedSpanchorSlot.forEach(element => {
				//	console.log(element);
				element.setNoteText(nt);//,oct);
				element.intervalValue = intervalV;

				//if(this.musicmanref.in_drum)
			//	{
					
			//	}
				//	element.backupMaterial=MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(this.notevalue));

				element.restoreMaterial();
			});

			this.selectedSpanchorSlot = [];
		}
		else {
			console.log("Need to select slot first");
		}
	}

	clearSelected() {
		this.selectedSpanchorSlot.forEach(element => {
			element.restoreMaterial();
		});
		this.selectedSpanchorSlot = [];
	}

	//was called SetNotesToScale
	SetNotesOnNoteSelectorToScale() {
		this.NoteSelector.forEach((element, index) => {
			element.getComponent('UI_Button').notevalue = this.musicmanref.GetMidiValueOfNoteInScale(index, 0, false);//octave will be added when using
			element.getComponent('UI_Button').intervalValue = index;//this.musicmanref.GetIntervalValueOfPosition(index);
			//console.log("INTERVALS ",element.getComponent('UI_Button').intervalValue);
		});
	}

	//was called UpdateNotes
	UpdateNotesOnNoteSelectorActive(newsize) {
		if (newsize != -1) {
			this.noteColliderSize = newsize;
		}
		//console.log("SELECT LEN ",this.NoteSelector.length);
		this.NoteSelector.forEach((element, index) => {
			//console.log(`Element at index ${index}: ${element}`); 
			//let t=element.getComponent('UI_Button').updateButtonText(false);//(true,false);

			//if(t=="-")
			if (element.getComponent('UI_Button').notevalue == -1) {
				element.active = false;

				element.getComponent('collision').radius = 0;

				let children = element.children;
				////for (let i = 0; i < children.length; i++) { children[i].active=false; }
				children.forEach(function (element) {
					element.active = false;
				});
			}
			else {
				element.getComponent('UI_Button').updateButtonText(false);//(true,false);			
				element.active = true;

				element.getComponent('collision').radius = this.noteColliderSize;

				let children = element.children;
				////for (let i = 0; i < children.length; i++) { children[i].active=false; }
				//children.forEach(function (element) { element.active = true; });
				for (let i = 0; i < children.length; i++) { 
					if(this.musicmanref.in_drum || i<2) children[i].active=true; }//#2 is the drum
			}
		});
	}

	UpdateSlots() {
		console.log("update slots ", this.musicmanref.CurrentScaleInterval);

		this.NoteSlots.forEach((element, index) => {
			//	console.log(`Element at index ${index}: ${element}`); 

			//get the note name from the string as the ones below will be the new one
			const oldvalue = element.getComponent('UI_Button').object.children[0].getComponent('text').text;
			if (oldvalue != null && oldvalue != "") {
				let oldnote = oldvalue[0];
				if (oldvalue[1] == '#') {
					//oldnote += "#";
					oldnote = oldnote.toLowerCase();
				}
				const noteIndex = this.musicmanref.CurrentScale.indexOf(oldnote);

				if (noteIndex === -1 || element.getComponent('UI_Button').intervalValue < this.musicmanref.CurrentScaleInterval.length) {
					const wewere = element.getComponent('UI_Button').notevalue;//Get what note we were (starting point of search)
					const newinterval = this.musicmanref.GetIntervalValueOfPosition(element.getComponent('UI_Button').intervalValue);//get the old interval value which is no use
					//what note we want
					const Note = this.musicmanref.getNoteAtInterval(newinterval);//the new note,why do we need

					//what interval were we and what are we now?
					//	element.getComponent('UI_Button').intervalValue=this.musicmanref.GetIntervalValueOfPosition(index);

					//console.log("oldnote:", oldnote, " New interval ", newinterval, "  New note ", Note," intervalvalue ",element.getComponent('UI_Button').intervalValue);

					//find closest eg "C" to wewere
					element.getComponent('UI_Button').notevalue = this.musicmanref.findNearestNote(Note, wewere);
					//console.log("oldnote:", oldnote, " New note ",  this.musicmanref.midiToNoteName(element.getComponent('UI_Button').notevalue));

					//we need to set the interval value here

					element.getComponent('UI_Button').updateButtonText(true);//false,true);
				}
			}
		});
	}

	storeButtonNoteSelector(b) {
		if (this.NoteSelector == null) {
			this.NoteSelector = [];
		}
		this.NoteSelector.push(b);
		//console.log("select this.NoteSelector length ",this.NoteSelector.length);
	}

	storeButtonMainSpanchor(b)
	//was called storeButtonMain
	{
		if (this.NoteSlots == null) {
			this.NoteSlots = [];
		}
		this.NoteSlots.push(b);
		//console.log("select NoteSlots length ", this.NoteSlots.length);
	}

}
