/* eslint-disable react/prop-types */
const Row = ({children, addClass}) => {
  return (
      <div className={`row${addClass ? ' ' + addClass : ''}`}>
          {children}
      </div>
  )
}

export default Row