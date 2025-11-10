import { Component, Property } from '@wonderlandengine/api';

/**
 * MaterialScheme
 */
export class MaterialScheme extends Component {
    static TypeName = 'MaterialScheme';
    /* Properties that are configurable in the editor */
    static Properties = {
    };


    //R G B A
    static KEY_Colour_C = [0.902, 0.098, 0.294, 1.0]; // #E6194B
    static KEY_Colour_Cs = [0.961, 0.510, 0.192, 1.0]; // #F58231
    static KEY_Colour_D = [1.0, 0.690, 0.0, 1.0];     // #FFB000
    static KEY_Colour_Ds = [1.0, 0.843, 0.0, 1.0];     // #FFD700
    static KEY_Colour_E = [1.0, 1.0, 0.2, 1.0];       // #FFFF33
    static KEY_Colour_F = [0.561, 0.749, 0.0, 1.0];   // #8FBF00
    static KEY_Colour_Fs = [0.0, 0.749, 0.663, 1.0];   // #00BFA9
    static KEY_Colour_G = [0.247, 0.663, 0.961, 1.0]; // #3FA9F5
    static KEY_Colour_Gs = [0.263, 0.388, 0.847, 1.0]; // #4363D8
    static KEY_Colour_A = [0.569, 0.118, 0.706, 1.0]; // #911EB4
    static KEY_Colour_As = [0.780, 0.082, 0.522, 1.0]; // #C71585
    static KEY_Colour_B = [0.886, 0.451, 0.635, 1.0]; // #E273A2

    static KEY_Colour_NULL = [1, 1, 1, 1];

    static BUTTON_KeyColour_SELECTED = [0.561, 1.000, 0.286, 1.0]; //neon green

    static OCTAVE_Colour_M1 = [0.8, 1, 1, 1];
    static OCTAVE_Colour_0 = [1, 1, 0.9, 1];
    static OCTAVE_Colour_1 = [1, 1, 0.8, 1];
    static OCTAVE_Colour_2 = [1, 1, 0.7, 1];
    static OCTAVE_Colour_3 = [1, 1, 0.6, 1];
    static OCTAVE_Colour_4 = [1, 1, 0.5, 1];
    static OCTAVE_Colour_5 = [1, 1, 0.4, 1];
    static OCTAVE_Colour_6 = [1, 1, 0.3, 1];
    static OCTAVE_Colour_7 = [1, 0.5, 1, 1];
    static OCTAVE_Colour_8 = [1, 0.5, 0.9, 1];
    static OCTAVE_Colour_9 = [1, 0.5, 0.7, 1];
    static OCTAVE_Colour_10 = [1, 0.5, 0.6, 1];

    // UI Color Scheme
    static darkBrown = [0.114, 0.086, 0.086, 1.0];   // #1D1616
    static deepRed = [0.663, 0.290, 0.290, 1.0];     // #A94A4A
    static goldenYellow = [0.956, 0.843, 0.576, 1.0]; // #F4D793
    static softCream = [1.000, 0.965, 0.855, 1.0];   // #FFF6DA
    static mutedGreen = [0.533, 0.620, 0.451, 1.0];  // #889E73

    // Highlight Colors
    static deepNavy = [0.000, 0.035, 0.145, 1.0];    // #000925
    static aquaBlue = [0.337, 0.710, 0.710, 1.0];    // #56B5B5
    static neonGreen = [0.561, 1.000, 0.286, 1.0];   // #8FFF49
    static pureWhite = [1.000, 1.000, 1.000, 1.0];   // #FFFFFF


    static NoteSelect_BackGroundColour_InKeySelect = [1, 0, 0, 1];
    static BUTTON_TestMode_Active = [0.533, 0.620, 0.451, 1.0];
    static BUTTON_TestMode_Inactive = [0.663, 0.290, 0.290, 1.0];

    static Error_colour = [1, 1, 1, 1];

    //New codes
    static PANEL_Indicator_Active = [0, 1, 0.3, 1];
    static PANEL_Indicator_Inactive = [0.5, 0.5, 0.5, 1];
    static PANEL_Active = [0, 1, 0.3, 1];
    static PANEL_Inactive = [0.5, 0.5, 0.5, 1];

    static TEXT_disabledcolour = [0.5, 0.5, 0.5, 0.5];
    static TEXT_enabledcolour = [0, 0, 0, 1];

    static PANEL_SPAnchorBackground = [0.5, 0.1, 0, 0.8];
    static PANEL_SelectScaleBackground = [0.5, 0.1, 0, 0.8];


    static SEQUENCER_InActiveNote = [.3, .3, .3, 1];
    static SEQUENCER_ActiveNote = [0, 1, 0, 1];

    static LAYER_Active = [0, 1, 0.3, 1];
    static LAYER_Inactive = [1, 0.8, 0.0, 1];

    static CS_softCream = [1.0, 0.98, 0.88,1.0];

    static GetNoteColour(key) {
        // console.log("set color to ",key);
        switch (key) {
            case 'A': return this.KEY_Colour_A;
            case 'B': return this.KEY_Colour_B;
            case 'C': return this.KEY_Colour_C;
            case 'D': return this.KEY_Colour_D;
            case 'E': return this.KEY_Colour_E;
            case 'F': return this.KEY_Colour_F;
            case 'G': return this.KEY_Colour_G;
            case 'A#': return this.KEY_Colour_As;
            case 'C#': return this.KEY_Colour_Cs;
            case 'D#': return this.KEY_Colour_Ds;
            case 'F#': return this.KEY_Colour_Fs;
            case 'G#': return this.KEY_Colour_Gs;
        }
        return this.Error_colour;
    }

    static GetOctaveColour(oct) {
        switch (oct) {
            case -1: return this.OCTAVE_Colour_M1;
            case 0: return this.OCTAVE_Colour_0;
            case 1: return this.OCTAVE_Colour_1;
            case 2: return this.OCTAVE_Colour_2;
            case 3: return this.OCTAVE_Colour_3;
            case 4: return this.OCTAVE_Colour_4;
            case 5: return this.OCTAVE_Colour_5;
            case 6: return this.OCTAVE_Colour_6;
            case 7: return this.OCTAVE_Colour_7;
            case 8: return this.OCTAVE_Colour_8;
            case 9: return this.OCTAVE_Colour_9;
            case 10: return this.OCTAVE_Colour_10;
        }
        return this.Error_colour;
    }
}
