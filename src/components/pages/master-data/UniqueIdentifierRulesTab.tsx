import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Hash, ChevronDown, Check, AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import {
  Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS,
} from '../collection/collectionUi';

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

type SeparatorType = 'none' | '-' | '.' | '/';
type RuleStatus = 'active' | 'inactive';

export interface IdentifierRule {
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

export const mockIdentifierRules: IdentifierRule[] = [
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

export const buildCode = (cfg: PreviewInput, number: number) => {
  const sep = cfg.separator === 'none' ? '' : cfg.separator;
  const padded = String(number).padStart(cfg.digits, '0');
  return [cfg.prefix, padded, cfg.suffix].filter(Boolean).join(sep);
};

// Thẻ nhóm (mục 5.6) và tiêu đề nhóm 14px/500
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-4';
const GROUP_TITLE = 'text-[14px] font-medium text-[#020817]';
// Ô xem trước mã: chữ thường 13px #020817 trên nền #F8FAFC (không font-mono)
const CODE_BOX = 'inline-flex items-center px-2 py-0.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#020817]';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

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

  // Xác nhận xóa (thay confirm() của trình duyệt)
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
      toast.error('Vui lòng nhập tiền tố (prefix)');
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
    toast.success('Đã gửi phê duyệt quy tắc định danh thành công!');
    handleCloseApprovalModal();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setRules(rules.filter(rule => rule.id !== deleteId));
    setDeleteId(null);
  };

  const getStatusBadge = (status: RuleStatus) => {
    return status === 'active'
      ? { label: 'Hoạt động', variant: 'green' }
      : { label: 'Không hoạt động', variant: 'slate' };
  };

  const formSep = formData.separator === 'none' ? '' : formData.separator;
  const previewCode = buildCode(formData, formData.startFrom);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#020817] leading-6">Thiết lập quy tắc định danh duy nhất</h2>
      </div>

      {/* Entity Filter */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
        <label className={LABEL_CLS}>
          Xem theo thực thể dữ liệu chủ
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className={`${INPUT_CLS} text-left flex items-center justify-between gap-2 cursor-pointer`}
            onClick={() => setComboboxOpen(!comboboxOpen)}
            aria-expanded={comboboxOpen}
          >
            <span className="truncate">
              {selectedFilterEntityData ? (
                <>
                  <span className="text-[#020817]">{selectedFilterEntityData.code}</span>
                  <span className="text-[#64748B]"> - {selectedFilterEntityData.name}</span>
                </>
              ) : (
                <span className="text-[#94A3B8]">Chọn thực thể dữ liệu chủ...</span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-[#E2E8F0]">
                <input
                  type="text"
                  value={comboboxSearch}
                  onChange={(e) => setComboboxSearch(e.target.value)}
                  placeholder="Tìm kiếm theo mã hoặc tên..."
                  className={SEARCH_INPUT_CLS}
                  autoFocus
                />
              </div>
              <ul className="overflow-y-auto max-h-52 custom-scrollbar">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${selectedEntityFilter === entity.id ? 'bg-[#EAF3FF]' : ''}`}
                        onClick={() => {
                          setSelectedEntityFilter(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 truncate">
                            <span className="text-[#020817]">{entity.code}</span>
                            <span className="text-[#64748B]"> - {entity.name}</span>
                          </div>
                          {selectedEntityFilter === entity.id && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
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
        <div className="bg-white border border-[#E2E8F0] rounded-2xl py-16 px-4 text-center">
          <Hash className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <p className="text-[13px] text-[#64748B]">
            Vui lòng chọn thực thể dữ liệu chủ để xem quy tắc định danh duy nhất
          </p>
        </div>
      ) : !currentRule ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl py-16 px-4 text-center">
          <Hash className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <p className="text-[13px] text-[#64748B] mb-4">
            Chưa cấu hình quy tắc định danh duy nhất nào
          </p>
          {!readOnly && (
            <button onClick={handleOpenAdd} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Thêm quy tắc định danh
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thanh tóm tắt quy tắc + thao tác */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-medium text-[#020817]">Quy tắc định danh: {currentRule.entityName}</p>
                <Badge label={getStatusBadge(currentRule.status).label} variant={getStatusBadge(currentRule.status).variant} />
              </div>
              <p className="text-[13px] text-[#64748B] mt-1">
                Đã tạo <span className="tabular-nums">{currentRule.totalGenerated.toLocaleString()}</span> mã định danh
              </p>
            </div>
            {!readOnly && SHOW_EDIT_DELETE_ACTIONS && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleOpenEdit(currentRule)} className={BTN_OUTLINE}>
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button onClick={() => handleDelete(currentRule.id)} className={`${BTN_OUTLINE} !text-[#DC2626] !border-[#FEE2E2] hover:!bg-[#FEF2F2]`}>
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
              <div className={GROUP_CARD}>
                <h4 className={GROUP_TITLE}>Cấu trúc mã định danh</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Tiền tố (Prefix)</span>
                    <span className={FIELD_VALUE}>{currentRule.prefix || '(không có)'}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Hậu tố (Suffix)</span>
                    <span className={FIELD_VALUE}>{currentRule.suffix || '(không có)'}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Ký tự phân cách</span>
                    <span className={FIELD_VALUE}>{currentRule.separator === 'none' ? 'Không dùng' : `"${currentRule.separator}"`}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Độ dài số thứ tự</span>
                    <span className={FIELD_VALUE}>{currentRule.digits} chữ số</span>
                  </div>
                </div>
              </div>

              <div className={GROUP_CARD}>
                <h4 className={GROUP_TITLE}>Số tự tăng</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Bắt đầu từ</span>
                    <span className={`${FIELD_VALUE} tabular-nums`}>{currentRule.startFrom}</span>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Bước tăng</span>
                    <span className={`${FIELD_VALUE} tabular-nums`}>{currentRule.increment}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${currentRule.checkDuplicate ? 'bg-blue-600' : 'bg-[#E2E8F0]'}`}>
                  {currentRule.checkDuplicate && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#020817]">Kiểm tra trùng lặp khi tạo mới</p>
                  <p className="text-[13px] text-[#64748B] mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
                </div>
              </div>
            </div>

            {/* Right — preview */}
            <div className="space-y-4">
              <div className={GROUP_CARD}>
                <h4 className={GROUP_TITLE}>Mẫu mã định danh</h4>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-6 py-7 text-center">
                  <span className="text-[13px] text-[#020817]">
                    {buildCode(currentRule, currentRule.startFrom)}
                  </span>
                </div>
                <div className="text-[13px]">
                  <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Mã thứ 1:</span>
                    <span className={CODE_BOX}>{buildCode(currentRule, currentRule.startFrom)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Mã thứ 2:</span>
                    <span className={CODE_BOX}>{buildCode(currentRule, currentRule.startFrom + currentRule.increment)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#64748B]">Mã thứ 3:</span>
                    <span className={CODE_BOX}>{buildCode(currentRule, currentRule.startFrom + currentRule.increment * 2)}</span>
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
            <button onClick={handleCloseForm} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button onClick={handleSubmit} className={BTN_PRIMARY}>
              <Save className="w-4 h-4" />
              {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left — form */}
          <div className="space-y-4">
            <div className={GROUP_CARD}>
              <h4 className={GROUP_TITLE}>Cấu trúc mã định danh</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tiền tố (Prefix)</label>
                  <input
                    type="text"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                    placeholder="VD: NDAN, ORG"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Hậu tố (Suffix)</label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value.toUpperCase() })}
                    placeholder="Để trống nếu không dùng"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Ký tự phân cách</label>
                  <select
                    value={formData.separator}
                    onChange={(e) => setFormData({ ...formData, separator: e.target.value as SeparatorType })}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="none">Không dùng</option>
                    <option value="-">Gạch ngang ( - )</option>
                    <option value=".">Dấu chấm ( . )</option>
                    <option value="/">Dấu gạch chéo ( / )</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Độ dài số thứ tự</label>
                  <input
                    type="number" min={1} max={12}
                    value={formData.digits}
                    onChange={(e) => setFormData({ ...formData, digits: Number(e.target.value) })}
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>

            <div className={GROUP_CARD}>
              <h4 className={GROUP_TITLE}>Số tự tăng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Bắt đầu từ</label>
                  <input
                    type="number" min={0}
                    value={formData.startFrom}
                    onChange={(e) => setFormData({ ...formData, startFrom: Number(e.target.value) })}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Bước tăng</label>
                  <input
                    type="number" min={1}
                    value={formData.increment}
                    onChange={(e) => setFormData({ ...formData, increment: Number(e.target.value) })}
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none rounded-2xl border border-[#E2E8F0] p-4 bg-white">
              <input
                type="checkbox"
                checked={formData.checkDuplicate}
                onChange={() => setFormData({ ...formData, checkDuplicate: !formData.checkDuplicate })}
                className="mt-0.5 rounded border-[#CBD5E1] accent-blue-600 cursor-pointer w-4 h-4 flex-shrink-0"
              />
              <div>
                <p className="text-[13px] font-medium text-[#020817]">Kiểm tra trùng lặp khi tạo mới</p>
                <p className="text-[13px] text-[#64748B] mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
              </div>
            </label>
          </div>

          {/* Right — preview */}
          <div className="space-y-4">
            <div className={GROUP_CARD}>
              <h4 className={GROUP_TITLE}>Mẫu mã định danh</h4>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-6 py-7 text-center">
                {previewCode ? (
                  <span className="text-[13px] text-[#020817]">
                    {previewCode}
                  </span>
                ) : (
                  <span className="text-[13px] text-[#64748B]">Nhập tiền tố để xem mẫu mã</span>
                )}
              </div>

              <div className="text-[13px]">
                <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Mã thứ 1:</span>
                  <span className={CODE_BOX}>
                    {[formData.prefix, String(formData.startFrom).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Mã thứ 2:</span>
                  <span className={CODE_BOX}>
                    {[formData.prefix, String(formData.startFrom + formData.increment).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#64748B]">Mã thứ 3:</span>
                  <span className={CODE_BOX}>
                    {[formData.prefix, String(formData.startFrom + formData.increment * 2).padStart(formData.digits, '0'), formData.suffix].filter(Boolean).join(formSep) || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-3">
              <h4 className={GROUP_TITLE}>Tóm tắt cấu hình</h4>
              <div className="space-y-2.5 text-[13px]">
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Tiền tố:</span><span className="text-[#020817]">{formData.prefix || '(không có)'}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Ký tự phân cách:</span><span className="text-[#020817]">{formData.separator === 'none' ? 'Không dùng' : `"${formData.separator}"`}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Độ dài số:</span><span className="text-[#020817]">{formData.digits} chữ số</span></div>
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Bắt đầu từ:</span><span className="text-[#020817] tabular-nums">{formData.startFrom}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Bước tăng:</span><span className="text-[#020817] tabular-nums">{formData.increment}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#64748B]">Kiểm tra trùng:</span><Badge label={formData.checkDuplicate ? 'Bật' : 'Tắt'} variant={formData.checkDuplicate ? 'green' : 'slate'} /></div>
              </div>
            </div>
          </div>
        </div>

        {selectedFilterEntityData && (
          <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg mt-5">
            <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#020817]">
              <p className="mb-1">
                {editingRule ? 'Khi chỉnh sửa quy tắc định danh, ' : 'Khi thêm mới quy tắc định danh, '}
                phiên bản thực thể dữ liệu chủ <strong className="font-medium">{selectedFilterEntityData.name}</strong> sẽ tự động tăng từ{' '}
                <strong className="font-medium">v{selectedFilterEntityData.version}</strong> lên <strong className="font-medium">v{selectedFilterEntityData.version + 1}</strong>.
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
        customHeaderIcon={<Send className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button onClick={handleCloseApprovalModal} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button onClick={handleConfirmApprove} disabled={!selectedApprover} className={BTN_PRIMARY}>
              <Send className="w-4 h-4" />
              Gửi trình duyệt
            </button>
          </>
        }
      >
        {approvalRule && (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>
                Chọn người duyệt <span className={REQUIRED_MARK}>*</span>
              </label>
              <select
                value={selectedApprover}
                onChange={e => setSelectedApprover(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
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
              <label className={LABEL_CLS}>
                Nội dung yêu cầu
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                rows={4}
                placeholder="Nhập nội dung gửi kèm (nếu có)..."
                className={TEXTAREA_CLS}
              />
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <h4 className={`${GROUP_TITLE} mb-3`}>Thông tin quy tắc định danh</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Thuộc thực thể:</span>
                  <span className={FIELD_VALUE}>{approvalRule.entityName}</span>
                </div>
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Mẫu mã định danh:</span>
                  <span className={CODE_BOX}>
                    {buildCode(approvalRule, approvalRule.startFrom)}
                  </span>
                </div>
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Phiên bản thực thể mới:</span>
                  <span className={FIELD_VALUE}>
                    v{(mockEntities.find(e => e.id === approvalRule.entityId)?.version ?? 1) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>

      {/* Xác nhận xóa quy tắc định danh (thay confirm() của trình duyệt) */}
      <BaseModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Xóa quy tắc định danh"
        maxWidth="max-w-lg"
        customHeaderIcon={<Trash2 className="w-5 h-5 text-[#DC2626] mr-3 flex-shrink-0" />}
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button onClick={handleConfirmDelete} className={BTN_DESTRUCTIVE}>
              Xóa
            </button>
          </>
        }
      >
        <p className="text-[13px] text-[#020817]">
          Bạn có chắc chắn muốn xóa quy tắc định danh này? Điều này có thể ảnh hưởng đến dữ liệu đã tạo.
        </p>
      </BaseModal>
    </div>
  );
}
