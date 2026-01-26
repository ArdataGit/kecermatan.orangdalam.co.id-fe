
import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Button, Dialog } from 'tdesign-react';

export default function ManageSoalIsianModal({
  setVisible,
  params,
  detail,
  setDetail,
  categoryId,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    const payload = {
      ...data,
      kategoriSoalIsianId: categoryId,
    };

    const url = detail.id
      ? `admin/soal-isian/update/${detail.id}`
      : 'admin/soal-isian/insert';

    FetchAPI(
      detail.id ? patchData(url, payload) : postData(url, payload)
    )
      .then(() => {
        params.refresh();
        setVisible(false);
        setDetail({});
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

  return (
    <Dialog
      header={detail.id ? 'Edit Soal Isian' : 'Tambah Soal Isian'}
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
          title="Soal"
          name="soal"
          type="multiple"
          validation={{ required: 'Soal tidak boleh kosong' }}
        />

        <Input
            title="Jawaban"
            name="jawaban"
            type="multiple"
            validation={{ required: 'Jawaban harus dipilih' }}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            size="large"
            onClick={handleClose}
          >
            Batal
          </Button>
          <Button type="submit" size="large" loading={loading}>
            Simpan
          </Button>
        </div>
      </Form>
    </Dialog>
  );
}
