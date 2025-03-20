/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { Loading } from '@/components';
import { handleInPopup } from '@/utils/Popup';

const Create = ({setShowPopup}) => {
  
    const [formData, setFormData] = useState({
        reason: "",
        permit_type: "sakit",
        date: "",
    });

    const [loading, setLoading] = useState(false)
    
      const handleError = (e) => {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
      }
      const handleErrorGet = e => {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
      }

      const handleSuccessPermit = e => {
        alert(e.message)
        location.replace('/permits')
      }
    
      const handleSuccess = () => {
        location.replace('/')
      }
    
      const { data, singleExecute } = useMultipleFetch({fetchs: [UserService.storePermits, UserService.getAuth, UserService.checkabsent], setLoading, 
      errorCallbackMap: {
        storePermits: handleError,
        getAuth: handleErrorGet,
      }, 
      successCallbackMap: {
        storePermits: handleSuccess,
        checkabsent: handleSuccessPermit
      }});

    const handleSubmit = (e) => {
        e.preventDefault();
        singleExecute('storePermits', formData)
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const isDisabled = () => !formData.reason || !formData.permit_type || !formData.date;
    
    useEffect(() => {
      singleExecute('checkabsent')
      singleExecute('getAuth')
    }, [])

    if(loading) {
      return <Loading />
    }

    return (
        <div className="container mt-5">
          <div className="row justify-content-center g-3">

                <div className="p-4 border col-md-6">
                    <h3 className="mb-4 text-center">Izin</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="text-capitalize">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value={data.getAuth?.username}
                            name="username"
                            required
                            disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="permit_type">Keterangan</label>
                        <select className="form-control" id="permit_type" value={formData.permit_type} onChange={handleChange} name="permit_type" required>
                          <option value="sakit">Sakit</option>
                          <option value="izin">Izin</option>
                          <option value="wfh">WFH</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="tanggal">Tanggal izin</label>
                        <input
                          type="date"
                          id="tanggal"
                          className="form-control"
                          value={formData.date}
                          onChange={handleChange}
                          name="date"
                          required
                      />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="alasan">Alasan</label>  
                        <textarea
                            id="alasan"
                            className="form-control"
                            placeholder="Alasan"
                            rows="5"
                            value={formData.reason}
                            onChange={handleChange}
                          name="reason"
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

export default Create;