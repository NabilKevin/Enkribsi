import { useState } from 'react';

export const useMultipleFetch = ({fetchs, successCallbackMap = {}, errorCallbackMap = {}, setLoading}) => {
  const [data, setData] = useState({});

  const execute = async (...args) => {
    if(setLoading) {
      setLoading(true);
    }
    try {
      const results = await Promise.all(
        fetchs.map(fn =>
          fn(...args).catch((error) => {
            if (errorCallbackMap[fn.name]) {
              errorCallbackMap[fn.name](error); 
            }
            return null;
          })
        )
      );

      const resultObject = fetchs.reduce((acc, fn, index) => {
        acc[fn.name] = results[index];
        return acc;
      }, {});

      setData(resultObject);

      fetchs.forEach((fn) => {
        if (successCallbackMap[fn.name] && resultObject[fn.name]) {
          
          successCallbackMap[fn.name](resultObject[fn.name]);
        }
      });
    } finally {
      if(setLoading) {
        setLoading(false);
      }
    }
  };

  return { data, execute };
};