import { Component, Property } from '@wonderlandengine/api';

/**
 * VirtualKeyboard
 */
export class VirtualKeyboard extends Component {
    static TypeName = 'VirtualKeyboard';
    /* Properties that are configurable in the editor */
    static Properties = {
        buttonPrefab: Property.object(),
        keyparent: Property.object(),
        rows: Property.int(3), // Number of rows
        columns: Property.int(3), // Number of columns
        buttonSize: Property.float(1.0), // Size of each button
        spacing: Property.float(0.2),  // Space between buttons
        row1: Property.string("`0`e!\"#£%^&*()_-  `d/*-"),
        row2: Property.string("`3QWERTYUIOP[]`5789"),
        row3: Property.string("`4ASDFGHJKL;@ `4456"),
        row4: Property.string("`5ZXCVBNM,.?`8123"),
        textarea: Property.object(),
        messagearea: Property.object(),
        KeyboardLivePosition: Property.object(),
        KeyboardHidePosition: Property.object(),
    };

    // keymap = "1234567890\nqwertyuiop[]\nasdfghjkl:@\nzxcvbnm<>/";


    printline(row, line) {
        let espace = 0;
        let col = 0;
        for (let i = 0; i < line.length; i++) {
            let c = line[i];
            if (line[i] == '`') {
                let ins = line[++i];
                if (ins == 'e')
                    c = "esc";
                if (ins == 'd')
                    c = "Del";
                if (ins >= '0' && ins <= '9') {
                    espace += (ins - '0') / 50;
                    c = "";
                }
            }
            if (c != "" && c != " ") {
                const button = this.buttonPrefab.clone();

                const x = (col * (this.buttonSize + this.spacing)) + espace;
                const y = -row * (this.buttonSize + this.spacing); // Negative y to grow downwards
                button.setTranslationLocal([x, y, 0]);

                button.children[1].getComponent('text').text = c;
                this.buttonslist.push(button.children[1].getComponent('text'));
                button.name = c;

                this.scene.addObject(button);

                button.parent = this.keyparent;
            }
            if (c != "")
                col++;
        }

        this.makekeyslowercase();
    }

    currentline = "";
    isupper = false;


    makekeysuppercase() {
        for (const item of this.buttonslist) {
            if (item.text.length == 1)
                item.text = item.text.toUpperCase();
        }
        this.isupper = true;
    }
    makekeyslowercase() {
        for (const item of this.buttonslist) {
            if (item.text.length == 1)
                item.text = item.text.toLowerCase();
        }
        this.isupper = false;
    }

    hide() {
       // this.object.setPositionWorld(this.KeyboardHidePosition.getPositionWorld());
        this.active = false;
    }

    show(t, p, func) {
        this.ispassword = p;
        this.messagearea.text = t;
       // this.object.setPositionWorld(this.KeyboardLivePosition.getPositionWorld());
        this.active = true;
        this.callnext = func;
        this.cursorpos = 0;
        this.currentline = "";
        this.textarea.text = "";
    }

    modifpasword(t) {
        if (this.ispassword == false)
            return t;
        if (t == null || t == "" || t.length == 0)
            return t;
        return "*".repeat(t.length);
    }

    start() {
        this.callnext = null;
        this.ispassword = false;
        this.buttonslist = [];

        this.messagearea = this.messagearea.getComponent('text');

        this.messagearea.text = "Enter New Song Name:";

        this.textarea = this.textarea.getComponent('text');
        this.textarea.text = this.currentline;

        this.printline(0, this.row1);
        this.printline(1, this.row2);
        this.printline(2, this.row3);
        this.printline(3, this.row4);

        this.hide();
        return;



        /*
                const lines = this.keymap.split(/\r?\n/);
        
        
        
                // Generate buttons in a grid
                for (let row = 0; row < this.rows; row++) {
                    for (let col = 0; col < this.columns; col++) {
        
                        //const button = WL.scene.addObject(this.buttonPrefab);
                        const button = this.buttonPrefab.clone();
        
                        // Position the button in a grid layout
                        const x = col * (this.buttonSize + this.spacing);
                        const y = -row * (this.buttonSize + this.spacing); // Negative y to grow downwards
                        button.setTranslationLocal([x, y, 0]);
        
                        button.children[1].getComponent('text').text = lines[row][col];
                        //   button.getComponent('UI_Button').notevalue = CurrentNote;//setNoteText(CurrentNote);	
        
                        //	CurrentNote++;
        
                        button.name=lines[row][col];
        
                        this.scene.addObject(button);
        
                        button.parent = this.keyparent;
        
                    }
                }*/
    }

    tempshift = false;
    cursorpos = 0;

    PressKey(caller) {
        this.Press_key(caller.name);
    }

    Press_key(key){
            console.log(key.name);
        switch (key) {
            case "KeyShift":
                this.tempshift = true;
                this.isupper = !this.isupper;
                if (this.isupper)
                    this.makekeysuppercase();
                else
                    this.makekeyslowercase();
                break;
            case "esc":
                this.CloseWindow();
                break;
            case "KeyTab":
                break;
            case "Del":
                this.currentline = this.currentline.slice(0, this.cursorpos) + this.currentline.slice(this.cursorpos + 1);
                this.textarea.text = this.modifpasword(this.currentline);
                this.tog = false;
                this.tmr = 1;
                break;
            case "KeyBackSpace":
                if (this.cursorpos > 0) {
                    this.currentline = this.currentline.slice(0, this.cursorpos - 1) + this.currentline.slice(this.cursorpos);
                    this.textarea.text = this.modifpasword(this.currentline);

                    this.cursorpos--;
                    this.tog = false;
                    this.tmr = 1;
                }
                break;
            case "KeyTab":
                this.currentline += "   ";
                this.textarea.text = this.modifpasword(this.currentline);
                break;
            case "KeyCapslock":
                this.tempshift = false;
                this.isupper = !this.isupper;
                if (this.isupper)
                    this.makekeysuppercase();
                else
                    this.makekeyslowercase();
                break;
            case "KeySpace":
                this.currentline += " ";
                this.textarea.text = this.modifpasword(this.currentline);
                break;
            case "KeyEnter":
                if (this.callnext != null) {
                    this.hide();
                    this.callnext(this.currentline);
                }
                break;
            case "KeyUp":
                this.cursorpos = this.currentline.length;
                this.tog = false;
                this.tmr = 1;
                break;
            case "KeyDown":
                this.cursorpos = 0;
                this.tog = false;
                this.tmr = 1;
                break;
            case "KeyLeft":
                if (this.cursorpos > 0)
                    this.cursorpos--;
                this.tog = false;
                this.tmr = 1;
                break;
            case "KeyRight":
                if (this.cursorpos < this.currentline.length)
                    this.cursorpos++;
                this.tog = false;
                this.tmr = 1;
                break;
            default:
                if (!this.isupper)
                    this.currentline = this.currentline.slice(0, this.cursorpos) + key.toLowerCase() + this.currentline.slice(this.cursorpos);
                else
                    this.currentline = this.currentline.slice(0, this.cursorpos) + key + this.currentline.slice(this.cursorpos);

                this.cursorpos++;
                this.tog = false;
                this.tmr = 1;

                this.textarea.text = this.currentline;
                if (this.tempshift) {
                    this.tempshift = false;
                    this.isupper = !this.isupper;
                    if (this.isupper)
                        this.makekeysuppercase();
                    else
                        this.makekeyslowercase();

                }
                break;
        }
    }

    CloseWindow() {
        console.log("closekeyboard");
        this.hide();
    }

    tmr = 0;
    tog = false;




    onActivate() {
        window.addEventListener('keydown', this._onKeyDown);
    }

    onDeactivate() {
        window.removeEventListener('keydown', this._onKeyDown);
    }

    isLetter = (key) => /^[a-zA-Z]$/.test(key);
    isDigit = (key) => /^[0-9]$/.test(key);
    isSymbol = (key) => `!"£$%^&*();@,.?\/`.includes(key);
    isSpecial = (key) => [
        'Tab', 'Escape', 'Enter', 'Delete', 'Backspace','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Shift','CapsLock'
    ].includes(key);

    _onKeyDown = (event) => {
        if(this.active)
        {
        //console.log(`Key pressed: ${event.key}`);
        const key = event.key;

        if (this.isLetter(key)) {
            //console.log('Letter key:', key);
            this.Press_key(key);
        } else if (this.isDigit(key)) {
            //console.log('Digit key:', key);
            this.Press_key(key);
        } else if (this.isSymbol(key)) {
            //console.log('Symbol key:', key);
            this.Press_key(key);
        } else if (this.isSpecial(key)) {
            console.log('Special key:', key);
            if(key=="Tab")
                this.Press_key("KeyTab");
            if(key=="Escape")
                this.Press_key("esc");
            if(key=="Delete")
                this.Press_key("Del");
            if(key=="Backspace")
                this.Press_key("KeyBackSpace");
            if(key=="ArrowUp") this.Press_key("KeyUp");
            if(key=="ArrowDown") this.Press_key("KeyDown");
            if(key=="ArrowLeft") this.Press_key("KeyLeft");
            if(key=="ArrowRight") this.Press_key("KeyRight");
            if(key=="Enter")
                this.Press_key("KeyEnter");
            if(key=='Shift') this.Press_key("KeyShift");
            if(key=='CapsLock') this.Press_key("KeyCapslock");
        } else {
            console.log('Other key:', key);
              if(key==" ")
                this.Press_key(" ");
            //ignore this then
        }
     }
    };


    update(dt) {
        /* Called every frame. */


        this.tmr += dt;
        if (this.tmr > 1) {
            this.tmr = 0;
            this.tog = !this.tog;

            let char = " ";
            if (this.tog)
                char = "|";

            let line = this.modifpasword(this.currentline.slice(0, this.cursorpos)) + char + this.modifpasword(this.currentline.slice(this.cursorpos));

            this.textarea.text = line;
        }
    }
}
