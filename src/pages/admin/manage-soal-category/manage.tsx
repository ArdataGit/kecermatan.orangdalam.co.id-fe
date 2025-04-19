import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dialog } from 'tdesign-react';

export default function ManageKategori({
  setVisible,
  params,
  detail,
  setDetail,
}: any) {
  const [loading, setLoading] = useState(false);
  const paramss = useParams();

  const handleSubmit = async (data: any) => {
    setLoading(true);

    data.parentCategoryId = paramss.id;
    FetchAPI(
      detail.id
        ? patchData(`admin/bank-soal-kategori/update/${detail.id}`, data)
        : postData('admin/bank-soal-kategori/insert', data)
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

  return (
    <Dialog
      header={detail.id ? 'Edit Kategori ' : 'Tambah Kategori '}
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
          title="Judul"
          name="nama"
          type="text"
          validation={{
            required: 'Judul tidak boleh kosong',
          }}
        />

        <Input title="Passing Grade" name="kkm" def type="number" />
        <Input
          title="Tipe Penilaian"
          name="tipePenilaian"
          type="select"
          validation={{
            required: 'Tipe Penilaian tidak boleh kosong',
          }}
          options={[
            { label: 'Benar Salah', value: 'BENAR_SALAH' },
            { label: 'Point', value: 'POINT' },
          ]}
        />
        <Input title="Keterangan" name="keterangan" type="multiple" />

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
