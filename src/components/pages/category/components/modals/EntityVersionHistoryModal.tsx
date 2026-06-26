import React from 'react';
import { History, Eye, Layers, Link2, Info, Clock } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { EntityVersionDiffModal, EntityVersionDiff } from './EntityVersionDiffModal';

// ── Kiểu dữ liệu lịch sử phiên bản ──────────────────────────────────────────

interface VersionHistoryItem {
  id: string;
  versionFrom: number;
  versionTo: number;
  date: string;
  author: string;
  changeType: 'structure' | 'data' | 'relationship' | 'general';
  description: string;
  diff: EntityVersionDiff;
}

// ── Màu badge loại thay đổi ───────────────────────────────────────────────────

const changeTypeConfig = {
  structure:    { label: 'Cấu trúc',        color: 'bg-purple-50 text-purple-700 border-purple-200',   icon: Layers },
  relationship: { label: 'Quan hệ',          color: 'bg-teal-50 text-teal-700 border-teal-200',         icon: Link2 },
  general:      { label: 'Thông tin chung',  color: 'bg-slate-100 text-slate-600 border-slate-200',     icon: Info },
  data:         { label: 'Dữ liệu',          color: 'bg-blue-50 text-blue-700 border-blue-200',         icon: Clock },
};

// ── Mock data theo entity ─────────────────────────────────────────────────────

const MOCK_HISTORY: Record<string, VersionHistoryItem[]> = {
  default: [
    {
      id: 'v3',
      versionFrom: 2, versionTo: 3,
      date: '20/06/2026 08:15',
      author: 'Nguyễn Văn A',
      changeType: 'structure',
      description: 'Thêm trường phone_code, cập nhật độ dài gender_code, xóa trường note',
      diff: {
        prevVersion: 2, currentVersion: 3,
        generalRows: [],
        structureRows: [
          { changeType: 'unchanged', fieldName: 'id',          displayName: 'Mã bản ghi',    oldDataType: 'Số (Number)',        newDataType: 'Số (Number)' },
          { changeType: 'added',     fieldName: 'phone_code',  displayName: 'Mã điện thoại', newDataType: 'Chuỗi (String)',     newExtra: 'Độ dài: 6' },
          { changeType: 'modified',  fieldName: 'gender_code', displayName: 'Mã giới tính',  oldDataType: 'Chuỗi (String)',    newDataType: 'Chuỗi (String)', oldExtra: 'Độ dài: 2', newExtra: 'Độ dài: 10' },
          { changeType: 'unchanged', fieldName: 'gender_name', displayName: 'Tên giới tính', oldDataType: 'Chuỗi (String)',    newDataType: 'Chuỗi (String)' },
          { changeType: 'removed',   fieldName: 'note',        displayName: 'Ghi chú',       oldDataType: 'Văn bản dài (Text)' },
        ],
        relationshipRows: [],
      },
    },
    {
      id: 'v2',
      versionFrom: 1, versionTo: 2,
      date: '12/03/2026 14:30',
      author: 'Trần Thị B',
      changeType: 'general',
      description: 'Cập nhật đơn vị chủ quản và nguồn dữ liệu',
      diff: {
        prevVersion: 1, currentVersion: 2,
        generalRows: [
          { label: 'Đơn vị chủ quản', oldValue: 'Bộ Nội vụ',                   newValue: 'Bộ Tư pháp' },
          { label: 'Nguồn dữ liệu',   oldValue: 'Tự cập nhật trực tiếp',        newValue: 'Đồng bộ Kho DLDC' },
          { label: 'Mô tả',           oldValue: 'Danh mục giới tính',            newValue: 'Danh mục giới tính chuẩn quốc gia theo ISO 5218' },
        ],
        structureRows: [
          { changeType: 'unchanged', fieldName: 'id',          displayName: 'Mã bản ghi',    oldDataType: 'Số (Number)',     newDataType: 'Số (Number)' },
          { changeType: 'unchanged', fieldName: 'gender_code', displayName: 'Mã giới tính',  oldDataType: 'Chuỗi (String)', newDataType: 'Chuỗi (String)' },
          { changeType: 'unchanged', fieldName: 'gender_name', displayName: 'Tên giới tính', oldDataType: 'Chuỗi (String)', newDataType: 'Chuỗi (String)' },
          { changeType: 'unchanged', fieldName: 'note',        displayName: 'Ghi chú',       oldDataType: 'Văn bản dài (Text)', newDataType: 'Văn bản dài (Text)' },
        ],
        relationshipRows: [],
      },
    },
    {
      id: 'v1',
      versionFrom: 0, versionTo: 1,
      date: '10/01/2026 08:00',
      author: 'Lê Văn C',
      changeType: 'structure',
      description: 'Khởi tạo cấu trúc ban đầu',
      diff: {
        prevVersion: 0, currentVersion: 1,
        generalRows: [
          { label: 'Tên danh mục',   oldValue: '--', newValue: 'Dữ liệu Danh mục giới tính' },
          { label: 'Đơn vị chủ quản', oldValue: '--', newValue: 'Bộ Nội vụ' },
          { label: 'Nguồn dữ liệu',  oldValue: '--', newValue: 'Tự cập nhật trực tiếp' },
        ],
        structureRows: [
          { changeType: 'added', fieldName: 'id',          displayName: 'Mã bản ghi',    newDataType: 'Số (Number)' },
          { changeType: 'added', fieldName: 'gender_code', displayName: 'Mã giới tính',  newDataType: 'Chuỗi (String)', newExtra: 'Độ dài: 2' },
          { changeType: 'added', fieldName: 'gender_name', displayName: 'Tên giới tính', newDataType: 'Chuỗi (String)', newExtra: 'Độ dài: 100' },
          { changeType: 'added', fieldName: 'note',        displayName: 'Ghi chú',       newDataType: 'Văn bản dài (Text)' },
        ],
        relationshipRows: [],
      },
    },
  ],
};

const getHistory = (_entity: MasterDataEntity): VersionHistoryItem[] => {
  // Mỗi entity dùng default mock, label theo tên entity
  return MOCK_HISTORY['default'];
};

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
}

export function EntityVersionHistoryModal({ isOpen, onClose, entity }: Props) {
  const [selectedItem, setSelectedItem] = React.useState(null as VersionHistoryItem | null);

  if (!isOpen || !entity) return null;

  const history = getHistory(entity);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Lịch sử phiên bản"
        subtitle={entity.name}
        maxWidth="max-w-3xl"
        customHeaderIcon={
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mr-3 shrink-0">
            <History className="w-5 h-5 text-violet-600" />
          </div>
        }
        footer={
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Đóng
          </button>
        }
      >
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 w-12 text-center">STT</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người thực hiện</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thời gian</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Loại thay đổi</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {history.map((item, index) => {
                  const cfg = changeTypeConfig[item.changeType];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                      <td className="px-5 py-4 text-[13px] text-slate-500 text-center">{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[12px] border border-slate-200 font-mono">
                            v{item.versionFrom}.0
                          </span>
                          <span className="text-slate-300 text-[11px]">→</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[12px] border border-blue-100 font-bold font-mono">
                            v{item.versionTo}.0
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-800 whitespace-nowrap">{item.author}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">{item.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded border text-[13px] font-medium whitespace-nowrap ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 text-blue-600 rounded-lg text-[13px] hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-slate-400 italic">
                      Chưa có lịch sử phiên bản
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </BaseModal>

      {/* Diff modal — stacked on top */}
      {selectedItem && (
        <EntityVersionDiffModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          entityName={entity.name}
          diff={selectedItem.diff}
        />
      )}
    </>
  );
}
