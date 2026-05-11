import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DataCollectionConfigSectionProps {
  resetTestState: () => void;
}

export function DataCollectionConfigSection({ resetTestState }: DataCollectionConfigSectionProps) {
  const [frequencyType, setFrequencyType] = useState('Cập nhật');
  const [repeatMode, setRepeatMode] = useState('Hằng ngày');
  const [repeatInterval, setRepeatInterval] = useState('1');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [executeTime, setExecuteTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [isManualDesc, setIsManualDesc] = useState(false);

  const [monthOption, setMonthOption] = useState('date'); // 'date' or 'day'
  const [monthDate, setMonthDate] = useState('1');
  const [monthWeek, setMonthWeek] = useState('Đầu tiên');
  const [monthDay, setMonthDay] = useState('Thứ hai');

  const DAYS_OF_WEEK = [
    { id: 'T2', label: 'Thứ hai' },
    { id: 'T3', label: 'Thứ ba' },
    { id: 'T4', label: 'Thứ tư' },
    { id: 'T5', label: 'Thứ năm' },
    { id: 'T6', label: 'Thứ sáu' },
    { id: 'T7', label: 'Thứ 7' },
    { id: 'CN', label: 'Chủ Nhật' },
  ];

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
    <div className="w-full max-w-4xl mx-auto px-6 py-4 space-y-6">
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-6">
          <label className="w-32 text-[13px] text-slate-700 font-medium shrink-0">Loại tần suất</label>
          <select 
            value={frequencyType}
            onChange={e => setFrequencyType(e.target.value)}
            className="flex-1 max-w-2xl px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="Tạo mới">Tạo mới</option>
            <option value="Cập nhật">Cập nhật</option>
          </select>
        </div>
        <div className="ml-[152px] text-[11px] text-slate-500 italic">
          {frequencyType === 'Tạo mới' 
            ? "* Hệ thống sẽ thu thập tất cả các bản ghi mới phát sinh từ nguồn dữ liệu." 
            : "* Hệ thống chỉ thu thập các bản ghi có sự thay đổi hoặc được cập nhật mới."}
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
          className="flex-1 max-w-2xl px-3 py-1.5 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/30"
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
              className="w-20 px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
                  className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
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
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
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
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
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
                type="time" 
                value={executeTime}
                onChange={e => setExecuteTime(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm focus:outline-none bg-white"
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
  );
}
