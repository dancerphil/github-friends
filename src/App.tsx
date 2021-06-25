import React, {FC, useCallback, useEffect, useState} from 'react';
import {createLocalStorageRegion} from 'region-core';
import {start} from './region';
import {
    useOption,
    handleFollowChange,
    handleMoreThanOneChange,
    handleAllChange,
    useCurrentId
} from './region/utils';
import {useNodesAndLinks} from './region/nodesAndLinks';
import Graph from "./echarts/Graph";
import c from './App.module.css';
import {useDescription} from "./region/description";

const tokenRegion = createLocalStorageRegion('token', '')

const setToken = tokenRegion.set;

const useToken = tokenRegion.useValue;

interface PropsId {
    id: string
}

const Main: FC<PropsId> = () => {
    const [nodes, links] = useNodesAndLinks();
    return (
        <Graph nodes={nodes} links={links} />
    );
};

const StartMenu = () => {
    const [value, setValue] = useState('');
    const handleChange = useCallback(
        (e: any) => {
            setValue(e.target.value)
        },
        []
    );
    const handleClick = useCallback(
        () => {
            setToken(value);
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
        <Line>
            <input placeholder="输入 token" value={value} onChange={handleChange} onKeyDown={handleEnter} />
            <span className={c.button} onClick={handleClick}>开始</span>
            <a className={c.link} href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer noopener">?</a>
            <span className={c.tip}>此 token 仅用于获取开放的用户信息，请选择 user 标签以及其下的项</span>
        </Line>
    )
};

const Description: FC<PropsId> = ({id}) => {
    const description = useDescription();
    return <div className={c.description}>{description}</div>
};

const Line: FC = ({children}) => {
    return <div className={c.line}>{children}</div>;
};

const App = () => {
    const option = useOption();
    const currentId = useCurrentId();
    const token = useToken();
    useEffect(
        () => {
            if(token) {
                start(token);
            }
        },
        [token]
    );

    return (
        <>
            {currentId && <Main id={currentId} />}
            <div className={c.context}>
                {currentId ? (
                    <>
                        <Line><Description id={currentId} /></Line>
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
                    <StartMenu />
                )}
            </div>
        </>
    );
};

export default App;
