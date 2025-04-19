import Button from '@/components/button';
import Form from '@/components/form';
import Input from '@/components/input';
import { postData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LOGO from '@/assets/Logo.png';

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    FetchAPI(postData('auth/register', data))
      .then(() => {
        navigate('/auth/login');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div style={{ backgroundImage: `url('/img/bg.jpg')` }} className="min-h-[100vh] bg-no-repeat bg-cover bg-center pt-20">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-10 w-auto"
              src={LOGO}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Daftar akun baru
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <Form onSubmit={onSubmit} className="space-y-6">
                <Input
                  title="Nama Lengkap"
                  name="name"
                  type="text"
                  validation={{
                    required: 'Nama tidak boleh kosong',
                  }}
                />
                <Input
                  title="Email address"
                  name="email"
                  type="email"
                  validation={{
                    required: 'Email tidak boleh kosong',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Format email tidak sesuai',
                    },
                  }}
                />
                <Input
                  type="password"
                  name="password"
                  title="Password"
                  validation={{
                    required: 'Password tidak boleh kosong',
                    minLength: {
                      value: 8,
                      message: 'Password minimal 8 karakter',
                    },
                  }}
                />
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
                <Button type="submit" isLoading={isLoading}>
                  Register
                </Button>
              </Form>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              <span style={{ backgroundColor: 'black', color: 'white', padding: '0 4px', borderRadius: '4px' }}>
                Sudah punya akun?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold leading-6 text-white hover:text-gray-300"
                  style={{ textDecoration: 'underline' }}
                >
                  Login sekarang
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
