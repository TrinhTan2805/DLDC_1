import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  dataType: string;
  managingUnit: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdDate: string;
}

export function SetupCategoryList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'DM001',
      code: 'DM001',
      name: 'Biên tập danh mục A',
      description: 'Danh mục các đơn vị hành chính theo cấp',
      dataType: 'Tham chiếu',
      managingUnit: 'Đơn vị A',
      status: 'approved',
      createdBy: 'Nguyễn Văn A',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      code: 'DM_LOAI_VB',
      name: 'Danh mục loại văn bản',
      description: 'Phân loại văn bản pháp luật',
      dataType: 'Chuẩn',
      managingUnit: 'Đơn vị B',
      status: 'pending',
      createdBy: 'Trần Thị B',
      createdDate: '2024-02-20'
    },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    dataType: '',
    managingUnit: '',
  });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    draft: 'Nháp',
    pending: 'Chờ phê duyệt',
    approved: 'Đã phê duyệt',
    rejected: 'Từ chối',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.name || !formData.dataType || !formData.managingUnit) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Check duplicate code
    if (categories.some(cat => cat.code === formData.code)) {
      alert('Mã danh mục đã tồn tại');
      return;
    }

    const newCategory: Category = {
      id: String(categories.length + 1),
      ...formData,
      status: 'draft',
      createdBy: 'Người dùng hiện tại',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setCategories([...categories, newCategory]);
    setFormData({ code: '', name: '', description: '', dataType: '', managingUnit: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      const category = categories.find(c => c.id === id);
      if (category?.status === 'approved') {
        alert('Không thể xóa danh mục đã được phê duyệt');
        return;
      }
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleSendApproval = (id: string) => {
    if (confirm('Gửi yêu cầu phê duyệt danh mục này?')) {
      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, status: 'pending' } : cat
      ));
      alert('Đã gửi yêu cầu phê duyệt đến lãnh đạo bộ phận');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-slate-900">Thiết lập danh sách các danh mục</h2>
          <p className="text-sm text-slate-600 mt-1">
            Tạo mới, sửa, xóa và quản lý danh sách các danh mục dữ liệu
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo danh mục mới
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã danh mục..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Loại dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Đơn vị quản lý</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Người tạo</th>
                <th className="px-4 py-3 text-right text-xs text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900">{category.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{category.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{category.dataType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{category.managingUnit}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${statusColors[category.status]}`}>
                      {category.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {category.status === 'pending' && <Clock className="w-3 h-3" />}
                      {category.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                      {statusLabels[category.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>{category.createdBy}</div>
                    <div className="text-xs text-slate-500">{category.createdDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {category.status === 'draft' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setFormData({
                                code: category.code,
                                name: category.name,
                                description: category.description,
                                dataType: category.dataType,
                                managingUnit: category.managingUnit,
                              });
                              setShowAddModal(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendApproval(category.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Gửi phê duyệt"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {category.status === 'pending' && (
                        <span className="text-xs text-slate-500">Chờ phê duyệt...</span>
                      )}
                      {category.status === 'approved' && (
                        <span className="text-xs text-green-600">Đã phê duyệt</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">
                {selectedCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mã danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#F0F0F0] disabled:cursor-not-allowed"
                  placeholder="VD: DM_DVHC"
                  disabled={!!selectedCategory}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Mã duy nhất, không trùng lặp</p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Danh mục đơn vị hành chính"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Mô tả chi tiết về danh mục..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Loại dữ liệu <span className="text-red-500">*</span>
                </label>
                <select
                  title="Loại dữ liệu"
                  value={formData.dataType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dataType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn loại dữ liệu --</option>
                  <option value="Chuẩn">Chuẩn</option>
                  <option value="Tham chiếu">Tham chiếu</option>
                  <option value="Nội bộ">Nội bộ</option>
                  <option value="Chia sẻ">Chia sẻ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Đơn vị quản lý <span className="text-red-500">*</span>
                </label>
                <select
                  title="Đơn vị quản lý"
                  value={formData.managingUnit}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, managingUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn đơn vị quản lý --</option>
                  <option value="Đơn vị A">Đơn vị A</option>
                  <option value="Vụ Pháp luật">Vụ Pháp luật</option>
                  <option value="Vụ Hành chính">Vụ Hành chính</option>
                  <option value="Cục Công nghệ thông tin">Cục Công nghệ thông tin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedCategory ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedCategory(null);
                    setFormData({ code: '', name: '', description: '', dataType: '', managingUnit: '' });
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}