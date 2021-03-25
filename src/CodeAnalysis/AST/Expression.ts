import { BoundNode } from './BoundNode';

export abstract class Expression extends BoundNode {
    [x: string]: any;
    abstract type: string;
}
