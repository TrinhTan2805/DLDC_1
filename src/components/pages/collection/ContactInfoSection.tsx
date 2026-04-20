interface ContactInfoSectionProps {
  isEdit?: boolean;
  defaultValues?: any;
  unitName?: string;
  onUnitNameChange?: (name: string) => void;
}

export function ContactInfoSection({ isEdit = false, defaultValues, unitName, onUnitNameChange }: ContactInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 mb-2">
        Thông tin đơn vị cung cấp dữ liệu
      </div>
      
      <div>
        <label htmlFor="contact-unit-name" className="block text-sm text-slate-600 mb-1">
          Tên đơn vị
        </label>
        <input aria-label="Input field"
          id="contact-unit-name"
          title="Tên đơn vị"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: Cục Hộ tịch, quốc tịch, chứng thực"
          value={unitName !== undefined ? unitName : defaultValues?.unitName || ''}
          onChange={(e) => onUnitNameChange?.(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-address" className="block text-sm text-slate-600 mb-1">
          Địa chỉ
        </label>
        <input aria-label="Input field"
          id="contact-address"
          title="Địa chỉ"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập địa chỉ đơn vị"
          defaultValue={defaultValues?.address}
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm text-slate-600 mb-1">
          Số điện thoại
        </label>
        <input aria-label="Input field"
          id="contact-phone"
          title="Số điện thoại"
          type="tel"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: 024 3733 9999"
          defaultValue={defaultValues?.phone}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm text-slate-600 mb-1">
          Địa chỉ email
        </label>
        <input aria-label="Input field"
          id="contact-email"
          title="Địa chỉ email"
          type="email"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example@moj.gov.vn"
          defaultValue={defaultValues?.email}
        />
      </div>

      <div>
        <label htmlFor="technical-contact" className="block text-sm text-slate-600 mb-1">
          Người đầu mối ký thuật
        </label>
        <input aria-label="Input field"
          id="technical-contact"
          title="Người đầu mối ký thuật"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nguyễn Văn A SĐT: 0987654321"
          defaultValue={defaultValues?.technicalContact}
        />
      </div>

      <div>
        <label htmlFor="contact-note" className="block text-sm text-slate-600 mb-1">
          Ghi chú
        </label>
        <textarea aria-label="Text input"
          id="contact-note"
          title="Ghi chú"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Thông tin bổ sung về đơn vị"
          defaultValue={defaultValues?.note}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <strong>Lưu ý:</strong> Email này sẽ nhận thông báo khi kết nối API thành công hoặc có vấn đề phát sinh.
        </p>
      </div>
    </div>
  );
}
