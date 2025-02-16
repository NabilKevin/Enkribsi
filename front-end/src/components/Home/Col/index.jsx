/* eslint-disable react/prop-types */

const Col = ({children}) => {
  return (
      <div className="col-md-6 d-flex align-items-center gap-3 w-100">
          {children}
      </div>
  )
}

export default Col