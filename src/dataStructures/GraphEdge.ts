import GraphVertex from "./GraphVertex";

export default class GraphEdge {
    startVertex: GraphVertex;
    endVertex: GraphVertex;

    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     */
    constructor(startVertex: GraphVertex, endVertex: GraphVertex) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
    }

    /**
     * @return {string}
     */
    getKey() {
        const startVertexKey = this.startVertex.getKey();
        const endVertexKey = this.endVertex.getKey();

        return `${startVertexKey}_${endVertexKey}`;
    }

    /**
     * @return {GraphEdge}
     */
    reverse() {
        const tmp = this.startVertex;
        this.startVertex = this.endVertex;
        this.endVertex = tmp;

        return this;
    }

    /**
     * @return {string}
     */
    toString() {
        return this.getKey();
    }
}
