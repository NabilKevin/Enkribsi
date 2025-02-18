/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL_API, API_ENDPOINTS } from '@/config'
import { StatsCard, StatsTable, Loading, Piechart, Container, Col, Row } from '@/components/'

function Statistics({setShowNotificationButton}) {
  const [statistics, setStatistics] = useState();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState({
    hadir: false,
    izin: false,
    telat: false,
    alfa: false
  });
  const [presence, setPresence] = useState({presence: '', data: []})
  const list = {
    hadir: [
      {
        header: 'tanggal',
        query: 'date'
      },
      {
        header: 'jam masuk',
        query: 'check_in_time'
      },
      {
        header: 'jam pulang',
        query: 'check_out_time'
      },
    ],
    izin: [
      {
        header: 'tanggal',
        query: 'date'
      },
      {
        header: 'tipe izin',
        query: 'permit_type'
      },
      {
        header: 'alasan',
        query: 'reason'
      },
    ],
    telat: [
      {
        header: 'tanggal',
        query: 'date'
      },
      {
        header: 'jam masuk kerja',
        query: 'check_in_time_schedule'
      },
      {
        header: 'jam masuk',
        query: 'check_in_time'
      },
    ],
    alfa: [
      {
        header: 'tanggal',
        query: 'date'
      }
    ],
  }
  const getPresences = async () => {
    try {
        const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCES}`)
        const data = response.data?.data
        setStatistics(data)
    } finally {
      setLoading(false)
    }
  }
  const getPresence = async (type) => {
    setIsOpen({
      hadir: false,
      izin: false,
      telat: false,
      alfa: false
    })
    try {
        const response = await axios.get(`${BASE_URL_API}${API_ENDPOINTS.PRESENCE}?presence=${type}`)
        const data = response.data?.data
        setPresence({presence: type, data})
    } catch {
      setPresence({presence: '', data: []})
    } finally {
      if(type !== '') {
        setIsOpen(prev => ({
          ...prev,
          [type]: true
        }))
      }
    }
  }

  useEffect(() => {
    setShowNotificationButton(true)
    getPresences()
    import('@/css/statistics/index.css')
  }, [])

  return (
    <>
    {loading && <Loading />}
    {
      !loading && 
      <Container size={'-fluid'}>
        <Row>
          <Col size={'-md-6'} addClass={"offset-md-3"}>
            <div>
                <div>
                  {
                    statistics ? Object.values(statistics).every(value => value === 0) ? <h1 className='text-center'>Kamu belum pernah absen!</h1> : 
                    <>
                      <div className='d-flex justify-content-center'>
                        <Piechart statistics={statistics} />
                      </div>
                      <div className="mt-4">
                        <StatsCard presence={presence} type={'hadir'} getPresence={getPresence} />
                        {presence.presence === 'hadir' &&
                          <StatsTable isOpen={isOpen.hadir} presence={presence} type={'hadir'} list={list} />
                        }
                        <StatsCard presence={presence} type={'izin'} getPresence={getPresence} />
                        {presence.presence === 'izin' &&
                          <StatsTable isOpen={isOpen.izin} presence={presence} type={'izin'} list={list} />
                        }
                        <StatsCard presence={presence} type={'telat'} getPresence={getPresence} />
                        {presence.presence === 'telat' &&
                          <StatsTable isOpen={isOpen.telat} presence={presence} type={'telat'} list={list} />
                        }
                        <StatsCard presence={presence} type={'alfa'} getPresence={getPresence} />
                        {presence.presence === 'alfa' &&
                          <StatsTable isOpen={isOpen.alfa} presence={presence} type={'alfa'} list={list} />
                        }
                      </div>
                    </>
                    : ''
                  }
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    }
    </>
  );
}

export default Statistics;