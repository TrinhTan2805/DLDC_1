import { X, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DataSource {
  id: string;
  name: string;
  data: Record<string, any>;
  fieldStatus?: Record<string, 'valid' | 'warning'>; // Track field validation status
}

interface DataVersion {
  version: string;
  date: string;
  updatedBy: string;
  data: Record<string, any>;
}

interface DataDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  dataSources?: DataSource[]; // Multiple data sources
  fields: { label: string; key: string }[];
  title: string;
  mode?: 'simple' | 'compare' | 'merge'; // Add merge mode
  fieldStatus?: Record<string, 'valid' | 'warning'>; // Status for merged data
  onEdit?: (data: any) => void; // Edit callback
  onSubmitForApproval?: (data: any) => void; // Submit for approval callback
  versions?: DataVersion[]; // Historical versions
}

export function DataDetailModal({ 
  isOpen, 
  onClose, 
  data, 
  dataSources = [],
  fields, 
  title, 
  mode = 'merge',
  onEdit,
  onSubmitForApproval,
  fieldStatus = {},
  versions = []
}: DataDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'sources' | 'merged'>('sources');
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set(['source-1'])); // First source expanded by default
  const [selectedVersion, setSelectedVersion] = useState<string>('v5'); // Default to latest version

  // Generate mock versions if not provided
  const generatedVersions = useMemo(() => {
    if (!data) return [];
    if (versions.length > 0) return versions;
    
    // Create 5 versions of data with progressive changes
    return [
      {
        version: 'v1',
        date: '15/08/2024 09:30',
        updatedBy: 'Nguyễn Văn A',
        data: {
          recordCode: data.recordCode,
          fullName: data.fullName?.replace(/Nguyễn/g, 'Nguyen'), // Old format
          birthDate: '1990-01-15', // Different date format
          gender: data.gender,
        }
      },
      {
        version: 'v2',
        date: '22/09/2024 14:15',
        updatedBy: 'Trần Thị B',
        data: {
          recordCode: data.recordCode,
          fullName: data.fullName?.replace(/Nguyễn/g, 'Nguyen'),
          birthDate: '15/01/1990', // Updated format
          gender: data.gender,
          cccdNumber: data.cccdNumber?.substring(0, 9) + 'XXX', // Partially masked
        }
      },
      {
        version: 'v3',
        date: '10/10/2024 16:45',
        updatedBy: 'Lê Văn C',
        data: {
          recordCode: data.recordCode,
          fullName: data.fullName,
          birthDate: data.birthDate,
          gender: data.gender,
          cccdNumber: data.cccdNumber,
          birthPlace: data.birthPlace,
        }
      },
      {
        version: 'v4',
        date: '05/11/2024 11:20',
        updatedBy: 'Phạm Thị D',
        data: {
          recordCode: data.recordCode,
          fullName: data.fullName,
          birthDate: data.birthDate,
          gender: data.gender,
          cccdNumber: data.cccdNumber,
          birthPlace: data.birthPlace,
          primarySource: data.primarySource,
          updateDate: data.updateDate,
        }
      },
      {
        version: 'v5',
        date: '20/12/2024 10:00',
        updatedBy: 'Hoàng Văn E',
        data: data // Latest version - full data
      }
    ];
  }, [data, versions]);

  // Get current version data
  const currentVersionData = useMemo(() => {
    const versionObj = generatedVersions.find(v => v.version === selectedVersion);
    return versionObj ? versionObj.data : data;
  }, [selectedVersion, generatedVersions, data]);

  // Auto-generate data sources if merge mode and no sources provided
  let generatedDataSources: DataSource[] = dataSources;
  if (mode === 'merge' && dataSources.length === 0) {
    // Create mock data sources with status for each field
    generatedDataSources = ([
      {
        id: 'source-1',
        name: 'Nguồn chính - Sở Tư pháp Hà Nội',
        data: {
          recordCode: data.recordCode,
          fullName: data.fullName,
          birthDate: data.birthDate,
          gender: data.gender,
          cccdNumber: data.cccdNumber,
        },
        fieldStatus: {
          recordCode: 'valid',
          fullName: 'valid',
          birthDate: 'warning', // This field has issue
          gender: 'valid',
          cccdNumber: 'valid',
        }
      },
      {
        id: 'source-2',
        name: 'Nguồn bổ sung - Sở Tư pháp TP.HCM',
        data: {
          birthPlace: data.birthPlace,
          primarySource: data.primarySource,
          updateDate: data.updateDate,
        },
        fieldStatus: {
          birthPlace: 'valid',
          primarySource: 'warning', // This field has issue
          updateDate: 'valid',
        }
      },
      {
        id: 'source-3',
        name: 'Nguồn bổ sung - Sở Tư pháp Đà Nẵng',
        data: {
          secondarySource: data.secondarySource,
          status: data.status,
        },
        fieldStatus: {
          secondarySource: 'valid',
          status: 'valid',
        }
      },
    ] as DataSource[]).filter(source => Object.keys(source.data).length > 0);
    
    // Auto-generate fieldStatus for merged data
    const autoFieldStatus: Record<string, 'valid' | 'warning'> = {};
    generatedDataSources.forEach(source => {
      if (source.fieldStatus) {
        Object.entries(source.fieldStatus).forEach(([key, status]) => {
          // If any source marks a field as warning, the merged data should also show warning
          if (!autoFieldStatus[key] || status === 'warning') {
            autoFieldStatus[key] = status;
          }
        });
      }
    });
    
    // Merge with provided fieldStatus
    Object.assign(autoFieldStatus, fieldStatus);
    fieldStatus = autoFieldStatus;
  }

  const toggleSource = (sourceId: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId);
    } else {
      newExpanded.add(sourceId);
    }
    setExpandedSources(newExpanded);
  };

  // Check if data has been processed (has originalData field) - for backward compatibility
  const hasOriginalData = data?.originalData && Object.keys(data.originalData).length > 0;
  const showComparison = mode === 'compare' && hasOriginalData;
  const showMerge = mode === 'merge' && generatedDataSources.length > 0;

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs for merge mode */}
        {showMerge && (
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-between px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`pb-3 pt-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'sources'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nguồn dữ liệu
                </button>
                <button
                  onClick={() => setActiveTab('merged')}
                  className={`pb-3 pt-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'merged'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dữ liệu đã gộp
                </button>
              </div>
              
              {/* Version Selector */}
              <div className="flex items-center gap-2 pb-3 pt-4">
                <Clock className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {generatedVersions.map((version) => (
                    <option key={version.version} value={version.version}>
                      {version.version.toUpperCase()} - {version.date} ({version.updatedBy})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {showMerge ? (
            activeTab === 'sources' ? (
              <div className="space-y-3">
                {generatedDataSources.map((source) => {
                  const isExpanded = expandedSources.has(source.id);
                  
                  return (
                    <div key={source.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* Source Header */}
                      <button
                        onClick={() => toggleSource(source.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          )}
                          <span className="text-slate-900">{source.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {Object.keys(source.data).length} trường dữ liệu
                        </span>
                      </button>

                      {/* Source Data */}
                      {isExpanded && (
                        <div className="p-4 bg-white space-y-3">
                          {fields.map((field) => {
                            const value = source.data[field.key];
                            if (!value) return null;
                            
                            const status = source.fieldStatus?.[field.key];
                            const bgColor = status === 'valid' ? 'bg-green-50' : status === 'warning' ? 'bg-orange-50' : '';
                            const textColor = status === 'valid' ? 'text-green-900' : status === 'warning' ? 'text-orange-900' : 'text-slate-900';

                            return (
                              <div key={field.key} className={`grid grid-cols-3 gap-4 py-2 px-3 rounded ${bgColor} border-b border-slate-100 last:border-0`}>
                                <div className="text-sm text-slate-600">{field.label}:</div>
                                <div className={`col-span-2 text-sm ${textColor}`}>
                                  {value}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-blue-900 mb-1">Dữ liệu sau khi gộp</h4>
                    <p className="text-sm text-blue-700">
                      Đây là kết quả sau khi gộp dữ liệu từ {generatedDataSources.length} nguồn
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 space-y-3">
                  {fields.map((field) => {
                    const value = currentVersionData[field.key];
                    if (!value) return null;
                    
                    const status = fieldStatus[field.key];
                    const bgColor = status === 'valid' ? 'bg-green-50' : status === 'warning' ? 'bg-orange-50' : '';
                    const textColor = status === 'valid' ? 'text-green-900' : status === 'warning' ? 'text-orange-900' : 'text-slate-900';

                    return (
                      <div key={field.key} className={`grid grid-cols-3 gap-4 py-2 px-3 rounded ${bgColor} border-b border-slate-100 last:border-0`}>
                        <div className="text-sm text-slate-600">{field.label}:</div>
                        <div className={`col-span-2 text-sm ${textColor}`}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-sm pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                    <span className="text-slate-600">Dữ liệu hợp lệ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
                    <span className="text-slate-600">Cần kiểm tra</span>
                  </div>
                </div>
              </div>
            )
          ) : showComparison ? (
            <div className="space-y-6">
              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-blue-900 mb-1">Dữ liệu đã được xử lý</h4>
                    <p className="text-sm text-blue-700">
                      Bản ghi này đã được xử lý qua hệ thống. Bên trái là dữ liệu gốc, bên phải là dữ liệu sau xử lý.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase w-1/4">Trường dữ liệu</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase w-3/8">Dữ liệu gốc</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-700 uppercase w-3/8">Dữ liệu đã xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {fields.map((field) => {
                      const originalValue = data.originalData[field.key] || '-';
                      const processedValue = data[field.key] || '-';
                      const hasChanged = originalValue !== processedValue;

                      return (
                        <tr key={field.key} className={hasChanged ? 'bg-amber-50' : ''}>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {field.label}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={hasChanged ? 'text-red-700' : 'text-slate-600'}>
                              {originalValue}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={hasChanged ? 'text-green-700' : 'text-slate-900'}>
                              {processedValue}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded"></div>
                  <span className="text-slate-600">Trường đã thay đổi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-700">Màu đỏ</span>
                  <span className="text-slate-600">= Giá trị gốc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-700">Màu xanh</span>
                  <span className="text-slate-600">= Giá trị đã xử lý</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="grid grid-cols-3 gap-4">
                  <div className="text-sm text-slate-600">{field.label}:</div>
                  <div className="col-span-2 text-sm text-slate-900">
                    {data[field.key] || '-'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          {onEdit && (
            <button
              onClick={() => onEdit(data)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Chỉnh sửa
            </button>
          )}
          {onSubmitForApproval && (
            <button
              onClick={() => onSubmitForApproval(data)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gửi duyệt
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}