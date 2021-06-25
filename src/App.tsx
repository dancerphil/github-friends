import React, {FC, useCallback, useEffect, useState} from 'react';
import {createLocalStorageRegion} from 'region-core';
import {start} from './region';
import {
    useOption,
    handleFollowChange,
    handleMoreThanOneChange,
    handleShowFriendFriendChange,
    handleShowFriendFriendFriendChange,
    useCurrentId
} from './region/utils';
import {useNodesAndLinks} from './region/nodesAndLinks';
import Graph from "./echarts/Graph";
import c from './App.module.css';
import {useDescription} from "./region/description";
import {useExceptions} from "./region/exception";

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

const Line: FC<{className?: string}> = ({className, children}) => {
    return <div className={className ? `${c.line} ${className}` : c.line}>{children}</div>;
};

const App = () => {
    const option = useOption();
    const currentId = useCurrentId();
    const token = useToken();
    const exceptions = useExceptions();

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
                                disabled={option.showFriendFriend}
                                checked={option.follow}
                                onChange={handleFollowChange}
                            />
                            <label htmlFor="follow">显示关注我的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="moreThanOne"
                                disabled={option.showFriendFriend}
                                checked={option.moreThanOne}
                                onChange={handleMoreThanOneChange}
                            />
                            <label htmlFor="moreThanOne">显示有两个共同好友的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                disabled={option.showFriendFriendFriend}
                                checked={option.showFriendFriend}
                                onChange={handleShowFriendFriendChange}
                            />
                            <label htmlFor="all">显示所有二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                disabled={!option.showFriendFriend}
                                checked={option.showFriendFriendFriend}
                                onChange={handleShowFriendFriendFriendChange}
                            />
                            <label htmlFor="all">显示所有三度好友</label>
                        </Line>
                        {exceptions.length > 0 && (
                            <Line className={c.hoverIcon}>?</Line>
                        )}
                        {exceptions.map(message => (
                            <Line className={c.hoverLine}>
                                {message}
                            </Line>
                        ))}
                    </>
                ) : (
                    <StartMenu />
                )}
            </div>
        </>
    );
};

export default App;
