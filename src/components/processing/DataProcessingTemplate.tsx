import { useState } from 'react';
import { Settings, Database, Info, AlertTriangle } from 'lucide-react';
import { GenericDataTable } from '../common/GenericDataTable';
import { ProcessingConfigManager } from './ProcessingConfigManager';
import { WarningDataList } from './WarningDataList';
import { ProcessingRulesModal } from './ProcessingRulesModal';

interface DataProcessingTemplateProps {
  title: string;
  description: string;
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  sampleData: any[];
  searchFields: Array<{ label: string; name: string; type: 'text' | 'select' | 'date'; options?: string[] }>;
  detailFields: Array<{ label: string; key: string }>;
}

export function DataProcessingTemplate({
  title,
  description,
  columns,
  sampleData,
  searchFields,
  detailFields
}: DataProcessingTemplateProps) {
  const [activeTab, setActiveTab] = useState<'data' | 'processing' | 'warnings' | 'logs'>('data');
  const [selectedProcessingLog, setSelectedProcessingLog] = useState<{ type: string; time: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${
              activeTab === 'data'
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            Danh sách dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${
              activeTab === 'processing'
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Cấu hình xử lý dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('warnings')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${
              activeTab === 'warnings'
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Danh sách dữ liệu cảnh báo
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${
              activeTab === 'logs'
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Info className="w-4 h-4" />
            Lịch sử xử lý
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'data' && (
            <GenericDataTable
              title={title}
              description={description}
              icon={Database}
              iconColor="purple"
              columns={columns}
              data={sampleData}
              searchFields={searchFields}
              detailFields={detailFields}
            />
          )}

          {activeTab === 'processing' && (
            <ProcessingConfigManager title={title} description={description} dataSourceKey={title} />
          )}

          {activeTab === 'warnings' && (
            <WarningDataList />
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base text-blue-900 mb-2">Lịch sử xử lý dữ liệu</h4>
                    <p className="text-sm text-blue-700">
                      Theo dõi các lần xử lý dữ liệu với log đầy đủ và khả năng sửa lỗi từng bản ghi
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Thời gian</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Loại xử lý</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Số bản ghi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Thành công</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Lỗi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { time: '09/12/2024 10:30', type: 'Làm sạch', total: 1250, success: 1200, error: 50, status: 'success' },
                      { time: '09/12/2024 09:15', type: 'Chuẩn hóa', total: 980, success: 960, error: 20, status: 'success' },
                      { time: '09/12/2024 08:00', type: 'Biến đổi', total: 850, success: 830, error: 20, status: 'success' },
                      { time: '08/12/2024 16:45', type: 'Làm sạch', total: 2100, success: 2000, error: 100, status: 'warning' },
                      { time: '08/12/2024 14:20', type: 'Chuẩn hóa', total: 1500, success: 1480, error: 20, status: 'success' }
                    ].map((log, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{log.time}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedProcessingLog({ type: log.type, time: log.time })}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {log.type}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{log.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{log.success.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-700">{log.error}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                            log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {log.status === 'success' ? 'Hoàn thành' : 'Có cảnh báo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Rules Modal */}
      {selectedProcessingLog && (
        <ProcessingRulesModal
          type={selectedProcessingLog.type}
          time={selectedProcessingLog.time}
          onClose={() => setSelectedProcessingLog(null)}
        />
      )}
    </div>
  );
}