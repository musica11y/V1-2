import { Component, Property } from '@wonderlandengine/api';

import { MaterialScheme } from './MaterialScheme';

/**
 * PlayModeManager
 */
export class PlayModeManager extends Component {
    static TypeName = 'PlayModeManager';
    /* Properties that are configurable in the editor */
    static Properties = {
        PlayModeCameraPosition: Property.object(),
        PlayCameraRef: Property.object(),
        LeftPanelTrans: Property.object(),
        MiddlePanelTrans: Property.object(),
        RightPanelTrans: Property.object(),
        PanelTemplate: Property.object(),
        ButtonTemplate: Property.object(),
        PanelContainer: Property.object(),
        NonVRCamera: Property.object(),
        layerManager: Property.object(),
        MusicMan: Property.object(),
        TimeText: Property.object(),
        playpausetext: Property.object(),
        ThreeDControl: Property.object(),
        LeftPanelLayerTrans: Property.object(),
        MiddlePanelLayerTrans: Property.object(),
        RightPanelLayerTrans: Property.object(),
        ToMeButton: Property.object(),//Now Layer Button
        PlayerInitialOffset: Property.vector3(),
        EyecastMarker: Property.object(),
        lefthand: Property.object(),
        righthand: Property.object(),
        theLayerButton: Property.object(),
        playerprefferedheightMarker: Property.object(),
        ActivePanelIndicatorL: Property.object(),
        ActivePanelIndicatorM: Property.object(),
        ActivePanelIndicatorR: Property.object(),
		mainparent: Property.object(),
		playerreference: Property.object(),
		Debugtext: Property.object(),
    };


    start() {
this.frameCount=0;
this.monitorY=false;
        this.ActivePanelIndicatorL.getComponent('mesh').material = this.ActivePanelIndicatorL.getComponent('mesh').material.clone();
        this.ActivePanelIndicatorM.getComponent('mesh').material = this.ActivePanelIndicatorM.getComponent('mesh').material.clone();
        this.ActivePanelIndicatorR.getComponent('mesh').material = this.ActivePanelIndicatorR.getComponent('mesh').material.clone();


        this.prefferedheight = this.playerprefferedheightMarker.getTranslationWorld();

        this.EyecastMarker = this.EyecastMarker.getComponent('EyeRayCast');

        this.layerManager = this.layerManager.getComponent('LayerManager');
        this.musicmanref = this.MusicMan.getComponent('MusicManagement');

        this.drumImageMan = this.MusicMan.getComponent('DrumImageHolder');


        this.weare_in_vr = false;


        const arButton = document.getElementById("ar-button");
        if (arButton) {
            console.log("AR button found!");
            document.getElementById("ar-button").addEventListener("click", () => {
                // console.log("VR button clicked!");
                // vrButtonPressed.notify(); // Notify all listeners
                //        let playerpos = this.PlayCameraRef.getTranslationWorld();
                //       playerpos[1] += this.PlayerInitialOffset[1];
                //        this.PlayCameraRef.setTranslationWorld(playerpos);
                this.weare_in_vr = true;
                this.EyecastMarker.set_active(true);
                if (this.lefthand)
                    this.lefthand.getComponent("Althand-tracking").set_active(true);
                if (this.righthand)
                    this.righthand.getComponent("Althand-tracking").set_active(true);
				//			setTimeout(() => {
			//	this.setsceneheight();
				//}, 5000); // 2000 milliseconds = 2 seconds
				this.monitorY=true;
            });
        } else {
            console.log("AR button not found. Check your implementation.");
        }
        const vrButton = document.getElementById("vr-button");
        if (vrButton) {
            console.log("VR button found!");
            document.getElementById("vr-button").addEventListener("click", () => {
                // console.log("VR button clicked!");
                // vrButtonPressed.notify(); // Notify all listeners
                //        let playerpos = this.PlayCameraRef.getTranslationWorld();
                //       playerpos[1] += this.PlayerInitialOffset[1];
                //        this.PlayCameraRef.setTranslationWorld(playerpos);
                this.weare_in_vr = true;
                this.EyecastMarker.set_active(true);
                if (this.lefthand)
                    this.lefthand.getComponent("Althand-tracking").set_active(true);
                if (this.righthand)
                    this.righthand.getComponent("Althand-tracking").set_active(true);
				
				//setTimeout(() => {
				//this.setsceneheight();
				//	}, 5000); // 2000 milliseconds = 2 seconds
		this.monitorY=true;
            });
        } else {
            console.log("VR button not found. Check your implementation.");
        }

        /* //if vr mode lets adjust the initial offset
         if (navigator.xr) {
             navigator.xr.requestSession('immersive-vr').then((session) => {
              //   console.log("VR session is running!");
                 let playerpos = this.PlayCameraRef.getTranslationWorld();
                 playerpos += this.PlayerInitialOffset;
                 this.PlayCameraRef.setTranslationWorld(playerpos);
             }).catch(() => {
             //    console.log("VR session is NOT running.");
             });
         } else {
           //  console.log("WebXR is not available.");
         }*/

        //       this.prefferedheight=this.playerprefferedheightMarker.getTranslationWorld();
        //force the correct height
        return;
        let ph = this.PlayCameraRef.getTranslationWorld();
        ph[1] = this.prefferedheight[1];
        this.PlayCameraRef.setTranslationWorld(ph);

        let pmph = this.PlayModeCameraPosition.getTranslationWorld();
        pmph[1] = this.prefferedheight[1];
        this.PlayModeCameraPosition.setTranslationWorld(pmph);
    }

	setsceneheight(){
        return;

		let ph=this.mainparent.getTranslationWorld();
		let pr=this.playerreference.getTranslationWorld();
		
	//	this.Debugtext.getComponent('text').text = ph[1]+" "+ pr[1];
		
		ph[1]= pr[1];
		this.mainparent.setTranslationWorld(ph);
		
	/*	 if (this.lefthand)
                    this.lefthand.getComponent("Althand-tracking").set_active(true);
                if (this.righthand)
                    this.righthand.getComponent("Althand-tracking").set_active(true);*/
	}

    SetupforplayMode(row, col, mcol) {
        //store any recent edits
        this.layerManager.storeCurrentPanel();

        const soundfontlist = [];
        for (let i = 0; i < this.layerManager.LayerCount; i++) {
            let sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').left_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);

            sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').middle_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);

            sf = this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').right_soundfont;
            if (sf != null && !soundfontlist.includes(sf))
                soundfontlist.push(sf);
        }

        console.log("we need this amount of soundfonts ", soundfontlist.length);
        this.MusicMan.getComponent("SoundFontSupport").unloadAndload_necessary_soundfonts(soundfontlist);



        //Need to adjust the camera position
        this.oldplayerpos = this.PlayCameraRef.getTranslationWorld();
        this.PlayCameraRef.setTranslationWorld(this.PlayModeCameraPosition.getTranslationWorld());
        //Nope
        /*  if(this.weare_in_vr)
          {
              let playerpos = this.PlayCameraRef.getTranslationWorld();
              playerpos[1] += this.PlayerInitialOffset[1];
              this.PlayCameraRef.setTranslationWorld(playerpos);
          }*/

        this.activepanel = 1;//middle

        this.TimeTextC = this.TimeText.getComponent('text');
        //use the template and spawn in some panels

        this.addedbuttons = 0;
        if (this.layerManager.LayerCount > 0)//1)
            this.addedbuttons = this.layerManager.LayerCount;

        this.panelholder = [null, null, null];
        this.row = row;
        this.col = col;
        this.mcol = mcol;

        this.makePanel("", true, 0, this.LeftPanelTrans, row, col, mcol, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').LeftPanel,
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').left_soundfont, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[0],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeLoop[0],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeVisible[0], false//[0,0,0],true
        );
        this.makePanel("", true, 1, this.MiddlePanelTrans, row, col, mcol, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').MiddlePanel,
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').middle_soundfont, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[1],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeLoop[1],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeVisible[1], false//[0,0,0],true
        );
        this.makePanel("", true, 2, this.RightPanelTrans, row, col, mcol, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').RightPanel,
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').right_soundfont, this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[2],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeLoop[2],
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeVisible[2], false//[0,0,0],true
        );

        //make panels for the other layers (NOT ACTIVE AT THE MOMENT)
        /*  console.log("WE HAVE OTHER LAYERS ", this.layerManager.LayerCount);
         if (this.layerManager.LayerCount > 1) { //VR does not like this
              for (let i = 1; i < this.layerManager.LayerCount; i++) {
  
                  this.makePanel(0, this.LeftPanelLayerTrans, row, col, mcol, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').LeftPanel,
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').left_soundfont_subfont, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[0],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[0],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[0],[0,0.1*i,0],false
                  );
                  this.makePanel(1, this.MiddlePanelLayerTrans, row, col, mcol, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').MiddlePanel,
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').middle_soundfont_subfont, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[1],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[1],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[1],[0,0.1*i,0],false
                  );
                  this.makePanel(2, this.RightPanelLayerTrans, row, col, mcol, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').RightPanel,
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').right_soundfont_subfont, this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[2],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[2],
                      this.layerManager.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[2],[0,0.1*i,0],false
                  );
              }
          }*/


        this.loopcounter = 0;
        this.bpm = this.musicmanref.bpm;
        this.notelinelen = col;
        this.notesatonce = row;
        this.notevalue = -1;
        this.soundfont = 0;
        this.elapsedTime = 0;

        this.beatInterval = 60 / this.musicmanref.bpm;
        this.isplaying = false;
        this.was_not_sequence = true;

        if (this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[0] ||
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[1] ||
            this.layerManager.layerbuttons[0].getComponent('LayerAnchorDataStorage').WeSequence[2]) {
            this.isplaying = true;
            this.was_not_sequence = false;
        }
        this.currentposition = -1;//0;
        this.currentpanel = 0;//0 left 1 middle 2 = right
        // this.playpausetext.getComponent('text').text = "Pause";

        this.playmul = 1;

        this.soundfont = Number(this.PanelContainer.children[this.currentpanel].name);

        this.rotationbk = this.NonVRCamera.getRotationWorld();
        this.NonVRCamera.getComponent('mouse-look').active = true;

        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        this.setcurrentPanelIndicator();
    }


    hidebutton(but) {
        but.getComponent('mesh').active = false;
        but.children[0].getComponent('mesh').active = false;
        but.children[0].children[0].getComponent('text').active = false;
    }


    resetPanel() {
        console.log("RESET THE PANEL");
        switch (this.activepanel) {
            case 0:
                this.ThreeDControl.getComponent('ThreeDControl').leftPanel.setPositionWorld(this.Lbackup_panelpos);
                this.ThreeDControl.getComponent('ThreeDControl').leftPanel.setRotationWorld(this.Lbackup_panelrot);
                this.ThreeDControl.getComponent('ThreeDControl').leftPanel.setScalingLocal(this.Lbakcup_panelscale);
                break;
            case 1:

                console.log("Pos was ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getPositionWorld());
                console.log("Rot was ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getRotationWorld());
                console.log("S was ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getScalingLocal());

                this.ThreeDControl.getComponent('ThreeDControl').middlePanel.setPositionWorld(this.Mbackup_panelpos);
                this.ThreeDControl.getComponent('ThreeDControl').middlePanel.setRotationWorld(this.Mbackup_panelrot);
                this.ThreeDControl.getComponent('ThreeDControl').middlePanel.setScalingLocal(this.Mbakcup_panelscale);

                console.log("Pos now ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getPositionWorld());
                console.log("Rot now ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getRotationWorld());
                console.log("S now ", this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getScalingLocal());
                break;
            case 2:
                this.ThreeDControl.getComponent('ThreeDControl').rightPanel.setPositionWorld(this.Rbackup_panelpos);
                this.ThreeDControl.getComponent('ThreeDControl').rightPanel.setRotationWorld(this.Rbackup_panelrot);
                this.ThreeDControl.getComponent('ThreeDControl').rightPanel.setScalingLocal(this.Rbakcup_panelscale);
                break;
        }

    }

    setcurrentPanelIndicator() {
        console.log("ACTPANELWAS ", this.activepanel);
        if (this.activepanel == 0)
            this.ActivePanelIndicatorL.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.ActivePanelIndicatorL.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;

        if (this.activepanel == 1)
            this.ActivePanelIndicatorM.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.ActivePanelIndicatorM.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;

        if (this.activepanel == 2)
            this.ActivePanelIndicatorR.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Active;
        else
            this.ActivePanelIndicatorR.getComponent('mesh').material.color = MaterialScheme.PANEL_Indicator_Inactive;
    }

    swapPanelLeft() {
        this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').leftPanel
        this.activepanel = 0;//this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel;
        this.setcurrentPanelIndicator();
    }
    swapPanelMiddle() {
        this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').middlePanel
        this.activepanel = 1;//this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel;
        this.setcurrentPanelIndicator();
    }
    swapPanelRight() {
        this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').rightPanel;
        this.activepanel = 2;//this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel;
        this.setcurrentPanelIndicator();
    }


    swapPanel(caller) {
        console.log("SWAP PANEL", caller.name, " UPDATE PANEL ", caller.setpanel + " NEW LAYER IS " + caller.setlayer);
        //caller.parent is now the main panel instead of who?
        //1: destory all notes on the panel
        //2: replace them with the new notes
        //3: we should update the Loop
        //4: update the soundfont TODO layer 

        this.activepanel = caller.setpanel;

        if (caller.setpanel == 1) {
            this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').middlePanel
        }
        if (caller.setpanel == 0) {
            this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').leftPanel;
        }
        if (caller.setpanel == 2) {
            this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = this.ThreeDControl.getComponent('ThreeDControl').rightPanel;
        }

        this.swapPanelUpdate(caller.setpanel, caller.setlayer);
    }

    swapPanelUpdate(caller_setpanel, caller_setlayer) {
        this.setcurrentPanelIndicator();
        this.tmpbackup_panelpos = this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.getPositionWorld();
        this.tmpbackup_panelrot = this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.getRotationWorld();
        this.tmpbakcup_panelscale = this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.getScalingLocal();

        // console.log("PANEL NAME WAS "+this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.name);
        /*
            position = this.tmpbackup_panelpos;
                    panel.setPositionWorld(position);
                    panel.setRotationWorld(this.tmpbackup_panelrot);
                    panel.setScalingLocal(this.tmpbakcup_panelscale);
        */

        //delete all buttons 
        let children = [];
        this.panelholder[caller_setpanel].getChildren(children);
        for (let i = this.addedbuttons; i < children.length; i++) {
            children[i].destroy(); // Destroy each child
        }

        console.log("caller.setlayer is ", caller_setlayer);

        //spawn new buttons
        // this.panelholder[caller.setpanel]
        if (caller_setpanel == 0)
            this.makePanel(this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.name, false, 0, this.LeftPanelTrans, this.row, this.col, this.mcol, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').LeftPanel,
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').left_soundfont, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeSequence[0],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeLoop[0],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeVisible[0], true//[0,0,0],true
            );
        if (caller_setpanel == 1)
            this.makePanel(this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.name, false, 1, this.MiddlePanelTrans, this.row, this.col, this.mcol, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').MiddlePanel,
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').middle_soundfont, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeSequence[1],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeLoop[1],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeVisible[1], true//[0,0,0],true
            );
        if (caller_setpanel == 2)
            this.makePanel(this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel.name, false, 2, this.RightPanelTrans, this.row, this.col, this.mcol, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').RightPanel,
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').right_soundfont, this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeSequence[2],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeLoop[2],
                this.layerManager.layerbuttons[caller_setlayer].getComponent('LayerAnchorDataStorage').WeVisible[2], true//[0,0,0],true
            );
    }

    togglehidetome(isshow, our2me) {
        our2me.getComponent("collision").active = isshow;
        for (let child of our2me.children[0].children[0].children) {
            let meshComponents = child.getComponents("mesh");
            meshComponents.forEach((meshComponent, index) => {
                meshComponent.active = isshow;
            });
        }
    }


    makePanel(oldname, storedefpos, pnlref, posref, row, col, mcol, panelref, soundfontnum, issequencewindow, weloop, WeVisible, dontspawnholder) {//offset,hidetome) {

        let panel = null;

        if (dontspawnholder) {
            panel = this.panelholder[pnlref];
        }
        else {
            panel = this.PanelTemplate.clone();
            panel.parent = this.PanelContainer;

            this.panelholder[pnlref] = panel;
        }

        if (!WeVisible)
            panel.getComponent('mesh').active = false;
        else
            panel.getComponent('mesh').active = true;

        //console.log("we are visible is "+WeVisible);

        if (pnlref == 1) {
            this.ThreeDControl.getComponent('ThreeDControl').PtrCurrentPanel = panel;//TEST
            this.ThreeDControl.getComponent('ThreeDControl').middlePanel = panel;//TEST
        }
        if (pnlref == 0)
            this.ThreeDControl.getComponent('ThreeDControl').leftPanel = panel;//TEST
        if (pnlref == 2)
            this.ThreeDControl.getComponent('ThreeDControl').rightPanel = panel;//TEST

        if (weloop)
            panel.name = "L";//loop
        else
            panel.name = "O";//once
        if (issequencewindow)
            panel.name += "S";//sequence
        else
            panel.name += "L";//live

        panel.name += soundfontnum.toString();
        console.log("PANEL ", pnlref, "  SOUNDFONT ", soundfontnum);

        let position = posref.getPositionWorld();
        //    position[0] += offset[0];
        //    position[1] += offset[1];
        //    position[2] += offset[2];
        panel.setPositionWorld(position);//posref.getPositionWorld());
        panel.setRotationWorld(posref.getRotationWorld());

        if (storedefpos) {
            switch (pnlref) {
                case 0:
                    this.Lbackup_panelpos = position;
                    this.Lbackup_panelrot = posref.getRotationWorld();
                    this.Lbakcup_panelscale = panel.getScalingLocal();
                    break;
                case 1:
                    this.Mbackup_panelpos = position;
                    this.Mbackup_panelrot = posref.getRotationWorld();
                    this.Mbakcup_panelscale = panel.getScalingLocal();
                    break;
                case 2:
                    this.Rbackup_panelpos = position;
                    this.Rbackup_panelrot = posref.getRotationWorld();
                    this.Rbakcup_panelscale = panel.getScalingLocal();
                    break;
            }

            //use previous ones now (or loaded ones) this are created at end of play
            if (this.wehavepreviousones) {
                switch (pnlref) {
                    case 0:
                        position = this.wehaveprevousPosL;
                        panel.setPositionWorld(position);
                        panel.setRotationWorld(this.wehaveprevousRotL);
                        panel.setScalingLocal(this.wehaveprevousScaleL);
                        break;
                    case 1:
                        position = this.wehaveprevousPosM;
                        panel.setPositionWorld(position);
                        panel.setRotationWorld(this.wehaveprevousRotM);
                        panel.setScalingLocal(this.wehaveprevousScaleM);
                        break;
                    case 2:
                        position = this.wehaveprevousPosR;
                        panel.setPositionWorld(position);
                        panel.setRotationWorld(this.wehaveprevousRotR);
                        panel.setScalingLocal(this.wehaveprevousScaleR);
                        break;
                }
            }
        }
        else {
            //panel.name = oldname;            
            panel.name = oldname.slice(0, -1);
            panel.name += soundfontnum.toString();

            position = this.tmpbackup_panelpos;
            panel.setPositionWorld(position);
            panel.setRotationWorld(this.tmpbackup_panelrot);
            panel.setScalingLocal(this.tmpbakcup_panelscale);
        }
        //our2me.lookAt(this.PlayModeCameraPosition.getTranslationWorld(), [0, 1, 0]); // Make the object look at the player
        //our2me.rotateAxisAngleDeg([0, 1, 0], 180); 
        // our2me.setScalingLocal([0.5,0.5,0.5]);

        //this.layerbuttons[panel].getComponent('LayerAnchorDataStorage').fillSpAnchorValues(lmr,values);


        //.getComponent('LayerAnchorDataStorage').LeftPanel.children[0].getComponent('text').text ;//.getComponent('UI_Button').text (or).notevalue (or .text)
        //this.MiddlePanel = [];
        //this.RightPanel = [];

        const childScale = panel.getScalingLocal();
        //const parentScale = this.PanelContainer.getScalingLocal();
        const combinedScale = [
            childScale[0],// * parentScale[0],
            childScale[1],// * parentScale[1],
            childScale[2],// * parentScale[2]
        ];

        const topLeftLocal = [
            -0.7 + (-combinedScale[0] / 2) * 0.2, // Half-width to the left
            0.6 + (combinedScale[1] / 2) * 0.5,  // Half-height upwards
            0//-combinedScale[2] / 2  // Depth adjustment for 3D, if needed
        ];


        const botRightLocal = [
            0.7 + (combinedScale[0] / 2) * 0.2, // Half-width to the left
            -0.6 + (-combinedScale[1] / 2) * 0.5,  // Half-height upwards
            0//-combinedScale[2] / 2  // Depth adjustment for 3D, if needed
        ];

        // Output the world-space top-left position
        //console.log("Top-Left Corner (World Space):", topLeftWorld);
        // let but = this.ButtonTemplate.clone();
        // but.parent = panel;
        // but.setPositionLocal(topLeftLocal);//center of panel

        // but = this.ButtonTemplate.clone();
        //  but.parent = panel;
        //  but.setPositionLocal(botRightLocal);//center of panel





        const targetScale = [0.1, 0.1, 1];

        // Get the parent's scale
        const parentScale = panel.getScalingLocal();

        // Calculate the compensated scale for the child
        const compensatedScale = [
            targetScale[0] / parentScale[0],
            targetScale[1] / parentScale[1],
            1//targetScale[2] / parentScale[2]
        ];

        //  console.log("comp:",compensatedScale);
        //   return;
        const xspacing = (botRightLocal[0] - topLeftLocal[0]) / (col - 1);
        const yspacing = (botRightLocal[1] - topLeftLocal[1]) / (row - 1);


        //set 2me position
        /* let localpos = [0, 0, 0.01];
         localpos[0] = topLeftLocal[0] + ((col-2) * xspacing);//(c * 0.16);
         localpos[1] = topLeftLocal[1] + ((row-1) * yspacing);//(rr * 0.3);
         const our2me=this.ToMeButton.clone();
         our2me.parent = panel;//PanelContainer;//panel;//panel no use as we are looping through children later       
         localpos[1]-=0.6;
         our2me.setPositionLocal(localpos);
         our2me.thepanelref=pnlref;
         if(hidetome)
         {
             this.togglehidetome(false, our2me);
         }*/
        //end set 2me position
        //new layer section
        if (this.layerManager.LayerCount > 0 && !dontspawnholder) {//was >1
            for (let i = 0; i < this.layerManager.LayerCount; i++) {
                let localpos = [0, 0, 0.2];
                localpos[0] = topLeftLocal[0] + ((i) * xspacing);//(c * 0.16);
                localpos[1] = topLeftLocal[1] + 0.15;// + ((row-1) * yspacing);//(rr * 0.3);
                const our2me = this.theLayerButton.clone();
                our2me.children[0].getComponent('text').text = i;
                our2me.parent = panel;
                our2me.setPositionLocal(localpos);
                our2me.setpanel = pnlref;
                our2me.setlayer = i;
            }
        }
        // const xoffset = ((col * 0.16) / 2) - 0.08;
        // const yoffset = ((row * 0.3) / 2) - 0.15;
        for (let rr = 0; rr < row; rr++) {
            for (let c = 0; c < col; c++) {
                let pan = -1;
                if (panelref != null)
                    pan = panelref[c + (rr * mcol)];

                let localpos = [0, 0, 0.01];
                localpos[0] = topLeftLocal[0] + (c * xspacing);//(c * 0.16);
                localpos[1] = topLeftLocal[1] + (rr * yspacing);//(rr * 0.3);

                if (pan != null && pan > -1) {
                    let but = this.ButtonTemplate.clone();
                    but.parent = panel;
                    but.setScalingLocal(compensatedScale);//[0.07, 0.07, 1]);
                    let btn = but.getComponent('UI_SimpleButton');
                    //but.getComponent('UI_SimpleButton').ourScale = compensatedScale;
                    btn.ourScale = compensatedScale;
                    //but.setPositionLocal([-xoffset + (c * 0.16), yoffset - (rr * 0.3), 0.01]);

                    but.setPositionLocal(localpos);
                    but.getComponent('mesh').material = but.getComponent('mesh').material.clone();
                    but.getComponent('mesh').material.color = MaterialScheme.SEQUENCER_InActiveNote;

                    but.children[0].getComponent('mesh').material = but.children[0].getComponent('mesh').material.clone();

                    but.children[0].children[0].getComponent('text').text = this.musicmanref.midiToNoteName(pan);
                    but.children[0].name = pan.toString();
                    but.children[0].getComponent('mesh').material.color = MaterialScheme.GetNoteColour(this.musicmanref.midiToNoteNameNoOctave(pan));

                    //if (!WeVisible)
                    //   this.hidebutton(but);

                    but.soundfont = soundfontnum;
                    but.note = pan;
                    
                    if(this.musicmanref.SoundFontPlayer.getsoundfontisdrum(soundfontnum)) {
                    //if (this.musicmanref.in_drum) {
                        if (btn.DrumImage)
                        {
                            let o = this.drumImageMan.set2drum(true, pan, btn.DrumImage.getComponent('mesh'));
                            btn.DrumImage.getComponent('mesh').active = o;
                        }
                    }
                }
                else if (issequencewindow) {
                    //if in a sequence window we need some blanks
                    let but = this.ButtonTemplate.clone();
                    but.parent = panel;
                    but.setScalingLocal(compensatedScale);//[0.07, 0.07, 1]);
                    but.getComponent('UI_SimpleButton').ourScale = compensatedScale;
                    //but.setPositionLocal([-xoffset + (c * 0.16), yoffset - (rr * 0.3), 0.01]);

                    but.setPositionLocal(localpos);
                    but.getComponent('mesh').material = but.getComponent('mesh').material.clone();
                    but.getComponent('mesh').material.color = MaterialScheme.SEQUENCER_InActiveNote;
                    but.children[0].getComponent('mesh').material = but.children[0].getComponent('mesh').material.clone();

                    but.children[0].name = "-1";
                    //but.children[0].getComponent('mesh').material.color=MaterialScheme.SEQUENCER_InActiveNote;//colour main button

                    but.children[0].children[0].getComponent('text').active = false;

                    if (!WeVisible)
                        this.hidebutton(but);

                    but.soundfont = -1;
                    but.note = -1;
                }

            }
        }

        // console.log(this.PanelTemplate.getScalingLocal(),"  ",panel.getScalingLocal());
    }


    //below are live updates commands
    livebpm_up() {
        this.bpm++;
        this.beatInterval = 60 / this.bpm;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;
    }
    livebpm_down() {
        this.bpm--;
        this.beatInterval = 60 / this.bpm;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;

    }


    live_pause() {
        this.isplaying = false;
    }

    live_play() {
        if (this.was_not_sequence) {
            this.live_restart();
            this.was_not_sequence = false;
        }
        this.isplaying = true;
    }

    live_playpause() {
        this.isplaying = !this.isplaying;
        if (this.isplaying)
            this.playpausetext.getComponent('text').text = "Pause";
        else this.playpausetext.getComponent('text').text = "Play";
    }
    live_restart() {
        for (let cpanel = 0; cpanel < 3; cpanel++)
            for (let ic = 0; ic < this.notesatonce; ic++) {
                var n = this.PanelContainer.children[cpanel].children[this.addedbuttons + this.currentposition + (ic * this.notelinelen)];
                if (n) n.getComponent('mesh').material.color = MaterialScheme.SEQUENCER_InActiveNote;

                if (this.PanelContainer.children[cpanel].name.charAt(0) == 'O') {
                    console.log("WE ARE NOT DONE-restart");
                    this.PanelContainer.children[cpanel].name =
                        this.PanelContainer.children[cpanel].name.slice(0, 1) + "S" + this.PanelContainer.children[cpanel].name.slice(2);//DONE
                }
            }
        this.elapsedTime = 0;
        //this.currentposition = 0;
        this.currentposition = -1;
        this.loopcounter = 0;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;

    }

    set_bpmx1() {
        this.playmul = 1;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;
    }
    set_bpmx2() {
        this.playmul = 2;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;
    }
    set_bpmx4() {
        this.playmul = 4;
        this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
        if (this.playmul > 1)
            this.TimeTextC.text += "x" + this.playmul;
    }


    //end the play mode and returns to the editor
    endPlayMode() {
        //save settings in can the player has changed anything (we should really check with 3d control in case we dont need to)
        // this.MusicMan.getComponent('loadsave').doSaveSettings();


        this.NonVRCamera.getComponent('mouse-look').active = false;
        this.NonVRCamera.setRotationWorld(this.rotationbk);

        this.wehavepreviousones = true;

        this.wehaveprevousPosL = this.ThreeDControl.getComponent('ThreeDControl').leftPanel.getPositionWorld();
        this.wehaveprevousRotL = this.ThreeDControl.getComponent('ThreeDControl').leftPanel.getRotationWorld();
        this.wehaveprevousScaleL = this.ThreeDControl.getComponent('ThreeDControl').leftPanel.getScalingLocal();

        this.wehaveprevousPosM = this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getPositionWorld();
        this.wehaveprevousRotM = this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getRotationWorld();
        this.wehaveprevousScaleM = this.ThreeDControl.getComponent('ThreeDControl').middlePanel.getScalingLocal();

        this.wehaveprevousPosR = this.ThreeDControl.getComponent('ThreeDControl').rightPanel.getPositionWorld();
        this.wehaveprevousRotR = this.ThreeDControl.getComponent('ThreeDControl').rightPanel.getRotationWorld();
        this.wehaveprevousScaleR = this.ThreeDControl.getComponent('ThreeDControl').rightPanel.getScalingLocal();

        this.MusicMan.getComponent('loadsave').doSaveSettings();

        for (let child of this.PanelContainer.children) {
            child.destroy();
            console.log("destoy");
        }

        //if (this.notevalue > 0)
        //    this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
        this.musicmanref.SoundFontPlayer.stopallsounds();
        this.notevalue = 0;

        this.isplaying = false;
        //restore player pos
        this.PlayCameraRef.setTranslationWorld(this.oldplayerpos);


    }


    pressednote_down(who) {
        console.log("PRESS NOTE ", who.soundfont, ",", who.note);
        if (who.note >= 0) //} || this.octave > 0)) {					
            this.musicmanref.SoundFontPlayer.playsoundfontnote(who.soundfont, who.note, 80);
    }

    pressednote_up(who) {
        console.log("RELEASE NOTE ", who.soundfont, ",", who.note);
        if (who.note >= 0)
            this.musicmanref.SoundFontPlayer.stopsoundfontnote(who.soundfont);
    }



    update(deltaTime) {
		
		if(this.monitorY)
		{
				let pr=this.playerreference.getTranslationWorld();
			    if(pr[1]>0)
				{
						this.setsceneheight();
						if(this.frameCount++ > 120*4)
								this.monitorY=false;			
				}
			//	else 	
				this.Debugtext.getComponent('text').text =   this.frameCount;
	
		}
		
        if (this.isplaying) {
            this.elapsedTime += deltaTime * this.playmul;
            if (this.elapsedTime >= this.beatInterval) {
                this.elapsedTime -= this.beatInterval;
                //DISABLE LAST NOTE
                //turn off visual and kill sound
                // if (this.notevalue >= 0){
                //     this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
                //     console.log("Kill sound for font ",this.soundfont);
                // }
                this.notevalue = -1;

                if (this.currentposition >= 0) {
                    for (let cpanel = 0; cpanel < 3; cpanel++) {
                        console.log(this.PanelContainer.children[cpanel].name);
                        if (this.PanelContainer.children[cpanel].name.charAt(1) == 'S') {//we are a sequencer
                            for (let ic = 0; ic < this.notesatonce; ic++) {
                                var n = this.PanelContainer.children[cpanel].children[this.addedbuttons + this.currentposition + (ic * this.notelinelen)];
                                if (n) {
                                    this.soundfont = Number(this.PanelContainer.children[cpanel].name.slice(2));

                                    n.getComponent('mesh').material.color = MaterialScheme.SEQUENCER_InActiveNote;

                                    this.notevalue = Number(n.children[0].name);
                                    if (this.notevalue >= 0)
                                        this.musicmanref.SoundFontPlayer.stopsoundfontnote(this.soundfont);
                                    this.notevalue = -1;
                                }
                            }
                        }
                    }
                }
                //NEXT NOTE
                this.currentposition++;
                if (this.currentposition >= this.notelinelen)
                //if(this.currentposition>=this.PanelContainer.children[this.currentpanel].children.length)
                {
                    this.loopcounter++;
                    //todo if loop
                    this.currentposition = 0;
                    //this.currentpanel++;
                    //if(this.currentpanel>2)
                    //    this.currentpanel=0;
                    for (let cpanel = 0; cpanel < 3; cpanel++) {
                        if (this.PanelContainer.children[cpanel].name.charAt(0) == 'O') {

                            this.PanelContainer.children[cpanel].name =
                                this.PanelContainer.children[cpanel].name.slice(0, 1) + "D" + this.PanelContainer.children[cpanel].name.slice(2);//DONE
                        }
                    }
                }

                for (let cpanel = 0; cpanel < 3; cpanel++) {
                    if (this.PanelContainer.children[cpanel].name.charAt(1) == 'S') {//we are a sequencer
                        this.soundfont = Number(this.PanelContainer.children[cpanel].name.slice(2));
                        for (let ic = 0; ic < this.notesatonce; ic++) {
                            //ENABLE NEXT NOTE
                            //turn on visual and start sound
                            var n = this.PanelContainer.children[cpanel].children[this.addedbuttons + this.currentposition + (ic * this.notelinelen)];
                            if (n) {
                                n.getComponent('mesh').material.color = MaterialScheme.SEQUENCER_ActiveNote;

                                //console.log(">>>",this.PanelContainer.children[this.currentpanel].children[this.currentposition].children[0].name);

                                let noteval = Number(n.children[0].name);
                                //this.notevalue = Number(this.PanelContainer.children[cpanel].children[this.addedbuttons + this.currentposition + (ic * this.notelinelen)].children[0].name);
                                // this.notevalue = this.PanelContainer.children[this.currentpanel].children[this.currentposition].children[0].children[1].getPositionWorld()[0];
                                //this.soundfont = ????
                                // console.log("PLAY NOTE ",this.notevalue);


                                if (noteval >= 0) {//} || this.octave > 0)) {	
                                    console.log("We have a note on panel", cpanel, " sfont:", this.soundfont, " note:", this.notevalue, " ", this.PanelContainer.children[cpanel].name)
                                    this.notevalue = noteval;
                                    this.musicmanref.SoundFontPlayer.playsoundfontnote(this.soundfont, this.notevalue, 80);
                                    // console.log(this.elapsedTime," ",this.beatInterval," ",this.currentpanel,":",this.currentposition);

                                }
                            }
                        }
                    }
                }
                this.TimeTextC.text = this.loopcounter + ":" + this.currentposition + "\nBPM: " + this.bpm;
                if (this.playmul > 1)
                    this.TimeTextC.text += "x" + this.playmul;
            }
        }
    }


}