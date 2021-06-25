import GraphVertex from "./GraphVertex";
import GraphEdge from './GraphEdge';
import Graph from "./Graph";

export const graph = new Graph();

interface Vertices {
    [id: string]: GraphVertex
}

const vertices: Vertices = {};

export const getVertex = (id: string) => vertices[id];

export const initVertex = (id: string) => {
    if (!vertices[id]) {
        vertices[id] = new GraphVertex(id);
    }
};

interface Edges {
    [key: string]: GraphEdge
}

const edges: Edges = {};

export const getEdge = (startId: string, endId: string) => edges[`${startId} ${endId}`];

export const addEdge = (startId: string, endId: string) => {
    initVertex(startId);
    initVertex(endId);
    const key = `${startId} ${endId}`;
    if (!edges[key]) {
        edges[key] = new GraphEdge(getVertex(startId), getVertex(endId));
        graph.addEdge(getEdge(startId, endId))
    }
};

export const getFollowings = (id: string) => {
    return graph.getFollowings(getVertex(id));
};

export const getFriends = (id: string) => {
    return graph.getFriends(getVertex(id));
};
