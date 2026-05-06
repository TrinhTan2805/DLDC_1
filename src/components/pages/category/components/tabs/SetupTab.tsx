import React, { ChangeEvent } from 'react';
import { Settings, CheckSquare, XCircle, Search, Filter, Plus, Globe } from 'lucide-react';
import { ActionIconButton } from '../../../../common/ActionIconButton';
import { MasterDataEntity, LifecycleStatus } from '../../categoryTypes';
import { dataTypeLabels, lifecycleLabels } from '../../categoryConstants';

interface SetupTabProps {
  entities: MasterDataEntity[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: LifecycleStatus | 'all';
  setFilterStatus: (status: LifecycleStatus | 'all') => void;
  userRole: string;
  publishedEntities: string[];
  onAdd: () => void;
  onEdit: (entity: MasterDataEntity) => void;
  onDelete: (id: string) => void;
  onSubmitApproval: (id: string, type: 'category' | 'structure') => void;
  onPublish: (entity: MasterDataEntity) => void;
  onUnpublish: (entity: MasterDataEntity) => void;
  onApproveClick: (entity: MasterDataEntity) => void;
  onRejectClick: (entity: MasterDataEntity) => void;
  onExpireClick: (entity: MasterDataEntity) => void;
}

export function SetupTab({
  entities,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  userRole,
  publishedEntities,
  onAdd,
  onEdit,
  onDelete,
  onSubmitApproval,
  onPublish,
  onUnpublish,
  onApproveClick,
  onRejectClick,
  onExpireClick
}: SetupTabProps) {
  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || e.lifecycleStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6 ">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-blue-700 uppercase tracking-wider mb-1">Tổng số danh mục</div>
              <div className="text-3xl font-extrabold text-blue-900 tracking-tight">{entities.length}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
               <Settings className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Đã hiệu lực</div>
              <div className="text-3xl font-extrabold text-emerald-900 tracking-tight">{entities.filter(e => e.lifecycleStatus === 'active').length}</div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
               <CheckSquare className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-black uppercase tracking-wider mb-1">Hết hiệu lực</div>
              <div className="text-3xl font-extrabold text-black tracking-tight">{entities.filter(e => e.lifecycleStatus === 'inactive' || e.lifecycleStatus === 'archived').length}</div>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-black">
               <XCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="flex-1 relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên hoặc mã..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[14px] bg-slate-50/50 hover:bg-slate-50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            title="Lọc trạng thái"
            value={filterStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[14px] bg-white font-medium min-w-[200px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đã hiệu lực</option>
            <option value="draft">Đang soạn thảo</option>
            <option value="inactive">Ngừng sử dụng</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
        </div>
        <button
 onClick={onAdd}
 className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-100 active:scale-95"
 title="Thêm mới danh mục qua Wizard"
 >
          <Plus className="w-5 h-5" />
          Thêm mới
        </button>
      </div>

      {/* Entity Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] text-black border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[14px] font-normal">Mã</th>
              <th className="px-6 py-4 text-[14px] font-normal">Tên dữ liệu chủ</th>
              <th className="px-6 py-4 text-[14px] font-normal">Loại</th>
              <th className="px-6 py-4 text-[14px] font-normal">Cơ quan quản lý</th>
              <th className="px-6 py-4 text-[14px] font-normal">Trạng thái</th>
              {userRole === 'leader' && (
                <th className="px-6 py-4 text-[14px] font-normal text-center">Công khai</th>
              )}
              <th className="px-6 py-4 text-[14px] font-normal text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {filteredEntities.map((entity) => {
              const isPublished = publishedEntities.includes(entity.id);
              return (
                <tr key={entity.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4 font-mono text-blue-600">{entity.code}</td>
                  <td className="px-6 py-4 text-black">{entity.name}</td>
                  <td className="px-6 py-4 text-black">{dataTypeLabels[entity.dataType]}</td>
                  <td className="px-6 py-4 text-black">{entity.managingAgency}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${lifecycleLabels[entity.lifecycleStatus].color}`}>
                      {lifecycleLabels[entity.lifecycleStatus].label}
                    </span>
                  </td>
                  {userRole === 'leader' && (
                    <td className="px-6 py-4">
                      {entity.lifecycleStatus === 'active' ? (
                        isPublished ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                            <Globe className="w-3 h-3 mr-1" />
                            Đã công khai
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-black">
                            Chưa công khai
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
                        <ActionIconButton 
                          action="submit" 
                          onClick={() => onSubmitApproval(entity.id, 'category')} 
                          disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval'}
                          title={entity.lifecycleStatus === 'active' ? "Đã duyệt" : (entity.lifecycleStatus === 'pending_approval' ? "Đang chờ duyệt" : "Trình duyệt")} 
                        />
                        
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        
                        <ActionIconButton 
                          action="edit" 
                          onClick={() => onEdit(entity)} 
                          disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval'}
                          title="Sửa" 
                        />
                        <ActionIconButton 
                          action="delete" 
                          onClick={() => onDelete(entity.id)} 
                          disabled={entity.lifecycleStatus === 'active' || entity.lifecycleStatus === 'pending_approval'}
                          title="Xóa" 
                        />
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        
                        <ActionIconButton 
                          action="expire" 
                          onClick={() => onExpireClick(entity)} 
                          disabled={entity.lifecycleStatus !== 'active'}
                          title="Hết hiệu lực" 
                        />
                      </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
