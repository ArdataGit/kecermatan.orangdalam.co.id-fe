import Form from "@/components/form";
import Input from "@/components/input";
import useGetList from "@/hooks/use-get-list";
import { patchData, postData } from "@/utils/axios";
import FetchAPI from "@/utils/fetch-api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Dialog } from "tdesign-react";

export default function ManagePaketPembelian({
  setVisible,
  params,
  detail,
  setDetail,
}: any) {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleSubmit = async (data: any) => {
    setLoading(true);

    const payload = {
      ...data,
      paketPembelianId: Number(id),
    };

    FetchAPI(
      detail.id
        ? patchData(`admin/paket-pembelian-kecermatan/update/${detail.id}`, payload)
        : postData("admin/paket-pembelian-kecermatan/insert", payload)
    )
      .then(() => {
        params.refresh();
        setVisible(false);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setVisible(false);
    setDetail({});
  };

  const listLatihan = useGetList({
    url: "admin/kategori-soal-kecermatan/get",
    initialParams: {
      skip: 0,
      take: 100, // Increase take to see more options
      sortBy: "createdAt",
      descending: true,
    },
  });

  return (
    <Dialog
      header={detail.id ? "Edit Kecermatan" : "Tambah Kecermatan"}
      visible
      onClose={handleClose}
      className="w-[800px]"
      footer={null}
    >
      <Form
        onSubmit={handleSubmit}
        className="space-y-6"
        defaultValues={detail}
      >
        <Input
          title="Paket Kecermatan"
          name="kategoriSoalKecermatanId"
          type="select"
          options={listLatihan?.list?.map((item: any) => ({
            label: item.judul_kategori,
            value: item.id,
          }))}
          validation={{
            required: "Paket Kecermatan tidak boleh kosong",
          }}
        />

        <Input
          title="Tipe"
          name="type"
          type="select"
          validation={{
            required: "Tipe tidak boleh kosong",
          }}
          options={[
            { label: "Pendahuluan", value: "PENDAHULUAN" },
            { label: "Tryout", value: "TRYOUT" },
            { label: "Pemantapan", value: "PEMANTAPAN" },
            { label: "Kecermatan", value: "KECERMATAN" },
          ]}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            size="large"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" size="large" loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </Dialog>
  );
}