import { createContext, useState, useContext, useEffect } from 'react';

/*
    How to use:
    import { useUserContext } from './userContext.jsx';
    const { data, setData } = useUserContext();
    'data' must always be stored as a JSON string for the hook to work properly!
    To get it as an object, do JSON.parse(data)
    To set it from an object, do setData(JSON.stringify(object))
    And it behaves like any react hook, so components will re-render when 'data' changes.
*/

const UserContext = createContext();

export function UserProvider({ children }) {
    const [data, setData] = useState("{\"classes\":[]}");

    useEffect(() => {
        if (typeof data === 'object') {
            setData(JSON.stringify(data));
        }
    }, [data]);

    return (
        <UserContext.Provider value={{ data, setData }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}