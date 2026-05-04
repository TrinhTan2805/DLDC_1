import React, { useState } from 'react';
import { Save, Plus, Trash2, Code } from 'lucide-react';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface PacketDesignTabProps {
  service: ProvisionService;
}

export function PacketDesignTab({ service }: PacketDesignTabProps) {
  const [format, setFormat] = useState('json');
  const [tables, setTables] = useState([
    { id: 1, name: 'tbl_hop_dong_bao_dam', alias: 't1', type: 'MAIN', join: '' },
    { id: 2, name: 'tbl_ben_bao_dam', alias: 't2', type: 'LEFT JOIN', join: 't1.id = t2.hop_dong_id' }
  ]);
  const [fields, setFields] = useState([
    { id: 1, name: 'ma_hop_dong', type: 'string', source: 't1.ma_hop_dong', description: 'Mã hợp đồng' },
    { id: 2, name: 'ten_ben_bao_dam', type: 'string', source: 't2.ten_ben', description: 'Tên bên bảo đảm' },
    { id: 3, name: 'thoi_gian', type: 'datetime', source: 't1.ngay_ky', description: 'Ngày ký kết' }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-4">Thông tin cấu hình</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Định dạng dữ liệu</label>
            <select 
              aria-label="Định dạng dữ liệu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức phân phối</label>
            <select aria-label="Phương thức phân phối" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="api">API / Web Service</option>
              <option value="file">File chia sẻ (FTP/SFTP)</option>
              <option value="kafka">Message Queue (Kafka)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-slate-800">Nguồn dữ liệu & Liên kết (Data Sources & Joins)</h4>
          <button className="flex items-center text-sm text-blue-600 font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Thêm bảng
          </button>
        </div>
        
        <table className="w-full text-left text-sm mb-2">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 rounded-l-lg font-medium w-48">Tên bảng</th>
              <th className="px-4 py-2 font-medium w-24">Bí danh</th>
              <th className="px-4 py-2 font-medium w-32">Kiểu kết nối</th>
              <th className="px-4 py-2 font-medium">Điều kiện kết nối (Join condition)</th>
              <th className="px-4 py-2 rounded-r-lg font-medium w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tables.map((table, idx) => (
              <tr key={table.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input aria-label="Tên bảng" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-800 font-mono text-xs" defaultValue={table.name} />
                </td>
                <td className="px-4 py-3">
                  <input aria-label="Bí danh" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded font-mono text-xs text-center" defaultValue={table.alias} />
                </td>
                <td className="px-4 py-3">
                  {idx === 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">BẢNG CHÍNH</span>
                  ) : (
                    <select aria-label="Kiểu kết nối" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" defaultValue={table.type}>
                      <option>INNER JOIN</option>
                      <option>LEFT JOIN</option>
                      <option>RIGHT JOIN</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3">
                    <input 
                      aria-label="Điều kiện kết nối"
                      type="text" 
                      className="w-full px-2 py-1.5 border border-slate-200 rounded font-mono text-xs" 
                    defaultValue={table.join} 
                    placeholder={idx === 0 ? "Không có" : "Ví dụ: t1.id = t2.ref_id"} 
                    disabled={idx === 0}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {idx !== 0 && <button aria-label="Xóa bảng" className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 italic mt-2">* Khi cấu hình nhiều bảng, hệ thống sẽ tự động tổng hợp dữ liệu thành một gói tin thống nhất.</p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-slate-800">Cấu trúc các trường dữ liệu (Fields)</h4>
          <button className="flex items-center text-sm text-amber-600 font-medium hover:text-amber-700">
            <Plus className="w-4 h-4 mr-1" /> Thêm trường
          </button>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 rounded-l-lg font-medium w-48">Tên trường đích</th>
              <th className="px-4 py-2 font-medium w-32">Kiểu dữ liệu</th>
              <th className="px-4 py-2 font-medium w-48">Ánh xạ nguồn (Source)</th>
              <th className="px-4 py-2 font-medium">Mô tả</th>
              <th className="px-4 py-2 rounded-r-lg font-medium w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.map(field => (
              <tr key={field.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><input aria-label="Tên trường đích" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded" defaultValue={field.name} /></td>
                <td className="px-4 py-3">
                  <select aria-label="Kiểu dữ liệu" className="w-full px-2 py-1.5 border border-slate-200 rounded" defaultValue={field.type}>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="datetime">DateTime</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input aria-label="Ánh xạ nguồn" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded font-mono text-xs text-blue-600" defaultValue={field.source} placeholder="t1.column" />
                </td>
                <td className="px-4 py-3"><input aria-label="Mô tả trường" type="text" className="w-full px-2 py-1.5 border border-slate-200 rounded" defaultValue={field.description} /></td>
                <td className="px-4 py-3 text-center">
                  <button aria-label="Xóa trường" className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-4 flex items-center">
          <Code className="w-4 h-4 mr-2 text-slate-500" />
          Cấu trúc mẫu (Preview)
        </h4>
        <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
{format === 'json' ? 
`{
  "ma_hop_dong": "HD-2026-0001",
  "ten_ben_bao_dam": "Công ty TNHH MTV ABC",
  "thoi_gian": "2026-05-04T10:00:00Z"
}` : 
`<data>
  <ma_hop_dong>HD-2026-0001</ma_hop_dong>
  <ten_ben_bao_dam>Công ty TNHH MTV ABC</ten_ben_bao_dam>
  <thoi_gian>2026-05-04T10:00:00Z</thoi_gian>
</data>`
}
        </pre>
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center font-medium">
          <Save className="w-4 h-4 mr-2" />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}
