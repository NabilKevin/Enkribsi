import { useState } from "react";

export const useMultipleFetch = ({ fetchs, successCallbackMap = {}, errorCallbackMap = {}, setLoading }) => {
  const [data, setData] = useState({});

  // Fungsi untuk menjalankan semua fetchs (tetap sama seperti sebelumnya)
  const execute = async (...args) => {
    if (setLoading) {
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
      setTimeout(() => {
        if (setLoading) {
          setLoading(false);
        }
      }, 500);
    }
  };

  // Fungsi baru untuk menjalankan satu fungsi saja
  const singleExecute = async (fnNameOrIndex, ...args) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      // Cari fungsi berdasarkan nama atau indeks
      let fnToExecute;
      if (typeof fnNameOrIndex === 'number') {
        fnToExecute = fetchs[fnNameOrIndex];
      } else {
        fnToExecute = fetchs.find(fn => fn.name === fnNameOrIndex);
      }

      if (!fnToExecute) {
        throw new Error(`Function with name/index "${fnNameOrIndex}" not found.`);
      }

      // Jalankan fungsi yang dipilih
      const result = await fnToExecute(...args).catch((error) => {
        if (errorCallbackMap[fnToExecute.name]) {
          errorCallbackMap[fnToExecute.name](error);
        }
        return null;
      });

      // Update state dengan hasil fungsi tersebut
      setData(prevData => ({
        ...prevData,
        [fnToExecute.name]: result,
      }));

      // Panggil callback sukses jika ada
      if (successCallbackMap[fnToExecute.name] && result) {
        successCallbackMap[fnToExecute.name](result);
      }
    } finally {
      setTimeout(() => {
        if (setLoading) {
          setLoading(false);
        }
      }, 500);
    }
  };

  return { data, execute, singleExecute };
};