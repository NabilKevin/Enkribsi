/* eslint-disable react/prop-types */
const Table = ({children}) => {
  return (
    <table className="table table-hover text-center">
      {children}
    </table>
  )
}

export default Table