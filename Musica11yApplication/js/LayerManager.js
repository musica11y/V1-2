import { Component, Property } from '@wonderlandengine/api';
import { MaterialScheme } from './MaterialScheme';
import { vec3 } from 'gl-matrix';

/**
 * LayerManager
 */
export class LayerManager extends Component {
    static TypeName = 'LayerManager';
    /* Properties that are configurable in the editor */
    static Properties = {
        LayerIndicatorL: Property.object(),
        LayerIndicatorM: Property.object(),
        LayerIndicatorR: Property.object(),
        MusicMan: Property.object(),
        ChildWindowExtension: Property.object(),
        PanelLoopText: Property.object(),
        PanelSequencerText: Property.object(),
        EntireSpanchorSequencer: Property.object(),
        PanelVisibleText: Property.object(),
    };



    start() {

        console.log("START CALLED NOW");

        this.layerbuttons = [];

        this.CurrentLayer = 0;
        this.LayerCount = 1;
        this.ActivePanel = 1;

        this.LayerIndicatorL.getComponent('mesh').material = this.LayerIndicatorL.getComponent('mesh').material.clone();
        this.LayerIndicatorM.getComponent('mesh').material = this.LayerIndicatorR.getComponent('mesh').material.clone();
        this.LayerIndicatorR.getComponent('mesh').material = this.LayerIndicatorM.getComponent('mesh').material.clone();

        this.setcurrentPanelIndicator();

        this.musicmanref = this.MusicMan.getComponent('MusicManagement');
        if (this.ChildWindowExtension != null)
            this.ChildWindowExtension = this.ChildWindowExtension.getComponent('ChildWindowExtension');



        // this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);
        //update spanchor board to our notes 
        // this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);
        //update indicator
        //this.setcurrentPanelIndicator();
        // this.update_loopseq_buttons();
    }


    CTRL_Deletelayer() {
        if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
            return;
        //open confirm box
        this.ChildWindowExtension.enableme();
    }

    DeleteLayerCancel() {
        this.ChildWindowExtension.disableme();
    }

    DeleteLayerOK() {
        this.ChildWindowExtension.disableme();
        this.deletelayer();
    }

    storeLayerButton(button) {
        console.log("Add button");
        this.layerbuttons.push(button);
        if (this.layerbuttons.length == 1) {
            button.getComponent("UI_Button").setBackgroundColour(MaterialScheme.PANEL_Active);
        }
        if (this.layerbuttons.length > 1) {
            button.children[0].getComponent('text').text = " Add Layer ";//+this.layerbuttons.length;
        }
        if (this.layerbuttons.length > 2) {
            button.active = false;
            let children = button.children;
            children.forEach(function (element) { element.active = false; });
        }
    }

    setcurrentPanelIndicator() {
        if (this.ActivePanel == 0)
            this.LayerIndicatorL.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.LayerIndicatorL.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;

        if (this.ActivePanel == 1)
            this.LayerIndicatorM.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.LayerIndicatorM.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;

        if (this.ActivePanel == 2)
            this.LayerIndicatorR.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.LayerIndicatorR.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;
    }

    deletelayer() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);

        if (this.LayerCount >= this.layerbuttons.length) {
            this.LayerCount--;
            this.layerbuttons[this.LayerCount].children[0].getComponent('text').text = " Add Layer ";//+this.layerbuttons.length;                
        }
        else if (this.LayerCount > 1) {
            let button = this.layerbuttons[this.LayerCount];//this.CurrentLayer];
            button.active = false;
            let children = button.children;
            children.forEach(function (element) { element.active = false; });

            this.LayerCount--;

            this.layerbuttons[this.LayerCount].children[0].getComponent('text').text = " Add Layer ";//+this.layerbuttons.length;
            console.log("remove one and rename one");
        }

        //copy loop from data+1 to data 
        for (let i = this.CurrentLayer; i < this.layerbuttons.length - 1; i++) {
            this.layerbuttons[i].getComponent('LayerAnchorDataStorage').LeftPanel = this.layerbuttons[i + 1].getComponent('LayerAnchorDataStorage').LeftPanel;
            this.layerbuttons[i].getComponent('LayerAnchorDataStorage').MiddlePanel = this.layerbuttons[i + 1].getComponent('LayerAnchorDataStorage').MiddlePanel;
            this.layerbuttons[i].getComponent('LayerAnchorDataStorage').RightPanel = this.layerbuttons[i + 1].getComponent('LayerAnchorDataStorage').RightPanel;
        }
        //and set the last one to null
        this.layerbuttons[this.layerbuttons.length - 1].getComponent('LayerAnchorDataStorage').ClearSpanchorValues();


        this.CurrentLayer--;
        if (this.CurrentLayer < 0)
            this.CurrentLayer = 0;
        this.hiliteactivepanel(this.CurrentLayer);


        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);

    }


    hiliteactivepanel(which) {
        for (let i = 0; i < this.layerbuttons.length; i++) {
            let button = this.layerbuttons[i];
            if (i == which)
                button.getComponent("UI_Button").setBackgroundColour(MaterialScheme.PANEL_Active);
            else
                button.getComponent("UI_Button").setBackgroundColour(MaterialScheme.PANEL_Inactive);
        }
    }

    setcurrentLayer(layer, InTestMode) {
        console.log("set the layer ", layer);

        if (this.LayerCount < layer && InTestMode)
            return;

        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);

        if (this.LayerCount < layer) {
            if (this.LayerCount < this.layerbuttons.length - 1) {
                console.log("Add a layer");
                this.LayerCount++;
                //set the text to Layer X
                //enable next layer
                let button = this.layerbuttons[this.LayerCount];
                button.active = true;
                let children = button.children;
                children.forEach(function (element) { element.active = true; });
                button = this.layerbuttons[this.LayerCount - 1];
                button.children[0].getComponent('text').text = "Layer " + this.LayerCount;
                // button.getComponent("UI_Button").setBackgroundColour(MaterialScheme.PANEL_Active);
            }
            else {
                this.LayerCount++;
                let button = this.layerbuttons[this.LayerCount - 1];
                button.children[0].getComponent('text').text = "Layer " + (this.LayerCount);
                //   button.getComponent("UI_Button").setBackgroundColour(MaterialScheme.PANEL_Active);
            }
        }

        console.log("okGO");

        this.CurrentLayer = layer - 1;
        this.hiliteactivepanel(this.CurrentLayer);

        console.log("ok ", this.CurrentLayer);

        //dehilight all layer buttons
        //hilite current layer button
        //update spanchor board to our notes
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);

        console.log("DONE");
        this.update_loopseq_buttons();

        for (let c = 0; c < this.LayerCount; c++) {
            if (c == this.CurrentLayer) this.layerbuttons[c].getComponent("UI_Button").setBackgroundColour(MaterialScheme.LAYER_Active);
            else this.layerbuttons[c].getComponent("UI_Button").setBackgroundColour(MaterialScheme.LAYER_Inactive);
        }
    }


    setInitialPanel() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);
        this.setcurrentPanelIndicator();
        this.update_loopseq_buttons();
    }

    setCentrePanel()
    {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);
        this.ActivePanel=1;
        //update spanchor board to our notes 
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);
        //update indicator
        this.setcurrentPanelIndicator();
        this.update_loopseq_buttons();
    }

    setLeftPanel() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);

        //if (this.ActivePanel > 0)
            this.ActivePanel=0;
        //update spanchor board to our notes 
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);
        //update indicator
        this.setcurrentPanelIndicator();
        this.update_loopseq_buttons();
    }

    setRightPanel() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);

        //if (this.ActivePanel < 2)
            this.ActivePanel=2;
        //update spanchor board to our notes 
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').setSpanchorValues(this.ActivePanel);
        //update indicator
        this.setcurrentPanelIndicator();
        this.update_loopseq_buttons();
    }

    storeCurrentPanel() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').storeSpAnchorValues(this.ActivePanel);
    }

    getPanelData(panel, lmr, col)//panel, mlr=0,1,2 for left middle right
    {
        return this.layerbuttons[panel].getComponent('LayerAnchorDataStorage').getSpAnchorValues(lmr, col);
    }

    getPanelSoundFont(panel, lmr, col) {
        return this.layerbuttons[panel].getComponent('LayerAnchorDataStorage').getSpAnchorSoundfont(lmr);
    }

    fillPanelData(panel, lmr, values) {

        console.log("FILL panel ", panel, " ", lmr, " ", values);
        this.setcurrentLayer(panel + 1, false);

        this.layerbuttons[panel].getComponent('LayerAnchorDataStorage').fillSpAnchorValues(lmr, values);

        //if(this.LayerCount<panel+1)
        //      this.LayerCount=panel+1;
    }

    setSoundFontData(panel, lmr, sf, sfsub, nam) {
        this.layerbuttons[panel].getComponent('LayerAnchorDataStorage').setSoundFont(lmr, sf, sfsub, nam);
    }

    ResetPanelPtr() {
        this.ActivePanel = 1;
        //update indicator
        this.setcurrentPanelIndicator();

        this.LayerCount = 1;
        this.CurrentLayer = 0;
        this.hiliteactivepanel(this.CurrentLayer);
    }

    check_for_missing_soundfonts(what, num) {
        //check all layers for 
        //this.right_fontnam!=""
        this.layerbuttons.forEach(who => {
            if (who.getComponent('LayerAnchorDataStorage').left_fontnam == what) {
                who.getComponent('LayerAnchorDataStorage').left_soundfont = num;
                who.getComponent('LayerAnchorDataStorage').left_fontnam = "";
                this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').updatescreenonly(0);
            }
            if (who.getComponent('LayerAnchorDataStorage').middle_fontnam == what) {
                who.getComponent('LayerAnchorDataStorage').middle_soundfont = num;
                who.getComponent('LayerAnchorDataStorage').middle_fontnam = "";
                this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').updatescreenonly(1);
            }
            if (who.getComponent('LayerAnchorDataStorage').right_fontnam == what) {
                who.getComponent('LayerAnchorDataStorage').right_soundfont = num;
                who.getComponent('LayerAnchorDataStorage').right_fontnam = "";
                this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').updatescreenonly(2);
            }
        });
    }

    toggle_layer_loop() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeLoop[this.ActivePanel] = !this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeLoop[this.ActivePanel];
        this.update_loopseq_buttons();
    }
    toggle_layer_sequencer() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeSequence[this.ActivePanel] = !this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeSequence[this.ActivePanel];
        this.update_loopseq_buttons();
    }

    toggle_layer_visible() {
        this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeVisible[this.ActivePanel] = !this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeVisible[this.ActivePanel];
        this.update_loopseq_buttons();
    }


    update_loopseq_buttons() {
        if (this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeLoop[this.ActivePanel]) {
            this.PanelLoopText.getComponent('text').text = "ON";
        }
        else {
            this.PanelLoopText.getComponent('text').text = "OFF";
        }
        if (this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeSequence[this.ActivePanel]) {
            this.PanelSequencerText.getComponent('text').text = "ON";
        }
        else {
            this.PanelSequencerText.getComponent('text').text = "OFF";
        }
        if (this.layerbuttons[this.CurrentLayer].getComponent('LayerAnchorDataStorage').WeVisible[this.ActivePanel]) {
            this.PanelVisibleText.getComponent('text').text = "ON";
        }
        else {
            this.PanelVisibleText.getComponent('text').text = "OFF";
        }
    }


    scroll_panel_right() {
        let position = this.EntireSpanchorSequencer.getPositionLocal();
        let rotation = this.EntireSpanchorSequencer.getRotationLocal();

        let forward = [1, 0, 0];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.EntireSpanchorSequencer.setPositionLocal(position);
    }
    scroll_panel_left() {
        let position = this.EntireSpanchorSequencer.getPositionLocal();
        let rotation = this.EntireSpanchorSequencer.getRotationLocal();

        let forward = [-1, 0, 0];
        vec3.transformQuat(forward, forward, rotation);

        position[0] += forward[0] * 0.1; // Adjust X
        // position[1] += forward[1] * 0.1; // Adjust Y
        position[2] += forward[2] * 0.1; // Adjust Z

        this.EntireSpanchorSequencer.setPositionLocal(position);
    }
}
