/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { BASE_URL_API } from "@/config";
import { useNavigate } from "react-router-dom";

const Addphoto = ({check_auth, setLoading}) => {
  const [page, setPage] = useState(1) 
  const [webcamStream, setWebcamStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Untuk menyimpan hasil foto
  const [error, setError] = useState()
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(false)
  }, [])

  // Fungsi untuk memulai akses webcam
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

  // Fungsi untuk menghentikan akses webcam
  const stopWebcam = () => {
    if (webcamStream) {
      const tracks = webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  const handleSubmit = async () => {
    setError()
    try {
      const response = await axios.post(`${BASE_URL_API}/addphoto`, {
        'photo': imageSrc
      })
      
      if(response.status === 200) {
        stopWebcam()
        check_auth()
        navigate('/')
      }
    } catch(e) {
      
      setError(e.response.data)
    }
  }
  return (
    <>
    {
      page === 1 ?
        <div className="container mt-4">
          <h1 className="text-center">Tambahkan Foto untuk Validasi Wajah</h1>
          <p className="mt-4 mb-2 text-center">Sebelum Anda dapat melakukan absen, kami memerlukan foto Anda sebagai referensi untuk validasi wajah. Ini adalah langkah penting untuk memastikan bahwa absen dilakukan oleh Anda secara langsung.</p>
          <p><strong>Mengapa Ini Penting?</strong></p>

          <ol>
            <li className="mt-3">
              <h5>Keamanan Absen:</h5>
              <span>Foto ini digunakan untuk memverifikasi bahwa orang yang absen adalah Anda. Hal ini mencegah penyalahgunaan atau kecurangan dalam proses absen.</span>
            </li>
            <li className="mt-3">
              <h5>Proses Absen Lebih Cepat:</h5>
              <span>Dengan foto acuan, Anda bisa absen dengan cepat dan mudah hanya dengan validasi wajah tanpa perlu input manual lainnya.</span>
            </li>
            <li className="mt-3">
              <h5>Privasi Terjaga</h5>
              <span>Foto Anda akan disimpan dengan aman dan hanya digunakan untuk validasi absen. Kami sangat menjaga privasi Anda.</span>
            </li>
            <li className="mt-3">
              <h5>Instruksi:</h5>
              <span>Silakan unggah foto wajah Anda dengan latar belakang terang. Pastikan wajah Anda terlihat jelas tanpa penutup seperti topi atau kacamata hitam.</span>
            </li>
          </ol>
          <div className="d-flex w-100 align-items-center justify-content-center">
            <button className="btn btn-danger" onClick={() => setPage(2)}>Lanjutkan</button>
          </div>
        </div> : <div style={{ textAlign: "center", marginTop: "50px" }}>

      {/* Tampilkan feed video dari webcam */}
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
            {
              error ?
              <div className="alert alert-danger">
                {error?.message}
              </div> : <></>
            }
            <img src={imageSrc} alt="Captured" style={{ maxWidth: "100%", marginTop: "20px", border: "2px solid #ccc", borderRadius: "10px" }} />
            <div className="d-flex align-items center justify-content-center">
              <button className="btn btn-danger mx-2 my-2" onClick={retakePhoto} style={{ marginTop: "20px" }}>
                Ulangi Pengambilan Foto
              </button>
              <button className="btn btn-danger mx-2 my-2" onClick={handleSubmit} style={{ marginTop: "20px" }}>
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    }
    </>
  )
}

export default Addphoto