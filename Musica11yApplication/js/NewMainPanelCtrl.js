import {Component, Property} from '@wonderlandengine/api';

/**
 * NewMainPanelCtrl
 */
export class NewMainPanelCtrl extends Component {
    static TypeName = 'NewMainPanelCtrl';
    /* Properties that are configurable in the editor */
    static Properties = {
          leftsidewindows:  Property.array(Property.object()),
    };

    start() {
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
