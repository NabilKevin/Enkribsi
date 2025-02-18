/* eslint-disable react/prop-types */
const FloatingButton = ({children, callback, type}) => {
  return (
    <button className="float-button z-2 shadow text-decoration-none" type={type ? type : 'button'} onClick={callback}>
        {children}
    </button>
  )
}

export default FloatingButton