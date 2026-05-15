import React, { useState } from 'react';
import { X, Search, Database, Plus, Trash2, Merge, Split } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

interface MergeSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceFields: any[];
  onMergeSubmit: (data: any) => void;
  onSplitSubmit: (data: any) => void;
  initialData?: any;
  mode?: 'merge' | 'split';
}

export function MergeSplitModal({ isOpen, onClose, sourceFields, onMergeSubmit, onSplitSubmit, initialData, mode }: MergeSplitModalProps) {
  const [activeTab, setActiveTab] = useState<'merge' | 'split'>(mode || 'merge');
  const [mergeName, setMergeName] = useState(initialData?.name || '');
  const [mergeType, setMergeType] = useState(initialData?.type || 'NVARCHAR');
  const [mergeSeparator, setMergeSeparator] = useState(initialData?.separator || '');
  const [selectedMergeFields, setSelectedMergeFields] = useState<string[]>(initialData?.fields || []);

  const [splitSource, setSplitSource] = useState(initialData?.source || '');
  const [splitResults, setSplitResults] = useState(initialData?.results || [{ id: '1', name: 'Tên cột 1', type: 'NVARCHAR', regex: '' }, { id: '2', name: 'Tên cột 2', type: 'NVARCHAR', regex: '' }]);

  // Reset state when modal opens or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(mode || 'merge');
      setMergeName(initialData?.name || '');
      setMergeType(initialData?.type || 'NVARCHAR');
      setMergeSeparator(initialData?.separator || '');
      setSelectedMergeFields(initialData?.fields || []);
      
      setSplitSource(initialData?.source || '');
      setSplitResults(initialData?.results || [
        { id: '1', name: 'Tên cột 1', type: 'NVARCHAR', regex: '' }, 
        { id: '2', name: 'Tên cột 2', type: 'NVARCHAR', regex: '' }
      ]);
    }
  }, [isOpen, initialData, mode]);

  const toggleMergeField = (name: string) => {
    setSelectedMergeFields(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);
  };

  const addSplitResult = () => {
    setSplitResults([...splitResults, { id: Date.now().toString(), name: `Tên cột ${splitResults.length + 1}`, type: 'NVARCHAR', regex: '' }]);
  };

  const updateSplitResult = (id: string, field: string, value: string) => {
    setSplitResults(splitResults.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeSplitResult = (id: string) => {
    setSplitResults(splitResults.filter(r => r.id !== id));
  };

  const handleSubmit = () => {
    if (activeTab === 'merge') {
      onMergeSubmit({
        name: mergeName,
        type: mergeType,
        separator: mergeSeparator,
        fields: selectedMergeFields
      });
    } else {
      onSplitSubmit({
        source: splitSource,
        rule: 'Regex',
        results: splitResults
      });
    }
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
      <div className="text-[12px] font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
        Tạo {activeTab === 'merge' ? selectedMergeFields.length : splitResults.length} trường {activeTab === 'merge' ? 'gộp' : 'tách'} mới
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
          className="text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
          className="text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Gộp / Tách cột"
        subtitle="Tạo trường mới từ các cột nguồn trước khi ánh xạ"
        maxWidth="max-w-2xl"
        showCloseButton={true}
        customHeaderIcon={<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-3"><Merge className="w-5 h-5" /></div>}
        footer={footer}
      >
      <div className="flex flex-col gap-6 p-1">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button 
            onClick={() => setActiveTab('merge')}
            style={{ borderRadius: '6px', fontWeight: 500 }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-all ${activeTab === 'merge' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Merge className="w-4 h-4" />
            Gộp cột
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            style={{ borderRadius: '6px', fontWeight: 500 }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-all ${activeTab === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Split className="w-4 h-4" />
            Tách cột
          </button>
        </div>

        {activeTab === 'merge' ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700">Tên cột gộp</label>
                <input 
                  type="text" 
                  placeholder="VD: HOTEN_DAYDU" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={mergeName}
                  onChange={e => setMergeName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700">Loại dữ liệu</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  value={mergeType}
                  onChange={e => setMergeType(e.target.value)}
                >
                  <option>NVARCHAR</option>
                  <option>VARCHAR</option>
                  <option>INT</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-700">Ký tự nối</label>
              <input 
                type="text" 
                placeholder="VD: khoảng trắng, dấu phẩy..." 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={mergeSeparator}
                onChange={e => setMergeSeparator(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-700">Chọn cột để gộp ({selectedMergeFields.length} đã chọn)</label>
              <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {sourceFields.map((field, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleMergeField(field.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedMergeFields.includes(field.name) ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="font-bold text-[11px] text-slate-800">{field.name}</div>
                    <div className="text-[9px] text-slate-500">{field.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800">Cột nguồn</label>
              <select 
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                value={splitSource}
                onChange={e => setSplitSource(e.target.value)}
              >
                <option value="">-- Chọn cột --</option>
                {sourceFields.map((f, i) => <option key={i} value={f.name}>{f.name}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800">Các cột kết quả</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mỗi cột nhập một biểu thức Regex áp dụng trên cột nguồn để lấy giá trị.</p>
                </div>
                <button
                  onClick={addSplitResult}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: 500 }}
                  className="flex items-center gap-1.5 text-[12px] text-[#020817] bg-white border border-[#e2e8f0] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm cột
                </button>
              </div>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {splitResults.map((res, idx) => (
                  <div key={res.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                        #{idx + 1}
                      </div>
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                        placeholder={`Tên cột ${idx + 1}`}
                        value={res.name}
                        onChange={(e) => updateSplitResult(res.id, 'name', e.target.value)}
                      />
                      <select 
                        className="w-[130px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                        value={res.type}
                        onChange={(e) => updateSplitResult(res.id, 'type', e.target.value)}
                      >
                        <option>NVARCHAR</option>
                        <option>VARCHAR</option>
                        <option>INT</option>
                      </select>
                      <button onClick={() => removeSplitResult(res.id)} className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="pl-9">
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 focus:outline-none focus:border-blue-500 bg-white"
                        placeholder="Biểu thức Regex (VD: ^(\d{4}) hoặc nhóm bắt (.+)@)"
                        value={res.regex || ''}
                        onChange={(e) => updateSplitResult(res.id, 'regex', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </BaseModal>
    </div>
  );
}
