import React, { useState } from 'react';
import { Save, Plus, Trash2, Code, Database } from 'lucide-react';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface PacketDesignTabProps {
  service: ProvisionService;
}

// Mock Database Schema for dropdowns
const mockSchema: Record<string, string[]> = {
  'tbl_hop_dong_bao_dam': ['id', 'ma_hop_dong', 'ngay_ky', 'gia_tri', 'trang_thai', 'loai_tai_san'],
  'tbl_ben_bao_dam': ['id', 'hop_dong_id', 'ten_ben', 'loai_hinh', 'dia_chi', 'cccd', 'so_dien_thoai'],
  'tbl_tai_san_bao_dam': ['id', 'hop_dong_id', 'ten_tai_san', 'so_khung', 'so_may', 'bien_so'],
  'tbl_can_bo_xu_ly': ['id', 'ma_can_bo', 'ho_ten', 'phong_ban']
};
const tableNames = Object.keys(mockSchema);

export function PacketDesignTab({ service }: PacketDesignTabProps) {
  const [format, setFormat] = useState('json');
  
  // Update state to handle visual join parts
  const [tables, setTables] = useState([
    { id: 1, name: 'tbl_hop_dong_bao_dam', alias: 't1', type: 'MAIN', joinColA: '', joinOp: '=', joinColB: '' },
    { id: 2, name: 'tbl_ben_bao_dam', alias: 't2', type: 'LEFT JOIN', joinColA: 't2.hop_dong_id', joinOp: '=', joinColB: 't1.id' }
  ]);

  const [fields, setFields] = useState([
    { id: 1, name: 'ma_hop_dong', type: 'string', source: 't1.ma_hop_dong', description: 'Mã hợp đồng' },
    { id: 2, name: 'ten_ben_bao_dam', type: 'string', source: 't2.ten_ben', description: 'Tên bên bảo đảm' },
    { id: 3, name: 'thoi_gian', type: 'datetime', source: 't1.ngay_ky', description: 'Ngày ký kết' }
  ]);

  const handleAddTable = () => {
    const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    setTables([...tables, { id: newId, name: '', alias: `t${newId}`, type: 'LEFT JOIN', joinColA: '', joinOp: '=', joinColB: '' }]);
  };

  const handleRemoveTable = (id: number) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const handleUpdateTable = (id: number, key: string, value: string) => {
    setTables(tables.map(t => t.id === id ? { ...t, [key]: value } : t));
  };

  const handleAddField = () => {
    const newId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields([...fields, { id: newId, name: '', type: 'string', source: '', description: '' }]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: number, key: string, value: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const generatePreview = () => {
    const mockData: Record<string, any> = {};
    fields.forEach(f => {
      if (!f.name) return;
      let val: any = "sample_string";
      if (f.type === 'number') val = 12345;
      else if (f.type === 'boolean') val = true;
      else if (f.type === 'datetime') val = "2026-05-22T10:00:00Z";
      else if (f.name.toLowerCase().includes('ma_') || f.name.toLowerCase().includes('code')) val = "CODE-123";
      else if (f.name.toLowerCase().includes('ten_') || f.name.toLowerCase().includes('name')) val = "Giá trị mẫu";
      
      mockData[f.name] = val;
    });

    if (Object.keys(mockData).length === 0) {
      return format === 'json' ? '{\n  // Thêm trường dữ liệu để xem trước\n}' : '<data>\n  <!-- Thêm trường dữ liệu để xem trước -->\n</data>';
    }

    if (format === 'json') {
      return JSON.stringify(mockData, null, 2);
    } else {
      let xml = '<data>\n';
      Object.entries(mockData).forEach(([k, v]) => {
        // Simple XML tag sanitization
        const safeTag = k.replace(/[^a-zA-Z0-9_]/g, '_');
        xml += `  <${safeTag}>${v}</${safeTag}>\n`;
      });
      xml += '</data>';
      return xml;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Thông tin cấu hình</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Định dạng dữ liệu</label>
            <select 
              aria-label="Định dạng dữ liệu"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Phương thức phân phối</label>
            <select aria-label="Phương thức phân phối" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium">
              <option value="api">API / Web Service</option>
              <option value="file">File chia sẻ (FTP/SFTP)</option>
              <option value="kafka">Message Queue (Kafka)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Nguồn dữ liệu & Liên kết (Data Sources & Joins)</h4>
          <button onClick={handleAddTable} className="flex items-center text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm bảng
          </button>
        </div>
        
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-xs w-48">Tên bảng (Table)</th>
                <th className="px-4 py-3 font-bold text-xs w-24">Bí danh</th>
                <th className="px-4 py-3 font-bold text-xs w-32">Kiểu kết nối</th>
                <th className="px-4 py-3 font-bold text-xs">Điều kiện kết nối (Join condition)</th>
                <th className="px-4 py-3 font-bold text-xs w-12 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tables.map((table, idx) => (
                <tr key={table.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    {/* Visual Dropdown cho Tên bảng */}
                    <select 
                      className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded shadow-sm text-slate-800 font-bold text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      value={table.name}
                      onChange={(e) => handleUpdateTable(table.id, 'name', e.target.value)}
                    >
                      <option value="">-- Chọn bảng từ CSDL --</option>
                      {tableNames.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      aria-label="Bí danh" 
                      type="text" 
                      className="w-full px-2 py-1.5 border border-slate-300 bg-slate-50 rounded font-mono text-xs text-center font-bold" 
                      value={table.alias}
                      onChange={(e) => handleUpdateTable(table.id, 'alias', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {idx === 0 ? (
                      <span className="inline-block px-2 py-1.5 bg-green-100 border border-green-200 text-green-700 text-[10px] font-extrabold rounded">BẢNG CHÍNH</span>
                    ) : (
                      <select 
                        aria-label="Kiểu kết nối" 
                        className="w-full px-2 py-1.5 border border-slate-300 bg-white shadow-sm rounded text-xs font-bold focus:ring-2 focus:ring-amber-500/20"
                        value={table.type}
                        onChange={(e) => handleUpdateTable(table.id, 'type', e.target.value)}
                      >
                        <option>INNER JOIN</option>
                        <option>LEFT JOIN</option>
                        <option>RIGHT JOIN</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {idx === 0 ? (
                      <div className="px-3 py-1.5 text-xs text-slate-400 italic bg-slate-50 border border-slate-100 rounded inline-block">Bảng gốc (Không cần điều kiện)</div>
                    ) : (
                      // Visual Dropdown cho Điều kiện kết nối
                      <div className="flex items-center gap-2">
                        <select 
                          className="w-full px-2 py-1.5 border border-amber-300 bg-amber-50 shadow-sm rounded font-mono text-xs font-bold focus:ring-2 focus:ring-amber-500/20"
                          value={table.joinColA}
                          onChange={(e) => handleUpdateTable(table.id, 'joinColA', e.target.value)}
                        >
                          <option value="">-- Chọn cột (${table.alias}) --</option>
                          {mockSchema[table.name]?.map(col => (
                            <option key={col} value={`${table.alias}.${col}`}>{table.alias}.{col}</option>
                          ))}
                        </select>
                        <select 
                          className="px-2 py-1.5 border border-slate-300 bg-white rounded text-xs font-extrabold shadow-sm"
                          value={table.joinOp}
                          onChange={(e) => handleUpdateTable(table.id, 'joinOp', e.target.value)}
                        >
                          <option value="=">=</option>
                          <option value=">">&gt;</option>
                          <option value="<">&lt;</option>
                          <option value="!=">!=</option>
                        </select>
                        <select 
                          className="w-full px-2 py-1.5 border border-blue-300 bg-blue-50 shadow-sm rounded font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500/20"
                          value={table.joinColB}
                          onChange={(e) => handleUpdateTable(table.id, 'joinColB', e.target.value)}
                        >
                          <option value="">-- Cột đích nối tới --</option>
                          {tables.slice(0, idx).flatMap(t => 
                            mockSchema[t.name]?.map(col => (
                              <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                            ))
                          )}
                        </select>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {idx !== 0 && (
                      <button 
                        onClick={() => handleRemoveTable(table.id)} 
                        aria-label="Xóa bảng" 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Cấu trúc các trường dữ liệu (Fields)</h4>
          <button onClick={handleAddField} className="flex items-center text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition-colors">
            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm trường
          </button>
        </div>
        
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-xs w-48">Tên trường đích (Alias)</th>
                <th className="px-4 py-3 font-bold text-xs w-32">Kiểu dữ liệu</th>
                <th className="px-4 py-3 font-bold text-xs w-56">Ánh xạ nguồn (Source Column)</th>
                <th className="px-4 py-3 font-bold text-xs">Mô tả thêm</th>
                <th className="px-4 py-3 font-bold text-xs w-12 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map(field => (
                <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      aria-label="Tên trường đích" 
                      type="text" 
                      className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded font-mono text-xs focus:ring-2 focus:ring-amber-500/20" 
                      value={field.name} 
                      onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      aria-label="Kiểu dữ liệu" 
                      className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded text-xs font-bold focus:ring-2 focus:ring-amber-500/20" 
                      value={field.type}
                      onChange={(e) => handleUpdateField(field.id, 'type', e.target.value)}
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="datetime">DateTime</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {/* Visual Dropdown cho Mapping Column */}
                    <select 
                      className="w-full px-2 py-1.5 border border-emerald-300 bg-emerald-50 rounded font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500/20"
                      value={field.source}
                      onChange={(e) => handleUpdateField(field.id, 'source', e.target.value)}
                    >
                      <option value="">-- Chọn trường từ Database --</option>
                      {tables.map(t => t.name && mockSchema[t.name] && (
                        <optgroup key={t.id} label={`[Bảng: ${t.name} - Bí danh: ${t.alias}]`}>
                          {mockSchema[t.name].map(col => (
                            <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      aria-label="Mô tả trường" 
                      type="text" 
                      className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded text-xs focus:ring-2 focus:ring-amber-500/20" 
                      value={field.description} 
                      onChange={(e) => handleUpdateField(field.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleRemoveField(field.id)} 
                      aria-label="Xóa trường" 
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow-lg">
        <h4 className="font-bold text-white mb-4 flex items-center text-sm">
          <Code className="w-4 h-4 mr-2 text-amber-500" />
          Cấu trúc mẫu (Preview Payload)
        </h4>
        <pre className="bg-slate-950/50 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{generatePreview()}
        </pre>
      </div>

      <div className="flex justify-end pt-2">
        <button className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center font-bold shadow-md hover:scale-[1.02] transition-all">
          <Save className="w-4 h-4 mr-2" />
          Lưu cấu hình gói tin
        </button>
      </div>
    </div>
  );
}
