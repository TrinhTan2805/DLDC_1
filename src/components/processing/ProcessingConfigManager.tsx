import { toast } from 'sonner';
import React, { useState } from 'react';
import { Plus, Eye, Settings, Calendar, User, SquarePen, Play, Clock } from 'lucide-react';
import { RuleManagementModal } from './RuleManagementModal';
import { DataClassificationModal } from './DataClassificationModal';
import { AddConfigModal } from './AddConfigModal';
import { ExecutorManagementModal } from './ExecutorManagementModal';
import { ConfigDetailModal } from './ConfigDetailModal';

interface ProcessingConfig {
  id: number;
  dataSource: string;
  sourceType: string;
  startTime: string;
  totalRecords: number;
  processedRecords: number;
  progress: number;
  appliedRules: number;
  totalRules: number;
  classification: 'internal' | 'external';
  executor: string;
  status: 'processing' | 'completed' | 'pending';
}

interface ProcessingConfigManagerProps {
  title: string;
  description: string;
  dataSourceKey: string;
}

export function ProcessingConfigManager({ title, description, dataSourceKey }: ProcessingConfigManagerProps) {
  // Mock data - Tất cả các cấu hình xử lý
  const allConfigs: ProcessingConfig[] = [
    {
      id: 1,
      dataSource: 'Văn bản quy phạm pháp luật',
      sourceType: 'Cục Kiểm soát',
      startTime: '08/12/2024 10:15:00',
      totalRecords: 52742,
      processedRecords: 32876,
      progress: 62,
      appliedRules: 10,
      totalRules: 10,
      classification: 'internal',
      executor: 'Hoàng Văn E',
      status: 'processing'
    },
    {
      id: 2,
      dataSource: 'CSDL Hộ tịch điện tử',
      sourceType: 'Cục Hành chính tư pháp',
      startTime: '08/12/2024 09:30:00',
      totalRecords: 28742,
      processedRecords: 28742,
      progress: 100,
      appliedRules: 10,
      totalRules: 10,
      classification: 'internal',
      executor: 'Nguyễn Thị D',
      status: 'completed'
    },
    {
      id: 3,
      dataSource: 'Cơ sở dữ liệu thi hành án dân sự',
      sourceType: 'Cục Thi hành án dân sự',
      startTime: '08/12/2024 08:00:00',
      totalRecords: 35742,
      processedRecords: 28594,
      progress: 80,
      appliedRules: 10,
      totalRules: 10,
      classification: 'internal',
      executor: 'Trần Văn B',
      status: 'processing'
    }
  ];

  // Lọc để chỉ lấy cấu hình của nguồn dữ liệu hiện tại
  const config = allConfigs.find(c => c.dataSource === title);
  
  const [configs, setConfigs] = useState<ProcessingConfig[]>(config ? [config] : []);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExecutorModal, setShowExecutorModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ProcessingConfig | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [runningConfig, setRunningConfig] = useState<ProcessingConfig | null>(null);

  // Run configuration states
  const [runMode, setRunMode] = useState<'range' | 'auto' | 'all'>('all');
  const [startRecord, setStartRecord] = useState<string>('2000');
  const [endRecord, setEndRecord] = useState<string>('60000');
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>('23:30');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'hourly' | 'weekly'>('daily');

  const statusConfig = {
    processing: { label: 'Đang chạy', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    completed: { label: 'Hoàn thành', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    pending: { label: 'Chờ xử lý', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
  };

  const classificationConfig = {
    internal: { label: 'Phân loại', color: 'text-green-700', bg: 'bg-green-50' },
    external: { label: 'Phân loại', color: 'text-amber-700', bg: 'bg-amber-50' }
  };

  const handleOpenRuleModal = (config: ProcessingConfig) => {
    setSelectedConfig(config);
    setShowRuleModal(true);
  };

  const handleOpenClassificationModal = (config: ProcessingConfig) => {
    setSelectedConfig(config);
    setShowClassificationModal(true);
  };

  const handleSaveNewConfig = (newConfig: any) => {
    // Logic để thêm cấu hình mới vào danh sách
    console.log('New config:', newConfig);
  };

  const handleRunRules = (config: ProcessingConfig) => {
    setRunningConfig(config);
    setShowRunModal(true);
  };

  const handleConfirmRun = () => {
    if (runningConfig) {
      // Simulate running rules
      toast.info(`Bắt đầu chạy ${runningConfig.totalRules} quy tắc cho "${runningConfig.dataSource}"\n\nỨớc tính thời gian: ${Math.ceil(runningConfig.totalRecords / 1000)} phút`);
      setShowRunModal(false);
      setRunningConfig(null);
    }
  };

  const processingCount = configs.filter(c => c.status === 'processing').length;
  const completedCount = configs.filter(c => c.status === 'completed').length;
  const pendingCount = configs.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Tổng số: <span className="text-slate-900">{configs.length}</span> cấu hình
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm cấu hình
        </button>
      </div>

      {/* Config Cards Grid */}
      <div className="space-y-4">
        {configs.map((config) => {
          const status = statusConfig[config.status];
          const classification = classificationConfig[config.classification];
          
          return (
            <div key={config.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-6">
                {/* Left Section - Info */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-slate-900 mb-1">{config.dataSource}</h4>
                      <p className="text-xs text-slate-500">{config.sourceType}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-xs rounded ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-4 gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Quy tắc áp dụng</div>
                        <div className="text-sm text-slate-900">{config.appliedRules}/{config.totalRules}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Người xử lý</div>
                        <div className="text-sm text-slate-900">{config.executor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Thời gian bắt đầu</div>
                        <div className="text-sm text-slate-900">{config.startTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${classification.color.replace('text-', 'bg-')}`} />
                      <div>
                        <div className="text-xs text-slate-500">Phân loại dữ liệu</div>
                        <div className="text-sm text-slate-900">{config.classification === 'internal' ? 'Trong ngành' : 'Ngoài ngành'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-700">Tiến độ xử lý</span>
                      <span className="text-sm text-blue-600">{config.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${
                          config.status === 'completed' ? 'bg-green-600' : 
                          config.status === 'processing' ? 'bg-blue-600' : 
                          'bg-slate-400'
                        }`}
                        style={{ width: `${config.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Đã xử lý: <span className="text-slate-900">{config.processedRecords.toLocaleString()}</span> / <span className="text-slate-900">{config.totalRecords.toLocaleString()}</span> bản ghi
                      </span>
                      {config.status === 'processing' && (
                        <span className="text-xs text-slate-500">
                          Còn lại: {(config.totalRecords - config.processedRecords).toLocaleString()} bản ghi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedConfig(config);
                      setShowDetailModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors whitespace-nowrap font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleOpenRuleModal(config)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors whitespace-nowrap font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Quản lý quy tắc
                  </button>
                  <button
                    onClick={() => handleOpenClassificationModal(config)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors whitespace-nowrap"
                  >
                    Phân loại dữ liệu
                  </button>
                  <button
                    onClick={() => handleRunRules(config)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Chạy quy tắc
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {configs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">Chưa có cấu hình xử lý</h3>
          <p className="text-sm text-slate-600 mb-4">Bắt đ���u bằng cách thêm cấu hình xử lý dữ liệu mới</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm cấu hình
          </button>
        </div>
      )}

      {/* Modals */}
      {showRuleModal && selectedConfig && (
        <RuleManagementModal
          config={selectedConfig}
          onClose={() => {
            setShowRuleModal(false);
            setSelectedConfig(null);
          }}
        />
      )}

      {showClassificationModal && selectedConfig && (
        <DataClassificationModal
          config={selectedConfig}
          onClose={() => {
            setShowClassificationModal(false);
            setSelectedConfig(null);
          }}
        />
      )}

      {showExecutorModal && (
        <ExecutorManagementModal
          onClose={() => setShowExecutorModal(false)}
        />
      )}

      {showDetailModal && selectedConfig && (
        <ConfigDetailModal
          config={selectedConfig}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedConfig(null);
          }}
        />
      )}

      {showAddModal && (
        <AddConfigModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNewConfig}
        />
      )}

      {/* Run Rules Modal */}
      {showRunModal && runningConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận chạy quy tắc</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 mb-2">
                    Chạy {runningConfig.totalRules} quy tắc xử lý?
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Hệ thống sẽ áp dụng các quy tắc đã được cấu hình để xử lý dữ liệu. 
                    Tiến trình có thể được theo dõi trong tab "Lịch sử xử lý".
                  </p>
                  
                  {/* Run Mode Selection */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <h5 className="text-sm text-slate-900 mb-3">Cấu hình phạm vi chạy:</h5>
                    <div className="space-y-3">
                      {/* Option 1: Specific Range */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="range"
                          checked={runMode === 'range'}
                          onChange={() => setRunMode('range')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900 mb-2">Chạy thủ công từ bản ghi số</div>
                          {runMode === 'range' && (
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="block text-xs text-slate-600 mb-1">Từ bản ghi số:</label>
                                <input
                                  type="number"
                                  value={startRecord}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartRecord(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="2000"
                                  min="1"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-slate-600 mb-1">Đến bản ghi số:</label>
                                <input
                                  type="number"
                                  value={endRecord}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndRecord(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="60000"
                                  min="1"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Option 2: Auto from last */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="auto"
                          checked={runMode === 'auto'}
                          onChange={() => setRunMode('auto')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">Chạy tự động (tiếp tục từ lần trước)</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Hệ thống sẽ tự động tiếp tục từ bản ghi {runningConfig.processedRecords.toLocaleString()} đến bản ghi {runningConfig.totalRecords.toLocaleString()}
                          </div>
                        </div>
                      </label>

                      {/* Option 3: Run all */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="all"
                          checked={runMode === 'all'}
                          onChange={() => setRunMode('all')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">Chạy lại toàn bộ</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Xử lý lại toàn bộ {runningConfig.totalRecords.toLocaleString()} bản ghi từ đầu
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Schedule Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="enableSchedule"
                        checked={enableSchedule}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnableSchedule(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor="enableSchedule" className="text-sm text-slate-900 cursor-pointer">
                        Đặt lịch chạy tự động khi có dữ liệu mới
                      </label>
                    </div>
                    
                    {enableSchedule && (
                      <div className="ml-7 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Tần suất:</label>
                            <select
                              value={scheduleFrequency}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setScheduleFrequency(e.target.value as 'daily' | 'hourly' | 'weekly')}
                              title="Tần suất chạy"
                            >
                              <option value="daily">Hàng ngày</option>
                              <option value="hourly">Mỗi giờ</option>
                              <option value="weekly">Hàng tuần</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Thời gian chạy:</label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleTime(e.target.value)}
                              title="Thời gian chạy"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2">
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          Hệ thống sẽ tự động chạy quy tắc vào lúc <strong>{scheduleTime}</strong> {scheduleFrequency === 'daily' ? 'hàng ngày' : scheduleFrequency === 'hourly' ? 'mỗi giờ' : 'hàng tuần'} khi phát hiện dữ liệu mới.
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm text-blue-900 mb-3">Thông tin xử lý:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Nguồn dữ liệu:</span>
                        <span className="text-slate-900">{runningConfig.dataSource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Phạm vi xử lý:</span>
                        <span className="text-slate-900">
                          {runMode === 'range' 
                            ? `Từ ${parseInt(startRecord || '0').toLocaleString()} → ${parseInt(endRecord || '0').toLocaleString()}`
                            : runMode === 'auto'
                            ? `Từ bản ghi ${runningConfig.processedRecords.toLocaleString()} → ${runningConfig.totalRecords.toLocaleString()}`
                            : `Tất cả ${runningConfig.totalRecords.toLocaleString()} bản ghi`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Số bản ghi sẽ xử lý:</span>
                        <span className="text-slate-900">
                          {runMode === 'range' 
                            ? `${Math.max(0, (parseInt(endRecord || '0') - parseInt(startRecord || '0') + 1)).toLocaleString()} bản ghi`
                            : runMode === 'auto'
                            ? `${(runningConfig.totalRecords - runningConfig.processedRecords).toLocaleString()} bản ghi`
                            : `${runningConfig.totalRecords.toLocaleString()} bản ghi`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Số quy tắc:</span>
                        <span className="text-slate-900">{runningConfig.totalRules} quy tắc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Phân loại:</span>
                        <span className="text-slate-900">
                          {runningConfig.classification === 'internal' ? 'Trong ngành (10 quy tắc)' : 'Ngoài ngành (3 quy tắc)'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200 flex justify-between">
                        <span className="text-blue-900">Ước tính thời gian:</span>
                        <span className="text-blue-900">
                          ~{runMode === 'range' 
                            ? Math.ceil(Math.max(0, (parseInt(endRecord || '0') - parseInt(startRecord || '0') + 1)) / 1000)
                            : runMode === 'auto'
                            ? Math.ceil((runningConfig.totalRecords - runningConfig.processedRecords) / 1000)
                            : Math.ceil(runningConfig.totalRecords / 1000)
                          } phút
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Lưu ý:</strong> Quá trình xử lý sẽ chạy ở chế độ nền. 
                      Bạn có thể tiếp tục sử dụng hệ thống trong khi chờ đợi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowRunModal(false);
                    setRunningConfig(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmRun}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Bắt đầu chạy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}