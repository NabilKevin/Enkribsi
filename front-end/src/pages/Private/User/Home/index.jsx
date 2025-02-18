/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Loading, Row, CardHome, ColHome, FloatingButton, ModalBox, FloatingButtonPulangHome, Container } from '@/components';
import { handleInPopup } from '@/utils/Popup';
import { getPresences, getAttendance, pulang } from '@/utils/Api';


const Home = ({setShowNotificationButton, setShowPopup, children, setIsHomepage}) => {
    const [presences, setPresences] = useState()
    const [absent, setAbsent] = useState(null)
    const [loading, setLoading] = useState(true)

    const handlePulang = async () => {
        const dataPulang = await pulang({setShowPopup});
        if(dataPulang) {
            setAbsent(dataPulang)
        }
    }

    const fetch_data = async () => {
        setShowNotificationButton(true)
        try {
            setPresences(await getPresences({setShowPopup}));
            setAbsent(await getAttendance({setShowPopup}));
        } catch(e) {
            handleInPopup({title: 'Peringatan!', content: e.response.data?.message})
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        import('@/css/home/index.css');
        setIsHomepage(true)
        fetch_data()
    }, [])

    useEffect(() => {
        console.log(absent);
        
    }, [absent])

    return (
        <>
        {loading ? <Loading /> :
        <>
            {children}
            <Container size={'-fluid'} addClass={'text-center' }>
                <Row>
                    <ColHome>
                        <CardHome addClass={'mb-3 bg-dark'} >
                            <p>{absent ? 'Jam' : 'Absensi'} Masuk</p>
                            <h5>{absent ? absent?.check_in_time : 'Belum hadir'}</h5>
                        </CardHome>
                        <CardHome addClass={'mb-3 bg-dark'} >
                            <p>{absent?.check_out_time ? 'Jam pulang' : 'Waktu Pulang'}</p>
                            <h5>{absent?.check_out_time || absent?.office?.schedules?.[0]?.check_out_time || '00:00'}</h5>
                        </CardHome>
                    </ColHome>
                </Row>
                <h3 className="text-start">Kehadiran</h3>
                <Row>
                    <ColHome>
                        <CardHome addClass={'m-0 bg-danger'}>
                            <h1>{String(presences?.hadir).padStart(2, '0')}</h1>
                            <h6>Hadir</h6>
                        </CardHome>
                        <CardHome addClass={'m-0 bg-danger'}>
                            <h1>{String(presences?.telat).padStart(2, '0')}</h1>
                            <h6>Telat</h6>
                        </CardHome>
                    </ColHome>
                </Row>
                <Row>
                    <ColHome>
                        <CardHome addClass={'m-0 mt-3 bg-danger'}>
                            <h1>{String(presences?.izin).padStart(2, '0')}</h1>
                            <h6>Izin</h6>
                        </CardHome>
                        <CardHome addClass={'m-0 mt-3 bg-danger'}>
                            <h1>{String(presences?.alfa).padStart(2, '0')}</h1>
                            <h6>Alfa</h6>
                        </CardHome>
                    </ColHome>
                </Row>
            </Container>
            {absent && !absent.check_out_time && 
            <FloatingButtonPulangHome />
            }
            {!absent && 
            <FloatingButton callback={() => location.replace('/absen')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-camera-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                </svg>
            </FloatingButton>
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