import React, { useMemo, useState } from 'react';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import axios from 'axios';
import { Barang, Negara, Pelabuhan } from "./types";

const API_BASE = 'http://202.157.176.100:3001';

const fetchData = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);


function AutoForm(): React.ReactElement {
  const [selectedNegara, setSelectedNegara] = useState('');
  const [selectedPelabuhan, setSelectedPelabuhan] = useState('');
  const [selectedBarang, setSelectedBarang] = useState('');
  const [customDiscount, setCustomDiscount] = useState<number | undefined>(undefined);
  const [customHarga, setCustomHarga] = useState<number | undefined>(undefined);

  const queryClient = useQueryClient();

  const { data: negaraList = [] } = useQuery<Negara[]>({
    queryKey: ['negaras'],
    queryFn: () => fetchData(`${API_BASE}/negaras`),
  });

  const { data: pelabuhanList = [] } = useQuery<Pelabuhan[]>({
    queryKey: ['pelabuhans', selectedNegara],
    queryFn: () => fetchData(`${API_BASE}/pelabuhans?filter={"where":{"id_negara":${selectedNegara}}}`),
    enabled: !!selectedNegara,
  });

  const { data: barangList = [] } = useQuery<Barang[]>({
    queryKey: ['barangs', selectedPelabuhan],
    queryFn: () => fetchData(`${API_BASE}/barangs?filter={"where":{"id_pelabuhan":${selectedPelabuhan}}}`),
    enabled: !!selectedPelabuhan,
  });

  const selected = useMemo(
    () => barangList.find((b) => b.id_barang === Number(selectedBarang)),
    [barangList, selectedBarang]
  );

  const description = selected?.description ?? '';
  const discount = customDiscount ?? selected?.diskon ?? 0;
  const harga = customHarga ?? selected?.harga ?? 0;
  const total = useMemo(() => harga * (discount / 100), [harga, discount]);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center">Form Barang</h2>

      <div className="flex flex-col">
        <label htmlFor="negara" className="mb-1 text-sm font-medium">NEGARA</label>
        <select
          id="negara"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          value={selectedNegara}
          onChange={(e) => {
            setSelectedNegara(e.target.value);
            setSelectedPelabuhan('');
            setSelectedBarang('');
            setCustomDiscount(undefined);
            setCustomHarga(undefined);
            queryClient.invalidateQueries({ queryKey: ['pelabuhans'] });
            queryClient.invalidateQueries({ queryKey: ['barangs'] });
          }}
        >
          <option value="">Pilih Negara</option>
          {negaraList.map((n) => (
            <option key={n.id_negara} value={n.id_negara}>{`${n.id_negara} - ${n.nama_negara}`}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="pelabuhan" className="mb-1 text-sm font-medium">PELABUHAN</label>
        <select
          id="pelabuhan"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          value={selectedPelabuhan}
          onChange={(e) => {
            setSelectedPelabuhan(e.target.value);
            setSelectedBarang('');
            setCustomDiscount(undefined);
            setCustomHarga(undefined);
            queryClient.invalidateQueries({ queryKey: ['barangs'] });
          }}
          disabled={!pelabuhanList.length}
        >
          <option value="">Pilih Pelabuhan</option>
          {pelabuhanList.map((p) => (
            <option key={p.id_pelabuhan} value={p.id_pelabuhan}>{p.nama_pelabuhan}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="barang" className="mb-1 text-sm font-medium">BARANG</label>
        <select
          id="barang"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          value={selectedBarang}
          onChange={(e) => {
            setSelectedBarang(e.target.value);
            setCustomDiscount(undefined);
            setCustomHarga(undefined);
          }}
          disabled={!barangList.length}
        >
          <option value="">Pilih Barang</option>
          {barangList.map((b) => (
            <option key={b.id_barang} value={b.id_barang}>{`${b.id_barang} - ${b.nama_barang}`}</option>
          ))}
        </select>
        <textarea
          className="w-full mt-2 p-2 rounded bg-gray-800 border border-gray-700"
          rows={3}
          value={description}
          readOnly
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="discount" className="text-sm">DISCOUNT</label>
          <input
            id="discount"
            type="number"
            className="w-full p-2 mt-1 rounded bg-gray-800 border border-gray-700"
            value={discount}
            onChange={(e) => setCustomDiscount(Number(e.target.value))}
            disabled={!selected}
          />
        </div>

        <div>
          <label htmlFor="harga" className="text-sm">HARGA</label>
          <input
            id="harga"
            type="number"
            className="w-full p-2 mt-1 rounded bg-gray-800 border border-gray-700"
            value={harga}
            onChange={(e) => setCustomHarga(Number(e.target.value))}
            disabled={!selected}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="total" className="text-sm">TOTAL</label>
        <input
          id="total"
          type="text"
          className="w-full p-2 mt-1 rounded bg-gray-800 border border-gray-700 text-green-400 font-semibold"
          value={formatCurrency(total)}
          readOnly
        />
      </div>
    </div>
  );
}

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <QueryClientProvider client={queryClient}>
        <AutoForm />
      </QueryClientProvider>
    </div>
  );
}

export default App;
