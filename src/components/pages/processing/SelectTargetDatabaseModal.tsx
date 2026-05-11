import React, { useState } from 'react';
import { X, Database, Server } from 'lucide-react';
import { initialTargetDatabases, TargetDatabase } from './mockTargetDatabases';

interface SelectTargetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (db: TargetDatabase) => void;
}

export function SelectTargetDatabaseModal({ isOpen, onClose, onContinue }: SelectTargetDatabaseModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    const selectedDb = initialTargetDatabases.find(db => db.id === selectedId);
    if (selectedDb) {
      onContinue(selectedDb);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] font-sans p-4 animate-in fade-in duration-200"
      style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chọn Cơ sở dữ liệu đích</h2>
              <p className="text-sm text-slate-500">Vui lòng chọn một kết nối CSDL để thực hiện ánh xạ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {initialTargetDatabases.map((db) => (
              <label 
                key={db.id}
                onClick={() => setSelectedId(db.id)}
                className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedId === db.id 
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="pt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedId === db.id ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {selectedId === db.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-800">{db.name}</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {db.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Server className="w-4 h-4 text-slate-400" />
                      {db.host}:{db.port}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Schema:</span> <span className="font-mono text-slate-600">{db.schema}</span>
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleContinue}
            disabled={!selectedId}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
              selectedId 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Tiếp theo
          </button>
        </div>

      </div>
    </div>
  );
}
