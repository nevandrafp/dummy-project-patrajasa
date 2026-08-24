import React, { useState, useMemo } from "react";
import {
  Home, GitBranch, Store, AlertTriangle, MessageCircle, Settings,
  Menu, Bell, ChevronDown, MapPin, Navigation, LayoutGrid,
  ClipboardList, Map as MapIcon, Database, TrendingUp, TrendingDown,
  Users, UserPlus, Receipt, Wallet, ExternalLink
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ---------------------------------- Design tokens ---------------------------------- */
const NAVY = "#0B1B45";
const NAVY_DEEP = "#071230";
const GOLD_FROM = "#FCC94A";
const GOLD_TO = "#F5941E";
const BG = "#F2F4F9";

const STATUS_STYLES = {
  Active: { bg: "#DCFCE7", text: "#15803D" },
  Pending: { bg: "#FEF9C3", text: "#A16207" },
  Inactive: { bg: "#FEE2E2", text: "#B91C1C" },
  "Belum Didatangi": { bg: "#FEE2E2", text: "#B91C1C" },
  "Dalam Proses": { bg: "#FEF9C3", text: "#A16207" },
  Selesai: { bg: "#DCFCE7", text: "#15803D" },
};

const PRIORITY_STYLES = {
  Tinggi: { bg: "#FEE2E2", text: "#B91C1C" },
  Sedang: { bg: "#FEF9C3", text: "#A16207" },
  Rendah: { bg: "#DCFCE7", text: "#15803D" },
};

/* ---------------------------------- Mock data ---------------------------------- */
const kpiDashboard = [
  { icon: Home, label: "Merchant Aktif", value: "654", delta: "+7% dari bulan lalu", up: true },
  { icon: UserPlus, label: "Merchant Baru", value: "45", delta: "+6% dari bulan lalu", up: true },
  { icon: AlertTriangle, label: "Perlu Perhatian", value: "20", delta: "+3 dari bulan lalu", up: false },
  { icon: MessageCircle, label: "Keluhan Aktif", value: "12", delta: "-2 dari bulan lalu", up: true },
  { icon: Receipt, label: "Total Transaksi", value: "674", delta: "-5% dari bulan lalu", up: false },
  { icon: Wallet, label: "Revenue", value: "Rp 243 M", delta: "+2% dari bulan lalu", up: true },
];

const keluhanTrend = [
  { bulan: "Jan", jumlah: 10 }, { bulan: "Feb", jumlah: 5 }, { bulan: "Mar", jumlah: 3 },
  { bulan: "Apr", jumlah: 7 }, { bulan: "May", jumlah: 12 }, { bulan: "Jun", jumlah: 11 },
  { bulan: "Jul", jumlah: 6 }, { bulan: "Aug", jumlah: 3 }, { bulan: "Sep", jumlah: 2 },
  { bulan: "Oct", jumlah: 4 }, { bulan: "Nov", jumlah: 7 }, { bulan: "Dec", jumlah: 5 },
];

const levelMerchant = [
  { name: "Level 1", value: 30, color: "#DC2626" },
  { name: "Level 2", value: 55, color: "#F5941E" },
  { name: "Level 3", value: 80, color: "#FACC15" },
  { name: "Level 4", value: 170, color: "#86EFAC" },
  { name: "Level 5", value: 319, color: "#16A34A" },
];

const merchantTable = [
  { name: "Meo Store", lokasi: "Jakarta", cabang: "KCP Patrajasa", status: "Active", pendapatan: "Rp 12M", transaksi: 154, terakhir: "2026-04-24" },
  { name: "Sophia Shop", lokasi: "Jakarta", cabang: "KCP Telkom Landmark Tower", status: "Pending", pendapatan: "Rp 10M", transaksi: 123, terakhir: "2026-04-23" },
  { name: "Harrison Market", lokasi: "Jakarta", cabang: "KCP Sopo Del Tower", status: "Active", pendapatan: "Rp 5.3M", transaksi: 100, terakhir: "2026-04-19" },
  { name: "Bennett Retail", lokasi: "Jakarta", cabang: "KCP Warung Buncit Raya", status: "Inactive", pendapatan: "Rp 2M", transaksi: 97, terakhir: "2026-03-23" },
];

const kpiPipeline = [
  { icon: LayoutGrid, label: "Total Wilayah Target", value: "182", sub: "RT/RW dalam pipeline" },
  { icon: AlertTriangle, label: "Belum Didatangi", value: "64", sub: "menunggu kunjungan" },
  { icon: ClipboardList, label: "Dalam Proses", value: "38", sub: "sedang dijadwalkan" },
  { icon: TrendingUp, label: "Selesai", value: "80", sub: "sudah dikunjungi" },
];

const wilayahTree = {
  "DKI Jakarta": {
    "Jakarta Selatan": {
      "Mampang": { "Kel. Bangka": ["RT 02/RW 01", "RT 03/RW 01"] },
      "Cilandak": { "Kel. Cipete Selatan": ["RT 05/RW 03", "RT 01/RW 02"] },
      "Pancoran": { "Kel. Duren Tiga": ["RT 01/RW 04", "RT 06/RW 02"] },
    },
  },
};

const pipelineRows = [
  {
    wilayah: "DKI Jakarta → Jaksel → Mampang → RT 02/RW 01",
    prov: "DKI Jakarta", kota: "Jakarta Selatan", kec: "Mampang",
    merchant: "Meo Store", status: "Belum Didatangi", prioritas: "Tinggi",
    terakhir: "-", lat: 20, lng: 22,
  },
  {
    wilayah: "DKI Jakarta → Jaksel → Cilandak → RT 05/RW 03",
    prov: "DKI Jakarta", kota: "Jakarta Selatan", kec: "Cilandak",
    merchant: "Sophia Shop", status: "Dalam Proses", prioritas: "Sedang",
    terakhir: "2026-04-23", lat: 48, lng: 55,
  },
  {
    wilayah: "DKI Jakarta → Jaksel → Pancoran → RT 01/RW 04",
    prov: "DKI Jakarta", kota: "Jakarta Selatan", kec: "Pancoran",
    merchant: "Bennett Retail", status: "Selesai", prioritas: "Rendah",
    terakhir: "2026-03-23", lat: 72, lng: 30,
  },
  {
    wilayah: "DKI Jakarta → Jaksel → Mampang → RT 03/RW 01",
    prov: "DKI Jakarta", kota: "Jakarta Selatan", kec: "Mampang",
    merchant: "Harrison Market", status: "Dalam Proses", prioritas: "Sedang",
    terakhir: "2026-04-19", lat: 30, lng: 65,
  },
];

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "pipeline", label: "Pipeline Area", icon: GitBranch },
  { key: "merchant", label: "Merchant", icon: Store },
  { key: "perhatian", label: "Perlu Perhatian", icon: AlertTriangle },
  { key: "keluhan", label: "Keluhan", icon: MessageCircle },
  { key: "setting", label: "Setting", icon: Settings },
];

/* ---------------------------------- Small components ---------------------------------- */
function KpiCard({ icon: Icon, label, value, delta, up }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 2px rgba(15,23,42,0.06)", flex: "1 1 150px", minWidth: 150 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#5B6478", fontSize: 13, marginBottom: 10 }}>
        <Icon size={16} strokeWidth={2} />
        <span>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#101828", marginBottom: 6 }}>{value}</div>
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: up ? "#16A34A" : "#DC2626", fontWeight: 500 }}>
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}

function StatusPill({ label }) {
  const s = STATUS_STYLES[label] || { bg: "#E5E7EB", text: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.text, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
      {label}
    </span>
  );
}

function PriorityPill({ label }) {
  const s = PRIORITY_STYLES[label] || { bg: "#E5E7EB", text: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.text, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
      {label}
    </span>
  );
}

function Card({ title, icon: Icon, children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 22, boxShadow: "0 1px 2px rgba(15,23,42,0.06)", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#101828", marginBottom: 16 }}>
          {Icon && <Icon size={17} />}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------------------------- Dashboard page ---------------------------------- */
function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {kpiDashboard.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <Card title="Jumlah Keluhan">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={keluhanTrend} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F5" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#8A93A6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8A93A6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="jumlah" stroke={NAVY} strokeWidth={2.5} dot={{ r: 4, fill: NAVY }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Level Merchant">
          <div style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={levelMerchant} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={2}>
                  {levelMerchant.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#8A93A6" }}>Total</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#101828" }}>654</div>
              <div style={{ fontSize: 12, color: "#8A93A6" }}>Merchant</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 10 }}>
            {levelMerchant.map((e) => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475467" }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: e.color, display: "inline-block" }} />
                {e.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Daftar Merchant">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#8A93A6", fontSize: 12, textTransform: "uppercase" }}>
                <th style={{ padding: "10px 8px" }}>Merchant</th>
                <th style={{ padding: "10px 8px" }}>Lokasi</th>
                <th style={{ padding: "10px 8px" }}>Cabang</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Pendapatan</th>
                <th style={{ padding: "10px 8px" }}>Transaksi</th>
                <th style={{ padding: "10px 8px" }}>Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody>
              {merchantTable.map((m) => (
                <tr key={m.name} style={{ borderTop: "1px solid #F0F2F6" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 600, color: "#101828" }}>{m.name}</td>
                  <td style={{ padding: "12px 8px", color: "#475467" }}>{m.lokasi}</td>
                  <td style={{ padding: "12px 8px", color: "#475467" }}>{m.cabang}</td>
                  <td style={{ padding: "12px 8px" }}><StatusPill label={m.status} /></td>
                  <td style={{ padding: "12px 8px", color: "#475467" }}>{m.pendapatan}</td>
                  <td style={{ padding: "12px 8px", color: "#475467" }}>{m.transaksi}</td>
                  <td style={{ padding: "12px 8px", color: "#475467" }}>{m.terakhir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------- Pipeline Area page ---------------------------------- */
function CascadingFilter({ filters, setFilters }) {
  const provList = Object.keys(wilayahTree);
  const kotaList = filters.prov ? Object.keys(wilayahTree[filters.prov] || {}) : [];
  const kecList = filters.kota ? Object.keys(wilayahTree[filters.prov]?.[filters.kota] || {}) : [];
  const kelList = filters.kec ? Object.keys(wilayahTree[filters.prov]?.[filters.kota]?.[filters.kec] || {}) : [];
  const rtList = filters.kel ? (wilayahTree[filters.prov]?.[filters.kota]?.[filters.kec]?.[filters.kel] || []) : [];

  const selectStyle = { padding: "9px 12px", borderRadius: 10, border: "1px solid #E3E6EE", fontSize: 13, color: "#344054", background: "#fff", minWidth: 150 };

  const update = (level, value) => {
    const next = { ...filters, [level]: value };
    const order = ["prov", "kota", "kec", "kel", "rt"];
    const idx = order.indexOf(level);
    order.slice(idx + 1).forEach((l) => (next[l] = ""));
    setFilters(next);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <select style={selectStyle} value={filters.prov} onChange={(e) => update("prov", e.target.value)}>
        <option value="">Provinsi</option>
        {provList.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select style={selectStyle} value={filters.kota} onChange={(e) => update("kota", e.target.value)} disabled={!filters.prov}>
        <option value="">Kabupaten/Kota</option>
        {kotaList.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select style={selectStyle} value={filters.kec} onChange={(e) => update("kec", e.target.value)} disabled={!filters.kota}>
        <option value="">Kecamatan</option>
        {kecList.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select style={selectStyle} value={filters.kel} onChange={(e) => update("kel", e.target.value)} disabled={!filters.kec}>
        <option value="">Kelurahan</option>
        {kelList.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select style={selectStyle} value={filters.rt} onChange={(e) => update("rt", e.target.value)} disabled={!filters.kel}>
        <option value="">RT/RW</option>
        {rtList.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}

function MapView({ rows, selected, setSelected }) {
  const statusColor = { "Belum Didatangi": "#DC2626", "Dalam Proses": "#EAB308", Selesai: "#16A34A" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div style={{ position: "relative", background: "#EAF0F6", borderRadius: 12, height: 340, overflow: "hidden", border: "1px solid #E3E6EE" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[10, 25, 40, 55, 70, 85].map((v) => (
            <line key={"h" + v} x1="0" y1={v} x2="100" y2={v} stroke="#D8E1EC" strokeWidth="0.5" />
          ))}
          {[10, 25, 40, 55, 70, 85].map((v) => (
            <line key={"v" + v} x1={v} y1="0" x2={v} y2="100" stroke="#D8E1EC" strokeWidth="0.5" />
          ))}
        </svg>
        {rows.map((r) => (
          <button
            key={r.wilayah}
            onClick={() => setSelected(r)}
            title={r.merchant}
            style={{
              position: "absolute", left: `${r.lng}%`, top: `${r.lat}%`, transform: "translate(-50%,-100%)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <MapPin size={selected?.wilayah === r.wilayah ? 34 : 26} color={statusColor[r.status]} fill={statusColor[r.status]} fillOpacity={0.18} strokeWidth={2} />
          </button>
        ))}
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "#fff", borderRadius: 8, padding: "8px 12px", display: "flex", gap: 12, fontSize: 11, color: "#475467", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#DC2626", display: "inline-block" }} />Belum</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#EAB308", display: "inline-block" }} />Proses</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#16A34A", display: "inline-block" }} />Selesai</span>
        </div>
      </div>

      <div style={{ background: "#F8F9FC", borderRadius: 12, padding: 18, border: "1px solid #EEF0F5" }}>
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#101828" }}>{selected.merchant}</div>
            <div style={{ fontSize: 12.5, color: "#667085", lineHeight: 1.6 }}>{selected.wilayah}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <StatusPill label={selected.status} />
              <PriorityPill label={selected.prioritas} />
            </div>
            <div style={{ fontSize: 12.5, color: "#667085" }}>Terakhir dikunjungi: {selected.terakhir}</div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.merchant + " " + selected.wilayah)}`}
              target="_blank" rel="noreferrer"
              style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: NAVY, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 14px", borderRadius: 9, textDecoration: "none", width: "fit-content" }}
            >
              <Navigation size={14} /> Petunjuk Arah
            </a>
          </div>
        ) : (
          <div style={{ color: "#98A2B3", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
            <MapIcon size={26} />
            Klik pin pada peta untuk melihat detail merchant
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineAreaPage() {
  const [tab, setTab] = useState("pipeline");
  const [filters, setFilters] = useState({ prov: "", kota: "", kec: "", kel: "", rt: "" });
  const [selected, setSelected] = useState(pipelineRows[0]);

  const filteredRows = useMemo(() => {
    return pipelineRows.filter((r) => {
      if (filters.prov && r.prov !== filters.prov) return false;
      if (filters.kota && r.kota !== filters.kota) return false;
      if (filters.kec && r.kec !== filters.kec) return false;
      return true;
    });
  }, [filters]);

  const subTabs = [
    { key: "overview", label: "Ringkasan Pemetaan", icon: LayoutGrid },
    { key: "pipeline", label: "Rencana Kunjungan", icon: ClipboardList },
    { key: "map", label: "Peta Distribusi", icon: MapIcon },
    { key: "master", label: "Master Data Wilayah", icon: Database },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {kpiPipeline.map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 2px rgba(15,23,42,0.06)", flex: "1 1 180px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#5B6478", fontSize: 13, marginBottom: 10 }}>
              <k.icon size={16} /><span>{k.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#101828", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#8A93A6" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid #E3E6EE" }}>
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13.5, fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: tab === t.key ? NAVY : "#8A93A6",
              borderBottom: tab === t.key ? `2px solid ${GOLD_TO}` : "2px solid transparent",
            }}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Card title="Ringkasan Pemetaan Wilayah">
          <p style={{ fontSize: 13.5, color: "#667085", lineHeight: 1.7, margin: 0 }}>
            Total 182 titik RT/RW telah masuk ke pipeline area KCP Patrajasa. Saat ini 80 titik telah selesai dikunjungi,
            38 titik dalam proses penjadwalan, dan 64 titik masih menunggu kunjungan tim lapangan. Gunakan tab
            "Rencana Kunjungan" untuk detail per lokasi atau "Peta Distribusi" untuk melihat sebaran secara visual.
          </p>
        </Card>
      )}

      {tab === "pipeline" && (
        <Card title="Filter Wilayah">
          <CascadingFilter filters={filters} setFilters={setFilters} />
          <div style={{ overflowX: "auto", marginTop: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#8A93A6", fontSize: 12, textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 8px" }}>Wilayah</th>
                  <th style={{ padding: "10px 8px" }}>Merchant / Target</th>
                  <th style={{ padding: "10px 8px" }}>Status</th>
                  <th style={{ padding: "10px 8px" }}>Prioritas</th>
                  <th style={{ padding: "10px 8px" }}>Terakhir Dikunjungi</th>
                  <th style={{ padding: "10px 8px" }}>Navigasi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.wilayah} style={{ borderTop: "1px solid #F0F2F6" }}>
                    <td style={{ padding: "12px 8px", color: "#475467", maxWidth: 260 }}>{r.wilayah}</td>
                    <td style={{ padding: "12px 8px", fontWeight: 600, color: "#101828" }}>{r.merchant}</td>
                    <td style={{ padding: "12px 8px" }}><StatusPill label={r.status} /></td>
                    <td style={{ padding: "12px 8px" }}><PriorityPill label={r.prioritas} /></td>
                    <td style={{ padding: "12px 8px", color: "#475467" }}>{r.terakhir}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.merchant + " " + r.wilayah)}`}
                        target="_blank" rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: NAVY, fontWeight: 600, textDecoration: "none" }}
                      >
                        Buka Google Maps <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#98A2B3" }}>Tidak ada data untuk filter ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "map" && (
        <Card title="Peta Distribusi Wilayah">
          <MapView rows={filteredRows.length ? filteredRows : pipelineRows} selected={selected} setSelected={setSelected} />
        </Card>
      )}

      {tab === "master" && (
        <Card title="Master Data Wilayah">
          <p style={{ fontSize: 13.5, color: "#667085", marginBottom: 14 }}>
            Struktur hierarki wilayah dari Provinsi hingga RT/RW yang menjadi acuan pipeline.
          </p>
          <div style={{ fontSize: 13.5, color: "#344054", lineHeight: 2 }}>
            {Object.entries(wilayahTree).map(([prov, kotaObj]) => (
              <div key={prov}>
                <strong>{prov}</strong>
                {Object.entries(kotaObj).map(([kota, kecObj]) => (
                  <div key={kota} style={{ marginLeft: 16 }}>
                    {kota}
                    {Object.entries(kecObj).map(([kec, kelObj]) => (
                      <div key={kec} style={{ marginLeft: 16 }}>
                        {kec}
                        {Object.entries(kelObj).map(([kel, rts]) => (
                          <div key={kel} style={{ marginLeft: 16, color: "#667085" }}>
                            {kel} — {rts.join(", ")}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------------------------------- Placeholder page ---------------------------------- */
function PlaceholderPage({ label, icon: Icon }) {
  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", color: "#98A2B3", gap: 10 }}>
        <Icon size={30} />
        <div style={{ fontSize: 15, fontWeight: 600, color: "#475467" }}>Menu {label}</div>
        <div style={{ fontSize: 13, textAlign: "center", maxWidth: 340 }}>
          Halaman ini akan dikembangkan pada tahap berikutnya sesuai kebutuhan operasional KCP.
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------- App shell ---------------------------------- */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeMeta = menuItems.find((m) => m.key === active);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 250 : 0, transition: "width 0.2s ease", overflow: "hidden",
        background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, color: "#fff", flexShrink: 0,
      }}>
        <div style={{ padding: "26px 24px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="26" height="18" viewBox="0 0 26 18">
              <path d="M0 14 L6 4 L11 12 L15 3 L21 14 L26 6" stroke="url(#g)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="26" y2="0">
                  <stop offset="0%" stopColor={GOLD_FROM} /><stop offset="100%" stopColor={GOLD_TO} />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.2 }}>mandiri</span>
          </div>
          <span style={{ fontSize: 12, color: "#AEB6D6" }}>Merchant Care & Grow</span>
        </div>

        <nav style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
          {menuItems.map((m) => {
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10,
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  border: "none", color: isActive ? "#fff" : "#B7BEDB", cursor: "pointer",
                  fontSize: 14, fontWeight: isActive ? 600 : 500, textAlign: "left",
                }}
              >
                <m.icon size={17} />
                {m.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EEF0F5" }}>
          <button onClick={() => setSidebarOpen((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475467" }}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 13.5, color: "#475467" }}>Hi, Admin! <span style={{ color: "#D0D5DD" }}>|</span> KCP Patrajasa</span>
            <Bell size={18} color="#667085" />
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>A</div>
          </div>
        </div>

        <div style={{ padding: 28, flex: 1 }}>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#101828", margin: 0 }}>{activeMeta.label}</h1>
          </div>

          {active === "dashboard" && <DashboardPage />}
          {active === "pipeline" && <PipelineAreaPage />}
          {active === "merchant" && <PlaceholderPage label="Merchant" icon={Store} />}
          {active === "perhatian" && <PlaceholderPage label="Perlu Perhatian" icon={AlertTriangle} />}
          {active === "keluhan" && <PlaceholderPage label="Keluhan" icon={MessageCircle} />}
          {active === "setting" && <PlaceholderPage label="Setting" icon={Settings} />}
        </div>
      </div>
    </div>
  );
}
