import {Component} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

/**
 * TypeScriptTest
 */
export class TypeScriptTest extends Component {
    static TypeName = 'TypeScriptTest';

    /* Properties that are configurable in the editor */

    @property.float(1.0)
    param!: number;

    start() {
        console.log('start() with param', this.param);
    }

    update(dt: number) {
        /* Called every frame. */
    }
}
