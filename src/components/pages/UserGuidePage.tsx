import { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Download,
  Video,
  FileText,
  Search,
  Database,
  Settings,
  FolderTree,
  Globe,
  HardDrive,
  Network,
  GitCompare,
  Bell,
  Shield,
  PlayCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: {
    id: string;
    title: string;
    content: string;
  }[];
}

const sections: Section[] = [
  {
    id: 'intro',
    title: '1. Giới thiệu hệ thống DLDC',
    icon: BookOpen,
    subsections: [
      {
        id: 'overview',
        title: '1.1. Tổng quan',
        content: 'Hệ thống Kho DLDC (DLDC) là nền tảng tập trung thu thập, xử lý, quản lý và chia sẻ dữ liệu giữa các đơn vị trong và ngoài ngành. Hệ thống được xây dựng nhằm đảm bảo tính nhất quán, chính xác và khả năng khai thác hiệu quả dữ liệu phục vụ công tác quản lý nhà nước.'
      },
      {
        id: 'architecture',
        title: '1.2. Kiến trúc hệ thống',
        content: 'DLDC được thiết kế theo kiến trúc 3 tầng: Tầng thu thập dữ liệu (Data Collection Layer), Tầng xử lý và lưu trữ (Processing & Storage Layer), và Tầng điều phối và chia sẻ (Orchestration & Sharing Layer). Hệ thống hỗ trợ kết nối với hơn 15 cơ sở dữ liệu chuyên ngành và cung cấp API chuẩn cho việc tích hợp.'
      },
      {
        id: 'users',
        title: '1.3. Đối tượng sử dụng',
        content: 'Hệ thống phục vụ các đối tượng: Quản trị viên hệ thống, Chuyên viên thu thập dữ liệu, Chuyên viên xử lý dữ liệu, Người quản lý danh mục, Người phê duyệt, và Người tra cứu dữ liệu. Mỗi vai trò có quyền hạn và giao diện phù hợp với nghiệp vụ.'
      }
    ]
  },
  {
    id: 'collection',
    title: '2. Module Thu thập CSDL',
    icon: Database,
    subsections: [
      {
        id: 'collection-overview',
        title: '2.1. Tổng quan thu thập dữ liệu',
        content: 'Module Thu thập CSDL cho phép thiết lập kết nối và thu thập dữ liệu từ các nguồn bên ngoài (Bộ, ngành khác) và các hệ thống trong ngành. Hỗ trợ nhiều phương thức kết nối: API REST, Web Service, Database Connection, và File Import (Excel, CSV, XML).'
      },
      {
        id: 'external-collection',
        title: '2.2. Thu thập dữ liệu từ Bộ ngành ngoài',
        content: 'Các bước thu thập dữ liệu từ Bộ ngành ngoài:\n\n1. Vào menu "Thu thập CSDL" → "Đối tịch tư Bộ ngành ngoài"\n2. Chọn danh mục cần thu thập (ví dụ: Biên tập danh mục A)\n3. Cấu hình kết nối: nhập URL API, Authentication key, tần suất đồng bộ\n4. Ánh xạ trường dữ liệu từ nguồn sang schema đích\n5. Thiết lập lịch thu thập tự động (theo giờ/ngày/tuần)\n6. Chạy thử nghiệm và kiểm tra kết quả\n7. Kích hoạt thu thập tự động\n\nHệ thống sẽ ghi log chi tiết mỗi lần thu thập và cảnh báo khi có lỗi.'
      },
      {
        id: 'internal-collection',
        title: '2.3. Thu thập dữ liệu từ hệ thống trong ngành',
        content: 'Thu thập dữ liệu từ các hệ thống trong ngành Tư pháp:\n\n1. Truy cập menu "Thu thập CSDL" → "Đối tịch tư hệ thống trong nội bộ"\n2. Chọn hệ thống nguồn (ví dụ: Hệ thống A)\n3. Cấu hình connection string hoặc API endpoint\n4. Thiết lập quy tắc lọc dữ liệu (filter conditions)\n5. Cấu hình transformation rules nếu cần\n6. Lên lịch thu thập định kỳ\n7. Giám sát quá trình thu thập qua dashboard\n\nHỗ trợ thu thập real-time hoặc batch processing tùy theo yêu cầu nghiệp vụ.'
      }
    ]
  },
  {
    id: 'processing',
    title: '3. Module Xử lý dữ liệu',
    icon: Settings,
    subsections: [
      {
        id: 'processing-overview',
        title: '3.1. Quy trình xử lý dữ liệu',
        content: 'Module Xử lý dữ liệu thực hiện 3 bước chính:\n\n• Bước 1 - Làm sạch (Data Cleaning): Loại bỏ dữ liệu trùng lặp, sửa lỗi format, xử lý giá trị null/rỗng\n• Bước 2 - Chuẩn hóa (Data Normalization): Chuyển đổi dữ liệu về định dạng chuẩn theo quy định\n• Bước 3 - Biến đổi (Data Transformation): Áp dụng các business rules và tính toán giá trị dẫn xuất\n\nMỗi CSDL có thể áp dụng 10 quy tắc cho dữ liệu trong ngành và 3 quy tắc cho dữ liệu ngoài ngành.'
      },
      {
        id: 'data-tabs',
        title: '3.2. Cấu trúc 4 tabs xử lý',
        content: 'Mỗi CSDL trong menu Xử lý dữ liệu có 4 tabs thống nhất:\n\n**Tab 1: Danh sách dữ liệu**\n- Hiển thị toàn bộ bản ghi đã thu thập\n- Lọc, tìm kiếm, sắp xếp dữ liệu\n- Xem chi tiết và sửa lỗi từng bản ghi\n- Đánh dấu trạng thái: Chờ xử lý / Đang xử lý / Hoàn thành / Lỗi\n\n**Tab 2: Cấu hình xử lý**\n- Thiết lập quy tắc làm sạch dữ liệu\n- Cấu hình chuẩn hóa theo mapping rules\n- Định nghĩa transformation logic\n- Quản lý 10 quy tắc trong ngành và 3 quy tắc ngoài ngành\n\n**Tab 3: Danh sách cảnh báo**\n- Liệt kê các bản ghi có vấn đề cần xử lý\n- Phân loại theo mức độ: Nghiêm trọng / Cảnh báo / Thông tin\n- Gán người xử lý và theo dõi tiến độ\n- Thống kê số lượng cảnh báo theo thời gian\n\n**Tab 4: Lịch sử xử lý**\n- Ghi log đầy đủ mọi thao tác xử lý\n- Lưu trạng thái trước/sau xử lý\n- Theo dõi người thực hiện và thời gian\n- Hỗ trợ rollback nếu cần'
      },
      {
        id: 'error-fixing',
        title: '3.3. Sửa lỗi từng bản ghi',
        content: 'Quy trình sửa lỗi chi tiết cho từng bản ghi:\n\n1. Từ tab "Danh sách dữ liệu", click nút "Sửa" ở bản ghi lỗi\n2. Hệ thống hiển thị form chi tiết với:\n   - Dữ liệu gốc (read-only)\n   - Dữ liệu hiện tại (editable)\n   - Danh sách lỗi được phát hiện\n   - Gợi ý sửa lỗi tự động\n3. Chỉnh sửa các trường bị lỗi\n4. Nhập ghi chú lý do sửa đổi (bắt buộc)\n5. Click "Lưu và kiểm tra lại"\n6. Hệ thống validate và cập nhật trạng thái\n7. Ghi log đầy đủ vào "Lịch sử xử lý"\n\nMỗi lần sửa đổi được lưu version để có thể xem lại hoặc rollback.'
      },
      {
        id: 'feedback',
        title: '3.4. Hệ thống phản hồi nguồn',
        content: 'Cơ chế phản hồi về hệ thống nguồn khi phát hiện lỗi:\n\n1. Tự động gửi thông báo lỗi về hệ thống nguồn qua API\n2. Tạo ticket trong Hệ thống quản lý Bộ Tư Pháp sự cố\n3. Gửi email/notification cho đơn vị quản lý nguồn dữ liệu\n4. Theo dõi tiến độ xử lý từ phía nguồn\n5. Tự động thu thập lại sau khi nguồn sửa xong\n\nThống kê số lượng lỗi theo nguồn để đánh giá chất lượng dữ liệu đầu vào.'
      }
    ]
  },
  {
    id: 'category',
    title: '4. Module Quản lý danh mục',
    icon: FolderTree,
    subsections: [
      {
        id: 'category-setup',
        title: '4.1. Thiết lập danh mục',
        content: 'Hướng dẫn thiết lập danh mục mới:\n\n1. Vào menu "Quản lý danh mục" → "Thiết lập danh mục"\n2. Click nút "Thêm danh mục mới"\n3. Nhập thông tin cơ bản:\n   - Mã danh mục (unique)\n   - Tên danh mục (tiếng Việt và tiếng Anh)\n   - Mô tả và mục đích sử dụng\n   - Phân loại danh mục\n4. Định nghĩa cấu trúc dữ liệu:\n   - Thêm các trường dữ liệu (fields)\n   - Chọn kiểu dữ liệu (text, number, date, boolean...)\n   - Thiết lập ràng buộc (required, unique, format...)\n   - Định nghĩa quan hệ với danh mục khác\n5. Cấu hình quyền truy cập\n6. Lưu hoặc gửi phê duyệt'
      },
      {
        id: 'category-approval',
        title: '4.2. Phê duyệt danh mục',
        content: 'Quy trình phê duyệt danh mục:\n\n**Đối với người trình:**\n1. Chọn danh mục ở trạng thái "Nháp"\n2. Kiểm tra đầy đủ thông tin\n3. Click "Gửi trình" trong cột Thao tác\n4. Chọn người phê duyệt từ danh sách\n5. Nhập nội dung trình và đính kèm tài liệu nếu có\n6. Gửi và theo dõi trạng thái\n\n**Đối với người phê duyệt:**\n1. Nhận thông báo có yêu cầu phê duyệt mới\n2. Vào menu "Phê duyệt" và chọn tab tương ứng\n3. Click "Xem chi tiết" để xem đầy đủ thông tin\n4. Xem xét và đánh giá:\n   - Tính hợp lệ của cấu trúc dữ liệu\n   - Tính phù hợp với yêu cầu nghiệp vụ\n   - Tính nhất quán với các danh mục hiện có\n5. Quyết định:\n   - **Phê duyệt**: Danh mục chuyển sang trạng thái "Đã duyệt", có thể công khai\n   - **Từ chối**: Nhập lý do từ chối chi tiết, danh mục trả về người tạo để chỉnh sửa'
      },
      {
        id: 'category-publish',
        title: '4.3. Công khai danh mục',
        content: 'Công khai danh mục để các hệ thống khác sử dụng:\n\n1. Chọn danh mục đã được phê duyệt\n2. Cấu hình phạm vi công khai:\n   - Công khai nội bộ (trong ngành Tư pháp)\n   - Công khai liên Bộ ngành\n   - Công khai ra ngoài\n3. Thiết lập quyền truy cập:\n   - Danh sách đơn vị/hệ thống được phép truy cập\n   - Phương thức truy cập (API, Web Service, Download)\n4. Tạo API endpoint và documentation\n5. Công bố và gửi thông báo đến các bên liên quan\n6. Theo dõi lượng truy cập và sử dụng'
      }
    ]
  },
  {
    id: 'open-data',
    title: '5. Module Dữ liệu mở',
    icon: Globe,
    subsections: [
      {
        id: 'open-data-overview',
        title: '5.1. Giới thiệu về Dữ liệu mở',
        content: 'Module Dữ liệu mở được xây dựng theo Nghị định 47/2020/NĐ-CP về Dữ liệu mở của cơ quan nhà nước. Mục đích:\n\n• Tăng cường minh bạch và trách nhiệm giải trình\n• Thúc đẩy sự tham gia của người dân và doanh nghiệp\n• Hỗ trợ phát triển các ứng dụng, dịch vụ sáng tạo\n• Nâng cao hiệu quả hoạt động của cơ quan nhà nước\n\nDữ liệu mở cần đảm bảo: Đầy đủ, Sơ cấp, Kịp thời, Dễ tiếp cận, Máy đọc được, Không phân biệt, Không độc quyền, Miễn phí bản quyền.'
      },
      {
        id: 'open-data-setup',
        title: '5.2. Thiết lập dữ liệu mở',
        content: 'Các bước thiết lập bộ dữ liệu mở:\n\n1. Xác định dữ liệu phù hợp để mở:\n   - Không chứa thông tin cá nhân nhạy cảm\n   - Không vi phạm an ninh quốc gia\n   - Có giá trị khai thác cho xã hội\n2. Làm sạch và chuẩn hóa dữ liệu\n3. Chọn định dạng mở (CSV, JSON, XML, RDF)\n4. Tạo metadata mô tả bộ dữ liệu:\n   - Tiêu đề, mô tả\n   - Tần suất cập nhật\n   - Phạm vi thời gian và không gian\n   - Giấy phép sử dụng\n   - Thông tin liên hệ\n5. Thiết lập API truy xuất\n6. Gửi phê duyệt'
      },
      {
        id: 'open-data-publish',
        title: '5.3. Công bố dữ liệu mở',
        content: 'Công bố dữ liệu mở ra cổng thông tin:\n\n1. Sau khi được phê duyệt, chọn "Công bố"\n2. Chọn nơi công bố:\n   - Cổng Dữ liệu mở Quốc gia (data.gov.vn)\n   - Cổng thông tin của đơn vị\n   - Cổng dữ liệu mở chuyên ngành\n3. Cấu hình:\n   - URL truy cập dữ liệu\n   - API endpoint\n   - Tài liệu hướng dẫn sử dụng\n   - Ví dụ code sample\n4. Thiết lập lịch cập nhật tự động\n5. Công bố và theo dõi:\n   - Số lượt truy cập, tải về\n   - Phản hồi từ người dùng\n   - Báo cáo định kỳ theo quy định'
      }
    ]
  },
  {
    id: 'master-data',
    title: '6. Module Dữ liệu chủ',
    icon: HardDrive,
    subsections: [
      {
        id: 'master-data-overview',
        title: '6.1. Khái niệm Dữ liệu chủ',
        content: 'Dữ liệu chủ (Master Data) là tập dữ liệu quan trọng nhất, được sử dụng xuyên suốt trong toàn hệ thống và các hệ thống liên quan. Ví dụ:\n\n• Danh sách đơn vị hành chính\n• Danh mục dân tộc\n• Danh mục quốc gia, quốc tịch\n• Danh sách cơ quan nhà nước\n• Danh mục nghề nghiệp\n\nĐặc điểm của Dữ liệu chủ:\n- Được quản lý tập trung, có một nguồn duy nhất (Single Source of Truth)\n- Thay đổi ít, cần phê duyệt nghiêm ngặt\n- Được đồng bộ đến tất cả hệ thống sử dụng\n- Có version control và audit trail đầy đủ'
      },
      {
        id: 'master-data-management',
        title: '6.2. Quản lý Dữ liệu chủ',
        content: 'Các chức năng quản lý Dữ liệu chủ:\n\n**Tra cứu và tìm kiếm:**\n- Tìm kiếm nhanh theo từ khóa\n- Lọc theo nhiều tiêu chí\n- Xuất báo cáo Excel/PDF\n\n**Thêm mới/Cập nhật:**\n1. Đề xuất thêm mới hoặc sửa đổi\n2. Nhập đầy đủ thông tin và lý do thay đổi\n3. Gửi phê duyệt\n4. Sau khi được duyệt, tự động đồng bộ đến các hệ thống\n\n**Theo dõi lịch sử:**\n- Xem tất cả version của một bản ghi\n- So sánh sự khác biệt giữa các version\n- Rollback về version trước nếu cần\n- Xem ai đã thay đổi, khi nào, vì sao'
      },
      {
        id: 'master-data-sync',
        title: '6.3. Đồng bộ Dữ liệu chủ',
        content: 'Cơ chế đồng bộ dữ liệu chủ đến các hệ thống:\n\n**Đồng bộ tự động:**\n- Khi dữ liệu chủ được cập nhật và phê duyệt\n- Hệ thống tự động push đến các hệ thống đã đăng ký\n- Gửi qua API hoặc message queue\n- Ghi log kết quả đồng bộ\n\n**Đồng bộ thủ công:**\n- Dùng khi hệ thống đích tạm thời offline\n- Chọn dữ liệu cần đồng bộ\n- Chọn hệ thống đích\n- Thực hiện và theo dõi kết quả\n\n**Xử lý lỗi:**\n- Retry tự động khi gặp lỗi network\n- Cảnh báo khi đồng bộ thất bại\n- Cho phép đồng bộ lại thủ công\n- Báo cáo hệ thống chưa cập nhật thành công'
      }
    ]
  },
  {
    id: 'orchestration',
    title: '7. Module Điều phối dữ liệu',
    icon: Network,
    subsections: [
      {
        id: 'service-setup',
        title: '7.1. Thiết lập dịch vụ',
        content: 'Thiết lập dịch vụ điều phối dữ liệu:\n\n1. Vào "Quản lý điều phối dữ liệu" → "Thiết lập dịch vụ"\n2. Tạo dịch vụ mới:\n   - Tên và mã dịch vụ\n   - Loại dịch vụ: Cung cấp dữ liệu / Nhận dữ liệu / Đồng bộ 2 chiều\n   - Hệ thống nguồn và hệ thống đích\n3. Cấu hình kết nối:\n   - API endpoint\n   - Authentication (API Key, OAuth, Certificate)\n   - Timeout và retry policy\n4. Ánh xạ dữ liệu:\n   - Map fields từ nguồn sang đích\n   - Định nghĩa transformation rules\n5. Thiết lập lịch chạy\n6. Test và kích hoạt'
      },
      {
        id: 'api-management',
        title: '7.2. Quản lý API',
        content: 'Quản lý API chủ động và API thụ động:\n\n**API chủ động (Active API - Push):**\n- Hệ thống DLDC chủ động đẩy dữ liệu đến hệ thống khác\n- Cấu hình:\n  + Target endpoint của hệ thống nhận\n  + Tần suất đẩy dữ liệu\n  + Điều kiện trigger (theo thời gian hoặc sự kiện)\n  + Retry policy khi thất bại\n\n**API thụ động (Passive API - Pull):**\n- Các hệ thống khác gọi API để lấy dữ liệu từ DLDC\n- Cấu hình:\n  + Tạo API endpoint\n  + Định nghĩa input/output schema\n  + Thiết lập authentication\n  + Rate limiting và quota\n  + API documentation tự động\n\n**Giám sát API:**\n- Số lượng request thành công/thất bại\n- Response time trung bình\n- Top consumers\n- Alert khi có bất thường'
      },
      {
        id: 'monitoring',
        title: '7.3. Giám sát hệ thống',
        content: 'Dashboard giám sát điều phối dữ liệu:\n\n**Tổng quan hệ thống:**\n- Số lượng dịch vụ đang hoạt động\n- Tổng số API calls hôm nay\n- Tỷ lệ thành công/thất bại\n- Thời gian phản hồi trung bình\n\n**Giám sát real-time:**\n- Biểu đồ request/giây\n- Map kết nối giữa các hệ thống\n- Alert khi có dịch vụ down\n- Log stream của API calls\n\n**Báo cáo:**\n- Báo cáo theo ngày/tuần/tháng\n- Top API được sử dụng nhiều nhất\n- Phân tích lỗi và nguyên nhân\n- Xu hướng sử dụng theo thời gian\n\n**Cảnh báo:**\n- Email/SMS khi dịch vụ gặp sự cố\n- Cảnh báo khi response time cao bất thường\n- Thông báo khi vượt quota'
      }
    ]
  },
  {
    id: 'reconciliation',
    title: '8. Module Đối soát dữ liệu',
    icon: GitCompare,
    subsections: [
      {
        id: 'reconciliation-overview',
        title: '8.1. Giới thiệu đối soát',
        content: 'Đối soát dữ liệu là quá trình so sánh và xác nhận tính nhất quán của dữ liệu giữa DLDC và các hệ thống nguồn/đích. Mục đích:\n\n• Phát hiện sai lệch dữ liệu giữa các hệ thống\n• Đảm bảo tính toàn vẹn khi truyền dữ liệu\n• Xác định nguyên nhân gây ra sai lệch\n• Điều chỉnh và đồng bộ lại dữ liệu\n\nCác loại đối soát:\n- Đối soát số lượng (record count)\n- Đối soát checksum/hash\n- Đối soát từng trường dữ liệu (field-level)\n- Đối soát logic nghiệp vụ'
      },
      {
        id: 'reconciliation-config',
        title: '8.2. Cấu hình đối soát',
        content: 'Thiết lập quy trình đối soát:\n\n1. Chọn 2 hệ thống/CSDL cần đối soát\n2. Xác định scope đối soát:\n   - Toàn bộ dữ liệu hoặc một phần\n   - Khoảng thời gian dữ liệu\n3. Thiết lập tiêu chí đối soát:\n   - Trường khóa để match records\n   - Các trường cần so sánh\n   - Ngưỡng chấp nhận sai lệch (tolerance)\n4. Cấu hình lịch đối soát:\n   - Đối soát định kỳ (hàng ngày, tuần...)\n   - Đối soát sau mỗi lần đồng bộ\n5. Thiết lập cảnh báo:\n   - Alert khi tỷ lệ sai lệch vượt ngưỡng\n   - Gửi báo cáo đến người phụ trách'
      },
      {
        id: 'reconciliation-process',
        title: '8.3. Quy trình xử lý sai lệch',
        content: 'Xử lý khi phát hiện sai lệch:\n\n1. **Phát hiện sai lệch:**\n   - Hệ thống tự động chạy đối soát theo lịch\n   - Hoặc chạy thủ công khi cần\n   - Ghi log chi tiết các bản ghi sai lệch\n\n2. **Phân tích nguyên nhân:**\n   - Xem chi tiết giá trị khác nhau\n   - Kiểm tra lịch sử thay đổi\n   - Xác định hệ thống nào có dữ liệu đúng\n\n3. **Xử lý:**\n   - Đồng bộ lại từ hệ thống chuẩn\n   - Hoặc sửa thủ công và ghi log\n   - Hoặc báo cáo cho đơn vị quản lý quyết định\n\n4. **Kiểm tra lại:**\n   - Chạy đối soát lại sau khi xử lý\n   - Đóng ticket khi đã khớp\n   - Báo cáo kết quả'
      }
    ]
  },
  {
    id: 'notifications',
    title: '9. Module Quản lý thông báo',
    icon: Bell,
    subsections: [
      {
        id: 'notification-types',
        title: '9.1. Các loại thông báo',
        content: 'Hệ thống hỗ trợ nhiều loại thông báo:\n\n**Thông báo trình duyệt (Browser Notification):**\n- Push notification trực tiếp trên trình duyệt\n- Không cần mở ứng dụng vẫn nhận được\n- Cần cấp quyền lần đầu sử dụng\n\n**Thông báo workflow (Duyệt):**\n- Thông báo khi có yêu cầu phê duyệt mới\n- Nhắc nhở deadline phê duyệt\n- Thông báo kết quả phê duyệt\n\n**Thông báo lỗi hệ thống:**\n- Cảnh báo khi service down\n- Thông báo lỗi database\n- Alert về hiệu suất hệ thống\n\n**Thông báo lỗi API:**\n- API thu thập gặp lỗi\n- API cung cấp bị timeout\n- API đối soát phát hiện sai lệch'
      },
      {
        id: 'notification-config',
        title: '9.2. Cấu hình thông báo',
        content: 'Cấu hình nhận thông báo cá nhân:\n\n1. Click vào avatar → "Cài đặt thông báo"\n2. Chọn loại thông báo muốn nhận:\n   ☑ Yêu cầu phê duyệt mới\n   ☑ Kết quả phê duyệt\n   ☑ Lỗi thu thập dữ liệu\n   ☐ Cập nhật hệ thống\n   ☐ Báo cáo định kỳ\n3. Chọn kênh nhận:\n   ☑ Trong ứng dụng\n   ☑ Email\n   ☐ SMS\n4. Thiết lập tần suất:\n   - Real-time: Nhận ngay lập tức\n   - Digest: Tổng hợp theo giờ/ngày\n5. Lưu cấu hình'
      },
      {
        id: 'notification-management',
        title: '9.3. Quản lý thông báo',
        content: 'Quản lý thông báo đã nhận:\n\n**Xem thông báo:**\n- Click icon chuông ở góc phải trên\n- Danh sách thông báo mới nhất\n- Badge hiển thị số lượng chưa đọc\n\n**Thao tác:**\n- Click để xem chi tiết và chuyển đến tính năng liên quan\n- Đánh dấu đã đọc\n- Xóa thông báo không cần thiết\n- Đánh dấu tất cả đã đọc\n\n**Lọc và tìm kiếm:**\n- Lọc theo loại thông báo\n- Lọc theo trạng thái (đã đọc/chưa đọc)\n- Tìm kiếm theo từ khóa\n- Xem lịch sử thông báo cũ\n\n**Quản trị:**\n- Admin có thể gửi thông báo hệ thống đến tất cả user\n- Lên lịch gửi thông báo bảo trì\n- Thống kê tỷ lệ đọc thông báo'
      }
    ]
  },
  {
    id: 'admin',
    title: '10. Module Quản trị & Vận hành',
    icon: Shield,
    subsections: [
      {
        id: 'user-management',
        title: '10.1. Quản lý người dùng',
        content: 'Quản lý tài khoản người dùng hệ thống:\n\n**Thêm người dùng mới:**\n1. Click "Thêm người dùng"\n2. Nhập thông tin:\n   - Họ tên, email, số điện thoại\n   - Tên đăng nhập\n   - Đơn vị công tác\n   - Chức danh\n3. Chọn nhóm người dùng (để phân quyền)\n4. Thiết lập trạng thái: Hoạt động / Tạm khóa\n5. Lưu - Hệ thống tự động gửi email kích hoạt\n\n**Quản lý:**\n- Tìm kiếm, lọc người dùng\n- Chỉnh sửa thông tin\n- Khóa/mở khóa tài khoản\n- Reset mật khẩu\n- Xem lịch sử đăng nhập\n- Xem lịch sử thao tác\n\n**Phân quyền:**\n- Gán người dùng vào nhóm\n- Gán quyền riêng lẻ nếu cần\n- Xem báo cáo quyền hiện tại của user'
      },
      {
        id: 'group-management',
        title: '10.2. Quản lý nhóm',
        content: 'Quản lý nhóm người dùng và phân quyền theo nhóm:\n\n**Tạo nhóm mới:**\n1. Đặt tên và mô tả nhóm\n2. Chọn các chức năng được phép truy cập:\n   - Thu thập dữ liệu\n   - Xử lý dữ liệu\n   - Quản lý danh mục\n   - ...\n3. Với mỗi chức năng, chọn quyền:\n   ☑ Xem (Read)\n   ☑ Thêm (Create)\n   ☐ Sửa (Update)\n   ☐ Xóa (Delete)\n   ☐ Phê duyệt (Approve)\n4. Lưu cấu hình\n\n**Các nhóm mặc định:**\n- Admin: Full quyền\n- Chuyên viên thu thập: Xem và cấu hình thu thập\n- Chuyên viên xử lý: Xử lý và sửa lỗi dữ liệu\n- Người quản lý danh mục: Tạo và chỉnh sửa danh mục\n- Người phê duyệt: Quyền phê duyệt\n- Người xem: Chỉ xem dữ liệu, không chỉnh sửa'
      },
      {
        id: 'system-config',
        title: '10.3. Cấu hình hệ thống',
        content: 'Các tham số cấu hình hệ thống:\n\n**Cấu hình chung:**\n- Tên hệ thống và logo\n- Timezone và format ngày giờ\n- Ngôn ngữ mặc định\n- Email và SMS gateway\n\n**Cấu hình bảo mật:**\n- Độ phức tạp mật khẩu\n- Thời gian timeout session\n- Số lần đăng nhập sai tối đa\n- IP whitelist/blacklist\n\n**Cấu hình hiệu suất:**\n- Kích thước file upload tối đa\n- Số bản ghi hiển thị mỗi trang\n- Timeout cho API calls\n- Cache duration\n\n**Cấu hình lưu trữ:**\n- Thời gian lưu log\n- Thời gian lưu backup\n- Chính sách xóa dữ liệu cũ\n\n**Cấu hình thông báo:**\n- SMTP server cho email\n- API key cho SMS\n- Webhook cho integrations'
      },
      {
        id: 'backup',
        title: '10.4. Sao lưu dự phòng',
        content: 'Quản lý sao lưu và khôi phục dữ liệu:\n\n**Sao lưu tự động:**\n- Cấu hình lịch sao lưu (hàng ngày, tuần...)\n- Chọn loại sao lưu:\n  + Full backup: Toàn bộ dữ liệu\n  + Incremental: Chỉ dữ liệu thay đổi\n- Nơi lưu trữ:\n  + Storage nội bộ\n  + Cloud storage (S3, Azure Blob...)\n- Số lượng bản backup giữ lại\n- Email thông báo kết quả backup\n\n**Sao lưu thủ công:**\n1. Click "Tạo backup ngay"\n2. Chọn phạm vi dữ liệu cần backup\n3. Nhập ghi chú (lý do backup)\n4. Thực hiện và theo dõi tiến độ\n\n**Khôi phục:**\n1. Chọn bản backup cần khôi phục\n2. Xem preview dữ liệu\n3. Chọn phương án:\n   - Khôi phục hoàn toàn (ghi đè)\n   - Khôi phục vào database test\n   - Khôi phục chỉ một số bảng\n4. Xác nhận và thực hiện\n5. Kiểm tra kết quả'
      }
    ]
  },
  {
    id: 'faq',
    title: '11. Câu hỏi thường gặp',
    icon: MessageSquare,
    subsections: [
      {
        id: 'faq-general',
        title: '11.1. Câu hỏi chung',
        content: '**Q: Làm thế nào để đăng nhập lần đầu?**\nA: Admin sẽ tạo tài khoản và gửi email kích hoạt. Click link trong email, đặt mật khẩu mới và đăng nhập.\n\n**Q: Quên mật khẩu phải làm sao?**\nA: Click "Quên mật khẩu" ở trang đăng nhập, nhập email, hệ thống sẽ gửi link reset mật khẩu.\n\n**Q: Tôi có thể truy cập hệ thống từ điện thoại không?**\nA: Có, giao diện tương thích với mobile browser. Tuy nhiên một số chức năng phức tạp nên dùng trên desktop.\n\n**Q: Dữ liệu của tôi có được mã hóa không?**\nA: Có, tất cả dữ liệu được mã hóa khi truyền tải (HTTPS) và khi lưu trữ (encryption at rest).\n\n**Q: Làm thế nào để xuất dữ liệu ra Excel?**\nA: Hầu hết các danh sách đều có nút "Xuất Excel" ở góc trên bên phải. Click và chọn định dạng muốn xuất.'
      },
      {
        id: 'faq-technical',
        title: '11.2. Câu hỏi kỹ thuật',
        content: '**Q: API rate limit là bao nhiêu?**\nA: Mặc định là 1000 requests/hour cho mỗi API key. Có thể tăng lên theo yêu cầu.\n\n**Q: Hệ thống hỗ trợ định dạng dữ liệu nào?**\nA: JSON, XML, CSV, Excel (.xlsx, .xls), và cơ sở dữ liệu (Oracle, SQL Server, PostgreSQL, MySQL).\n\n**Q: Làm sao để tích hợp API của DLDC vào hệ thống của tôi?**\nA: Xem tài liệu API tại mục "Tài liệu API" trong menu "Quản lý điều phối dữ liệu". Có code sample cho nhiều ngôn ngữ.\n\n**Q: Hệ thống có hỗ trợ webhook không?**\nA: Có, bạn có thể đăng ký webhook để nhận thông báo realtime khi có sự kiện (dữ liệu mới, cập nhật...).\n\n**Q: Dữ liệu được backup bao lâu một lần?**\nA: Full backup hàng ngày lúc 2h sáng, incremental backup mỗi 4 tiếng. Lưu giữ 30 ngày gần nhất.'
      },
      {
        id: 'faq-troubleshooting',
        title: '11.3. Xử lý sự cố',
        content: '**Q: Tôi không thấy menu "Quản trị" ở sidebar?**\nA: Bạn không có quyền admin. Liên hệ quản trị viên để được cấp quyền nếu cần.\n\n**Q: Khi thu thập dữ liệu bị lỗi "Connection timeout"?**\nA: Kiểm tra:\n- URL API có đúng không?\n- Hệ thống nguồn có đang hoạt động không?\n- Firewall có chặn kết nối không?\n- Liên hệ IT để kiểm tra network.\n\n**Q: Dữ liệu sau khi xử lý vẫn có lỗi?**\nA: Vào tab "Danh sách cảnh báo" để xem chi tiết lỗi. Có thể cần điều chỉnh quy tắc xử lý hoặc sửa thủ công.\n\n**Q: Không gửi được yêu cầu phê duyệt?**\nA: Kiểm tra:\n- Đã điền đầy đủ thông tin bắt buộc chưa?\n- Có người phê duyệt trong hệ thống chưa?\n- Xem log lỗi hoặc liên hệ support.\n\n**Q: File Excel xuất ra bị lỗi font tiếng Việt?**\nA: Mở file bằng Microsoft Excel thay vì OpenOffice/LibreOffice để hiển thị đúng.'
      }
    ]
  }
];

export function UserGuidePage() {
  const [selectedSection, setSelectedSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = sections.map(section => {
    if (searchQuery === '') return section;

    const matchedSubsections = section.subsections.filter(sub =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedSubsections.length > 0 ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return { ...section, subsections: matchedSubsections.length > 0 ? matchedSubsections : section.subsections };
    }

    return null;
  }).filter(Boolean) as Section[];

  const currentSection = sections.find(s => s.id === selectedSection) || sections[0];

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Left Sidebar - Table of Contents */}
      <div className="w-80 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-slate-900 mb-3">Mục lục</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isActive = selectedSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                  <span className="text-sm leading-tight">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Tải tài liệu PDF
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <Video className="w-4 h-4" />
            Xem video hướng dẫn
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Section Header */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
              {(() => {
                const Icon = currentSection.icon;
                return <Icon className="w-8 h-8 text-violet-600 flex-shrink-0 mt-1" />;
              })()}
              <div className="flex-1">
                <h1 className="text-slate-900 mb-2">{currentSection.title}</h1>
                <p className="text-sm text-slate-600">
                  {currentSection.subsections.length} phần nội dung
                </p>
              </div>
            </div>

            {/* Subsections */}
            <div className="space-y-8">
              {currentSection.subsections.map((subsection, index) => (
                <div key={subsection.id} id={subsection.id}>
                  <h2 className="text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    {subsection.title}
                  </h2>
                  <div className="pl-11">
                    <div className="prose prose-slate max-w-none">
                      {subsection.content.split('\n\n').map((paragraph, pIndex) => {
                        // Check if paragraph is a list
                        if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
                          const items = paragraph.split('\n').filter(item => item.trim());
                          return (
                            <ul key={pIndex} className="space-y-2 mb-4">
                              {items.map((item, iIndex) => (
                                <li key={iIndex} className="text-slate-700">
                                  {item.replace(/^[•\-]\s*/, '')}
                                </li>
                              ))}
                            </ul>
                          );
                        }

                        // Check if paragraph is numbered list
                        if (/^\d+\./.test(paragraph.trim())) {
                          const items = paragraph.split('\n').filter(item => item.trim());
                          return (
                            <ol key={pIndex} className="space-y-2 mb-4 list-decimal list-inside">
                              {items.map((item, iIndex) => (
                                <li key={iIndex} className="text-slate-700">
                                  {item.replace(/^\d+\.\s*/, '')}
                                </li>
                              ))}
                            </ol>
                          );
                        }

                        // Check if it's a bold heading
                        if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                          const [heading, ...content] = paragraph.split(':**');
                          return (
                            <div key={pIndex} className="mb-4">
                              <h4 className="text-slate-900 mb-2">
                                {heading.replace(/\*\*/g, '')}:
                              </h4>
                              <p className="text-slate-700">{content.join(':**')}</p>
                            </div>
                          );
                        }

                        // Regular paragraph
                        return (
                          <p key={pIndex} className="text-slate-700 mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {index < currentSection.subsections.length - 1 && (
                    <div className="mt-8 pt-8 border-t border-slate-100" />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === selectedSection);
                  if (currentIndex > 0) {
                    setSelectedSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === selectedSection) === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Phần trước
              </button>

              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === selectedSection);
                  if (currentIndex < sections.length - 1) {
                    setSelectedSection(sections[currentIndex + 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === selectedSection) === sections.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Phần tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}