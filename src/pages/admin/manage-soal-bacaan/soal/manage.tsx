
import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Button, Dialog } from 'tdesign-react';

export default function ManageSoalBacaanModal({
  setVisible,
  params,
  detail,
  setDetail,
  bacaanId,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    const payload = {
      ...data,
      bacaanId: bacaanId,
    };

    const url = detail.id
      ? `admin/soal-bacaan/update/${detail.id}`
      : 'admin/soal-bacaan/insert';

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
      header={detail.id ? 'Edit Soal Bacaan' : 'Tambah Soal Bacaan'}
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



        {/* Note: In Kecermatan, questions are auto-generated or use specific characters. 
            For Bacaan, we might need simple text for now. */}

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
