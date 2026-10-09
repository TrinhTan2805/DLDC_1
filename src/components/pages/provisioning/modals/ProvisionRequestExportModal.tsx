import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, FileDown, CheckCircle, Table as TableIcon, Filter, AlertCircle, RefreshCw, Layers, Database, LayoutTemplate, Key, Trash2, Plus, Copy, Code } from 'lucide-react';
import { Badge, RowIconAction, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, SECTION_TITLE } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

// Mock Database Schema for Civil Registry
const mockSchema: Record<string, string[]> = {
  'ho_tich_ca_nhan': ['id', 'ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dinh_danh'],
  'giay_khai_sinh': ['id', 'so_giay_khai_sinh', 'ngay_dang_ky', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  'dia_chi_thuong_tru': ['id', 'user_id', 'id_ho_tich', 'tinh_thanh', 'quan_huyen', 'phuong_xa', 'chi_tiet'],
  'thong_tin_cha_me': ['id', 'id_ho_tich', 'ho_ten_cha', 'cccd_cha', 'ho_ten_me', 'cccd_me']
};
const tableNames = Object.keys(mockSchema);

interface ProvisionRequestExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: any;
  onConfirmExport: (id: string) => void;
}

export function ProvisionRequestExportModal({ isOpen, onClose, requestData, onConfirmExport }: ProvisionRequestExportModalProps) {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState(requestData?.format || 'excel');

  // States for query mode
  const [queryMode, setQueryMode] = useState<'visual' | 'raw_sql'>('visual');
  const [rawSql, setRawSql] = useState('SELECT *\nFROM ho_tich_ca_nhan\nWHERE id = :id');

  // States for query builder
  const [dateColumn, setDateColumn] = useState('');
  const [conditions, setConditions] = useState<any[]>([]);

  // States for packet design
  const [fields, setFields] = useState<any[]>([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'id' },
    { id: 2, name: 'ho_ten', type: 'string', description: 'Họ và tên', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'ho_ten' },
    { id: 3, name: 'so_dinh_danh', type: 'string', description: 'Số định danh cá nhân', isMasked: true, maskRule: 'hide_middle_4', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'so_dinh_danh' }
  ]);
  const [hasJoin, setHasJoin] = useState(false);
  const [primaryTable, setPrimaryTable] = useState('ho_tich_ca_nhan');
  const [joinedTables, setJoinedTables] = useState<any[]>([
    { id: 1, name: 'dia_chi_thuong_tru', alias: 't2', type: 'LEFT JOIN', joinColA: 't2.id_ho_tich', joinOp: '=', joinColB: 'ho_tich_ca_nhan.id' }
  ]);

  const handleAddJoinTable = () => {
    const nextId = joinedTables.length > 0 ? Math.max(...joinedTables.map(t => t.id)) + 1 : 1;
    const nextAlias = `t${nextId + 1}`;
    setJoinedTables([
      ...joinedTables,
      { id: nextId, name: '', alias: nextAlias, type: 'LEFT JOIN', joinColA: '', joinOp: '=', joinColB: '' }
    ]);
  };

  const handleRemoveJoinTable = (id: number) => {
    setJoinedTables(joinedTables.filter(t => t.id !== id));
  };

  const handleUpdateJoinTable = (id: number, key: string, value: string) => {
    setJoinedTables(joinedTables.map(t => t.id === id ? { ...t, [key]: value } : t));
  };

  const handleAddDataField = () => {
    const nextId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields([
      ...fields,
      {
        id: nextId,
        name: '',
        type: 'string',
        description: '',
        isMasked: false,
        maskRule: '',
        sourceTable: primaryTable,
        sourceColumn: '',
        isCalculated: false
      }
    ]);
  };

  const handleUpdateFieldProperty = (id: any, property: string, value: any) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const updated = { ...f, [property]: value };
        if (property === 'sourceColumn') {
          updated.name = value;
          const tbl = updated.sourceTable || primaryTable;
          const col = value;
          updated.description = `Trường ${col} (từ bảng ${tbl})`;
          if (col.toLowerCase().includes('ngay') || col.toLowerCase().includes('thoi_gian') || col.toLowerCase().includes('date')) {
            updated.type = 'datetime';
          } else if (col === 'id' || col.toLowerCase().includes('so') || col.toLowerCase().includes('ma') || col.toLowerCase().includes('cccd')) {
            updated.type = 'string';
          } else {
            updated.type = 'string';
          }
        }
        return updated;
      }
      return f;
    }));
  };

  const handleDeleteField = (id: any) => {
    setFields(fields.filter(f => f.id !== id));
  };

  if (!isOpen || !requestData) return null;

  const handleNextStep = () => {
    setActiveStep(2);
  };

  const handleConfirm = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onConfirmExport(requestData.id);
      onClose();
    }, 1500);
  };

  const mockPreviewData = [
    { id: '1', so_dinh_danh: '001095000123', ho_ten: 'Nguyễn Văn A', ngay_sinh: '15/10/1995', tinh_trang: 'Đã kết hôn' },
    { id: '2', so_dinh_danh: '001096000456', ho_ten: 'Trần Thị B', ngay_sinh: '22/05/1996', tinh_trang: 'Đã kết hôn' },
    { id: '3', so_dinh_danh: '001098000789', ho_ten: 'Lê Văn C', ngay_sinh: '08/11/1998', tinh_trang: 'Độc thân' },
  ];

  // Ô nhập gọn trong ô bảng (cao 32px) — cùng viền/bo với INPUT_CLS
  const CELL_INPUT_CLS = 'w-full h-8 px-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer';
  const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
  const stepCircle = (state: 'active' | 'done' | 'todo') =>
    `w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 text-[13px] font-medium transition-colors ${
      state === 'active' ? 'bg-blue-600 border-blue-600 text-white' : state === 'done' ? 'bg-[#EAF3FF] border-blue-600 text-blue-600' : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
    }`;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header (mục 5.4) */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-[#020817] flex items-center gap-2">
              <FileDown className="w-5 h-5 text-[#16A34A]" />
              Kết xuất dữ liệu theo yêu cầu
            </h2>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-[13px] text-[#64748B]">
              <span className="text-blue-600">{requestData.id}</span>
              <span>Đơn vị: <span className="text-[#020817]">{requestData.org}</span></span>
              <span>Dữ liệu: <span className="text-[#020817]">{requestData.dataType}</span></span>
            </div>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar - Steps (wizard: #155DFC đang/đã qua, #E2E8F0 chưa) */}
          <div className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] p-6 flex flex-col gap-6 shrink-0">
            <div className="flex flex-col gap-4 relative before:absolute before:left-5 before:top-8 before:bottom-8 before:w-0.5 before:bg-[#E2E8F0]">
              {/* Step 1 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => setActiveStep(1)}>
                <div className={stepCircle(activeStep === 1 ? 'active' : activeStep > 1 ? 'done' : 'todo')}>
                  {activeStep > 1 ? <CheckCircle className="w-5 h-5" /> : 1}
                </div>
                <div className="pt-2">
                  <h3 className={`text-[13px] font-medium ${activeStep === 1 ? 'text-blue-600' : 'text-[#020817]'}`}>Thiết lập tiêu chí</h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">Lọc dữ liệu truy xuất</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => activeStep >= 1 && setActiveStep(2)}>
                <div className={stepCircle(activeStep === 2 ? 'active' : 'todo')}>
                  2
                </div>
                <div className="pt-2">
                  <h3 className={`text-[13px] font-medium ${activeStep === 2 ? 'text-blue-600' : 'text-[#020817]'}`}>Xem trước & Xuất</h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">Kiểm tra và tạo file</p>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-[#EAF3FF] p-4 rounded-lg border border-[#BFDBFE]">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                <span className="text-[13px] font-semibold text-[#020817]">Mục đích yêu cầu</span>
              </div>
              <p className="text-[13px] text-[#020817] leading-5 break-words">
                "{requestData.purpose}"
              </p>
            </div>
          </div>

          {/* Right Main Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white px-6 py-4">

            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Mode Toggle (mục 5.9) */}
                <div className="flex border-b border-[#E2E8F0]">
                  <button type="button" onClick={() => setQueryMode('visual')} className={tabClass(queryMode === 'visual')}>
                    Cấu hình trực quan (Visual)
                  </button>
                  <button type="button" onClick={() => setQueryMode('raw_sql')} className={tabClass(queryMode === 'raw_sql')}>
                    Viết câu lệnh (Raw SQL)
                  </button>
                </div>

                {queryMode === 'visual' ? (
                  <>
                    <section>
                  <h3 className={SECTION_TITLE}>
                    <Filter className="w-4 h-4 text-blue-600" />
                    Thiết lập điều kiện truy xuất
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <div>
                      <label className={LABEL_CLS}>Cột thời gian</label>
                      <select
                        aria-label="Cột thời gian"
                        className={`${INPUT_CLS} cursor-pointer`}
                        value={dateColumn}
                        onChange={(e) => setDateColumn(e.target.value)}
                      >
                        <option value="">-- Chọn mốc thời gian --</option>
                        <optgroup label={`Bảng chính: ${primaryTable}`}>
                          {mockSchema[primaryTable]?.map(col => (
                            <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                          ))}
                        </optgroup>
                        {hasJoin && joinedTables.map(t => t.name && (
                          <optgroup key={t.id} label={`Liên kết: ${t.alias}`}>
                            {mockSchema[t.name]?.map(col => (
                               <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Từ ngày</label>
                      <input type="date" aria-label="Từ ngày" className={`${INPUT_CLS} cursor-pointer`} defaultValue={requestData.fromDate || ''} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Đến ngày</label>
                      <input type="date" aria-label="Đến ngày" className={`${INPUT_CLS} cursor-pointer`} defaultValue={requestData.toDate || ''} />
                    </div>
                  </div>

                  {/* Visual Query Builder */}
                  <div className="mt-4 border border-[#E2E8F0] rounded-2xl overflow-hidden">
                    <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                      <h4 className="text-[13px] font-medium text-[#020817] flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-600" />
                        Điều kiện lọc bổ sung
                      </h4>
                      <button
                        type="button"
                        onClick={() => setConditions([...conditions, { id: Date.now(), logicalOp: 'AND', column: '', operator: '=', value: '' }])}
                        className={`${BTN_OUTLINE} !h-8 !px-3`}
                      >
                        <Plus className="w-4 h-4" /> Thêm điều kiện
                      </button>
                    </div>

                    <div className="p-4 bg-white space-y-3">
                      {conditions.length === 0 ? (
                        <div className="text-center py-6 text-[13px] text-[#64748B] bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] border-dashed">
                          Chưa có điều kiện lọc bổ sung nào. Nhấn "Thêm điều kiện" để thiết lập.
                        </div>
                      ) : (
                        conditions.map((cond, idx) => (
                          <div key={cond.id} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg group animate-in fade-in zoom-in-95 duration-200">
                            {idx === 0 ? (
                              <div className="h-10 inline-flex items-center justify-center text-[13px] font-medium text-[#64748B] bg-white px-3 rounded-lg border border-[#E2E8F0] w-20 shrink-0">
                                WHERE
                              </div>
                            ) : (
                              <select
                                aria-label="Toán tử logic"
                                className="h-10 text-[13px] font-medium text-blue-600 bg-[#EAF3FF] px-2 rounded-lg border border-[#BFDBFE] outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer w-20 text-center shrink-0"
                                value={cond.logicalOp || 'AND'}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].logicalOp = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            )}
                            <div className="flex-1 w-full flex items-center gap-3">
                              <select
                                aria-label="Trường lọc"
                                className={`${INPUT_CLS} flex-1 cursor-pointer`}
                                value={cond.column}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].column = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="">-- Chọn trường --</option>
                                <optgroup label={`Bảng chính: ${primaryTable}`}>
                                  {mockSchema[primaryTable]?.map(col => (
                                    <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                                  ))}
                                </optgroup>
                                {hasJoin && joinedTables.map(t => t.name && (
                                  <optgroup key={t.id} label={`Liên kết: ${t.alias}`}>
                                    {mockSchema[t.name]?.map(col => (
                                       <option key={`${t.alias}.${col}`} value={`${t.alias}.${col}`}>{t.alias}.{col}</option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>

                              <select
                                aria-label="Phép so sánh"
                                className={`${INPUT_CLS} !w-36 cursor-pointer`}
                                value={cond.operator}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].operator = e.target.value;
                                  setConditions(newConds);
                                }}
                              >
                                <option value="=">Bằng (=)</option>
                                <option value=">">Lớn hơn (&gt;)</option>
                                <option value="<">Nhỏ hơn (&lt;)</option>
                                <option value="LIKE">Chứa (LIKE)</option>
                                <option value="IN">Trong (IN)</option>
                                <option value="IS NULL">Rỗng (IS NULL)</option>
                                <option value="!=">Khác (!=)</option>
                              </select>

                              <input
                                type="text"
                                aria-label="Giá trị lọc"
                                placeholder="Giá trị lọc..."
                                className={`${INPUT_CLS} flex-1`}
                                value={cond.value}
                                onChange={(e) => {
                                  const newConds = [...conditions];
                                  newConds[idx].value = e.target.value;
                                  setConditions(newConds);
                                }}
                                disabled={cond.operator === 'IS NULL'}
                              />

                              <RowIconAction label="Xóa điều kiện" onClick={() => setConditions(conditions.filter(c => c.id !== cond.id))}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>

                 {/* Data Source Configuration */}
                 <section className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className={`${SECTION_TITLE} !mb-0`}>
                        <Database className="w-4 h-4 text-blue-600" />
                        Cấu hình Nguồn dữ liệu
                     </h4>
                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                        <span className="text-[13px] text-[#020817]">Sử dụng liên kết bảng (Join)</span>
                        <div
                          role="switch"
                          aria-checked={hasJoin}
                          aria-label="Sử dụng liên kết bảng (Join)"
                          onClick={() => setHasJoin(!hasJoin)}
                          className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${hasJoin ? 'bg-blue-600' : 'bg-[#E2E8F0]'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${hasJoin ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                   </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Primary Table */}
                      <div className="p-4 bg-white rounded-lg border border-[#E2E8F0]">
                        <label className={`${LABEL_CLS} flex items-center justify-between`}>
                           <span>Bảng dữ liệu chính</span>
                           <span className="text-[12px] font-normal bg-[#EAF3FF] text-blue-600 px-1.5 py-0.5 rounded">Primary Table</span>
                        </label>
                        <select
                          title="Chọn bảng chính"
                          className={`${INPUT_CLS} cursor-pointer`}
                          value={primaryTable}
                          onChange={(e) => setPrimaryTable(e.target.value)}
                        >
                          <option value="ho_tich_ca_nhan">ho_tich_ca_nhan (Hộ tịch cá nhân)</option>
                          <option value="giay_khai_sinh">giay_khai_sinh (Giấy khai sinh)</option>
                        </select>
                      </div>

                      {/* Joined Tables Builder */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                            <h5 className="text-[13px] font-medium text-[#020817] flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-blue-600" />
                              Bảng liên kết bổ sung ({joinedTables.length})
                            </h5>
                            <button
                              type="button"
                              onClick={handleAddJoinTable}
                              className={`${BTN_OUTLINE} !h-8 !px-3`}
                            >
                              <Plus className="w-4 h-4" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinedTables.map((table, idx) => (
                            <div key={table.id} className="p-4 bg-white border border-[#E2E8F0] rounded-lg relative space-y-4">
                              <div className="absolute top-3 right-3">
                                <RowIconAction label="Xóa bảng liên kết" onClick={() => handleRemoveJoinTable(table.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </div>

                              <div className="flex items-center gap-3">
                                <Badge label={`Bảng liên kết #${idx + 1}`} variant="blue" />
                                <span className="text-[13px] text-[#64748B]">
                                  Alias: {table.alias}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className={LABEL_CLS}>Kiểu liên kết</label>
                                  <select
                                    aria-label="Kiểu liên kết"
                                    className={`${INPUT_CLS} cursor-pointer`}
                                    value={table.type}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'type', e.target.value)}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL_CLS}>Bảng dữ liệu bổ sung</label>
                                  <select
                                    title="Chọn bảng phụ"
                                    className={`${INPUT_CLS} cursor-pointer`}
                                    value={table.name}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'name', e.target.value)}
                                  >
                                    <option value="">-- Chọn bảng bổ sung --</option>
                                    {tableNames.filter(name => name !== primaryTable).map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {table.name && (
                                <div className="p-3 bg-[#EAF3FF] rounded-lg border border-[#BFDBFE] border-dashed space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <div className="text-[13px] font-medium text-blue-600">Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select
                                        title="Trường PK"
                                        className={`${INPUT_CLS} cursor-pointer`}
                                        value={table.joinColA}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColA', e.target.value)}
                                      >
                                        <option value="">-- Cột của {table.name} --</option>
                                        {mockSchema[table.name]?.map(col => (
                                          <option key={col} value={`${table.alias}.${col}`}>{table.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="text-blue-600 font-medium text-[13px] px-2.5 py-1 bg-white rounded-lg border border-[#BFDBFE]">=</div>
                                    <div className="flex-1 w-full">
                                      <select
                                        title="Trường FK"
                                        className={`${INPUT_CLS} cursor-pointer`}
                                        value={table.joinColB}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColB', e.target.value)}
                                      >
                                        <option value="">-- Nối với cột --</option>
                                        <optgroup label={`Bảng chính: ${primaryTable}`}>
                                          {mockSchema[primaryTable]?.map(col => (
                                            <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                                          ))}
                                        </optgroup>
                                        {joinedTables.slice(0, idx).map(prevTable => prevTable.name && (
                                          <optgroup key={prevTable.id} label={`Bảng liên kết: ${prevTable.name} (${prevTable.alias})`}>
                                            {mockSchema[prevTable.name]?.map(col => (
                                              <option key={`${prevTable.alias}.${col}`} value={`${prevTable.alias}.${col}`}>{prevTable.alias}.{col}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </section>

                  {/* Field Definition Table */}
                  <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-[#E2E8F0]">
                      <h4 className={`${SECTION_TITLE} !mb-0`}>
                        <LayoutTemplate className="w-4 h-4 text-blue-600" />
                        Chọn trường dữ liệu chia sẻ (Field Selection)
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddDataField}
                        className={`${BTN_OUTLINE} !h-8 !px-3`}
                        title="Thêm trường dữ liệu gốc"
                      >
                        <Plus className="w-4 h-4" /> Thêm trường dữ liệu
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse collection-table text-[13px]">
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH} text-center w-12`}>Chia sẻ</th>
                            <th className={`${TH} text-center w-12`}>PK</th>
                            <th className={`${TH} text-left w-[20%]`}>Nguồn dữ liệu (Table)</th>
                            <th className={`${TH} text-left w-[22%]`}>Trường gốc (Column)</th>
                            <th className={`${TH} text-left w-[22%]`}>Tên trường (API Field)</th>
                            <th className={`${TH} text-left w-[14%]`}>Kiểu dữ liệu</th>
                            <th className={`${TH} text-center w-[10%]`}>Che dấu</th>
                            <th className={`${TH} text-center w-16`}>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map(field => (
                              <tr key={field.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-3 py-1 text-center">
                                  <input type="checkbox" title="Chọn trường" className="accent-blue-600 w-4 h-4 cursor-pointer" defaultChecked />
                                </td>
                                <td className="px-3 py-1 text-center">
                                  <Key className={`w-4 h-4 mx-auto ${field.id === 1 ? 'text-blue-600' : 'text-[#94A3B8] hover:text-blue-600 transition-colors cursor-pointer'}`} />
                                </td>
                                <td className="px-3 py-1">
                                  <select
                                    title="Chọn bảng"
                                    className={CELL_INPUT_CLS}
                                    value={field.sourceTable || primaryTable}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceTable', e.target.value)}
                                  >
                                    <option value={primaryTable}>{primaryTable} (Gốc)</option>
                                    {hasJoin && joinedTables.map(t => t.name && (
                                      <option key={t.id} value={t.name}>{t.name} (Liên kết)</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-1">
                                  <select
                                    title="Chọn cột nguồn"
                                    className={CELL_INPUT_CLS}
                                    value={field.sourceColumn || ''}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceColumn', e.target.value)}
                                  >
                                    <option value="">-- Chọn trường gốc --</option>
                                    {mockSchema[field.sourceTable || primaryTable]?.map(col => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-1">
                                  <input
                                    title="Tên trường API"
                                    aria-label="Tên trường API"
                                    type="text"
                                    className={`${CELL_INPUT_CLS} cursor-text`}
                                    value={field.name}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'name', e.target.value)}
                                    placeholder="Ví dụ: ho_ten"
                                  />
                                </td>
                                <td className="px-3 py-1">
                                  <select
                                    title="Kiểu"
                                    className={CELL_INPUT_CLS}
                                    value={field.type}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'type', e.target.value)}
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="datetime">datetime</option>
                                  </select>
                                </td>
                                <td className="px-3 py-1 text-center">
                                  <input
                                    type="checkbox"
                                    title="Masking"
                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                    checked={field.isMasked || false}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'isMasked', e.target.checked)}
                                  />
                                </td>
                                <td className="px-3 py-1 text-center">
                                  <RowIconAction label="Xóa trường" onClick={() => handleDeleteField(field.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  </>
                ) : (
                  <section className="bg-white p-4 rounded-2xl border border-[#E2E8F0] animate-in fade-in duration-300">
                    <h3 className={SECTION_TITLE}>
                      <Code className="w-4 h-4 text-blue-600" />
                      Câu lệnh SQL tùy chỉnh
                    </h3>
                    <textarea
                      aria-label="Câu lệnh SQL tùy chỉnh"
                      value={rawSql}
                      onChange={(e) => setRawSql(e.target.value)}
                      className="w-full h-64 px-3 py-2 text-[13px] text-[#020817] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-blue-600 resize-y"
                      placeholder="SELECT * FROM ho_tich_ca_nhan WHERE id = :id"
                    />
                  </section>
                )}

                {/* Live JSON Preview */}
                <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300 relative">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                        <h4 className="text-[14px] font-medium text-[#020817]">Live API Response Preview</h4>
                      </div>
                      <button type="button" aria-label="Sao chép" title="Sao chép" className={BTN_GHOST_ICON}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <pre className="text-[13px] leading-6 text-[#020817] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 whitespace-pre-wrap break-words overflow-x-auto font-[inherit]">
                        <code>{`{`}</code>{'\n'}
                        <code>  "status": "success",</code>{'\n'}
                        <code>  "data": {`{`}</code>{'\n'}
                        {fields.filter(f => f.name).map((f) => (
                          <React.Fragment key={f.id}>
                            <code>    "{f.name}": </code>
                            {f.type === 'number' ? (
                              <code>12345</code>
                            ) : f.type === 'datetime' ? (
                              <code>"2026-10-15T08:30:00Z"</code>
                            ) : (
                              <code>"{f.isMasked ? '001••••123' : `sample_${f.sourceColumn || f.name}`}"</code>
                            )}
                            <code>,</code>{'\n'}
                          </React.Fragment>
                        ))}
                        <code>    "metadata": {`{`}</code>{'\n'}
                        <code>      "source": "BTP_DLDC_CORE",</code>{'\n'}
                        {(() => {
                           const filtersString = conditions.filter(c => c.column).map((c, i) => {
                             const prefix = i === 0 ? '' : ` ${c.logicalOp || 'AND'} `;
                             return `${prefix}${c.column} ${c.operator} ${c.operator === 'IS NULL' ? '' : `'${c.value}'`}`;
                           }).join('').trim();
                           return filtersString ? (
                             <>
                               <code>      "query_filters": "{filtersString}",</code>{'\n'}
                             </>
                           ) : null;
                        })()}
                        <code>      "timestamp": "2026-06-02T16:21:10.607Z"</code>{'\n'}
                        <code>    {`}`}</code>{'\n'}
                        <code>  {`}`}</code>{'\n'}
                        <code>{`}`}</code>
                      </pre>
                    </div>
                  </section>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between gap-4 bg-[#F0FDF4] border border-[#DCFCE7] p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <TableIcon className="w-8 h-8 text-[#16A34A]" />
                    <div>
                      <h4 className="text-[13px] font-medium text-[#15803D]">Dữ liệu sẵn sàng kết xuất</h4>
                      <p className="text-[13px] text-[#020817] mt-0.5">Dự kiến: <span className="font-medium text-[#15803D] tabular-nums">12,450</span> bản ghi khớp với điều kiện.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[13px] font-semibold text-[#020817] whitespace-nowrap">Định dạng file:</span>
                    <select
                      aria-label="Định dạng file"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className={`${INPUT_CLS} !w-auto cursor-pointer`}
                    >
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="xml">XML (.xml)</option>
                    </select>
                  </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                  <div className="bg-white px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <h4 className="text-[14px] font-medium text-[#020817]">Bản xem trước dữ liệu (Top 3)</h4>
                    <button type="button" className="text-blue-600 hover:text-blue-700 text-[13px] font-medium flex items-center gap-1 cursor-pointer">
                      <RefreshCw className="w-4 h-4" /> Làm mới
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} text-left`}>Số định danh</th>
                          <th className={`${TH} text-left`}>Họ tên</th>
                          <th className={`${TH} text-left`}>Ngày sinh</th>
                          <th className={`${TH} text-left`}>Tình trạng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPreviewData.map((row, idx) => (
                          <tr key={idx} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-3 py-1 text-[13px] text-black text-left">{row.so_dinh_danh}</td>
                            <td className="px-3 py-1 text-[13px] text-black text-left">{row.ho_ten}</td>
                            <td className="px-3 py-1 text-[13px] text-black text-left">{row.ngay_sinh}</td>
                            <td className="px-3 py-1 text-[13px] text-black text-left">{row.tinh_trang}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer (mục 5.4) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex-shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Hủy bỏ
          </button>
          {activeStep === 1 && (
            <button type="button" onClick={handleNextStep} className={BTN_PRIMARY}>
              Tiếp tục
            </button>
          )}
          {activeStep === 2 && (
            <>
              <button type="button" onClick={() => setActiveStep(1)} className={BTN_OUTLINE}>
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isGenerating}
                className={`${BTN_PRIMARY} min-w-[160px]`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang tạo file...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Xác nhận kết xuất
                  </>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  , document.body);
}
