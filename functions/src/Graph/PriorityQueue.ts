
// The shape of the function which determines the sort order of the elements 
// within the priority queue.
interface ISortOrderFunction { (a: any, b: any): number };

// Implements a priority queue data structure:
export default class PriorityQueue<T> extends Array<T> {

    // The function which determines the sort order of the elements within the queue.
    private sortOrderFunction: ISortOrderFunction;

    // Contructs the priority queue, specifying the relevant sort order function:
    constructor(sortOrderProperty: string) {
        super();
        //@ts-ignore
        this.sortOrderFunction = (a: T, b: T) => a[sortOrderProperty] - b[sortOrderProperty];
    }

    // Add the specified element to its correct position within the priority queue:
    enqueue(element: T): void {
        try {
            super.push(element);  // add the new element,
            super.sort(this.sortOrderFunction);  // sort the array (in ascending order).
        } catch (error) {
            throw new Error(`Unable to enqueue an element. ${error.message}`);
        }
    }

    // Removes the first element from the priority queue, and then returns it:
    dequeue(): T | undefined {
        try {
            super.sort(this.sortOrderFunction); // sort the array (in ascending order),
            return super.shift();  // return the first element within the array.
        } catch (error) {
            throw new Error(`Unable to dequeue an element. ${error.message}`);
        }

    }

}


