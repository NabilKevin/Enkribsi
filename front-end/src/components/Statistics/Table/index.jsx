import { useEffect, useRef, useState } from "react";

/* eslint-disable react/prop-types */
const Table = ({presence, type, list, isOpen}) => {
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
    <div className={`card mb-3 px-4 rounded-top-0 border-top-0 muncul`} ref={tableRef} style={{ maxHeight: contentHeight, padding: contentPadding }}>
      {presence.data.length > 0 ? <table className="table">
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
            presence.data.map((p, i) => (
              <tr key={i+1}>
                <th scope="row">{i+1}</th>
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

export default Table