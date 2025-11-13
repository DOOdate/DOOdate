import { useEffect, useState } from 'react';

/*
    Use this react hook to automatically sync classes with localStorage.

    How to use:
    const [classes, setClasses] = useStorage('classes', []); // Works like any react hook useState
    setClasses(...classes, newClass); // You must follow this syntax for adding a new class

    // To update a value in an existing class, it would look like this:
    setClasses(prevClasses =>
        prevClasses.map(cls =>
            cls.id === 1                            // selects classes with id 1 (can be any selector you want)
            ? { ...cls, course_code: "PHY1322" }    // update this one
            : cls                                   // keep others unchanged
        )
    );
    // To delete a class:
    setClasses(prevClasses => prevClasses.filter(cls => cls.id !== 1)); // removes class with id 1

    // Remember that classes is a string representing a JSON array. It can be converted to a JS array with:
    const classesArray = JSON.parse(classes);
*/

function useStorage(key, initialValue) {
    const [ value, setValue ] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage key “' + key + '”: ', error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting localStorage key “' + key + '”: ', error);
        }
    }, [key, value]);
    return [value, setValue];
}

export default useStorage;