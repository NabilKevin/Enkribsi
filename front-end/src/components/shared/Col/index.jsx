/* eslint-disable react/prop-types */
const Col = ({children, size, addClass}) => {
  return (
    <div className={`col${size} ${addClass}`}>
      {children}
    </div>
  )
}

export default Col