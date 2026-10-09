import { useState, type ReactNode } from 'react';
import { RotateCcw, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_FOCUS, INPUT_CLS, FIELD_LABEL, SECTION_TITLE, CARD_CLS } from '../collection/collectionUi';

interface SecurityConfig {
  // Cấu hình tải lên
  maxUploadSizeMB: number;

  // Cấu hình hiển thị
  defaultRecordsPerPage: number;

  // Cấu hình bảo trì
  maintenanceMode: boolean;

  // Cấu hình giới hạn đăng nhập sai
  maxLoginAttempts: number;
  loginAttemptTimeWindowMinutes: number;

  // Cấu hình phiên làm việc
  sessionTimeoutMinutes: number;

  // Cấu hình sao lưu dự phòng
  enableAutoBackup: boolean;
  backupSchedule: 'daily' | 'weekly' | 'monthly';
  backupDayOfWeek: number;
  backupDayOfMonth: number;
  backupTime: string;
  backupRetentionDays: number;
  backupLocation: string;

  // Cấu hình thuật toán làm mờ dữ liệu
  blurringAlgorithms: {
    partial: boolean;
    redacted: boolean;
    hashed: boolean;
    nullify: boolean;
  };
}

const defaultConfig: SecurityConfig = {
  maxUploadSizeMB: 10,
  defaultRecordsPerPage: 10,
  maintenanceMode: false,
  maxLoginAttempts: 5,
  loginAttemptTimeWindowMinutes: 15,
  sessionTimeoutMinutes: 30,
  enableAutoBackup: true,
  backupSchedule: 'daily',
  backupDayOfWeek: 4,
  backupDayOfMonth: 1,
  backupTime: '02:00',
  backupRetentionDays: 30,
  backupLocation: 'S3 Bucket',
  blurringAlgorithms: {
    partial: true,
    redacted: true,
    hashed: true,
    nullify: true,
  },
};

const BLURRING_ALGORITHMS: { key: keyof SecurityConfig['blurringAlgorithms']; label: string; description: string }[] = [
  { key: 'partial', label: 'Làm mờ một phần (***-***-1234)', description: 'Ẩn một phần thông tin nhạy cảm của dữ liệu, giữ lại các ký tự cuối (Ví dụ: số CCCD, số điện thoại)' },
  { key: 'redacted', label: 'Che khuất hoàn toàn ([REDACTED])', description: 'Thay thế toàn bộ giá trị dữ liệu bằng nhãn [REDACTED] để bảo mật tuyệt đối thông tin' },
  { key: 'hashed', label: 'Băm dữ liệu (Hashed)', description: 'Mã hóa một chiều giá trị dữ liệu bằng thuật toán băm bảo mật (ví dụ SHA-256)' },
  { key: 'nullify', label: 'Trả về Null/Rỗng', description: 'Xóa bỏ hoàn toàn giá trị dữ liệu nhạy cảm và trả về giá trị null hoặc chuỗi rỗng' },
];

const SCHEDULE_LABELS: Record<SecurityConfig['backupSchedule'], string> = { daily: 'Hàng ngày', weekly: 'Hàng tuần', monthly: 'Hàng tháng' };

// --- Thành phần giao diện theo tailieu/docs/compomennt.md ---

// Công tắc Bật/Tắt (mục 5.12): bật nền #155DFC, tắt nền #CBD5E1
const switchClass = (on: boolean) =>
  `relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${BTN_FOCUS} ${on ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`;
const switchKnobClass = (on: boolean) =>
  `pointer-events-none block h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`;

const Switch = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} title={label} onClick={onChange} className={switchClass(checked)}>
    <span className={switchKnobClass(checked)} />
  </button>
);

// Nút chọn một trong nhiều (mục 5.1): đang chọn tông xanh #EAF3FF, thường dạng viền
const optionBtnClass = (active: boolean) =>
  `h-10 px-4 rounded-lg border text-[13px] font-medium transition-colors ${BTN_FOCUS} ${active ? 'bg-[#EAF3FF] border-[#BFDBFE] text-blue-600' : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:text-[#020817]'}`;

// Khối cấu hình (mục 5.6): thẻ bo 16px, tiêu đề H2 14px/500 có vạch xanh bên trái
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className={CARD_CLS}>
    <h2 className={`${SECTION_TITLE} pb-4 border-b border-[#E2E8F0]`}>
      <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </section>
);

// Một dòng cấu hình: nhãn 13px/500 + mô tả 12px #64748B bên trái, điều khiển bên phải
const FieldRow = ({ label, description, htmlFor, children }: { label: string; description?: string; htmlFor?: string; children: ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1 min-w-0">
      <label htmlFor={htmlFor} className={`block ${FIELD_LABEL} mb-1`}>{label}</label>
      {description && <p className="text-[12px] text-[#64748B]">{description}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">{children}</div>
  </div>
);

// Ô số + thanh kéo + nhãn giới hạn
const RangeField = ({ id, label, description, value, min, max, step = 1, unit, onChange }: {
  id: string; label: string; description: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void;
}) => (
  <div>
    <FieldRow label={label} description={description} htmlFor={id}>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={`${INPUT_CLS} !w-24 text-center tabular-nums`}
        min={min}
        max={max}
      />
      <span className="text-[13px] text-[#64748B]">{unit}</span>
    </FieldRow>
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="mt-3 w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer slider-thumb-blue"
    />
    <div className="flex justify-between text-[12px] text-[#64748B] mt-1">
      <span>{min} {unit}</span>
      <span>{max} {unit}</span>
    </div>
  </div>
);

export function SecurityConfigPage() {
  const [config, setConfig] = useState<SecurityConfig>(() => {
    const saved = localStorage.getItem('security_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultConfig,
          ...parsed,
          blurringAlgorithms: {
            ...defaultConfig.blurringAlgorithms,
            ...(parsed.blurringAlgorithms || {})
          }
        };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultConfig;
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfigChange = (key: keyof SecurityConfig, value: any) => {
    setConfig({ ...config, [key]: value });
    setHasChanges(true);
  };

  const handleAlgorithmToggle = (key: keyof SecurityConfig['blurringAlgorithms']) => {
    setConfig(prev => ({
      ...prev,
      blurringAlgorithms: {
        ...prev.blurringAlgorithms,
        [key]: !prev.blurringAlgorithms[key]
      }
    }));
    setHasChanges(true);
  };

  const handleResetToDefault = () => {
    setConfig(defaultConfig);
    localStorage.setItem('security_config', JSON.stringify(defaultConfig));
    setHasChanges(true);
    setShowResetConfirm(false);
  };

  const handleSaveConfig = () => {
    // Lưu cấu hình
    console.log('Saving config:', config);
    localStorage.setItem('security_config', JSON.stringify(config));
    toast.success('Đã lưu cấu hình thành công!');
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) + nút hành động */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Thiết lập cấu hình hệ thống</h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowResetConfirm(true)} className={BTN_OUTLINE}>
            <RotateCcw className="w-4 h-4" />
            Đặt lại mặc định
          </button>
          <button type="button" onClick={handleSaveConfig} disabled={!hasChanges} className={BTN_PRIMARY}>
            <Save className="w-4 h-4" />
            Lưu cấu hình
          </button>
        </div>
      </div>

      {/* Nhắc lưu thay đổi */}
      {hasChanges && (
        <div className="flex items-center gap-3 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-[#CA8A04] shrink-0" />
          <p className="flex-1 text-[13px] text-[#020817]">
            Bạn có thay đổi chưa được lưu. Nhấn <span className="font-medium">"Lưu cấu hình"</span> để áp dụng các thay đổi.
          </p>
          <button type="button" onClick={handleSaveConfig} className={`${BTN_OUTLINE} shrink-0`}>
            <Save className="w-4 h-4" />
            Lưu ngay
          </button>
        </div>
      )}

      {/* Cấu hình tải lên */}
      <Section title="Cấu hình giới hạn dung lượng tải lên">
        <RangeField
          id="cfg-max-upload"
          label="Giới hạn dung lượng tối đa cho mỗi tệp tin (MB)"
          description="Quy định kích thước tệp tin lớn nhất được phép tải lên hệ thống"
          value={config.maxUploadSizeMB}
          min={1}
          max={100}
          unit="MB"
          onChange={(v) => handleConfigChange('maxUploadSizeMB', v)}
        />
      </Section>

      {/* Cấu hình hiển thị */}
      <Section title="Cấu hình hiển thị danh sách">
        <FieldRow
          label="Số lượng bản ghi hiển thị mặc định trên mỗi trang"
          description="Số lượng dòng dữ liệu được hiển thị trên một trang bảng"
          htmlFor="cfg-records-per-page"
        >
          <select
            id="cfg-records-per-page"
            value={config.defaultRecordsPerPage}
            onChange={(e) => handleConfigChange('defaultRecordsPerPage', parseInt(e.target.value))}
            className={`${INPUT_CLS} !w-48`}
          >
            <option value={10}>10 bản ghi/trang</option>
            <option value={20}>20 bản ghi/trang</option>
            <option value={50}>50 bản ghi/trang</option>
            <option value={100}>100 bản ghi/trang</option>
          </select>
        </FieldRow>
      </Section>

      {/* Cấu hình chế độ bảo trì */}
      <Section title="Cấu hình chế độ bảo trì hệ thống">
        <FieldRow
          label="Bật/Tắt chế độ bảo trì"
          description="Khi bật, hệ thống sẽ tạm dừng hoạt động và hiển thị thông báo bảo trì cho người dùng"
        >
          <Switch
            checked={config.maintenanceMode}
            onChange={() => handleConfigChange('maintenanceMode', !config.maintenanceMode)}
            label="Bật/Tắt chế độ bảo trì"
          />
        </FieldRow>
      </Section>

      {/* Cấu hình giới hạn đăng nhập sai */}
      <Section title="Cấu hình giới hạn đăng nhập sai">
        <RangeField
          id="cfg-max-login"
          label="Số lần sai mật khẩu tối đa"
          description="Số lần đăng nhập sai tối đa trước khi khóa tài khoản tạm thời"
          value={config.maxLoginAttempts}
          min={3}
          max={10}
          unit="lần"
          onChange={(v) => handleConfigChange('maxLoginAttempts', v)}
        />
        <RangeField
          id="cfg-login-window"
          label="Giới hạn số lần đăng nhập sai trong khoảng thời gian (phút)"
          description="Khoảng thời gian các lần đăng nhập sai liên tiếp được tính cộng dồn"
          value={config.loginAttemptTimeWindowMinutes}
          min={5}
          max={60}
          step={5}
          unit="phút"
          onChange={(v) => handleConfigChange('loginAttemptTimeWindowMinutes', v)}
        />
      </Section>

      {/* Cấu hình phiên làm việc */}
      <Section title="Cấu hình phiên làm việc">
        <RangeField
          id="cfg-session-timeout"
          label="Thời gian timeout phiên làm việc (phút)"
          description="Thời gian không hoạt động trước khi đăng xuất tự động người dùng"
          value={config.sessionTimeoutMinutes}
          min={5}
          max={120}
          step={5}
          unit="phút"
          onChange={(v) => handleConfigChange('sessionTimeoutMinutes', v)}
        />
      </Section>

      {/* Cấu hình sao lưu dự phòng */}
      <Section title="Cấu hình sao lưu dự phòng">
        <FieldRow label="Bật tự động sao lưu" description="Tự động sao lưu dữ liệu hệ thống theo lịch trình">
          <Switch
            checked={config.enableAutoBackup}
            onChange={() => handleConfigChange('enableAutoBackup', !config.enableAutoBackup)}
            label="Bật tự động sao lưu"
          />
        </FieldRow>

        {/* Tần suất sao lưu */}
        <div>
          <div className={`${FIELD_LABEL} mb-1`}>Tần suất sao lưu tự động</div>
          <p className="text-[12px] text-[#64748B] mb-3">Lịch trình sao lưu dữ liệu định kỳ</p>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Tần suất sao lưu tự động">
            {(['daily', 'weekly', 'monthly'] as const).map((val) => (
              <button
                key={val}
                type="button"
                role="radio"
                aria-checked={config.backupSchedule === val}
                onClick={() => handleConfigChange('backupSchedule', val)}
                className={optionBtnClass(config.backupSchedule === val)}
              >
                {SCHEDULE_LABELS[val]}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.backupSchedule === 'weekly' && (
              <div>
                <label htmlFor="cfg-backup-dow" className={`block ${FIELD_LABEL} mb-1`}>Chọn ngày trong tuần (Thứ)</label>
                <select
                  id="cfg-backup-dow"
                  value={config.backupDayOfWeek}
                  onChange={(e) => handleConfigChange('backupDayOfWeek', parseInt(e.target.value))}
                  className={INPUT_CLS}
                >
                  {[['2','Thứ 2'],['3','Thứ 3'],['4','Thứ 4'],['5','Thứ 5'],['6','Thứ 6'],['7','Thứ 7'],['8','Chủ nhật']].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {config.backupSchedule === 'monthly' && (
              <div>
                <label htmlFor="cfg-backup-dom" className={`block ${FIELD_LABEL} mb-1`}>Chọn ngày trong tháng</label>
                <select
                  id="cfg-backup-dom"
                  value={config.backupDayOfMonth}
                  onChange={(e) => handleConfigChange('backupDayOfMonth', parseInt(e.target.value))}
                  className={INPUT_CLS}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Ngày {d}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="cfg-backup-time" className={`block ${FIELD_LABEL} mb-1`}>Thời gian sao lưu</label>
              <input
                id="cfg-backup-time"
                type="time"
                value={config.backupTime}
                onChange={(e) => handleConfigChange('backupTime', e.target.value)}
                className={INPUT_CLS}
              />
              <p className="mt-1 text-[12px] text-[#64748B]">Thời điểm trong ngày để thực hiện sao lưu tự động</p>
            </div>
          </div>
        </div>

        <RangeField
          id="cfg-backup-retention"
          label="Thời gian giữ lại sao lưu (ngày)"
          description="Số ngày giữ lại các bản sao lưu trước khi xóa"
          value={config.backupRetentionDays}
          min={1}
          max={365}
          unit="ngày"
          onChange={(v) => handleConfigChange('backupRetentionDays', v)}
        />

        <FieldRow label="Vị trí lưu trữ sao lưu" description="Địa điểm lưu trữ các bản sao lưu" htmlFor="cfg-backup-location">
          <input
            id="cfg-backup-location"
            type="text"
            value={config.backupLocation}
            onChange={(e) => handleConfigChange('backupLocation', e.target.value)}
            className={`${INPUT_CLS} !w-48`}
          />
        </FieldRow>
      </Section>

      {/* Cấu hình thuật toán tự động làm mờ dữ liệu */}
      <Section title="Cấu hình thuật toán tự động làm mờ dữ liệu">
        <p className="text-[12px] text-[#64748B]">
          Chọn Kích hoạt (Active) hoặc Vô hiệu hóa (Inactive) các thuật toán tự động làm mờ dữ liệu.
          Các thuật toán được kích hoạt sẽ khả dụng khi người dùng thiết lập phân quyền khai thác dữ liệu.
        </p>

        <div className="divide-y divide-[#E2E8F0]">
          {BLURRING_ALGORITHMS.map(({ key, label, description }) => {
            const active = config.blurringAlgorithms[key];
            return (
              <div key={key} className="py-4 first:pt-0 last:pb-0">
                <FieldRow label={label} description={description}>
                  <Badge label={active ? 'Active' : 'Inactive'} variant={active ? 'green' : 'slate'} />
                  <Switch checked={active} onChange={() => handleAlgorithmToggle(key)} label={label} />
                </FieldRow>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Xác nhận đặt lại mặc định — hộp thoại xác nhận dùng chung (5.4) */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetToDefault}
        type="warning"
        title="Xác nhận đặt lại cấu hình"
        subtitle=""
        message="Bạn có chắc chắn muốn đặt lại về cấu hình mặc định?"
        confirmText="Đặt lại mặc định"
        cancelText="Hủy"
      />
    </div>
  );
}
