/* eslint-disable react/prop-types */
const ModalBox = ({children, title, handlePulang}) => {
  return (
    <div className="modal fade" id="modalBox" tabIndex="-1" aria-labelledby="modalBoxLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="modalBoxLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handlePulang}>Iya</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalBox