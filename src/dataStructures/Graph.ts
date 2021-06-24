import GraphVertex from "./GraphVertex";
import GraphEdge from "./GraphEdge";

export default class Graph {
    vertices: {[key in string]: GraphVertex} = {};
    edges: {[key in string]: GraphEdge}  = {};

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
    getNeighbors(vertex: GraphVertex) {
        return vertex.getNeighbors();
    }

    /**
     * @return {GraphVertex[]}
     */
    getAllVertices() {
        return Object.values(this.vertices);
    }

    /**
     * @return {GraphEdge[]}
     */
    getAllEdges() {
        return Object.values(this.edges);
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

        // Check if edge has been already added.
        if (this.edges[edge.getKey()]) {
            throw new Error('Edge has already been added before');
        } else {
            this.edges[edge.getKey()] = edge;
        }

        // If graph IS directed then add the edge only to start vertex.
        startVertex.addEdge(edge);

        return this;
    }

    /**
     * @param {GraphEdge} edge
     */
    deleteEdge(edge: GraphEdge) {
        // Delete edge from the list of edges.
        if (this.edges[edge.getKey()]) {
            delete this.edges[edge.getKey()];
        } else {
            throw new Error('Edge not found in graph');
        }

        // Try to find and end start vertices and delete edge from them.
        const startVertex = this.getVertexByKey(edge.startVertex.getKey());
        const endVertex = this.getVertexByKey(edge.endVertex.getKey());

        startVertex.deleteEdge(edge);
        endVertex.deleteEdge(edge);
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
     * Reverse all the edges in directed graph.
     * @return {Graph}
     */
    reverse() {
        /** @param {GraphEdge} edge */
        this.getAllEdges().forEach((edge) => {
            // Delete straight edge from graph and from vertices.
            this.deleteEdge(edge);

            // Reverse the edge.
            edge.reverse();

            // Add reversed edge back to the graph and its vertices.
            this.addEdge(edge);
        });

        return this;
    }

    /**
     * @return {string}
     */
    toString() {
        return Object.keys(this.vertices).toString();
    }
}
