import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Hash, ChevronDown, Check, AlertCircle, Send, Search } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

type SeparatorType = 'none' | '-' | '.' | '/';
type RuleStatus = 'active' | 'inactive';

interface IdentifierRule {
  id: string;
  entityId: string;
  entityName: string;
  prefix: string;
  suffix: string;
  separator: SeparatorType;
  digits: number;
  startFrom: number;
  increment: number;
  checkDuplicate: boolean;
  status: RuleStatus;
  createdDate: string;
  totalGenerated: number;
}

const mockIdentifierRules: IdentifierRule[] = [
  {
    id: 'rule-1',
    entityId: '1',
    entityName: 'Bộ dữ liệu chủ Công dân',
    prefix: 'CTZ',
    suffix: '',
    separator: '-',
    digits: 6,
    startFrom: 1,
    increment: 1,
    checkDuplicate: true,
    status: 'active',
    createdDate: '10/12/2024',
    totalGenerated: 1542
  },
  {
    id: 'rule-2',
    entityId: '2',
    entityName: 'Bộ dữ liệu chủ Tổ chức',
    prefix: 'ORG',
    suffix: '',
    separator: 'none',
    digits: 6,
    startFrom: 1000,
    increment: 1,
    checkDuplicate: true,
    status: 'active',
    createdDate: '12/12/2024',
    totalGenerated: 1847
  },
  {
    id: 'rule-3',
    entityId: '3',
    entityName: 'Bộ dữ liệu chủ Văn bản pháp luật',
    prefix: 'DOC',
    suffix: '',
    separator: '/',
    digits: 6,
    startFrom: 1,
    increment: 1,
    checkDuplicate: true,
    status: 'active',
    createdDate: '15/12/2024',
    totalGenerated: 8456
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân', version: 2 },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức', version: 2 },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật', version: 1 },
  { id: '4', code: 'MD-ADMIN-001', name: 'Bộ dữ liệu chủ Đơn vị hành chính', version: 1 },
  { id: '5', code: 'MD-AGENCY-001', name: 'Bộ dữ liệu chủ Cơ quan nhà nước', version: 1 }
];

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình', position: 'Phó Cục trưởng', department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường', position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan', position: 'Trưởng phòng', department: 'Phòng Nghiệp vụ pháp lý' }
];

interface PreviewInput {
  prefix: string;
  suffix: string;
  separator: SeparatorType;
  digits: number;
}

const buildCode = (cfg: PreviewInput, number: number) => {
  const sep = cfg.separator === 'none' ? '' : cfg.separator;
  const padded = String(number).padStart(cfg.digits, '0');
  return [cfg.prefix, padded, cfg.suffix].filter(Boolean).join(sep);
};

export function UniqueIdentifierRulesTab({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [rules, setRules] = useState<IdentifierRule[]>(mockIdentifierRules);

  // Chọn thực thể dữ liệu chủ để xem/cấu hình quy tắc định danh
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('1');
  const selectedFilterEntityData = mockEntities.find(e => e.id === selectedEntityFilter);
  const currentRule = selectedEntityFilter ? rules.find(rule => rule.entityId === selectedEntityFilter) : undefined;

  // Combobox chọn thực thể (giống tab Quản lý thuộc tính dữ liệu chủ)
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setComboboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredEntities = mockEntities.filter(entity =>
    entity.name.toLowerCase().includes(comboboxSearch.toLowerCase()) ||
    entity.code.toLowerCase().includes(comboboxSearch.toLowerCase())
  );

  // Modal Thêm/Chỉnh sửa — giống Bước 2 "Định danh duy nhất" trong wizard Tạo mới dữ liệu chủ
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<IdentifierRule | null>(null);
  const [formData, setFormData] = useState<PreviewInput & { startFrom: number; increment: number; checkDuplicate: boolean }>({
    prefix: '',
    suffix: '',
    separator: '-',
    digits: 6,
    startFrom: 1,
    increment: 1,
    checkDuplicate: true
  });

  // Gửi phê duyệt modal (shown after add/edit quy tắc định danh)
  const [approvalRule, setApprovalRule] = useState<IdentifierRule | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormData({ prefix: '', suffix: '', separator: '-', digits: 6, startFrom: 1, increment: 1, checkDuplicate: true });
    setShowForm(true);
  };

  const handleOpenEdit = (rule: IdentifierRule) => {
    setEditingRule(rule);
    setFormData({
      prefix: rule.prefix,
      suffix: rule.suffix,
      separator: rule.separator,
      digits: rule.digits,
      startFrom: rule.startFrom,
      increment: rule.increment,
      checkDuplicate: rule.checkDuplicate
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  const handleSubmit = () => {
    if (!formData.prefix.trim()) {
      alert('Vui lòng nhập tiền tố (prefix)');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    let savedRule: IdentifierRule;

    if (editingRule) {
      savedRule = { ...editingRule, ...formData };
      setRules(rules.map(rule => rule.id === editingRule.id ? savedRule : rule));
    } else {
      savedRule = {
        id: `rule-${Date.now()}`,
        entityId: selectedEntityFilter,
        entityName: selectedFilterEntityData?.name || '',
        ...formData,
        status: 'active',
        createdDate: dateStr,
        totalGenerated: 0
      };
      setRules([...rules, savedRule]);
    }

    handleCloseForm();

    // Gửi phê duyệt để áp dụng phiên bản mới của thực thể dữ liệu chủ
    setApprovalRule(savedRule);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleCloseApprovalModal = () => {
    setApprovalRule(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmApprove = () => {
    if (!approvalRule || !selectedApprover) return;
    alert('Đã gửi phê duyệt quy tắc định danh thành công!');
    handleCloseApprovalModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc định danh này? Điều này có thể ảnh hưởng đến dữ liệu đã tạo.')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const getStatusBadge = (status: RuleStatus) => {
    return status === 'active'
      ? { label: 'Hoạt động', className: 'bg-green-100 text-green-700' }
      : { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700' };
  };

  const formSep = formData.separator === 'none' ? '' : formData.separator;
  const previewCode = buildCode(formData, formData.startFrom);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900">Thiết lập quy tắc định danh duy nhất</h2>
      </div>

      {/* Entity Filter */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-[13px] text-slate-700 mb-2">
          Xem theo thực thể dữ liệu chủ
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-[13px]"
            onClick={() => setComboboxOpen(!comboboxOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                {selectedFilterEntityData ? (
                  <div>
                    <span className="text-[13px] text-slate-900">{selectedFilterEntityData.code}</span>
                    <span className="text-[13px] text-slate-600"> - {selectedFilterEntityData.name}</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-slate-500">Chọn thực thể dữ liệu chủ...</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={comboboxSearch}
                    onChange={(e) => setComboboxSearch(e.target.value)}
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto max-h-52">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${selectedEntityFilter === entity.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedEntityFilter(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[13px] text-slate-900">{entity.code}</span>
                            <span className="text-[13px] text-slate-600"> - {entity.name}</span>
                          </div>
                          {selectedEntityFilter === entity.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung theo thực thể đã chọn */}
      {!selectedEntityFilter ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Hash className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-[13px] text-slate-500">
            Vui lòng chọn thực thể dữ liệu chủ để xem quy tắc định danh duy nhất
          </p>
        </div>
      ) : !currentRule ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Hash className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-[13px] text-slate-500 mb-4">
            Chưa cấu hình quy tắc định danh duy nhất nào
          </p>
          {!readOnly && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm quy tắc định danh
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thanh tóm tắt quy tắc + thao tác */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-slate-900">Quy tắc định danh: {currentRule.entityName}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] ${getStatusBadge(currentRule.status).className}`}>
                  {getStatusBadge(currentRule.status).label}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">
                Đã tạo {currentRule.totalGenerated.toLocaleString()} mã định danh
              </p>
            </div>
            {!readOnly && SHOW_EDIT_DELETE_ACTIONS && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleOpenEdit(currentRule)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg text-[13px] font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDelete(currentRule.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-[13px] font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
            )}
          </div>

          {/* Mục 2 — Định danh duy nhất (read-only, giống Bước 2 của wizard) */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
                <h4 className="text-[13px] font-bold text-slate-800">Cấu trúc mã định danh</h4>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="block text-slate-500 mb-1">Tiền tố (Prefix)</span>
                    <span className="font-medium text-slate-800">{currentRule.prefix || '(không có)'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Hậu tố (Suffix)</span>
                    <span className="font-medium text-slate-800">{currentRule.suffix || '(không có)'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Ký tự phân cách</span>
                    <span className="font-medium text-slate-800">{currentRule.separator === 'none' ? 'Không dùng' : `"${currentRule.separator}"`}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Độ dài số thứ tự</span>
                    <span className="font-medium text-slate-800">{currentRule.digits} chữ số</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
                <h4 className="text-[13px] font-bold text-slate-800">Số tự tăng</h4>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="block text-slate-500 mb-1">Bắt đầu từ</span>
                    <span className="font-medium text-slate-800">{currentRule.startFrom}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Bước tăng</span>
                    <span className="font-medium text-slate-800">{currentRule.increment}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-white flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${currentRule.checkDuplicate ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  {currentRule.checkDuplicate && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-slate-700">Kiểm tra trùng lặp khi tạo mới</p>
                  <p className="text-[13px] text-slate-500 mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
                </div>
              </div>
            </div>

            {/* Right — preview */}
            <div className="space-y-4">
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-4">
                <h4 className="text-[13px] font-bold text-blue-900">Mẫu mã định danh</h4>
                <div className="bg-white border border-blue-200 rounded-lg px-6 py-7 text-center">
                  <code className="text-2xl font-mono font-bold text-blue-700 tracking-widest">
                    {buildCode(currentRule, currentRule.startFrom)}
                  </code>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Mã thứ 1:</span>
                    <code className="font-mono font-semibold text-slate-800">{buildCode(currentRule, currentRule.startFrom)}</code>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                    <span className="text-slate-600">Mã thứ 2:</span>
                    <code className="font-mono font-semibold text-slate-800">{buildCode(currentRule, currentRule.startFrom + currentRule.increment)}</code>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-600">Mã thứ 3:</span>
                    <code className="font-mono font-semibold text-slate-800">{buildCode(currentRule, currentRule.startFrom + currentRule.increment * 2)}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Chỉnh sửa quy tắc định danh — giống Bước 2 của wizard Tạo mới dữ liệu chủ */}
      <BaseModal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingRule ? 'Chỉnh sửa quy tắc định danh' : 'Thêm quy tắc định danh mới'}
        subtitle={selectedFilterEntityData ? `Thực thể: ${selectedFilterEntityData.name}` : undefined}
        maxWidth="max-w-4xl"
        customHeaderIcon={<Hash className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCloseForm}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left — form */}
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
              <h4 className="text-[13px] font-bold text-slate-800">Cấu trúc mã định danh</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Tiền tố (Prefix)</label>
                  <input
                    type="text"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                    placeholder="VD: NDAN, ORG"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Hậu tố (Suffix)</label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value.toUpperCase() })}
                    placeholder="Để trống nếu không dùng"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Ký tự phân cách</label>
                  <select
                    value={formData.separator}
                    onChange={(e) => setFormData({ ...formData, separator: e.target.value as SeparatorType })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="none">Không dùng</option>
                    <option value="-">Gạch ngang ( - )</option>
                    <option value=".">Dấu chấm ( . )</option>
                    <option value="/">Dấu gạch chéo ( / )</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Độ dài số thứ tự</label>
                  <input
                    type="number" min={1} max={12}
                    value={formData.digits}
                    onChange={(e) => setFormData({ ...formData, digits: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
              <h4 className="text-[13px] font-bold text-slate-800">Số tự tăng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Bắt đầu từ</label>
                  <input
                    type="number" min={0}
                    value={formData.startFrom}
                    onChange={(e) => setFormData({ ...formData, startFrom: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">Bước tăng</label>
                  <input
                    type="number" min={1}
                    value={formData.increment}
                    onChange={(e) => setFormData({ ...formData, increment: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none border border-slate-200 rounded-xl p-5 bg-white">
              <input
                type="checkbox"
                checked={formData.checkDuplicate}
                onChange={() => setFormData({ ...formData, checkDuplicate: !formData.checkDuplicate })}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer w-4 h-4 flex-shrink-0"
              />
              <div>
                <p className="text-[13px] font-medium text-slate-700">Kiểm tra trùng lặp khi tạo mới</p>
                <p className="text-[13px] text-slate-500 mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
              </div>
            </label>
          </div>

          {/* Right — preview */}
          <div className="space-y-4">
            <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-4">
              <h4 className="text-[13px] font-bold text-blue-900">Mẫu mã định danh</h4>
              <div className="bg-white border border-blue-200 rounded-lg px-6 py-7 text-center">
                {previewCode ? (
                  <code className="text-2xl font-mono font-bold text-blue-700 tracking-widest">
                    {previewCode}
                  </code>
                ) : (
                  <span className="text-[13px] text-slate-400">Nhập tiền tố để xem mẫu mã</span>
                )}
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                  <span className="text-slate-600">Mã thứ 1:</span>
                  <code className="font-mono font-semibold text-slate-800">
                    {[formData.prefix, String(formData.startFrom).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </code>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                  <span className="text-slate-600">Mã thứ 2:</span>
                  <code className="font-mono font-semibold text-slate-800">
                    {[formData.prefix, String(formData.startFrom + formData.increment).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </code>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-600">Mã thứ 3:</span>
                  <code className="font-mono font-semibold text-slate-800">
                    {[formData.prefix, String(formData.startFrom + formData.increment * 2).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </code>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
              <h4 className="text-[13px] font-bold text-slate-800">Tóm tắt cấu hình</h4>
              <div className="space-y-2.5 text-[13px]">
                <div className="flex justify-between items-center"><span className="text-slate-500">Tiền tố:</span><span className="font-medium text-slate-800">{formData.prefix || '(không có)'}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Ký tự phân cách:</span><span className="font-medium text-slate-800">{formData.separator === 'none' ? 'Không dùng' : `"${formData.separator}"`}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Độ dài số:</span><span className="font-medium text-slate-800">{formData.digits} chữ số</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Bắt đầu từ:</span><span className="font-medium text-slate-800">{formData.startFrom}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Bước tăng:</span><span className="font-medium text-slate-800">{formData.increment}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Kiểm tra trùng:</span><span className={`font-medium ${formData.checkDuplicate ? 'text-green-700' : 'text-slate-500'}`}>{formData.checkDuplicate ? 'Bật' : 'Tắt'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {selectedFilterEntityData && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-amber-800">
              <p className="mb-1">
                {editingRule ? 'Khi chỉnh sửa quy tắc định danh, ' : 'Khi thêm mới quy tắc định danh, '}
                phiên bản thực thể dữ liệu chủ <strong>{selectedFilterEntityData.name}</strong> sẽ tự động tăng từ{' '}
                <strong>v{selectedFilterEntityData.version}</strong> lên <strong>v{selectedFilterEntityData.version + 1}</strong>.
              </p>
              <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
            </div>
          </div>
        )}
      </BaseModal>

      {/* Gửi phê duyệt Modal — shown after add/edit quy tắc định danh */}
      <BaseModal
        isOpen={!!approvalRule}
        onClose={handleCloseApprovalModal}
        title="Gửi phê duyệt"
        subtitle={approvalRule ? `Quy tắc định danh: ${approvalRule.entityName}` : undefined}
        maxWidth="max-w-2xl"
        customHeaderIcon={<Send className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCloseApprovalModal}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmApprove}
              disabled={!selectedApprover}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors shadow-sm ${selectedApprover
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              <Send className="w-4 h-4" />
              Gửi trình duyệt
            </button>
          </>
        }
      >
        {approvalRule && (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Chọn người duyệt <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedApprover}
                onChange={e => setSelectedApprover(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="">-- Chọn người duyệt --</option>
                {MOCK_APPROVERS.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} - {u.position} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Nội dung yêu cầu
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                rows={4}
                placeholder="Nhập nội dung gửi kèm (nếu có)..."
                className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin quy tắc định danh</h4>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Thuộc thực thể:</span>
                  <span className="text-slate-800 font-medium">{approvalRule.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mẫu mã định danh:</span>
                  <code className="px-2 py-0.5 bg-white border border-slate-200 text-indigo-700 rounded text-[12px]">
                    {buildCode(approvalRule, approvalRule.startFrom)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phiên bản thực thể mới:</span>
                  <span className="text-slate-800">
                    v{(mockEntities.find(e => e.id === approvalRule.entityId)?.version ?? 1) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
}
