import { Piechart } from "@/components";

const Statistics = () => {
  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-12">
                <h1>Statistik</h1>
                <div className="toggle-switch">
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="chart-container">
                  <Piechart />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Statistics;