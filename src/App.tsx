import React, {FC, useCallback, useState} from 'react';
import {getNodesAndLinks, start, getProgressDescription} from './region';
import {useForceUpdate, useOption, handleFollowChange, handleMoreThanOneChange, handleAllChange} from './region/utils';
import Graph from "./echarts/Graph";
import c from './App.module.css';

interface PropsId {
    id: string
}
const Main: FC<PropsId> = ({id}) => {
    useForceUpdate();
    const [nodes, links] = getNodesAndLinks(id);
    return (
        <Graph nodes={nodes} links={links} />
    );
};

const Description: FC<PropsId> = ({id}) => {
    useForceUpdate();
    return <div className={c.description}>{getProgressDescription(id)}</div>
};

const Line: FC = ({children}) => {
    return <div className={c.line}>{children}</div>;
};

const App = () => {
    const option = useOption();
    const [current, setCurrent] = useState('');
    const [value, setValue] = useState('');
    const handleChange = useCallback(
        (e: any) => {
            setValue(e.target.value)
        },
        []
    );
    const handleClick = useCallback(
        () => {
            setCurrent(value);
            start(value)
        },
        [value]
    );
    const handleEnter = useCallback(
        (e) => {
            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                handleClick()
            }
        },
        [handleClick]
    );
    return (
        <>
            {current && <Main id={current} />}
            <div className={c.context}>
                {current ? (
                    <>
                        <Line><Description id={current} /></Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="follow"
                                disabled={option.all}
                                checked={option.follow}
                                onChange={handleFollowChange}
                            />
                            <label htmlFor="follow">显示关注我的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="moreThanOne"
                                disabled={option.all}
                                checked={option.moreThanOne}
                                onChange={handleMoreThanOneChange}
                            />
                            <label htmlFor="moreThanOne">显示有两个共同好友的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                checked={option.all}
                                onChange={handleAllChange}
                            />
                            <label htmlFor="all">显示所有二度好友</label>
                        </Line>
                    </>
                ) : (
                    <Line>
                        <input placeholder="输入 id" value={value} onChange={handleChange} onKeyDown={handleEnter} />
                        <span className={c.button} onClick={handleClick}>开始</span>
                    </Line>
                )}
            </div>
        </>
    );
};

export default App;
