import {Component, Property} from '@wonderlandengine/api';

/**
 * NreLPanelCtrl
 */
export class NreLPanelCtrl extends Component {
    static TypeName = 'NewLPanelCtrl';
    /* Properties that are configurable in the editor */
    static Properties = {
        mainPanelCtrller: Property.object(),
        leftsidewindows:  Property.array(Property.object()),       
    };

    start() {
        this.restore_default_leftPanel();
    
        this.set_new_panel_live(0);
    }

    update(dt) {
        /* Called every frame. */
    }

    open_key_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(1);
    }

    open_accessibility_window()
    {
     //  this.restore_default_leftPanel();    
    //    this.set_new_panel_live(2);

        this.mainPanelCtrller.getComponent('NewMainPanelCtrl').open_access_window();
    }

 open_grid_window()
    {
    
        this.mainPanelCtrller.getComponent('NewMainPanelCtrl').open_grid_window();
    }

    open_settings_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(3);
    }
    open_help_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(4);
    }
    open_test_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(5);
    }
    
    open_account_window()
    {
        this.restore_default_leftPanel();    
        this.set_new_panel_live(5);

          this.mainPanelCtrller.getComponent('NewMainPanelCtrl').open_account_window();
    }

    restore_default_window()
    {
       this.restore_default_leftPanel();    
        this.set_new_panel_live(0);
        if(this.mainPanelCtrller)
        {
            this.mainPanelCtrller.getComponent('NewMainPanelCtrl').restore_default_window();
        }
    }


    //move default panel out of the way and add new panel
    set_new_panel_live(i){
            console.log(i);
            let position = this.leftsidewindows[i].getPositionLocal();
            if(i==0)
                position[1]=0.923;
            else {
                position[0]=0;
                position[1]=0;
                position[2]=0;
                }
            this.leftsidewindows[i].setPositionLocal(position);  
            console.log(position);              
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
