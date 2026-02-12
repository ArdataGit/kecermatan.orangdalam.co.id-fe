import TableWrapper from "@/components/table";
import useGetList from "@/hooks/use-get-list";
import { useEffect, useState } from "react";
import { Tag } from "tdesign-react";
import { getData } from "@/utils/axios";
import { useParams } from "react-router-dom";
import BreadCrumb from "@/components/breadcrumb";

import moment from "moment/min/moment-with-locales";
import { konversiDetikKeWaktu } from "@/const";

enum AlignType {
  Center = "center",
  Left = "left",
  Right = "right",
}

export default function Ranking({ isBimbel }: any) {
  const [data, setData] = useState<any>([]);
  const [tryout, setTryout] = useState<any>({});
  const { id, paketId, paketFK, kategoriId } = useParams();

  // Check if it is Isian by path (or maybe pass a prop? Route doesn't pass prop easily here without wrap)
  // Let's check location path or simply if kategoriId exists and it's NOT kecermatan?
  // Kecermatan route has 'kecermatan' in path. Isian has 'isian'.
  // Using window.location.pathname check inside component is one way, or check props.
  // But strictly `Ranking` is reused.
  // Kecermatan logic: `isKecermatan = !!kategoriId`.
  // Isian also has `kategoriId`.
  // So I need to differentiate.
  // I will check if URL contains 'isian'.
  const isIsian = location.pathname.includes('/isian/');
  const isKecermatan = !!kategoriId && !isIsian;

  const listTryout = useGetList({
    url: isKecermatan
      ? "user/paket-pembelian-kecermatan/kecermatan-ranking"
      : isIsian 
        ? "user/kategori-soal-isian/ranking"
        : "user/tryout/ranking",
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: isKecermatan ? "score" : (isIsian ? "totalScore" : "createdAt"),
      descending: true, 
      id: (isKecermatan || isIsian) ? undefined : paketId,
      paketPembelianTryoutId: !isKecermatan && !isBimbel && !isIsian ? paketFK : 0,
      paketPembelianBimbelId: !isKecermatan && isBimbel && !isIsian ? paketFK : 0,
      kategoriSoalKecermatanId: isKecermatan ? kategoriId : undefined,
      kategoriSoalIsianId: isIsian ? kategoriId : undefined,
    },
  });

  const columns = isKecermatan
    ? [
        {
          title: "Posisi",
          colKey: "posisi",
          width: 100,
          align: AlignType.Center,
          cell: (prop: any) => (
            <div>{prop.rowIndex + 1 + listTryout.params.skip}</div>
          ),
        },
        {
          title: "Nama Peserta",
          colKey: "name",
          width: 250,
          cell: ({ row }: any) => (
            <div>
              <p className="text-md font-bold">{row.user?.name || row.name}</p>
              <p className="text-xs text-gray-400 font-light">
                {moment(row.createdAt).format("dddd")},{" "}
                {moment(row.createdAt).format("LL")} <br /> Pukul{" "}
                {moment(row.createdAt).format("HH:mm")}
              </p>
            </div>
          ),
        },
        {
          title: "Skor",
          colKey: "score",
          width: 130,
          align: AlignType.Center,
          cell: ({ row }: any) => <div>{row.score}</div>,
        },
      ]
    : isIsian ? [
        {
          title: "Posisi",
          colKey: "posisi",
          width: 100,
          align: AlignType.Center,
          cell: (prop: any) => (
            <div>{prop.rowIndex + 1 + listTryout.params.skip}</div>
          ),
        },
        {
          title: "Nama Peserta",
          colKey: "name",
          width: 250,
          cell: ({ row }: any) => (
            <div>
              <p className="text-md font-bold">{row.name}</p>
              <p className="text-xs text-gray-400 font-light">
                {moment(row.createdAt).format("dddd")},{" "}
                {moment(row.createdAt).format("LL")} <br /> Pukul{" "}
                {moment(row.createdAt).format("HH:mm")}
              </p>
            </div>
          ),
        },
        {
          title: "Total Skor",
          colKey: "totalScore",
          width: 130,
          align: AlignType.Center,
          cell: ({ row }: any) => <div className="font-bold text-[#ffb22c]">{row.totalScore}</div>,
        },
    ] : [
        {
          title: "Posisi",
          colKey: "posisi",
          width: 100,
          align: AlignType.Center,
          cell: (prop: any) => (
            <div>{prop.rowIndex + 1 * listTryout.params.skip + 1}</div>
          ),
        },
        {
          title: "Nama Peserta",
          colKey: "name",
          width: 250,
          cell: ({ row }: any) => (
            <div>
              <p className="text-md font-bold">{row.name}</p>
              <p className="text-xs text-gray-400 font-light">
                {moment(row.createdAt).format("dddd")},{" "}
                {moment(row.createdAt).format("LL")} <br /> Pukul{" "}
                {moment(row.createdAt).format("HH:mm")}
              </p>
            </div>
          ),
        },
        {
          title: "Passing Grade",
          colKey: "nama",
          cell: ({ row }: any) => (
            <div className="flex gap-2">
              {row?.pointCategory?.map((item: any) => (
                <Tag
                  theme={item.all_point >= item.maxPoint ? "warning" : "danger"}
                  size="large"
                  variant="light"
                >
                  {item.category}: {item.all_point}/{item.kkm}
                </Tag>
              ))}
            </div>
          ),
        },
        {
          title: "Status",
          colKey: "status",
          width: 130,
          align: AlignType.Center,
          cell: ({ row }: any) => {
            const filter = row?.pointCategory?.filter(
              (e: any) => e.all_point < e.kkm
            );
            return (
              <Tag
                theme={filter?.length < 1 ? "warning" : "danger"}
                size="large"
                variant="light"
              >
                {filter?.length < 1 ? "Lulus" : "Tidak Lulus"}
              </Tag>
            );
          },
        },
        {
          title: "Durasi Pengerjaan",
          colKey: "durasi",
          width: 130,
          align: AlignType.Center,
          cell: ({ row }: any) => (
            <div>{konversiDetikKeWaktu(row?.waktuPengerjaan)}</div>
          ),
        },
        {
          title: "Skor",
          colKey: "point",
          width: 130,
          align: AlignType.Center,
          cell: ({ row }: any) => <div>{row.point || "0"}</div>,
        },
      ];

  useEffect(() => {
    getDetailClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailClass = async () => {
    await getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) window.location.href = "/paket-pembelian";
      setData({ ...res });
      
      if (isKecermatan) {
          // Find category name from the full class data
          const kecermatanList = res?.paketPembelian?.paketPembelianKecermatan || [];
          const currentKategori = kecermatanList.find((item: any) => item.kategoriSoalKecermatanId === Number(kategoriId));
          if(currentKategori) {
              setTryout({ nama: currentKategori.kategoriSoalKecermatan?.judul_kategori || "Kecermatan" });
          }
      }
      if (isIsian) {
           const isianList = res?.paketPembelian?.paketPembelianIsian || [];
           const currentKategori = isianList.find((item: any) => item.kategoriSoalIsianId === Number(kategoriId));
           if(currentKategori) {
               setTryout({ nama: currentKategori.kategoriSoalIsian?.judul_kategori || "Isian" });
           }
      }
    });

    if (!isKecermatan && !isIsian) {
        await getData(`user/find-latihan/${paketId}`).then((res) => {
          setTryout(res);
        });
    }
  };

  useEffect(() => {
    getDetailClass();
  }, [id, paketId, kategoriId]); // Updated dependencies

  return (
    <section className="">
      {isKecermatan ? (
         <BreadCrumb
          page={[
            { name: "Paket saya", link: "/my-class" },
            {
              name: data?.paketPembelian?.nama || "Nama Kelas",
              link: "/my-class",
            },
            { name: "Kecermatan", link: `/my-class/${id}/kecermatan` },
            { name: "Ranking", link: "#" },
          ]}
        />
      ) : isIsian ? (
          <BreadCrumb
          page={[
            { name: "Paket saya", link: "/my-class" },
            {
              name: data?.paketPembelian?.nama || "Nama Kelas",
              link: "/my-class",
            },
            { name: "Isian", link: `/my-class/${id}/isian` },
            { name: "Ranking", link: "#" },
          ]}
        />
      ) : isBimbel ? (
        <BreadCrumb
          page={[
            { name: "Paket saya", link: "/my-class" },
            {
              name: data?.paketPembelian?.nama || "Nama Kelas",
              link: "/my-class",
            },
            { name: "Bimbel", link: `/my-class/${id}/bimbel` },
            {
              name: tryout?.nama || "Bimbel",
              link: `/my-class/${id}/bimbel/mini-test/${paketFK}/${paketId}`,
            },
            { name: "Ranking", link: "#" },
          ]}
        />
      ) : (
        <BreadCrumb
          page={[
            { name: "Paket saya", link: "/my-class" },
            {
              name: data?.paketPembelian?.nama || "Nama Kelas",
              link: "/my-class",
            },
            { name: "Tryout", link: `/my-class/${id}/tryout` },
            {
              name: tryout?.nama || "Tryout",
              link: `/my-class/${id}/tryout/${paketFK}/${paketId}`,
            },
            { name: "Ranking", link: "#" },
          ]}
        />
      )}

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Ranking {isKecermatan ? "Kecermatan" : isIsian ? "Isian" : "Tryout"} {tryout?.nama}
            </h1>
          </div>
        </div>
        <TableWrapper data={listTryout} columns={columns} />
      </div>
    </section>
  );
}
