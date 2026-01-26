
import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Button, Dialog } from 'tdesign-react';

export default function ManageBacaan({
  setVisible,
  params,
  detail,
  setDetail,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    const url = detail.id
      ? `admin/kategori-soal-bacaan/update/${detail.id}`
      : 'admin/kategori-soal-bacaan/insert';

    FetchAPI(
      detail.id ? patchData(url, data) : postData(url, data)
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
      header={detail.id ? 'Edit Kategori Bacaan' : 'Tambah Kategori Bacaan'}
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
          title="Judul Kategori"
          name="judul_kategori"
          type="text"
          validation={{
            required: 'Judul kategori tidak boleh kosong',
          }}
        />

        <Input title="Keterangan" name="keterangan" type="multiple" />

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
