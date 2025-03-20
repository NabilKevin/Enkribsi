/* eslint-disable react/prop-types */
import { Loading, Row, Card, FloatingButton, ModalBox, Container } from '@/components';
import { FloatingButtonPulang, ColHome } from '@/components/User/Home';
import { useEffect, useState } from 'react';
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { handleInPopup } from '@/utils/Popup';
import UserService from '@/services/UserService';
import { checkPermission } from '@/utils/Permission';

const Home = ({setShowNotificationButton, setShowPopup, children, setIsHomepage}) => {
    const [loading, setLoading] = useState(true)
    const [grant, setGrant] = useState({location: false})
    const [loc, setLoc] = useState({lat: null, lon: null})

    const checkLocationPermission = async () => {
        const callback = () => {
          setGrant(prev => ({...prev, location: true}))
        }
        await checkPermission({name: 'geolocation', permitType: 'lokasi', setShowPopup, callback})
    }
    const handleError = e => {
        handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
    }
    const handleErrorAttendance = e => {
        if(e.status === 404) {
            handleInPopup({title: 'Pengingat!', content: e.response.data?.message, setShowPopup})
        } 
    }
    const handleSuccessPulang = e => {
        handleInPopup({title: 'Sukses!', content: e?.message, setShowPopup})
        setTimeout(() => {
            singleExecute('getPresencesCount')
            singleExecute('getAttendance')
        }, 501)
    }

    const { data, singleExecute } = useMultipleFetch({fetchs: [UserService.getPresencesCount, UserService.getAttendance, UserService.pulang], setLoading, 
        errorCallbackMap: {
            getPresencesCount: handleError,
            getAttendance: handleErrorAttendance,
            pulang: handleError
        },
        successCallbackMap: {
            pulang: handleSuccessPulang
        },
    });

    const fetch_data = async () => {
        singleExecute('getPresencesCount')
        singleExecute('getAttendance')
        checkLocationPermission()
    }

    useEffect(() => {
        import('@/css/user/home/index.css');
        setIsHomepage(true)
        setShowNotificationButton(true)
        fetch_data()
    }, [])

    useEffect(() => {
        if(grant?.location) {
          UserService.getLocation({setShowPopup, callback: setLoc})
        }
    }, [grant])

    const parseDate = (date) => {
        const d = new Date(date)
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
    if(loading) {
        return <Loading />
    }
    return (
        <>
            {children}
            <Container size={'-fluid'} addClass={'text-center' } marginTop={5}>
                <Row>
                    <ColHome>
                        { data?.getAttendance ?
                            <Card addClass={'text-white w-100 m-0 mt-3 mb-3 bg-dark'} >
                                <p>Tanggal Masuk</p>
                                <h5>{parseDate(data?.getAttendance?.check_in_date)}</h5>
                            </Card>
                          :
                            <></>
                        }
                        <Card addClass={'text-white w-100 m-0 mt-3 mb-3 bg-dark'} >
                            <p>{data?.getAttendance ? 'Jam' : 'Absensi'} Masuk</p>
                            <h5>{data?.getAttendance ? data?.getAttendance?.check_in_time : 'Belum hadir'}</h5>
                        </Card>
                        <Card addClass={'text-white w-100 m-0 mt-3 mb-3 bg-dark'} >
                            <p>{data?.getAttendance?.check_out_time || data?.pulang && Object.keys(data?.pulang).length > 0 ? 'Jam pulang' : 'Waktu Pulang'}</p>
                            <h5>
                                {
                                    data?.getAttendance?.check_out_time ??
                                    data?.pulang?.check_out_time ??
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
            <FloatingButtonPulang />
            }
            {!data?.getAttendance && 
            <FloatingButton callback={() => location.replace('/absen')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-camera-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                </svg>
            </FloatingButton>
            }
        <ModalBox title={'Konfirmasi pulang'} callback={() => singleExecute('handlePulang', loc)}>
            <span className='fs-5'>Anda yakin ingin pulang?</span>
        </ModalBox>
        </>
    );
};

export default Home;