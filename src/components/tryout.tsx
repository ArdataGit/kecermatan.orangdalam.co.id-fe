import { getData, postData } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CKeditor from './ckeditor';
import { Dialog, Radio, Tag } from 'tdesign-react';
import Countdown from 'react-countdown';
import { IconExclamationCircle } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import moment from 'moment';

export default function OnGoingTryout({ isPembahasan, isBimbel }: any) {
  const [onShow, setOnShow] = useState(0);
  const [tryout, setTryout] = useState<any>({});
  const { tryoutId, id, paketId, paketFK } = useParams();
  const [soal, setSoal] = useState<any>({});
  const navigate = useNavigate();

  const [selected, setSelected] = useState<any>(0);
  const [soalId, setSoalId] = useState<any>([]);

  const [isFinish, setIsFinish] = useState(false);
  const [showGrade, setShowGrade] = useState(false);
  const [finishAt, setFinishAt] = useState<any>();
  const [allPoint, setAllPoint] = useState({
    isPassing: true,
    point: 0,
    maxPoint: 0,
  });
  const [point, setPoint] = useState<any>([]);

  const getDetail = async () => {
    getData(`user/find-tryout/${tryoutId}`, { isPembahasan }).then((res) => {
      if (!res.id) return navigate('/my-class');
      setTryout(res);
      setSoalId(res?.soalId);
      setFinishAt(moment().add(res?.waktuTersisa, 'seconds')?.format());
    });
  };
  const answerTryout = async (e: any) => {
    postData(`user/tryout/answer`, {
      jawabanSelect: e,
      soalId: soalId?.[onShow]?.id,
      tryoutId,
    }).then((res) => {
      if (!res?.data?.data?.id) {
        toast.error(res.data.msg);
        if (res.data.msg === 'Waktu Telah habis') {
          return handleFinish();
        } else {
          window.location.reload();
        }
      }
      setSoalId((prev: any) => {
        prev[onShow].isAnswer = e ? true : false;
        return prev;
      });
      // setOnShow(onShow < soalId?.length - 1 ? onShow + 1 : onShow);
    });
  };
  const handleFinish = async () => {
    if (!tryout?.id) return true;
    postData(`user/tryout/finish`, {
      tryoutId,
    }).then((res) => {
      setPoint(res?.data?.data);
      setShowGrade(true);
      res?.data?.data?.pointCategory?.forEach((e: any) => {
        if (e.all_point < e.kkm) {
          setAllPoint((prev) => ({
            ...prev,
            isPassing: false,
          }));
        }
        setAllPoint((prev: any) => ({
          ...prev,
          isPassing: e.all_point >= e.kkm ? true : false,
          point: Number(prev.point) + Number(e.all_point),
          maxPoint: Number(prev.maxPoint) + Number(e.maxPoint),
        }));
      });
    });
  };

  useEffect(() => {
    getDetail();
  }, []);
	
  useEffect(() => {
	const handleCopy = (e: any)=> {
		e.preventDefault();
		e.clipboardData.setData("text/plain","");
	}
	const handleContextMenu = (e: any) => e.preventDefault();
	window.addEventListener("contextmenu", handleContextMenu)
	window.addEventListener("cut", handleCopy)
	window.addEventListener("copy", handleCopy)
	return () => {
	window.removeEventListener("contextmenu", handleContextMenu)
	window.removeEventListener("cut", handleCopy)
	window.removeEventListener("copy", handleCopy)
	}
  })

  const Completionist = () => {
    if (!showGrade && !isPembahasan) {
      handleFinish();
    }
    return <div></div>;
  };
	
 
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <div  className="text-yellow-100  flex">
          <div className="w-fit mx-1 p-2 bg-white text-indigo-900 rounded-lg">
            <div className=" text-center leading-none" x-text="hours">
              {hours}
            </div>
            <div className=" text-center uppercase text-sm leading-none">
              Jam
            </div>
          </div>
          <div className="w-fit mx-1 p-2 bg-white text-indigo-900 rounded-lg">
            <div className=" text-center leading-none" x-text="minutes">
              {minutes}
            </div>
            <div className=" text-center uppercase text-sm leading-none">
              Menit
            </div>
          </div>
          <div className="w-fit mx-1 p-2 bg-white text-indigo-900 rounded-lg">
            <div className=" text-center leading-none" x-text="seconds">
              {seconds}
            </div>
            <div className=" text-center uppercase text-sm leading-none">
              Detik
            </div>
          </div>
        </div>
      );
    }
  };

  const CT = () => {
    return <Countdown date={finishAt} key={finishAt} renderer={renderer} />;
  };
  const [interval, setInterval] = useState(
    moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss')
  );

  const addDuration = async () => {
    await postData(`user/tryout/add-duration`, {
      id: soalId?.[onShow]?.id,
      duration: 5,
    });
  };

  const handleDurationChangeSoal = async () => {
    await postData(`user/tryout/add-duration`, {
      id: soalId?.[onShow]?.id,
      duration: moment(interval).diff(moment(), 'seconds'),
    });
    setInterval(moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss'));
  };

  useEffect(() => {
    if (soalId?.[onShow]?.id) {
      getData(`user/find-soal-tryout/${soalId?.[onShow]?.id}`, {
        isPembahasan,
      }).then((res) => {
        setSoal(res);
        if (!isPembahasan) {
          handleDurationChangeSoal();
          setInterval(moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss'));
        }
        setSelected(res?.jawabanSelect);
      });
    }
  }, [onShow, soalId]);

  return (
    <>
      <div className="flex justify-end md:hidden mb-2">
        <CT />
      </div>
      <div className="">
        {!isPembahasan && !showGrade ? (
          <Countdown
            date={interval}
            key={interval}
            className="hidden"
            onComplete={() => {
              addDuration();
              setInterval(
                moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss')
              );
            }}
          />
        ) : (
          ''
        )}
      </div>{' '}
      <div className="bg-white px-4 xl:px-10 py-10 rounded-2xl ">
        <div>
          {isFinish && (
            <Dialog
              visible
              header={
                <>
                  <IconExclamationCircle className="mr-2 text-warning" />
                  <span>Apakah Kamu Yakin ?</span>
                </>
              }
              mode="modal"
              onClose={() => setIsFinish(false)}
              onConfirm={handleFinish}
            >
              <p>
                Apakah kamu yakin ingin mengakhiri tryout{' '}
                <span className="font-semibold">
                  {tryout?.paketLatihan?.nama}
                </span>{' '}
                ? Kamu tidak akan bisa melanjutkan tryout ini lagi. Kamu telah
                mengerjakan{' '}
                {soalId?.filter((item: any) => item.isAnswer).length}/
                {soalId?.length} soal.
              </p>
            </Dialog>
          )}

          {showGrade && (
            <Dialog
              visible
              mode="modal"
              header={
                <h4 className="px-2 text-xl font-bold text-navy-700">
                  Hasil Tryout
                </h4>
              }
              confirmBtn="Selesai"
              cancelBtn={false}
              closeBtn={false}
              onConfirm={() => {
                if (isBimbel)
                  return navigate(
                    `/my-class/${id}/bimbel/mini-test/${paketFK}/${paketId}/${tryoutId}/statistik`
                  );

                navigate(
                  `/my-class/${id}/tryout/${paketFK}/${paketId}/${tryoutId}/statistik`
                );
              }}
            >
              <div className="relative flex flex-col items-center max-w-[95%] mx-auto bg-white bg-clip-bor-sm">
                <div className="mb-4 w-full">
                  <p className="mt-2 px-2 text-base text-gray-600">
                    Hasil tryout kamu adalah sebagai berikut:
                  </p>

                  <p
                    className={`
                    mt-2 px-2 text-base text-gray-600 text-center ${
                      allPoint.isPassing ? 'text-[#F97316]' : 'text-red-500'
                    }`}
                  >
                    {allPoint.isPassing
                      ? 'Selamat, kamu lulus!'
                      : 'Maaf, kamu belum lulus.'}
                  </p>
                </div>
                <div className="flex flex-wrap flex-row mb-4 gap-2 w-full">
                  <Tag
                    variant="light-outline"
                    theme={allPoint.isPassing ? 'warning' : 'danger'}
                    className={`flex  h-full w-full justify-center rounded-2xl bg-white bg-clip-border py-4 border shadow-md ${
                      allPoint.isPassing
                        ? 'border-[#F97316]'
                        : '!border-red-500'
                    }`}
                  >
                    <p className="text-sm text-gray-600 font-semibold text-center w-full">
                      {tryout?.paketLatihan?.nama}
                    </p>
                    <p className="text-base font-medium text-navy-700 text-center w-full">
                      <span>{allPoint.point} </span>
                      dari
                      <span> {allPoint.maxPoint}</span>
                    </p>
                  </Tag>
                  {point?.pointCategory?.map((e: any) => (
                    <Tag
                      variant="light-outline"
                      theme={e.all_point >= e.kkm ? 'warning' : 'danger'}
                      className={`flex  h-full w-[48%] !m-0 justify-center rounded-2xl bg-white bg-clip-border py-4 border shadow-md ${
                        e.all_point >= e.kkm
                          ? 'border-[#F97316]'
                          : '!border-red-500'
                      }`}
                    >
                      <p className="text-sm text-gray-600 font-semibold text-center w-full">
                        {e.category}
                      </p>
                      <p className="text-base font-medium text-navy-700 text-center w-full">
                        <span>{e.all_point} </span>
                        dari
                        <span> {e.kkm}</span>
                      </p>
                    </Tag>
                  ))}
                </div>
              </div>
            </Dialog>
          )}
        </div>
        <div className="block md:flex flex-row-reverse">
          <div className="relative w-full md:w-3/12 md:border-l md:pl-10">
            <aside className="sticky top-10  border-[#DDD] ">
              <div className="flex  gap-y-5 mb-5 md:flex-row md:items-center justify-start justify-between header-section w-full">
                <div className="title">
                  <h1 className="text-2xl text-indigo-950 font-bold ">
                    Nomor Soal
                  </h1>
                </div>
                <small className="self-center">
                  {soalId?.filter((item: any) => item.isAnswer).length}/
                  {soalId?.length}
                </small>
              </div>
              {isPembahasan && (
                <>
                  <div className="flex mb-5 gap-2">
                    <div className="w-[30px] h-[30px] bg-red-500"></div>
                    <p className="self-center">Salah</p>
                  </div>
                  <div className="flex mb-5 gap-2">
                    <div className="w-[30px] h-[30px] bg-[#F97316]"></div>
                    <p className="self-center">Benar</p>
                  </div>
                  <div className="flex mb-5 gap-2">
                    <div className="w-[30px] h-[30px] bg-gray-300"></div>
                    <p className="self-center">Tidak Terjawab</p>
                  </div>
                </>
              )}
              <ul className="grid grid-cols-4 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {soalId?.map((item: any, index: number) => (
                  <li key={index}>
                    <button
                      onClick={() => setOnShow(index)}
                      className={`
                    text-indigo-950 hover:shadow-md text-center p-2 py-3 rounded-md w-full
                    ${
                      soalId?.[onShow]?.id === item.id
                        ? 'bg-[#1e1b4b] text-white border border-[#1e1b4b]'
                        : item.status === 'BENAR'
                        ? '!bg-[#F97316] text-white'
                        : item.status === 'SALAH' && item.isAnswer
                        ? 'bg-red-500 border border-red-500 text-white'
                        : soalId?.[onShow]?.id === item.id
                        ? '!bg-[#1e1b4b] text-white border !border-[#1e1b4b]'
                        : item.status === 'SALAH' && !item.isAnswer
                        ? 'bg-gray-300 text-white'
                        : soalId?.[onShow]?.id !== item.id && item.isAnswer
                        ? 'border border-[#F97316] text-white bg-[#F97316]'
                        : ' border border-gray-300'
                    }
                  `}
                    >
                      <span className="w-full"> {index + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {!isPembahasan && (
                <button
                  className="bg-[#F97316] text-white w-full py-3 mt-4 text-sm rounded-md hover:shadow-md"
                  onClick={() => {
                    setIsFinish(true);
                  }}
                >
                  Selesai
                </button>
              )}
            </aside>
          </div>
          <div className="w-full md:w-9/12 md:pr-5 mt-10 md:mt-0">
            <div className="flex flex-col border-b pb-2 border-gray-300 gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
              <div className="title flex gap-2 items-center">
                <h1 className="text-xl">
                  Soal No
                  <span className=" text-md w-[20px]"> {onShow + 1}</span>
                </h1>
                {soal.subCategory && (
                  <Tag variant="light-outline">{soal?.subCategory}</Tag>
                )}
              </div>
              <div className="hidden md:block">
                <CT />
              </div>
            </div>
            <div className="min-h-[200px] md:min-h-[600px] mt-8 ">
              <div className="mb-4">
                <div>
                  <CKeditor
                    content={soal?.soal}
                    readOnly
                    className="mb-5 inline-block w-full"
                  />
                </div>
              </div>
              {soal?.jawabanShow?.map((item: any, index: number) => (
                <>
                  <div
                    key={index}
                    className={`w-full flex mb-3 justify-start ${
                      isPembahasan && item.isCorrect ? 'text-[#F97316]' : ''
                    }
                  ${
                    isPembahasan && item.id === selected ? 'text-red-500' : ''
                  }`}
                  >
                    <Radio
                      allowUncheck
                      checked={selected === item.id}
                      className="mr-2 self-baseline"
                      readonly={isPembahasan}
                      onChange={() => {
                        if (!isPembahasan) {
                          setSelected(selected === item.id ? null : item.id);
                          answerTryout(selected === item.id ? null : item.id);
                        }
                      }}
                    ></Radio>
                    <div
                      className={`${
                        isPembahasan && soal.tipePenilaian !== 'POINT'
                          ? 'block'
                          : 'flex'
                      }  w-full cursor-pointer`}
                      onClick={() => {
                        if (!isPembahasan) {
                          setSelected(selected === item.id ? null : item.id);
                          answerTryout(selected === item.id ? null : item.id);
                        }
                      }}
                    >
                      <p
                        className={`font-semibold mr-2 ${
                          isPembahasan && item.isCorrect ? 'text-[#F97316]' : ''
                        }`}
                      >
                        {String.fromCharCode(65 + index)}.{' '}
                        {soal.tipePenilaian === 'POINT' && isPembahasan ? (
                          <span className="text-sm">({item.point} Point)</span>
                        ) : null}
                      </p>
                      <div className="">
                        <div className=" overflow-hidden">
                          <CKeditor content={item.jawaban} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              {isPembahasan && (
                <>
                  <div className="flex flex-col gap-y-5 md:flex-row md:items-center  mb-5 justify-start md:justify-between header-section w-full">
                    <div className="title">
                      <h1 className="text-xl font-bold">Pembahasan</h1>
                    </div>
                  </div>
                  <CKeditor
                    content={soal?.pembahasan}
                    readOnly
                    className="mb-5"
                  />
                </>
              )}
            </div>
            <div className="flex justify-center gap-10 mt-10">
              <button
                className={`bg-white border border-tertiary text-tertiary hover:bg-tertiary hover:text-white p-3 px-5 rounded-full ${
                  onShow > 0 ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (onShow > 0) setOnShow(onShow - 1);
                }}
              >
                Sebelumnya
              </button>
              <button
                className={`bg-tertiary text-white p-3 px-5 rounded-full ${
                  onShow === soalId?.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => {
                  if (onShow < soalId?.length - 1) setOnShow(onShow + 1);
                }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
