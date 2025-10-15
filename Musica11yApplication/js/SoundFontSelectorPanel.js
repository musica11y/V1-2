import { Component, Property } from '@wonderlandengine/api';

/**
 * SoundFontSelectorPanel
 */
export class SoundFontSelectorPanel extends Component {
    static TypeName = 'SoundFontSelectorPanel';
    /* Properties that are configurable in the editor */
    static Properties = {
        ButtonSrc1: Property.object(),
        ButtonSrc2: Property.object(),
        ButtonSrc3: Property.object(),
        ButtonSrc4: Property.object(),
        ButtonSrc5: Property.object(),
        ButtonSrc6: Property.object(),
        headerText: Property.object(),
        musicandfilemanager: Property.object(),
        NfoPanel: Property.object(),
    };

    start() {
        this.buttons = [];
        this.buttons.push(this.ButtonSrc1);
        this.buttons.push(this.ButtonSrc2);
        this.buttons.push(this.ButtonSrc3);
        this.buttons.push(this.ButtonSrc4);
        this.buttons.push(this.ButtonSrc5);
        this.buttons.push(this.ButtonSrc6);

        this.headerText = this.headerText.getComponent('text');
        this.headerText.text = "SOUND FONT OK";
        this.sfsupport = this.musicandfilemanager.getComponent("SoundFontSupport");
        //this.headerText.text="pianos";
        //this.fill_the_panels();
        this.headerText.text = "Pianos";
        for (let i = 0; i < 6; i++) {

            //hide
            this.buttons[i].getComponent('collision').active = false;
            this.buttons[i].children[0].getComponent('text').active = false;
            this.buttons[i].children[1].getComponent('mesh').active = false;
        }
        this.buttons[0].getComponent('collision').active = true;
        this.buttons[0].children[0].getComponent('text').text = "SplendidGrandPiano";
        this.buttons[0].children[0].getComponent('text').active = true;
        this.buttons[0].children[1].getComponent('mesh').active = true;
    }

    set_default_panel() {
        this.headerText.text = "Pianos";
        this.fill_the_panels();
        //console.log("AT LEAST I WAS CALLED");
    }
    fill_the_panels() {
        this.sfsupport.get_all_fonts_in_folder(this.headerText.text);
        for (let i = 0; i < 6; i++) {
            if (this.sfsupport.fontinfolderlist.length > i) {
                //set name
                this.buttons[i].getComponent('collision').active = true;
                this.buttons[i].children[0].getComponent('text').text = this.sfsupport.fontinfolderlist[i];
                this.buttons[i].children[0].getComponent('text').active = true;
                this.buttons[i].children[1].getComponent('mesh').active = true;
            }
            else {
                //hide
                this.buttons[i].getComponent('collision').active = false;
                this.buttons[i].children[0].getComponent('text').active = false;
                this.buttons[i].children[1].getComponent('mesh').active = false;
            }
        }
    }

    get_next_font() {
        //used to SoundFontSupport on musicandfilemanager get_next_font

        this.headerText.text = this.sfsupport.get_next_font();
        this.fill_the_panels();
    }

    get_prev_font() {
        //used to SoundFontSupport on musicandfilemanager get_prev_font

        this.headerText.text = this.sfsupport.get_prev_font();
        this.fill_the_panels();
    }

    Press_1() {
        if (this.buttons[0].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[0].children[0].getComponent('text').text);

            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel
        }
    }

    Press_2() {
        if (this.buttons[1].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[1].children[0].getComponent('text').text);

            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel 
        }
    }

    Press_3() {
        if (this.buttons[2].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[2].children[0].getComponent('text').text);
            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel 
        }
    }

    Press_4() {
        if (this.buttons[3].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[3].children[0].getComponent('text').text);
            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel 
        }
    }

    Press_5() {
        if (this.buttons[4].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[4].children[0].getComponent('text').text);
            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel 
        }
    }

    Press_6() {
        if (this.buttons[5].children[0].getComponent('text').active) {
            this.sfsupport.setsoundfont(this.buttons[5].children[0].getComponent('text').text);
            this.NfoPanel.getComponent('ChildWindowExtension').enableme();//show nfo panel 
        }
    }


}
