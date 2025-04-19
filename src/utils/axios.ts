import axios, { AxiosResponse } from 'axios';
import { SERVER_URL_API } from '@/const';
import { useAuthStore } from '@/stores/auth-store';
import moment from 'moment';

let alertShown = false;

const handleError = (error: any) => {
  if (
    error?.response?.data.msg === 'jwt expired' ||
    error?.response?.data?.msg === 'jwt malformed' ||
    error?.response?.data?.msg === 'invalid token' ||
    error?.response?.data?.msg === 'invalid signature' ||
    error?.response?.data?.msg === 'Authentication invalid' ||
    error?.response?.data?.msg === 'Authentication: User not found' ||
    error?.response?.data?.msg === 'invalid algorithm'
  ) {
    window.location.href = '/auth/login';
    localStorage.removeItem('authentication');
  }

  if (error.response.data.msg === 'JWT Version not valid' && !alertShown) {
    alertShown = true;

    alert('Akun Anda telah login di perangkat lain. Silahkan login kembali.');
    window.location.href = '/auth/login';
    localStorage.removeItem('authentication');
  }
  return { ...error.response, error: true };
};

export async function getData(url: string, params?: any) {
  try {
    const token = useAuthStore.getState().token
      ? useAuthStore.getState().token
      : '';

    const result = await axios.get(`${SERVER_URL_API}/${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getExcel(url: string, fileName: string, params?: any) {
  try {
    const token = useAuthStore.getState().token
      ? useAuthStore.getState().token
      : '';

    return axios
      .request({
        responseType: 'arraybuffer',
        url: `${SERVER_URL_API}/${url}`,
        method: 'get',
        params,
        headers: {
          'Content-Type': 'blob',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const url = window.URL.createObjectURL(
          new Blob([result.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${fileName}-${moment().format('DD-MM-YYYY')}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      });
  } catch (error) {
    return handleError(error);
  }
}

export async function postData(
  url: string,
  payload?: any
  // formData: boolean
) {
  try {
    const token = useAuthStore.getState().token
      ? useAuthStore.getState().token
      : '';

    const result = await axios.post(`${SERVER_URL_API}/${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    return handleError(error);
  }
}

export async function patchData(
  url: string,
  payload: any
): Promise<AxiosResponse> {
  try {
    const token = useAuthStore.getState().token
      ? useAuthStore.getState().token
      : '';

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === undefined) {
        payload[key] = '';
      }
    });

    return await axios.patch(`${SERVER_URL_API}/${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteData(url: string) {
  try {
    const token = useAuthStore.getState().token
      ? useAuthStore.getState().token
      : '';
    return await axios.delete(`${SERVER_URL_API}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
