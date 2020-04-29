import Edge from './Edge';

// Implements a Node within the graph:
export default class Node<T> {

    public edges: Set<Edge<T>>;
    public distanceFromSource: number = Infinity;
    public previousNode: Node<T> | undefined;

    constructor(nodeProperties: T) {
        try {
            // Copy the specified properties for the node.
            Object.keys(nodeProperties).map((key) => {
                // @ts-ignore
                this[key] = nodeProperties[key];
            });
            // Add an empty set to hold the edges of its adjacent nodes.
            this.edges = new Set<Edge<T>>();
        } catch (error) {
            throw new Error(`Unable to instantiate a new Node instance. ${error.message}`);
        }
    }

}
