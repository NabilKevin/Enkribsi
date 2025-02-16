/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL_API, API_ENDPOINTS } from '@/config';
import { Loading, HomeCard, HomeCol, Row, HomeFloatingButtonPulang, HomeFloatingButtonAbsen, ModalBox } from '@/components';
import { handleInPopup } from '@/utils/Popup';


const Home = ({setShowNotificationButton, setShowPopup, children}) => {
    const [precences, setPrecences] = useState()
    const [absent, setAbsent] = useState(null)
    const [loading, setLoading] = useState(true)

    const getPrecences = async () => {
        try {
            const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCES}`)
            const data = await response.data
            setPrecences(data.data)
        } catch(e) {
            console.error(e);
        }
    }
    const getAttendance = async () => {
        try {
            const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.ATTENDANCE}`)
            setAbsent(response.data?.data)
            
        } catch(e) {
            
            if(e.status === 404) {
                handleInPopup({title: 'Reminder!', content: 'Kamu belum absen hari ini!', setShowPopup})
            } 
        } finally {
            setLoading(false)
        }
    }

    const handlePulang = async () => {
        try {
            const response = await axios.post(`${BASE_URL_API}${API_ENDPOINTS.PULANG}`)
            setAbsent(response.data?.data)
            handleInPopup({title: 'Success!', content: response.data?.message, setShowPopup})
        } catch(e) {
            handleInPopup({title: 'Alert!', content: e.response.data?.message, setShowPopup})
        }
    }

    useEffect(() => {
        setShowNotificationButton(true)
        getPrecences();
        getAttendance();
        import('@/css/home/index.css');
    }, [])

    return (
        <>
        {loading ? <Loading /> :
        <>
            {children}
            <div className="container-fluid text-center">
                <Row>
                    <HomeCol>
                        <HomeCard addClass={'mb-3 bg-dark'} >
                            <p>{absent ? 'Jam' : 'Absensi'} Masuk</p>
                            <h5>{absent ? absent?.check_in_time : 'Belum hadir'}</h5>
                        </HomeCard>
                        <HomeCard addClass={'mb-3 bg-dark'} >
                            <p>{absent?.check_out_time ? 'Jam pulang' : 'Waktu Pulang'}</p>
                            <h5>{absent ? absent?.check_out_time ? absent?.check_out_time : absent?.office?.schedules?.[0]?.check_out_time : '00:00'}</h5>
                        </HomeCard>
                    </HomeCol>
                </Row>
                <h3 className="text-start">Kehadiran</h3>
                <Row>
                    <HomeCol>
                        <HomeCard addClass={'m-0 bg-danger'}>
                            <h1>{precences?.hadir < 10 ? '0' : ''}{precences?.hadir}</h1>
                            <h6>Hadir</h6>
                        </HomeCard>
                        <HomeCard addClass={'m-0 bg-danger'}>
                            <h1>{precences?.telat < 10 ? '0' : ''}{precences?.telat}</h1>
                            <h6>Telat</h6>
                        </HomeCard>
                    </HomeCol>
                </Row>
                <Row>
                    <HomeCol>
                        <HomeCard addClass={'m-0 mt-3 bg-danger'}>
                            <h1>{precences?.izin < 10 ? '0' : ''}{precences?.izin}</h1>
                            <h6>Izin</h6>
                        </HomeCard>
                        <HomeCard addClass={'m-0 mt-3 bg-danger'}>
                            <h1>{precences?.alfa < 10 ? '0' : ''}{precences?.alfa}</h1>
                            <h6>Alfa</h6>
                        </HomeCard>
                    </HomeCol>
                </Row>
            </div>
            {
                absent?.check_out_time ? <></> : absent ? <HomeFloatingButtonPulang /> : <HomeFloatingButtonAbsen />
            }
        <ModalBox title={'Konfirmasi pulang'} handlePulang={handlePulang}>
            <span className='fs-5'>Kamu yakin ingin pulang?</span>
        </ModalBox>
        </>
        }
        </>
    );
};

export default Home;