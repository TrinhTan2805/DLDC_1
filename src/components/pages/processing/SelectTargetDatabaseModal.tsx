import React, { useState } from 'react';
import { Database, Server, ArrowRight } from 'lucide-react';
import { initialTargetDatabases, TargetDatabase } from './mockTargetDatabases';
import { BaseModal } from '../../common/BaseModal';

interface SelectTargetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (db: TargetDatabase) => void;
}

export function SelectTargetDatabaseModal({ isOpen, onClose, onContinue }: SelectTargetDatabaseModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    const selectedDb = initialTargetDatabases.find(db => db.id === selectedId);
    if (selectedDb) {
      onContinue(selectedDb);
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button 
        onClick={onClose}
        style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
        className="text-[13px] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
      >
        Hủy
      </button>
      <button 
        onClick={handleContinue}
        disabled={!selectedId}
        style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
        className={`flex items-center gap-2 text-[13px] text-white transition-all shadow-md ${
          selectedId 
            ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
            : 'bg-slate-300 cursor-not-allowed shadow-none'
        }`}
      >
        Tiếp theo
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Chọn Cơ sở dữ liệu đích"
        subtitle="Vui lòng chọn một kết nối CSDL để thực hiện ánh xạ"
        maxWidth="max-w-2xl"
        className="force-13px"
        customHeaderIcon={
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
            <Database className="w-6 h-6" />
          </div>
        }
        footer={footer}
      >
        <div className="space-y-4 py-2">
          {initialTargetDatabases.map((db) => (
            <label 
              key={db.id}
              onClick={() => setSelectedId(db.id)}
              className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                selectedId === db.id 
                  ? 'border-blue-500 bg-blue-50/40 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50/50'
              }`}
            >
              <div className="pt-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedId === db.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}>
                  {selectedId === db.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-800 text-[13px]">{db.name}</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {db.type}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-[13px] text-slate-500 font-medium">
                  <span className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-slate-700">{db.host}:{db.port}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">Schema:</span> 
                    <span className="font-mono text-slate-700">{db.schema}</span>
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </BaseModal>
    </div>
  );
}
