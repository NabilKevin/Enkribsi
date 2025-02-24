/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Loading, Row, Card, ColHome, FloatingButton, ModalBox, FloatingButtonPulangHome, Container } from '@/components';
import { handleInPopup } from '@/utils/Popup';
import { getPresencesCount, getAttendance, pulang } from '@/utils/Api';
import { useMultipleFetch } from '@/hooks/useMultipleFetch';


const Home = ({setShowNotificationButton, setShowPopup, children, setIsHomepage}) => {
    const [loading, setLoading] = useState(true)

    const handleErrorPresencesCount = e => {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
    const handleErrorAttendance = e => {
        if(e.status === 404) {
            handleInPopup({title: 'Pengingat!', content: 'Kamu belum absen hari ini!', setShowPopup})
        } 
    }
    const handleErrorPulang = e => {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
    const handleSuccessPulang = e => {
        handleInPopup({title: 'Sukses!', content: e?.message, setShowPopup})
    }

    const { data, execute } = useMultipleFetch({fetchs: [getPresencesCount, getAttendance], setLoading, 
        errorCallbackMap: {
            getPresencesCount: handleErrorPresencesCount,
            getAttendance: handleErrorAttendance
        }
    });

    const { data: pulangData, execute: handlePulang } = useMultipleFetch({fetchs: [pulang], setLoading,
        errorCallbackMap: {
            pulang: handleErrorPulang
        },
        successCallbackMap: {
            pulang: handleSuccessPulang
        },
    })

    const fetch_data = async () => {
        execute()
    }

    useEffect(() => {
        import('@/css/home/index.css');
        setIsHomepage(true)
        setShowNotificationButton(true)
        fetch_data()
        
    }, [])

    return (
        <>
        {loading ? <Loading /> :
        <>
            {children}
            <Container size={'-fluid'} addClass={'text-center' } marginTop={5}>
                <Row>
                    <ColHome>
                        <Card addClass={'text-white w-100 m-0 mt-3 mb-3 bg-dark'} >
                            <p>{data?.getAttendance ? 'Jam' : 'Absensi'} Masuk</p>
                            <h5>{data?.getAttendance ? data?.getAttendance?.check_in_time : 'Belum hadir'}</h5>
                        </Card>
                        <Card addClass={'text-white w-100 m-0 mt-3 mb-3 bg-dark'} >
                            <p>{data?.getAttendance?.check_out_time || Object.keys(pulangData).length > 0 ? 'Jam pulang' : 'Waktu Pulang'}</p>
                            <h5>
                                {
                                    data?.getAttendance?.check_out_time ??
                                    pulangData?.check_out_time ??
                                    data?.getAttendance?.office?.schedules?.[0]?.check_out_time ??
                                    '00:00'
                                }
                            </h5>
                        </Card>
                    </ColHome>
                </Row>
                <h3 className="text-start">Kehadiran</h3>
                <Row>
                    <ColHome>
                        <Card addClass={'text-white w-100 m-0 mt-3 bg-danger'}>
                            <h1>{String(data?.getPresencesCount?.hadir).padStart(2, '0')}</h1>
                            <h6>Hadir</h6>
                        </Card>
                        <Card addClass={'text-white w-100 mt-3 m-0 bg-danger'}>
                            <h1>{String(data?.getPresencesCount?.telat).padStart(2, '0')}</h1>
                            <h6>Telat</h6>
                        </Card>
                    </ColHome>
                </Row>
                <Row>
                    <ColHome>
                        <Card addClass={'text-white w-100 m-0 mt-3 bg-danger'}>
                            <h1>{String(data?.getPresencesCount?.izin).padStart(2, '0')}</h1>
                            <h6>Izin</h6>
                        </Card>
                        <Card addClass={'text-white w-100 m-0 mt-3 bg-danger'}>
                            <h1>{String(data?.getPresencesCount?.alfa).padStart(2, '0')}</h1>
                            <h6>Alfa</h6>
                        </Card>
                    </ColHome>
                </Row>
            </Container>
            {data?.getAttendance && !data?.getAttendance.check_out_time && 
            <FloatingButtonPulangHome />
            }
            {!data?.getAttendance && 
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