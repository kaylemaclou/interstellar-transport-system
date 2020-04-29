import Node from "./Node";
import Edge from "./Edge";
import PriorityQueue from "./PriorityQueue";

export default class Graph<T> {
  private nodes: Array<Node<T>> = new Array<Node<T>>();

  // Adds a node for the specified parameters, to the graph's nodes:
  addNode(nodeId: string, nodeProperties: T): void {
    try {
      //@ts-ignore
      this.nodes[nodeId] = new Node<T>(nodeProperties);
    } catch (error) {
      throw new Error(`An invalid node was specified: ${nodeId}.`);
    }
  }

  // Adds an edge for the specified parameters, to the graph's edges:
  addEdge(fromNodeId: string, toNodeId: string, weight: number): void {
    try {
      //@ts-ignore
      const fromNode = this.nodes[fromNodeId];
      //@ts-ignore
      const toNode = this.nodes[toNodeId];

      // if both nodes are valid:
      if (fromNode && toNode) {
        // add the new edge,
        const newEdge = new Edge<T>(toNode, weight);
        fromNode.edges.add(newEdge);
      } else {
        throw new Error(
          `Invalid node(s) specified in route:  ${fromNodeId} to ${toNodeId}: ${weight}`
        );
      }
    } catch (error) {
      //TODO: Handle error, if unable to add the new edge to the graph!
    }
  }

  // Finds the shortest path from the specified node, to the specfied node:
  findShortestPath(fromNodeId: string, toNodeId: string): Array<Node<T>> {
    try {
      //@ts-ignore
      const fromNode = this.nodes[fromNodeId];
      //@ts-ignore
      const toNode = this.nodes[toNodeId];

      // set the "distance from the source" of all nodes, to "infinity",
      this.nodes.map((node: Node<T>) => (node.distanceFromSource = Infinity));

      // set the source node's "distance from the source" to "zero",
      fromNode.distanceFromSource = 0;

      // create a priority queue and add all the nodes to it,
      const unvistedNodes = new PriorityQueue<Node<T>>("distanceFromSource");
      for (const nodeId in this.nodes) {
        unvistedNodes.enqueue(this.nodes[nodeId]);
      }

      // create an empty array to hold all the visited nodes,
      //@ts-ignore
      const visitedNodes: Array<Node<T>> = new Array<Node<T>>();

      // recursively find the shortest path for each node in the unvisited list,
      // and then remove it from the unvisited list and add it to the visited list.
      this.findShortestPathOfNextNode(unvistedNodes, visitedNodes);

      const shortestPath: Array<Node<T>> = new Array<Node<T>>();

      // build the list of nodes within the shortest path, starting from
      // the last node,
      this.traverseShortestPathNodes(toNode, shortestPath);

      // return shortest nodes, in the required order.
      return shortestPath.reverse();
    } catch (error) {
      throw new Error(`Unable to find the shortest path. ${error.message}`);
    }
  }

  // Recursively finds the shortest path for each node in the unvisited list.
  // Then removes it from the unvisited list and adds it to the visited list.
  findShortestPathOfNextNode(
    unvistedNodes: PriorityQueue<Node<T>>,
    visitedNodes: Array<Node<T>>
  ): void {
    // if there are no more unvisited nodes:
    if (unvistedNodes.length === 0) {
      return; // stop.
    }

    // obtain the next unvisited node, from the list of unvisited nodes,
    const nextNode: Node<T> | undefined = unvistedNodes.dequeue();

    // if a next node exists:
    if (nextNode) {
      // for each edge of the node:
      for (const edge of nextNode.edges) {
        // update the neighbouring node's distance, if required to:
        const newDistance =
          //@ts-ignore
          nextNode.distanceFromSource + parseFloat(edge.weight);
        if (newDistance < edge.toNode.distanceFromSource) {
          edge.toNode.distanceFromSource = newDistance;
          edge.toNode.previousNode = nextNode;
        }
      }

      // now, add the node to he list of visited nodes,
      visitedNodes.push(nextNode);
    }

    // find the shortest path for the next unvisited node.
    this.findShortestPathOfNextNode(unvistedNodes, visitedNodes);
  }

  // Builds a list of nodes within the shortest path, by recursively traversing
  // the nodes backwards within the shortest path, starting from the end node.
  traverseShortestPathNodes(node: Node<T>, shortestPath: Array<Node<T>>) {
    // add the current node to the short path,
    shortestPath.push(node);

    // if a previous node exists:
    if (node.previousNode) {
      // do the same for the previous node.
      this.traverseShortestPathNodes(node.previousNode, shortestPath);
    }
  }
}
