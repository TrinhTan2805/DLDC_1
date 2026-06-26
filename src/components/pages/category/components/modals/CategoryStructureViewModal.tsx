import { useState, ChangeEvent } from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { MasterDataEntity, MasterDataAttribute, EntityRelationship, FieldDataType, RelationshipType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

interface CategoryStructureViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  attributes: MasterDataAttribute[];
  relationships: EntityRelationship[];
  requestStatus?: string;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
}

const fieldTypeLabels: Record<FieldDataType, string> = {
  string: 'Chuỗi (String)',
  number: 'Số (Number)',
  date: 'Ngày (Date)',
  datetime: 'Ngày giờ (DateTime)',
  boolean: 'Logic (Boolean)',
  text: 'Văn bản dài (Text)',
  email: 'Email',
  phone: 'Số điện thoại',
  url: 'URL',
};

const relationTypeColors: Record<RelationshipType, string> = {
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
};

export function CategoryStructureViewModal({
  isOpen,
  onClose,
  entity,
  attributes,
  relationships,
  requestStatus,
  onApprove,
  onReject,
}: CategoryStructureViewModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  const entityRelationships = relationships.filter(
    r => r.sourceEntityId === entity.id || r.targetEntityId === entity.id
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông tin cấu trúc & quan hệ"
      subtitle="Cấu hình tại bước 2 & 3 — Thiết lập danh mục dùng chung"
      maxWidth="max-w-5xl"
      customHeaderIcon={
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mr-3 shrink-0">
          <Layers className="w-5 h-5 text-indigo-600" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Đóng
          </button>
          {(requestStatus === 'pending' || !requestStatus) && (
            <div className="flex gap-2">
              <button
                onClick={() => onReject(note)}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[13px] shadow-sm shadow-red-100"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={() => onApprove(note)}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-sm shadow-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">

        {/* Tên danh mục */}
        <div className="text-[13px]">
          <span className="text-slate-500">Tên danh mục: </span>
          <span className="font-semibold text-slate-800">{entity.name}</span>
        </div>

        {/* Thiết lập cấu trúc */}
        <div>
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Thiết lập cấu trúc
            <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[13px] font-medium normal-case">
              {attributes.length} trường
            </span>
          </div>
          {attributes.length === 0 ? (
            <div className="text-[13px] text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded-xl">
              Chưa có trường dữ liệu nào
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="w-12 px-6 py-4 text-[13px] font-semibold text-slate-700 text-center">STT</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Độ dài</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Cấu hình khóa</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ràng buộc</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Giá trị mặc định</th>
                      <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Quy tắc xác thực</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {attributes.map((attr, idx) => (
                      <tr key={attr.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100">
                        <td className="px-6 py-4 text-center text-[13px] text-slate-600 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-900 font-mono">{attr.fieldName || '--'}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-900 font-medium">{attr.displayName || '--'}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-medium">{attr.dataType ? (fieldTypeLabels[attr.dataType] ?? attr.dataType) : '--'}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-600">{attr.length ?? '--'}</td>
                        <td className="px-6 py-4">
                          {attr.keyType === 'primary' || attr.keyType === 'foreign' ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {attr.keyType === 'primary' && (
                                <span className="px-2 py-0.5 rounded text-[13px] bg-amber-50 text-amber-700 font-bold border border-amber-200">PK</span>
                              )}
                              {attr.keyType === 'foreign' && (
                                <span className="px-2 py-0.5 rounded text-[13px] bg-teal-50 text-teal-700 font-bold border border-teal-200">FK</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[13px]">--</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {attr.required || attr.unique || (attr as any).indexed ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {attr.required && <span className="px-2 py-0.5 rounded text-[13px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                              {attr.unique   && <span className="px-2 py-0.5 rounded text-[13px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                              {(attr as any).indexed && <span className="px-2 py-0.5 rounded text-[13px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[13px]">--</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[13px] text-slate-600 text-center">{attr.defaultValue || '--'}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-500 max-w-[160px] truncate" title={attr.validationRules}>{attr.validationRules || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Thiết lập quan hệ */}
        <div>
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Thiết lập quan hệ
            <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[13px] font-medium normal-case">
              {entityRelationships.length} quan hệ
            </span>
          </div>
          {entityRelationships.length === 0 ? (
            <div className="text-[13px] text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded-xl">
              Chưa có quan hệ nào
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px] w-16 text-center">STT</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Danh mục Nguồn</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Khóa Nguồn</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px] text-center w-28">Loại</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Danh mục Đích</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Khóa Đích</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-[13px]">Trường hiển thị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entityRelationships.map((rel, idx) => {
                      const isSourceCurrent = rel.sourceEntityId === entity.id;
                      return (
                        <tr key={rel.id} className="hover:bg-slate-50/50 transition-colors text-[13px]">
                          <td className="px-6 py-4 text-center text-slate-500 font-medium text-[13px]">{idx + 1}</td>
                          <td className="px-6 py-4 text-[13px]">
                            <div className={`${isSourceCurrent ? 'text-blue-600' : 'text-slate-800'} text-[13px]`}>
                              {rel.sourceEntityName || rel.sourceEntityId}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600 text-[13px]">{rel.sourceKey || '--'}</td>
                          <td className="px-6 py-4 text-center text-[13px]">
                            <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold whitespace-nowrap ${relationTypeColors[rel.relationshipType]}`}>
                              {rel.relationshipType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[13px]">
                            <div className={`${!isSourceCurrent ? 'text-blue-600' : 'text-slate-800'} text-[13px]`}>
                              {rel.targetEntityName || rel.targetEntityId}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600 text-[13px]">{rel.targetKey || '--'}</td>
                          <td className="px-6 py-4 text-slate-600 text-[13px]">
                            {rel.relationshipType === 'n-n' ? (
                              <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-mono text-[13px]">{rel.mappingTable || '--'}</code>
                            ) : (
                              rel.targetDisplayField
                                ? <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[13px]">{rel.targetDisplayField}</code>
                                : <span className="text-slate-400 text-[13px]">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Ý kiến phê duyệt */}
        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-slate-700">Ý kiến phê duyệt</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
            placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối (nếu có)..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
          />
        </div>

      </div>
    </BaseModal>
  );
}
