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
            <Container size={'-fluid'} addClass={'text-center'} marginTop={5}>
                <h3 className='mb-0 text-start'>Status</h3>
                <Card addClass={'text-start card-status shadow bg-light'}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2 align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="80" fill="#dc3545" className="bi bi-file-earmark-person" viewBox="0 0 16 16">
                                <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2v9.255S12 12 8 12s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h5.5z"/>
                            </svg>
                            <div className="d-flex flex-column">
                                <span className='fw-medium'>Belum masuk</span>
                                <span className='fs-7'>Tanggal masuk: {data?.getAttendance ? parseDate(data.getAttendance?.date) : '-'}</span>
                                <span className='fs-7'>Absen masuk: {data?.getAttendance ? data.getAttendance?.check_in_time : '-'}</span>
                                <span className='fs-7'>Absen pulang: {data?.getAttendance?.check_out_time ? data.getAttendance.check_out_time : '-'}</span>
                            </div>
                        </div>
                        <div className={`bg-${data?.getAttendance ? 'success' : 'secondary'} rounded-circle d-flex align-items-center justify-content-center p-1`}>
                        {
                            data?.getAttendance ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-check" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                            </svg>
                            :   
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-three-dots" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                            </svg>
                        }
                        </div>
                    </div>
                </Card>
                <h3 className="text-start">Kehadiran</h3>
                <Row>
                    <ColHome>
                        <Card addClass={'shadow text-dark w-100 m-0 mt-3 bg-light'} addClassBody={'d-flex flex-column align-items-center justify-content-center'}>
                            <div className="p-2 rounded-circle bg-danger d-flex align-items-center justify-content-center  mb-2" style={{ width: 'max-content' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-person-fill-check" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                </svg>
                            </div>
                            <h5 className='text-secondary mb-0'>Hadir</h5>
                            <span className='fw-medium' style={{ fontSize: '.95rem' }}>{String(data?.getPresencesCount?.hadir).padStart(2, '0')} hari</span>
                        </Card>
                        <Card addClass={'shadow text-dark w-100 m-0 mt-3 bg-light'} addClassBody={'d-flex flex-column align-items-center justify-content-center'}>
                            <div className="p-2 rounded-circle bg-danger d-flex align-items-center justify-content-center  mb-2" style={{ width: 'max-content' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-person-fill-exclamation" viewBox="0 0 16 16">
                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                    <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V11a.5.5 0 0 0-.5-.5m0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                                </svg>
                            </div>
                            <h5 className='text-secondary mb-0'>Telat</h5>
                            <span className='fw-medium' style={{ fontSize: '.95rem' }}>{String(data?.getPresencesCount?.telat).padStart(2, '0')} hari</span>
                        </Card>
                    </ColHome>
                </Row>
                <Row>
                    <ColHome>
                        <Card addClass={'shadow text-dark w-100 m-0 mt-3 bg-light'} addClassBody={'d-flex flex-column align-items-center justify-content-center'}>
                            <div className="p-2 rounded-circle bg-danger d-flex align-items-center justify-content-center  mb-2" style={{ width: 'max-content' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-person-fill-check" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                </svg>
                            </div>
                            <h5 className='text-secondary mb-0'>Izin</h5>
                            <span className='fw-medium' style={{ fontSize: '.95rem' }}>{String(data?.getPresencesCount?.izin).padStart(2, '0')} hari</span>
                        </Card>
                        <Card addClass={'shadow text-dark w-100 m-0 mt-3 bg-light'} addClassBody={'d-flex flex-column align-items-center justify-content-center'}>
                            <div className="p-2 rounded-circle bg-danger d-flex align-items-center justify-content-center  mb-2" style={{ width: 'max-content' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-person-fill-exclamation" viewBox="0 0 16 16">
                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                    <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V11a.5.5 0 0 0-.5-.5m0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                                </svg>
                            </div>
                            <h5 className='text-secondary mb-0'>Alfa</h5>
                            <span className='fw-medium' style={{ fontSize: '.95rem' }}>{String(data?.getPresencesCount?.alfa).padStart(2, '0')} hari</span>
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