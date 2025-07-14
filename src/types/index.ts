
export interface Negara {
  id_negara: number;
  nama_negara: string;
}

export interface Pelabuhan {
  id_pelabuhan: number;
  nama_pelabuhan: string;
}

export interface Barang {
  id_barang: number;
  nama_barang: string;
  description?: string;
  diskon?: number;
  harga?: number;
}
