/* eslint-disable react/prop-types */
const ModalBoxButton = ({children, className}) => {
  return (
    <button data-bs-toggle="modal" data-bs-target="#modalBox" className={className}>
      {children}
    </button>
  )
}

export default ModalBoxButton