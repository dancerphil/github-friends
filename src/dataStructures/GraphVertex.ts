import GraphEdge from "./GraphEdge";

export default class GraphVertex {
    value: string;
    edges: GraphEdge[];

    /**
     * @param {string} value
     */
    constructor(value: string) {
        if (value === undefined) {
            throw new Error('Graph vertex must have a value');
        }

        // Normally you would store string value like vertex name.
        // But generally it may be any object as well
        this.value = value;
        this.edges = [];
    }

    /**
     * @param {GraphEdge} edge
     * @returns {GraphVertex}
     */
    addEdge(edge: GraphEdge) {
        this.edges.push(edge);

        return this;
    }

    /**
     * @param {GraphEdge} edge
     */
    deleteEdge(edge: GraphEdge) {
        // We don't need deleteEdge to be fast
        this.edges.splice(this.edges.findIndex(node => node === edge), 1);
    }

    /**
     * @returns {GraphVertex[]}
     */
    getNeighbors() {
        const edges = this.edges;

        /** @param {GraphEdge} node */
        const neighborsConverter = (node: GraphEdge) => {
            return node.startVertex === this ? node.endVertex : node.startVertex;
        };

        // Return either start or end vertex.
        // For undirected graphs it is possible that current vertex will be the end one.
        return edges.map(neighborsConverter);
    }

    /**
     * @return {GraphEdge[]}
     */
    getEdges() {
        return this.edges;
    }

    /**
     * @return {number}
     */
    getDegree() {
        return this.edges.length;
    }

    /**
     * @param {GraphEdge} requiredEdge
     * @returns {boolean}
     */
    hasEdge(requiredEdge: GraphEdge) {
        const edgeNode = this.edges.find((edge) => edge === requiredEdge);

        return !!edgeNode;
    }

    /**
     * @param {GraphVertex} vertex
     * @returns {boolean}
     */
    hasNeighbor(vertex: GraphVertex) {
        const vertexNode = this.edges.find((edge) => edge.startVertex === vertex || edge.endVertex === vertex);

        return !!vertexNode;
    }

    /**
     * @param {GraphVertex} vertex
     * @returns {(GraphEdge|null)}
     */
    findEdge(vertex: GraphVertex) {
        const edgeFinder = (edge: GraphEdge) => {
            return edge.startVertex === vertex || edge.endVertex === vertex;
        };

        const edge = this.edges.find(edgeFinder);

        return edge ? edge : null;
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this.value;
    }

    /**
     * @return {GraphVertex}
     */
    deleteAllEdges() {
        this.getEdges().forEach((edge) => this.deleteEdge(edge));

        return this;
    }

    /**
     * @param {function} [callback]
     * @returns {string}
     */
    toString(callback: (value: string) => string) {
        return callback ? callback(this.value) : `${this.value}`;
    }
}
