/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { StatsCard, StatsTable, Loading, Piechart, Container, Col, Row } from '@/components/'
import { getPresencesCount, getPresences } from '@/utils/Api';
import { handleInPopup } from '@/utils/Popup';
import { useMultipleFetch } from '@/hooks/useMultipleFetch';

function Statistics({setShowNotificationButton, setShowPopup}) {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState({
    hadir: false,
    izin: false,
    telat: false,
    alfa: false
  });
  const [presence, setPresence] = useState('')
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
  const handleErrorPresences = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  const handleErrorPresencesCount = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  const { data: presencesCount, execute: setPresencesCount } = useMultipleFetch({fetchs: [getPresencesCount], setLoading, 
    errorCallbackMap: {
        getPresencesCount: handleErrorPresencesCount,
    }
  });
  const { data: presences, execute: setPresences } = useMultipleFetch({fetchs: [getPresences], setLoading, 
    errorCallbackMap: {
        getPresencesCount: handleErrorPresences,
    }
  });

  const fetch_data = async () => {
    setPresencesCount()
    setPresences()
  }
  const getHadir = async (type) => {
    setIsOpen({
      hadir: false,
      izin: false,
      telat: false,
      alfa: false
    })

    const setPresenceIsOpen = () => {
      setPresence(type)
      if(type !== '') {
        setIsOpen(prev => ({
          ...prev,
          [type]: true
        }))
      }
    }

    if(presence === '') {
      setPresenceIsOpen()
    } else {
      setTimeout(() => {
        setPresenceIsOpen()
      }, 500)
    }
  }

  useEffect(() => {
    setShowNotificationButton(true)
    fetch_data()
    import('@/css/statistics/index.css')
  }, [])
  
  return (
    <>
    {loading && <Loading />}
    {
      !loading && 
      <Container size={'-fluid'} marginTop={5} marginBottom={5}>
        <Row>
          <Col size={'-md-6'} addClass={"offset-md-3"}>
            <div>
                <div>
                  {
                    presencesCount?.getPresencesCount ? Object.values(presencesCount?.getPresencesCount).every(value => value === 0) ? <h1 className='text-center'>Kamu belum pernah absen!</h1> : 
                    <>
                      <div className='d-flex justify-content-center'>
                        <Piechart statistics={presencesCount?.getPresencesCount} />
                      </div>
                      <div className="mt-4">
                        <StatsCard presence={presence} type={'hadir'} getHadir={getHadir} />
                        {presence === 'hadir' &&
                          <StatsTable isOpen={isOpen.hadir} data={presences?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <StatsCard presence={presence} type={'izin'} getHadir={getHadir} />
                        {presence === 'izin' &&
                          <StatsTable isOpen={isOpen.izin} data={presences?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <StatsCard presence={presence} type={'telat'} getHadir={getHadir} />
                        {presence === 'telat' &&
                          <StatsTable isOpen={isOpen.telat} data={presences?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <StatsCard presence={presence} type={'alfa'} getHadir={getHadir} />
                        {presence === 'alfa' &&
                          <StatsTable isOpen={isOpen.alfa} data={presences?.getPresences?.[presence]} type={presence} list={list} />
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