import Node from './Node';

// Implements an Edge within the graph:
export default class Edge<T> {

    public toNode: Node<T>;
    public weight: number;

    constructor(toNode: Node<T>, weight: number) {
        this.toNode = toNode;
        this.weight = weight;
    }

};
