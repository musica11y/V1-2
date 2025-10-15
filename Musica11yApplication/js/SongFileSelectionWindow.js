import {Component, Property} from '@wonderlandengine/api';

/**
 * SongFileSelectionWindow
 */
export class SongFileSelectionWindow extends Component {
    static TypeName = 'SongFileSelectionWindow';
    /* Properties that are configurable in the editor */
    static Properties = {
        messagearea: Property.object(),
        LivePosition: Property.object(),
        HidePosition: Property.object(),
        FilePrefab: Property.object(),
        WindowMaxCount: Property.int(3),
        spacing: Property.float(0.2),
    };


    start()
    {
        this.callme=null;

        this.filelist="file121\nfile22\nfile33";
        this.lines = this.filelist.split(/\r?\n/);

        this.currentfile="";
        this.filelistptr=[];
       //set position to out of sight
        this.scrolly=0;
       //spawn all the buttons and disable/hide them
        let startpos=this.FilePrefab.getPositionWorld();
        let y = startpos[1] - (this.spacing); // Negative y to grow downwards
        this.filelistptr.push(this.FilePrefab);

       // console.log("Add topXXX button "+startpos);

        for (let row = 0; row < this.WindowMaxCount; row++) 
        {
            const button = this.FilePrefab.clone();
          
            this.filelistptr.push(button);

            this.scene.addObject(button);

            button.parent = this.FilePrefab.parent;

            button.setTranslationWorld([startpos[0], y, startpos[2]]);
            y = startpos[1] - ((row+2) * this.spacing); // Negative y to grow downwards
          //  console.log("Add XXX button "+y);
          //  console.log((row+1) * this.spacing);
        }

        this.fillwindow();
        this.hide();
    }

    loadwindow(l)
    {
        this.lines=l;
        this.scrolly=0;
        this.fillwindow();
    }

    uparrow()
    {
        if( this.scrolly>0)
        {
            this.scrolly--;
            this.fillwindow();
        }
    }

    downarrow()
    {
        if(  this.scrolly+this.WindowMaxCount<= this.filelistptr.length)
        {
            this.scrolly++;
            this.fillwindow();
        }
    }

    selectFile(which)
    {
        console.log("set current "+which.name);
        this.currentfile=which.name;
    }

    loadfile()
    {
        if(this.currentfile.length>0)
        {
            console.log("load "+this.currentfile);
            this.closewindow();
            if(this.callme)
                this.callme(this.currentfile);
        }
    }

    closewindow()
    {
        console.log("close window");
        this.hide();
    }

    fillwindow()
    {
          for (let c = 0; c < this.filelistptr.length; c++)
          {
                let show=false;
                this.filelistptr[c].name="";
                if(this.scrolly+c<this.lines.length)
               {
                    this.filelistptr[c].children[1].getComponent('text').text=this.lines[c+this.scrolly];
                    this.filelistptr[c].name=this.lines[c+this.scrolly];
                    show=true;
                }
              this.filelistptr[c].getComponent('collision').active=show;
              this.filelistptr[c].children[0].getComponent('mesh').active=show;
              this.filelistptr[c].children[1].getComponent('text').active=show;
          }
    }

   hide()
    {
        this.object.setPositionWorld(this.HidePosition.getPositionWorld());
        this.active=false;
    }

    show(t,func)
    {
        this.messagearea.getComponent('text').text=t;
        this.object.setPositionWorld(this.LivePosition.getPositionWorld());
        this.active=true;
        this.callme=func;
    }

    update(dt) {
        /* Called every frame. */
    }
}
