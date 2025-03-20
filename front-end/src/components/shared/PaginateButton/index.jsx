import { useEffect, useState } from "react"

/* eslint-disable react/prop-types */
const PaginateButton = ({datas, handleChangePage, bgdark}) => {
  const [data, setData] = useState()
  useEffect(() => {
    if(datas) {
      console.log(datas);
      
      setData([...datas].map((link) => 
        (
          {
            page: link.url ? link.url.split('?page=')[1] : link.url, 
            label: link.label,
            active: link.active
          }
        )
      ))
    }
  }, [datas])
  useEffect(() => {
    import('@/css/paginateButton/index.css')
  }, [])
  return (
    <nav style={{ overflowX: 'scroll' }}>
      <ul className="pagination">
        {
          data && data?.length > 3 && data.map((btn, i) => (
            <li key={i} className={`page-item ${btn.page && !btn.active ? '' : 'disabled'}`}>
              <button className={`page-link ${bgdark ? 'bg-dark text-white' : 'text-dark'}`} onClick={() => handleChangePage(btn.page)}>
                {
                  i !== 0 && i !== data.length -1 ?
                    <span>{btn.label}</span>
                  : i === 0 ?
                    <span>&laquo;</span>
                  :
                    <span>&raquo;</span>
                }
                
              </button>
            </li>
          ))
        }
      </ul>
    </nav>
  )
} 

export default PaginateButton