# TỔNG HỢP CÁC LUỒNG MÀN HÌNH (SCREEN FLOWS)

Tài liệu này tổng hợp toàn bộ các sơ đồ luồng màn hình của hệ thống Kho dữ liệu dùng chung (Kho DLDC), được trình bày dưới dạng sơ đồ chuyên nghiệp (Draw.io style) và mã nguồn Mermaid.

## 1. Luồng ứng dụng tổng quan

Sơ đồ thể hiện luồng điều hướng chính sau khi người dùng đăng nhập thành công:

![Sơ đồ tổng quan](flowdata/overall_flow_1773297855567.png)

### Mã Mermaid tham chiếu:
```mermaid
graph TD
    A[Màn hình Đăng nhập] --> B{Đăng nhập thành công?}
    B -- Có --> C[Tổng quan - Dashboard]
    B -- Không --> A
    
    C --> D[Quản lý thu thập]
    C --> E[Xử lý dữ liệu]
    C --> F[Quản lý danh mục]
    C --> G[Dữ liệu mở]
    C --> H[Quản lý dữ liệu chủ]
    C --> I[Điều phối dữ liệu]
    C --> J[Quản trị & vận hành]
```

**Mô tả quy trình:**
1. **Đăng nhập:** Người dùng truy cập hệ thống qua màn hình đăng nhập.
2. **Dashboard:** Sau khi xác thực thành công, hệ thống chuyển hướng đến Dashboard tổng quan.
3. **Điều hướng:** Từ Dashboard, người dùng có thể truy cập nhanh vào 7 phân hệ chính của hệ thống Kho DLDC.

---

## 2. Luồng theo từng chức năng (Menu)

### 2.1. Quản lý thu thập (Data Collection)
Sơ đồ quy trình thiết lập và thực hiện thu thập dữ liệu:

![Luồng Thu thập](flowdata/collection_flow_1773297876543.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    Start([Bắt đầu]) --> Setup[Thiết lập dịch vụ thu thập]
    Setup --> Test[Kiểm tra kết nối]
    Test -- Thất bại --> Setup
    Test -- Thành công --> Config[Cấu hình tần suất đồng bộ]
    Config --> Collect[Thực hiện thu thập dữ liệu]
    Collect --> Check{Dữ liệu hợp lệ?}
    Check -- Không --> Error[Ghi nhật ký lỗi & Thông báo]
    Check -- Có --> Store[Lưu vào kho dữ liệu tạm]
    Store --> Reconcile[Đối soát dữ liệu]
    Reconcile --> End([Kết thúc])
```

**Mô tả quy trình:**
1. **Thiết lập:** Khai báo nguồn dữ liệu và thực hiện kiểm tra kết nối kỹ thuật.
2. **Cấu hình:** Thiết lập lịch trình và tần suất đồng bộ dữ liệu tự động.
3. **Thu thập:** Hệ thống thực hiện quét và lấy dữ liệu từ nguồn về kho tạm.
4. **Kiểm tra & Đối soát:** Dữ liệu được kiểm tra tính hợp lệ và thực hiện đối soát số lượng trước khi kết thúc luồng.

### 2.2. Xử lý dữ liệu (Data Processing)
Sơ đồ quy trình làm sạch, chuẩn hóa và biến đổi dữ liệu:

![Luồng Xử lý](flowdata/processing_flow_1773297893113.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    A[Tiếp nhận dữ liệu thô] --> B[Thiết lập quy tắc xử lý]
    B --> C[Giai đoạn 1: Làm sạch]
    C --> C_Check{Kiểm tra Làm sạch?}
    C_Check -- Không đạt --> G[Ghi nhật ký lỗi & Sửa đổi]
    C_Check -- Đạt --> D[Giai đoạn 2: Chuẩn hóa]
    D --> D_Check{Kiểm tra Chuẩn hóa?}
    D_Check -- Không đạt --> G
    D_Check -- Đạt --> E[Giai đoạn 3: Biến đổi]
    E --> E_Check{Kiểm tra Biến đổi?}
    E_Check -- Không đạt --> G
    E_Check -- Đạt --> I[Lưu vào kho dữ liệu sạch]
    G --> H[Phản hồi nguồn/Sửa thủ công]
    H --> B
    I --> J[Phân loại & Bảo mật]
    J --> End([Kết thúc])
```

**Mô tả quy trình:**
1. **Tiếp nhận:** Dữ liệu thô từ kho tạm được đưa vào quy trình xử lý theo các quy tắc thiết lập sẵn.
2. **Xử lý đa tầng có kiểm soát:** Dữ liệu trải qua 3 giai đoạn (Làm sạch, Chuẩn hóa, Biến đổi). **Điểm quan trọng:** Sau mỗi giai đoạn, hệ thống thực hiện kiểm tra (Check) ngay lập tức. Chỉ khi đạt yêu cầu mới được chuyển sang giai đoạn tiếp theo.
3. **Xử lý lỗi:** Nếu bất kỳ bước kiểm tra nào không đạt, bản ghi lỗi được ghi nhật ký và chuyển sang bộ phận sửa đổi thủ công hoặc phản hồi lại nguồn dữ liệu.
4. **Lưu trữ:** Dữ liệu sau khi vượt qua tất cả các tầng kiểm tra sẽ được phân loại bảo mật và lưu vào kho dữ liệu sạch chính thức.

### 2.3. Quản lý danh mục (Category Management)
Sơ đồ vòng đời của một danh mục:

![Luồng Danh mục](flowdata/category_flow_1773297910829.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    Start([Bắt đầu]) --> Create[Tạo mới/Đồng bộ danh mục]
    Create --> Draft[Trạng thái: Nháp]
    Draft --> Edit[Chỉnh sửa thông tin/giá trị]
    Edit --> Submit[Gửi phê duyệt]
    Submit --> Review{Cấp quản lý duyệt?}
    Review -- Từ chối --> Draft
    Review -- Đồng ý --> Approved[Trạng thái: Đã phê duyệt]
    Approved --> Publish[Thiết lập công bố]
    Publish --> Public[Trạng thái: Đã công bố]
    Public --> End([Kết thúc])
```

**Mô tả quy trình:**
1. **Khởi tạo:** Tạo mới hoặc đồng bộ danh mục từ các nguồn dùng chung về hệ thống dưới dạng bản nháp.
2. **Biên tập:** Người dùng chỉnh sửa các giá trị, định nghĩa trong danh mục.
3. **Phê duyệt:** Chuyển qua quy trình duyệt đa cấp để đảm bảo tính chính xác của dữ liệu danh mục.
4. **Công bố:** Sau khi được duyệt, danh mục được thiết lập phạm vi và thực hiện công bố để các hệ thống khác sử dụng.

### 2.4. Dữ liệu mở (Open Data)
Sơ đồ quy trình công bố tập dữ liệu mở:

![Luồng Dữ liệu mở](flowdata/open_data_flow_1773297933014.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    A([Bắt đầu]) --> B[Thiết lập Dataset mới]
    B --> C[Cấu hình định dạng & Tần suất]
    C --> D[Gửi phê duyệt]
    D --> E{Lãnh đạo phê duyệt?}
    E -- Không --> B
    E -- Có --> F[Trạng thái: Đã phê duyệt]
    F --> G[Cấu hình phạm vi công bố]
    G --> H[Thực hiện Công bố]
    H --> I[Theo dõi & Thống kê lượt tải]
    I --> End([Kết thúc])
```

**Mô tả quy trình:**
1. **Cấu hình Dataset:** Thiết lập tập dữ liệu mới, chọn định dạng xuất (JSON, CSV, API) và tần suất cập nhật.
2. **Quy trình duyệt:** Gửi hồ sơ công bố dữ liệu mở lên cấp lãnh đạo phê duyệt.
3. **Thực hiện công bố:** Sau khi được duyệt, hệ thống cấu hình phạm vi truy cập và đẩy dữ liệu lên cổng dữ liệu mở.
4. **Giám sát:** Theo dõi hiệu quả khai thác qua các chỉ số thống kê lượt truy cập và tải về.

### 2.5. Quản lý dữ liệu chủ (Master Data)
Sơ đồ quy trình định danh và hợp nhất thực thể dữ liệu gốc:

![Luồng Dữ liệu chủ](flowdata/master_data_flow_1773297952668.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    A([Bắt đầu]) --> B[Tiếp nhận dữ liệu từ Xử lý/Thu thập]
    B --> C[Phát hiện trùng lặp]
    C --> D{Có trùng lặp?}
    D -- Có --> E[Hợp nhất dữ liệu (Merge)]
    D -- Không --> F[Tạo thực thể mới]
    E --> G[Rà soát thay đổi thuộc tính]
    F --> G
    G --> H[Phê duyệt cập nhật]
    H --> I[Lưu vào kho Dữ liệu chủ chính thức]
    I --> J[Công khai qua API]
    J --> End([Kết thúc])
```

**Mô tả quy trình:**
1. **Nhận diện:** Tiếp nhận dữ liệu sạch, thực hiện thuật toán so khớp để phát hiện các bản ghi trùng lặp.
2. **Xử lý trùng:** Nếu trùng, thực hiện hợp nhất (Merge) các thuộc tính tốt nhất; nếu không, tạo mã định danh duy nhất (Unique ID) mới.
3. **Cập nhật:** Rà soát và phê duyệt các thay đổi đối với thực thể dữ liệu gốc.
4. **Lưu trữ & Chia sẻ:** Lưu vào kho Master Data chính thức và cung cấp quyền truy xuất qua API cho toàn hệ thống.

### 2.6. Điều phối dữ liệu (Data Orchestration/API)
Sơ đồ quy trình quản trị vận hành các API cung cấp dữ liệu:

![Luồng Điều phối](flowdata/orchestration_flow_1773297973760.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    A([Bắt đầu]) --> B[Thiết lập API mới (Chủ động/Thụ động)]
    B --> C[Cấu hình Endpoint & Security]
    C --> D[Thiết lập Rate Limiting]
    D --> E[Kiểm tra API]
    E --> F{Kiểm tra đạt?}
    F -- Không --> C
    F -- Có --> G[Kích hoạt vận hành]
    G --> H[Giám sát & Nhật ký]
```

**Mô tả quy trình:**
1. **Thiết lập API:** Khai báo các Endpoint cung cấp dữ liệu (Push/Pull).
2. **Cấu hình bảo mật:** Thiết lập phương thức xác thực (Token, IP,...) và các giới hạn về băng thông (Rate Limiting).
3. **Kiểm thử:** Thực hiện test kết nối và hiệu năng API.
4. **Vận hành:** Kích hoạt API và thực hiện giám sát nhật ký truy cập theo thời gian thực.

### 2.7. Quản trị & vận hành (Admin Operations)
Sơ đồ các hoạt động quản trị hệ thống:

![Luồng Quản trị](flowdata/admin_flow_1773297990651.png)

#### Mã Mermaid tham chiếu:
```mermaid
graph TD
    Start([Bắt đầu]) --> Login[Cán bộ Quản trị đăng nhập]
    Login --> Choice{Chọn tác vụ}
    
    Choice --> UserMgmt[Quản lý Người dùng/Phân quyền]
    Choice --> Config[Cấu hình hệ thống]
    Choice --> LogView[Theo dõi Nhật ký]
    Choice --> Stats[Xem Thống kê]
    
    UserMgmt --> Audit[Ghi nhật ký thao tác]
    Config --> Audit
```

**Mô tả quy trình:**
1. **Đăng nhập quản trị:** Tài khoản có quyền Admin truy cập vào phân hệ quản trị.
2. **Lựa chọn tác vụ:** Thực hiện các chức năng cốt lõi như Phân quyền, Cấu hình thông số hệ thống, hoặc Giám sát nhật ký hoạt động.
3. **Kiểm soát (Audit):** Mọi thao tác thay đổi cấu hình hoặc người dùng đều được hệ thống ghi nhật ký Audit Log để phục vụ hậu kiểm.
