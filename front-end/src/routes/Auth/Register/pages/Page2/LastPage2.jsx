/* eslint-disable react/prop-types */
const LastPage2 = ({photo, retakePhoto, setChangePage}) => {
  return (
    <>
      <h5>Captured Photo:</h5>
      <img src={photo} alt="Captured" className="img-thumbnail mb-3"/>
      <input type="hidden" name="face_img" value={photo} readOnly/>
      <div className="buttons d-flex flex-column gap-2">
        <button type="button" className="btn btn-warning" onClick={retakePhoto}>Retake Photo</button>
        <button className="btn btn-danger" onClick={() => setChangePage(3)}>Lanjutkan</button>
      </div>
    </>
  )
}

export default LastPage2