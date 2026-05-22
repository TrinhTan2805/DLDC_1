import { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportUser {
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  errors: string[];
}

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (users: ImportUser[]) => void;
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone.replace(/\s/g, ''));
};

const departments = [
  'Vụ Pháp luật Dân sự',
  'Cục Đăng ký Quốc gia',
  'Cục Công chứng',
  'Cục Bổ trợ tư pháp',
  'Vụ Tin học'
];

const roles = ['Quản trị viên', 'Biên tập viên', 'Người xem'];
const statuses: ('active' | 'inactive' | 'locked')[] = ['active', 'inactive', 'locked'];

export function ImportExcelModal({ isOpen, onClose, onImport }: ImportExcelModalProps) {
  const [importData, setImportData] = useState<ImportUser[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<ImportUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        // Skip header row
        const users: ImportUser[] = data.slice(1).map((row: any[]) => {
          const user: ImportUser = {
            name: row[0]?.toString().trim() || '',
            username: row[1]?.toString().trim() || '',
            email: row[2]?.toString().trim() || '',
            phone: row[3]?.toString().trim() || '',
            department: row[4]?.toString().trim() || '',
            role: row[5]?.toString().trim() || '',
            status: (row[6]?.toString().trim().toLowerCase() || 'active') as 'active' | 'inactive' | 'locked',
            errors: []
          };

          // Validate
          if (!user.name) user.errors.push('Họ tên không được để trống');
          if (!user.username) user.errors.push('Tên đăng nhập không được để trống');
          if (!user.email) {
            user.errors.push('Email không được để trống');
          } else if (!validateEmail(user.email)) {
            user.errors.push('Email không hợp lệ');
          }
          if (user.phone && !validatePhone(user.phone)) {
            user.errors.push('Số điện thoại không hợp lệ');
          }
          if (!user.department) {
            user.errors.push('Đơn vị không được để trống');
          } else if (!departments.includes(user.department)) {
            user.errors.push('Đơn vị không hợp lệ');
          }
          if (!user.role) {
            user.errors.push('Vai trò không được để trống');
          } else if (!roles.includes(user.role)) {
            user.errors.push('Vai trò không hợp lệ');
          }
          if (!statuses.includes(user.status)) {
            user.errors.push('Trạng thái không hợp lệ');
          }

          return user;
        }).filter(user => user.name || user.username || user.email); // Filter out empty rows

        setImportData(users);
      } catch (error) {
        alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const template = [
      ['Họ và tên', 'Tên đăng nhập', 'Email', 'Số điện thoại', 'Đơn vị', 'Vai trò', 'Trạng thái'],
      ['Nguyễn Văn A', 'nguyenvana', 'nguyenvana@moj.gov.vn', '0912345678', 'Vụ Pháp luật Dân sự', 'Quản trị viên', 'active'],
      ['Trần Thị B', 'tranthib', 'tranthib@moj.gov.vn', '0912345679', 'Cục Đăng ký Quốc gia', 'Biên tập viên', 'active'],
      ['Lê Văn C', 'levanc', 'levanc@moj.gov.vn', '0912345680', 'Cục Công chứng', 'Người xem', 'inactive'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'mau_import_nguoi_dung.xlsx');
  };

  const handleEditUser = (index: number) => {
    setEditingIndex(index);
    setEditData({ ...importData[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editData) {
      // Re-validate
      const errors: string[] = [];
      if (!editData.name) errors.push('Họ tên không được để trống');
      if (!editData.username) errors.push('Tên đăng nhập không được để trống');
      if (!editData.email) {
        errors.push('Email không được để trống');
      } else if (!validateEmail(editData.email)) {
        errors.push('Email không hợp lệ');
      }
      if (editData.phone && !validatePhone(editData.phone)) {
        errors.push('Số điện thoại không hợp lệ');
      }
      if (!editData.department) {
        errors.push('Đơn vị không được để trống');
      } else if (!departments.includes(editData.department)) {
        errors.push('Đơn vị không hợp lệ');
      }
      if (!editData.role) {
        errors.push('Vai trò không được để trống');
      } else if (!roles.includes(editData.role)) {
        errors.push('Vai trò không hợp lệ');
      }
      if (!statuses.includes(editData.status)) {
        errors.push('Trạng thái không hợp lệ');
      }

      const updatedData = [...importData];
      updatedData[editingIndex] = { ...editData, errors };
      setImportData(updatedData);
      setEditingIndex(null);
      setEditData(null);
    }
  };

  const handleDeleteUser = (index: number) => {
    setImportData(importData.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    const validUsers = importData.filter(user => user.errors.length === 0);
    if (validUsers.length === 0) {
      alert('Không có bản ghi hợp lệ nào để import!');
      return;
    }
    onImport(validUsers);
    onClose();
  };

  const validCount = importData.filter(user => user.errors.length === 0).length;
  const errorCount = importData.filter(user => user.errors.length > 0).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-slate-900">Nhập khẩu người dùng từ Excel</h3>
            {importData.length > 0 && (
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {validCount} hợp lệ
                </span>
                {errorCount > 0 && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errorCount} lỗi
                  </span>
                )}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {importData.length === 0 ? (
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 mb-2">Hướng dẫn nhập khẩu</h4>
                <p className="text-sm text-blue-800 mb-2">
                  File Excel phải có các cột theo thứ tự sau:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                  <li><strong>Họ và tên</strong> (bắt buộc)</li>
                  <li><strong>Tên đăng nhập</strong> (bắt buộc, duy nhất)</li>
                  <li><strong>Email</strong> (bắt buộc, định dạng email hợp lệ)</li>
                  <li><strong>Số điện thoại</strong> (tùy chọn, 10-11 số)</li>
                  <li><strong>Đơn vị</strong> (bắt buộc: {departments.join(', ')})</li>
                  <li><strong>Vai trò</strong> (bắt buộc: {roles.join(', ')})</li>
                  <li><strong>Trạng thái</strong> (active, inactive, hoặc locked)</li>
                </ol>
              </div>

              {/* Download Template */}
              <div className="flex items-center gap-3 justify-center py-6">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Tải file mẫu Excel
                </button>
              </div>

              {/* Upload */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-700 mb-2">Chọn file Excel để nhập khẩu</p>
                  <p className="text-sm text-slate-500 mb-4">Hỗ trợ định dạng .xlsx, .xls</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Chọn file
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">STT</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Họ tên</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Tên đăng nhập</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">SĐT</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Đơn vị</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Vai trò</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                      <th className="px-3 py-2 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importData.map((user, index) => (
                      <tr key={index} className={user.errors.length > 0 ? 'bg-red-50' : 'hover:bg-slate-50'}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2">{user.username}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">{user.phone}</td>
                        <td className="px-3 py-2">{user.department}</td>
                        <td className="px-3 py-2">{user.role}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'inactive' ? 'bg-slate-100 text-slate-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : 'Bị khóa'}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {user.errors.length > 0 ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs">{user.errors.length} lỗi</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">Hợp lệ</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(index)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(index)}
                              className="text-red-600 hover:text-red-700"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Error Details */}
              {errorCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Danh sách lỗi cần sửa
                  </h4>
                  <div className="space-y-2">
                    {importData.map((user, index) => 
                      user.errors.length > 0 && (
                        <div key={index} className="text-sm text-red-800">
                          <strong>Dòng {index + 2}:</strong> {user.errors.join(', ')}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Nhập {validCount} người dùng hợp lệ
                </button>
                <button
                  onClick={() => {
                    setImportData([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Chọn file khác
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingIndex !== null && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setEditingIndex(null); setEditData(null); }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-slate-900">Chỉnh sửa bản ghi #{editingIndex + 1}</h3>
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setEditData(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Họ và tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tên đăng nhập <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-700 mb-2">
                    Đơn vị <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn đơn vị --</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Vai trò <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Trạng thái</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="locked">Bị khóa</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setEditData(null);
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
