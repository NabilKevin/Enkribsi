import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "@/services/UserService";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { Loading } from '@/components';

const Permit = () => {
  
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        keterangan: "",
        tanggal: "",
        alasan: "",
    });

    const [loading, setLoading] = useState(false)
    
      const handleErrorLogin = (e) => {
        setError(e.response?.data);
      }
    
      const handleSuccessLogin = () => {
        location.replace('/home')
        checkAuth()
      }
    
      const { execute: login } = useMultipleFetch({fetchs: [UserService.handleLogin], setLoading, 
      errorCallbackMap: {
        handleLogin: handleErrorLogin
      }, 
      successCallbackMap: {
        handleLogin: handleSuccessLogin
      }});
      
      if(loading) {
        return <Loading />
      }

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username) {
            setError("Mohon masukkan username Anda.");
            return;
        }
        setError("");
        // setMessage("Permintaan izin telah dikirim.");
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const isDisabled = () => !formData.username || !formData.keterangan || !formData.tanggal || !formData.alasan;

    return (
        <div className="container mt-5">
          <div className="row justify-content-center g-3">
          {error && (<div className="alert alert-danger fade-in">{error}</div>)}

                <div className="p-4 border col-md-6">
                    <h3 className="mb-4 text-center">Izin</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username" className="text-capitalize">Masukkan Username</label>
                        <div className="mb-4 form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                name="username"
                                required
                            />
                        </div>
                        <div className="mb-4 form-group">
                        <select
                        className="form-control"
                        value={formData.keterangan}
                        onChange={handleChange}
                        name="keterangan"
                        required
                        >
                        <option value="">Sakit</option>
                        <option value="1">Izin</option>
                        <option value="2">WFA</option>
                        <option value="3">WFH</option>
                    </select>
                        </div>
                        <div className="mb-4 form-group">
                        <input
                          type="date"
                          className="form-control"
                          value={formData.tanggal}
                          onChange={handleChange}
                        name="tanggal"
                          required
                      />

                      <textarea
                          className="mt-3 form-control"
                          placeholder="Alasan"
                          rows="5"
                          value={formData.alasan}
                          onChange={handleChange}
                        name="alasan"
                          required
                      ></textarea>
                      </div>
                        <div className="gap-2 mx-auto d-grid">
                        <button
                            type="submit"
                            className={`btn mt-3 btn-danger ${isDisabled() ? "disabled" : ""}`}
                            >
                               Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Permit;