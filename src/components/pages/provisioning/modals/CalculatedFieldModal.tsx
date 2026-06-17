import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, Database, HelpCircle, Save, Check, Star, Settings, Wand2, Terminal } from 'lucide-react';

interface CalculatedFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: any) => void;
  editingField?: any;
  availableFields: { name: string; type: string; description: string }[];
}

export function CalculatedFieldModal({
  isOpen,
  onClose,
  onSave,
  editingField,
  availableFields,
}: CalculatedFieldModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('string');
  const [formula, setFormula] = useState('');
  const [error, setError] = useState('');

  // Smart Builder Tabs State
  const [activeTab, setActiveTab] = useState<'preset' | 'advanced'>('preset');
  const [selectedPreset, setSelectedPreset] = useState('preset_concat');
  const [presetFieldA, setPresetFieldA] = useState('');
  const [presetFieldB, setPresetFieldB] = useState('');

  // Define Preset Templates Library
  const presets = [
    {
      id: 'preset_concat',
      name: 'Ghép Họ & Tên đầy đủ',
      description: 'Nối hai cột văn bản riêng biệt (ví dụ: Họ lót và Tên) thành một chuỗi duy nhất cách nhau bởi khoảng trắng.',
      icon: <Wand2 className="w-5 h-5 text-amber-500" />,
      resultType: 'string',
      fieldsCount: 2,
      labelA: 'Cột Họ / Họ lót / Tên đệm',
      labelB: 'Cột Tên chính',
    },
    {
      id: 'preset_age',
      name: 'Tính Tuổi hiện tại',
      description: 'Tính toán chính xác số tuổi của công dân từ trường dữ liệu chứa Ngày sinh (DateTime/Date).',
      icon: <Star className="w-5 h-5 text-indigo-500" />,
      resultType: 'number',
      fieldsCount: 1,
      labelA: 'Cột chứa Ngày sinh',
      labelB: '',
    },
    {
      id: 'preset_gender',
      name: 'Giải mã nhãn Giới tính',
      description: 'Chuyển mã số giới tính hệ thống (ví dụ: 1/2) thành tên hiển thị trực quan "Nam" hoặc "Nữ" trên API.',
      icon: <Settings className="w-5 h-5 text-emerald-500" />,
      resultType: 'string',
      fieldsCount: 1,
      labelA: 'Cột Giới tính số',
      labelB: '',
    },
    {
      id: 'preset_date_vn',
      name: 'Định dạng Ngày Việt Nam',
      description: 'Chuyển đổi định dạng ngày giờ chuẩn ISO thô (YYYY-MM-DD) sang định dạng ngày Việt Nam (DD/MM/YYYY).',
      icon: <Code className="w-5 h-5 text-blue-500" />,
      resultType: 'string',
      fieldsCount: 1,
      labelA: 'Cột Ngày tháng nguồn',
      labelB: '',
    },
  ];

  // Initialize values when opening
  useEffect(() => {
    if (editingField) {
      setName(editingField.name || '');
      setDescription(editingField.description || '');
      setDataType(editingField.type || 'string');
      setFormula(editingField.formula || '');

      const f = editingField.formula || '';
      // Parse formula to find matched Preset if possible
      if (f.startsWith('CONCAT(') && f.includes("' '")) {
        setSelectedPreset('preset_concat');
        setActiveTab('preset');
        // Try extracting parameters
        const match = f.match(/\{([a-zA-Z0-9_]+)\}/g);
        if (match && match.length >= 2) {
          setPresetFieldA(match[0].replace(/[{}]/g, ''));
          setPresetFieldB(match[1].replace(/[{}]/g, ''));
        }
      } else if (f.startsWith('AGE(')) {
        setSelectedPreset('preset_age');
        setActiveTab('preset');
        const match = f.match(/\{([a-zA-Z0-9_]+)\}/);
        if (match) setPresetFieldA(match[1]);
      } else if (f.includes('CASE WHEN')) {
        setSelectedPreset('preset_gender');
        setActiveTab('preset');
        const match = f.match(/\{([a-zA-Z0-9_]+)\}/);
        if (match) setPresetFieldA(match[1]);
      } else if (f.startsWith('FORMAT_DATE(')) {
        setSelectedPreset('preset_date_vn');
        setActiveTab('preset');
        const match = f.match(/\{([a-zA-Z0-9_]+)\}/);
        if (match) setPresetFieldA(match[1]);
      } else {
        setSelectedPreset('');
        setActiveTab('advanced');
      }
    } else {
      setName('');
      setDescription('');
      setDataType('string');
      setFormula('');
      setSelectedPreset('preset_concat');
      setPresetFieldA(availableFields[0]?.name || '');
      setPresetFieldB(availableFields[1]?.name || '');
      setActiveTab('preset');
    }
    setError('');
  }, [editingField, isOpen]);

  // Update formula and datatype dynamically based on selected Preset & dropdown parameters
  useEffect(() => {
    if (activeTab === 'preset' && selectedPreset) {
      const active = presets.find(p => p.id === selectedPreset);
      if (active) {
        setDataType(active.resultType);
        
        let generatedFormula = '';
        if (selectedPreset === 'preset_concat') {
          const fA = presetFieldA || availableFields[0]?.name || 'field_a';
          const fB = presetFieldB || availableFields[1]?.name || 'field_b';
          generatedFormula = `CONCAT({${fA}}, ' ', {${fB}})`;
        } else if (selectedPreset === 'preset_age') {
          const fA = presetFieldA || availableFields[0]?.name || 'ngay_sinh';
          generatedFormula = `AGE({${fA}})`;
        } else if (selectedPreset === 'preset_gender') {
          const fA = presetFieldA || availableFields[0]?.name || 'gioi_tinh';
          generatedFormula = `CASE WHEN {${fA}} = 1 THEN 'Nam' ELSE 'Nữ' END`;
        } else if (selectedPreset === 'preset_date_vn') {
          const fA = presetFieldA || availableFields[0]?.name || 'ngay_tao';
          generatedFormula = `FORMAT_DATE({${fA}}, 'DD/MM/YYYY')`;
        }
        
        setFormula(generatedFormula);
      }
    }
  }, [activeTab, selectedPreset, presetFieldA, presetFieldB]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    // Keep API Identifiers safe (letters, numbers, underscores only)
    const sanitized = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setName(sanitized);
  };

  const insertAtCursor = (textToInsert: string) => {
    const textarea = document.getElementById('formula-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      setFormula(before + textToInsert + after);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 50);
    } else {
      setFormula(prev => prev + textToInsert);
    }
  };

  // Live simulation compiler giving high-fidelity mock results to admins
  const simulateResult = (expr: string) => {
    if (!expr) return 'Vui lòng thiết lập hoặc chọn cấu trúc công thức...';
    let sim = expr;

    // Substitute standard schema columns with authentic Viet citizen data
    sim = sim.replace(/\{ho_ten\}/g, '"Nguyễn Văn A"');
    sim = sim.replace(/\{ngay_sinh\}/g, '"1995-10-15"');
    sim = sim.replace(/\{gioi_tinh\}/g, '1');
    sim = sim.replace(/\{so_dinh_danh\}/g, '"001095000123"');
    sim = sim.replace(/\{ma_vinh_vien\}/g, '"ID-99812-CORE"');
    sim = sim.replace(/\{so_giay_khai_sinh\}/g, '"KS-2026-99"');
    sim = sim.replace(/\{ngay_dang_ky\}/g, '"2026-05-28"');
    sim = sim.replace(/\{noi_sinh\}/g, '"Hà Nội"');

    // Substitute any other generic input fields selected in options
    availableFields.forEach(f => {
      const regex = new RegExp(`\\{${f.name}\\}`, 'g');
      if (f.name.toLowerCase().includes('sinh') || f.name.toLowerCase().includes('ngay')) {
        sim = sim.replace(regex, '"1995-10-15"');
      } else if (f.name.toLowerCase().includes('tinh') || f.name.toLowerCase().includes('sex')) {
        sim = sim.replace(regex, '1');
      } else if (f.name.toLowerCase().includes('danh') || f.name.toLowerCase().includes('so') || f.name.toLowerCase().includes('id')) {
        sim = sim.replace(regex, '"001095000123"');
      } else {
        sim = sim.replace(regex, '"Nguyễn Văn"');
      }
    });

    // Evaluate basic function bodies to visual Vietnamese values
    if (sim.includes('CONCAT(')) {
      const parts = sim.match(/CONCAT\((.*)\)/);
      if (parts && parts[1]) {
        return parts[1]
          .split(',')
          .map(p => p.trim().replace(/^['"]|['"]$/g, ''))
          .join('');
      }
    }
    if (sim.includes('AGE(')) {
      return '31 tuổi (Năm sinh 1995)';
    }
    if (sim.includes('CASE WHEN')) {
      return 'Nam';
    }
    if (sim.includes('FORMAT_DATE(')) {
      return '15/10/1995';
    }
    if (sim.includes('UPPER(')) {
      return 'NGUYỄN VĂN A';
    }
    if (sim.includes('LOWER(')) {
      return 'nguyễn văn a';
    }

    return sim.replace(/[{}"']/g, '');
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên trường định danh API!');
      return;
    }
    if (!formula.trim()) {
      setError('Vui lòng xây dựng công thức tính toán!');
      return;
    }
    setError('');
    
    // Generate intelligent business descriptions if user didn't write one
    let finalDesc = description.trim();
    if (!finalDesc) {
      if (activeTab === 'preset' && selectedPreset) {
        const p = presets.find(item => item.id === selectedPreset);
        finalDesc = `${p?.name || 'Trường tính toán'}`;
      } else {
        finalDesc = `Trường công thức ảo: ${name}`;
      }
    }

    onSave({
      id: editingField?.id || `calc_${Date.now()}`,
      name: name.trim(),
      type: dataType,
      description: finalDesc,
      isCalculated: true,
      formula: formula.trim(),
      isMasked: false,
      maskRule: '',
    });
    onClose();
  };

  const functions = [
    {
      category: 'Xử lý chuỗi (Text)',
      items: [
        { name: 'CONCAT(a, b, ...)', syntax: 'CONCAT(', description: 'Nối các chuỗi lại với nhau' },
        { name: 'SUBSTRING(field, start, len)', syntax: 'SUBSTRING(', description: 'Cắt chuỗi từ vị trí với độ dài nhất định' },
        { name: 'UPPER(field)', syntax: 'UPPER(', description: 'Chuyển thành chữ in HOA' },
        { name: 'LOWER(field)', syntax: 'LOWER(', description: 'Chuyển thành chữ thường' },
      ],
    },
    {
      category: 'Xử lý số (Numeric)',
      items: [
        { name: 'ROUND(field, decimals)', syntax: 'ROUND(', description: 'Làm tròn số thập phân' },
        { name: 'COALESCE(v1, v2, ...)', syntax: 'COALESCE(', description: 'Lấy giá trị không rỗng đầu tiên' },
      ],
    },
    {
      category: 'Logic / Thời gian',
      items: [
        { name: 'IF(cond, true, false)', syntax: 'IF(', description: 'Hàm rẽ nhánh điều kiện đơn giản' },
        { name: 'CASE WHEN ... END', syntax: "CASE WHEN {field} = 1 THEN 'Nam' ELSE 'Nữ' END", description: 'Cấu trúc điều kiện rẽ nhánh nâng cao' },
        { name: 'AGE(birthdate)', syntax: 'AGE(', description: 'Tính tuổi dựa trên ngày sinh công dân' },
      ],
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                {editingField ? 'Chỉnh sửa trường tính toán' : 'Thêm trường tính toán'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Tạo trường ảo thông qua Mẫu nghiệp vụ nhanh hoặc Tự biên soạn công thức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Builder Double-Tab Switcher */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preset'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Mẫu thiết lập nhanh (Presets)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'advanced'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Code className="w-4 h-4" />
            Tự soạn thảo nâng cao (Advanced)
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Primary Editors */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 border-r border-slate-100 custom-scrollbar">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold shadow-sm">
                {error}
              </div>
            )}

            {/* Standard Identifiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tên định danh API (Slug-safe Field) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="ho_ten_day_du"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-mono text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Kiểu dữ liệu đầu ra <span className="text-red-500">*</span>
                </label>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  disabled={activeTab === 'preset'} // Presets manage outputs automatically
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="string">String (Chuỗi văn bản)</option>
                  <option value="number">Number (Số học)</option>
                  <option value="datetime">DateTime (Thời gian)</option>
                  <option value="boolean">Boolean (Logic Đúng/Sai)</option>
                </select>
              </div>
            </div>

            {/* Business description */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mô tả nghiệp vụ cột tính toán
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghép họ và tên đầy đủ của công dân từ nguồn dữ liệu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
              />
            </div>

            {/* Tab: Low-Code PRESETS Builder */}
            {activeTab === 'preset' ? (
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chọn mẫu nghiệp vụ nhanh phù hợp
                </label>
                
                {/* Presets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {presets.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPreset(p.id);
                        if (availableFields.length > 0) {
                          setPresetFieldA(availableFields[0].name);
                          if (availableFields.length > 1) {
                            setPresetFieldB(availableFields[1].name);
                          }
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                        selectedPreset === p.id
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-sm shadow-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                        {p.icon}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preset Parameter Inputs */}
                {selectedPreset && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      Cấu hình tham số đầu vào
                    </span>
                    
                    {/* Render input slots based on selected preset requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {presets.find(p => p.id === selectedPreset)?.fieldsCount === 2 ? (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              {presets.find(p => p.id === selectedPreset)?.labelA}
                            </label>
                            <select
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                              value={presetFieldA}
                              onChange={(e) => setPresetFieldA(e.target.value)}
                            >
                              {availableFields.map(f => (
                                <option key={f.name} value={f.name}>{f.name} ({f.description})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              {presets.find(p => p.id === selectedPreset)?.labelB}
                            </label>
                            <select
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                              value={presetFieldB}
                              onChange={(e) => setPresetFieldB(e.target.value)}
                            >
                              {availableFields.map(f => (
                                <option key={f.name} value={f.name}>{f.name} ({f.description})</option>
                              ))}
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {presets.find(p => p.id === selectedPreset)?.labelA}
                          </label>
                          <select
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                            value={presetFieldA}
                            onChange={(e) => setPresetFieldA(e.target.value)}
                          >
                            {availableFields.map(f => (
                              <option key={f.name} value={f.name}>{f.name} ({f.description})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tab: Advanced Free Textarea Formula Editor */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Công thức toán học & Logic tự do
                  </label>
                  <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    💡 Click danh mục bên phải để chèn nhanh
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950 p-2">
                  <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-indigo-400 font-black">
                    EXPRESSION EDITOR
                  </div>
                  <textarea
                    id="formula-textarea"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="VD: CONCAT({ho_ten}, ' - ', UPPER({ma_vinh_vien}))"
                    rows={6}
                    className="w-full bg-transparent border-none focus:outline-none font-mono text-sm text-slate-100 p-2 resize-none custom-scrollbar"
                  />
                </div>
              </div>
            )}

            {/* Smart Simulated Live Output Console - Ultimate Usability */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Response simulated output
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">Biểu thức:</span>
                  <span className="font-mono text-xs text-indigo-400 font-semibold break-all text-right">
                    {formula || 'Chưa thiết lập...'}
                  </span>
                </div>
                
                <div className="h-px bg-slate-800/60 my-1"></div>
                
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">Kết quả chạy thử mẫu:</span>
                  <span className="font-bold text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded shadow-inner animate-pulse">
                    {simulateResult(formula)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Advanced Insert Helpers (Always visible for easy insertions in free text mode) */}
          <div className="w-80 bg-slate-50/50 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar shrink-0">
            
            {/* Database fields reference */}
            <div>
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-500" />
                Trường khả dụng ({availableFields.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {availableFields.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={activeTab === 'preset'} // Disabled in preset tab because fields are chosen via clean dropdown selects
                    onClick={() => insertAtCursor(`{${f.name}}`)}
                    className="w-full text-left px-3 py-2 bg-white hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all flex flex-col gap-0.5 group disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:cursor-not-allowed"
                    title={activeTab === 'preset' ? 'Chọn trực tiếp trong cấu hình tham số Presets' : 'Chèn vào khung soạn thảo'}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono text-slate-800 font-bold group-hover:text-indigo-700 group-disabled:text-slate-500">
                        {`{${f.name}}`}
                      </span>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.2 rounded">
                        {f.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-500/80 truncate w-full group-disabled:text-slate-400">
                      {f.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Helper SQL Functions library */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-500" />
                Thư viện Hàm hỗ trợ
              </h4>
              <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {functions.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {cat.category}
                    </span>
                    <div className="space-y-1">
                      {cat.items.map((func, fIdx) => (
                        <button
                          key={fIdx}
                          type="button"
                          disabled={activeTab === 'preset'}
                          onClick={() => insertAtCursor(func.syntax)}
                          className="w-full text-left p-2 hover:bg-indigo-50/50 rounded border border-transparent hover:border-indigo-100 transition-all flex flex-col gap-0.5 text-xs text-slate-700 hover:text-slate-800 group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed"
                          title={activeTab === 'preset' ? 'Tính năng chỉ khả dụng trong chế độ Tự soạn thảo nâng cao' : 'Chèn vào khung soạn thảo'}
                        >
                          <span className="font-mono font-bold text-slate-700 group-hover:text-indigo-600 group-disabled:text-slate-500">
                            {func.name}
                          </span>
                          <span className="text-[10px] text-slate-400 leading-tight group-disabled:text-slate-400">
                            {func.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all uppercase tracking-widest cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-100 transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu lại
          </button>
        </div>

      </div>
    </div>
  , document.body);
}
