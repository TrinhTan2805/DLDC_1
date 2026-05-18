import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';

export interface ScheduleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemName: string;
  datasetName: string;
}

interface Schedule {
  id: string;
  frequencyType: string;
  repeatMode: string;
  repeatInterval: string;
  repeatDays: string[];
  executeTime: string;
  description: string;
  monthOption: string;
  monthDate: string;
  monthWeek: string;
  monthDay: string;
  status: 'active' | 'inactive';
}

const DAYS_OF_WEEK = [
  { id: 'T2', label: 'Thứ hai' },
  { id: 'T3', label: 'Thứ ba' },
  { id: 'T4', label: 'Thứ tư' },
  { id: 'T5', label: 'Thứ năm' },
  { id: 'T6', label: 'Thứ sáu' },
  { id: 'T7', label: 'Thứ 7' },
  { id: 'CN', label: 'Chủ Nhật' },
];

const mockSchedules: Schedule[] = [
  {
    id: '1',
    frequencyType: 'Cập nhật',
    repeatMode: 'Hằng ngày',
    repeatInterval: '1',
    repeatDays: [],
    executeTime: '12:00 PM',
    description: 'Lặp lại mỗi 1 ngày lúc 12:00 PM',
    monthOption: 'date',
    monthDate: '1',
    monthWeek: 'Đầu tiên',
    monthDay: 'Thứ hai',
    status: 'active'
  }
];

export function ScheduleManagementModal({ isOpen, onClose, systemName, datasetName }: ScheduleManagementModalProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Form states
  const [frequencyType, setFrequencyType] = useState('Cập nhật');
  const [repeatMode, setRepeatMode] = useState('Hằng ngày');
  const [repeatInterval, setRepeatInterval] = useState('1');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [executeTime, setExecuteTime] = useState('12:00 PM');
  const [description, setDescription] = useState('');
  const [isManualDesc, setIsManualDesc] = useState(false);

  const [monthOption, setMonthOption] = useState('date');
  const [monthDate, setMonthDate] = useState('1');
  const [monthWeek, setMonthWeek] = useState('Đầu tiên');
  const [monthDay, setMonthDay] = useState('Thứ hai');

  // Auto generate description
  useEffect(() => {
    if (isManualDesc) return;

    let desc = '';
    const interval = parseInt(repeatInterval) || 1;
    const timeStr = executeTime ? `lúc ${executeTime}` : '';

    if (repeatMode === 'Hàng phút') {
      desc = `Lặp lại mỗi ${interval} phút`;
    } else if (repeatMode === 'Hàng giờ') {
      desc = `Lặp lại mỗi ${interval} giờ`;
    } else if (repeatMode === 'Hằng ngày') {
      desc = `Lặp lại mỗi ${interval} ngày ${timeStr}`;
    } else if (repeatMode === 'Hằng tuần') {
      const daysStr = repeatDays.length > 0 ? `vào ${repeatDays.map(d => DAYS_OF_WEEK.find(x => x.id === d)?.label).join(', ')}` : '';
      desc = `Lặp lại mỗi ${interval} tuần ${daysStr} ${timeStr}`;
    } else if (repeatMode === 'Hằng tháng') {
      if (monthOption === 'date') {
        desc = `Lặp lại mỗi ${interval} tháng vào ngày ${monthDate} ${timeStr}`;
      } else {
        desc = `Lặp lại mỗi ${interval} tháng vào ${monthWeek.toLowerCase()} ${monthDay.toLowerCase()} ${timeStr}`;
      }
    }

    setDescription(desc.trim());
  }, [repeatMode, repeatInterval, repeatDays, executeTime, monthOption, monthDate, monthWeek, monthDay, isManualDesc]);

  if (!isOpen) return null;

  const handleAddNew = () => {
    setEditingSchedule(null);
    setFrequencyType('Cập nhật');
    setRepeatMode('Hằng ngày');
    setRepeatInterval('1');
    setRepeatDays([]);
    setExecuteTime('12:00 PM');
    setIsManualDesc(false);
    setMonthOption('date');
    setMonthDate('1');
    setMonthWeek('Đầu tiên');
    setMonthDay('Thứ hai');
    setView('form');
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFrequencyType(schedule.frequencyType);
    setRepeatMode(schedule.repeatMode);
    setRepeatInterval(schedule.repeatInterval);
    setRepeatDays(schedule.repeatDays || []);
    setExecuteTime(schedule.executeTime);
    setDescription(schedule.description);
    setIsManualDesc(true); // Retain custom description if any
    setMonthOption(schedule.monthOption || 'date');
    setMonthDate(schedule.monthDate || '1');
    setMonthWeek(schedule.monthWeek || 'Đầu tiên');
    setMonthDay(schedule.monthDay || 'Thứ hai');
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch biểu này?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    const newSchedule: Schedule = {
      id: editingSchedule ? editingSchedule.id : Date.now().toString(),
      frequencyType,
      repeatMode,
      repeatInterval,
      repeatDays,
      executeTime,
      description,
      monthOption,
      monthDate,
      monthWeek,
      monthDay,
      status: editingSchedule ? editingSchedule.status : 'active'
    };

    if (editingSchedule) {
      setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? newSchedule : s));
    } else {
      setSchedules(prev => [...prev, newSchedule]);
    }
    setView('list');
  };

  const handleDayToggle = (dayId: string) => {
    setRepeatDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const getIntervalLabel = () => {
    switch (repeatMode) {
      case 'Hàng phút': return 'phút';
      case 'Hàng giờ': return 'giờ';
      case 'Hằng ngày': return 'ngày';
      case 'Hằng tuần': return 'tuần vào';
      case 'Hằng tháng': return 'tháng vào';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {view === 'list' ? 'Danh sách lịch biểu' : (editingSchedule ? 'Cập nhật lịch biểu' : 'Thêm mới lịch biểu')}
              </h2>
              <p className="text-[13px] text-slate-500">
                {systemName} | {datasetName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          {view === 'list' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[15px] font-semibold text-slate-800">Lịch biểu đã cấu hình</h3>
                <button 
                  onClick={handleAddNew}
                  style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
                  className="flex items-center gap-2 bg-blue-600 text-white text-[13px] hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mới
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Loại tần suất</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tần suất</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedules.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-[13px]">
                          Chưa có lịch biểu nào được cấu hình.
                        </td>
                      </tr>
                    ) : (
                      schedules.map((schedule, index) => (
                        <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-[13px] text-slate-500 font-medium">{index + 1}</td>
                          <td className="px-4 py-4 text-[13px] font-semibold text-slate-900">{schedule.frequencyType}</td>
                          <td className="px-4 py-4 text-[13px] text-slate-600">{schedule.repeatMode} (mỗi {schedule.repeatInterval})</td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-900">{schedule.executeTime}</td>
                          <td className="px-4 py-4 text-[13px] text-slate-600 truncate max-w-[200px]" title={schedule.description}>{schedule.description}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 shadow-sm whitespace-nowrap">
                              <CheckCircle className="w-3.5 h-3.5" /> Hoạt động
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(schedule)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(schedule.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 mx-auto w-full max-w-4xl">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-6">
                    <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0">Loại tần suất</label>
                    <select 
                      value={frequencyType}
                      onChange={e => setFrequencyType(e.target.value)}
                      className="flex-1 max-w-2xl px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="Cập nhật">Cập nhật</option>
                      <option value="Tạo mới">Tạo mới</option>
                    </select>
                  </div>
                  <div className="ml-[152px] text-[11px] text-slate-500 italic">
                    {frequencyType === 'Cập nhật' && "* Hệ thống chỉ xử lý các bản ghi có sự thay đổi hoặc được cập nhật mới."}
                    {frequencyType === 'Tạo mới' && "* Hệ thống sẽ xử lý tất cả các bản ghi mới phát sinh."}
                  </div>
                </div>

                {/* Divider Tần suất */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-800">Tần suất</span>
                  <div className="flex-1 border-t border-slate-200 mt-1"></div>
                </div>

                {/* Lặp lại */}
                <div className="flex items-center gap-6">
                  <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0">Lặp lại</label>
                  <select 
                    value={repeatMode}
                    onChange={e => {
                      setRepeatMode(e.target.value);
                      setRepeatInterval('1');
                      setRepeatDays([]);
                    }}
                    className="flex-1 max-w-2xl px-3 py-1.5 text-[13px] border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/30 text-slate-900 font-medium"
                  >
                    <option value="Hàng phút">Hàng phút</option>
                    <option value="Hàng giờ">Hàng giờ</option>
                    <option value="Hằng ngày">Hằng ngày</option>
                    <option value="Hằng tuần">Hằng tuần</option>
                    <option value="Hằng tháng">Hằng tháng</option>
                  </select>
                </div>

                {/* Lặp lại trong */}
                <div className="flex items-start gap-6">
                  <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0 pt-1.5">Lặp lại trong</label>
                  <div className="flex-1 max-w-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1"
                        value={repeatInterval}
                        onChange={e => setRepeatInterval(e.target.value)}
                        className="w-20 px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-center"
                      />
                      <span className="text-[13px] text-slate-700">{getIntervalLabel()}</span>
                    </div>

                    {/* Extracted controls based on mode */}
                    {repeatMode === 'Hằng tuần' && (
                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                        {DAYS_OF_WEEK.map(day => (
                          <label key={day.id} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={repeatDays.includes(day.id)}
                              onChange={() => handleDayToggle(day.id)}
                              className="w-3.5 h-3.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-[13px] text-slate-700">{day.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {repeatMode === 'Hằng tháng' && (
                      <div className="flex flex-col gap-3 mt-1">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            checked={monthOption === 'date'}
                            onChange={() => setMonthOption('date')}
                            className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-[13px] text-slate-700 whitespace-nowrap">ngày</span>
                          <input 
                            type="number" 
                            min="1" max="31"
                            value={monthDate}
                            onChange={e => setMonthDate(e.target.value)}
                            disabled={monthOption !== 'date'}
                            className="w-16 px-2 py-1 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                          />
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            checked={monthOption === 'day'}
                            onChange={() => setMonthOption('day')}
                            className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <select 
                            value={monthWeek}
                            onChange={e => setMonthWeek(e.target.value)}
                            disabled={monthOption !== 'day'}
                            className="px-2 py-1 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="Đầu tiên">Đầu tiên</option>
                            <option value="Thứ hai">Thứ hai</option>
                            <option value="Thứ ba">Thứ ba</option>
                            <option value="Thứ tư">Thứ tư</option>
                            <option value="Cuối cùng">Cuối cùng</option>
                          </select>
                          <select 
                            value={monthDay}
                            onChange={e => setMonthDay(e.target.value)}
                            disabled={monthOption !== 'day'}
                            className="px-2 py-1 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="Thứ hai">Thứ hai</option>
                            <option value="Thứ ba">Thứ ba</option>
                            <option value="Thứ tư">Thứ tư</option>
                            <option value="Thứ năm">Thứ năm</option>
                            <option value="Thứ sáu">Thứ sáu</option>
                            <option value="Thứ 7">Thứ 7</option>
                            <option value="Chủ Nhật">Chủ Nhật</option>
                          </select>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider Thời gian */}
                {repeatMode !== 'Hàng phút' && repeatMode !== 'Hàng giờ' && (
                  <>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[13px] font-bold text-slate-800">Thời gian</span>
                      <div className="flex-1 border-t border-slate-200 mt-1"></div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0">Thực hiện lúc</label>
                      <div className="flex items-center max-w-[200px] border border-slate-300 rounded overflow-hidden">
                        <input 
                          type="text" 
                          value={executeTime}
                          onChange={e => setExecuteTime(e.target.value)}
                          placeholder="12:00 PM"
                          className="flex-1 px-3 py-1.5 text-[13px] focus:outline-none bg-white"
                        />
                        <div className="px-3 py-1.5 bg-slate-100 border-l border-slate-300 text-slate-500 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Divider Tóm lược */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[13px] font-bold text-slate-800">Tóm lược</span>
                  <div className="flex-1 border-t border-slate-200 mt-1"></div>
                </div>

                <div className="flex items-start gap-6">
                  <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0 pt-1.5">Mô Tả</label>
                  <textarea 
                    value={description}
                    onChange={e => {
                      setDescription(e.target.value);
                      setIsManualDesc(true);
                    }}
                    rows={3}
                    className="flex-1 max-w-2xl px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white resize-y"
                  />
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex justify-end gap-3 shrink-0">
          {view === 'list' ? (
            <button
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
              className="text-[13px] text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Đóng
            </button>
          ) : (
            <>
              <button
                onClick={() => setView('list')}
                style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
                className="text-[13px] text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
                className="text-[13px] text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                {editingSchedule ? 'Cập nhật' : 'Thêm'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
