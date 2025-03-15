/* eslint-disable react/prop-types */
const PaginateButton = ({data, handleChangePage}) => {
  return (
    <nav style={{ overflowX: 'scroll' }}>
      <ul className="pagination">
        {
          data.map((btn, i) => (
            <li key={i} className={`page-item ${btn.page ? '' : 'disabled'}`}>
              <button className="page-link text-dark" onClick={() => handleChangePage(btn.page)}>
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