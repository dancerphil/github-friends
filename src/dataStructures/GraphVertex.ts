import {Info} from "../types";

export type GraphEdge = [GraphVertex, GraphVertex];

export default class GraphVertex {
    value: string;
    info?: Info;
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
     * @returns {GraphVertex[]}
     */
    getFollowings() {
        const edges = this.edges;
        return edges.map(([startVertex, endVertex]: GraphEdge) => endVertex);
    }

    /**
     * @returns {GraphVertex[]}
     */
    getFriends() {
        const followings = this.getFollowings();
        return followings.filter(following => following.getFollowings().find(node => node === this));
    }

    /**
     * @return {GraphEdge[]}
     */
    getEdges() {
        return this.edges;
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
     * @returns {(GraphEdge|null)}
     */
    findEdge(vertex: GraphVertex) {
        return this.edges.find(([startVertex, endVertex]: GraphEdge) => endVertex === vertex);
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
        this.edges = [];

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
