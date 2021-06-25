import GraphVertex from "./GraphVertex";
import GraphEdge from "./GraphEdge";

export default class Graph {
    vertices: {[key in string]: GraphVertex} = {};

    /**
     * @param {GraphVertex} newVertex
     * @returns {Graph}
     */
    addVertex(newVertex: GraphVertex) {
        this.vertices[newVertex.getKey()] = newVertex;

        return this;
    }

    /**
     * @param {string} vertexKey
     * @returns GraphVertex
     */
    getVertexByKey(vertexKey: string) {
        return this.vertices[vertexKey];
    }

    /**
     * @param {GraphVertex} vertex
     * @returns {GraphVertex[]}
     */
    getFollowings(vertex: GraphVertex) {
        return vertex.getFollowings();
    }

    /**
     * @param {GraphVertex} vertex
     * @returns {GraphVertex[]}
     */
    getFriends(vertex: GraphVertex) {
        return vertex.getFriends();
    }

    /**
     * @return {GraphVertex[]}
     */
    getAllVertices() {
        return Object.values(this.vertices);
    }

    /**
     * @param {GraphEdge} edge
     * @returns {Graph}
     */
    addEdge(edge: GraphEdge) {
        // Try to find and end start vertices.
        let startVertex = this.getVertexByKey(edge.startVertex.getKey());
        let endVertex = this.getVertexByKey(edge.endVertex.getKey());

        // Insert start vertex if it wasn't inserted.
        if (!startVertex) {
            this.addVertex(edge.startVertex);
            startVertex = this.getVertexByKey(edge.startVertex.getKey());
        }

        // Insert end vertex if it wasn't inserted.
        if (!endVertex) {
            this.addVertex(edge.endVertex);
        }

        // If graph IS directed then add the edge only to start vertex.
        startVertex.addEdge(edge);

        return this;
    }

    /**
     * @param {GraphEdge} edge
     */
    deleteEdge(edge: GraphEdge) {
        // Try to find and end start vertices and delete edge from them.
        const startVertex = this.getVertexByKey(edge.startVertex.getKey());

        startVertex.deleteEdge(edge);
    }

    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     * @return {(GraphEdge|null)}
     */
    findEdge(startVertex: GraphVertex, endVertex: GraphVertex) {
        const vertex = this.getVertexByKey(startVertex.getKey());

        if (!vertex) {
            return null;
        }

        return vertex.findEdge(endVertex);
    }

    /**
     * @return {string}
     */
    toString() {
        return Object.keys(this.vertices).toString();
    }
}
