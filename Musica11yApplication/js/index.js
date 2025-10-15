/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {HitTestLocation} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {PlaneDetection} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {AddToScene} from './AddToScene.js';
import {AltHandTracking} from './Althandtracking.js';
import {BkColourSetter} from './BkColourSetter.js';
import {ButtonFanOut} from './ButtonFanOut.js';
import {ChildWindowExtension} from './ChildWindowExtension.js';
import {DrumImageHolder} from './DrumImageHolder.js';
import {EyeRayCast} from './EyeRayCast.js';
import {HelpPanel} from './HelpPanel.js';
import {LayerAnchorDataStorage} from './LayerAnchorDataStorage.js';
import {LayerManager} from './LayerManager.js';
import {MusicManagement} from './MusicManagement.js';
import {NoteSelector} from './NoteSelector.js';
import {OptionsWindow} from './OptionsWindow.js';
import {PlayModeManager} from './PlayModeManager.js';
import {RotateIt} from './RotateIt.js';
import {SettingsWindow} from './SettingsWindow.js';
import {SimpleMessageBox} from './SimpleMessageBox.js';
import {SongFileSelectionWindow} from './SongFileSelectionWindow.js';
import {SoundFontSelectorPanel} from './SoundFontSelectorPanel.js';
import {SoundFontSupport} from './SoundFontSupport.js';
import {SpringMovement} from './SpringMovement.js';
import {TestModeSequencePlayer} from './TestModeSequencePlayer.js';
import {ThreeDControl} from './ThreeDControl.js';
import {UIButton} from './UI_Button.js';
import {UISimpleButton} from './UI_SimpleButton.js';
import {UISimpleButtonDual} from './UI_SimpleButtonDual.js';
import {VirtualKeyboard} from './VirtualKeyboard.js';
import {VrFingerCollisionDetection} from './VrFingerCollisionDetection.js';
import {GenerateButtons} from './generate-buttons.js';
import {Loadsave} from './loadsave.js';
/* wle:auto-imports:end */

import { loadRuntime } from '@wonderlandengine/api';
import * as API from '@wonderlandengine/api'; // Deprecated: Backward compatibility.

/* wle:auto-constants:start */
const Constants = {
    ProjectName: 'Musica11y',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','hand-tracking','hit-test',],
};
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    xrOfferSession: {
        mode: 'auto',
        features: Constants.WebXRRequiredFeatures,
        optionalFeatures: Constants.WebXROptionalFeatures,
    },
    canvas: 'canvas',
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.onSceneLoaded.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(
            mode,
            Constants.WebXRRequiredFeatures,
            Constants.WebXROptionalFeatures
        )
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.dataset.supported = engine.arSupported;
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported;
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(HitTestLocation);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlaneDetection);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(AddToScene);
engine.registerComponent(AltHandTracking);
engine.registerComponent(BkColourSetter);
engine.registerComponent(ButtonFanOut);
engine.registerComponent(ChildWindowExtension);
engine.registerComponent(DrumImageHolder);
engine.registerComponent(EyeRayCast);
engine.registerComponent(HelpPanel);
engine.registerComponent(LayerAnchorDataStorage);
engine.registerComponent(LayerManager);
engine.registerComponent(MusicManagement);
engine.registerComponent(NoteSelector);
engine.registerComponent(OptionsWindow);
engine.registerComponent(PlayModeManager);
engine.registerComponent(RotateIt);
engine.registerComponent(SettingsWindow);
engine.registerComponent(SimpleMessageBox);
engine.registerComponent(SongFileSelectionWindow);
engine.registerComponent(SoundFontSelectorPanel);
engine.registerComponent(SoundFontSupport);
engine.registerComponent(SpringMovement);
engine.registerComponent(TestModeSequencePlayer);
engine.registerComponent(ThreeDControl);
engine.registerComponent(UIButton);
engine.registerComponent(UISimpleButton);
engine.registerComponent(UISimpleButtonDual);
engine.registerComponent(VirtualKeyboard);
engine.registerComponent(VrFingerCollisionDetection);
engine.registerComponent(GenerateButtons);
engine.registerComponent(Loadsave);
/* wle:auto-register:end */

engine.scene.load(`${Constants.ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
