import { Component, Property } from '@wonderlandengine/api';

/**
 * DrumImageHolder
 */
export class DrumImageHolder extends Component {
    static TypeName = 'DrumImageHolder';
    /* Properties that are configurable in the editor */
    static Properties = {
        Kick_36: Property.material(), //C2
        RimShot_37: Property.material(),//C#2
        Snare_38: Property.material(),//D2
        Clap_39: Property.material(),//D#2
        ElectroSnare_40: Property.material(),//E2
        LoFloorTom_41: Property.material(),//F2
        HiHatClosed_42: Property.material(),//F#2
        MidTom_43: Property.material(),//G2
        HiHatPedal_44: Property.material(),//G#2
        HiTom_45: Property.material(),//A3
        HiHatOpen_46: Property.material(),//A#3
        CowBell_47: Property.material(),//B3
        Cymbal_48: Property.material(),//C3
        CrashCymbal_49: Property.material(),//C#3
        keybuttonholder: Property.object(),
        NoteSelectorObject: Property.object(),
    };


    start() {
        this.musicmanref = this.object.getComponent('MusicManagement');
        this.musicmanref.in_drum = false;
    }

    enable_the_drums()
    {
        console.log("enable the drum");
        if(this.musicmanref.in_drum)
            return;

        this.toggle_all_to_drums();
    }

    disable_the_drums()
    {
        console.log("disable the drum");
        if(!this.musicmanref.in_drum)
            return;

        this.toggle_all_to_drums();
    }


    toggle_all_to_drums() {
        this.musicmanref.in_drum = !this.musicmanref.in_drum;

        console.log("indrum",this.musicmanref.in_drum);

        if (this.musicmanref.in_drum) {
            this.backupOctave = this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave;
            this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave = 3;
            this.NoteSelectorObject.getComponent('NoteSelector').CTRL_OctaveDown();

            this.backupkey = this.musicmanref.CurrentKey;
            this.musicmanref.CurrentKey = 'C';

            this.backupScale = this.musicmanref.CurrentScaleInterval;

//console.log("bk:",this.backupScale);//TTSTTTS

            this.musicmanref.setScale("SSSSSSSSSSSS", false);
        }
        else {
            this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave = this.backupOctave + 1;
            this.NoteSelectorObject.getComponent('NoteSelector').CTRL_OctaveDown();

            this.musicmanref.previousScaleInterval = this.backupScale;
            this.musicmanref.SelectKey(this.backupkey)
        }


        let oct = this.NoteSelectorObject.getComponent('NoteSelector').CurrentOctave * 12;

        //loop through all the buttons on the left
        this.keybuttonholder.getComponent('generate-buttons').buttons.forEach((element, index) => {

            let o = this.musicmanref.in_drum;
            let nv = element.getComponent('UI_Button').notevalue;
            if (nv < 0)
                o = false;
            else nv += oct;

            o = this.set2drum(o, nv, element.getComponent('UI_Button').DrumImage.getComponent('mesh'));

            element.getComponent('UI_Button').DrumImage.getComponent('mesh').active = o;

            // console.log(element.getComponent('UI_Button').notevalue,nv);
            // element.children[0].getComponent('text').text="X";

        });


        //loop through all the spanchor
        const SpanchorPtr = this.musicmanref.NoteSelector.getComponent('NoteSelector');//.NoteSlots

        SpanchorPtr.NoteSlots.forEach((element) => {
            if (element.getComponent('UI_Button').active) {
                //element.getComponent('UI_Button').intervalValue = tempArrayIntervals[cntr];
                //	element.getComponent('UI_Button').notevalue = tempArray[cntr++];
                //element.getComponent('UI_Button').updateButtonText(true);

                let o = this.musicmanref.in_drum;
                let nv = element.getComponent('UI_Button').notevalue;
                if (nv < 0)
                    o = false;
                o = this.set2drum(o, nv, element.getComponent('UI_Button').DrumImage.getComponent('mesh'));

                element.getComponent('UI_Button').DrumImage.getComponent('mesh').active = o;
            }
        });

        //ensure future spanchors are all drum/non DONE
        //ensure vr area knows this too DONE

        //DONE
        //on enable we set the octive to 2
        //on enable we set the key to C 
        //on enable we set the scale to chromic
        //on disable we restore

        //DONE fill needs to understand this too [intelligent drum patterns would be nice]

       
        //TODO detect panel drum mode by soundfont and hide below test button (also need detection in the live area)
        //TODO dont allow a non-sequencer panel to play as a sequence its a mess

    }

    set2drum(o, nv, mesh) {
        //  console.log("drmnote: ",nv);
        switch (nv) {
            case 36: mesh.material = this.Kick_36; break;
            case 37: mesh.material = this.RimShot_37; break;
            case 38: mesh.material = this.Snare_38; break;
            case 39: mesh.material = this.Clap_39; break;
            case 40: mesh.material = this.ElectroSnare_40; break;
            case 41: mesh.material = this.LoFloorTom_41; break;
            case 42: mesh.material = this.HiHatClosed_42; break;
            case 43: mesh.material = this.MidTom_43; break;
            case 44: mesh.material = this.HiHatPedal_44; break;
            case 45: mesh.material = this.HiTom_45; break;
            case 46: mesh.material = this.HiHatOpen_46; break;
            case 47: mesh.material = this.CowBell_47; break;
            case 48: mesh.material = this.Cymbal_48; break;
            case 49: mesh.material = this.CrashCymbal_49; break;
            default:
                return false;
                break;
        }
        return o;
    }


}
