import {Component, Property} from '@wonderlandengine/api';

/**
 * ChildWindowExtension
 */
export class ChildWindowExtension extends Component {
    static TypeName = 'ChildWindowExtension';
    /* Properties that are configurable in the editor */
    static Properties = {
        StartDisabled: Property.bool(true),
      //  popup: Property.object(),
        screenblockage: Property.object(),
        screenfader: Property.object(),
        ButtonDesPosition: Property.object(),//optional
    };

   

    start() {
        
    

		let children = this.object.children;
        this.popup=children[0];

        if(this.ButtonDesPosition!=null)
                this.popup.setPositionWorld(this.ButtonDesPosition.getPositionWorld());

        this.elapsedTime = 0;
        this.endSize = this.popup.getScalingLocal()[1];
        this.startSize = 0;
        this.duration=0.1;
        this.fadingin=false;
        this.fadingout=false;

        this.startOpacity=0;
        this.endOpacity=1;
      
        if(this.StartDisabled)
        {
            let scale=this.popup.getScalingLocal();
            scale[1]=this.startSize;
            this.popup.setScalingLocal(scale);
           //this.disableme();
           this.disableall();
        }
    }

    update(dt) {
        /* Called every frame. */
        if(this.fadingin)
        {
            this.elapsedTime += dt;
           
            const t = Math.min(this.elapsedTime / this.duration, 1);         

            let scale=this.popup.getScalingLocal();
            scale[1] = this.startSize * (1 - t) + this.endSize * t;

            this.popup.setScalingLocal(scale);
    
            if (t >= 1) {                
                this.fadingin=false;
            }
       
           // this.screenfader.getComponent('mesh').material.color=[0.5,0.5,0.5,t/5];

         //  const v=0.1+(t/2);
         //  this.screenfader.getComponent('mesh').material.color=[v,v,v,v];
           // console.log(this.screenfader.getComponent('mesh').material.color);
        }

       

        if(this.fadingout)
            {
                this.elapsedTime -= dt;
               
                const t = Math.min(this.elapsedTime / this.duration, 1);         
    
                let scale=this.popup.getScalingLocal();
                scale[1] = this.startSize * (1 - t) + this.endSize * t;
    
                this.popup.setScalingLocal(scale);
        
                if (t <= 0) {
                    this.disableall();
                    this.fadingout=false;
                    scale[1] = 0;
                    this.popup.setScalingLocal(scale);
                }

              //  this.screenfader.getComponent('mesh').material.color=[0.5,0.5,0.5,t/5];
            }
    }

    disableme()
    {
        this.fadingout=true;

        if(this.screenblockage)
            this.screenblockage.active=false;
        if(this.screenfader)
            this.screenfader.active=false;

    }

    disableall()
    {
		let children = this.object.children;
		children.forEach(function (element) { 
            let c=element.getComponent('collision');
            //if(c) c.group=0;
            element.active = false; 
            let subchildren = element.children;
            if(subchildren)
                subchildren.forEach(function (element) { 
                    element.active = false;
                    let c2=element.getComponent('collision');
                    if(c2)
                        {
                        c2.group=0;//active=false;
                     //   console.log("WEll I found someone ",element.name);
                        }
            });
        });
    }

    enableme()
    {
        this.fadingin=true;
        this.enableall();

        if(this.screenblockage)
            this.screenblockage.active=true;
        if(this.screenfader)
            this.screenfader.active=true;
    }

    enableall()
    {
        let children = this.object.children;
		children.forEach(function (element) { 
            let c=element.getComponent('collision');
           // if(c)c.group=0xFFFFFFFF;
            element.active = true; 
            let subchildren = element.children;
            if(subchildren)
                subchildren.forEach(function (element) { 
                    element.active = true;
                    let c2=element.getComponent('collision');
                    if(c2)
                        {
                        c2.group=0xFFFFFFFF;//active=false;
                       // console.log("WEll I found someone ",element.name);
                        }
            });
        });
    }

   
}
