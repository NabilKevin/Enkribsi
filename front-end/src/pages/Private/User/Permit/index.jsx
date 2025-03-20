import { useEffect } from "react"

const Permit = () => {
    useEffect(() => {
        import ("@/css/permit/index.css")
    })
    return (
        <>
  <div class="container ">
     <div class="card">
  <div class="mt-5">
  </div>
  <div class="card-body">
  <div class="row">
  <div class="text-center bg-white text-black">
            <h1 className="mt-5">Judul Izin</h1>
        </div>
            <div class="col-md-6 text-start">
                <strong className="d-block p-2">Tanggal</strong>
                <span>1/01/2025</span>
            </div>
            <div class="col-md-6 text-end">
                <strong className="d-block p-2">Status</strong>
                <span class="status">Approved</span>
            </div>
        </div>
        <div class="keterangan align-items-center">
          <h4 className="d-block text-bold">Keterangan</h4>
            <span>Sakit</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit nisl sed semper aliquet. Curabitur at est vel volutpat rutrum. Suspendisse potenti. Vestibulum faucibus risus id volutpat. Nulla facilisi. Curabitur auctor, sapien euismod ultricies.</p>
        </div>
        <div class="button text-end ">
            <button type="button" class="btn btn-danger">Batalkan Izin</button>
        </div>
    </div>
  </div> 
</div>
       
     
        </>
    )
}

export default Permit