import { Component, Property } from '@wonderlandengine/api';

/**
 * SimpleMessageBox
 */
export class SimpleMessageBox extends Component {
    static TypeName = 'SimpleMessageBox';
    /* Properties that are configurable in the editor */
    static Properties = {
        destinationPosition: Property.object(),
        MessageText: Property.object(),
    };

    start() {
        this.homeposition = this.object.getTranslationWorld();
        this.visable = false;
    }

    show(t) {
        this.MessageText.getComponent('text').text = t;
        if (this.visable == false) {
            this.visable = true;
            this.object.setTranslationWorld(this.destinationPosition.getTranslationWorld());
        }
    }

    hide() {
        this.visable = false;
        this.object.setTranslationWorld(this.homeposition);
    }
}
