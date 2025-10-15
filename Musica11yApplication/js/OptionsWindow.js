import { Component, Property } from '@wonderlandengine/api';

/**
 * OptionsWindow
 */
export class OptionsWindow extends Component {
    static TypeName = 'OptionsWindow';
    /* Properties that are configurable in the editor */
    static Properties = {
        ScreenBlocker: Property.object(), // Assign the inpput blocker (optional)
        ScreenFader: Property.object(), // Assign the screenfader (optional)
        MusicMan: Property.object(),
        ChildWindowExtension: Property.object(),//button has an linked extension
        MessageBox: Property.object(),
    };

    start() {

        // if(this.MusicMan==null)
        //    console.log("MusicMan FAILED TO FIND IT WAS NULL " ,this.object.name);

        this.loadsave = this.MusicMan.getComponent('loadsave');
        this.musicmanref = this.MusicMan.getComponent('MusicManagement');
        //   if(this.musicmanref==null)
        //    console.log("FAILED TO FIND IT WAS NULL");
    }

    CTRL_LOGOUT() {
        // if(this.musicmanref==null)
        //    console.log("IT WAS NULL");
        if (this.musicmanref.InTestMode || this.musicmanref.InKeySelect)
            return;

        //if we are already loged out then open log in window
        if (this.MusicMan.getComponent("loadsave").checkloggedin() == true) {
            this.ChildWindowExtension.getComponent('ChildWindowExtension').enableme();

        }
        else {
            console.log("LOG IN WINDOW " + this.musicmanref.virtualkeyboard);
            this.musicmanref.virtualkeyboard.show("Enter USERNAME:", false, this.after_enteruser.bind(this));
            //Enter username keyboard
            //Enter Password keyboard (use * not text)
            //Log in if possible or error if not
        }
    }

    after_enteruser(t) {
        this.usernamewas = t;// this.musicmanref.virtualkeyboard.currentline;
        console.log("LOG IN WINDOW " + this.musicmanref.virtualkeyboard);
        this.musicmanref.virtualkeyboard.show("Enter PASSWORD:", true, this.after_enterpassword.bind(this));
    }


    after_enterpassword(t) {
        console.log("p0");
        let password = t;//this.musicmanref.virtualkeyboard.currentline;
        //console.log("TRY LOG IN: username=" + this.usernamewas + " " + password);

        const formData = new URLSearchParams();
        formData.append("username", this.usernamewas);
        formData.append("password", password);

        // const uname=this.usernamewas;

        fetch("../playerman/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
            .then(response => response.text())
            .then(function (data) {//} => {
                console.log("RESPONSE=" + data);
                if (data == "Success: Logged in.") {
                    console.log("Login successful!");
                    // You can store session info or redirect here
                    //set logged in details
                    //set log in text
                    this.MusicMan.getComponent("loadsave").dologin(this.usernamewas);
                    this.toggleOptions();
                } else {
                    console.log("Login failed:");

                    this.MusicMan.getComponent("loadsave").loginfail();
                }
            }.bind(this))
            .catch(function (error) {//} => {
                console.error("Error during login:", error);
            });
    }


    CTRL_ReturnToHTML() {
        window.location.href = 'https://musica11y.net';
    }

    ConfirmLogOUTOK() {
        //LOGOUT should send them back to the start log in page really
        this.ChildWindowExtension.getComponent('ChildWindowExtension').disableme();
        this.toggleOptions();
        this.MusicMan.getComponent("loadsave").dologout();
    }

    ConfirmLogOUTOKCancel() {
        this.ChildWindowExtension.getComponent('ChildWindowExtension').disableme();
        this.toggleOptions();
    }
    CTRL_Save() {
        this.toggleOptions();

         if (!this.MusicMan.getComponent('loadsave').CanSave) {
            this.MessageBox.getComponent('SimpleMessageBox').show("Cannot save this song");
        }
        else {
            this.MusicMan.getComponent('loadsave').doSave(false);//TODO TEST THIS
        }
    }
    CTRL_Options() {
        this.toggleOptions();
    }

    optionsOpen = false;

    toggleOptions() {
        this.optionsOpen = !this.optionsOpen;
        if (this.ScreenBlocker)
            this.ScreenBlocker.active = this.optionsOpen;
        if (this.ScreenFader)
            this.ScreenFader.active = this.optionsOpen;

        //let children = this.object.parent.children;
        let children = this.object.children;
        children.forEach((element) => {
            let b = element.getComponent("ButtonFanOut");
            if (b) {
                b.fadingin = this.optionsOpen;
                b.fadingout = !this.optionsOpen;
            }
        });
    }

    CTRL_New() {
        this.musicmanref.virtualkeyboard.show("Enter NEW songname:", false, this.after_selectNew.bind(this));
    }

    after_selectNew(t) {

        this.toggleOptions();
        //clear it and set the name
        this.musicmanref.clearAllSpanchors();
        this.loadsave.SessionnameTextAres.getComponent('text').text = "Session: " + t;
        this.loadsave.CanSave = true;
        this.loadsave.SessionnamePadlock.active = false;
        this.loadsave.link_path=null;
        //  this.loadsave.username=pusername;
        this.loadsave.filename = t;

        /*    <h3>Create Session File</h3>
      <form id="createSessionForm" method="post" action="create_session.php">
          <label for="sessionFilename">Filename:</label>
          <input type="text" id="sessionFilename" name="sessionFilename" required><br><br>
          <input type="submit" value="Create Session">
      </form>*/
        var formData = new URLSearchParams();
        formData.append("sessionFilename", t);

        fetch("../playerman/create_session.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
            .then(response => response.text())
            .then(function (data) {
                console.log("Server response:", data);
                // You can trigger animations, update UI, or refresh session list here
            })
            .catch(function (error) {
                console.error("Error creating session:", error);
            });
    }

    CTRL_Load() {
        fetch('../playerman/list_sessions.php')
            .then(response => response.json())
            .then(data => {
                const sessions = data.sessions;
                console.log(">" + sessions + "<"); // → ["session1.txt", "session2.txt", ...]
                this.musicmanref.filelistwindow.loadwindow(sessions);
                this.musicmanref.filelistwindow.show("Select song to load", this.after_selectload.bind(this));
            })
            .catch(error => {
                console.error("Error fetching sessions:", error);
            });
    }

    CTRL_loadpublic() {
        fetch('../playerman/list_public_sessions.php')
            .then(response => response.json())
            .then(data => {
                const sessions = data.sessions;
                console.log(">" + sessions + "<"); // → ["session1.txt", "session2.txt", ...]
                this.musicmanref.filelistwindow.loadwindow(sessions);
                this.musicmanref.filelistwindow.show("Select Public song to load (You can not save this)", this.after_selectloadpublic.bind(this));
            })
            .catch(error => {
                console.error("Error fetching sessions:", error);
            });
    }

    CTRL_SharePrivate() {
        if (!this.MusicMan.getComponent('loadsave').CanSave) {
            this.toggleOptions();
            this.MessageBox.getComponent('SimpleMessageBox').show("Cannot share this song");
        }
        else
            this.musicmanref.virtualkeyboard.show("Enter who's USERNAME to share this with:", false, this.after_shareNew.bind(this));
    }

    after_shareNew(t) {
        console.log("TODO Add " + t + " to the share list for this song");
        this.toggleOptions();

        this.MusicMan.getComponent('loadsave').doSave(false);//TODO TEST THIS
        //WE need to save a HOTlink in the target folder
        //WE need to understand this during a load FILENAME.targetuser.lnk
        //let targetplayer="../playerman/players/"+t+"/Sessions/"+CURRENTSONGTITLE+"."+CURRENTUSER+".lnk";
        // console.log(targetplayer);
        this.MusicMan.getComponent('loadsave').savelink(t);
        // this.MessageBox.getComponent('SimpleMessageBox').show("Song Shared with "+t);

    }

    after_selectload(t) {
        console.log(">>load " + t);
        this.loadsave.doloadprivate(t);
        this.toggleOptions();
    }

    after_selectloadpublic(t) {
        console.log(">>loadpublic " + t);
        this.loadsave.doloadpublic(t);
        this.toggleOptions();
    }

    CTRL_SharePublic() {
       // console.log("TODO");
        this.toggleOptions(); //TODO
        if (!this.MusicMan.getComponent('loadsave').CanSave) {
            this.MessageBox.getComponent('SimpleMessageBox').show("Cannot share this song");
        }
        else {
            this.MusicMan.getComponent('loadsave').doSave(false);//TODO TEST THIS
            this.MusicMan.getComponent('loadsave').doSave(true);//TODO TEST THIS
            this.MessageBox.getComponent('SimpleMessageBox').show("Song Shared in Public");
        }
    }

}
