
import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Button, Dialog } from 'tdesign-react';

export default function ManageBacaanModal({
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
      kategoriSoalBacaanId: categoryId,
    };

    const url = detail.id
      ? `admin/bacaan/update/${detail.id}`
      : 'admin/bacaan/insert';

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
      header={detail.id ? 'Edit Bacaan' : 'Tambah Bacaan'}
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
          title="Bacaan"
          name="bacaan"
          type="multiple"
          validation={{ required: 'Bacaan tidak boleh kosong' }}
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
