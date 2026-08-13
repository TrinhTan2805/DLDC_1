import React, { useState } from 'react';
import { History, GitCompare } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { EntityVersionDiffModal, EntityVersionDiff } from './EntityVersionDiffModal';

// ── Kiểu dữ liệu lịch sử phiên bản ──────────────────────────────────────────

interface VersionHistoryItem {
  id: string;
  versionFrom: number;
  versionTo: number;
  date: string;
  effectiveDate: string;
  author: string;
  changeType: 'structure' | 'data' | 'relationship' | 'general';
  description: string;
  diff: EntityVersionDiff;
  status: 'active' | 'archived' | 'draft' | 'pending';
}

// ── Mock data theo entity ─────────────────────────────────────────────────────

const MOCK_HISTORY: Record<string, VersionHistoryItem[]> = {
  default: [
    {
      id: 'v3',
      versionFrom: 2, versionTo: 3,
      date: '20/06/2026 08:15',
      effectiveDate: '25/06/2026',
      author: 'Nguyễn Văn A',
      changeType: 'structure',
      status: 'active',
      description: 'Thêm trường phone_code, cập nhật độ dài gender_code, xóa trường note',
      diff: {
        prevVersion: 2, currentVersion: 3,
        generalRows: [
          { label: 'Mô tả',              oldValue: 'Danh mục giới tính chuẩn quốc gia theo ISO 5218', newValue: 'Danh mục giới tính chuẩn quốc gia theo ISO/IEC 5218:2004' },
          { label: 'Phạm vi',            oldValue: 'Cấp quốc gia',      newValue: 'Cấp quốc gia' },
          { label: 'Trạng thái hiệu lực', oldValue: 'Đang soạn thảo',    newValue: 'Hiệu lực' },
        ],
        structureRows: [
          { changeType: 'unchanged', fieldName: 'id',          displayName: 'Mã bản ghi',    oldDataType: 'Số (Number)',        newDataType: 'Số (Number)' },
          { changeType: 'added',     fieldName: 'phone_code',  displayName: 'Mã điện thoại', newDataType: 'Chuỗi (String)',     newExtra: 'Độ dài: 6' },
          { changeType: 'modified',  fieldName: 'gender_code', displayName: 'Mã giới tính',  oldDataType: 'Chuỗi (String)',    newDataType: 'Chuỗi (String)', oldExtra: 'Độ dài: 2', newExtra: 'Độ dài: 10' },
          { changeType: 'unchanged', fieldName: 'gender_name', displayName: 'Tên giới tính', oldDataType: 'Chuỗi (String)',    newDataType: 'Chuỗi (String)' },
          { changeType: 'removed',   fieldName: 'note',        displayName: 'Ghi chú',       oldDataType: 'Văn bản dài (Text)' },
        ],
        relationshipRows: [
          { changeType: 'added',     sourceEntity: 'Danh mục giới tính', targetEntity: 'Danh mục mã số hộ tịch', newRelType: '1-n' },
          { changeType: 'unchanged', sourceEntity: 'Danh mục giới tính', targetEntity: 'Danh mục dân tộc',       oldRelType: 'n-n', newRelType: 'n-n' },
        ],
      },
    },
    {
      id: 'v2',
      versionFrom: 1, versionTo: 2,
      date: '12/03/2026 14:30',
      effectiveDate: '15/03/2026',
      author: 'Trần Thị B',
      changeType: 'general',
      status: 'archived',
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
        relationshipRows: [
          { changeType: 'unchanged', sourceEntity: 'Danh mục giới tính', targetEntity: 'Danh mục dân tộc', oldRelType: 'n-n', newRelType: 'n-n' },
        ],
      },
    },
    {
      id: 'v1',
      versionFrom: 0, versionTo: 1,
      date: '10/01/2026 08:00',
      effectiveDate: '15/01/2026',
      author: 'Lê Văn C',
      changeType: 'structure',
      status: 'archived',
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
        relationshipRows: [
          { changeType: 'added', sourceEntity: 'Danh mục giới tính', targetEntity: 'Danh mục dân tộc', newRelType: 'n-n' },
        ],
      },
    },
  ],
};

const getHistory = (_entity: MasterDataEntity): VersionHistoryItem[] => {
  return MOCK_HISTORY['default'];
};

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
}

export function EntityVersionHistoryModal({ isOpen, onClose, entity }: Props) {
  const [selectedItem, setSelectedItem] = useState(null as VersionHistoryItem | null);
  const [historyList, setHistoryList] = useState<VersionHistoryItem[]>([]);

  React.useEffect(() => {
    if (entity) {
      setHistoryList(getHistory(entity));
    }
  }, [entity]);

  if (!isOpen || !entity) return null;

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Quản lý phiên bản danh mục"
        subtitle={entity.name}
        maxWidth="max-w-4xl"
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
        <div className="space-y-4">
          {/* Main Grid Table - cùng cột với danh sách báo cáo phiên bản danh mục */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 w-12 text-center">STT</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày thay đổi</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày hiệu lực</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người thay đổi</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700">Nội dung thay đổi</th>
                    <th className="px-5 py-4 text-[13px] font-semibold text-slate-700 text-center w-16">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {historyList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                      <td className="px-5 py-4 text-[13px] text-slate-500 text-center">{index + 1}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[12px] font-semibold">
                          v{item.versionTo}.0
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">{item.date}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">{item.effectiveDate || '--'}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-800 whitespace-nowrap">{item.author}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-700">{item.description}</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="So sánh với phiên bản trước đó"
                        >
                          <GitCompare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {historyList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-slate-400 italic">
                        Chưa có lịch sử phiên bản
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
