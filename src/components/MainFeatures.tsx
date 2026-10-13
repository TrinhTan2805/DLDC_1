import { 
  Home, 
  Database, 
  FileSearch, 
  Share2, 
  GitCompare, 
  Sparkles, 
  Settings,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'Trang chủ',
    icon: Home,
    color: 'bg-blue-500',
    subFeatures: [
      { name: 'Biểu đồ thu thập dữ liệu', icon: BarChart3 },
      { name: 'Biểu đồ lượt truy cập', icon: LineChart },
      { name: 'Biểu đồ thống kê dữ liệu mở', icon: PieChart },
      { name: 'Biểu đồ khác...', icon: Activity },
    ],
  },
  {
    id: 2,
    title: 'Quản lý thu thập',
    icon: Database,
    color: 'bg-green-500',
    subFeatures: [
      { name: 'Thu thập CSDL A' },
      { name: 'Thu thập CSDL B' },
      { name: 'Thu thập CSDL C' },
    ],
  },
  {
    id: 3,
    title: 'Xử lý dữ liệu',
    icon: Sparkles,
    color: 'bg-purple-500',
    subFeatures: [
      { name: 'Làm sạch dữ liệu' },
      { name: 'Thiết lập tiêu chí quản lý chất lượng' },
      { name: 'Chuẩn hóa dữ liệu' },
    ],
  },
  {
    id: 4,
    title: 'Tra cứu kho dữ liệu',
    icon: FileSearch,
    color: 'bg-orange-500',
    subFeatures: [
      { name: 'Dữ liệu chủ' },
      { name: 'Dữ liệu mở' },
      { name: 'Dữ liệu dùng chung' },
    ],
  },
  {
    id: 5,
    title: 'Quản lý dịch vụ chia sẻ',
    icon: Share2,
    color: 'bg-teal-500',
    subFeatures: [
      { name: 'Chia sẻ trong ngành' },
      { name: 'Chia sẻ ngoài ngành' },
    ],
  },
  {
    id: 6,
    title: 'Quản lý đối soát dữ liệu',
    icon: GitCompare,
    color: 'bg-indigo-500',
    subFeatures: [
      { name: 'Quản lý đối soát dữ liệu thu thập và kho' },
      { name: 'Quản lý đối soát dữ liệu chia sẻ đi' },
    ],
  },
  {
    id: 7,
    title: 'Quản lý làm sạch dữ liệu',
    icon: Sparkles,
    color: 'bg-pink-500',
    subFeatures: [
      { name: 'Quản lý làm sạch dữ liệu trong ngành' },
      { name: 'Quản lý làm sạch dữ liệu ngoài ngành' },
    ],
  },
  {
    id: 8,
    title: 'Quản trị và vận hành',
    icon: Settings,
    color: 'bg-gray-600',
    subFeatures: [
      { name: 'Quản trị người dùng' },
      { name: 'Quản trị quyền' },
      { name: 'Quản trị nhóm người dùng' },
      { name: 'Cấu hình' },
    ],
  },
];

export function MainFeatures() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
        <h2 className="text-gray-800">Các chức năng chính</h2>
        <p className="text-gray-500 text-sm mt-1">Danh sách đầy đủ các chức năng của hệ thống</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="border border-gray-200 rounded-lg hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Feature Header */}
              <div className={`${feature.color} p-4 text-white`}>
                <div className="flex items-center gap-3">
                  <feature.icon className="w-6 h-6" />
                  <h3 className="text-white">{feature.title}</h3>
                </div>
              </div>

              {/* Sub Features */}
              <div className="p-4">
                <div className="space-y-2">
                  {feature.subFeatures.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {'icon' in sub && sub.icon ? (
                          <sub.icon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        )}
                        <span className="text-gray-700 text-sm">{sub.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}