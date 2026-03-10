import { Component, Property } from '@wonderlandengine/api';
import { MaterialScheme } from './MaterialScheme';

/**
 * MusicManagement
 */
export class MusicManagement extends Component {
	static TypeName = 'MusicManagement';
	/* Properties that are configurable in the editor */
	static Properties = {
		NoteSelector: Property.object(),
		NoteGenerator: Property.object(),
		CurrentScale: Property.string("CDEFG"),
		//CurrentKey: Property.string(["C","D"]),
		CurrentKey: Property.string("C"),
		ToggleMainPanelTranspose: Property.object(),
		SpanchorGenerator: Property.object(),
		PlayModeButton: Property.object(),
		TestModeButton: Property.object(),
		PlayModeManager: Property.object(),
		TestModeButtonStop: Property.object(),
		TestModeButtonPlayDisableImage: Property.object(),
		TestModeButtonStopDisableImage: Property.object(),
		virtualkeyboard: Property.object(),
		filelistwindow: Property.object(),
	};

	//middle C is 60

	ScaleName1 = "Major";
	ScaleName2 = "Natural Minor";
	ScaleName3 = "Harmonic Minor";
	ScaleName4 = "Melodic Minor";
	ScaleName5 = "Pentatonic";
	ScaleName6 = "Chromatic";
	Scale1 = "TTSTTTS";//MAJOR Example: C Major: C-D-E-F-G-A-B-C
	Scale2 = "TSTTSTT"; //Natural Minor Scale A Minor: A-B-C-D-E-F-G-A
	Scale3 = "TSTTS+S"; //Harmonic Minor Scale Example: A Harmonic Minor: A-B-C-D-E-F-G#-A
	Scale4 = "TSTTTTS"; //Melodic Minor Scale (Ascending) Example: A Melodic Minor (Ascending): A-B-C-D-E-F#-G#-A
	Scale5 = "TT+T+"; //Pentatonic Scale (Major) Example: C Major Pentatonic: C-D-E-G-A-C
	//+ == TONE + SEMI
	Scale6 = "SSSSSSSSSSSS";//all notes

	static InTestMode = false;
	static InKeySelect = false;


	start() {
		this.virtualkeyboard = this.virtualkeyboard.getComponent('VirtualKeyboard');
		this.filelistwindow = this.filelistwindow.getComponent('SongFileSelectionWindow');

		this.bpm = 120;
		this.InTestMode = false;
		this.InPlayMode = false;
		this.InKeySelect = false;
		this.CurrentScaleInterval = this.Scale6;//this.Scale1;
		//console.log('current scale length', this.CurrentScale.length);
		this.SoundFontPlayer = this.object.getComponent("SoundFontSupport");
		this.TestModeButton.getComponent('mesh').material.color = MaterialScheme.neonGreen;
		this.PlayModeButton.getComponent('mesh').material.color = MaterialScheme.neonGreen;
	}

	// returns a string with the name for the scale number which
	GetScaleName(which) {
		switch (which) {
			case 1: return this.ScaleName1; break;
			case 2: return this.ScaleName2; break;
			case 3: return this.ScaleName3; break;
			case 4: return this.ScaleName4; break;
			case 5: return this.ScaleName5; break;
			case 6: return this.ScaleName6; break;
		}
	}


	CTRL_TogglePlayMode() {
		this.InPlayMode = !this.InPlayMode;
		MusicManagement.InPlayMode = this.InPlayMode;


		if (this.InPlayMode) {

			//let c = this.which_child_has_text(this.PlayModeButton);
			//if (c > -1)
			//	this.PlayModeButton.children[c].getComponent('text').text = "EDIT";
			this.PlayModeButton.getComponent('mesh').material.color = MaterialScheme.BUTTON_TestMode_Active;
			const row = this.SpanchorGenerator.getComponent('generate-buttons').currentRowCntr;
			const col = this.SpanchorGenerator.getComponent('generate-buttons').currentColCntr;
			const maxcol = this.SpanchorGenerator.getComponent('generate-buttons').columns;
			this.PlayModeManager.getComponent('PlayModeManager').SetupforplayMode(row, col, maxcol);
		}
		else {
			//	let c = this.which_child_has_text(this.PlayModeButton);
			//	if (c > -1)
			//		this.PlayModeButton.children[c].getComponent('text').text = "PLAY VR";
			this.PlayModeButton.getComponent('mesh').material.color = MaterialScheme.neonGreen;

			this.PlayModeManager.getComponent('PlayModeManager').endPlayMode();
		}
	}

	which_child_has_text(parent) {
		for (let i = 0; i < parent.children.length; i++) {
			let child = parent.children[i];
			if (child.getComponent('text')) {
				return i;
				break;
			}
		}
		return -1;
	}


	CTRL_ToggleTestMode() {
		this.InTestMode = !this.InTestMode;
		MusicManagement.InTestMode = this.InTestMode;
		if (this.InTestMode) {
			this.TestModeButtonStop.getComponent('collision').active = false;
			this.TestModeButton.getComponent('collision').active = true;
			this.TestModeButtonPlayDisableImage.getComponent('mesh').active = true;
			this.TestModeButtonStopDisableImage.getComponent('mesh').active = false;

			//let c = this.which_child_has_text(this.TestModeButton);
			//if (c > -1)
			//	this.TestModeButton.children[c].getComponent('text').text = "EDIT";
			//this.TestModeButton.getComponent('mesh').material.color = MaterialScheme.aquaBlue;
		}
		else {
			this.TestModeButtonStop.getComponent('collision').active = true;
			this.TestModeButton.getComponent('collision').active = false;
			this.TestModeButtonPlayDisableImage.getComponent('mesh').active = false;
			this.TestModeButtonStopDisableImage.getComponent('mesh').active = true;

			//let c = this.which_child_has_text(this.TestModeButton);
			//if (c > -1)
			//	this.TestModeButton.children[c].getComponent('text').text = "PLAY 2D";
			//this.TestModeButton.getComponent('mesh').material.color = MaterialScheme.neonGreen;
		}

		if (this.InTestMode)
			this.object.getComponent("TestModeSequencePlayer").TestPlay();
		else this.object.getComponent("TestModeSequencePlayer").EndTestPlay();
	}

	//convert midinumber to a number string (with sharps if necessary)
	// DOES NOT RETURN OCTAVE
	midiToNoteNameNoOctave(midiNumber) {
		const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		const octave = Math.floor(midiNumber / 12) - 1;
		const noteIndex = midiNumber % 12;
		const noteName = noteNames[noteIndex];
		return `${noteName}`;
	}


	//convert midinumber to a number string (with sharps if necessary)
	// This one returns octave
	midiToNoteName(midiNumber) {
		const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		const octave = Math.floor(midiNumber / 12) - 1;
		const noteIndex = midiNumber % 12;
		const noteName = noteNames[noteIndex];
		if (octave < -1)
			return `${noteName}${-1}`;
		return `${noteName}${octave}`;
	}

	//convert from a note and octave to its midi value
	noteNameToMidi(noteName, octave) {
		const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		const noteIndex = noteNames.indexOf(noteName);
		if (noteIndex === -1) {
			console.log('Invalid note name ', noteName, " ", octave);
			return 0;
		}

		octave += 1;
		const midiNumber = ((octave) * 12) + noteIndex;
		//console.log("OCT ",octave);
		//if(octave>2)
		//	console.log("returning ",midiNumber,"  based on ",noteName,octave,"  nodeIndex ",noteIndex,"  ",( ((octave + 1) * 12) + noteIndex));//D1=26   (2*12)+2
		return midiNumber;
	}

	//returns how many semitones to get to note in current scale
	GetIntervalValueOfPosition(note) {
		let currentNotePtr = 0;
		let temp = 0;

		if (this.CurrentScaleInterval == null) {
			this.CurrentScaleInterval = this.Scale1;
			//	console.log("FORCE RESET OF INTERVAL");
		}

		if (note >= this.CurrentScaleInterval.length)
			note -= this.CurrentScaleInterval.length;
		if (note >= this.CurrentScaleInterval.length)
			note -= this.CurrentScaleInterval.length;

		this.CurrentScaleInterval.split('').forEach((character) => {
			if (note > 0) {
				if (character == "S")
					currentNotePtr += 1;
				if (character == "T")
					currentNotePtr += 2;
				if (character == "+")
					currentNotePtr += 3;
			}
			note--;
		});
		return currentNotePtr;
	}

	//returns the midi value of note relative to the current scale, can repeat scale until note found
	GetMidiValueOfNoteInScale(note, octcntr, LoopBeyondScaleLength) {
		if (note >= this.CurrentScale.length) // say we are +12 and scale of 5. 12/5=2. 2*5=12-10=2
		{
			if (!LoopBeyondScaleLength) {
				return -1;
			}

			console.log("goes beyond ", note);

			let n = Math.ceil(note / this.CurrentScale.length);
			note -= (n * this.CurrentScale.length);// + 1;
			octcntr += n;
			console.log("makes oct ", n);
		}
		if (note < 0) {
			if (!LoopBeyondScaleLength) {
				return -1;
			}

			let n = Math.ceil(-note / this.CurrentScale.length); // say we are -24 and scale of 12. --24/12=2. 2*12=24+-12=12
			note += (n * this.CurrentScale.length);// + 1;
			octcntr -= n;
		}

		//		let character = this.CurrentScale[ note - 1 ];
		let character = this.CurrentScale[note];
		//console.log("> ",character," ",note);

		//let oct = "";
		//if(includeoctave)
		//{
		//oct = String(octcntr);
		//}

		if (character === character.toLowerCase()) {
			//console.log("name to get ", character.toUpperCase() + "#", octcntr);
			return this.noteNameToMidi(character.toUpperCase() + "#", octcntr);
		}

		//console.log("name to get ", String(character), octcntr);
		return this.noteNameToMidi(String(character), octcntr);
	}


	//give the position in the scale it returns a note string
	GetStringOfNoteInScale(note, doNotLoop, includeoctave, octcntr)//note)
	{
		//console.log('do not loop is ',doNotLoop," note wanted is ",note);
		//doNotLoop=true;
		//let octcntr=0;
		while (note > this.CurrentScale.length) {
			if (note > this.CurrentScale.length) {
				if (doNotLoop)
					return "-";
				note -= this.CurrentScale.length;
				octcntr++;
			}
		}
		while (note < 1) {
			if (note < 1) {
				if (doNotLoop)
					return "-";
				note += this.CurrentScale.length;
				octcntr--;
			}
		}
		//console.log('note wanted ', note, " in scale ",this.CurrentScale);
		//let character = String.fromCharCode('A'.charCodeAt(0) + note - 1);
		let character = this.CurrentScale[note - 1];
		//console.log("> ",character," ",note);

		let oct = "";
		if (includeoctave) {
			oct = String(octcntr);
		}

		if (character === character.toLowerCase()) {
			return character.toUpperCase() + "#" + oct;
		}

		return String(character) + oct;
	}

	//converts sharps to lower case letter to store note and sharp as one character
	convertKey2OldKey(key) {
		const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		let startIndex = notes.indexOf(key);
		let oldnotes = "CcDdEFfGgAaB";
		return String(oldnotes.charAt(startIndex));
	}

	//returns what note is at the interval
	getNoteAtInterval(interval) {
		//console.log("Get NOTE at interval ",interval);

		//const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		let notes = "AaBCcDdEFfGg";//lowercase is sharp
		let startIndex = notes.indexOf(this.convertKey2OldKey(this.CurrentKey));

		if (startIndex === -1) {
			console.log("Current key not found in notes. ", this.CurrentKey);
			return "";
		}

		// Calculate the new index by adding the interval and wrapping around using modulo
		let newIndex = (startIndex + interval) % notes.length;

		// Handle negative indices
		if (newIndex < 0) {
			newIndex += notes.length;
		}

		// Return the note at the new index
		return notes[newIndex];
	}

	//find nearest note in scale
	findNearestNote(targetNote, targetMidi) {//find nearest "D#" around midi 66 etc
		// MIDI note numbers for a single octave
		const noteMap = {
			// 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
			'C': 0, 'c': 1, 'D': 2, 'd': 3, 'E': 4, 'F': 5, 'f': 6, 'G': 7, 'g': 8, 'A': 9, 'a': 10, 'B': 11
		};

		// Get the semitone offset for the target note
		const targetNoteOffset = noteMap[targetNote];
		if (targetNoteOffset === undefined) {
			console.log('Invalid note: ', targetNote);
			return 0;
		}

		// Calculate MIDI numbers for the target note within the MIDI range
		const targetNotesMidi = [];
		for (let i = 0; i <= 127; i++) {
			if (i % 12 === targetNoteOffset) {
				targetNotesMidi.push(i);
			}
		}

		// Find the closest MIDI note
		let nearestNote = targetNotesMidi[0];
		let minDistance = Math.abs(targetMidi - nearestNote);
		for (let i = 1; i < targetNotesMidi.length; i++) {
			const distance = Math.abs(targetMidi - targetNotesMidi[i]);
			if (distance < minDistance) {
				nearestNote = targetNotesMidi[i];
				minDistance = distance;
			}
		}
		console.log("nearest is ", nearestNote);
		return nearestNote;
	}


	SelectKey(k) {
		//console.log("change key to ",k);
		if (k == "Cancel") {
			this.CurrentKey = this.PreviousKey;
		}
		else {
			this.CurrentKey = k;
		}
		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();//TextObject.getComponent('text').text = "Note Selector\nCurrent Octave:"+ this.CurrentKey+"-" + String(this.NoteSelector.getComponent('NoteSelector').CurrentOctave);

		this.InKeySelect = false;
		this.setScale(this.previousScaleInterval, true)
	}
/*
	ScaleName1 = "Major";
	ScaleName2 = "Natural Minor";
	ScaleName3 = "Harmonic Minor";
	ScaleName4 = "Melodic Minor";
	ScaleName5 = "Pentatonic";
	ScaleName6 = "Chromatic";
*/
	addSemitone(currentKey) 
	{
		const SCALE = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];

        let index = SCALE.indexOf(currentKey);
        if (index == -1) {
            return currentKey;
        }
        // Use modulo to wrap B (index 11) back to C (index 0)
        let nextIndex = (index + 1) % SCALE.size();
        return SCALE.get(nextIndex);
    }


	fixkey()
	{
		switch(this.CurrentKey)
		{
			case "A": this.setKeyA();break;
			case "A#": this.setKeyAs(); break;
			case "B": this.setKeyB();break;
			case "C": this.setKeyC();break;
			case "C#": this.setKeyCs();break;
			case "D": this.setKeyD();break;
			case "D#": this.setKeyDs();break;
			case "E": this.setKeyE();break;
			case "F": this.setKeyF();break;
			case "F#": this.setKeyFs();break;
			case "G": this.setKeyG();break;
			case "G#": this.setKeyGs();break;
		}
	}

    setScaleToMajor()
	{
		//let tk=this.CurrentKey;		
		//this.currentKey=this.addSemitone(this.currentKey);//set key -1 hack required for all these too
		this.changeScale(1);
		//this.CurrentKey=tk;
		this.fixkey();
	}
    setScaleToMinor()
	{
		//let tk=this.CurrentKey;		
		//this.currentKey=this.addSemitone(this.currentKey);//set key -1 hack required for all these too
		this.changeScale(2);
		//this.CurrentKey=tk;
		this.fixkey();
	}
	setScaleToChroma()
	{
		//let tk=this.CurrentKey;		
		//this.currentKey=this.addSemitone(this.currentKey);//set key -1 hack required for all these too
		this.changeScale(6);
		//this.CurrentKey=tk;
		this.fixkey();
	}
	setScaleToPenta()
	{
		//let tk=this.CurrentKey;		
		//this.currentKey=this.addSemitone(this.currentKey);//set key -1 hack required for all these too
		this.changeScale(5);
		//this.CurrentKey=tk;
		//this.SelectKey(this.CurrentKey);
		this.fixkey();
	}
	setKeyA(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("A");//-1 hack
//		this.CurrentKey="A";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyAs(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("A#");//-1 hack
//		this.CurrentKey="A#";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyB(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("B");//-1 hack
//		this.CurrentKey="B";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyC(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("C");//-1 hack
//		this.CurrentKey="C";	
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyCs(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("C#");//-1 hack
//		this.CurrentKey="C#";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyD(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("D");//-1 hack
//		this.CurrentKey="D";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyDs(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("D#");//-1 hack
//		this.CurrentKey="D#";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyE(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("E");//-1 hack
//		this.CurrentKey="E";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyF(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("F");//-1 hack
//		this.CurrentKey="F";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyFs(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("F#");//-1 hack
//		this.CurrentKey="F#";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyG(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("G");//-1 hack 
//		this.CurrentKey="G";
//		this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	setKeyGs(){
		this.previousScaleInterval = this.CurrentScaleInterval;
		this.PreviousKey = this.CurrentKey;
		this.SelectKey("G#");//-1 hack FAIL
		//this.CurrentKey="G#";
		//this.NoteSelector.getComponent('NoteSelector').updateCurrentNoteText();
	}
	changeScale(c) {
		let current = "";
		switch (c) {
			case 0://setkey 
				this.NoteSelector.getComponent('NoteSelector').TextObject.getComponent('text').text = "Select New Key";
				this.InKeySelect = true;
				this.previousScaleInterval = this.CurrentScaleInterval;
				current = "SSSSSSSSSSSS";
				this.PreviousKey = this.CurrentKey;
				this.CurrentKey = "A";
				break;//key selector
			case 1: current = this.Scale1; break;
			case 2: current = this.Scale2; break;
			case 3: current = this.Scale3; break;
			case 4: current = this.Scale4; break;
			case 5: current = this.Scale5; break;
			case 6: current = this.Scale6; break;
		}
		if (c == 0 || current == "SSSSSSSSSSSS")//chromatic will be fine without changing anything
			this.setScale(current, false);
		else
			this.setScale(current, true);
		//this.setScale(current, true);
	}

	setScale(current, updateslots) {
		this.CurrentScaleInterval = current;
		this.CurrentScale = "";
		let charray = current.split('');
		let temp = "";
		let currentNotePtr = 0;
		charray.forEach((character) => {
			temp += this.getNoteAtInterval(currentNotePtr);
			if (character == "S")
				currentNotePtr += 1;
			if (character == "T")
				currentNotePtr += 2;
			if (character == "+")
				currentNotePtr += 3;
		});
		this.CurrentScale = temp;
		//console.log(currentNotePtr);
console.log(this.CurrentScale);
		//update buttons
		this.NoteSelector.getComponent('NoteSelector').SetNotesOnNoteSelectorToScale();//sets the notes on the note selector	
		this.NoteSelector.getComponent('NoteSelector').UpdateNotesOnNoteSelectorActive(-1);//enables/disables the notes on the selector

		if (updateslots && this.InTestMode)// this.ToggleMainPanelTranspose.getComponent('UI_Button').toggleValue) //if in playmode this will happen
		{
			this.NoteSelector.getComponent('NoteSelector').UpdateSlots();
		}

//		this.NoteGenerator.getComponent('generate-buttons').alignsinglerowbuttons();
	}

	GetCurrentScalelength() {
		return this.CurrentScale.length;
	}

	//clears all the anchors
	clearAllSpanchors() {
		const SpanchorPtr = this.NoteSelector.getComponent('NoteSelector');//.NoteSlots
		SpanchorPtr.NoteSlots.forEach((element) => {
			element.getComponent('UI_Button').intervalValue = null;
			element.getComponent('UI_Button').setNoteText(null);//notevalue = -1;
		});
		return;
	}

	//fills all the spanchorsbased on size of grid
	fillAllSpanchors_max() {
		this.fillAllSpanchors(
			this.SpanchorGenerator.getComponent('generate-buttons').columns,
			this.SpanchorGenerator.getComponent('generate-buttons').rows - 1, this.SpanchorGenerator.getComponent('generate-buttons').currentRowCntr);
	}


	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	//
	//  fills all the anchors with a value based on the scale and key
	//	also has an decreasing offset to match the string layout of a guitar
	//
	fillAllSpanchors(colsize, rowsize, visualrowsize) {
		const stepoffset = 5;//everyrow should get a decline

		const SpanchorPtr = this.NoteSelector.getComponent('NoteSelector');//.NoteSlots

		let colcntr = 1;

		if (this.in_drum) {



			const bassrandomInt = this.getRandomInt(1, 10); // Could be any integer from 1 to 10
			const snarerandomInt = this.getRandomInt(1, 10); // Could be any integer from 1 to 10

			SpanchorPtr.NoteSlots.forEach((element) => {
				if (element.getComponent('UI_Button').active) {
					element.getComponent('UI_Button').intervalValue = -1;//tempArrayIntervals[cntr];
					element.getComponent('UI_Button').notevalue = null;//tempArray[cntr++];
					element.getComponent('UI_Button').updateButtonText(true);

					//top to bottom
					//6 row kickDrum (36) C2
					//5     Snare (38)
					//4		crash (49)
					//3		symbol (48)
					//2	 toms 41,43,45
					//1 hithats (46)

					if (rowsize == 0) {//kick drum (every 1 or 4)

						if ((colcntr % 2 == 0 && bassrandomInt > 5) || (colcntr % 4 == 0)) {
							element.getComponent('UI_Button').intervalValue = 36;//tempArrayIntervals[cntr];
							element.getComponent('UI_Button').notevalue = 36;//'C';//tempArray[cntr++];
							element.getComponent('UI_Button').updateButtonText(true);
							element.getComponent('UI_Button').setNoteText(36);
						}
					}

					if (rowsize == 1) {//snare (every two or 4)

						if ((colcntr % 2 == 0 && snarerandomInt > 5) || (colcntr % 4 == 0)) {
							element.getComponent('UI_Button').intervalValue = 38;//tempArrayIntervals[cntr];
							element.getComponent('UI_Button').notevalue = 38;//'C';//tempArray[cntr++];
							element.getComponent('UI_Button').updateButtonText(true);
							element.getComponent('UI_Button').setNoteText(38);
						}
					}

					if (rowsize == 2) {//symbol (every 8 or 16)
						const randomInt = this.getRandomInt(1, 10); // Could be any integer from 1 to 10

						if (randomInt > 8) {
							element.getComponent('UI_Button').intervalValue = 48;//tempArrayIntervals[cntr];
							element.getComponent('UI_Button').notevalue = 48;//'C';//tempArray[cntr++];
							element.getComponent('UI_Button').updateButtonText(true);
							element.getComponent('UI_Button').setNoteText(48);
						}
					}

					if (rowsize == 5) {//hihat (every one or two)

						element.getComponent('UI_Button').intervalValue = 46;//tempArrayIntervals[cntr];
						element.getComponent('UI_Button').notevalue = 46;//'C';//tempArray[cntr++];
						element.getComponent('UI_Button').updateButtonText(true);
						element.getComponent('UI_Button').setNoteText(46);
					}

				}
				colcntr++;
				if (colcntr > colsize)//end of a row
				{
					colcntr = 1;
					rowsize--;
					//cntr = (rowsize * stepoffset);
					visualrowsize--;
					//cntr = (visualrowsize * stepoffset) - 2 - 4 + 12;
				}
			});
			return;
		}




		//make a list of all the notes possible
		let ptr = 0;
		let cntr = this.noteNameToMidi(this.CurrentKey, 0);
		let tempArray = Array(128).fill(0);
		let tempArrayIntervals = Array(128).fill(0);
		let arrptr = 0;
		let interv = 0;
		while (cntr < 128) {
			tempArrayIntervals[arrptr] = ptr;//interv;
			tempArray[arrptr++] = cntr;
			let character = this.CurrentScaleInterval.charAt(ptr);
			if (character == "S") {
				cntr += 1;
				interv += 1;
			}
			else if (character == "T") {
				cntr += 2;
				interv += 2;
			}
			else if (character == "+") {
				cntr += 3;
				interv += 3;
			}
			else {
				cntr++;//just incase
				interv++;
			}
			ptr++;
			if (ptr >= this.CurrentScale.length) {
				ptr = 0;
				interv = 0;
			}
		}

		//put them on screen
		//cntr = (rowsize * stepoffset);
		cntr = (visualrowsize * stepoffset) - 2 - 4 + 12;
		SpanchorPtr.NoteSlots.forEach((element) => {
			if (element.getComponent('UI_Button').active) {
				element.getComponent('UI_Button').intervalValue = tempArrayIntervals[cntr];
				element.getComponent('UI_Button').notevalue = tempArray[cntr++];
				element.getComponent('UI_Button').updateButtonText(true);
			}

			colcntr++;
			if (colcntr > colsize)//end of a row
			{
				colcntr = 1;
				rowsize--;
				//cntr = (rowsize * stepoffset);
				visualrowsize--;
				cntr = (visualrowsize * stepoffset) - 2 - 4 + 12;
			}
		});
		return;
	}

}
