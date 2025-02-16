/* eslint-disable react/prop-types */
const Form = ({handleCheckLocation, offices, grant}) => {
  return (
    <>
      <h1>Form Absensi: Pilih Tipe Kerja & Lokasi</h1>
      <form className="mt-5" onSubmit={handleCheckLocation}>
        <label className="form-label" htmlFor="work_type">Tipe Kerja</label>
        <select className="form-select mb-3" id="work_type" name="work_type" required disabled={!grant?.location || !grant?.webcam}>
          <option value="wfo">WFO (Work From Office)</option>
          <option value="wfh">WFH (Work From Home)</option>
          <option value="wfa">WFA (Work From Anywhere)</option>
        </select>
        <label className="form-label" htmlFor="office">Kantor</label>
        <select className="form-select mb-3" name="office" id="office" required disabled={!grant?.location || !grant?.webcam}>
          {
            offices.map((office, i) => (<option key={i} value={office?.id}>{office?.name}</option>)) 
          }
        </select>
        <button type="submit" className="btn btn-danger" disabled={!grant?.location || !grant?.webcam}>Lanjutkan</button>
      </form>
    </>
  )
}

export default Form