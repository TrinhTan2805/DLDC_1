import { useState } from 'react';
import { X, Eye, Lock, AlertTriangle, Shield, Edit2, Save } from 'lucide-react';

interface FieldClassification {
  fieldName: string;
  publicLevel: 'public' | 'restricted' | 'internal' | 'confidential';
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface DataClassificationModalProps {
  config: any;
  onClose: () => void;
}

export function DataClassificationModal({ config, onClose }: DataClassificationModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<FieldClassification[]>([
    { fieldName: 'Mã bản ghi', publicLevel: 'restricted', sensitivityLevel: 'low' },
    { fieldName: 'Họ và tên', publicLevel: 'internal', sensitivityLevel: 'high' },
    { fieldName: 'Ngày sinh', publicLevel: 'internal', sensitivityLevel: 'high' },
    { fieldName: 'Số CCCD', publicLevel: 'confidential', sensitivityLevel: 'critical' },
    { fieldName: 'Địa chỉ thường trú', publicLevel: 'internal', sensitivityLevel: 'medium' },
    { fieldName: 'Số điện thoại', publicLevel: 'internal', sensitivityLevel: 'medium' },
  ]);

  const publicLevelConfig = {
    public: { 
      label: 'Công khai', 
      color: 'text-green-700', 
      bg: 'bg-green-50',
      icon: Eye,
      description: 'Được phép công khai rộng rãi'
    },
    restricted: { 
      label: 'Công khai hạn chế', 
      color: 'text-blue-700', 
      bg: 'bg-blue-50',
      icon: Eye,
      description: 'Có điều kiện'
    },
    internal: { 
      label: 'Nội bộ', 
      color: 'text-orange-700', 
      bg: 'bg-orange-50',
      icon: Lock,
      description: 'Chỉ trong cơ quan, đơn vị'
    },
    confidential: { 
      label: 'Mật', 
      color: 'text-red-700', 
      bg: 'bg-red-50',
      icon: Shield,
      description: 'Bảo mật nghiêm ngặt'
    }
  };

  const sensitivityConfig = {
    low: { 
      label: 'Thấp', 
      color: 'text-green-700', 
      bg: 'bg-green-50',
      description: 'Thông tin công khai'
    },
    medium: { 
      label: 'Trung bình', 
      color: 'text-yellow-700', 
      bg: 'bg-yellow-50',
      description: 'Cần báo về cơ bản'
    },
    high: { 
      label: 'Cao', 
      color: 'text-orange-700', 
      bg: 'bg-orange-50',
      description: 'Dữ liệu cá nhân nhạy cảm'
    },
    critical: { 
      label: 'Rất cao', 
      color: 'text-red-700', 
      bg: 'bg-red-50',
      description: 'Bí mật cá nhân'
    }
  };

  const handleSaveChanges = () => {
    // Lưu thay đổi
    setIsEditMode(false);
  };

  const updateFieldClassification = (index: number, field: 'publicLevel' | 'sensitivityLevel', value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFields(newFields);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Phân loại Dữ liệu</h3>
            <p className="text-sm text-slate-600 mt-1">{config.dataSource}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Classification Overview */}
            <div className="grid grid-cols-2 gap-4">
              {/* Public Level */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-orange-900 mb-1">Mức độ công khai</h4>
                    <p className="text-lg text-orange-900 mb-2">Nội bộ</p>
                    <p className="text-xs text-orange-700">
                      Dữ liệu chỉ được sử dụng trong phạm vi nội bộ cơ quan, đơn vị. Không được công khai ra bên ngoài.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sensitivity Level */}
              <div className="border border-pink-200 rounded-lg p-4 bg-pink-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-pink-900 mb-1">Mức độ nhạy cảm</h4>
                    <p className="text-lg text-pink-900 mb-2">Cao</p>
                    <p className="text-xs text-pink-700">
                      Dữ liệu có chứa thông tin cá nhân nhạy cảm theo quy định của Luật Bảo vệ dữ liệu cá nhân.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Guide */}
            <div>
              <h4 className="text-sm text-slate-900 mb-3">Hướng dẫn phân loại</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-700 mb-2">Mức độ công khai:</p>
                  <div className="space-y-2">
                    {Object.entries(publicLevelConfig).map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <div key={key} className="flex items-start gap-2 text-xs">
                          <Icon className={`w-4 h-4 ${value.color} flex-shrink-0 mt-0.5`} />
                          <div>
                            <span className={value.color}>{value.label}:</span>
                            <span className="text-slate-600 ml-1">{value.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-700 mb-2">Mức độ nhạy cảm:</p>
                  <div className="space-y-2">
                    {Object.entries(sensitivityConfig).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${value.color.replace('text-', 'bg-')} flex-shrink-0 mt-1.5`} />
                        <div>
                          <span className={value.color}>{value.label}:</span>
                          <span className="text-slate-600 ml-1">{value.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Field Classification Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-slate-900">Phân loại theo từng trường dữ liệu</h4>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
              
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Tên trường</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Mức độ công khai</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Mức độ nhạy cảm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map((field, index) => {
                      const publicLevel = publicLevelConfig[field.publicLevel];
                      const sensitivity = sensitivityConfig[field.sensitivityLevel];
                      const PublicIcon = publicLevel.icon;
                      
                      return (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-900">{field.fieldName}</td>
                          <td className="px-4 py-3">
                            {isEditMode ? (
                              <select
                                value={field.publicLevel}
                                onChange={(e) => updateFieldClassification(index, 'publicLevel', e.target.value)}
                                className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {Object.entries(publicLevelConfig).map(([key, value]) => (
                                  <option key={key} value={key}>{value.label}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex items-center gap-2">
                                <PublicIcon className={`w-4 h-4 ${publicLevel.color}`} />
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${publicLevel.bg} ${publicLevel.color}`}>
                                  {publicLevel.label}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditMode ? (
                              <select
                                value={field.sensitivityLevel}
                                onChange={(e) => updateFieldClassification(index, 'sensitivityLevel', e.target.value)}
                                className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {Object.entries(sensitivityConfig).map(([key, value]) => (
                                  <option key={key} value={key}>{value.label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${sensitivity.bg} ${sensitivity.color}`}>
                                {sensitivity.label}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xuất báo cáo
              </button>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}