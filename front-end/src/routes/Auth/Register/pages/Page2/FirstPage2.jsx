/* eslint-disable react/prop-types */
const FirstPage2 = ({videoRef, canvasRef, takePhoto, handleClickBack}) => {
  return (
    <>
      <video ref={videoRef} autoPlay className="w-100" style={{ height: "550px" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="buttons d-flex flex-column gap-2">
        <button className="btn btn-success px-5" onClick={takePhoto}>Foto</button>
        <button className="btn btn-danger px-5" onClick={() => handleClickBack(1)}>Back</button>
      </div>
    </>
  )
}

export default FirstPage2