import { TabItem } from "../components/Tabs";
import { FilterState } from "../types";
import { FaList, FaClock, FaCalendarAlt, FaTruck, FaFlag } from "react-icons/fa";

export const TABS: TabItem[] = [
  { label: "Semua DO", icon: FaList, value: 0, count: 0 },
  { label: "Sedang Dijadwalkan", icon: FaClock, value: 1, count: 0 },
  { label: "Terjadwal", icon: FaCalendarAlt, value: 2, count: 0 },
  { label: "Dalam Pengiriman", icon: FaTruck, value: 3, count: 0 },
  { label: "Tiba di Muat", icon: FaFlag, value: 4, count: 0 },
];

export const INITIAL_FILTER: FilterState = {
  order_status: [0],
  origin_code: [],
  destination_code: []
};

export const originOptions = [
  { label: "Bandung", value: "BDG" },
  { label: "Jakarta", value: "JKT" },
  { label: "Surabaya", value: "SBY" },
  { label: "Denpasar", value: "DPS" },
  { label: "Malang", value: "MLG" },
];

export const destinationOptions = [
  { label: "Medan", value: "MDN" },
  { label: "Banjar Masin", value: "BJM" },
  { label: "Pekan Baru", value: "PKU" },
  { label: "Palembang", value: "PLB" },
  { label: "Balik Papan", value: "BPN" },
];
