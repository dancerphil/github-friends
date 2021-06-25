import {useRef, useLayoutEffect, useEffect, FC} from "react";
import {init, EChartsType} from 'echarts';
import {Node, Link} from '../types';
import {getOptions} from "./getOptions";
import c from './Graph.module.css';

let chart: EChartsType | null = null;

interface Props {
    nodes: Node[];
    links: Link[];
}

const Graph: FC<Props> = ({nodes, links}) => {
    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(
        () => {
            if(ref.current) {
                chart = init(ref.current, {
                    color: [
                        '#5470c6',
                        '#ee6666',
                        '#73c0de',
                        '#91cc75',
                        '#fac858',
                        '#cccccc',
                        '#fc8452'/* ,
                        '#9a60b4',
                        '#ea7ccc' */
                    ],
                })
            }
        },
        []
    );

    useEffect(
        () => {
            if(chart) {
                const options = getOptions(nodes, links);
                chart.setOption(options)
            }
        },
        [nodes, links]
    );

    return <div className={c.container} ref={ref} />
};

export default Graph;
