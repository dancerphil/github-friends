import GraphEdge from "./GraphEdge";
import {Info} from "../types";

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
     * @param {GraphEdge} edge
     */
    deleteEdge(edge: GraphEdge) {
        // We don't need deleteEdge to be fast
        this.edges.splice(this.edges.findIndex(node => node === edge), 1);
    }

    /**
     * @returns {GraphVertex[]}
     */
    getFollowings() {
        const edges = this.edges;
        return edges.map((node: GraphEdge) => node.endVertex);
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
