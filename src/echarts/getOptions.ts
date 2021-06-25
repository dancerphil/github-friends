import {Category, Link, Node} from '../types';

const categories: Category[] = [
    'me',
    'friend',
    'friend-friend+follower',
    'friend-friend',
    'friend-friend-friend+follower',
    'friend-friend-friend',
    'friend-following+follower'
];

export const getOptions = (nodes: Node[], links: Link[]) => {
    const option = {
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                position: 'right',
                formatter: '{b}'
            },
            draggable: true,
            data: nodes,
            categories: categories.map(name => ({name})),
            force: {
                edgeLength: 50,
                repulsion: 20,
                gravity: 0.2
            },
            edges: links
        }]
    };
    return option;
};
