# Thiết kế chức năng Hợp nhất dữ liệu (JOIN / UNION)

> Phân hệ: **Xử lý dữ liệu** · Ngày lập: 28/10/2026 · Trạng thái: **Đề xuất – chờ duyệt**
> Mục đích tài liệu: thống nhất luồng nghiệp vụ, giao diện đã chốt và các lưu ý kỹ thuật để trình bày với dev.

---

## 1. Bối cảnh và mục tiêu

**Hiện tại:** sau khi tích hợp (thu thập), mỗi **bộ dữ liệu** (VD Khai sinh, Kết hôn của CSDL Hộ tịch điện tử) được xử lý **riêng** tại màn Xử lý dữ liệu: ánh xạ → làm sạch → chuẩn hóa → biến đổi → ghi vào **một** bảng CSDL đích. Quan hệ là **1 bộ dữ liệu → 1 bảng đích**.

**Cần bổ sung:** gộp **nhiều** bộ dữ liệu (có thể khác CSDL nguồn, khác hệ thống, trong ngành và ngoài ngành) vào **cùng một bảng** CSDL đích bằng **một loại kết hợp cho mỗi cấu hình**: **Join** (bảng chính + các bảng nối, kiểu nối *Left / Inner / Full Join*) hoặc **Union** (gộp dòng, *Union* / *Union All*). Hai loại:

| Kiểu | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| **UNION – Nối hàng** | Các nguồn có **cùng loại bản ghi**, xếp chồng bản ghi vào một bảng | Khai sinh (Hộ tịch điện tử) + Khai sinh (hệ thống tỉnh) → `HS_KHAI_SINH` |
| **JOIN – Ghép cột theo khóa** | Các nguồn mô tả **cùng đối tượng**, mỗi nguồn bổ sung một số trường, ghép theo khóa | Công dân (CSDL QG Dân cư) + Người tham gia BHXH (CSDL Bảo hiểm), ghép theo CCCD → `DIP_PERSON` |

---

## 2. Nguyên tắc thiết kế (bắt buộc)

1. **Chức năng mới, tách biệt hoàn toàn.** Toàn bộ code nằm trong thư mục mới `src/components/pages/processing/merge/`. Không sửa logic các màn cũ (Thu thập, Xử lý dữ liệu theo bộ dữ liệu, Quản lý CSDL đích). Chỉ thêm **1 mục menu** + **khai báo route**. Nếu không duyệt, gỡ 2 điểm gắn này là hệ thống trở về như cũ.
2. **Đọc dữ liệu thu thập gốc, không dùng kết quả của Xử lý dữ liệu cũ.** Chức năng Xử lý dữ liệu hiện có xử lý xong là **ghi thẳng vào bảng đích**, nên không thể làm đầu vào cho hợp nhất. Mỗi cấu hình hợp nhất **tự khai báo quy tắc làm sạch / chuẩn hóa / biến đổi cho từng nguồn** (bước ③ của wizard).
3. **Ghi vào bảng đích đúng 1 lần.** Dữ liệu từng nguồn sau khi xử lý nằm ở **vùng tạm do hệ thống quản lý** (người dùng không cấu hình). Hợp nhất xong mới ghi bảng đích.
4. **Xử lý từng nguồn trước, hợp nhất sau** (xem mục 6).
5. **Ánh xạ lấy từ kết quả kết hợp**: mỗi cột đích lấy *theo cột*, *theo độ ưu tiên* (cột đầu tiên có dữ liệu) hoặc *giá trị cố định*. Nguồn gốc mỗi cột xem được ngay trong cấu hình ánh xạ.
6. **UI tuân thủ bộ quy chuẩn** `compomennt1.md` và bộ class dùng chung `collectionUi.tsx` (BTN_*, INPUT_CLS, Badge, TruncatedText, RowIconAction, Pagination, tabClass, TABLE_*), `ConfirmModal`, `toast` (sonner). Không dùng `alert()` / `confirm()`.

---

## 3. Luồng tổng thể

```
Thu thập (tích hợp)
  └─ CSDL nguồn ─► Bộ dữ liệu – DỮ LIỆU THU THẬP GỐC (Khai sinh, Công dân, …)
                       │
        ┌──────────────┴──────────────────────────┐
        ▼                                         ▼
Xử lý dữ liệu (màn cũ – giữ nguyên)     HỢP NHẤT DỮ LIỆU (chức năng mới), cho từng nguồn:
  quy tắc riêng ─► ghi thẳng              Làm sạch ─► Chuẩn hóa ─► Biến đổi
  1 bảng đích                               (quy tắc lưu trong cấu hình hợp nhất)
                                                   │
                                                   ▼
                                         VÙNG TẠM của từng nguồn (hệ thống tự quản lý)
                                                   │
                                                   ▼
                                         JOIN (bảng chính + bảng nối) hoặc UNION ─► Bảng tạm hợp nhất (+ cột truy vết)
                                                   ─► Ánh xạ cột đích · khóa chính · luật trùng khóa · cột bắt buộc
                                                   ─► Ghi BẢNG ĐÍCH (1 giao dịch)
```

---

## 4. Giao diện đã chốt

### 4.1. Menu

```
Xử lý dữ liệu
 ├─ Tổng quan xử lý dữ liệu
 ├─ CSDL Trong ngành ›
 ├─ CSDL Ngoài ngành ›
 └─ Hợp nhất dữ liệu        ← MỚI (1 mục, không có menu con)
```

Phân biệt trong ngành / ngoài ngành bằng **cột "Loại nguồn"** trên danh sách (không tách menu).

### 4.2. Màn 1 – Danh sách cấu hình hợp nhất

- **Thẻ thống kê (4):** Tổng số cấu hình · Đang hoạt động · Bản nháp · Cần cấu hình lại.
- **Thanh công cụ:** ô tìm kiếm (Enter / nút Tìm kiếm mới lọc) → nút Tìm kiếm (#10B981) → nút Bộ lọc → **Thêm mới**.
- **Bộ lọc:** Loại nguồn · Kiểu (JOIN / UNION) · CSDL đích · Trạng thái.
- **Cột Kiểu:** `JOIN` hoặc `UNION` (mỗi cấu hình 1 loại).
- **Bảng:**

| STT | Tên / Mã cấu hình | Loại nguồn | Kiểu | CSDL / Bảng đích | Người tạo / Ngày tạo | Trạng thái | Dữ liệu đích | Thao tác |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |

- Thứ tự cột theo màn *Thiết lập thu thập*. **Dữ liệu đích** = số bản ghi + kết quả lần chạy gần nhất (rê chuột xem thời gian chạy).

- **Loại nguồn** hệ thống **tự tính** từ các nguồn đã chọn: *Trong ngành* (tất cả nguồn trong ngành) · *Ngoài ngành* · *Kết hợp* (có cả hai).
- **Cột Thao tác:** Xem chi tiết · ▶ *Chuyển đổi dữ liệu* (chưa có dữ liệu) / ⟳ *Cập nhật dữ liệu* (đã có dữ liệu) · menu `⋯` (Chỉnh sửa · Thêm lịch biểu · Xóa dữ liệu · **Xóa cấu hình** – đỏ). Mục / nút bị khóa thì xám, rê chuột hiện lý do. Quy tắc bật / khóa: mục 7.12.

### 4.3. Màn 2 – Thêm mới / Chỉnh sửa (wizard 6 bước, modal cao cố định)

| Bước | Nội dung |
| :--- | :--- |
| **① Thông tin chung** | Tên, mã, mô tả. **Không chọn loại kết hợp ở đây** – chọn ở bước ④ |
| **② Chọn nguồn** | Danh sách **bộ dữ liệu** (tất cả CSDL nguồn), cột *Loại nguồn*, *CSDL nguồn*, **Khóa nguồn** (căn cứ cập nhật; không có khóa → chọn trường khóa ngay trên dòng, chưa chọn thì không đi tiếp), *Số bản ghi*, *Thu thập gần nhất*. Chọn ≥ 2 nguồn. Bộ dữ liệu đang ghi trực tiếp vào bảng đích khác → cảnh báo |
| **③ Xử lý nguồn** | Chọn nguồn → 3 tab **Làm sạch · Chuẩn hóa · Biến đổi**, bố cục giống màn Xử lý dữ liệu. Trường áp dụng lấy đúng trường của nguồn. Không có quy tắc = dùng dữ liệu thu thập nguyên trạng (xem 5.5) |
| **④ Kết hợp** | **Loại kết hợp**: *Join – nối thông tin* / *Union – gộp dòng* (đổi loại khi đã nhập → hỏi xác nhận, xóa phần kết hợp, lọc, ánh xạ). **Join:** *Bảng chính* + bảng **Bảng nối thêm** – mỗi bảng nối 1 dòng: *Kiểu nối* · *Bảng* · *Điều kiện ghép* (tóm tắt dạng câu lệnh); bấm ✎ mở phần sửa ngay dưới dòng (điều kiện, chuẩn hóa, 1 khớp nhiều); hệ thống tạo sẵn 1 dòng cho mỗi nguồn còn lại; nút *Gợi ý điều kiện*. **Union:** *Dòng trùng hoàn toàn* (Giữ tất cả – Union All / Chỉ giữ 1 dòng – Union) + **1 bảng Ghép cột**: mỗi nguồn là 1 cột, nút *Tự khớp theo tên*. Cả hai: **1 bộ Điều kiện lọc (WHERE)** chung (bảng chỉ hiện khi đã thêm điều kiện). Xem 5.1 |
| **⑤ Bảng đích & ánh xạ** | Chọn CSDL đích → **bảng có sẵn** hoặc **tạo bảng mới**. **1 bảng chung** cho cấu trúc và ánh xạ, mỗi cột đích 1 dòng: *Cột đích* · *Kiểu dữ liệu* · *Cho phép trống* · *Khóa chính* · **Cách lấy** (*Theo cột / Theo độ ưu tiên / Giá trị cố định*; dòng khóa chính: *Tự động / Theo cột* + cảnh báo) · **Giá trị nguồn** (ô chọn có gõ tìm, dạng `Bảng.Cột`). **Bảng có sẵn:** tên / kiểu / trống / khóa chỉ xem, **ánh xạ thủ công**. **Bảng mới:** hệ thống **tự tạo cột theo kết quả kết hợp và ánh xạ sẵn**; sau đó không tự ánh xạ nữa – cột thêm / đổi thì chọn tay; sửa tên / kiểu / trống / khóa (đúng 1 cột), thêm / xóa dòng; nút *Tạo lại cột theo kết quả kết hợp* (hỏi xác nhận, tạo lại cả cột và ánh xạ). Đổi CSDL / bảng / chế độ khi đã ánh xạ → hỏi xác nhận. Khối **Khi trùng khóa chính** (khi khóa theo cột). Bảng không có khóa chính → chặn. Xem 5.2 – 5.4 |
| **⑥ Xem lại & lưu** | Tóm tắt: thông tin chung, khóa chính, luật trùng khóa, phần kết hợp (dạng câu lệnh), nguồn + khóa nguồn + quy tắc, ánh xạ → **Lưu nháp** / **Lưu và kích hoạt**. Lịch chạy đặt bằng nút *Thêm lịch biểu* |

### 4.4. Màn 3 – Chi tiết cấu hình

Thanh nút đầu trang (theo bộ nút màn Xử lý dữ liệu, bỏ nút *Hoàn thành cấu hình* vì wizard đã có *Lưu và kích hoạt*): **Chỉnh sửa** · ▶ **Chuyển đổi dữ liệu** · ⟳ **Cập nhật dữ liệu** · 🗑 **Xóa dữ liệu** · ⏰ **Thêm lịch biểu** (dùng lại popup lập lịch `ScheduleManagementModal` của màn Xử lý dữ liệu). Nút không dùng được thì mờ, rê chuột hiện lý do.

Tabs: **Tổng quan** (thông tin chung kèm loại kết hợp, khóa chính, luật trùng khóa; bảng **Kết hợp** – Join: bảng chính + từng bảng nối · kiểu nối · điều kiện ghép · 1 khớp nhiều, Union: ghép cột theo từng nguồn; điều kiện lọc; danh sách nguồn kèm khóa nguồn, số bản ghi, lần chạy gần nhất) · **Xử lý nguồn** (quy tắc của từng nguồn, chỉ đọc) · **Ánh xạ** (cột đích · kiểu · cho phép trống · cách lấy · giá trị nguồn, chỉ đọc) · **Dữ liệu đích** (dữ liệu lần chạy gần nhất kèm cột `DIP_RefId`, `DIP_SourceRefs` + danh sách bản ghi nguồn không ghép được) · **Lịch sử chạy** (theo tab Lịch sử của màn Xử lý dữ liệu: tìm kiếm; bảng STT · Mã yêu cầu · Loại – Chuyển đổi / Cập nhật / Xóa dữ liệu · Người tạo · Thời gian · Thời gian xử lý · Trạng thái · Xem chi tiết; popup *Xem chi tiết lịch sử hoạt động* 2 cột: mã yêu cầu, cấu hình, bảng đích, loại, trạng thái, mã lỗi, người tạo, thời gian khởi tạo / bắt đầu / hoàn thành / xử lý + số bản ghi thêm / sửa / xóa / không ghép được theo nguồn).

---

## 5. Quy định nghiệp vụ

### 5.1. Kết hợp (bước ④)

Mỗi cấu hình chọn **1 loại kết hợp**:

| Loại | Kiểu | Hành vi | Cấu hình |
| :--- | :--- | :--- | :--- |
| **Join – nối thông tin** | **Left Join** | Giữ toàn bộ dòng phía trên (bảng chính và các bảng đã nối); bảng nối không khớp thì cột của nó trống | Bảng chính + mỗi bảng nối: kiểu nối, điều kiện ghép (ON) |
| | **Inner Join** | Chỉ giữ dòng khớp | |
| | **Full Join** | Giữ dòng của cả 2 phía; dòng chỉ có 1 phía thì cột phía kia trống | |
| **Union – gộp dòng** | **Union All** | Xếp dòng các nguồn vào chung 1 bảng, giữ tất cả | Ghép cột |
| | **Union** | Như trên, bỏ dòng trùng hoàn toàn | |

- **Join – Bảng chính và Bảng nối thêm:** đọc như câu lệnh `Bảng chính LEFT JOIN B ON … LEFT JOIN C ON …`. Không còn khái niệm *phép 1, phép 2* hay *Kết quả phép n*. Vế trái của điều kiện chọn được cột của **bảng chính và mọi bảng nối phía trên**; vế phải là cột của bảng đang nối (hoặc giá trị). Mỗi nguồn đã chọn phải là bảng chính hoặc 1 bảng nối. Không có Right Join (đổi bảng chính).
- **Điều kiện ghép (ON)** – mỗi dòng: *Cột* · *Điều kiện* (= <> > >= < <=) · *So với* (**Cột bảng nối** hoặc **Giá trị**) · cột / giá trị · *Chuẩn hóa khi so sánh*. Nối bằng **AND**. Bắt buộc ≥ 1 điều kiện **cột = cột**. Khác kiểu dữ liệu → cảnh báo. Kèm *Khi 1 dòng khớp nhiều dòng* cho từng bảng nối. Dòng bảng nối đã đủ điều kiện thì thu gọn thành 1 dòng tóm tắt; thiếu / lỗi thì tự mở.
- **Lưu ý Left / Full Join:** điều kiện trên cột của bảng nối (VD `BHXH.TRANG_THAI = 1`) đặt ở **ON** thì vẫn giữ dòng phía trên không khớp; đặt ở **WHERE** sẽ làm mất các dòng đó. Giao diện có ghi chú nhắc.
- **Union – Ghép cột:** 1 bảng duy nhất, mỗi dòng: *Cột kết quả* (tên) + **1 cột chọn cho mỗi nguồn** (có thể *Để trống* = NULL). *Tự khớp theo tên* lấy các trường của nguồn đầu, mỗi nguồn khác ghép trường cùng tên (mỗi trường dùng 1 lần). Tên cột kết quả không trùng; mỗi cột kết quả lấy từ ít nhất 1 nguồn. Cột kết quả hiển thị ở các bước sau dạng `Gộp.TEN_COT`.
- **Điều kiện lọc (WHERE)** – **1 bộ chung**, lọc trên kết quả kết hợp. Mỗi dòng: *Cột* · *Điều kiện* (=, <>, >, >=, <, <=, Chứa, Thuộc danh sách, Rỗng, Không rỗng) · *Giá trị*; nối bằng AND.
- **Không hỗ trợ:** trộn Union và Join trong 1 cấu hình (mục 11 câu 9), gom nhóm / đếm (GROUP BY, COUNT – làm mất định danh từng bản ghi, nên làm ở tầng báo cáo), sắp xếp (ORDER BY), điều kiện HOẶC / nhóm ngoặc, so khớp gần đúng.
- **Không ghép được:** đếm và lưu danh sách theo nguồn; không âm thầm bỏ bản ghi.

### 5.2. Ánh xạ trường (bước ⑤)

| Cách lấy | Ý nghĩa |
| :--- | :--- |
| **Theo cột** | 1 cột của kết quả kết hợp, chọn trong danh sách có gõ tìm (`Bảng.Cột`) |
| **Theo độ ưu tiên** | Nhiều cột có thứ tự (thêm / lên / bỏ); lấy cột đầu tiên **có dữ liệu** – rỗng (NULL), chuỗi rỗng hoặc chỉ khoảng trắng là *không có dữ liệu* |
| **Giá trị cố định** | Hằng số cho mọi dòng (VD loại đối tượng `Khách hàng`) |

- **Ánh xạ tự động chỉ khi hệ thống tạo bảng mới** (lúc chọn *Tạo bảng mới* lần đầu hoặc bấm *Tạo lại cột theo kết quả kết hợp*): mỗi tên cột kết quả tạo 1 cột đích, khớp tên (bỏ dấu, hoa thường, gạch dưới + nhóm đồng nghĩa như CCCD / SO_DINH_DANH) thì gộp vào 1 cột *Theo độ ưu tiên* theo thứ tự bảng chính → bảng nối. Cột đã tạo xong thì không tự ánh xạ lại.
- **Bảng có sẵn: ánh xạ thủ công**, không có nút tự động (tránh ghép nhầm theo tên vào bảng đang dùng).
- Không có giá trị dự phòng cuối danh sách ưu tiên (đã chốt).

### 5.3. Khóa chính bảng đích và trùng khóa

- Dòng khóa chính: **Tự động** (hệ thống sinh) hoặc **Theo cột** (chọn mọi cột kết quả). Khóa chính luôn không trống, không trùng.
- Cảnh báo khi chọn theo cột: cột **không phải khóa nguồn** (có thể đổi / trùng) · cấu hình có **Union / Full Join** (dễ trùng / trống, nên dùng Tự động) · cột có thể trống do kiểu nối.
- **Khi trùng khóa chính** (chỉ khi khóa theo cột; áp cho trùng trong cùng lần chạy và trùng với dòng đã có trong đích):

| Lựa chọn | Hành vi |
| :--- | :--- |
| Giữ dòng cũ | Dòng đã có giữ nguyên, dòng sau bỏ qua |
| Cập nhật theo dòng mới nhất | Giữ dòng có **cột căn cứ thời gian** (của dữ liệu, chọn cột ngày) mới hơn; cùng thời gian thì theo thứ tự nguồn – không dùng thứ tự đọc để chạy lại luôn cùng kết quả |
| Ưu tiên theo nguồn | Nguồn xếp trên thắng (sắp thứ tự nguồn) |
| Báo lỗi, không ghi | Các dòng trùng vào danh sách lỗi |

- Dòng không được chọn vẫn giữ ở vùng tạm; dòng đang giữ bị xóa ở nguồn → dòng kế tiếp được lấy lên thay. Luật này thay cho phần *Chống trùng* của UNION trước đây.

### 5.4. Cho phép trống

| Cột đích | Kết quả trống | Xử lý |
| :--- | :--- | :--- |
| Cho phép trống | Có | Ghi dòng, cột để trống |
| Không cho phép trống | Có | **Không ghi dòng**, vào danh sách lỗi *Thiếu giá trị bắt buộc* (kèm khóa nguồn) |
| Khóa chính | Trống / trùng | Không ghi dòng (trùng → theo luật 5.3) |

- Ràng buộc nằm ở cấu trúc bảng đích (bảng có sẵn: đọc từ CSDL; bảng mới: tích ở bước ⑤).
- Kiểm tra khi cấu hình: cột không cho phép trống **chưa ánh xạ → chặn**; chỉ lấy từ cột có thể trống (bảng nối Left / Full Join) → **cảnh báo**.
- Dòng đã có trong đích, sau cập nhật cột bắt buộc thành trống → **xóa hẳn dòng** (nguồn đã không còn dữ liệu – đã chốt).
- Lịch sử chạy ghi số *dòng bị loại do thiếu giá trị bắt buộc*.

### 5.5. Quy tắc xử lý nguồn (bước ③)

| Nhóm | Loại quy tắc (giống màn Xử lý dữ liệu) | Ô nhập |
| :--- | :--- | :--- |
| Làm sạch | Kiểm tra quy tắc về chuẩn định dạng | Trường · Quy tắc định dạng (CCCD / Email / SĐT / ngày) · Xử lý ngoại lệ |
| Làm sạch | Kiểm tra tính hợp lệ của dữ liệu | Trường · Điều kiện hợp lệ · Giá trị kiểm tra · Xử lý ngoại lệ |
| Làm sạch | Xử lý, thay thế giá trị, thiếu dữ liệu | Trường · Điều kiện (Rỗng / Bằng / Bắt đầu / Kết thúc / Bao gồm) · Giá trị nguồn · Giá trị thay thế |
| Chuẩn hóa | Kiểm tra đối sánh tồn tại dựa trên trường khóa | Trường khóa · Xử lý (giữ mới nhất / cũ nhất / từ chối) · Cột căn cứ sắp xếp |
| Chuẩn hóa | Xử lý vi phạm ràng buộc tham chiếu | Trường · Danh mục tham chiếu · Hành động · Giá trị mặc định |
| Biến đổi | Biến đổi định dạng dữ liệu | Trường · Kiểu dữ liệu · Thông tin chuyển đổi |

- Thứ tự chạy trong 1 nguồn: Làm sạch → Chuẩn hóa → Biến đổi.
- Lọc bản ghi: dùng *Kiểm tra tính hợp lệ của dữ liệu* với *Xử lý ngoại lệ = Loại bỏ bản ghi lỗi* (VD bỏ bản ghi có CCCD rỗng, ngày đăng ký trước 2016).
- Bản ghi bị loại bởi quy tắc → vào danh sách lỗi **theo nguồn** của lần chạy (không ảnh hưởng nguồn khác).
- Quy tắc lưu trong cấu hình hợp nhất (`MergeSourceRef.rules`), **không dùng chung** với Xử lý dữ liệu.

---

## 6. Thứ tự áp dụng quy tắc

| Loại quy tắc | Áp ở | Lý do |
| :--- | :--- | :--- |
| Làm sạch (định dạng, giá trị thiếu, giá trị hợp lệ) | **Từng nguồn** (bước ③ của wizard) | Lỗi gắn với nguồn, gửi được về hệ thống nguồn |
| Chuẩn hóa (tham chiếu danh mục, ánh xạ giá trị) | **Từng nguồn** | Bắt buộc trước khi ghép khóa / chống trùng |
| Biến đổi chỉ dùng trường của 1 nguồn | **Từng nguồn** | — |
| Biến đổi dùng trường của nhiều nguồn | **Sau hợp nhất** | Trước khi gộp chưa đủ dữ liệu |
| Trùng khóa chính / xung đột | **Khi ghi đích** (luật 5.3) | So sánh giữa các nguồn |
| Kiểm tra hợp lệ cuối theo bảng đích | **Sau hợp nhất** | Ràng buộc của bảng đích |
| Phân loại dữ liệu | **Sau hợp nhất** | Gắn theo cột bảng đích |

---

## 7. Cơ chế cập nhật dữ liệu

> Mục tiêu: sau lần chạy đầu, mỗi lần nguồn thay đổi chỉ xử lý **đúng phần bị ảnh hưởng**; chỉ dựng lại toàn bảng khi không còn cách nào khác (mục 7.8). Chạy lại bao nhiêu lần cũng cho cùng kết quả (idempotent).

### 7.1. Ba loại khóa – căn cứ cập nhật

| Loại | Ví dụ | Vai trò |
| :--- | :--- | :--- |
| **Khóa ghép** (điều kiện join) | `CCCD` | Chỉ để **tìm cặp** khi ghép. Có thể đổi, trùng, rỗng |
| **Khóa nguồn** (khóa chính từng bộ dữ liệu) | `Công dân.ID_CD`, `BHXH.MA_HO_SO`, `Khai sinh.SO_DANG_KY` | **Căn cứ cập nhật** – biết dòng đích đến từ bản ghi nguồn nào |
| **Khóa chính bảng đích** | `DIP_PERSON.ID` | Ràng buộc của bảng đích: tự động, hoặc theo 1 cột kết quả (5.3) |

- Mọi bộ dữ liệu nguồn **bắt buộc có khóa nguồn** (khóa chính, hoặc người dùng chỉ định ở bước ②). Không có khóa thì không có căn cứ cập nhật.
- **Định danh dòng:** Join (Left / Inner) giữ định danh dòng của **bảng chính**; Full Join định danh = khóa của **cả 2 phía** (dòng 1 phía thì phía kia trống; khi tìm được cặp thì gộp vào chính dòng đó, giữ khóa đích); Union giữ (nguồn, khóa) của nguồn sinh ra dòng. `DIP_RefId` = khóa bản ghi nguồn tạo ra dòng; bản ghi nguồn khác ghép vào dòng nào thì ghi ở bảng liên kết (7.2).
- Union: căn cứ = (`DIP_SourceId`, `DIP_RefId`) – hai nguồn trùng ID vẫn không lẫn.
- **Khóa chính bảng đích không được là khóa ghép** (CCCD): sửa CCCD sẽ đổi khóa dòng, làm hỏng các hệ thống đang tham chiếu.
- Khóa chính *theo cột* chỉ an toàn khi cột đó là khóa nguồn **ổn định** (không sinh lại khi nạp lại toàn bộ); giao diện cảnh báo các trường hợp khác (5.3).

### 7.2. Dữ liệu lưu vết (backend)

| Nơi lưu | Nội dung | Chỉ mục cần có |
| :--- | :--- | :--- |
| **Vùng tạm từng nguồn** (`stg_<cấu hình>_<nguồn>`) | Bản ghi nguồn **sau quy tắc xử lý** (bước ③): khóa nguồn, khóa ghép **đã chuẩn hóa**, các trường được ánh xạ, `DIP_Hash`, `DIP_Deleted`, `DIP_BatchId`, trạng thái hợp lệ | (khóa nguồn) duy nhất; (khóa ghép) |
| **Bảng liên kết** (`mrg_link`) – Join | (cấu hình, dòng đích, nguồn, khóa nguồn, giá trị khóa ghép, được chọn hay không) – thay cho cột `DIP_SourceRefs` dạng chuỗi | (nguồn, khóa nguồn); (dòng đích) |
| **Bảng đích** | Dữ liệu nghiệp vụ + `DIP_SourceId`, `DIP_RefId`, `DIP_SourceRefs` (hoặc bảng liên kết), `DIP_Hash`, `DIP_UpdatedAt`, `DIP_BatchId`. Dòng bị xóa thì **xóa hẳn** (không đánh dấu) | (`DIP_SourceId`, `DIP_RefId`) duy nhất |
| **Mốc đọc nguồn** (`mrg_watermark`) | Mỗi (cấu hình, nguồn): vị trí đã đọc – LSN / thời điểm CDC, mã lô nạp lại toàn bộ | – |
| **Danh sách không ghép được / lỗi** | Bản ghi nguồn bổ sung không khớp, bản ghi bị quy tắc loại, kèm lý do, theo từng lần chạy | (cấu hình, lần chạy) |

- `DIP_Hash` = băm các trường được ánh xạ **sau xử lý** → bản ghi nguồn có sự kiện sửa nhưng giá trị sau xử lý không đổi thì bỏ qua, không ghi bảng đích.
- Khóa ghép lưu **giá trị đã chuẩn hóa** (theo tùy chọn chuẩn hóa ở điều kiện join) để tra nhanh và không phải chuẩn hóa lại.

### 7.3. Hai cơ chế cập nhật từ Thu thập (xét theo từng nguồn)

| Cơ chế của nguồn (do Thu thập quyết định) | Hợp nhất nhận được | Cách xử lý |
| :--- | :--- | :--- |
| **Theo dõi thay đổi** – DB có CDC, API có API cập nhật | Tập thay đổi: Thêm / Sửa / Xóa kèm khóa nguồn | Xử lý tăng dần (7.4 → 7.6) |
| **Nạp lại toàn bộ** – mỗi lần tích hợp xóa dữ liệu cũ, kéo về toàn bộ | Ảnh chụp đầy đủ mới | **Mặc định:** xóa phần dữ liệu **do nguồn đó cung cấp** rồi chạy lại nguồn đó (7.7). **Đề xuất tối ưu (chờ chốt – mục 11):** nếu khóa nguồn ổn định, so ảnh chụp mới với vùng tạm theo (khóa nguồn, `DIP_Hash`) để **tự suy ra tập thay đổi**, rồi xử lý tăng dần như nguồn có CDC |

- Một cấu hình có thể trộn nhiều cơ chế: mỗi nguồn xử lý theo cơ chế của nó trong cùng 1 lần chạy.
- Người dùng **không chọn cơ chế**: hệ thống tự biết từ phần Thu thập của từng nguồn. Giao diện chỉ có 1 nút **Cập nhật dữ liệu** dùng chung, hệ thống tự xử lý mỗi nguồn theo cơ chế của nó.
- Bấm **Cập nhật dữ liệu** khi nguồn không có thay đổi → vẫn chạy bình thường, kết quả *Thành công* với 0 thêm / 0 sửa / 0 xóa (giống hệ thống hiện tại).
- Nguồn nạp lại toàn bộ chỉ được đọc khi **lần tích hợp của nguồn đó đã hoàn tất** – không đọc lúc đang xóa / nạp dở (lịch *Sau khi nguồn cập nhật*, hoặc khóa đọc).

### 7.4. Trình tự một lần "Cập nhật dữ liệu"

1. **Khóa cấu hình** – các lần chạy cùng bảng đích xếp hàng.
2. **Đọc thay đổi** từng nguồn từ mốc đọc (7.2); nguồn nạp lại toàn bộ thì lấy ảnh chụp mới.
3. **Áp quy tắc xử lý nguồn** (bước ③) **chỉ cho bản ghi thay đổi** → cập nhật vùng tạm. Bản ghi bị quy tắc loại → vào danh sách lỗi và **coi như xóa** khỏi hợp nhất; trước đó bị loại nay hợp lệ → **coi như thêm**.
4. **Tính tập dòng đích bị ảnh hưởng** theo ma trận 7.5 (JOIN) / 7.6 (UNION).
5. **Tính lại riêng các dòng đó**: ghép lại (JOIN) hoặc tính lại nhóm trùng (UNION); so `DIP_Hash` để bỏ dòng không đổi.
6. **Ghi bảng đích + bảng liên kết trong 1 giao dịch**; thành công mới **dời mốc đọc**. Lỗi giữa chừng → hoàn tác, mốc giữ nguyên → chạy lại an toàn.
7. **Ghi Lịch sử chạy**: số thêm / sửa / xóa / không ghép được theo nguồn.

Thứ tự trong 1 lần chạy: **bảng chính trước, rồi các bảng nối theo thứ tự**; nhiều sự kiện trên cùng 1 khóa nguồn thì chỉ lấy trạng thái cuối (theo LSN / thời điểm).

### 7.5. Join – ma trận xử lý thay đổi

*Nguồn chính* = bảng chính tạo ra dòng; *nguồn bổ sung* = bảng nối ghép vào dòng.

| Thay đổi | Tìm dòng đích bị ảnh hưởng | Xử lý |
| :--- | :--- | :--- |
| **Nguồn chính – Thêm** | – | Thêm dòng đích mới, sinh khóa đích; tra từng nguồn bổ sung theo khóa ghép để điền cột. Bản ghi bổ sung đang nằm ở "không ghép được" mà nay khớp → gỡ khỏi danh sách |
| **Nguồn chính – Sửa trường thường** | `DIP_RefId` | Sửa các cột lấy từ nguồn chính |
| **Nguồn chính – Sửa khóa ghép** (VD CCCD) | `DIP_RefId` | Sửa cột + **ghép lại riêng dòng đó**: bỏ các bản ghi bổ sung theo khóa cũ (chúng thành "không ghép được" nếu không khớp dòng khác), điền theo khóa mới |
| **Nguồn chính – Xóa** | `DIP_RefId` | **Xóa dòng đích**; các bản ghi bổ sung đang gắn vào dòng → "không ghép được" |
| **Nguồn bổ sung – Thêm** | Tra nguồn ghép vào theo khóa ghép | Có dòng khớp → điền cột (áp quy tắc *1 khớp nhiều* nếu dòng đã có bản khác); không khớp → "không ghép được" |
| **Nguồn bổ sung – Sửa trường thường** | Bảng liên kết (nguồn, khóa nguồn) | Chỉ sửa các cột lấy từ nguồn đó – **nếu bản ghi đang được chọn** (*1 khớp nhiều*); không được chọn thì chỉ cập nhật vùng tạm |
| **Nguồn bổ sung – Sửa khóa ghép** | Dòng cũ qua bảng liên kết + dòng mới qua khóa ghép | Dòng cũ: gỡ, chọn lại bản khác cùng khóa cũ nếu có, không thì để trống. Dòng mới: điền (áp *1 khớp nhiều*). **Tối đa 2 dòng** |
| **Nguồn bổ sung – Xóa** | Bảng liên kết | Gỡ khỏi dòng; còn bản khác cùng khóa → chọn lại, không thì để trống cột của nguồn đó |
| **Bảng nối dùng cột của bảng nối phía trên** (C ghép theo cột của B) | Các dòng có B vừa đổi | Đổi B → ghép lại C trên chính các dòng đó |
| **Inner Join** | – | Dòng chỉ tồn tại khi khớp: nguồn bổ sung xóa / đổi khóa làm dòng mất khớp → **xóa dòng**; có lại khớp → thêm lại dòng |
| **Full Join** | Khóa của 2 bên | Dòng 1 bên tìm được cặp → gộp vào chính dòng đó (giữ khóa đích); 1 bên bị xóa → dòng trở về chỉ còn bên kia; cả 2 bên mất → xóa dòng |
| **Cột theo độ ưu tiên** | Dòng có nguồn đổi | Nguồn nào trong danh sách ưu tiên đổi cũng tính lại cột đó |
| **Cột bắt buộc thành trống** | Dòng có nguồn đổi | **Xóa dòng** + ghi lỗi *Thiếu giá trị bắt buộc* (5.4) |

### 7.6. Union – ma trận xử lý thay đổi

| Thay đổi | Tìm dòng | Xử lý |
| :--- | :--- | :--- |
| Thêm | – | Thêm dòng (`DIP_SourceId`, `DIP_RefId`). Khóa chính theo cột mà trùng → áp luật *Khi trùng khóa chính* (5.3) |
| Sửa trường thường | (`DIP_SourceId`, `DIP_RefId`) | Sửa dòng; nếu là dòng đang được giữ mà luật là *mới nhất* → xét lại các dòng cùng khóa |
| Sửa cột làm khóa chính | như trên | Xét lại **khóa cũ và khóa mới** (dòng được giữ có thể đổi ở cả hai) |
| Xóa | như trên | **Xóa dòng**; nếu là dòng đang được giữ → lấy dòng kế tiếp cùng khóa theo luật |

### 7.7. Nguồn nạp lại toàn bộ – phạm vi xóa và chạy lại

| Kiểu | Nguồn nạp lại | Xóa | Chạy lại |
| :--- | :--- | :--- | :--- |
| Union | Bất kỳ | Các dòng `DIP_SourceId` = nguồn đó | Riêng nguồn đó + xét lại các khóa trùng có liên quan |
| Join | Nguồn bổ sung | Giá trị các cột lấy từ nguồn đó ở mọi dòng + liên kết của nguồn đó | Ghép lại riêng nguồn đó (và các nguồn ghép chuỗi vào nó) |
| Join | **Nguồn chính** (bảng chính tạo dòng) | **Toàn bộ bảng đích** của cấu hình | **Toàn bộ cấu hình** (kể cả nguồn bổ sung có CDC) |

- Vì nguồn chính nạp lại toàn bộ kéo theo dựng lại toàn bảng → **khuyến nghị (hướng dẫn nghiệp vụ) chọn nguồn chính là nguồn có theo dõi thay đổi**.
- Nguồn nạp lại toàn bộ + khóa chính *theo cột* lấy ID của nguồn đó → nếu ID nguồn sinh lại thì ID đích đổi theo mỗi lần chạy → khuyến nghị *Tự động*.
- Nếu chốt phương án **so ảnh chụp** (7.3): nguồn nạp lại toàn bộ có khóa ổn định được xử lý như nguồn có CDC → bảng 7.7 chỉ còn áp dụng cho nguồn **không có khóa ổn định**.

### 7.8. Khi nào phải dựng lại toàn bảng

| Tình huống | Ghi chú |
| :--- | :--- |
| Lần chạy đầu (Chuyển đổi dữ liệu) | – |
| Nguồn chính của JOIN nạp lại toàn bộ (không so ảnh chụp) | 7.7 |
| Sửa cấu hình (nguồn, quy tắc, điều kiện ghép, ánh xạ, khóa đích…) | Bắt buộc **Xóa dữ liệu** trước (7.12) → chạy lại từ đầu |
| Danh mục tham chiếu dùng trong quy tắc chuẩn hóa thay đổi | Nguồn không phát sinh thay đổi nhưng kết quả chuẩn hóa đổi → chạy lại quy tắc cho bản ghi dùng giá trị đó, hoặc dựng lại theo lịch (chờ chốt – mục 11) |
| Mốc đọc CDC bị mất / log CDC đã bị xóa quá hạn | Không còn biết thay đổi nào → phải dựng lại |

Ngoài các trường hợp trên, **sửa CCCD (hay bất kỳ khóa ghép nào) chỉ ghép lại các dòng liên quan, không chạy lại toàn bộ**.

### 7.9. Trường hợp đặc biệt

| Trường hợp | Xử lý |
| :--- | :--- |
| **Khóa nguồn bị đổi** (VD ID_CD 16 → 99) | CDC thường báo *xóa 16 + thêm 99* → xóa dòng 16, sinh dòng mới. Nếu khóa đích lấy theo cột khóa nguồn thì ID đích cũng đổi → các hệ thống tham chiếu ID cũ bị ảnh hưởng (lý do khóa nguồn phải ổn định) |
| **Bản ghi bị xóa rồi xuất hiện lại** | Thêm lại dòng; khóa *Tự động* thì sinh khóa mới, khóa *theo cột* thì giữ giá trị cũ |
| **Khóa ghép rỗng** | Không ghép (không khớp với bản ghi rỗng khác); nguồn bổ sung → "không ghép được" |
| **Sự kiện đến không theo thứ tự** | Xử lý theo LSN / thời điểm nguồn, không theo thời điểm nhận; sự kiện cũ hơn trạng thái trong vùng tạm thì bỏ qua |
| **Hai nguồn cùng đổi trong 1 lần chạy** | Gom tập dòng ảnh hưởng của tất cả nguồn rồi tính lại mỗi dòng **1 lần** |
| **Bấm Cập nhật khi nguồn không có thay đổi** | Chạy bình thường, không ghi bảng đích, Lịch sử chạy ghi *Thành công* 0 / 0 / 0 |
| **Sửa ở nguồn nhưng giá trị sau xử lý không đổi** | `DIP_Hash` không đổi → không ghi bảng đích, không tính vào "sửa" |
| **Lần chạy lỗi giữa chừng** | Hoàn tác giao dịch, không dời mốc đọc, Lịch sử chạy ghi *Lỗi* + mã lỗi; lần sau chạy lại từ mốc cũ |

### 7.10. Ví dụ minh họa (3 bảng, ghép theo CCCD)

Bảng chính `Công dân`, `LEFT JOIN Khai sinh` (ON CCCD = SO_DINH_DANH), `LEFT JOIN BHXH` (ON CCCD = CCCD AND BHXH.TRANG_THAI = 1); khóa chính `ID` theo cột `Công dân.ID_CD`; `HO_TEN` theo độ ưu tiên Công dân → BHXH → Khai sinh. Dữ liệu mẫu ở tab *Dữ liệu đích* của cấu hình `HN_CONG_DAN`.

| ID | HO_TEN | NOI_KCB | NOI_SINH | `DIP_RefId` | Liên kết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 15 | Nguyễn Văn An | BV Bạch Mai | BV Phụ sản Hà Nội | Công dân:15 | BHXH:HS-802 · Khai sinh:KS-3310 |
| 16 | Trần Thị Bình | (trống) | BV Trung ương Huế | Công dân:16 | BHXH:– · Khai sinh:KS-3311 |
| 17 | Lê Minh Châu | BV Nhân dân 115 | (trống) | Công dân:17 | BHXH:HS-804 · Khai sinh:– |

| Thay đổi ở nguồn | Dòng bị ảnh hưởng | Kết quả |
| :--- | :--- | :--- |
| BHXH `HS-802` đổi nơi KCB | 15 | Chỉ sửa NOI_KCB |
| Công dân 16 **sửa CCCD** | 16 | Ghép lại dòng 16: mất khớp Khai sinh → xóa cột của Khai sinh, `KS-3311` vào "không ghép được" |
| BHXH `HS-802` **sửa CCCD** sang CCCD của Bình | 15, 16 | Dòng 15 bỏ cột BHXH; dòng 16 nhận `HS-802` |
| Khai sinh thêm `KS-3313` khớp CCCD của 17 | 17 | Điền cột của Khai sinh |
| BHXH xóa `HS-804` | 17 | Còn `HS-803` cùng CCCD → chọn lại `HS-803` |
| Công dân xóa 18 | 18 | Xóa dòng 18 |
| BHXH là nguồn **nạp lại toàn bộ** | Mọi dòng | Xóa cột BHXH ở mọi dòng, ghép lại BHXH; cột Công dân / Khai sinh giữ nguyên |
| Công dân là nguồn **nạp lại toàn bộ** | Toàn bảng | Xóa toàn bộ bảng đích, chạy lại cả cấu hình |

### 7.11. Cấu trúc nguồn thay đổi

| Thay đổi | Xử lý |
| :--- | :--- |
| Thêm cột | Không ảnh hưởng; báo "có trường mới chưa ánh xạ" |
| Xóa / đổi tên cột đang dùng (điều kiện, ghép cột, ánh xạ) | Cấu hình → **Cần cấu hình lại**, khóa Chuyển đổi / Cập nhật cho tới khi sửa |
| Đổi kiểu / độ dài | Rộng hơn → xác nhận mở rộng cột đích. Hẹp hơn / khác kiểu → kiểm tra từng bản ghi, dòng lỗi vào danh sách lỗi |

### 7.12. Luồng thao tác theo trạng thái (thống nhất với màn Xử lý dữ liệu)

Đối chiếu site test màn Xử lý dữ liệu (02/11/2026): *chưa cấu hình ánh xạ* → mọi nút khóa; *đã cấu hình, chưa có dữ liệu* → Chuyển đổi mở, Cập nhật / Xóa dữ liệu khóa; *đã có dữ liệu* → Chuyển đổi khóa, Cập nhật / Xóa dữ liệu mở, **ánh xạ khóa** (phải xóa dữ liệu) nhưng **quy tắc làm sạch / chuẩn hóa / biến đổi vẫn sửa được**. Không có trạng thái Tạm dừng.

| Thao tác | Bản nháp | Hoạt động – chưa có dữ liệu | Hoạt động – có dữ liệu | Cần cấu hình lại |
| :--- | :--- | :--- | :--- | :--- |
| ▶ Chuyển đổi dữ liệu | Khóa – *Chưa hoàn thành cấu hình* | **Mở** – chạy toàn bộ lần đầu | Khóa – *Đã có dữ liệu, dùng Cập nhật* | Khóa – *Nguồn thay đổi cấu trúc* |
| ⟳ Cập nhật dữ liệu | Khóa | Khóa – *Chưa có dữ liệu* | **Mở** – chạy tăng dần (7.3 – 7.7) | Khóa |
| 🗑 Xóa dữ liệu | Khóa – *Chưa có dữ liệu* | Khóa | **Mở** – xóa **chỉ dữ liệu cấu hình này ghi**, xong quay về cột 2 (Chuyển đổi lại được ngay) | Mở nếu có dữ liệu |
| ⏰ Thêm lịch biểu | Khóa – *Chưa hoàn thành cấu hình* | Mở | Mở | Mở |
| Chỉnh sửa | Toàn bộ | Toàn bộ | **Một phần** (bảng dưới) | Như cột tương ứng theo dữ liệu |
| Xóa cấu hình | Mở | Mở | Khóa – *Xóa dữ liệu trước* | Như cột tương ứng theo dữ liệu |

**Chỉnh sửa khi đã có dữ liệu – khi nào được chọn lại bảng nguồn, bảng đích:**

| Bước wizard | Chưa có dữ liệu | Có dữ liệu |
| :--- | :--- | :--- |
| ① Thông tin chung | Sửa được | Sửa tên, mô tả; **mã không đổi** |
| ② Chọn nguồn | Sửa được | **Chỉ xem** |
| ③ Xử lý nguồn | Sửa được | **Sửa được** – áp dụng từ lần Cập nhật sau |
| ④ Kết hợp | Sửa được | **Chỉ xem** |
| ⑤ Bảng đích & ánh xạ | Sửa được | **Chỉ xem** |

Bước chỉ xem có dòng báo *Cấu hình đã ghi N bản ghi… vui lòng Xóa dữ liệu trước*. Muốn chọn lại nguồn, đổi kết hợp, bảng đích hoặc ánh xạ → **Xóa dữ liệu** rồi sửa và **Chuyển đổi** lại → không có dữ liệu cũ lệch cấu hình mới. Ngừng chạy tự động: tắt ở **Lịch biểu** (không còn Tạm dừng / Kích hoạt).

Mọi lần Chuyển đổi / Cập nhật / Xóa dữ liệu đều ghi vào tab **Lịch sử chạy**.

### 7.13. Ảnh hưởng dây chuyền

- Bảng đích có thể đang được dùng bởi Cung cấp dữ liệu (API), Dữ liệu mở, Dữ liệu chủ → cảnh báo khi đổi cấu trúc / dựng lại.
- Khóa bảng khi đang chạy, các lần chạy cùng bảng xếp hàng.
- Nên lưu bản cũ trước khi dựng lại toàn bảng để khôi phục *(giai đoạn sau)*.

---

## 8. Trạng thái

- **Cấu hình:** `Bản nháp → Hoạt động` (*Lưu và kích hoạt* = hoàn thành cấu hình); `Cần cấu hình lại` khi nguồn bị xóa / đổi cấu trúc. Không có *Tạm dừng* (giống màn Xử lý dữ liệu).
- **Dữ liệu:** `Chưa có dữ liệu ⇄ Có dữ liệu` (Chuyển đổi / Xóa dữ liệu) – quyết định nút nào mở (7.12).
- **Lần chạy:** `Đang chạy → Thành công | Thành công một phần | Lỗi`.

---

## 9. Phân kỳ

| Giai đoạn | Nội dung |
| :--- | :--- |
| **1 – Cốt lõi (bản UI mẫu kèm tài liệu này)** | Menu, danh sách, wizard 6 bước (xử lý từng nguồn, kết hợp 1 loại: Join – bảng chính + bảng nối / Union – ghép cột, ON · WHERE, bảng đích & ánh xạ chung 1 bước, bảng mới sửa được cấu trúc, ánh xạ theo cột / độ ưu tiên / cố định, khóa chính và luật trùng khóa), chi tiết (Tổng quan / Xử lý nguồn / Ánh xạ / Dữ liệu đích / Lịch sử chạy) |
| **2 – Vận hành** | Tab *Quy tắc sau hợp nhất*, danh sách *Không ghép được / Lỗi*, trạng thái thay đổi theo nguồn (+thêm / ~sửa / −xóa), liên kết từ màn Xử lý dữ liệu và Chi tiết CSDL đích |
| **3 – Nâng cao** | Nguồn gốc theo từng ô (`DIP_FieldSources`), xem xung đột giá trị, điều kiện HOẶC / nhóm ngoặc, xâu chuỗi nhiều tầng (bảng đích làm nguồn – giải quyết trường hợp Union rồi Join), lưu bản cũ để khôi phục |

---

## 10. Lưu ý cho dev

1. **Tách biệt:** chỉ chạm `layout/Sidebar.tsx` (thêm 1 mục menu) và `layout/MainLayout.tsx` (import + tiêu đề trang + render + breadcrumb, id trang `processing-data-merge`). Mọi thứ khác trong `pages/processing/merge/`.
2. **Dữ liệu mẫu riêng** (`mockDataMerge.ts`); chỉ **đọc** `initialTargetDatabases` của `mockTargetDatabases.ts`, không sửa mock dùng chung.
3. **UI:** dùng class / component dùng chung (`collectionUi.tsx`, `ConfirmModal`, `BaseModal`, `toast`). Bảng: header nền `TABLE_HEAD_BG`, hàng 48px, chữ dài `TruncatedText`, cột Thao tác ghim phải, tối đa 3 nút (2 icon + `⋯`).
4. **Backend (khi làm thật):** vùng tạm theo nguồn, bảng tạm hợp nhất, dữ liệu lưu vết (mục 7.2), trình tự cập nhật tăng dần (mục 7.4), ghi bảng đích trong 1 giao dịch, khóa bảng khi chạy, chạy theo thứ tự phụ thuộc.
5. **Ghi nhận thay đổi** vào `tailieu/docs/log/log_update.md` và bổ sung mục chức năng vào `tailieu/docs/stauts.md`.

---

## 11. Vấn đề còn mở (cần chốt)

| # | Câu hỏi | Đề xuất |
| :---: | :--- | :--- |
| 1 | ~~Nguồn xóa bản ghi: đánh dấu xóa hay xóa hẳn?~~ | **Đã chốt:** xóa hẳn dòng đích (kể cả khi cột bắt buộc thành trống) |
| 2 | Thu thập có dữ liệu mới: tự động chạy hợp nhất hay chờ người bấm / theo lịch? | Theo lịch + nút Chạy ngay; tự động là tùy chọn |
| 3 | ~~Sửa quy tắc / ánh xạ: chỉ dữ liệu mới hay xử lý lại dữ liệu cũ?~~ | **Đã chốt:** có dữ liệu phải xóa trước khi sửa (7.12) |
| 4 | Có lưu giá trị "thua" khi xung đột (JOIN) để đối chiếu? | Giai đoạn 3 |
| 5 | ~~Có cho một cột đích lấy từ nhiều nguồn?~~ | **Đã chốt:** có – *Theo độ ưu tiên* (5.2) |
| 6 | Có cho bảng đích của cấu hình này làm nguồn cho cấu hình khác (xâu chuỗi)? | Giai đoạn 3 |
| 7 | Nguồn nạp lại toàn bộ: xóa và chạy lại (mặc định) hay **so ảnh chụp** để suy ra tập thay đổi (7.3)? | So ảnh chụp khi khóa nguồn ổn định – tránh dựng lại toàn bảng khi nguồn chính nạp lại toàn bộ |
| 8 | Danh mục tham chiếu (dùng trong quy tắc chuẩn hóa) thay đổi thì xử lý lại thế nào? | Chạy lại quy tắc cho bản ghi dùng giá trị bị đổi; tối thiểu có lịch dựng lại định kỳ |
| 9 | ~~Có cho trộn Union và Join trong 1 cấu hình (VD gộp Khai sinh Bộ + tỉnh rồi nối với Công dân)?~~ | **Đã chốt (02/11/2026):** mỗi cấu hình **1 loại** cho dễ hiểu, dễ thao tác. Trường hợp gộp rồi nối để sau – làm bằng 2 cấu hình khi hỗ trợ câu 6 (bảng đích của cấu hình Union làm nguồn cho cấu hình Join) |
