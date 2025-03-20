import { useEffect } from "react"

/* eslint-disable react/prop-types */
const Popup = ({slide, handleOutPopup, popupRef, title, content, setShowPopup}) => {
    useEffect(() => {
        import('@/css/popup/index.css')
    }, [])
  return (
      <div ref={popupRef} style={{ zIndex: 1000 }} className={`d-flex align-items-center position-fixed popup-container justify-content-center start-0 end-0 ${slide}PopUp`}>
          <div className="w-100 p-4 popup bg-white shadow-lg rounded" 
              style={{ maxWidth: '400px', border: '1px solid #ddd', zIndex: 1000 }}>
              <div className="d-flex flex-column align-items-start">
                  <span className="fw-bolder mb-1" style={{ fontSize: '18px' }}>{title}</span>
                  <p className="fs-5 m-0 mb-3 mt-2 text-dark">{content}</p>
              </div>
              <button className="btn btn-danger me-2" onClick={() => handleOutPopup({setShowPopup})}>Tutup</button>
          </div>
      </div>
  )
}

export default Popup