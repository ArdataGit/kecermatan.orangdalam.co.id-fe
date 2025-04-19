import Form from '@/components/form';
import Input from '@/components/input';
import { useAuthStore } from '@/stores/auth-store';
import { postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { imageLink } from '@/utils/image-link';
import { jsonToFormData } from '@/utils/json-to-form-data';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Tabs } from 'tdesign-react';

export default function Empty() {
  const account = useAuthStore((state) => state.user);
  const [image, setImage] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuthStore();
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    FetchAPI(
      postData(
        'user/change-profile',
        jsonToFormData({
          ...data,
          gambar: image,
        })
      )
    ).then(({ data }: any) => {
      login(data);
      navigate('/');
    });
  };

  const onSubmitPassword = async (data: any) => {
    FetchAPI(
      postData('user/change-password', {
        password: data.password,
        oldPassword: data.oldPassword,
      })
    ).then(() => {
      navigate('/');
    });
  };

  const { TabPanel } = Tabs;

  return (
    <div className="bg-white p-10 rounded-xl shadow-2xl">
      <Tabs
        addable={false}
        defaultValue="1"
        dragSort={false}
        placement="top"
        size="medium"
        theme="normal"
      >
        <TabPanel destroyOnHide label="Profile" removable={false} value="1">
          <Form onSubmit={onSubmit} defaultValues={account}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <input
                      type="file"
                      id="photo"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e?.target?.files?.[0];
                        if (file) {
                          setImage(file);
                        }
                      }}
                    />
                    <div className="mt-2 flex items-center gap-x-3">
                      <Avatar
                        image={
                          image
                            ? URL.createObjectURL(image)
                            : imageLink(account?.gambar || '')
                        }
                        shape="circle"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef?.current?.click();
                        }}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Ganti
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      name="name"
                      title="Nama Lengkap"
                      type="text"
                      validation={{
                        required: 'Nama Lengkap harus diisi',
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      title="Nomor Telphone"
                      startAdornment="+62"
                      placeholder="81234567890"
                      name="noWA"
                      type="text"
                      validation={{
                        required: 'Nomor telphone tidak boleh kosong',
                        pattern: {
                          value: /^8[0-9]{9,11}$/,
                          message: 'Format nomor telphone tidak sesuai',
                        },
                      }}
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <Input
                      name="email"
                      title="Email"
                      type="email"
                      disabled
                      validation={{
                        required: 'Email harus diisi',
                      }}
                    />
                  </div>

                  <div className="col-span-full">
                    <Input
                      name="alamat"
                      title="Alamat Lengkap"
                      type="text"
                      validation={{
                        required: 'Alamat harus diisi',
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <Input
                      name="provinsi"
                      title="Provinsi"
                      type="text"
                      validation={{
                        required: 'Provinsi harus diisi',
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      name="kabupaten"
                      title="Kabupaten"
                      type="text"
                      validation={{
                        required: 'Kota / Kabupaten harus diisi',
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      name="kecamatan"
                      title="Kecamatan"
                      type="text"
                      validation={{
                        required: 'Kecamatan harus diisi',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                theme="primary"
                size="large"
                onClick={() => {}}
                type="submit"
              >
                Simpan
              </Button>
            </div>
          </Form>
        </TabPanel>
        <TabPanel destroyOnHide label="Keamanan" removable={false} value="2">
          <Form onSubmit={onSubmitPassword}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input
                      type="password"
                      name="password"
                      title="Password Baru"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      validation={{
                        required: 'Password tidak boleh kosong',
                        minLength: {
                          value: 8,
                          message: 'Password minimal 8 karakter',
                        },
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      type="password"
                      name="confirm_password"
                      title="Konfirmasi Password"
                      validation={{
                        required: 'Password tidak boleh kosong',
                        validate: (value: string) => {
                          return value != password
                            ? 'Password tidak sama'
                            : null;
                        },

                        minLength: {
                          value: 8,
                          message: 'Password minimal 8 karakter',
                        },
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      type="password"
                      name="oldPassword"
                      title="Password Lama"
                      validation={{
                        required: 'Password tidak boleh kosong',
                        minLength: {
                          value: 8,
                          message: 'Password minimal 8 karakter',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                theme="primary"
                size="large"
                onClick={() => {}}
                type="submit"
              >
                Simpan
              </Button>
            </div>
          </Form>
        </TabPanel>
      </Tabs>
    </div>
  );
}
