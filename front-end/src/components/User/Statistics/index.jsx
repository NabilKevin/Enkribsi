/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export const Card = ({presence, type, getHadir}) => {
  return (
    <div className={`card p-2 pointer ${presence === type ? "rounded-bottom-0" : 'mb-3'}`} onClick={() => getHadir(presence === type ? '' : type)}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
          </svg>
          
          <h5 className="card-title d-flex align-items-center m-0">
            <p className="card-text text-capitalize">{type}</p>
          </h5>
        </div>
        {
          presence === type ? 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
          </svg> 
          :
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
          </svg>
        }
        
      </div>
  </div>
  )
}

export const Table = ({data, type, list, isOpen}) => {
  const tableRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('0px'); // State untuk menyimpan tinggi konten
  const [contentPadding, setContentPadding] = useState('0px'); // State untuk menyimpan tinggi konten

  useEffect(() => {
    if(!isOpen) {
      setContentHeight('0px');
      setContentPadding('0px');
    } else {
      if (tableRef.current) {
        if(tableRef.current.scrollHeight + 30 > 330) {
          setContentHeight('330px');
        } else {
          setContentHeight(`${tableRef.current.scrollHeight + 30}px`);
        }
        setContentPadding('1.5rem');
      }
    }
  }, [isOpen]);
  return (
    <div className={`card mb-3 px-4 rounded-top-0 border-top-0 muncul text-center`} ref={tableRef} style={{ maxHeight: contentHeight, padding: contentPadding }}>
      {data && data.length > 0 ? <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            {
              list?.[type].map((l, i) => <th scope="col" className='text-capitalize' key={i+1}>{l?.header}</th>)
            }
            
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {
            data.map((p, i) => (
              <tr key={i+1}>
                <td>{i+1}</td>
                {
                  list?.[type].map((l, ii) => <td className='text-capitalize' key={ii+1}>{p?.[l?.query]}</td>)
                }
              </tr>
            ))
          }
        </tbody>
      </table> : <h3 className='text-center'>Anda belum pernah {type}</h3> }
    </div>
  )
}