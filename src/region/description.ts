import {useSubscription} from "use-subscription";

type Listener = () => void

const listeners: Listener[] = [];

interface Ref {
    current: string
}

const descriptionRef: Ref = {
    current: ''
};

const subscribe = (listener: Listener) => {
    listeners.push(listener);
    return () => {
        listeners.splice(listeners.indexOf(listener), 1);
    }
};

const subscription = {
    getCurrentValue: () => descriptionRef.current,
    subscribe,
};

export const emitDescription = (value: string) => {
    const prevValue = descriptionRef.current;
    descriptionRef.current = value;

    if (prevValue !== value) {
        listeners.forEach(listener => listener())
    }
};

export const useDescription = () => {
    return useSubscription(subscription)
};
