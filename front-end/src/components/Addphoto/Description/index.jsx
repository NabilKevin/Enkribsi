/* eslint-disable react/prop-types */
const Description = ({setPage, grant}) => {
  return (
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
        <button className="btn btn-danger" onClick={() => setPage(2)} disabled={!grant}>Lanjutkan</button>
      </div>
    </div>
  )
}

export default Description