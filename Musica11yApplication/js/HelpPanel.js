import { Component, Property } from '@wonderlandengine/api';

/**
 * HelpPanel
 */
export class HelpPanel extends Component {
    static TypeName = 'HelpPanel';
    /* Properties that are configurable in the editor */
    static Properties = {
        childwindow: Property.object(),
        childwindow2: Property.object(),

        childwindow3: Property.object(),
        childwindow4: Property.object(),
    };


    start() {
        this.childopen = null;
    }

    update(dt) {

    }

    OpenHelpWindow() {
        if (this.weareopen) {
            this.CloseHelpWindow();
        }
        else {
            this.weareopen = true;
            console.log("OPENING help WINDOW");
            this.object.getComponent('ChildWindowExtension').enableme();
        }
    }

    CloseHelpWindow() {
        this.weareopen = false;
        this.object.getComponent('ChildWindowExtension').disableme();
        this.CloseChildHelpWindow();
    }

    CloseChildHelpWindow() {
        if (this.childopen)
            this.childopen.getComponent('ChildWindowExtension').disableme();
        this.childopen = null;
    }
    OpenChildHelpWindow() {
        if (this.childopen)
            this.childopen.getComponent('ChildWindowExtension').enableme();
    }


    PressHeading(caller) {
        console.log(caller.name);
        const str = caller.name;
        const match = str.match(/\d+$/);

        let newchild = this.childopen;

        if (match) {
            const number = parseInt(match[0], 10);

            switch (number) {
                case 1: newchild = this.childwindow; break;
                case 2: newchild = this.childwindow2; break;
                case 3: newchild = this.childwindow3; break;
                case 4: newchild = this.childwindow4; break;
            }
        }

        if (this.childopen == newchild) {
            console.log("already open");
            return;
        }
        this.CloseChildHelpWindow();
        this.childopen = newchild;

        this.OpenChildHelpWindow();
    }
}
