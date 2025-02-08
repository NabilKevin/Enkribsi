const Home = () => {
  return (
    <>
      <div className="container-fluid text-center">
        <div className="row">
            <div className="col-md-6">
                <div className="card bg-dark text-white">
                    <div className="card-body">
                        <p>Absensi Masuk</p>
                        <h5>Hadir</h5>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card bg-dark text-white">
                    <div className="card-body">
                        <p>Waktu Pulang</p>
                        <h5>00:00</h5>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="card bg-danger text-white">
                    <div className="card-body">
                        <h1>00</h1>
                        <p>Absen</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card bg-danger text-white">
                    <div className="card-body">
                        <h1>00</h1>
                        <p>Telat</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="card bg-danger text-white">
                    <div className="card-body">
                        <h1>00</h1>
                        <p>Izin</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card bg-danger text-white">
                    <div className="card-body">
                        <h1>00</h1>
                        <p>Alfa</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="float-button">
          <i className="fas fa-camera"></i>
      </div>
    </>
  );
};

export default Home;