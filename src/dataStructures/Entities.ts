import GraphVertex, {GraphEdge} from "./GraphVertex";
import {Category, Info, Link, Node, Option} from "../types";

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

export const updateVertexInfo = (id: string, info: Info) => {
    if (getVertex(id)) {
        getVertex(id).info = info;
    }
}

interface Edges {
    [key: string]: GraphEdge
}

const edges: Edges = {};

export const getEdge = (startId: string, endId: string) => edges[`${startId} ${endId}`];

const initEdge = (startId: string, endId: string) => {
    const key = `${startId} ${endId}`;
    edges[key] = [getVertex(startId), getVertex(endId)];
}

export const addEdge = (startId: string, endId: string) => {
    initVertex(startId);
    initVertex(endId);
    if (!getEdge(startId, endId)) {
        initEdge(startId, endId)
        getVertex(startId).addEdge(getEdge(startId, endId));
    }
};

export const getFollowings = (id: string) => {
    return getVertex(id).getFollowings();
};

export const getFriends = (id: string) => {
    return getVertex(id).getFriends();
};
