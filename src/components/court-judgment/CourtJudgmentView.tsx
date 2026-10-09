import { useState } from 'react';
import { Eye, Filter, Plus, Trash2, CheckCircle, X, RefreshCw } from 'lucide-react';
import {
  TruncatedText, RowIconAction, Pagination, Badge, filterBtnClass, INPUT_CLS, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON,
  ROW_ICON_BTN, TOOLTIP_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
} from '../pages/collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { COURT_JUDGMENT_RECORDS, DetailRecord } from './courtJudgmentMock';

interface CourtJudgmentViewProps {
  title: string;
}

// Bảng theo compomennt.md 5.3 / căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

const FIELD_OPTIONS = [
  { value: 'name', label: 'Họ tên' },
  { value: 'birthDate', label: 'Ngày sinh' },
  { value: 'age', label: 'Tuổi' },
  { value: 'gender', label: 'Giới tính' },
  { value: 'idNumber', label: 'Số định danh' },
];

const OPERATOR_OPTIONS = [
  { value: '=', label: 'Bằng (=)' },
  { value: '>', label: 'Lớn hơn (>)' },
  { value: '<', label: 'Nhỏ hơn (<)' },
  { value: '>=', label: 'Lớn hơn bằng (>=)' },
  { value: '<=', label: 'Nhỏ hơn bằng (<=)' },
  { value: '!=', label: 'Khác (!=)' },
  { value: 'contains', label: 'Chứa' },
  { value: 'starts', label: 'Bắt đầu' },
  { value: 'ends', label: 'Kết thúc' },
];

export function CourtJudgmentView({ title }: CourtJudgmentViewProps) {
  const records = COURT_JUDGMENT_RECORDS;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([
    { id: '1', logic: 'AND', field: 'age', operator: '=', type: 'Number', value: '19' },
  ]);
  const [selectedRecord, setSelectedRecord] = useState<DetailRecord | null>(null);

  const pageRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const updateCondition = (index: number, key: string, value: string) => {
    const next = [...filterConditions];
    next[index] = { ...next[index], [key]: value };
    setFilterConditions(next);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* Tiêu đề trang (mục 4.4: 20px/700/#2A0F0F) */}
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{title}</h1>
      </div>

      {/* Thanh thao tác căn phải (mục 5.19) */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Bộ lọc nâng cao"
              aria-expanded={isFilterOpen}
              className={filterBtnClass(isFilterOpen)}
              title="Bộ lọc nâng cao"
            >
              {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => { setIsFilterOpen(false); setCurrentPage(1); }}
              aria-label="Tải lại"
              title="Tải lại"
              className={ICON_OUTLINE_40}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vùng lọc nâng cao: khung xám, cách thanh thao tác 15px */}
        {isFilterOpen && (
          <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-medium text-[#020817]">Điều kiện lọc nâng cao</h4>
              <button
                type="button"
                onClick={() => setFilterConditions([...filterConditions, { id: Date.now().toString(), logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }])}
                className={BTN_OUTLINE}
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
            </div>

            {filterConditions.length === 0 && (
              <p className="text-[13px] text-[#64748B]">Chưa có điều kiện lọc. Bấm "Thêm điều kiện" để bắt đầu.</p>
            )}

            <div className="space-y-2">
              {filterConditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2">
                  <div className="w-24 flex-shrink-0">
                    {index > 0 && (
                      <select aria-label="Toán tử logic" className={INPUT_CLS} value={condition.logic} onChange={(e) => updateCondition(index, 'logic', e.target.value)}>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    )}
                  </div>
                  <select aria-label="Trường dữ liệu" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.field} onChange={(e) => updateCondition(index, 'field', e.target.value)}>
                    <option value="" disabled hidden>-- Chọn trường dữ liệu --</option>
                    {FIELD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select aria-label="Phép so sánh" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.operator} onChange={(e) => updateCondition(index, 'operator', e.target.value)}>
                    {OPERATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input
                    aria-label="Giá trị"
                    type="text"
                    className={`${INPUT_CLS} !w-auto flex-1`}
                    placeholder="Nhập giá trị..."
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Xóa điều kiện"
                        onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                        className={`${ROW_ICON_BTN} hover:!text-[#DC2626]`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xóa điều kiện</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            {filterConditions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
                <button type="button" className={BTN_PRIMARY}>
                  <CheckCircle className="w-4 h-4" />
                  Áp dụng bộ lọc
                </button>
                <button type="button" onClick={() => setFilterConditions([])} className={BTN_OUTLINE}>
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bảng dữ liệu (mục 5.3) */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Phân loại</th>
                <th className={`${TH} text-left`}>Họ tên</th>
                <th className={`${TH} text-left`}>Giới tính</th>
                <th className={`${TH} text-left`}>Ngày sinh</th>
                <th className={`${TH} text-left`}>Họ tên Cha</th>
                <th className={`${TH} text-left`}>Họ tên Mẹ</th>
                <th className={`${TH} text-left`}>Quốc tịch</th>
                <th className={`${TH} text-left`}>Số định danh</th>
                <th className={`${TH} text-left`}>Ngày đăng ký</th>
                <th className={`${TH} text-left`}>Ngày đồng bộ</th>
                <th className={`${TH} text-center w-20 sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageRecords.map((record, index) => (
                <tr key={record.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                  <td className={`${TD} text-center whitespace-nowrap`}>
                    {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap`}>
                    <Badge label={record.type} variant={record.type === 'Mới' ? 'blue' : 'green'} />
                  </td>
                  <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={record.name} /></td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.gender}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.birthDate}</td>
                  <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={record.fatherName || '-'} /></td>
                  <td className={`${TD} text-left max-w-[200px]`}><TruncatedText text={record.motherName || '-'} /></td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.nationality}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.idNumber}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.registrationDate}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{record.syncDate}</td>
                  <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                    <RowIconAction label="Xem chi tiết" onClick={() => setSelectedRecord(record)}>
                      <Eye className="w-4 h-4" />
                    </RowIconAction>
                  </td>
                </tr>
              ))}
              {pageRecords.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-3 py-16 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={records.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Xem chi tiết bản ghi (mục 5.17: nhãn – giá trị) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="text-[16px] font-semibold text-[#020817]">Chi tiết bản ghi</h3>
              <button type="button" onClick={() => setSelectedRecord(null)} className={BTN_GHOST_ICON} aria-label="Đóng chi tiết" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {([
                  ['Họ, chữ đệm, tên', selectedRecord.name],
                  ['Giới tính', selectedRecord.gender],
                  ['Ngày, tháng, năm sinh', selectedRecord.birthDate],
                  ['Ngày sinh bằng chữ', selectedRecord.birthDateInWords],
                  ['Nơi sinh', selectedRecord.birthPlace],
                  ['Quê quán', selectedRecord.hometown],
                  ['Dân tộc', selectedRecord.ethnicity],
                  ['Quốc tịch', selectedRecord.nationality],
                  ['Số định danh cá nhân', selectedRecord.personalId],
                  ['Họ tên Cha', selectedRecord.fatherName],
                  ['Ngày sinh Cha', selectedRecord.fatherBirthDate],
                  ['Họ tên Mẹ', selectedRecord.motherName],
                  ['Ngày sinh Mẹ', selectedRecord.motherBirthDate],
                  ['Họ tên người đi khai sinh', selectedRecord.declarantName],
                  ['Quan hệ', selectedRecord.declarantRelation],
                  ['Ngày đăng ký', selectedRecord.registrationDate],
                  ['Ngày đồng bộ', selectedRecord.syncDate],
                ] as [string, string | undefined][]).map(([label, value]) => (
                  <div key={label} className="space-y-1">
                    <div className={FIELD_LABEL}>{label}</div>
                    <div className={`${FIELD_VALUE} break-words`}>{value || '-'}</div>
                  </div>
                ))}
              </div>

              {selectedRecord.hasError && (
                <div className="border-t border-[#E2E8F0] pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className={SECTION_TITLE}>Chi tiết lỗi dữ liệu</h4>
                    <Badge
                      label={selectedRecord.errorProcessStatus === 'updated' ? 'Đã khắc phục' : 'Cần xử lý'}
                      variant={selectedRecord.errorProcessStatus === 'updated' ? 'green' : 'red'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Mô tả lỗi</div>
                      <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.errorMessage || 'Lỗi không xác định'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Trường dữ liệu phát hiện lỗi</div>
                      <div className={FIELD_VALUE}>
                        {selectedRecord.errorMessage?.includes('điện thoại') ? 'phone_number'
                          : selectedRecord.errorMessage?.includes('ngày tháng') ? 'birthDate' : 'unknown_field'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Trạng thái xử lý</div>
                      <div>
                        <Badge
                          label={selectedRecord.errorProcessStatus === 'sent' ? 'Đã gửi hệ thống nguồn'
                            : selectedRecord.errorProcessStatus === 'updated' ? 'Đã cập nhật lại' : 'Chờ xử lý'}
                          variant={selectedRecord.errorProcessStatus === 'sent' ? 'blue'
                            : selectedRecord.errorProcessStatus === 'updated' ? 'green' : 'amber'}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className={FIELD_LABEL}>Ghi chú bổ sung</div>
                      <div className={`${FIELD_VALUE} break-words`}>{selectedRecord.errorProcessText || 'Chưa có thông tin xử lý từ bên thứ 3.'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end flex-shrink-0">
              <button type="button" onClick={() => setSelectedRecord(null)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
