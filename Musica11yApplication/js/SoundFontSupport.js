import { Component, Property } from '@wonderlandengine/api';
import { SplendidGrandPiano, Soundfont } from "smplr";
import { Soundfont2Sampler } from "smplr";
import { SoundFont2 } from "soundfont2";


class MyClass {
	constructor(fname, val, folder) {
		this.filename = fname; // the name of the file of the sound font
		this.val = val; // Unique Integer property for quick access 
		this.SoundFontSampler = null;//the actual soundfont
		this.folder = folder;
		this.nfo = null;
		this.soundFontIsDrumKit=false;
	}
}

/**
 * SoundFontSupport
 */
export class SoundFontSupport extends Component {
	static TypeName = 'SoundFontSupport';
	/* Properties that are configurable in the editor */
	static Properties = {
		SoundFontTextArea: Property.object(),//the name of the sound font on screen
		layerman: Property.object(), //all the layers
		panelowner: Property.object(), //the first layer
		soundfontlistpanel: Property.object(),
		SoundFontTextNfoArea: Property.object(),
		drumimageManger: Property.object(),
	};




	context = new AudioContext(); // create the audio context
	//	marimba = new SplendidGrandPiano(this.context); // create and load the instrument


	start() {

		this.allfoldersNames=[];

		this.fontinfolderlist = [];
		//this.files = [];
		this.soundfontholder = [];

		this.soundfontholder.push(new MyClass("SplendidGrandPiano", 0, "Pianos"));//create the default sound font
		this.soundfontholder[0].SoundFontSampler = new SplendidGrandPiano(this.context);

		//update the screen text to point to this
		this.SoundFontTextArea.getComponent('text').text = "Soundfont:\n  " + this.soundfontholder[0].filename;

		this.soundfontholder[0].nfo = "Default Piano Sound";
		this.SoundFontTextNfoArea.getComponent('text').text = this.soundfontholder[0].nfo;
		/*this.SoundFontSampler = [];
		//setup default sound 0
		const marimba = new SplendidGrandPiano(this.context);
		this.SoundFontSampler.push(marimba);
		this.SoundFontSampler[0].instrumentNames=["SplendidGrandPiano"];
		this.SoundFontTextArea.getComponent('text').text="Soundfont: "+this.SoundFontSampler[0].instrumentNames[0];
*/

		//get list of possible sound fonts
		this.fetchFiles();

		this.currentsample = 0;
		this.subcount = 0;
		/*const sampler = new Soundfont2Sampler(this.context, {
			//url: "https://smpldsnds.github.io/soundfonts/soundfonts/galaxy-electric-pianos.sf2"
			//url: "https://rodneymcconnell.com/testarea/ExpressiveSNES.sf2" //bad format // male.sf2"
			url: "/SoundFonts/Tubular Bells.sf2" //bad format? // male.sf2"
			, createSoundfont: (data) => new SoundFont2(data),
		});
		sampler.load.then(() => {
			this.currentsample=0;
			this.SoundFontTextArea.getComponent('text').text="Soundfont: "+sampler.instrumentNames[0];
			// list all available instruments for the soundfont
			console.log(sampler.instrumentNames);

			// load the first available instrument
			sampler.loadInstrument(sampler.instrumentNames[0]);


			this.marimba = sampler;
		});*/

	}

	// Fetch files from the PHP endpoint
	async fetchFiles() {

		console.log("scan for sf2");
		try {
			// Replace with the URL where your PHP script is hosted
			const response = await fetch('https://musica11y.net/playerman/list_files.php');

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			else {
				const files = await response.json();

				if (files.error) {
					console.error(files.error);
				}
				else {
					/*files.forEach(file => {
						if (file.endsWith('.sf2')) {
							this.soundfontholder.push(new MyClass(file, this.soundfontholder.length));//create the default sound font
						}
					});*/
					files.forEach(entry => {
						if (entry.file.endsWith('.sf2')) {
							console.log("add sf2",entry.file,entry.folder);
							this.soundfontholder.push(new MyClass(entry.file, this.soundfontholder.length, entry.folder));
							if(!this.allfoldersNames.includes(entry.folder)){
								this.allfoldersNames.push(entry.folder);
								console.log("addfolder ",entry.folder)
							}
						}
					});

					this.soundfontlistpanel.getComponent('SoundFontSelectorPanel').set_default_panel();

				}
				/*else {
				//console.log(files); // List of files in the directory
				// Process the files here (e.g., load assets, display them, etc.)
				this.files.forEach(file => {
					
					if (file.endsWith('.sf2')) {
						console.log('Processing file:', file);
						
						const sam = new Soundfont2Sampler(this.context, {
							url: "/SoundFonts/"+file
							, createSoundfont: (data) => new SoundFont2(data),
						});

						sam.load.then(() => {
							this.SoundFontSampler.push(sam);
							//this.currentsample=0;
							//this.SoundFontTextArea.getComponent('text').text="Soundfont: "+sampler.instrumentNames[0];
							// list all available instruments for the soundfont
							console.log(sam.instrumentNames);
							// load the first available instrument
							sam.loadInstrument(sam.instrumentNames[0]);
							//this.marimba = sampler;
							console.log('load soundfile:', sam.instrumentNames[0]);

							this.layerman.getComponent('LayerManager').check_for_missing_soundfonts(sam.instrumentNames[0],this.SoundFontSampler.length-1);
						}).catch(error => {
							console.error('Error loading soundfont for file:', file, error);
					 });
					}
				});
			}*/
			}
		} catch (error) {
			console.log('Failed to fetch files:', error);
		}
	}


	unloadAndload_necessary_soundfonts(thelist) {
		//1: loop through and remove any unused ones to save memory
		//2: loop any new ones
		this.soundfontholder.forEach(file => {
			//if used
			if (thelist.includes(file.val)) {
				if (file.filename != null && file.SoundFontSampler == null) {
					console.log("we need to load ", file.filename);

					const sam = new Soundfont2Sampler(this.context, {
						url: "/SoundFonts/" + file.folder + "/" + file.filename
						, createSoundfont: (data) => new SoundFont2(data),
					});

					sam.load.then(() => {
						file.SoundFontSampler = sam;
						file.soundFontIsDrumKit=file.folder.toLowerCase().includes("drum");
						console.log("is sf ",file.soundFontIsDrumKit," ",file.folder);
						// load the first available instrument
						sam.loadInstrument(sam.instrumentNames[0]);
						//this.marimba = sampler;
						console.log('load soundfile:', sam.instrumentNames[0]);
						console.log(file.filename, " has loaded on ", file.val);
						//this.layerman.getComponent('LayerManager').check_for_missing_soundfonts(sam.instrumentNames[0],this.SoundFontSampler.length-1);
						this.soundfontloadnfo(file);
					}).catch(error => {
						console.error('Error loading soundfont for file:', file.filename, error);
					});
				}
			}
			else if (file.val != 0 && file.SoundFontSampler != null && this.soundfontholder[this.currentsample].filename != file.filename) {//keeping the piano
				file.SoundFontSampler = null;//remove it
				console.log("removing unused font ", file.filename);
			}
		});
	}

	quickload_soundfont(file) {
		const sam = new Soundfont2Sampler(this.context, {
			url: "/SoundFonts/" + file.folder + "/" + file.filename
			, createSoundfont: (data) => new SoundFont2(data),
		});

		sam.load.then(() => {
			file.SoundFontSampler = sam;
			file.soundFontIsDrumKit=file.folder.toLowerCase().includes("drum");
			console.log("is sf ",file.soundFontIsDrumKit," ",file.folder);
			// load the first available instrument
			sam.loadInstrument(sam.instrumentNames[0]);
			//this.marimba = sampler;
			console.log('load soundfile:', sam.instrumentNames[0]);
			console.log(file.filename, " is now loaded on ", file.val);
			//this.layerman.getComponent('LayerManager').check_for_missing_soundfonts(sam.instrumentNames[0],this.SoundFontSampler.length-1);
			this.soundfontloadnfo(file);
		}).catch(error => {
			console.error('Error loading soundfont for file:', file.filename, error);
		});
	}


	truncateTextToLines(text, maxLines, wrapCharsPerLine = 20) {
		const lines = text.split('\n');
		const result = [];
		let lineCount = 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const estimatedWraps = Math.ceil(line.length / wrapCharsPerLine);

			if (lineCount + estimatedWraps > maxLines) {
				// Add only the portion that fits
				const remainingLines = maxLines - lineCount;
				const maxChars = remainingLines * wrapCharsPerLine;
				const truncatedLine = line.slice(0, maxChars).trimEnd();
				result.push(truncatedLine + '…'); // Add ellipsis
				break;
			}

			result.push(line);
			lineCount += estimatedWraps;
		}

		return result.join('\n');
	}

	async soundfontloadnfo(file) {
		//console.log('load soundnfo:', file.filename," ",file.nfo);
		if (file.nfo != null)
			this.SoundFontTextNfoArea.getComponent('text').text = file.nfo;
		else {
			this.SoundFontTextNfoArea.getComponent('text').text = "";
			const nfofname = "/SoundFonts/" + file.folder + "/" + file.filename.substring(0, file.filename.lastIndexOf('.')) + ".txt";
			console.log("load info from " + nfofname);
			try {
				const response = await fetch(nfofname);
				if (!response.ok) {
					console.log(`HTTP error! Status: ${response.status}`);
				}
				else {

					const text = await response.text();
					//console.log(text);
					file.nfo = this.truncateTextToLines(text, 17);
					//file.nfo = text;
					this.SoundFontTextNfoArea.getComponent('text').text = file.nfo;
				}
			} catch (error) {
				console.log('Failed to load nfo files:', error);
			}
		}
	}

	playnote(NoteValue, NoteVelocity) {
		this.context.resume(); // enable audio context after a user interaction/
		//this.marimba.start({ note: NoteValue, velocity: NoteVelocity, duration: 1.5 }); // play the note
		//	this.marimba.start({ note: NoteValue, velocity: NoteVelocity, loop: false}); // play the note
		//this.marimba.start({ note: NoteValue, velocity: NoteVelocity }); // play the note
		//console.log("Note down ",NoteValue);

		if (this.soundfontholder[this.currentsample].SoundFontSampler == null) {
			this.quickload_soundfont(this.soundfontholder[this.currentsample]);
			console.log("1OH no the font isnt loaded ", this.soundfontholder[this.currentsample].filename);
		}
		else
			this.soundfontholder[this.currentsample].SoundFontSampler.start({ note: NoteValue, velocity: NoteVelocity });
		//this.SoundFontSampler[this.currentsample].start({ note: NoteValue, velocity: NoteVelocity });
	}

	stopnote()//NoteValue) //passing a note will stop that specific note unless the note is looping then it will never stop
	{
		//this.marimba.stop({ note: NoteValue});
		//this.marimba.stop({ note: NoteValue, velocity: 0, fadeOut: 0.1 });
		//	this.marimba.stop({ note: NoteValue, velocity: 0, loop: false });
		//this.marimba.stop();//{ note: NoteValue });
		//	console.log("Note up ",NoteValue);

		//this.SoundFontSampler[this.currentsample].stop();
		if (this.soundfontholder[this.currentsample].SoundFontSampler == null)
			console.log("2OH no the font isnt loaded ", this.soundfontholder[this.currentsample].filename);
		else
			this.soundfontholder[this.currentsample].SoundFontSampler.stop()
	}

	stopallsounds() {
		for (let i = 0; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].SoundFontSampler != null)
				this.soundfontholder[i].SoundFontSampler.stop()
		}
	}


	playsoundfontnote(fontnumber, NoteValue, NoteVelocity) {
		this.context.resume();
		//	this.SoundFontSampler[fontnumber].start({ note: NoteValue, velocity: NoteVelocity });
		if (this.soundfontholder[fontnumber].SoundFontSampler == null)
			console.log("3OH no the font isnt loaded ", this.soundfontholder[this.currentsample].filename, "  font#", this.currentsample);
		else {
			console.log("we are playing font ", fontnumber);
			this.soundfontholder[fontnumber].SoundFontSampler.start({ note: NoteValue, velocity: NoteVelocity });
		}
	}

	getsoundfontisdrum(fontnumber)
	{
		return this.soundfontholder[fontnumber].soundFontIsDrumKit;
	}


	stopsoundfontnote(fontnumber) {
		//this.SoundFontSampler[fontnumber].stop();
		if (this.soundfontholder[fontnumber].SoundFontSampler == null)
			console.log("4OH no the font isnt loaded ", this.soundfontholder[this.currentsample].filename);
		else
			this.soundfontholder[fontnumber].SoundFontSampler.stop();
	}


	get_next_font() {
		/*this.subcount++;
		if (this.subcount >= this.SoundFontSampler[this.currentsample].instrumentNames.length) {
			this.currentsample++;
			if (this.currentsample >= this.SoundFontSampler.length) {
				this.currentsample = 0;
			}
			this.subcount = 0;
		}
		this.SoundFontTextArea.getComponent('text').text = "Soundfont: " + this.SoundFontSampler[this.currentsample].instrumentNames[this.subcount];
		*/

		const currentFolder = this.soundfontholder[this.currentsample].folder;


		console.log("current folder ",currentFolder);

		//this.allfoldersNames
		const index = this.allfoldersNames.indexOf(currentFolder);

		console.log("current  ",index,this.allfoldersNames.length);

		
		const nextIndex = (index + 1) % this.allfoldersNames.length;

		console.log("next ",nextIndex);
		//const nextFolder = folders[nextIndex];
		let foundfolder = -1;
		for (let i = 0; i < this.soundfontholder.length; i++) {
				if (this.soundfontholder[i].folder == this.allfoldersNames[nextIndex]) {
					foundfolder = i;
					break;
				}
			}

		console.log("folder", foundfolder,this.allfoldersNames[nextIndex]);

		//lets loop until next folder
		/*let foundfolder = -1;
		for (let i = this.currentsample; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].folder != currentfolder) {
				foundfolder = i;
				break;
			}
		}
		//lets search from 0 instead
		if (foundfolder == -1) {
			for (let i = 0; i < this.currentsample; i++) {
				if (this.soundfontholder[i].folder != currentfolder) {
					foundfolder = i;
					break;
				}
			}
		}*/
		if (foundfolder > -1) {
			this.currentsample = this.get_top_font_in_folder(this.soundfontholder[foundfolder].folder);//foundfolder;
			//	if (this.currentsample >= this.soundfontholder.length) {
			//			this.currentsample = 0;
			//		}
			/*	this.SoundFontTextArea.getComponent('text').text = "Soundfont: " + this.soundfontholder[this.currentsample].filename;
	
	
				if (this.panelowner) {
					this.panelowner.getComponent('LayerAnchorDataStorage').updatevalues(this.currentsample, this.subcount);
				}*/

			/*if(this.marimba!=null && this.marimba.instrumentNames!=null)
			{
				this.currentsample++;
				if(this.currentsample>=this.marimba.instrumentNames.length)
					this.currentsample=0;
	
				this.SoundFontTextArea.getComponent('text').text="Soundfont: "+this.marimba.instrumentNames[this.currentsample];
				this.marimba.loadInstrument(this.marimba.instrumentNames[this.currentsample]);
			}*/
		}
		return this.soundfontholder[this.currentsample].folder;
	}

	get_top_font_in_folder(f) {
		this.fontinfolderlist.length = 0;
		for (let i = 0; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].folder == f) {
				return i;
			}
		}
		return 0;
	}

	setsoundfont(f) {
		console.log("looking for ",f);
		for (let i = 0; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].filename == f) {

				console.log("drumfolder is ",this.soundfontholder[i].folder);
				this.soundfontholder[i].soundFontIsDrumKit=this.soundfontholder[i].folder.toLowerCase().includes("drum");

				console.log("drum is ",this.soundfontholder[i].soundFontIsDrumKit);
				if(this.soundfontholder[i].soundFontIsDrumKit)
				{
					this.drumimageManger.getComponent('DrumImageHolder').enable_the_drums();
				}
				else
				{
					this.drumimageManger.getComponent('DrumImageHolder').disable_the_drums();
				}
				//free the 
				if (this.soundfontholder[this.currentsample].SoundFontSampler != null) {
					this.stopallsounds();
					//this.stopnote();
					if (this.currentsample != 0)
						this.soundfontholder[this.currentsample].SoundFontSampler = null;//remove it
				}
				this.currentsample = i;
				this.SoundFontTextArea.getComponent('text').text = "Soundfont:\n  " + this.soundfontholder[this.currentsample].filename;
				if (this.panelowner) {
					console.log("UPDATE VALUES");
					this.panelowner.getComponent('LayerAnchorDataStorage').updatevalues(this.currentsample, this.subcount);
				}
				else {
					console.log("CANNTO UPDATE VALUES IT WAS NULL");
				}
				if (this.soundfontholder[this.currentsample].SoundFontSampler == null) {
					this.quickload_soundfont(this.soundfontholder[this.currentsample]);
				}
				break;
			}
		}
	}

	get_all_fonts_in_folder(f) {
		this.fontinfolderlist.length = 0;
		for (let i = 0; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].folder == f) {
				this.fontinfolderlist.push(this.soundfontholder[i].filename);
			}
		}
	}

	get_prev_font() {
		/*this.subcount--;
		if (this.subcount < 0) {
			this.currentsample--;
			if (this.currentsample < 0) {
				this.currentsample = this.SoundFontSampler.length - 1;
			}
			this.subcount = this.SoundFontSampler[this.currentsample].instrumentNames.length - 1;
		}
		this.SoundFontTextArea.getComponent('text').text = "Soundfont: " + this.SoundFontSampler[this.currentsample].instrumentNames[this.subcount];
		*/
		const currentFolder = this.soundfontholder[this.currentsample].folder;

		// Find the index of the current folder
		const index = this.allfoldersNames.indexOf(currentFolder);

	console.log("index ",index);

		const prevIndex = (index - 1 + this.allfoldersNames.length) % this.allfoldersNames.length;

	console.log("prevIndex",prevIndex);
	

		//const prevFolder = folders[prevIndex];
		let foundfolder = -1;
		for (let i = 0; i < this.soundfontholder.length; i++) {
				if (this.soundfontholder[i].folder == this.allfoldersNames[prevIndex]) {
					foundfolder = i;
					break;
				}
			}
	console.log("folder", foundfolder,this.allfoldersNames[prevIndex]);

/*

		//lets loop until next folder
		let foundfolder = -1;
		for (let i = this.currentsample; i >= 0; i--) {
			if (this.soundfontholder[i].folder != currentfolder) {
				foundfolder = i;
				break;
			}
		}
		//lets search from top instead
		if (foundfolder == -1) {
			for (let i = this.soundfontholder.length - 1; i > this.currentsample; i--) {
				if (this.soundfontholder[i].folder != currentfolder) {
					foundfolder = i;
					break;
				}
			}
		}*/
		if (foundfolder > -1) {
			//this.currentsample = foundfolder;
			this.currentsample = this.get_top_font_in_folder(this.soundfontholder[foundfolder].folder);
			//	this.currentsample--;
			//	if (this.currentsample < 0) {
			//		this.currentsample = this.soundfontholder.length - 1;
			//	}
			/*	this.SoundFontTextArea.getComponent('text').text = "Soundfont: " + this.soundfontholder[this.currentsample].filename;
	
	
				if (this.panelowner) {
					this.panelowner.getComponent('LayerAnchorDataStorage').updatevalues(this.currentsample, this.subcount);
				}*/

			/*if(this.marimba!=null && this.marimba.instrumentNames!=null)
				{
					this.currentsample--;
					if(this.currentsample<0)
						this.currentsample=this.marimba.instrumentNames.length-1;
					if(this.currentsample<0)
						this.currentsample=0;
					this.SoundFontTextArea.getComponent('text').text="Soundfont: "+this.marimba.instrumentNames[this.currentsample];
					this.marimba.loadInstrument(this.marimba.instrumentNames[this.currentsample]);
				}	*/
		}
		return this.soundfontholder[this.currentsample].folder;
	}

	/*get_soundfont(cursample, subcount) {
		return this.soundfontholder[this.currentsample].filename;//this.SoundFontSampler[thiscursample].instrumentNames[subcount];
	}*/

	getisdrum()
	{
		return this.soundfontholder[this.currentsample].soundFontIsDrumKit;
	}

	update_soundfont_screenprompt(panel, cursample, subcount) {
		console.log("set current font to ", cursample);
		this.panelowner = panel;
		this.currentsample = cursample;
		this.subcount = subcount;
		this.SoundFontTextArea.getComponent('text').text = "Soundfont:\n  " + this.soundfontholder[this.currentsample].filename;//this.SoundFontSampler[this.currentsample].instrumentNames[this.subcount];
	}

	get_soundfont_screenprompt(cursample, subcount) {
		return this.soundfontholder[cursample].filename;//this.SoundFontSampler[cursample].instrumentNames[subcount];
	}

	findsoundfont(what) {
		this.foundfont = 0;
		this.foundsub = 0;

		//this.soundfontholder[this.currentsample].

		for (let i = 0; i < this.soundfontholder.length; i++) {
			if (this.soundfontholder[i].filename == what) {
				this.foundfont = i;
				this.foundsub = j;
				return 1;
			}
		}
		/*for (let i = 0; i < this.SoundFontSampler.length; i++) {
			for (let j = 0; j < this.SoundFontSampler[i].instrumentNames; j++) {
				if (this.SoundFontSampler[i].instrumentNames[j] == what) {
					this.foundfont = i;
					this.foundsub = j;
					return 1;
				}
			}
		}*/
		console.log("SOUND FONT " + what + " NOT FOUND");
		return -1;
	}
}