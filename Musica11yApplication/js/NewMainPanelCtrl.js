import {Component, Property} from '@wonderlandengine/api';

/**
 * NewMainPanelCtrl
 */
export class NewMainPanelCtrl extends Component {
    static TypeName = 'NewMainPanelCtrl';
    /* Properties that are configurable in the editor */
    static Properties = {
          leftsidewindows:  Property.array(Property.object()),
          helpsidewindows: Property.object(),
          newImageHelp: Property.array(Property.texture()),
    };

    start() {
        const mesh = this.helpsidewindows.getComponent('mesh');
        mesh.material = mesh.material.clone(); // Clone to avoid affecting other objects

         this.restore_default_leftPanel();
    
        this.set_new_panel_live(0);
    }

    update(dt) {
        /* Called every frame. */
    }
     open_test_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(1);
    }

    open_soundfont_window()
    {
         this.restore_default_leftPanel();    
        this.set_new_panel_live(2);
    }

    open_help_window_1()
    {
         const mesh = this.helpsidewindows.getComponent('mesh');

    //    console.log(Object.keys(mesh.material));
   // console.log("Methods on Prototype:", Object.getPrototypeOf(mesh.material));
      
         mesh.material.setFlatTexture(this.newImageHelp[0]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
    open_help_window_2()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[1]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
     open_help_window_3()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[2]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
     open_help_window_4()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[3]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
     open_help_window_5()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[4]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
     open_help_window_6()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[5]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
     open_help_window_7()
    {
           const mesh = this.helpsidewindows.getComponent('mesh');
             mesh.material.setFlatTexture(this.newImageHelp[6]);
          this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }


    open_account_window()
    {
        this.restore_default_leftPanel();    
        this.set_new_panel_live(4);
    }

    open_access_window()
    {
        this.restore_default_leftPanel();    
        this.set_new_panel_live(5);
    }

    restore_default_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(0);
    }


    //move default panel out of the way and add new panel
    set_new_panel_live(i){
            let position = this.leftsidewindows[i].getPositionLocal();
            if(i==0)
                position[1]=1.088;
            else {
                position[0]=0;
                position[1]=0;
                
            }
            this.leftsidewindows[i].setPositionLocal(position);                
    }

    restore_default_leftPanel(){
        //push other panels out of the way 
        this.leftsidewindows.forEach(obj => 
            {
                let position = obj.getPositionLocal();
                position[1]=1000;
                obj.setPositionLocal(position);
                //console.log("Object:", obj);
            });
    }
}
