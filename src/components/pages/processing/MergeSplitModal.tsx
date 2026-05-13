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
  const [splitRule, setSplitRule] = useState(initialData?.rule || 'Theo ký tự phân tách');
  const [splitSeparator, setSplitSeparator] = useState(initialData?.separator || '');
  const [splitResults, setSplitResults] = useState(initialData?.results || [{ id: '1', name: 'Tên cột 1', type: 'NVARCHAR' }, { id: '2', name: 'Tên cột 2', type: 'NVARCHAR' }]);

  // Reset state when modal opens or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(mode || 'merge');
      setMergeName(initialData?.name || '');
      setMergeType(initialData?.type || 'NVARCHAR');
      setMergeSeparator(initialData?.separator || '');
      setSelectedMergeFields(initialData?.fields || []);
      
      setSplitSource(initialData?.source || '');
      setSplitRule(initialData?.rule || 'Theo ký tự phân tách');
      setSplitSeparator(initialData?.separator || '');
      setSplitResults(initialData?.results || [
        { id: '1', name: 'Tên cột 1', type: 'NVARCHAR' }, 
        { id: '2', name: 'Tên cột 2', type: 'NVARCHAR' }
      ]);
    }
  }, [isOpen, initialData, mode]);

  const toggleMergeField = (name: string) => {
    setSelectedMergeFields(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);
  };

  const addSplitResult = () => {
    setSplitResults([...splitResults, { id: Date.now().toString(), name: `Tên cột ${splitResults.length + 1}`, type: 'NVARCHAR' }]);
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
        rule: splitRule,
        separator: splitSeparator,
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
        <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Hủy
        </button>
        <button onClick={handleSubmit} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Xác nhận
        </button>
      </div>
    </div>
  );

  return (
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
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setActiveTab('merge')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'merge' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Merge className="w-4 h-4" />
            Gộp cột
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-700">Cột nguồn</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                value={splitSource}
                onChange={e => setSplitSource(e.target.value)}
              >
                <option value="">-- Chọn cột --</option>
                {sourceFields.map((f, i) => <option key={i} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700">Quy tắc tách</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  value={splitRule}
                  onChange={e => setSplitRule(e.target.value)}
                >
                  <option>Theo ký tự phân tách</option>
                  <option>Theo độ dài cố định</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700">Ký tự phân tách</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={splitSeparator}
                  onChange={e => setSplitSeparator(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-700">Các cột kết quả</label>
                <button onClick={addSplitResult} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                  <Plus className="w-3 h-3" />
                  Thêm cột
                </button>
              </div>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {splitResults.map((res, idx) => (
                  <div key={res.id} className="flex items-center gap-3">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder={`Tên cột ${idx + 1}`}
                      defaultValue={res.name}
                    />
                    <select className="w-[120px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option>NVARCHAR</option>
                      <option>VARCHAR</option>
                    </select>
                    <button onClick={() => removeSplitResult(res.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
