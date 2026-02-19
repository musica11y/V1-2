import { Component, Property } from '@wonderlandengine/api';
import { MaterialScheme } from './MaterialScheme';
import { MusicManagement } from './MusicManagement';

/**
 * loadsave
 */
export class Loadsave extends Component {
	static TypeName = 'loadsave';
	/* Properties that are configurable in the editor */
	static Properties = {
		UsernameTextAres: Property.object(),
		SessionnameTextAres: Property.object(),
		SessionnamePadlock: Property.object(),
		SpanchorButtonGen: Property.object(),
		LayerManager: Property.object(),
		SaveButtonText: Property.object(),
		LogoutButtonText: Property.object(),
		LoadPrivateButtonText: Property.object(),
		Musicman: Property.object(),
		BPMText: Property.object(),
		SettingsWin: Property.object(),
		ThreeDControlwin: Property.object(),

		LoadPublicButtonText: Property.object(),
		ShareButtonText: Property.object(),
		NewPublicButtonText: Property.object(),
		SaveLocalPublicButtonText: Property.object(),
		MessageBox: Property.object(),
		//	Lpanelref: Property.object(),
		//	Mpanelref: Property.object(),
		//	Rpanelref: Property.object(),

	};

	CanSave = false;
	userpath = "";

	start() {
		this.SessionnamePadlock = this.SessionnamePadlock.getComponent('mesh');

		this.SettingsWin = this.SettingsWin.getComponent('SettingsWindow');
		console.log("+++++++++++++++++ettings window ", this.SettingsWin.object.name);
		this.ThreeDControlwin = this.ThreeDControlwin.getComponent('ThreeDControl');
		// const params = new URLSearchParams(window.location.search);
		//	const param1 = params.get('loadf');
		//	const param2 = params.get('param2');
		//	console.log('param1:', param1);
		//	console.log('param2:', param2);	

		//https://musica11y.net/webapp/index.html?param1=%22RODNEY%22&param2=13

		const sessiontype = localStorage.getItem('sessiontype');
		const username = localStorage.getItem('username');
		const sessionid = localStorage.getItem('sessionid');
		this.userpath = localStorage.getItem('userpath');
		if (username) {
			this.username = username;

			console.log('Received username:', username);
			console.log('Received userpath:', this.userpath);
			console.log('Session type:', sessiontype);
			// Process the username, e.g., display in VR/AR environment or use for further logic

			this.UsernameTextAres.getComponent('text').text = "User: " + username;
			this.SessionnameTextAres.getComponent('text').text = "Session: " + sessionid;

			if(sessionid==null || sessionid=="null")
			{
				this.SessionnamePadlock.active = true;
				this.CanSave = false;
			}
			else if (sessiontype == "private") {
				this.SessionnamePadlock.active = false;
				this.CanSave = true;
			}
			if(sessionid!=null && sessionid!="null")
			setTimeout(() => {
				console.log(">>>>>>" + this.userpath + "<<<<");
				this.doload(this.userpath);
				this.doLoadSettings();
			}, 100);

		} else {
			console.log('No username found in local storage.');
			this.disableall(false, MaterialScheme.TEXT_disabledcolour, false, "");
		}
	}

	disableall(turnon, colr, cansave, uname) {
		if (turnon) {
			this.UsernameTextAres.getComponent('text').text = "User: " + uname;
			this.SessionnameTextAres.getComponent('text').text = "Session: ";
		}
		else {
			this.UsernameTextAres.getComponent('text').text = "User: Not signed in";
			this.SessionnameTextAres.getComponent('text').text = "Session: ";
		}


		this.CanSave = cansave;
		this.SaveButtonText.getComponent('text').material = this.SaveButtonText.getComponent('text').material.clone();
		this.SaveButtonText.getComponent('text').material.color = colr;
		this.SaveButtonText.parent.getComponent('collision').active = turnon;


		this.LogoutButtonText.getComponent('text').material = this.SaveButtonText.getComponent('text').material.clone();
		this.LogoutButtonText.getComponent('text').text = "LOG\nIN";
		this.LogoutButtonText.getComponent('text').material.color = colr;
		//this.LogoutButtonText.getComponent('text').material.color = MaterialScheme.TEXT_disabledcolour;
		//this.LogoutButtonText.parent.getComponent('collision').active = false;

		this.LoadPrivateButtonText.getComponent('text').material = this.SaveButtonText.getComponent('text').material.clone();
		this.LoadPrivateButtonText.getComponent('text').material.color = colr;
		this.LoadPrivateButtonText.parent.getComponent('collision').active = turnon;

		this.LoadPublicButtonText.getComponent('text').material = this.LoadPublicButtonText.getComponent('text').material.clone();
		this.LoadPublicButtonText.getComponent('text').material.color = colr;
		this.LoadPublicButtonText.parent.getComponent('collision').active = turnon;

		this.ShareButtonText.getComponent('text').material = this.ShareButtonText.getComponent('text').material.clone();
		this.ShareButtonText.getComponent('text').material.color = colr;
		this.ShareButtonText.parent.getComponent('collision').active = turnon;

		this.NewPublicButtonText.getComponent('text').material = this.NewPublicButtonText.getComponent('text').material.clone();
		this.NewPublicButtonText.getComponent('text').material.color = colr;
		this.NewPublicButtonText.parent.getComponent('collision').active = turnon;

		this.SaveLocalPublicButtonText.getComponent('text').material = this.SaveLocalPublicButtonText.getComponent('text').material.clone();
		this.SaveLocalPublicButtonText.getComponent('text').material.color = colr;
		this.SaveLocalPublicButtonText.parent.getComponent('collision').active = turnon;
	}

	dologout() {
		localStorage.clear();
		this.disableall(false, MaterialScheme.TEXT_disabledcolour, false, "");
		console.log("LOGGED OUT");
		window.location.href = 'https://musica11y.net';
		this.LogoutButtonText.getComponent('text').text = "LOG\nIN";
	}	

	dologin(pusername) {
		//const userpath = 'players/' + document.getElementById('currentUser').innerText.split(": ")[1] + '/sessions/' + session;
		this.userpath = "players/" + pusername + "/sessions/";
		this.username = pusername;
		this.filename = "NewFile";
		console.log("Welcome: " + this.userpath);
		this.disableall(true, MaterialScheme.TEXT_enabledcolour, false, pusername);
		this.LogoutButtonText.getComponent('text').text = "LOG\nOUT";
		this.CanSave = false;
		this.SessionnamePadlock.active = true;//cant save as we need to new first-could be an issue maybe should invoke a save as instead
	}

	loginfail() {
		this.SessionnameTextAres.getComponent('text').text = "Session: Invalid USERNAME or PASSWORD";
	}

	checkloggedin() {
		if (this.username== null) return false;
		//if (this.userpath == null) return false;
		return true;
	}

	//saves on close panel and exit VR mode
	doSaveSettings() {
		console.log("trying to save settings");
		if(this.username == null){//if (this.userpath == null) {
			console.log("not logged in to save settings");
			return;
		}

		let thetext = "[Musica11y Settings]:0.0\n";

		thetext += "[GAZESIZE]:" + this.SettingsWin.eyeraycastmachine.children[0].getScalingLocal()[0] + "\n";
		thetext += "[RAYCAST]:" + this.SettingsWin.raycaston + "\n";
		thetext += "[AUTOPLAYGAZE]:" + this.SettingsWin.auto_ray_on + "\n";
		thetext += "[AUTOPLAYMOUSE]:" + this.SettingsWin.auto_mouse_on + "\n";
		thetext += "[RAYCASTt1]:" + this.SettingsWin.HeldTimeShort + "\n";
		thetext += "[RAYCASTt2]:" + this.SettingsWin.HeldTimeMedium + "\n";
		thetext += "[RAYCASTt3]:" + this.SettingsWin.HeldTimeLong + "\n";

		if (this.ThreeDControlwin.leftPanel != null) {
			thetext += "[VRPANELLEFT_SCALE]:" + this.SettingsWin.PlayModeManager.wehaveprevousScaleL + "\n";//this.ThreeDControlwin.leftPanel.getScalingLocal()[0] + "\n";
			thetext += "[VRPANELLEFT_A]:" + this.SettingsWin.PlayModeManager.wehaveprevousRotL + "\n";//this.ThreeDControlwin.leftPanel.getRotationWorld() + "\n";
			thetext += "[VRPANELLEFT_LOC]:" + this.SettingsWin.PlayModeManager.wehaveprevousPosL + "\n";//this.ThreeDControlwin.leftPanel.getTranslationWorld() + "\n";
		}

		if (this.ThreeDControlwin.middlePanel) {
			thetext += "[VRPANELMID_SCALE]:" + this.SettingsWin.PlayModeManager.wehaveprevousScaleM + "\n";//this.ThreeDControlwin.middlePanel.getScalingLocal()[0] + "\n";
			thetext += "[VRPANELMID_A]:" + this.SettingsWin.PlayModeManager.wehaveprevousRotM + "\n";//this.ThreeDControlwin.middlePanel.getRotationWorld() + "\n";
			thetext += "[VRPANELMID_LOC]:" + this.SettingsWin.PlayModeManager.wehaveprevousPosM + "\n";//this.ThreeDControlwin.middlePanel.getTranslationWorld() + "\n";
		}

		if (this.ThreeDControlwin.rightPanel) {
			thetext += "[VRPANELRIGHT_SCALE]:" + this.SettingsWin.PlayModeManager.wehaveprevousScaleR + "\n";//this.ThreeDControlwin.rightPanel.getScalingLocal()[0] + "\n";
			thetext += "[VRPANELRIGHT_A]:" + this.SettingsWin.PlayModeManager.wehaveprevousRotR + "\n";// this.ThreeDControlwin.rightPanel.getRotationWorld() + "\n";
			thetext += "[VRPANELRIGHT_LOC]:" + this.SettingsWin.PlayModeManager.wehaveprevousPosR + "\n";//this.ThreeDControlwin.rightPanel.getTranslationWorld() + "\n";
		}

		thetext += "[CAMOFFY]:" + this.SettingsWin.PlayModeManager.PlayCameraRef.getTranslationWorld()[1] + "\n";
		thetext += "[CAMVRDESOFFY]:" + this.SettingsWin.PlayModeManager.PlayModeCameraPosition.getTranslationWorld()[1] + "\n";

		//const parts = this.userpath.split('/');
		//const rootPath = parts.slice(0, 2).join('/') + '/' + "settings.txt";
		const rootPath = "../playerman/players/" + this.username + '/settings.txt';

		console.log("userpath:", this.userpath);
		console.log("username:", this.username);
		console.log("We are saving to:", rootPath);

		const data = {
			text: thetext,
			filePath: rootPath
		};

		fetch('../playerman/writeFile.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(response => response.text())
			.then(data => {
				console.log(data); // File written successfully
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	doLoadSettings() {

		//const parts = this.userpath.split('/');
		//const fname = parts.slice(0, 2).join('/') + '/' + "settings.txt";
		const fname = "../playerman/players/" + this.username + '/settings.txt';

		console.log("LOAD settings: ../playerman/", fname);
		fetch('../playerman/' + fname, { cache: 'reload' })
			.then(response => response.text())
			.then(data => {
				//console.log(data);
				console.log("LOADED OK NOW PARSE IT");
				const lines = data.split('\n');
				lines.forEach(line => {
					const words = line.split(':');
					const firstWord = words[0];
					console.log("first word is ", firstWord);
					switch (firstWord) {
						case "[Musica11y Settings]":
							console.log("File version ", words[1]);
							break;
						case "[GAZESIZE]":
							//value is  line.split(':')[1];
							let gazesize = parseFloat(words[1]);
							console.log("gazesize ", gazesize, " from ", words[1]);
							//thetext += "[GAZESIZE]:" + this.SettingsWin.eyeraycastmachine.children[0].getScalingLocal()[0] + "\n";

							let cb = [gazesize, gazesize, gazesize];
							this.SettingsWin.eyeraycastmachine.children[0].setScalingLocal(cb);
							break;
						case "[RAYCAST]":
							//value is  line.split(':')[1];
							if (words[1] == "true") {
								this.SettingsWin.raycaston = true;
							}
							else {
								this.SettingsWin.raycaston = false;
							}
							console.log("Raycase ", words[1]);
							break;
						case "[AUTOPLAYGAZE]":
							if (words[1] == "true") {
								this.SettingsWin.auto_ray_on = true;
							}
							else {
								this.SettingsWin.auto_ray_on = false;
							}
							console.log("AUTOPLAYGAZE ", words[1]);
							break;
						case "[AUTOPLAYMOUSE]":
							if (words[1] == "true") {
								this.SettingsWin.auto_mouse_on = true;
							}
							else {
								this.SettingsWin.auto_mouse_on = false;
							}
							console.log("AUTOPLAYGAZE ", words[1]);
							break;
						case "[RAYCASTt1]":
							let v1 = parseInt(words[1], 10);
							console.log("v1 ", v1);
							this.SettingsWin.HeldTimeShort = v1;
							break;
						case "[RAYCASTt2]":
							let v2 = parseInt(words[1], 10);
							console.log("v2 ", v2);
							this.SettingsWin.HeldTimeMedium + v2;
							break;
						case "[RAYCASTt3]":
							let v3 = parseInt(words[1], 10);
							console.log("v3 ", v3);
							this.SettingsWin.HeldTimeLong = v3;
							break;
						case "[CAMOFFY]":
							//value is  line.split(':')[1];
							let camoffY = parseFloat(words[1]);
							console.log("camoffY ", camoffY, " from ", words[1]);
							let oldplayerpos = this.SettingsWin.PlayModeManager.PlayCameraRef.getTranslationWorld();
							oldplayerpos[1] = camoffY;
						//	this.SettingsWin.PlayModeManager.PlayCameraRef.setTranslationWorld(oldplayerpos);
							//						this.PlayCameraRef.setTranslationWorld(oldplayerpos);//failed
							break;
						case "[CAMVRDESOFFY]":
							//value is  line.split(':')[1];
							let CAMVRDESOFFY = parseFloat(words[1]);
							console.log("CAMVRDESOFFY ", CAMVRDESOFFY, " from ", words[1]);

							let camdes = this.SettingsWin.PlayModeManager.PlayModeCameraPosition.getTranslationWorld();
							camdes[1] = CAMVRDESOFFY;
							this.SettingsWin.PlayModeManager.PlayModeCameraPosition.setTranslationWorld(camdes);
							break;

						case "[VRPANELLEFT_SCALE]":// + this.ThreeDControlwin.leftPanel.getScalingLocal()[0] + "\n";
							//1
							//let leftsize = parseFloat(words[1]);
							//let lcb = [leftsize, leftsize, leftsize];
							//this.SettingsWin.PlayModeManager.wehaveprevousScaleL = lcb;
							let svalues3l = words[1].split(',');
							let sv3l = [parseFloat(svalues3l[0]), parseFloat(svalues3l[1]), parseFloat(svalues3l[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousScaleL = sv3l;

							break;
						case "[VRPANELLEFT_A]": //]:" + this.ThreeDControlwin.leftPanel.getRotationLocal() + "\n";
							//4
							let lvalues4 = words[1].split(',');
							let lv4 = [parseFloat(lvalues4[0]), parseFloat(lvalues4[1]), parseFloat(lvalues4[2]), parseFloat(lvalues4[3])];
							this.SettingsWin.PlayModeManager.wehaveprevousRotL = lv4;
							break;
						case "[VRPANELLEFT_LOC]":// + this.ThreeDControlwin.leftPanel.getTranslationWorld()+ "\n";
							//3
							let lvalues3 = words[1].split(',');
							let lv3 = [parseFloat(lvalues3[0]), parseFloat(lvalues3[1]), parseFloat(lvalues3[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousPosL = lv3;
							break;
						case "[VRPANELMID_SCALE]":// + this.ThreeDControlwin.leftPanel.getScalingLocal()[0] + "\n";
							//1
							//let midsize = parseFloat(words[1]);
							//let mcb = [midsize, midsize, midsize];
							//this.SettingsWin.PlayModeManager.wehaveprevousScaleM = mcb;

							let svalues3m = words[1].split(',');
							let sv3m = [parseFloat(svalues3m[0]), parseFloat(svalues3m[1]), parseFloat(svalues3m[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousScaleM = sv3m;

							break;
						case "[VRPANELMID_A]": //]:" + this.ThreeDControlwin.leftPanel.getRotationLocal() + "\n";
							//4
							let mvalues4 = words[1].split(',');
							let mv4 = [parseFloat(mvalues4[0]), parseFloat(mvalues4[1]), parseFloat(mvalues4[2]), parseFloat(mvalues4[3])];
							this.SettingsWin.PlayModeManager.wehaveprevousRotM = mv4;
							break;
						case "[VRPANELMID_LOC]":// + this.ThreeDControlwin.leftPanel.getTranslationWorld()+ "\n";
							//3
							let mvalues3 = words[1].split(',');
							let mv3 = [parseFloat(mvalues3[0]), parseFloat(mvalues3[1]), parseFloat(mvalues3[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousPosM = mv3;
							break;
						case "[VRPANELRIGHT_SCALE]":// + this.ThreeDControlwin.leftPanel.getScalingLocal()[0] + "\n";
							//1
							//let rightsize = parseFloat(words[1]);
							//console.log("scale returns ",rightsize);
							//let rcb = [rightsize, rightsize, rightsize];
							//this.SettingsWin.PlayModeManager.wehaveprevousScaleR = rcb;
							let svalues3 = words[1].split(',');
							let sv3 = [parseFloat(svalues3[0]), parseFloat(svalues3[1]), parseFloat(svalues3[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousScaleR = sv3;
							break;
						case "[VRPANELRIGHT_A]": //]:" + this.ThreeDControlwin.leftPanel.getRotationLocal() + "\n";
							//4
							let rvalues4 = words[1].split(',');
							//console.log("rotate returns ",rvalues4," from ",line);
							let rv4 = [parseFloat(rvalues4[0]), parseFloat(rvalues4[1]), parseFloat(rvalues4[2]), parseFloat(rvalues4[3])];
							this.SettingsWin.PlayModeManager.wehaveprevousRotR = rv4;
							break;
						case "[VRPANELRIGHT_LOC]":// + this.ThreeDControlwin.leftPanel.getTranslationWorld()+ "\n";
							//3
							let rvalues3 = words[1].split(',');
							console.log("loc returns ", rvalues3, " from ", line);
							let rv3 = [parseFloat(rvalues3[0]), parseFloat(rvalues3[1]), parseFloat(rvalues3[2])];
							this.SettingsWin.PlayModeManager.wehaveprevousPosR = rv3;

							if (isNaN(this.SettingsWin.PlayModeManager.wehaveprevousRotL[0])) {
								console.warn("leftPanel rot contains NaN:");
							}
							else if (isNaN(this.SettingsWin.PlayModeManager.wehaveprevousRotM[0])) {
								console.warn("middlePanel rot contains NaN:");
							}
							else if (isNaN(this.SettingsWin.PlayModeManager.wehaveprevousRotR[0])) {
								console.warn("rightPanel rot contains NaN:");
							}
							else {
								this.SettingsWin.PlayModeManager.wehavepreviousones = true;//assume if we have one we have all
								//	console.log("********** WE HAVE LOADED SOMETHING");
								//	console.log("Rpos ", this.SettingsWin.PlayModeManager.wehaveprevousPosR);
								//	console.log("Rrot ", this.SettingsWin.PlayModeManager.wehaveprevousRotR);
								//	console.log("Rscale ", this.SettingsWin.PlayModeManager.wehaveprevousScaleR);
							}
							break;
					}
					this.SettingsWin.update_values();
				});
			})
			.catch(error => console.error('Error loading the settings text file:', error));
	}

	doSave(publicsave) {
		if (!this.CanSave) {
			console.log("SAVE DISABLED");
			return;
		}
		console.log("SAVing");
		//HEADER
		let thetext = "[Musica11y Save File]:0.2\n";

		let row = this.SpanchorButtonGen.getComponent('generate-buttons').currentRowCntr;
		let col = this.SpanchorButtonGen.getComponent('generate-buttons').currentColCntr;

		//save the X and Y size of the spanchor board
		//		thetext += "[RowCountx]:" + col + "\n";
		//		thetext += "[ColumnCountY]:" + row + "\n";
		thetext += "[RowCountx]:" + row + "\n";
		thetext += "[ColumnCountY]:" + col + "\n";

		//console.log("@"+thetext);

		thetext += "[BPM]:" + this.Musicman.getComponent('MusicManagement').bpm;

		const lman = this.LayerManager.getComponent('LayerManager');
		if (lman == null) {
			console.log("Layermanager not found");
			return;
		}
		//ensure current player is uptodate
		lman.storeCurrentPanel();

		//loop for all the layers
		for (let i = 0; i < lman.layerbuttons.length; i++) {
			if (i < lman.LayerCount) {
				thetext += "\n\n[PANEL]:" + i + "\n";
				thetext += "\n[LEFT]\n";
				thetext += "[LOOP]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[0] + "\n";
				thetext += "[SEQUENCE]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[0] + "\n";
				thetext += "[HIDDEN]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[0] + "\n";
				thetext += "[SOUNDFONT]:" + lman.getPanelSoundFont(i, 0) + "\n";
				thetext += "[NS]:" + lman.getPanelData(i, 0, col);//panel, mlr=0,1,2 for left middle right
				thetext += "\n\n[END]";

				thetext += "\n[MIDDLE]\n";
				thetext += "[LOOP]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[0] + "\n";
				thetext += "[SEQUENCE]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[0] + "\n";
				thetext += "[HIDDEN]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[0] + "\n";
				thetext += "[SOUNDFONT]:" + lman.getPanelSoundFont(i, 1) + "\n";
				thetext += "[NS]:" + lman.getPanelData(i, 1, col);//panel, mlr=0,1,2 for left middle right
				thetext += "\n\n[END]";

				thetext += "\n[RIGHT]\n";
				thetext += "[LOOP]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeLoop[0] + "\n";
				thetext += "[SEQUENCE]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeSequence[0] + "\n";
				thetext += "[HIDDEN]:" + lman.layerbuttons[i].getComponent('LayerAnchorDataStorage').WeVisible[0] + "\n";
				thetext += "[SOUNDFONT]:" + lman.getPanelSoundFont(i, 2) + "\n";
				thetext += "[NS]:" + lman.getPanelData(i, 2, col);//panel, mlr=0,1,2 for left middle right
				thetext += "\n\n[END]";
			}
		}



		//const parts = this.userpath.split('/');
		
		//const rootPath = "../playerman/" + parts.slice(0, 2).join('/') + '/sessions/' + this.SessionnameTextAres.getComponent('text').text + ".txt";
		const rootPath = "../playerman/players/" + this.username + '/sessions/' + this.SessionnameTextAres.getComponent('text').text + ".txt";



		if (publicsave) {
			const data = {
				text: thetext,
				filePath: "../playerman/public_sessions/" + this.filename + ".txt"
			};
			console.log("PUBLICSAVE " + "../playerman/public_sessions/" + this.filename + ".txt"); //FILENAME: players/RodneyMc/sessions/	SHould be ../playerman/public_sessions/NAME.txt
			fetch('../playerman/writeFilePublic.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then(response => response.text())
				.then(data => {
					console.log(data); // File written successfully
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
		else {

		
			const data = {
				text: thetext,
				filePath: "../playerman/players/" + this.username + "/sessions/" + this.filename + ".txt"
			};

			if(this.link_path!=null)
			{
				data.thetext=this.link_path;
				console.log("WE KNOW ABOUT THE LINK");
			}
			console.log("LOCALSAVE " +data.thetext);// "../playerman/players/" + this.username + "/" + this.filename + ".txt");	//FILENAME: players/RodneyMc/sessions/	SHould be ../playerman/players/RodneyMc/sessions/NAME.txt
		
			fetch('../playerman/writeFile.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then(response => response.text())
				.then(data => {
					console.log(data); // File written successfully
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	}

	savelink(t) {

		//const parts = this.userpath.split('/');
		//const rootPath = "../playerman/" + parts.slice(0, 2).join('/') + '/sessions/' + fname;
		//const targetplayer="../playerman/players/"+t+"/Sessions/"+CURRENTSONGTITLE+"."+CURRENTUSER+".lnk";
		//const targetplayer = "../playerman/players/" + t + "/Sessions/" + parts[1] + "." + parts[2] + ".lnk";
		const targetplayer = "../playerman/players/" + t + "/Sessions/" + this.filename + "." + this.username + ".lnk";
		console.log("targetplaer: ",targetplayer);
		console.log(t);

		//check if user parts[1] exists
		//ok then save it		
		const data = {
			text: "",
			username: t,
			filePath: targetplayer
		};
		fetch('../playerman/writeLinkFile.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(response => response.text())
			.then(data => {
				console.log(data); // File written successfully
				if(data=="File Written successfully")
					this.MessageBox.getComponent('SimpleMessageBox').show("Song Shared with "+t);
				else this.MessageBox.getComponent('SimpleMessageBox').show(data);
			})
			.catch((error) => {
				console.error('Error:', error);
 				this.MessageBox.getComponent('SimpleMessageBox').show(error);
			});
	}

	doload(fname) {
		this.SessionnamePadlock.active = false;
		this.CanSave = true;
		
		this.link_path=null;

		//const parts = this.userpath.split('/');
		//const rootPath ="../playerman/"+parts.slice(0, 2).join('/') + '/sessions/' + fname;
		const rootPath = "../playerman/" + fname;

		this.filename = fname.split(/[/\\]/).pop();


		const extension = fname.split('.').pop();
		if (extension == "lnk") {
			//load the link;d file instead

			// FILENAME.USERNAME.LNK
			this.link_path=fname;
			let parts=fname.split('.');
			let filen="../playerman/"+parts[0]+".txt";// "../playerman/players/" + parts[1] + "/sessions/" + parts[0] + ".txt";
			console.log(filen);
			this.filename = parts[0];
			this.dotheload(filen);//need to loose the last entry
			return;
		}




		console.log(rootPath);
		this.dotheload(rootPath);//need to loose the last entry
	}


	removeExtension(filename) {
		const dotIndex = filename.lastIndexOf(".");
		return dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
	}



	doloadprivate(fname) {

		this.SessionnamePadlock.active = false;
		this.CanSave = true;
		this.link_path=null;

		const extension = fname.split('.').pop();
		if (extension == "lnk") {
			//load the link;d file instead

			// FILENAME.USERNAME.LNK
			this.link_path=fname;
			let parts=fname.split('.');
			let filen="../playerman/players/" + parts[1] + "/sessions/" + parts[0] + ".txt";
			console.log(filen);
			this.filename = parts[0];
			this.dotheload(filen);//need to loose the last entry
			return;
		}

	
		this.filename = this.removeExtension(fname);

		//const parts = this.userpath.split('/');
		//const rootPath = "../playerman/" + parts.slice(0, 2).join('/') + '/sessions/' + fname;
		let rootPath = "../playerman/players/" + this.username + "/sessions/" + this.filename + ".txt";

		console.log(rootPath);
		this.dotheload(rootPath);//need to loose the last entry
	}

	doloadpublic(fname) {
		this.SessionnamePadlock.active = true;
		this.CanSave = false;

		this.filename = fname;

		console.log('../playerman/public_sessions/' + fname);
		this.dotheload('../playerman/public_sessions/' + fname);
	}

	dotheload(fpath) {
		console.log("LOAD THISWEBSITE: ", fpath);

		this.SessionnameTextAres.getComponent('text').text = "Session: " + fpath.split('/').pop()
		fetch(fpath, { cache: 'reload' })
			.then(response => response.text())
			.then(data => {
				const lman = this.LayerManager.getComponent('LayerManager');
				if (lman == null) {
					console.log("Layermanager not found");
					return;
				}

				this.Musicman.getComponent('MusicManagement').clearAllSpanchors();

				lman.ResetPanelPtr();

				//console.log(data);
				console.log("LOADED OK NOW PARSE IT");
				const lines = data.split('\n');
				let currentpanel = 0;
				let inapanel = -1;
				let currentY = 0;
				let numarray = [];
				let row = this.SpanchorButtonGen.getComponent('generate-buttons').currentRowCntr;
				let col = this.SpanchorButtonGen.getComponent('generate-buttons').currentColCntr;

				let sfont = 0;
				let ssub = 0;
				let fontname = "";
				lines.forEach(line => {
					const words = line.split(':');
					const firstWord = words[0];
					console.log("first word is ", firstWord);
					switch (firstWord) {
						case "[Musica11y Save File]":
							console.log("File version ", words[1]);
							break;
						case "[RowCountx]":
							//value is  line.split(':')[1];
							row = parseInt(words[1], 10);
							console.log("GOT ", row, " from ", words[1]);
							break;
						case "[ColumnCountY]":
							//value is  line.split(':')[1];
							col = parseInt(words[1], 10);
							console.log("GOT ", col, " from ", words[1]);
							break;
						case "[BPM]":
							console.log("BPM ", words[1]);
							this.Musicman.getComponent('MusicManagement').bpm = parseInt(words[1], 10);
							//console.log("we set it to ",this.Musicman.getComponent('MusicManagement').bpm);
							this.BPMText.getComponent('text').text = "" + this.Musicman.getComponent('MusicManagement').bpm;
							break;
						case "[PANEL]":
							//value is  line.split(':')[1];
							currentpanel = parseInt(words[1], 10);
							break;
						case "[SOUNDFONT]":
							console.log("look for soundfont " + words[1]);
							fontname = "";
							//find the sound font number for this string and allocate it to the panel
							if (this.Musicman.getComponent('SoundFontSupport').findsoundfont(fontname) == -1)
								fontname = words[1];
							sfont = this.Musicman.getComponent('SoundFontSupport').foundfont;
							ssub = this.Musicman.getComponent('SoundFontSupport').foundsub;
							break;
						case "[LOOP]":
							if (words[1] == "true")
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeLoop[inapanel] = true;
							else
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeLoop[inapanel] = false;
							break;
						case "[HIDDEN]":
							if (words[1] == "true")
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeVisible[inapanel] = true;
							else
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeVisible[inapanel] = false;
							break;
						case "[SEQUENCE]":
							if (words[1] == "true")
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeSequence[inapanel] = true;
							else
								lman.layerbuttons[currentpanel].getComponent('LayerAnchorDataStorage').WeSequence[inapanel] = false;
							break;
						case "[LEFT]":
							inapanel = 0;
							break;
						case "[MIDDLE]":
							inapanel = 1;
							break;
						case "[RIGHT]":
							inapanel = 2;
							break;
						case "[NS]":
							const numberlist = words[1].split(',');
							numberlist.forEach(num => {
								let value = parseInt(num, 10);
								if (!isNaN(value))
									numarray.push(value);
							});
							break;
						case "[END]":
							//use the numbers
							lman.fillPanelData(currentpanel, inapanel, numarray);
							lman.setSoundFontData(currentpanel, inapanel, sfont, ssub, fontname);
							sfont = 0;
							ssub = 0;

							inapanel = -1;
							currentY = 0;
							numarray = [];
							break;
					}
				});
				//this.SpanchorButtonGen.getComponent('generate-buttons').setButtonCount(row, col);
				this.SpanchorButtonGen.getComponent('generate-buttons').setButtonCount(col, row);
			})
			.catch(error => console.error('Error loading the text file:', error));
	}
}
