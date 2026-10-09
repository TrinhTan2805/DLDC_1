import React, { useState } from 'react';
import { Database, Server, ArrowRight, Search } from 'lucide-react';
import { initialTargetDatabases, TargetDatabase } from './mockTargetDatabases';
import { BaseModal } from '../../common/BaseModal';
import { BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS, normalizeSearch } from '../collection/collectionUi';

interface SelectTargetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (db: TargetDatabase) => void;
}

export function SelectTargetDatabaseModal({ isOpen, onClose, onContinue }: SelectTargetDatabaseModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleContinue = () => {
    const selectedDb = initialTargetDatabases.find(db => db.id === selectedId);
    if (selectedDb) {
      onContinue(selectedDb);
    }
  };

  // Lọc theo tên, host, port, schema, loại CSDL — không phân biệt hoa/thường và dấu
  const q = normalizeSearch(search);
  const filteredDatabases = q
    ? initialTargetDatabases.filter(db =>
      [db.name, db.host, db.port, db.schema, db.type, `${db.host}:${db.port}`].some(v => normalizeSearch(v).includes(q)))
    : initialTargetDatabases;

  const handleCardKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedId(id);
    }
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} className={BTN_OUTLINE}>
        Hủy
      </button>
      <button type="button" onClick={handleContinue} disabled={!selectedId} className={BTN_PRIMARY}>
        Tiếp theo
        <ArrowRight className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn Cơ sở dữ liệu đích"
      subtitle="Vui lòng chọn một kết nối CSDL để thực hiện ánh xạ"
      maxWidth="max-w-[600px]"
      customHeaderIcon={
        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-blue-600 mr-3">
          <Database className="w-5 h-5" />
        </div>
      }
      footer={footer}
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, host, port, schema hoặc loại CSDL..."
            aria-label="Tìm kiếm CSDL đích"
            className={`${INPUT_CLS} pl-9`}
          />
        </div>

        {filteredDatabases.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</p>
        ) : (
          <div role="radiogroup" aria-label="Cơ sở dữ liệu đích" className="space-y-3">
            {filteredDatabases.map((db) => {
              const isSelected = selectedId === db.id;
              return (
                <div
                  key={db.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedId(db.id)}
                  onKeyDown={(e) => handleCardKeyDown(e, db.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border bg-white cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isSelected
                    ? 'border-blue-600 ring-1 ring-blue-600'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-600' : 'border-[#CBD5E1] bg-white'}`}
                  >
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#020817] truncate">{db.name}</div>
                    <div className="mt-1 flex items-center gap-x-4 gap-y-1 flex-wrap text-[12px] text-[#64748B]">
                      <span className="inline-flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 shrink-0" />
                        {db.host}:{db.port}
                      </span>
                      <span>
                        <span className="font-medium">Schema:</span> {db.schema}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center h-6 px-2.5 rounded-full bg-[#F1F5F9] text-[12px] font-semibold text-[#020817] whitespace-nowrap">
                    {db.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
