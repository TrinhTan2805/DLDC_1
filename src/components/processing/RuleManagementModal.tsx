import { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';

interface Rule {
  id: number;
  name: string;
  type: 'cleaning' | 'normalization' | 'transformation';
  typeLabel: string;
  isApplied: boolean;
  appliedFields?: string[];
  config?: any;
}

interface RuleManagementModalProps {
  config: any;
  onClose: () => void;
}

type TabType = 'cleaning' | 'normalization' | 'transformation';

export function RuleManagementModal({ config, onClose }: RuleManagementModalProps) {
  // Danh sách các trường có sẵn trong bảng dữ liệu
  const availableFields = [
    'ho_ten',
    'so_cccd',
    'ngay_sinh',
    'gioi_tinh',
    'email',
    'email_lien_he',
    'so_dien_thoai',
    'dien_thoai_dd',
    'dia_chi',
    'dia_chi_thuong_tru',
    'tinh_thanh',
    'quan_huyen',
    'phuong_xa',
    'ngay_cap',
    'noi_cap',
    'quoc_tich',
    'dan_toc',
    'ton_giao',
    'nghe_nghiep',
    'trinh_do_hoc_van'
  ];

  const [activeTab, setActiveTab] = useState<TabType>('cleaning');
  const [rules, setRules] = useState<Rule[]>([
    // Quy tắc Làm sạch
    { id: 1, name: 'Kiểm tra quy tắc về chuẩn định dạng', type: 'cleaning', typeLabel: 'Làm sạch', isApplied: false, appliedFields: [] },
    { id: 2, name: 'Kiểm tra tính hợp lệ của dữ liệu', type: 'cleaning', typeLabel: 'Làm sạch', isApplied: false, appliedFields: [] },
    { id: 3, name: 'Xử lý giá trị thiếu dữ liệu', type: 'cleaning', typeLabel: 'Làm sạch', isApplied: false, appliedFields: [] },
    { id: 4, name: 'Loại bỏ hoặc thay thế giá trị ngoại lệ', type: 'cleaning', typeLabel: 'Làm sạch', isApplied: false, appliedFields: [] },
    
    // Quy tắc Chuẩn hóa
    { id: 5, name: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa', type: 'normalization', typeLabel: 'Chuẩn hóa', isApplied: true, appliedFields: ['so_cccd', 'email'] },
    { id: 6, name: 'Xử lý trùng lặp', type: 'normalization', typeLabel: 'Chuẩn hóa', isApplied: true, appliedFields: ['so_cccd'] },
    { id: 7, name: 'Xử lý vi phạm về ràng buộc thuộc tính tham chiếu', type: 'normalization', typeLabel: 'Chuẩn hóa', isApplied: false, appliedFields: [] },
    
    // Quy tắc Biến đổi
    { id: 8, name: 'Biến đổi định dạng dữ liệu', type: 'transformation', typeLabel: 'Biến đổi', isApplied: false, appliedFields: [] },
    { id: 9, name: 'Gộp hoặc tách cột dữ liệu', type: 'transformation', typeLabel: 'Biến đổi', isApplied: false, appliedFields: [] },

  ]);

  const [expandedRuleId, setExpandedRuleId] = useState<number | null>(null);

  // Hàm toggle áp dụng quy tắc
  const toggleRuleApplication = (ruleId: number) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isApplied: !rule.isApplied }
        : rule
    ));
    // Mở panel chọn trường khi bật áp dụng
    if (!rules.find(r => r.id === ruleId)?.isApplied) {
      setExpandedRuleId(ruleId);
    }
  };

  // Hàm thêm trường vào quy tắc
  const addFieldToRule = (ruleId: number, field: string) => {
    setRules(rules.map(rule => {
      if (rule.id === ruleId) {
        const currentFields = rule.appliedFields || [];
        if (!currentFields.includes(field)) {
          return { ...rule, appliedFields: [...currentFields, field] };
        }
      }
      return rule;
    }));
  };

  // Hàm xóa trường khỏi quy tắc
  const removeFieldFromRule = (ruleId: number, field: string) => {
    setRules(rules.map(rule => {
      if (rule.id === ruleId) {
        return { 
          ...rule, 
          appliedFields: (rule.appliedFields || []).filter(f => f !== field) 
        };
      }
      return rule;
    }));
  };

  // Hàm chọn tất cả các trường cho quy tắc
  const addAllFieldsToRule = (ruleId: number) => {
    setRules(rules.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, appliedFields: [...availableFields] };
      }
      return rule;
    }));
  };

  // Hàm bỏ chọn tất cả các trường
  const removeAllFieldsFromRule = (ruleId: number) => {
    setRules(rules.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, appliedFields: [] };
      }
      return rule;
    }));
  };

  // Hàm cập nhật cấu hình quy tắc
  const updateRuleConfig = (ruleId: number, configKey: string, value: any) => {
    setRules(rules.map(rule => {
      if (rule.id === ruleId) {
        return { 
          ...rule, 
          config: { ...rule.config, [configKey]: value } 
        };
      }
      return rule;
    }));
  };

  // Component hiển thị form cấu hình cho từng loại quy tắc
  const renderRuleConfig = (rule: Rule) => {
    // Quy tắc 1: Kiểm tra chuẩn định dạng
    if (rule.id === 1) {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình định dạng:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Định dạng ngày tháng:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rule.config?.dateFormat || 'dd/mm/yyyy'}
                onChange={(e) => updateRuleConfig(rule.id, 'dateFormat', e.target.value)}
              >
                <option value="dd/mm/yyyy">dd/mm/yyyy (VD: 15/08/2023)</option>
                <option value="dd-mm-yyyy">dd-mm-yyyy (VD: 15-08-2023)</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd (VD: 2023-08-15)</option>
                <option value="mm/dd/yyyy">mm/dd/yyyy (VD: 08/15/2023)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600">Pattern Regex (tùy chọn):</label>
              <input 
                type="text"
                placeholder="VD: ^\d{2}/\d{2}/\d{4}$"
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                value={rule.config?.regexPattern || ''}
                onChange={(e) => updateRuleConfig(rule.id, 'regexPattern', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 2: Kiểm tra tính hợp lệ
    if (rule.id === 2) {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình kiểm tra hợp lệ:</div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Điều kiện:</label>
                <select 
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rule.config?.condition || ''}
                  onChange={(e) => updateRuleConfig(rule.id, 'condition', e.target.value)}
                >
                  <option value="">-- Chọn điều kiện --</option>
                  <option value="=">Bằng (=)</option>
                  <option value="!=">Khác (!=)</option>
                  <option value=">">Lớn hơn (&gt;)</option>
                  <option value="<">Nhỏ hơn (&lt;)</option>
                  <option value=">=">Lớn hơn hoặc bằng (&gt;=)</option>
                  <option value="<=">Nhỏ hơn hoặc bằng (&lt;=)</option>
                  <option value="IN">Thuộc danh sách (IN)</option>
                  <option value="NOT IN">Không thuộc danh sách (NOT IN)</option>
                  <option value="s%">Bắt đầu bằng (s%)</option>
                  <option value="%s">Kết thúc bằng (%s)</option>
                  <option value="%s%">Bao gồm (%s%)</option>
                  <option value="REGEX">Khớp biểu thức nâng cao (REGEX)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600">Giá trị:</label>
                {(rule.config?.condition === 'IN' || rule.config?.condition === 'NOT IN') ? (
                  <div className="mt-1 flex flex-wrap gap-1 p-1.5 min-h-[34px] bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                    {(rule.config?.value || '').split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-medium rounded border border-blue-200">
                        {tag.trim()}
                        <button 
                          onClick={() => {
                            const tags = (rule.config?.value || '').split(',').filter((_: any, i: number) => i !== idx);
                            updateRuleConfig(rule.id, 'value', tags.join(','));
                          }}
                          className="hover:text-blue-900"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      placeholder="Nhập..."
                      className="flex-1 bg-transparent border-none outline-none text-sm min-w-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            const currentTags = rule.config?.value ? rule.config.value.split(',') : [];
                            if (!currentTags.includes(val)) {
                              updateRuleConfig(rule.id, 'value', [...currentTags, val].join(','));
                            }
                            (e.target as HTMLInputElement).value = '';
                          }
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                ) : (
                  <input 
                    type="text"
                    placeholder="Nhập giá trị..."
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={rule.config?.value || ''}
                    onChange={(e) => updateRuleConfig(rule.id, 'value', e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Kiểu dữ liệu (Gợi ý):</label>
                <select 
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rule.config?.dataType || 'text'}
                  onChange={(e) => updateRuleConfig(rule.id, 'dataType', e.target.value)}
                >
                  <option value="text">Văn bản</option>
                  <option value="number">Số</option>
                  <option value="email">Email</option>
                  <option value="phone">Số điện thoại</option>
                  <option value="cccd">Số CCCD</option>
                  <option value="date">Ngày tháng</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600">Xử lý ngoại lệ:</label>
                <select 
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rule.config?.action || ''}
                  onChange={(e) => updateRuleConfig(rule.id, 'action', e.target.value)}
                >
                  <option value="">-- Chọn xử lý --</option>
                  <option value="Loại bỏ bản ghi">Loại bỏ bản ghi</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 3: Xử lý giá trị thiếu
    if (rule.id === 3) {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình xử lý giá trị thiếu:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Cách xử lý:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rule.config?.missingAction || 'keep'}
                onChange={(e) => updateRuleConfig(rule.id, 'missingAction', e.target.value)}
              >
                <option value="keep">Giữ nguyên (để trống)</option>
                <option value="default">Điền giá trị mặc định</option>
                <option value="delete">Xóa bản ghi</option>
                <option value="interpolate">Nội suy từ giá trị khác</option>
              </select>
            </div>
            {rule.config?.missingAction === 'default' && (
              <div>
                <label className="text-xs text-slate-600">Giá trị mặc định:</label>
                <input 
                  type="text"
                  placeholder="VD: Không xác định"
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rule.config?.defaultValue || ''}
                  onChange={(e) => updateRuleConfig(rule.id, 'defaultValue', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Quy tắc 4: Loại bỏ/thay thế ngoại lệ
    if (rule.id === 4) {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình xử lý ngoại lệ:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Điều kiện ngoại lệ:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rule.config?.outlierCondition || 'range'}
                onChange={(e) => updateRuleConfig(rule.id, 'outlierCondition', e.target.value)}
              >
                <option value="range">Ngoài khoảng cho phép</option>
                <option value="statistical">Dựa trên thống kê (Z-score, IQR)</option>
                <option value="pattern">Không khớp pattern</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>
            {rule.config?.outlierCondition === 'range' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600">Giá trị min:</label>
                  <input 
                    type="text"
                    placeholder="VD: 0"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={rule.config?.outlierMin || ''}
                    onChange={(e) => updateRuleConfig(rule.id, 'outlierMin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Giá trị max:</label>
                  <input 
                    type="text"
                    placeholder="VD: 1000"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={rule.config?.outlierMax || ''}
                    onChange={(e) => updateRuleConfig(rule.id, 'outlierMax', e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs text-slate-600">Hành động:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rule.config?.outlierAction || 'remove'}
                onChange={(e) => updateRuleConfig(rule.id, 'outlierAction', e.target.value)}
              >
                <option value="remove">Loại bỏ bản ghi</option>
                <option value="replace">Thay thế bằng giá trị</option>
                <option value="cap">Giới hạn ở ngưỡng min/max</option>
                <option value="flag">Đánh dấu cảnh báo</option>
              </select>
            </div>
            {rule.config?.outlierAction === 'replace' && (
              <div>
                <label className="text-xs text-slate-600">Giá trị thay thế:</label>
                <input 
                  type="text"
                  placeholder="VD: 0 hoặc NULL"
                  className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rule.config?.replaceValue || ''}
                  onChange={(e) => updateRuleConfig(rule.id, 'replaceValue', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Quy tắc 5: Kiểm tra đối sánh tồn tại
    if (rule.id === 5) {
      return (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình kiểm tra trường khóa:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Bảng tham chiếu:</label>
              <input 
                type="text"
                placeholder="VD: tb_nguoi_dung"
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={rule.config?.refTable || ''}
                onChange={(e) => updateRuleConfig(rule.id, 'refTable', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Hành động khi không tồn tại:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={rule.config?.notExistAction || 'reject'}
                onChange={(e) => updateRuleConfig(rule.id, 'notExistAction', e.target.value)}
              >
                <option value="reject">Từ chối bản ghi</option>
                <option value="create">Tạo mới trong bảng tham chiếu</option>
                <option value="flag">Đánh dấu cảnh báo</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 6: Xử lý trùng lặp
    if (rule.id === 6) {
      return (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình xử lý trùng lặp:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Phương thức xử lý:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={rule.config?.duplicateAction || 'keep_first'}
                onChange={(e) => updateRuleConfig(rule.id, 'duplicateAction', e.target.value)}
              >
                <option value="keep_first">Giữ bản ghi đầu tiên</option>
                <option value="keep_last">Giữ bản ghi cuối cùng</option>
                <option value="merge">Gộp thông tin</option>
                <option value="flag_all">Đánh dấu tất cả</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input 
                  type="checkbox"
                  className="rounded border-slate-300"
                  checked={rule.config?.caseSensitive || false}
                  onChange={(e) => updateRuleConfig(rule.id, 'caseSensitive', e.target.checked)}
                />
                Phân biệt chữ hoa/thường
              </label>
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 7: Xử lý vi phạm ràng buộc
    if (rule.id === 7) {
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-slate-700 mb-2 font-bold uppercase tracking-wider">Cấu hình ràng buộc tham chiếu:</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 font-medium">Bảng tham chiếu:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={rule.config?.refTable || 'dm_tinh_thanh'}
                onChange={(e) => updateRuleConfig(rule.id, 'refTable', e.target.value)}
              >
                <option value="dm_tinh_thanh">Danh mục Tỉnh/Thành phố</option>
                <option value="dm_quan_huyen">Danh mục Quận/Huyện</option>
                <option value="dm_phuong_xa">Danh mục Phường/Xã</option>
                <option value="dm_dan_toc">Danh mục Dân tộc</option>
                <option value="dm_quoc_tich">Danh mục Quốc tịch</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">Trường tham chiếu:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={rule.config?.refField || 'ma_tinh'}
                onChange={(e) => updateRuleConfig(rule.id, 'refField', e.target.value)}
              >
                <option value="ma_tinh">Mã Tỉnh/Thành phố</option>
                <option value="ten_tinh">Tên Tỉnh/Thành phố</option>
                <option value="ma_quan_huyen">Mã Quận/Huyện</option>
                <option value="ma_phuong_xa">Mã Phường/Xã</option>
                <option value="ma_dan_toc">Mã Dân tộc</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">Hành động:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={rule.config?.violationAction || 'reject'}
                onChange={(e) => updateRuleConfig(rule.id, 'violationAction', e.target.value)}
              >
                <option value="reject">Từ chối bản ghi vi phạm</option>
                <option value="set_null">Gán giá trị rỗng (NULL)</option>
                <option value="set_default">Gán giá trị mặc định</option>
                <option value="flag">Đánh dấu cảnh báo</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 8: Biến đổi định dạng
    if (rule.id === 8) {
      return (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình biến đổi định dạng:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Định dạng nguồn:</label>
              <input 
                type="text"
                placeholder="VD: dd/mm/yyyy"
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={rule.config?.sourceFormat || ''}
                onChange={(e) => updateRuleConfig(rule.id, 'sourceFormat', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Định dạng đích:</label>
              <input 
                type="text"
                placeholder="VD: yyyy-mm-dd"
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={rule.config?.targetFormat || ''}
                onChange={(e) => updateRuleConfig(rule.id, 'targetFormat', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }

    // Quy tắc 9: Gộp/tách cột
    if (rule.id === 9) {
      return (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs text-slate-700 mb-2">Cấu hình gộp/tách cột:</div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600">Thao tác:</label>
              <select 
                className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={rule.config?.columnOperation || 'merge'}
                onChange={(e) => updateRuleConfig(rule.id, 'columnOperation', e.target.value)}
              >
                <option value="merge">Gộp cột</option>
                <option value="split">Tách cột</option>
              </select>
            </div>
            {rule.config?.columnOperation === 'merge' && (
              <>
                <div>
                  <label className="text-xs text-slate-600">Dấu phân cách:</label>
                  <input 
                    type="text"
                    placeholder="VD: ' ' (khoảng trắng), ',' (dấu phẩy)"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={rule.config?.separator || ' '}
                    onChange={(e) => updateRuleConfig(rule.id, 'separator', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Tên cột mới:</label>
                  <input 
                    type="text"
                    placeholder="VD: ho_ten_day_du"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={rule.config?.newColumnName || ''}
                    onChange={(e) => updateRuleConfig(rule.id, 'newColumnName', e.target.value)}
                  />
                </div>
              </>
            )}
            {rule.config?.columnOperation === 'split' && (
              <>
                <div>
                  <label className="text-xs text-slate-600">Dấu phân cách:</label>
                  <input 
                    type="text"
                    placeholder="VD: ' ', ',', '-'"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={rule.config?.splitSeparator || ' '}
                    onChange={(e) => updateRuleConfig(rule.id, 'splitSeparator', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Tên các cột mới (phân cách bởi dấu phẩy):</label>
                  <input 
                    type="text"
                    placeholder="VD: ho, ten_dem, ten"
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={rule.config?.newColumns || ''}
                    onChange={(e) => updateRuleConfig(rule.id, 'newColumns', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      );
    }



    return null;
  };

  // Lọc quy tắc theo tab
  const filteredRules = rules.filter(rule => rule.type === activeTab);
  const appliedCount = rules.filter(r => r.isApplied).length;

  const typeColors = {
    cleaning: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-600' },
    normalization: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-600' },
    transformation: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-600' }
  };

  const tabs = [
    { key: 'cleaning' as TabType, label: 'Làm sạch', count: rules.filter(r => r.type === 'cleaning').length },
    { key: 'normalization' as TabType, label: 'Chuẩn hóa', count: rules.filter(r => r.type === 'normalization').length },
    { key: 'transformation' as TabType, label: 'Biến đổi', count: rules.filter(r => r.type === 'transformation').length },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Quản lý Quy tắc Xử lý</h3>
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
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-lg p-4 ${
                  rule.isApplied ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'
                }`}
              >
                {/* Rule Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm text-slate-900">{rule.name}</h4>
                      {rule.isApplied && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Đã áp dụng
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)}
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform ${
                          expandedRuleId === rule.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => toggleRuleApplication(rule.id)}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        rule.isApplied
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {rule.isApplied ? 'Hủy áp dụng' : 'Áp dụng'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRuleId === rule.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    {/* Field Selection */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-slate-600">Chọn trường áp dụng:</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addAllFieldsToRule(rule.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Chọn tất cả
                          </button>
                          <button
                            onClick={() => removeAllFieldsFromRule(rule.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Bỏ chọn tất cả
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                        {availableFields.map((field) => {
                          const isSelected = rule.appliedFields?.includes(field);
                          return (
                            <label
                              key={field}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-colors ${
                                isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addFieldToRule(rule.id, field);
                                  } else {
                                    removeFieldFromRule(rule.id, field);
                                  }
                                }}
                                className="rounded border-slate-300"
                              />
                              {field}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rule Config Form */}
                    {renderRuleConfig(rule)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Đã áp dụng {appliedCount} / {rules.length} quy tắc
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
