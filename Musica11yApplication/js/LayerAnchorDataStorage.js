import { Component, Property } from '@wonderlandengine/api';

/**
 * LayerAnchorDataStorage
 */
export class LayerAnchorDataStorage extends Component {
    static TypeName = 'LayerAnchorDataStorage';
    /* Properties that are configurable in the editor */
    static Properties = {
        SpanchorRF: Property.object(),
        SoundfontRF: Property.object(),
        // layermanager: Property.object(),
        drumimageManger: Property.object(),
    };


    start() {
        this.WeSequence = [false, false, false];//[true,true,true];
        this.WeLoop = [false, false, false];// [true,true,true];
        this.WeVisible = [true, true, true];

        this.SoundFontPlayer = this.SoundfontRF.getComponent("SoundFontSupport");

        this.LeftPanel = [];
        this.MiddlePanel = [];
        this.RightPanel = [];

        this.SpanchorRef = this.SpanchorRF.getComponent('generate-buttons');

        this.left_soundfont = 0;
        this.left_soundfont_subfont = 0;
        this.middle_soundfont = 0;
        this.middle_soundfont_subfont = 0;
        this.right_soundfont = 0;
        this.right_soundfont_subfont = 0;

        //  this.SoundFontPlayer.panelowner=this.object;//	update_soundfont_screenprompt(panel, cursample, subcount) {
        //  this.cp=1;
    }

    storeSpAnchorValues(which) {
        let temp = [];

        this.SpanchorRef.buttons.forEach(element => {
            temp.push(element.getComponent('UI_Button').notevalue);
        });

        switch (which) {
            case 0: this.LeftPanel = temp; break;
            case 1: this.MiddlePanel = temp; break;
            case 2: this.RightPanel = temp; break;
        }
    }

    updatevalues(fnt, sub) {
        console.log("UPDATE VALUES ", this.cp, " F:", fnt);
        if (this.SoundFontPlayer.panelowner == null)
            console.log("this.SoundFontPlayer.panelowner is null");
        if (this.cp == null) {
            console.log("this.cp is null");
            //  this.layermanager.getComponent('LayerManager').setLeftPanel();
            //  this.layermanager.getComponent('LayerManager').setRightPanel();
        }

        if (this.cp != null) {
            switch (this.cp) {
                case 0: this.left_soundfont = fnt; this.left_soundfont_subfont = sub; break;
                case 1: this.middle_soundfont = fnt; this.middle_soundfont_subfont = sub; break;
                case 2: this.right_soundfont = fnt; this.right_soundfont_subfont = sub; break;
            }
        }

        // console.log("left ",this.left_soundfont);
        console.log("middle ", this.middle_soundfont);
        // console.log("right ",this.right_soundfont);
    }

    getSpAnchorSoundfont(which) {
        switch (which) {
            case 0: return this.SoundFontPlayer.get_soundfont_screenprompt(this.left_soundfont, this.left_soundfont_subfont); break;
            case 1: return this.SoundFontPlayer.get_soundfont_screenprompt(this.middle_soundfont, this.middle_soundfont_subfont); break;
            case 2: return this.SoundFontPlayer.get_soundfont_screenprompt(this.right_soundfont, this.right_soundfont_subfont); break;
        }
    }

    getSpAnchorValues(which, col) {
        let ret = "";
        let temp = [];
        let cc = 0;

        switch (which) {
            case 0: temp = this.LeftPanel; break;
            case 1: temp = this.MiddlePanel; break;
            case 2: temp = this.RightPanel; break;
        }

        if (temp.length == 0)
            temp = new Array(this.SpanchorRef.buttons.length).fill(-1);

        for (let i = 0; i < temp.length; i++) {
            const v = temp[i];//this.SpanchorRef.buttons[i].getComponent('UI_Button').notevalue;
            if (v != null) {
                if (v > -1 && v < 10)
                    ret += " ";
                ret += v;
            }
            else
                ret += "-1";
            ret += ",";
            cc++;
            if (cc >= col) {
                cc = 0;
                ret += "\n";
                if (i < temp.length - 1)
                    ret += "[NS]:";
            }
        }
        return ret;
    }

    setSoundFont(which, fnt, ftnsub, nam) {
        console.log("I set font ", which, " ", fnt);
        switch (which) {
            case 0: this.left_soundfont = fnt; this.left_soundfont_subfont = ftnsub; this.left_fontnam = nam; break;
            case 1: this.middle_soundfont = fnt; this.middle_soundfont_subfont = ftnsub; this.middle_fontnam = nam; break;
            case 2: this.right_soundfont = fnt; this.right_soundfont_subfont = ftnsub; this.right_fontnam = nam; break;
        }
        this.getSpAnchorSoundfont(which);
    }

    fillSpAnchorValues(which, values) {
        let temp = [];
        temp = new Array(this.SpanchorRef.buttons.length).fill(null);

        for (let i = 0; i < temp.length; i++) {
            if (i < values.length && values[i] > -1) {
                temp[i] = values[i];
                if (which == 1)//central panel
                    this.SpanchorRef.buttons[i].getComponent('UI_Button').setNoteText(values[i]);
            }
        }

        switch (which) {
            case 0: this.LeftPanel = temp; break;
            case 1: this.MiddlePanel = temp; break;
            case 2: this.RightPanel = temp; break;
        }

    }


    ClearSpanchorValues() {
        this.LeftPanel = [];
        this.MiddlePanel = [];
        this.RightPanel = [];
    }

    updatescreenonly(which) {
        this.cp = which;
        switch (which) {
            case 0: this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.left_soundfont, this.left_soundfont_subfont); break;
            case 1: this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.middle_soundfont, this.middle_soundfont_subfont); break;
            case 2: this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.right_soundfont, this.right_soundfont_subfont); break;
        }
    }

    setSpanchorValues(which) {

        this.cp = which;
        console.log("setting cp to ", which);


        let temp = [];
        switch (which) {
            case 0: temp = this.LeftPanel; this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.left_soundfont, this.left_soundfont_subfont); break;
            case 1: temp = this.MiddlePanel; this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.middle_soundfont, this.middle_soundfont_subfont); break;
            case 2: temp = this.RightPanel; this.SoundFontPlayer.update_soundfont_screenprompt(this.object, this.right_soundfont, this.right_soundfont_subfont); break;
        }

        if (temp.length == 0)
            temp = new Array(this.SpanchorRef.buttons.length).fill(null);

        for (let i = 0; i < temp.length; i++) {
            this.SpanchorRef.buttons[i].getComponent('UI_Button').setNoteText(temp[i]);
        }

        console.log("left ", this.left_soundfont);
        console.log("middle ", this.middle_soundfont);
        console.log("right ", this.right_soundfont);

        if (this.SoundFontPlayer.getisdrum()) {
            this.drumimageManger.getComponent('DrumImageHolder').enable_the_drums();
        }
        else {
            this.drumimageManger.getComponent('DrumImageHolder').disable_the_drums();
        }
    }

}
