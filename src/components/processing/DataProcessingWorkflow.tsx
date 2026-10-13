import { useState } from 'react';
import { Database, Droplet, CheckSquare, Shuffle, ListChecks, ArrowRight, Settings, Play, BarChart3 } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  tasks: string[];
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'cleaning',
    name: 'Làm sạch',
    title: 'Xử lý các vấn đề phổ biến về chất lượng dữ liệu',
    description: 'Đảm bảo dữ liệu sạch và chất lượng',
    icon: Droplet,
    color: 'blue',
    tasks: [
      'Chuẩn hóa định dạng (ngày tháng, số, văn bản)',
      'Kiểm tra tính hợp lệ của dữ liệu',
      'Xử lý các giá trị thiếu hoặc trống',
      'Loại bỏ hoặc thay thế các giá trị ngoại lệ (outliers)',
    ],
  },
  {
    id: 'standardization',
    name: 'Chuẩn hóa',
    title: 'Đảm bảo tính nhất quán và đồng bộ',
    description: 'Dữ liệu đồng nhất và nhất quán',
    icon: CheckSquare,
    color: 'green',
    tasks: [
      'Đối sánh và xác thực sự tồn tại dựa trên khóa dữ liệu (key)',
      'Xử lý các bản ghi trùng lặp',
      'Xử lý các vi phạm ràng buộc về thuộc tính',
    ],
  },
  {
    id: 'transformation',
    name: 'Biến đổi',
    title: 'Tối ưu hóa dữ liệu cho việc phân tích và sử dụng',
    description: 'Dữ liệu tối ưu và sẵn sàng',
    icon: Shuffle,
    color: 'purple',
    tasks: [
      'Biến đổi định dạng dữ liệu',
      'Gộp hoặc tách các cột thông tin',
      'Phân loại và gán nhãn dữ liệu',
    ],
  },
];

interface DataProcessingWorkflowProps {
  onStepClick: (stepId: string) => void;
  currentStep?: string;
}

export function DataProcessingWorkflow({ onStepClick, currentStep }: DataProcessingWorkflowProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const getStepColor = (color: string, variant: 'bg' | 'border' | 'text' | 'hover') => {
    const colors: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-900',
        hover: 'hover:bg-blue-100',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-900',
        hover: 'hover:bg-green-100',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-900',
        hover: 'hover:bg-purple-100',
      },
    };
    return colors[color]?.[variant] || '';
  };

  return (
    <div className="space-y-8">
      {/* Workflow Diagram */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border-2 border-slate-200">
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Dữ liệu thô */}
          <div className="flex flex-col items-center">
            <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300 mb-2">
              <Database className="w-12 h-12 text-slate-600" />
            </div>
            <p className="text-sm text-slate-600">Dữ liệu thô</p>
          </div>

          <ArrowRight className="w-8 h-8 text-slate-400" />

          {/* 3 bước xử lý */}
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isHovered = hoveredStep === step.id;

            return (
              <div key={step.id} className="flex items-center gap-4">
                <button
                  onClick={() => onStepClick(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`relative p-6 rounded-2xl border-4 transition-all duration-300 ${
                    getStepColor(step.color, 'border')
                  } ${getStepColor(step.color, 'bg')} ${
                    isActive ? 'scale-110 shadow-2xl ring-4 ring-offset-4' : 'hover:scale-105 hover:shadow-xl'
                  } ${getStepColor(step.color, 'hover')}`}
                  style={{
                    ['--tw-ring-color' as string]: isActive
                      ? step.color === 'blue'
                        ? 'rgb(59 130 246 / 0.3)'
                        : step.color === 'green'
                        ? 'rgb(34 197 94 / 0.3)'
                        : 'rgb(168 85 247 / 0.3)'
                      : undefined,
                  }}
                >
                  {/* Step Number */}
                  <div
                    className={`absolute -top-3 -left-3 w-10 h-10 bg-white border-4 rounded-full flex items-center justify-center shadow-lg ${
                      getStepColor(step.color, 'border')
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        step.color === 'blue'
                          ? 'text-blue-600'
                          : step.color === 'green'
                          ? 'text-green-600'
                          : 'text-purple-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex flex-col items-center w-48">
                    <div className="mb-3 p-4 bg-white rounded-xl shadow-md">
                      <Icon
                        className={`w-10 h-10 ${
                          step.color === 'blue'
                            ? 'text-blue-600'
                            : step.color === 'green'
                            ? 'text-green-600'
                            : 'text-purple-600'
                        }`}
                      />
                    </div>
                    <h3 className={`text-lg mb-1 ${getStepColor(step.color, 'text')}`}>{step.name}</h3>
                    <p className="text-xs text-center text-slate-600 mb-3">{step.description}</p>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Đang xem
                      </div>
                    )}
                  </div>
                </button>

                {index < workflowSteps.length - 1 && <ArrowRight className="w-8 h-8 text-slate-400" />}
              </div>
            );
          })}

          <ArrowRight className="w-8 h-8 text-slate-400" />

          {/* Dữ liệu chuẩn */}
          <div className="flex flex-col items-center">
            <div className="p-4 bg-green-100 rounded-xl border-2 border-green-500 mb-2 shadow-lg">
              <ListChecks className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-sm text-green-900">Dữ liệu chuẩn</p>
          </div>
        </div>

        {/* Expanded Task List */}
        {hoveredStep && (
          <div className="mt-6 p-6 bg-white rounded-xl border-2 border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            {workflowSteps
              .filter((s) => s.id === hoveredStep)
              .map((step) => (
                <div key={step.id}>
                  <h4 className={`mb-4 ${getStepColor(step.color, 'text')}`}>{step.title}</h4>
                  <ul className="space-y-2">
                    {step.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${
                            step.color === 'blue'
                              ? 'bg-blue-100 text-blue-700'
                              : step.color === 'green'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          •
                        </span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => onStepClick('cleaning')}
          className="flex items-center gap-3 p-4 bg-white border-2 border-blue-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition-all group"
        >
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-slate-900 mb-1">Cấu hình quy tắc</h4>
            <p className="text-xs text-slate-600">Thiết lập quy tắc xử lý</p>
          </div>
        </button>

        <button
          onClick={() => onStepClick('cleaning')}
          className="flex items-center gap-3 p-4 bg-white border-2 border-green-200 rounded-lg hover:shadow-lg hover:border-green-400 transition-all group"
        >
          <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-slate-900 mb-1">Thực thi xử lý</h4>
            <p className="text-xs text-slate-600">Chạy tác vụ xử lý dữ liệu</p>
          </div>
        </button>

        <button
          onClick={() => onStepClick('cleaning')}
          className="flex items-center gap-3 p-4 bg-white border-2 border-purple-200 rounded-lg hover:shadow-lg hover:border-purple-400 transition-all group"
        >
          <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-slate-900 mb-1">Xem báo cáo</h4>
            <p className="text-xs text-slate-600">Kết quả và thống kê</p>
          </div>
        </button>
      </div>
    </div>
  );
}
