import { Component, Property } from '@wonderlandengine/api';

import { MaterialScheme } from './MaterialScheme';

/**
 * TestModeSequencePlayer
 */
export class TestModeSequencePlayer extends Component {
    static TypeName = 'TestModeSequencePlayer';
    /* Properties that are configurable in the editor */
    static Properties = {
        layerManager: Property.object(), //dont need this as we are just playing the live panel
        NewMusicPlayer: Property.object(),
    };

    start() {
        this.layerManager = this.layerManager.getComponent('LayerManager');
    }

    update(deltaTime) {
        if (this.isplaying){// && this.weseq == 1) {
            this.elapsedTime += deltaTime;
            if (this.elapsedTime >= this.beatInterval) {
                this.elapsedTime -= this.beatInterval;

                this.beatInterval = 60 / this.musicmanref.bpm;

                if (this.notevalue >= 0)
                    this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
                this.notevalue = -1;

                //just play current panel
                if (this.currentposition >= 0) {
                    for (let i = 0; i < this.atonce; i++) {
                        let np = (i * this.allcolen) + this.currentposition;
                        if (this.isplaying && this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').active) {
                            this.SpanchorPtr.NoteSlots[np].children[1].getComponent("mesh").material.color = MaterialScheme.SEQUENCER_InActiveNote;
                            this.notevalue = this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').notevalue;
                            this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
                        }
                    }
                }

                this.currentposition++;
                if (this.currentposition >= this.collen) {
                    if (this.loop == 1)
                        this.currentposition = 0;
                    else
                        this.isplaying = false;
                }
                //console.log("BEAT ", this.currentposition);
                for (let i = 0; i < this.atonce; i++) {
                    let np = (i * this.allcolen) + this.currentposition;
                    if (this.isplaying && this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').active) {
                        this.SpanchorPtr.NoteSlots[np].children[1].getComponent("mesh").material.color = MaterialScheme.SEQUENCER_ActiveNote;
                        //console.log("ready");
                        this.notevalue = this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').notevalue;
                        this.musicmanref.SoundFontPlayer.playsoundfontnote(this.soundfont, this.notevalue, 80);
                        // console.log("ok", this.notevalue);
                    }
                }
            }
        }
    }

    TestPlay() {
        console.log('lets try to play');

        const soundfontlist = [];
        for (let i = 0; i < this.layerManager.LayerCount; i++) {
            let sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').left_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);
//console.log("ADDSF ",sf);
            sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').middle_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);
//console.log("ADDSF ",sf);
            sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').right_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);
//console.log("ADDSF ",sf);
        }

        console.log("we need this amount of soundfonts ", soundfontlist.length);
        this.object.getComponent("SoundFontSupport").unloadAndload_necessary_soundfonts(soundfontlist);

        //we need BPM
        this.musicmanref = this.object.getComponent("MusicManagement"); //to get this.musicman.bpm
        this.beatInterval = 60 / this.musicmanref.bpm;
        this.isplaying = true;
        this.currentposition = -1;
        this.notevalue = -1;
        this.soundfont = 0;
        this.loop = 0;
        this.elapsedTime = 0;


     //   this.loop = this.layerManager.layerbuttons[this.layerManager.CurrentLayer].getComponent('LayerAnchorDataStorage').WeLoop[this.layerManager.ActivePanel];

        this.loop=this.NewMusicPlayer.getComponent('NewMusicPlayer').looping;

        if (this.layerManager.ActivePanel == 0)
            this.soundfont = this.layerManager.layerbuttons[this.layerManager.CurrentLayer].getComponent('LayerAnchorDataStorage').left_soundfont;
        if (this.layerManager.ActivePanel == 1)
            this.soundfont = this.layerManager.layerbuttons[this.layerManager.CurrentLayer].getComponent('LayerAnchorDataStorage').middle_soundfont;
        if (this.layerManager.ActivePanel == 2)
            this.soundfont = this.layerManager.layerbuttons[this.layerManager.CurrentLayer].getComponent('LayerAnchorDataStorage').right_soundfont;

        this.weseq = this.layerManager.layerbuttons[this.layerManager.CurrentLayer].getComponent('LayerAnchorDataStorage').WeSequence[this.layerManager.ActivePanel];

        console.log("OUR SOUNDFONT IS ", this.soundfont, "  activelayer ", this.layerManager.ActivePanel, " currentlayer ", this.layerManager.CurrentLayer);

        this.collen = this.musicmanref.SpanchorGenerator.getComponent('generate-buttons').currentColCntr;
        this.allcolen = this.musicmanref.SpanchorGenerator.getComponent('generate-buttons').columns;
        this.atonce = this.musicmanref.SpanchorGenerator.getComponent('generate-buttons').currentRowCntr;
        this.SpanchorPtr = this.musicmanref.NoteSelector.getComponent('NoteSelector');
    }

    EndTestPlay() {
        console.log("END TEST PLAY");
        this.isplaying = false;
        if (this.currentposition >= 0) {
            for (let i = 0; i < this.atonce; i++) {
                let np = (i * this.allcolen) + this.currentposition;
                if (this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').active) {
                    this.SpanchorPtr.NoteSlots[np].children[1].getComponent("mesh").material.color = MaterialScheme.SEQUENCER_InActiveNote;
                    this.notevalue = this.SpanchorPtr.NoteSlots[np].getComponent('UI_Button').notevalue;
                    this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
                }
            }
        }
    }
}
