/* eslint-disable react/prop-types */
const ModalBoxButton = ({children, className = "", callback = () => {}}) => {
  return (
    <button data-bs-toggle="modal" data-bs-target="#modalBox" className={className} onClick={callback}>
      {children}
    </button>
  )
}

export default ModalBoxButton