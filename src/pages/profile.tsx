import Form from '@/components/form';
import Input from '@/components/input';
import { useAuthStore } from '@/stores/auth-store';
import { postData, getData } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';
import { imageLink } from '@/utils/image-link';
import { jsonToFormData } from '@/utils/json-to-form-data';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, Button, Tabs, Table, Input as TInput, Message, Badge } from 'tdesign-react';
import Modal from '@/components/Modal';
import { IconCopy, IconShare, IconBuildingBank, IconNote } from '@tabler/icons-react';
import moment from 'moment';

export default function Empty() {
  const account = useAuthStore((state) => state.user);
  const { login } = useAuthStore();
  const [image, setImage] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<{ code?: boolean; link?: boolean }>({});
  const [password, setPassword] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  
  // Modal Withdraw
  const [modalBalance, setModalBalance] = useState(0);
  const [modalBalanceFormatted, setModalBalanceFormatted] = useState('0');
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [paymentDestination, setPaymentDestination] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal History
  const [historyVisible, setHistoryVisible] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [summary, setSummary] = useState({
    total_withdrawals: 0,
    total_approved: 0,
    total_approved_formatted: '0',
    total_pending: 0,
    total_rejected: 0,
  });

  // Tab dari URL
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'akun');
  const navigate = useNavigate();

  // Update tab dari URL
  useEffect(() => {
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  // Load data affiliate saat login
  useEffect(() => {
    if (account?.id) {
      getData(`admin/affiliate/${account.id}`).then((res) => {
        console.log('data affiliate', res);
        setReferrals(res.referrals || []);
        setTotalWithdrawn(parseInt(res.total_withdrawn || '0', 10));
        setPendingWithdrawals(res.pending_withdrawals || []);
      });
    }
  }, [account]);

  // === Fetch SALDO saat modal withdraw dibuka ===
  useEffect(() => {
    if (withdrawVisible && account?.id) {
      setModalBalance(0);
      setModalBalanceFormatted('0');

      FetchAPI(postData('user/affiliateuser', { userId: account.id }))
        .then((res) => {
          console.log('saldo affiliate user untuk withdraw', res);
          const data = res?.data || res;
          const balanceObj = data?.data?.balance || data?.balance || {};
          const current = parseInt(balanceObj.current || balanceObj || '0', 10);
          const formatted = balanceObj.formatted || current.toLocaleString('id-ID');

          setModalBalance(current);
          setModalBalanceFormatted(formatted);
        })
        .catch((err) => {
          console.error('Error fetching affiliate balance:', err);
          Message.error({
            content: 'Gagal memuat saldo affiliate. Silakan coba lagi.',
            duration: 3000,
          });

          const fallback = parseInt(account?.affiliateBalance || '0', 10);
          setModalBalance(fallback);
          setModalBalanceFormatted(fallback.toLocaleString('id-ID'));
        });
    } else if (!withdrawVisible) {
      setModalBalance(0);
      setModalBalanceFormatted('0');
      setWithdrawAmount('');
      setWithdrawNotes('');
      setPaymentDestination('');
    }
  }, [withdrawVisible, account?.id]);

  // Fetch HISTORY saat modal history dibuka
useEffect(() => {
  if (historyVisible && account?.id) {
    setWithdrawHistory([]);
    setSummary({
      total_withdrawals: 0,
      total_approved: 0,
      total_approved_formatted: '0',
      total_pending: 0,
      total_rejected: 0,
    });

    FetchAPI(postData('user/history/withdraw', { userId: account.id }))
      .then((res) => {
        console.log('riwayat withdraw (raw):', res);

        // AMBIL res.data (karena postData return result utuh)
        const data = res?.data?.data || {};

        const history = Array.isArray(data.history) ? data.history : [];
        const summaryData = data.summary || {};

        const totalApproved = parseInt(summaryData.total_approved || '0', 10);

        const formattedHistory = history.map(item => ({
          ...item,
          amount: parseInt(item.amount || '0', 10),
          amount_formatted: parseInt(item.amount || '0', 10).toLocaleString('id-ID'),
          status_label: item.status_label || 
            (item.status === 'approved' ? 'Disetujui' : 
             item.status === 'rejected' ? 'Ditolak' : 'Pending'),
          created_at_formatted: item.created_at_formatted || 
            moment(item.createdAt || item.created_at).format('DD/MM/YYYY HH:mm'),
          processed_at_formatted: item.processed_at_formatted || 
            (item.processedAt ? moment(item.processedAt).format('DD/MM/YYYY HH:mm') : '-'),
        }));

        setSummary({
          total_withdrawals: parseInt(summaryData.total_withdrawals || '0', 10),
          total_approved: totalApproved,
          total_approved_formatted: totalApproved.toLocaleString('id-ID'),
          total_pending: parseInt(summaryData.total_pending || '0', 10),
          total_rejected: parseInt(summaryData.total_rejected || '0', 10),
        });

        setWithdrawHistory(formattedHistory);
      })
      .catch((err) => {
        console.error('Error fetching withdraw history:', err);
        Message.error({
          content: 'Gagal memuat riwayat pencairan. Silakan coba lagi.',
          duration: 3000,
        });
        setHistoryVisible(false);
      });
  } else if (!historyVisible) {
    setWithdrawHistory([]);
    setSummary({
      total_withdrawals: 0,
      total_approved: 0,
      total_approved_formatted: '0',
      total_pending: 0,
      total_rejected: 0,
    });
  }
}, [historyVisible, account?.id]);

  // === Submit Form ===
  const onSubmitAkun = async (data: any) => {
    const formData = jsonToFormData({ ...data, photo: image });

  console.log("📤 DATA TERKIRIM:", Object.fromEntries(formData.entries()));

  FetchAPI(postData('user/change-profile', formData)).then((res) => {
    console.log("📥 RESPONSE CHANGE PROFILE:", res);

    const user = res?.data?.user || res?.user;

    console.log("✅ TOKEN:", token);
    console.log("✅ USER:", user);

    // Update local storage lewat store
    login({
      data: {
        token,
        user
      }
    });

    console.log("🧠 LOCAL STORAGE AUTH (AFTER UPDATE):", JSON.parse(localStorage.getItem('auth-storage')));

    navigate('/');
  });
};

const onSubmitProfil = async (data: any) => {
  const formData = jsonToFormData({ ...data, photo: image });

  console.log("📤 DATA TERKIRIM:", Object.fromEntries(formData.entries()));

  // 🔐 Backup state lama jika gagal
  const oldState = {
    user: useAuthStore.getState().user,
    token: useAuthStore.getState().token,
  };

  try {
    const res = await FetchAPI(postData('user/change-profile', formData));

    console.log("📥 RESPONSE CHANGE PROFILE:", res);

    const token = res?.data?.data?.token;
    const user = res?.data?.data?.user;

    console.log("✅ TOKEN:", token);
    console.log("✅ USER:", user);

    // ❗ Prevent undefined → auto logout
    if (!token || !user) {
      console.warn("⚠️ API tidak mengembalikan user/token. Batal update state.");
      return;
    }

    // ✅ Update local storage lewat store
    login({
      data: {
        token,
        user
      }
    });

    console.log("🧠 LOCAL STORAGE AUTH (AFTER UPDATE):", JSON.parse(localStorage.getItem('auth-storage')));

    navigate('/');

  } catch (err) {
    console.error("❌ Error update profile, mengembalikan data lama", err);

    // 🔄 Restore data lama biar tidak logout
    login({
      data: {
        token: oldState.token,
        user: oldState.user
      }
    });
  }
};


  const onSubmitPassword = async (data: any) => {
    FetchAPI(postData('user/change-password', {
      password: data.password,
      oldPassword: data.oldPassword,
    })).then(() => navigate('/'));
  };

  const handleWithdrawSubmit = async () => {
    const amount = parseInt(withdrawAmount);
    const balance = modalBalance;

    if (!amount || amount <= 0) {
      Message.error({ content: 'Masukkan jumlah pencairan yang valid', duration: 3000 });
      return;
    }
    if (amount > balance) {
      Message.error({ content: `Jumlah melebihi saldo (Rp ${balance.toLocaleString('id-ID')})`, duration: 3000 });
      return;
    }
    if (!paymentDestination.trim()) {
      Message.error({ content: 'Tujuan pencairan wajib diisi', duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    FetchAPI(postData('admin/affiliate/withdraw', {
      userId: account.id,
      amount,
      notes: withdrawNotes,
      payload_destination: paymentDestination
    }))
      .then((res) => {
        if (res.status) {
          Message.success({ content: res.message, duration: 3000 });
          setWithdrawVisible(false);
          getData(`admin/affiliate/${account.id}`).then((affRes) => {
            const data = affRes.data || affRes;
            setReferrals(data.referrals || []);
            setTotalWithdrawn(parseInt(data.total_withdrawn || '0', 10));
            setPendingWithdrawals(data.pending_withdrawals || []);
          });
        } else {
          Message.error({ content: res.message, duration: 3000 });
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ [type]: true });
      setTimeout(() => setCopied({ [type]: false }), 2000);
    }).catch(console.error);
  };

  const { TabPanel } = Tabs;

  const referralColumns = [
    { title: 'No', colKey: 'no', width: 50, cell: ({ rowIndex }) => rowIndex + 1 },
    { title: 'Nama User', colKey: 'name', cell: ({ row }) => row.name || '-' },
    { title: 'Email', colKey: 'email', cell: ({ row }) => row.email || '-' },
    { title: 'Tanggal Terdaftar', colKey: 'created_at', cell: ({ row }) => row.created_at ? moment(row.created_at).format('DD/MM/YYYY HH:mm') : '-' },
    { title: 'Jumlah Pembelian', colKey: 'pembelian_count', cell: ({ row }) => row.pembelian_count || 0 },
    { title: 'Total Komisi', colKey: 'total_komisi', cell: ({ row }) => `Rp ${(parseInt(row.total_komisi || '0', 10)).toLocaleString('id-ID')}` },
  ];

  const historyColumns = [
    { title: 'Jumlah', colKey: 'amount_formatted', width: 130, cell: ({ row }) => `Rp ${row.amount_formatted}` },
    {
      title: 'Status',
      colKey: 'status_label',
      width: 110,
      cell: ({ row }) => (
        <Badge
          color={row.status === 'approved' ? 'green' : row.status === 'rejected' ? 'red' : 'yellow'}
        >
          {row.status_label}
        </Badge>
      ),
    },
    { title: 'Tujuan', colKey: 'payload_destination', width: 180, cell: ({ row }) => row.payload_destination || '-' },
    { title: 'Catatan', colKey: 'notes', width: 150, cell: ({ row }) => row.notes || '-' },
    { title: 'Dibuat', colKey: 'created_at_formatted', width: 150 },
    { title: 'Diproses', colKey: 'processed_at_formatted', width: 150 },
  ];

  // Hitung saldo dari referrals (fallback jika API balance gagal)
  const currentBalanceFromReferrals = referrals.reduce((total, r) => total + parseInt(r.total_komisi || '0', 10), 0);
  const balance = modalBalance > 0 ? modalBalance : currentBalanceFromReferrals;
  const balanceFormatted = modalBalanceFormatted !== '0' ? modalBalanceFormatted : currentBalanceFromReferrals.toLocaleString('id-ID');
  const amount = parseInt(withdrawAmount) || 0;
  const isAmountExceedsBalance = amount > balance;
  const isDestinationEmpty = !paymentDestination.trim();

  return (
    <div className="bg-white p-10 rounded-xl shadow-2xl">
      <Tabs value={activeTab} onChange={setActiveTab} placement="top" size="medium">
        {/* === TAB AKUN === */}
        <TabPanel label="Akun" value="akun">
          <Form onSubmit={onSubmitProfil} defaultValues={account}>
            <div className="space-y-4">
              <Input name="name" title="Nama" type="text" validation={{ required: 'Nama harus diisi' }} />
              <Input name="email" title="Email" type="email" disabled validation={{ required: 'Email harus diisi' }} />
              <div className="flex justify-end">
                <Button theme="primary" type="submit">Simpan Perubahan</Button>
              </div>
            </div>
          </Form>
        </TabPanel>

        {/* === TAB PROFIL === */}
        <TabPanel label="Profil" value="profil">
          <Form onSubmit={onSubmitProfil} defaultValues={account}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <input type="file" id="photo" className="hidden" ref={fileInputRef} onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
                    <div className="mt-2 flex items-center gap-x-3">
                      <Avatar image={image ? URL.createObjectURL(image) : imageLink(account?.gambar || '')} shape="circle" size={80} />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Ganti
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <Input name="noWA" title="Telepon" type="text" validation={{ pattern: { value: /^8[0-9]{9,11}$/, message: 'Format nomor telepon tidak sesuai' } }} />
                  </div>
                  <div className="sm:col-span-full">
                    <Input name="alamat" title="Alamat Lengkap" type="text" validation={{ required: 'Alamat wajib diisi' }} />
                  </div>
                  <div className="sm:col-span-2">
                    <Input name="provinsi" title="Provinsi" type="text" validation={{ required: 'Provinsi wajib diisi' }} />
                  </div>

                  <div className="sm:col-span-2">
                    <Input name="kabupaten" title="Kabupaten/Kota" type="text" validation={{ required: 'Kabupaten wajib diisi' }} />
                  </div>

                  <div className="sm:col-span-2">
                    <Input name="kecamatan" title="Kecamatan" type="text" validation={{ required: 'Kecamatan wajib diisi' }} />
                  </div>
                  <div className="sm:col-span-3">
                    <Input name="jurusan" title="Jurusan" type="text" />
                  </div>
                  <div className="sm:col-span-full">
                    <Input name="ttl" title="Tanggal Lahir" type="date" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button theme="primary" type="submit">Simpan Perubahan</Button>
            </div>
          </Form>
        </TabPanel>

        {/* === TAB UBAH PASSWORD === */}
        <TabPanel label="Ubah Password" value="password">
          <Form onSubmit={onSubmitPassword}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input type="password" name="oldPassword" title="Password Sekarang" validation={{ required: 'Password sekarang harus diisi' }} />
                  </div>
                  <div className="sm:col-span-3">
                    <Input type="password" name="password" title="Password Baru" onChange={(e) => setPassword(e.target.value)} validation={{ required: 'Password baru harus diisi', minLength: { value: 8, message: 'Minimal 8 karakter' } }} />
                  </div>
                  <div className="sm:col-span-3">
                    <Input type="password" name="confirm_password" title="Konfirmasi Password Baru" validation={{ required: 'Konfirmasi password harus diisi', validate: (value) => value === password || 'Password tidak cocok' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button theme="primary" type="submit">Simpan Perubahan</Button>
            </div>
          </Form>
        </TabPanel>

        {/* === TAB AFFILIATE === */}
        <TabPanel label="Affiliate" value="affiliate">
          <div className="space-y-6">
            {account?.affiliateCode ? (
              <>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                  <strong>Status Affiliate Aktif!</strong> Anda mendapatkan komisi dari setiap pembelian melalui referral Anda.
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h6 className="font-semibold mb-2"><IconShare size={16} className="inline mr-2" /> Kode Affiliate Anda:</h6>
                  <div className="flex gap-2 mb-3">
                    <code className="bg-gray-100 p-2 rounded flex-1 text-sm">{account.affiliateCode}</code>
                    <Button theme="default" onClick={() => copyToClipboard(account.affiliateCode, 'code')}>
                      {copied.code ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <h6 className="font-semibold mb-2"><IconShare size={16} className="inline mr-2" /> Link Affiliate:</h6>
                  <div className="flex gap-2">
                    <code className="bg-gray-100 p-2 rounded flex-1 text-sm break-all">{account.affiliateLink}</code>
                    <Button theme="primary" onClick={() => copyToClipboard(account.affiliateLink, 'link')}>
                      {copied.link ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <small className="block mt-2 text-blue-600">Bagikan link ini untuk mendapatkan komisi dari referral Anda!</small>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-100 p-4 rounded text-center">
                    <h5>Saldo Komisi Saat Ini</h5>
                    <h3 className="text-[#F97316]">Rp {balanceFormatted}</h3>
                  </div>
                  <div className="bg-blue-100 p-4 rounded text-center">
                    <h5>Total Sudah Dicairkan</h5>
                    <h3 className="text-blue-800">Rp {totalWithdrawn.toLocaleString('id-ID')}</h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button theme="primary" onClick={() => setWithdrawVisible(true)} className="w-full sm:w-auto flex-1 !bg-[#F97316] !border-[#F97316]">
                    Ajukan Pencairan Komisi
                  </Button>
                  <Button theme="default" onClick={() => setHistoryVisible(true)} className="w-full sm:w-auto flex-1">
                    Riwayat Pencairan
                  </Button>
                </div>

                {referrals.length > 0 ? (
                  <div>
                    <h6 className="font-semibold mb-3">Daftar Referral Anda</h6>
                    <Table data={referrals} columns={referralColumns} pagination={{ pageSize: 10 }} rowKey="id" bordered stripe />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center">
                    Belum ada user yang menggunakan affiliate Anda.
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 rounded text-center text-gray-500">
                Anda belum memiliki kode affiliate.
              </div>
            )}
          </div>
        </TabPanel>
      </Tabs>

      {/* === MODAL WITHDRAW === */}
      <Modal visible={withdrawVisible} onClose={() => setWithdrawVisible(false)} title={<div className="text-lg font-semibold">Ajukan Pencairan Komisi</div>}>
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 text-[#F97316] p-3 rounded-md text-sm">
            Saldo tersedia: <strong>Rp {balanceFormatted}</strong>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 block">
              <IconBuildingBank size={16} /> Tujuan Pencairan <span className="text-red-500">*</span>
            </label>
            <TInput
              value={paymentDestination}
              placeholder="BCA: 123456789 - Budi / Dana 08xxxx"
              onChange={setPaymentDestination}
              className="w-full"
              style={{ minHeight: '40px' }}
              status={isDestinationEmpty ? 'error' : undefined}
            />
            {isDestinationEmpty && <p className="text-xs text-red-600 mt-1">Tujuan pencairan wajib diisi</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 block">
              <IconBuildingBank size={16} /> Jumlah (Rp) <span className="text-red-500">*</span>
            </label>
            <TInput
              type="number"
              value={withdrawAmount}
              onChange={setWithdrawAmount}
              step={1000}
              className="w-full"
              style={{ minHeight: '40px' }}
              status={isAmountExceedsBalance ? 'error' : undefined}
            />
            {isAmountExceedsBalance && <p className="text-xs text-red-600 mt-1">Jumlah melebihi saldo</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 block">
              <IconNote size={16} /> Catatan
            </label>
            <TInput
              value={withdrawNotes}
              onChange={setWithdrawNotes}
              mode="textarea"
              rows={3}
              placeholder="Opsional"
              className="w-full"
              style={{ minHeight: '100px' }}
            />
          </div>

          {pendingWithdrawals.length > 0 && (
            <div className="bg-yellow-50 border text-yellow-800 border-yellow-200 text-sm p-3 rounded-md">
              Anda punya pencairan pending, tunggu selesai dulu.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={() => setWithdrawVisible(false)}>Batal</Button>
          <Button
            theme="primary"
            className="!bg-[#F97316] !border-[#F97316]"
            loading={isSubmitting}
            disabled={pendingWithdrawals.length > 0 || isAmountExceedsBalance || !withdrawAmount || isDestinationEmpty || isSubmitting}
            onClick={handleWithdrawSubmit}
          >
            Kirim Permintaan
          </Button>
        </div>
      </Modal>

      {/* === MODAL HISTORY === */}
      <Modal visible={historyVisible} onClose={() => setHistoryVisible(false)} title={<div className="text-lg font-semibold">Riwayat Pencairan Komisi</div>}>
        <div className="space-y-4">
          
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-md text-center">
              <h5 className="text-sm text-[#F97316]">Total Disetujui</h5>
              <h3 className="text-lg font-semibold text-[#F97316]">Rp {summary.total_approved_formatted}</h3>
            </div>

          {withdrawHistory.length > 0 ? (
            <Table data={withdrawHistory} columns={historyColumns} pagination={{ pageSize: 10 }} rowKey="id" bordered stripe />
          ) : (
            <div className="text-center py-8 text-gray-500">Belum ada riwayat pencairan.</div>
          )}
        </div>
      </Modal>
    </div>
  );
}