/* eslint-disable react/prop-types */
const Webcam = ({imageSrc, canvasRef, videoRef, setWebcamStream, setImageSrc, webcamStream, handleSubmit, stopWebcam, isSubmitting}) => {
  
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamStream(stream);
    } catch (error) {
      console.error("Gagal mengakses webcam:", error);
      alert("Tidak dapat mengakses webcam. Pastikan izin telah diberikan.");
    }
  };

  // Fungsi untuk mengambil foto
  const takePhoto = () => {
    if (canvasRef && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Gambar frame dari video ke canvas
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Simpan gambar sebagai data URL
      const imageData = canvasRef.current.toDataURL("image/png");
      setImageSrc(imageData);
    }
  };

  // Fungsi untuk mengulang pengambilan foto (retake)
  const retakePhoto = () => {
    setImageSrc(null); // Hapus hasil foto
    startWebcam()
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        {!imageSrc && (
          <div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <video ref={videoRef} autoPlay playsInline style={{ border: "2px solid #ccc", borderRadius: "10px" }} />
            <br />
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex">
                <button className="btn btn-danger mx-2 my-2" onClick={startWebcam} disabled={webcamStream}>
                  Mulai Webcam
                </button>
                <button className="btn btn-danger mx-2 my-2" onClick={stopWebcam} disabled={!webcamStream}>
                  Hentikan Webcam
                </button>
              </div>
              <button className="btn btn-danger mx-2" onClick={takePhoto} disabled={!webcamStream || imageSrc}>
                Ambil Foto
              </button>
            </div>
          </div>
        )}

        {/* Tampilkan hasil foto */}
        {imageSrc && (
          <div>
            <div className="d-flex align-items-center flex-column justify-content-center">
              <img src={imageSrc} alt="Captured" style={{ maxWidth: "100%", marginTop: "20px", border: "2px solid #ccc", borderRadius: "10px" }} />
              <div className="d-flex align-items center justify-content-center">
                <button className="btn btn-danger mx-2 my-2" onClick={retakePhoto} style={{ marginTop: "20px" }} disabled={isSubmitting}>
                  Ulangi Pengambilan Foto
                </button>
                <button className="btn btn-danger mx-2 my-2" onClick={handleSubmit} style={{ marginTop: "20px" }} disabled={isSubmitting}>
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default Webcam