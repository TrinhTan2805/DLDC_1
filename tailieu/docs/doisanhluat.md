# Đối Sánh Kho DLDC Với Khung Pháp Lý Về Dữ Liệu & An Ninh Mạng (2024-2025)

> [!NOTE]
> Tài liệu này phân tích mức độ đáp ứng của hệ thống **Kho Dữ liệu dùng chung (Kho DLDC)** hiện tại so với 3 đạo luật quan trọng mới nhất: **Luật Dữ liệu 2024**, **Luật Bảo vệ Dữ liệu cá nhân 2025**, và **Luật An ninh mạng 2025**. Từ đó đưa ra các đề xuất nâng cấp chức năng và quy trình để đảm bảo tuân thủ pháp luật.

---

## 1. Đối sánh dự án hiện tại và Đề xuất sửa đổi, bổ sung chức năng

Dựa trên cấu trúc chức năng hiện tại của Kho DLDC (Thu thập, Xử lý, Cung cấp, Dữ liệu mở, Dữ liệu chủ, Nhật ký truy cập...), dưới đây là đối sánh và đề xuất các chức năng cần bổ sung:

### A. Đối sánh với Luật Dữ liệu 2024
*Luật chuyên biệt quy định về quản trị, chia sẻ, phân loại và kết nối Trung tâm Dữ liệu quốc gia.*

| Chức năng hiện tại | Đánh giá mức độ đáp ứng | Chức năng cần Sửa đổi / Bổ sung |
| :--- | :--- | :--- |
| **Quản lý danh mục & Dữ liệu chủ** | Đang lưu trữ và phân nhóm tĩnh theo nghiệp vụ (Dữ liệu Hộ tịch, Bản án, Trẻ em...) | **[BỔ SUNG] Chức năng Phân loại & Gắn nhãn dữ liệu theo luật định:** Cần tính năng cho phép admin gắn nhãn tập dữ liệu là *"Dữ liệu quan trọng"*, *"Dữ liệu cốt lõi"*, hoặc *"Dữ liệu thông thường"*. Áp dụng quy tắc kiểm soát truy cập riêng cho từng nhãn. |
| **Cung cấp dữ liệu (API Management)** | Đã có quản lý API, đối soát cấp phát dữ liệu. | **[SỬA ĐỔI] Tích hợp với Trung tâm Dữ liệu quốc gia:** Cổng API cần chuẩn hóa theo tiêu chuẩn kết nối của cơ sở dữ liệu tổng hợp quốc gia. Cần module **Quản trị Hợp đồng/Thỏa thuận chia sẻ dữ liệu** để số hóa các cam kết chia sẻ. |
| **Dữ liệu mở (Open Data)** | Đã có Cổng dữ liệu mở (Portal), danh sách công bố. | **[BỔ SUNG] Quy trình đánh giá rủi ro trước khi công bố:** Thêm bước/workflow thẩm định và phê duyệt (Maker-Checker) mức độ an toàn và không vi phạm bí mật quốc gia trước khi đẩy dữ liệu lên Portal. |

### B. Đối sánh với Luật Bảo vệ Dữ liệu cá nhân 2025
*Quy định chặt chẽ về quyền của chủ thể dữ liệu (người dân) và nghĩa vụ của Bên Kiểm soát/Xử lý dữ liệu.*

| Chức năng hiện tại | Đánh giá mức độ đáp ứng | Chức năng cần Sửa đổi / Bổ sung |
| :--- | :--- | :--- |
| **Thu thập dữ liệu (Collection)** | Chủ yếu thu thập tự động/đồng bộ từ các CSDL nguồn (Bộ ngành, địa phương). Chưa có tracking sự đồng ý. | **[BỔ SUNG] Module Quản lý sự đồng ý (Consent Management):** Ghi nhận trạng thái "Đã đồng ý" hoặc "Miễn trừ đồng ý" theo luật pháp đối với các bản ghi dữ liệu cá nhân (ví dụ: dữ liệu trẻ em, người có công). |
| **Xử lý dữ liệu (Processing)** | Các tính năng xử lý, làm sạch, mapping, và điều phối dữ liệu. | **[BỔ SUNG] Chức năng Ẩn danh & Khử định danh (Anonymization/Pseudonymization):** Công cụ tự động mã hóa hoặc che giấu thông tin định danh (Tên, CCCD, SDT) trước khi đưa vào kho Dữ liệu dùng chung hoặc trước khi xuất báo cáo/cung cấp cho bên thứ 3. |
| *(Chưa có)* | Hệ thống chưa có cổng tiếp nhận yêu cầu từ người dân (Chủ thể dữ liệu). | **[BỔ SUNG] Cổng tự phục vụ Quyền Chủ thể dữ liệu (Data Subject Rights Portal):** Phân hệ cho phép cá nhân tra cứu xem dữ liệu của mình đang được lưu trữ thế nào, gửi yêu cầu chỉnh sửa, hoặc xóa dữ liệu (nếu pháp luật cho phép). |

### C. Đối sánh với Luật An ninh mạng 2025
*Yêu cầu cao về bảo vệ hệ thống thông tin, ứng cứu sự cố và kiểm soát truy cập.*

| Chức năng hiện tại | Đánh giá mức độ đáp ứng | Chức năng cần Sửa đổi / Bổ sung |
| :--- | :--- | :--- |
| **Quản trị & Nhật ký (Logs)** | Đã có Nhật ký đăng nhập, truy cập, lỗi, thay đổi cấu hình, quản lý tài khoản. | **[SỬA ĐỔI] Nhật ký chống chối bỏ & Toàn vẹn:** Nâng cấp cấu trúc log bằng cách mã hóa hoặc băm (hashing) các bản ghi log để chống giả mạo (Tamper-proof logs). Tích hợp khả năng đẩy log thời gian thực tới hệ thống SIEM/SOC của Bộ/Quốc gia. |
| **Thiết lập cấu hình hệ thống** | Cấu hình bảo mật cơ bản, giới hạn truy cập. | **[BỔ SUNG] Báo cáo Sự cố An ninh mạng tự động:** Module tạo mẫu báo cáo nhanh và quy trình gửi thông báo khẩn cấp đến Cục An ninh mạng (A05) khi phát hiện dấu hiệu rò rỉ hoặc tấn công. |

---

## 2. Những điểm cần lưu ý của các Luật này đối với Kho DLDC

> [!WARNING]
> Các rủi ro pháp lý nếu không tuân thủ có thể dẫn đến việc hệ thống bị đình chỉ kết nối hoặc người đứng đầu phải chịu trách nhiệm trước pháp luật.

1. **Ranh giới giữa "Dữ liệu Bộ ngành" và "Dữ liệu Quốc gia":** Luật Dữ liệu 2024 quy định Kho DLDC của Bộ Tư pháp phải đóng vai trò là "vệ tinh" của Trung tâm Dữ liệu quốc gia. Mọi siêu dữ liệu (metadata) về danh mục dữ liệu chủ của Bộ phải được đăng ký và đồng bộ chuẩn xác.
2. **Quy định về Dữ liệu Đặc biệt nhạy cảm:** Trong Kho DLDC có chứa dữ liệu về *Hộ tịch, Bản án, Trẻ em, HIV, và Người có công*. Theo Luật BV DLCN 2025, đây thuộc nhóm **dữ liệu cá nhân nhạy cảm**. Việc khai thác/chia sẻ nhóm này phải qua lớp mã hóa bắt buộc (encryption at rest & in transit) và ghi log truy cập đến cấp độ trường dữ liệu (field-level).
3. **Phân quyền và Trách nhiệm (Luật An ninh mạng):** Bất kỳ ai xuất (export) hoặc truy cập dữ liệu với số lượng lớn thông qua API cung cấp dữ liệu đều phải được định danh xác thực mạnh (MFA/eID). Kho DLDC phải có cơ chế **phát hiện truy cập bất thường** (Ví dụ: một account tải xuống hàng ngàn bản ghi bản án trong đêm).
4. **Chia sẻ cho tổ chức bên ngoài:** Khi Cung cấp dữ liệu (Provisioning) cho khối tư nhân hoặc bên ngoài cơ quan nhà nước, cần có hệ thống Hợp đồng dữ liệu số thông minh (Smart Data Contracts) để quy định rõ mục đích sử dụng, tránh việc dữ liệu bị đem bán lại trái phép.

---

## 3. Các mục CẦN BẮT BUỘC phải thực hiện ngay

Dưới đây là các yêu cầu "Hard Compliance" (Tuân thủ bắt buộc) mà dự án phải có trước khi các Luật có hiệu lực đầy đủ:

> [!IMPORTANT]
> **Checklist Bắt Buộc Tuân Thủ**
> 1. **Mã hóa dữ liệu tại chỗ (Encryption at Rest):** Bắt buộc mã hóa toàn bộ cơ sở dữ liệu lưu trữ các danh mục chứa dữ liệu cá nhân nhạy cảm (Hộ tịch, Trẻ em, Người khuyết tật...).
> 2. **Hệ thống Nhật ký (Audit Logs) chuẩn bảo mật:** Nhật ký truy cập hệ thống phải lưu trữ **tối thiểu 1-2 năm** (tùy cấp độ hệ thống theo phân cấp an toàn thông tin). Không ai, kể cả Admin hệ thống, được quyền xóa hay sửa log.
> 3. **Phân loại dữ liệu (Data Classification Tool):** Bắt buộc phải có cờ (flag) hoặc thẻ (tag) đánh dấu "Dữ liệu nhạy cảm", "Dữ liệu cốt lõi" đối với từng tập dữ liệu trong hệ thống Quản lý danh mục.
> 4. **Xóa/Ẩn danh dữ liệu tự động (Data Masking):** Bắt buộc che giấu một phần thông tin cá nhân (ví dụ: CMND/CCCD hiển thị `0300****1234`) trên các giao diện xem trước (Eye view) hoặc khi chia sẻ Dữ liệu Mở.
> 5. **Chính sách Quyền riêng tư (Privacy Policy Notice):** Cập nhật trên giao diện phần mềm các điều khoản về thu thập, sử dụng dữ liệu theo chuẩn mới, yêu cầu người dùng nội bộ/ngoài ngành xác nhận trước khi tiếp cận Kho DLDC.
