import { Component, Property } from '@wonderlandengine/api';

/**
 * NewMusicPlayer
 */
export class NewMusicPlayer extends Component {
    static TypeName = 'NewMusicPlayer';
    /* Properties that are configurable in the editor */
    static Properties = {
        LoopIcon: Property.object(),
        NonLoopIcon: Property.object(),
        Musicman: Property.object(),
     
    };

    start() {
        this.looping = true;
        this.playing = false;
        this.position = 0;
        this.elapsedTime = 0;
        this.NonLoopIcon.active = false;
        if(this.Musicman)
            this.musicmanref = this.Musicman.getComponent('MusicManagement');
    }

    //Needs reference to spanker
   
/* done in testmodeplayer now
    update(dt) {
        if (this.playing) {
            this.elapsedTime += deltaTime * this.playmul;
            this.beatInterval = 60 / this.musicmanref.bpm;
            if (this.elapsedTime >= this.beatInterval) {
                 this.elapsedTime -= this.beatInterval;
                  this.position++;

                  this.stoplastenotes()
                ///playnote(s) (pass it current note)
                
                //if at end
                if (this.lopping) {
                    this.position = 0;
                    this.elapsedTime = 0;
                }
                else {
                    stopplayer();
                }
            }
        }
    }

    startplayer() {
        this.position = 0;
        this.elapsedTime = 0;
        this.playnote();//pass it first note(s)

console.log(this.musicmanref.NoteSelector[0].getComponent('UI_Button').notevalue);// = CurrentNote;
onsole.log("OK");
        //this.NoteSelector.push(b);

        //    let noteval = Number(n.children[0].name);
        //    if (noteval >= 0) {
                     //   console.log("We have a note on panel", cpanel, " sfont:", this.soundfont, " note:", this.notevalue, " ", this.PanelContainer.children[cpanel].name)
         //               this.notevalue = noteval;
          //              this.musicmanref.SoundFontPlayer.playsoundfontnote(this.soundfont, this.notevalue, 80);
        //      }
    }

    stopplayer() {
        this.playing = false;
        this.stoplastnotes();
    }

    stoplastnotes()
    {
       // this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
        this.musicmanref.SoundFontPlayer.stopallsounds();
        //this.musicmanref.SoundFontPlayer.stopnote();
    }*/

    toggleLoop() {
        this.looping = !this.looping;
        this.NonLoopIcon.active = !this.looping;
        this.LoopIcon.active = this.looping;
    }

   /* playnote() {
            //todo
        this.musicmanref.SoundFontPlayer.playnote(55+this.notevalue,80);
        //	this.musicmanref.SoundFontPlayer.playnote(this.notevalue + (this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12), 80);
		
    }*/
}
