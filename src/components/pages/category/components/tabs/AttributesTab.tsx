import React, { ChangeEvent, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ActionIconButton } from '../../../../common/ActionIconButton';
import { MasterDataEntity, MasterDataAttribute, FieldDataType } from '../../categoryTypes';

interface AttributesTabProps {
  entities: MasterDataEntity[];
  attributes: MasterDataAttribute[];
  selectedEntityId: string;
  setSelectedEntityId: (id: string) => void;
  wizardMode?: boolean;
  wizardEntityId?: string | null;
  selectedAttributes: string[];
  onSelectAttribute: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAddAttribute: () => void;
  onEditAttribute: (attr: MasterDataAttribute) => void;
  onDeleteAttribute: (id: string) => void;
  getDataTypeLabel: (type: FieldDataType) => string;
  onSave?: () => void;
  onSaveAndSubmit?: () => void;
  onCancel?: () => void;
  onSubmitAttribute?: (id: string) => void;
  onApproveAttribute?: (id: string) => void;
  onRejectAttribute?: (id: string) => void;
}

export function AttributesTab({
  entities,
  attributes,
  selectedEntityId,
  setSelectedEntityId,
  wizardMode = false,
  wizardEntityId,
  selectedAttributes,
  onSelectAttribute,
  onSelectAll,
  onAddAttribute,
  onEditAttribute,
  onDeleteAttribute,
  getDataTypeLabel,
  onSave,
  onSaveAndSubmit,
  onCancel,
  onSubmitAttribute = () => {},
  onApproveAttribute = () => {},
  onRejectAttribute = () => {},
}: AttributesTabProps) {
  const currentEntityId = wizardMode ? wizardEntityId : selectedEntityId;
  const currentEntity = entities.find(e => e.id === currentEntityId);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDataType, setFilterDataType] = useState('all');

  // Filter Logic
  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          attr.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attr.status === filterStatus;
    const matchesDataType = filterDataType === 'all' || attr.dataType === filterDataType;
    return matchesSearch && matchesStatus && matchesDataType;
  });

  return (
    <div className="space-y-4">
      {/* Entity Selector (Only if not in wizard) */}
      {!wizardMode && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm text-black mb-2 font-bold">
            Chọn thực thể dữ liệu chủ <span className="text-red-600">*</span>
          </label>
          <select
            title="Chọn thực thể"
            value={selectedEntityId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEntityId(e.target.value)}
            className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium"
          >
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.code} - {entity.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trường hoặc tên hiển thị..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            title="Lọc trạng thái"
            value={filterStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white min-w-[140px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="draft">Bản nháp</option>
          </select>
          <select
            title="Lọc kiểu dữ liệu"
            value={filterDataType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterDataType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white min-w-[140px]"
          >
            <option value="all">Tất cả kiểu dữ liệu</option>
            <option value="string">Chuỗi</option>
            <option value="number">Số</option>
            <option value="date">Ngày tháng</option>
            <option value="boolean">Logic</option>
          </select>
        </div>
      </div>

      {/* Summary and Add Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-slate-600">Đang quản lý thuộc tính của: </span>
          <span className="text-slate-900 font-bold">
            {currentEntity?.name || 'Chưa chọn thực thể'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!wizardMode && onSaveAndSubmit && (
            <button 
 onClick={onSaveAndSubmit} 
 className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm shadow-md shadow-emerald-100"
 >
              Lưu & trình duyệt
            </button>
          )}
          <button
 onClick={onAddAttribute}
 className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-100"
 >
            <Plus className="w-4 h-4" />
            Thêm thuộc tính
          </button>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-[#f8fafc] border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  onChange={(e: any) => onSelectAll(e.target.checked)} 
                  checked={attributes.length > 0 && selectedAttributes.length === attributes.length} 
                  className="rounded border-slate-300" 
                  title="Chọn tất cả"
                />
              </th>
              <th className="text-left px-4 py-3 text-[14px] font-medium text-slate-700">Tên trường</th>
              <th className="text-left px-4 py-3 text-[14px] font-medium text-slate-700">Tên hiển thị</th>
              <th className="text-left px-4 py-3 text-[14px] font-medium text-slate-700">Kiểu dữ liệu</th>
              <th className="text-left px-4 py-3 text-[14px] font-medium text-slate-700">Ràng buộc</th>
              <th className="text-left px-4 py-3 text-[14px] font-medium text-slate-700">Trạng thái</th>
              <th className="text-right px-4 py-3 text-[14px] font-medium text-slate-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAttributes.map((attr) => {
              const isLocked = attr.status === 'approved' || attr.status === 'pending';
              
              return (
                <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedAttributes.includes(attr.id)} 
                      onChange={() => onSelectAttribute(attr.id)} 
                      className="rounded border-slate-300" 
                      title={`Chọn ${attr.fieldName}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 font-mono">{attr.fieldName}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{attr.displayName}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{getDataTypeLabel(attr.dataType)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {attr.required && <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                      {attr.unique && <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                      {attr.indexed && <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      attr.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      attr.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {attr.status === 'approved' ? 'Đã duyệt' : attr.status === 'pending' ? 'Chở duyệt' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
                      <ActionIconButton 
                        action="submit" 
                        onClick={() => onSubmitAttribute(attr.id)} 
                        disabled={isLocked}
                        title={attr.status === 'approved' ? "Đã duyệt" : (attr.status === 'pending' ? "Đang chờ duyệt" : "Trình duyệt")} 
                      />
                      
                      <div className="w-px h-4 bg-slate-200 mx-1"></div>
                      
                      <ActionIconButton 
                        action="edit" 
                        onClick={() => onEditAttribute(attr)} 
                        disabled={isLocked}
                        title="Sửa" 
                      />
                      <ActionIconButton 
                        action="delete" 
                        onClick={() => onDeleteAttribute(attr.id)} 
                        disabled={isLocked}
                        title="Xóa" 
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {attributes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                  Chưa có thuộc tính nào được định nghĩa cho thực thể này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
