/* eslint-disable react/prop-types */
import { Loading, Piechart, Container, Col, Row } from '@/components/'
import UserService from '@/services/UserService';
import { useEffect, useState } from 'react';
import { useMultipleFetch } from '@/hooks/useMultipleFetch';
import { handleInPopup } from '@/utils/Popup';
import { Card, Table } from '@/components/User/Statistics'

function Statistics({setShowNotificationButton, setShowPopup, children}) {
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
  const handleError = e => {
    handleInPopup({title: 'Peringatan!', content: e.response.data?.message, setShowPopup})
  }
  const { data, execute } = useMultipleFetch({fetchs: [UserService.getPresencesCount, UserService.getPresences], setLoading, 
    errorCallbackMap: {
        getPresencesCount: handleError,
        getPresences: handleError
    }
  });

  const fetch_data = async () => {
    execute()
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
    import('@/css/user/statistics/index.css')
  }, [])

  if(loading) {
    return <Loading />
  }
  return (
    <>
      <Container size={'-fluid'} marginTop={5} marginBottom={5}>
        {children}
        <Row>
          <Col size={'-md-6'} addClass={"offset-md-3"}>
            <div>
                <div>
                  {
                    data?.getPresencesCount ? Object.values(data?.getPresencesCount).every(value => value === 0) ? <h1 className='text-center'>Kamu belum pernah absen!</h1> : 
                    <>
                      <div className='d-flex justify-content-center'>
                        <Piechart statistics={data?.getPresencesCount} />
                      </div>
                      <div className="mt-4">
                        <Card presence={presence} type={'hadir'} getHadir={getHadir} />
                        {presence === 'hadir' &&
                          <Table isOpen={isOpen.hadir} data={data?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <Card presence={presence} type={'izin'} getHadir={getHadir} />
                        {presence === 'izin' &&
                          <Table isOpen={isOpen.izin} data={data?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <Card presence={presence} type={'telat'} getHadir={getHadir} />
                        {presence === 'telat' &&
                          <Table isOpen={isOpen.telat} data={data?.getPresences?.[presence]} type={presence} list={list} />
                        }
                        <Card presence={presence} type={'alfa'} getHadir={getHadir} />
                        {presence === 'alfa' &&
                          <Table isOpen={isOpen.alfa} data={data?.getPresences?.[presence]} type={presence} list={list} />
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
    </>
  );
}

export default Statistics;