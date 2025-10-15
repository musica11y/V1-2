import { Component, Property } from '@wonderlandengine/api';
import { MaterialScheme } from './MaterialScheme';

/**
 * BkColourSetter
 */
export class BkColourSetter extends Component {
    static TypeName = 'BkColourSetter';
    /* Properties that are configurable in the editor */
    static Properties = {
        UseColourReferenceCode: Property.string("None"),//background colour reference name (Optional and note needed for notes)
        BKColor: Property.color(1, 1, 1, 1),
    };

    start() {
        if (this.object.getComponent('mesh')) {
            this.object.getComponent('mesh').material = this.object.getComponent('mesh').material.clone();
           if (this.UseColourReferenceCode != null && this.UseColourReferenceCode != "None") {
                console.log(this.UseColourReferenceCode);
                this.UseColourReferenceCode=this.UseColourReferenceCode.replace(/ /g, "_");
                this.object.getComponent('mesh').material.color = MaterialScheme[this.UseColourReferenceCode];
            }
            else {
                this.object.getComponent('mesh').material.color = this.BKColor;
            }
        }
    }
}
