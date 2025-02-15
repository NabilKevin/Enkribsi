/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL_API } from '@/config';
import { Loading, Popup } from '@/components';
import { useRef } from 'react';

const Home = ({setShowNotificationButton}) => {
    const [precences, setPrecences] = useState()
    const [absent, setAbsent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showPopUp, setShowPopUp] = useState({show: false, slide: 'in'})
    const popupRef = useRef(null)

    const getPrecences = async () => {
        try {
            const response = await axios.get(`${BASE_URL_API}/presences`)
            const data = await response.data
            setPrecences(data.data)
        } catch(e) {
            console.error(e);
        }
    }
    const getAttendance = async () => {
        try {
            const response = await axios.get(`${BASE_URL_API}/attendance`)
            setAbsent(response.data?.data)
            
        } catch(e) {
            
            if(e.status === 404) {
                handleInPopUp()
            } 
        } finally {
            setLoading(false)
        }
    }

    const handleOutPopUp = () => {
        setShowPopUp(prev => ({...prev, slide: 'out'}))
        setTimeout(() => {
            setShowPopUp(prev => ({...prev, slhow: false}))
        }, 510)
    }
    const handleInPopUp = () => {
        setShowPopUp(prev => ({...prev, show: true}))
    }

    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            handleOutPopUp();
        }
    };

    useEffect(() => {
        setShowNotificationButton(true)
        getPrecences();
        getAttendance();
        import('@/css/home/index.css');
    }, [])

    useEffect(() => {
        if (showPopUp.show) {
            document.addEventListener('click', handleClickOutside);
          } else {
            document.removeEventListener('click', handleClickOutside);
          }
      
          // Cleanup: Hapus event listener saat komponen di-unmount
          return () => {
            document.removeEventListener('click', handleClickOutside);
          };

    }, [showPopUp])
    return (
        <>
        {loading && <Loading />}

        {
            !loading && <>
                {
                    showPopUp.show && <Popup popupRef={popupRef} slide={showPopUp.slide} handleOutPopUp={handleOutPopUp} />
                }
                <div className="container-fluid text-center">
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center gap-3 w-100">
                            <div className="card mt-3 mb-3 bg-dark text-white w-100">
                                <div className="card-body">
                                    <p>{absent ? 'Jam' : 'Absensi'} Masuk</p>
                                    <h5>{absent ? absent?.check_in_time : 'Belum hadir'}</h5>
                                </div>
                            </div>
                            <div className="card mt-3 mb-3 bg-dark text-white w-100">
                                <div className="card-body">
                                    <p>Waktu Pulang</p>
                                    <h5>{absent ? absent?.office?.schedules?.[0]?.check_out_time : '00:00'}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-start">Kehadiran</h3>
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center gap-3 w-100">
                            <div className="card m-0 bg-danger text-white w-100">
                                <div className="card-body">
                                    <h1>{precences?.hadir < 10 ? '0' : ''}{precences?.hadir}</h1>
                                    <h6>Hadir</h6>
                                </div>
                            </div>
                            <div className="card m-0 bg-danger text-white w-100">
                                <div className="card-body">
                                    <h1>{precences?.telat < 10 ? '0' : ''}{precences?.telat}</h1>
                                    <h6>Telat</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center gap-3 w-100">
                            <div className="card m-0 mt-3 bg-danger text-white w-100">
                                <div className="card-body">
                                    <h1>{precences?.izin < 10 ? '0' : ''}{precences?.izin}</h1>
                                    <h6>Izin</h6>
                                </div>
                            </div>
                            <div className="card m-0 mt-3 bg-danger text-white w-100">
                                <div className="card-body">
                                    <h1>{precences?.alfa < 10 ? '0' : ''}{precences?.alfa}</h1>
                                    <h6>Alfa</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <a className="float-button z-2 shadow text-decoration-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-camera-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                    </svg>
                </a>
            </>
        }
        </>
    );
};

export default Home;