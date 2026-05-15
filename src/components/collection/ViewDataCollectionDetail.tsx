import { ArrowLeft, Building2, FileText, Calendar, FileType, AlertCircle, CheckCircle, Clock, Edit2, Link2, Key, User, Lock, Server } from 'lucide-react';
import { DataFieldClassification } from './DataFieldClassification';

interface ViewDataCollectionDetailProps {
  data: any;
  onBack: () => void;
  onEdit: () => void;
}

export function ViewDataCollectionDetail({ data, onBack, onEdit }: ViewDataCollectionDetailProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return (
          <span className="px-3 py-1.5 rounded-lg text-base bg-green-100 text-green-700 flex items-center gap-2 w-fit">
            <CheckCircle className="w-4 h-4" />
            Đã thu thập
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1.5 rounded-lg text-base bg-orange-100 text-orange-700 flex items-center gap-2 w-fit">
            <Clock className="w-4 h-4" />
            Đang xử lý
          </span>
        );
      case 'not-started':
        return (
          <span className="px-3 py-1.5 rounded-lg text-base bg-slate-100 text-slate-700 flex items-center gap-2 w-fit">
            <AlertCircle className="w-4 h-4" />
            Chưa bắt đầu
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-3 py-1.5 rounded-lg text-base bg-red-100 text-red-700">Cao</span>;
      case 'medium':
        return <span className="px-3 py-1.5 rounded-lg text-base bg-yellow-100 text-yellow-700">Trung bình</span>;
      case 'low':
        return <span className="px-3 py-1.5 rounded-lg text-base bg-blue-100 text-blue-700">Thấp</span>;
      default:
        return null;
    }
  };

  const categoryColor = data.category === 'external' ? 'blue' : 'green';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button title="Hành động" aria-label="Hành động"
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-slate-900">Chi tiết Dữ liệu Cần Thu thập</h2>
            <p className="text-base text-slate-500 mt-0.5">Thông tin chi tiết về dữ liệu</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className={`px-4 py-2.5 bg-${categoryColor}-600 hover:bg-${categoryColor}-700 text-white rounded-lg transition-colors flex items-center gap-2`}
          style={{
            backgroundColor: categoryColor === 'blue' ? '#2563eb' : '#16a34a'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = categoryColor === 'blue' ? '#1d4ed8' : '#15803d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = categoryColor === 'blue' ? '#2563eb' : '#16a34a';
          }}
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>

      {/* Loại nguồn */}
      <div className={`bg-${categoryColor}-50 border-2 border-${categoryColor}-200 rounded-lg p-4`}
        style={{
          backgroundColor: categoryColor === 'blue' ? '#eff6ff' : '#f0fdf4',
          borderColor: categoryColor === 'blue' ? '#bfdbfe' : '#bbf7d0'
        }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-${categoryColor}-600`}
            style={{
              backgroundColor: categoryColor === 'blue' ? '#2563eb' : '#16a34a'
            }}
          ></div>
          <p
            className={{
              'px-3 py-1.5 rounded-lg text-base inline-block': true,
              'bg-blue-100 text-blue-700': data.category === 'external',
              'bg-green-100 text-green-700': data.category === 'internal'
            }}
          >
            {data.category === 'external' ? 'Thu thập từ Bộ ngoài' : 'Thu thập từ các Hệ thống trong nội bộ'}
          </p>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Thông tin cơ bản</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Tên dữ liệu */}
          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Tên dữ liệu</label>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-slate-900">{data.dataName}</p>
            </div>
          </div>

          {/* Cơ quan */}
          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">
              {data.category === 'external' ? 'Cơ quan nguồn' : 'Cục/Vụ'}
            </label>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-600" />
              <p className="text-slate-900">{data.department}</p>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Mô tả</label>
            <p className="text-slate-700 bg-slate-50 rounded-lg p-4">{data.description}</p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Loại dữ liệu</label>
              <div className="flex items-center gap-2">
                <FileType className="w-4 h-4 text-slate-600" />
                <p className="text-slate-900">{data.dataType}</p>
              </div>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Định dạng</label>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-base inline-block">{data.format}</span>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Tần suất thu thập</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <p className="text-slate-900">{data.frequency}</p>
              </div>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Mức độ ưu tiên</label>
              {getPriorityBadge(data.priority)}
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Trạng thái</label>
              {getStatusBadge(data.status)}
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Cập nhật lần cuối</label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <p className="text-slate-900">{data.lastUpdate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Thông tin bổ sung</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">STT</label>
              <p className="text-slate-900">#{data.stt}</p>
            </div>
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Mã ID</label>
              <p className="text-slate-900">DC-{String(data.id).padStart(4, '0')}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-base text-blue-800">
              <strong>Ghi chú:</strong> Dữ liệu này thuộc nhóm {data.category === 'external' ? 'thu thập từ các cơ quan bên ngoài' : 'thu thập từ các hệ thống trong nội bộ'}.
            </p>
          </div>
        </div>
      </div>

      {/* Data Field Classification */}
      <DataFieldClassification 
        tableName={data.dataName || "Danh sách người dùng"}
        tableSecurityLevel={data.securityLevel || 'noi-bo'}
      />

      {/* Connection Info */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Thông tin kết nối</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Phương thức kết nối</label>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600" />
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-base inline-block">
                  {data.connectionMethod || 'API'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Phương thức xác thực</label>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-600" />
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-base inline-block">
                  {data.authMethod || 'API Key'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Endpoint</label>
            <div className="flex items-start gap-2">
              <Link2 className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700 bg-slate-50 rounded-lg px-4 py-2.5 text-base font-mono break-all flex-1">
                {data.endpoint || 'https://api.example.com/v1/data'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-600" />
                <p className="text-slate-900">{data.username || 'admin_user'}</p>
              </div>
            </div>

            <div>
              <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Port</label>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600" />
                <p className="text-slate-900">{data.port || '443'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">API Key</label>
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700 bg-slate-50 rounded-lg px-4 py-2.5 text-base font-mono">
                {data.apiKey || '••••••••••••••••••••••••'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700 bg-slate-50 rounded-lg px-4 py-2.5 text-base font-mono">
                {data.password || '••••••••••••'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Ghi chú kỹ thuật</label>
            <p className="text-slate-700 bg-slate-50 rounded-lg p-4 text-base">
              {data.technicalNote || 'Kết nối qua HTTPS với chứng chỉ SSL. Timeout mặc định 30s.'}
            </p>
          </div>
        </div>
      </div>

      {/* Mockup Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-base text-amber-800">
          <strong>Lưu ý:</strong> Đây là giao diện mockup xem chi tiết. Dữ liệu hiển thị chỉ mang tính minh họa.
        </p>
      </div>
    </div>
    </div>
  );
}