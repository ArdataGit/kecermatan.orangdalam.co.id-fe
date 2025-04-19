import Form from '@/components/form';
import Input from '@/components/input';
import { patchData, postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Button, Dialog } from 'tdesign-react';

export default function ManageUser({
  setVisible,
  params,
  detail,
  setDetail,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    FetchAPI(
      detail.id
        ? patchData(`admin/users/update/${detail.id}`, data)
        : postData('admin/users/insert', data)
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
      header={detail.id ? 'Edit User' : 'Tambah User'}
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
        <div className="flex gap-5">
          <Input
            title="Nama Lengkap"
            name="name"
            type="text"
            validation={{
              required: 'Nama lengkap harus di isi',
            }}
          />
          <Input
            title="Email address"
            name="email"
            type="email"
            validation={{
              required: 'Email harus di isi',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Format email tidak sesuai',
              },
            }}
          />
        </div>
        <div className="flex gap-5">
          <Input
            type="password"
            name="password"
            title="Password"
            validation={
              detail?.id
                ? {}
                : {
                    required: 'Password harus di isi',
                    minLength: {
                      value: 8,
                      message: 'Password minimal 8 karakter',
                    },
                  }
            }
          />
          <Input
            title="Nomor Telepon"
            startAdornment="+62"
            placeholder="81234567890"
            name="noWA"
            type="text"
            validation={{
              required: 'Nomor telepon harus di isi',
              pattern: {
                value: /^8[0-9]{9,11}$/,
                message: 'Format nomor telphone tidak sesuai',
              },
            }}
          />
        </div>
        <Input title="Alamat" name="alamat" type="multiple" />
        <Input name="provinsi" title="Provinsi" type="text" />
        <Input name="kabupaten" title="Kabupaten" type="text" />{' '}
        <Input name="kecamatan" title="Kecamatan" type="text" />
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
