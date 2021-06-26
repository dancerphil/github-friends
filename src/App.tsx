import React, {FC, useCallback, useEffect, useState} from 'react';
import {createLocalStorageRegion} from 'region-core';
import {start} from './region/task';
import {
    useOption,
    handleFollowerChange,
    handleCommonChange,
    handleFriendFriendChange,
    handleFriendFriendFriendFollowerChange,
    handleFriendFriendFriendChange,
} from './region/option';
import {useCurrentId} from './region/currentId';
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

const Description: FC = () => {
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
                        <Line><Description /></Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="follow"
                                disabled={option['friend-friend']}
                                checked={option['friend-friend+follower']}
                                onChange={handleFollowerChange}
                            />
                            <label htmlFor="follow">显示关注我的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="moreThanOne"
                                disabled={option['friend-friend']}
                                checked={option['friend-friend+common']}
                                onChange={handleCommonChange}
                            />
                            <label htmlFor="moreThanOne">显示有两个共同好友的二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                disabled={option['friend-friend-friend+follower'] || !option['friend-friend+follower'] || !option['friend-friend+common']}
                                checked={option['friend-friend']}
                                onChange={handleFriendFriendChange}
                            />
                            <label htmlFor="all">显示所有二度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                disabled={!option['friend-friend'] || option['friend-friend-friend']}
                                checked={option['friend-friend-friend+follower']}
                                onChange={handleFriendFriendFriendFollowerChange}
                            />
                            <label htmlFor="all">显示关注我的三度好友</label>
                        </Line>
                        <Line>
                            <input
                                type="checkbox"
                                id="all"
                                disabled={!option['friend-friend-friend+follower']}
                                checked={option['friend-friend-friend']}
                                onChange={handleFriendFriendFriendChange}
                            />
                            <label htmlFor="all">显示所有三度好友</label>
                        </Line>
                        {exceptions.length > 0 && (
                            <>
                                <Line className={c.hoverIcon}>?</Line>
                                <div className={c.hoverLine}>
                                    {exceptions.map(message => <Line key={message}>{message}</Line>)}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <StartMenu />
                )}
            </div>
        </>
    );
};

export default App;
