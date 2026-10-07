import React, { ChangeEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import { Send } from 'lucide-react';
import { MasterDataAttribute, FieldDataType, MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { approvers } from '../../categoryConstants';
import { ApprovalRequestModal } from './ApprovalRequestModal';
import { BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL } from '../../../collection/collectionUi';

interface AttributeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttribute: MasterDataAttribute | null;
  formData: Partial<MasterDataAttribute>;
  setFormData: (data: Partial<MasterDataAttribute>) => void;
  onSave: () => void;
  onSaveAndSubmit: (data: { id: string; code: string; name: string; type: 'attribute' | 'category' }) => void;
  entities?: MasterDataEntity[];
  entityName?: string;
  entityCode?: string;
}

export function AttributeFormModal({
  isOpen,
  onClose,
  editingAttribute,
  formData,
  setFormData,
  onSave,
  entities = [],
  entityName = '',
  entityCode = ''
}: AttributeFormModalProps) {
  const [showApproval, setShowApproval] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ reviewer: '', note: '' });

  if (!isOpen) return null;

  const handleApprovalSubmit = () => {
    onSave();
    setShowApproval(false);
    setApprovalForm({ reviewer: '', note: '' });
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className={BTN_OUTLINE}
      >
        Hủy
      </button>
      <button
        type="button"
        onClick={() => setShowApproval(true)}
        className={BTN_PRIMARY}
      >
        <Send className="w-4 h-4"/>
        Gửi duyệt cấu trúc
      </button>
    </>
  );

  return (
    <>
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAttribute ? 'Cập nhật trường dữ liệu' : 'Thêm mới trường dữ liệu'}
      subtitle="Định nghĩa cấu trúc chi tiết cho trường dữ liệu"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-left">
        {/* Tên trường */}
        <div>
          <label className={LABEL_CLS}>
            Tên trường <span className={REQUIRED_MARK}>*</span>
          </label>
          <input
            type="text"
            value={formData.fieldName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fieldName: e.target.value })}
            placeholder="VD: citizen_id"
            className={INPUT_CLS}
          />
          <p className="mt-1 text-[12px] text-[#64748B]">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
        </div>

        {/* Tên hiển thị */}
        <div>
          <label className={LABEL_CLS}>
            Tên hiển thị <span className={REQUIRED_MARK}>*</span>
          </label>
          <input
            type="text"
            value={formData.displayName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="VD: Số CCCD"
            className={INPUT_CLS}
          />
        </div>

        {/* Kiểu dữ liệu & Độ dài tối đa */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>
              Kiểu dữ liệu <span className={REQUIRED_MARK}>*</span>
            </label>
            <select
              title="Kiểu dữ liệu"
              value={formData.dataType || 'string'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
              className={INPUT_CLS}
            >
              <option value="string">Chuỗi (String)</option>
              <option value="number">Số (Number)</option>
              <option value="date">Ngày (Date)</option>
              <option value="datetime">Ngày giờ (DateTime)</option>
              <option value="boolean">Logic (Boolean)</option>
              <option value="text">Văn bản dài (Text)</option>
              <option value="email">Email</option>
              <option value="phone">Số điện thoại</option>
              <option value="url">URL</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Độ dài tối đa</label>
            <input
              type="number"
              value={formData.length || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, length: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="VD: 255"
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* Là trường bắt buộc checkbox */}
        <div className="flex items-center p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#020817]">
            <input 
              type="checkbox" 
              checked={formData.required || false} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, required: e.target.checked })} 
              className="w-4 h-4 rounded accent-blue-600 cursor-pointer" 
            />
            <span className={FIELD_LABEL}>Là trường bắt buộc</span>
          </label>
        </div>

        {/* Cấu hình khóa (Khóa chính / Khóa ngoại) */}
        <div className="flex items-center gap-6 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <label className={`${FIELD_LABEL} shrink-0`}>Cấu hình khóa:</label>
          <div className="flex items-center gap-6">
            {[
              { value: 'primary', label: 'Khóa chính (PK)' },
              { value: 'foreign', label: 'Khóa ngoại (FK)' }
            ].map((option) => {
              const isSelected = formData.keyType === option.value;
              return (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#020817]">
                  <input
                    type="radio"
                    name="modalKeyType"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => {
                      setFormData({ 
                        ...formData, 
                        keyType: option.value as any,
                        ...(option.value === 'primary' ? { required: true, unique: true } : {}),
                        ...(option.value !== 'foreign' ? { foreignTable: undefined, foreignField: undefined } : {})
                      });
                    }}
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ 
                          ...formData, 
                          keyType: 'none',
                          foreignTable: undefined,
                          foreignField: undefined
                        });
                      }
                    }}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Giá trị mặc định */}
        <div>
          <label className={LABEL_CLS}>Giá trị mặc định</label>
          <input
            type="text"
            value={formData.defaultValue || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, defaultValue: e.target.value })}
            placeholder="Để trống nếu không có"
            className={INPUT_CLS}
          />
        </div>
      </div>
    </BaseModal>

    {createPortal(
      <ApprovalRequestModal
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        data={{ id: '', code: entityCode, name: entityName, type: 'version' }}
        approvers={approvers}
        form={approvalForm}
        setForm={setApprovalForm}
        onSubmit={handleApprovalSubmit}
      />,
      document.body
    )}
    </>
  );
}
