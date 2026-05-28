### DC1-DMDC-TLDM-453-MH-04. Màn danh sách thiết lập danh mục dùng chung

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Tổng số danh mục | Number | | x | Tổng số lượng các danh mục dùng chung đã khởi tạo. |
| 2 | Đã hiệu lực | Number | | x | Số lượng danh mục đang ở trạng thái hoạt động chính thức. |
| 3 | Hết hiệu lực | Number | | x | Số lượng danh mục đã bị ngừng sử dụng. |
| 4 | Mã | Văn bản | | x | Mã định danh duy nhất của danh mục (ví dụ: MD-CITIZEN-001). |
| 5 | Tên danh mục dùng chung | Văn bản | | x | Tên gọi đầy đủ của bộ danh mục. |
| 6 | Loại dữ liệu | Văn bản | | x | Phân loại tính chất dữ liệu (Dữ liệu chuẩn, Dữ liệu tham chiếu...). |
| 7 | Cơ quan quản lý | Văn bản | | x | Đơn vị chịu trách nhiệm nội dung cho danh mục đó. |
| 8 | Trạng thái | Nhãn (Label) | | x | Tình trạng pháp lý của danh mục (Hiệu lực, Đang soạn thảo). |
| 9 | Công khai | Nhãn (Label) | | x | Tình trạng chia sẻ dữ liệu (Đã công khai, Chưa công khai). |
| 10 | Cập nhật | Ngày tháng | | x | Ngày gần nhất dữ liệu danh mục được thay đổi. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Tab điều hướng con | Tab | Chuyển đổi giữa các bước thiết lập: Danh sách, Thuộc tính, Quan hệ, Phê duyệt, Lịch sử. |
| 2 | Tìm kiếm danh mục | Text | Tìm kiếm nhanh theo tên hoặc mã danh mục. |
| 3 | Lọc nâng cao | Button | Mở các tiêu chí lọc chuyên sâu cho danh sách. |
| 4 | Thêm mới | Button | Mở giao diện để khởi tạo một danh mục dùng chung mới. |
| 5 | Xem chi tiết | Button | Mở xem thông tin chi tiết của bản ghi danh mục. |
| 6 | Hủy hiệu lực | Button | Chuyển trạng thái danh mục sang ngừng hoạt động. |
| 7 | Đặt hiệu lực | Button | Kích hoạt danh mục để đưa vào sử dụng chính thức. |
| 8 | Chỉnh sửa | Button | Cập nhật thông tin hoặc cấu hình của danh mục hiện có. |
| 9 | Xóa | Button | Gỡ bỏ hoàn toàn danh mục khỏi hệ thống (nếu chưa có dữ liệu liên kết). |
| 10 | Gửi phê duyệt | Button | Gửi cấu hình danh mục lên cấp có thẩm quyền để duyệt hiệu lực. |

---

### DC1-DMDC-TLDM-453-MH-01. Thêm mới thiết lập danh mục dùng chung

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Tên danh sách | Văn bản | x | | Nhập tên gọi đầy đủ của bộ danh mục dữ liệu dùng chung. |
| 2 | Loại dữ liệu | Danh mục (Dropdown) | x | | Lựa chọn phân loại dữ liệu (ví dụ: Dữ liệu chuẩn, Dữ liệu tham chiếu). |
| 3 | Cơ quan quản lý | Văn bản | x | | Nhập tên đơn vị chịu trách nhiệm chính về nội dung dữ liệu. |
| 4 | Phạm vi sử dụng | Văn bản | x | | Xác định ranh giới hoặc các đối tượng được phép khai thác danh mục. |
| 5 | Mô tả | Văn bản (Nhiều dòng) | | | Nhập mô tả chi tiết về mục đích và nội dung của danh sách. |
| 6 | Trạng thái vòng đời | Danh mục (Dropdown) | | | Thiết lập giai đoạn hiện tại của danh mục trong quy trình quản lý. |
| 7 | Nguồn dữ liệu | Danh mục (Dropdown) | | | Lựa chọn hệ thống hoặc phương thức cung cấp dữ liệu đầu vào. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Đóng (X) | Icon | Đóng cửa sổ popup ngay lập tức và không lưu lại bất kỳ thay đổi nào. |
| 2 | Hủy | Button | Hủy bỏ các thông tin đã nhập và quay về màn hình danh sách thiết lập. |
| 3 | Thêm mới | Button | Kiểm tra tính hợp lệ của dữ liệu (Validation) và khởi tạo danh mục mới vào hệ thống. |

---

### DC1-DMDC-TLDM-453-MH-02. Chỉnh sửa thiết lập danh mục dùng chung

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Tên danh sách | Text | x | x | Nhập tên gọi đầy đủ của bộ danh mục dữ liệu dùng chung. |
| 2 | Loại dữ liệu | Dropdown | x | x | Lựa chọn phân loại dữ liệu (ví dụ: Dữ liệu chuẩn, Dữ liệu tham chiếu). |
| 3 | Cơ quan quản lý | Text | x | x | Nhập tên đơn vị chịu trách nhiệm chính về nội dung dữ liệu. |
| 4 | Phạm vi sử dụng | Text | x | x | Xác định ranh giới hoặc các đối tượng được phép khai thác danh mục. |
| 5 | Mô tả | Text | | x | Nhập mô tả chi tiết về mục đích và nội dung của danh sách. |
| 6 | Trạng thái vòng đời | Dropdown | | x | Thiết lập giai đoạn hiện tại của danh mục trong quy trình quản lý. |
| 7 | Nguồn dữ liệu | Dropdown | | x | Lựa chọn hệ thống hoặc phương thức cung cấp dữ liệu đầu vào. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Đóng (X) | Button | Đóng cửa sổ popup ngay lập tức và không lưu lại bất kỳ thay đổi nào. |
| 2 | Hủy | Button | Hủy bỏ các thông tin đã nhập và quay về màn hình danh sách thiết lập. |
| 3 | Cập nhật | Button | Kiểm tra tính hợp lệ của dữ liệu (Validation) và cập nhật lại dữ liệu vào hệ thống. |

---

### DC1-DMDC-TLDM-453-MH-03. Xóa Thiết lập danh sách các danh mục

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Tiêu đề | Label | | | Thông báo mục đích của cửa sổ hiện tại. |
| 2 | Mã danh mục | String | | | Mã định danh của đối tượng người dùng đang yêu cầu xóa. |
| 3 | Tên danh mục | String | | | Tên hiển thị chi tiết của đối tượng bị xóa. |
| 4 | Cảnh báo | Alert | | | Nội dung cảnh báo về hệ quả của hành động (Hành động không thể hoàn tác, xóa vĩnh viễn dữ liệu liên quan). |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Hủy bỏ | Button | Đóng pop-up và giữ nguyên trạng thái dữ liệu (không thực hiện xóa). |
| 2 | Xóa | Button | Xác nhận thực hiện xóa vĩnh viễn danh mục và các dữ liệu liên quan khỏi hệ thống. |
| 3 | Thoát (X) | Icon | Nút đóng nhanh cửa sổ ở góc trên bên phải. |

---

### DC1-DMDC-TLDM-453-MH-05. Trình phê duyệt danh mục dùng chung

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Mã dữ liệu | Label | | x | Mã định danh của danh mục (ví dụ: MD-AGENCY-001). |
| 2 | Loại yêu cầu | Label | | x | Loại tác vụ cần thực hiện phê duyệt. |
| 3 | Tên dữ liệu chủ | Label | | x | Tên đầy đủ của danh mục đang thiết lập. |
| 4 | Mô tả | Label | | x | Nội dung mô tả chi tiết về danh mục. |
| 5 | Loại dữ liệu | Label | | x | Phân loại dữ liệu (ví dụ: Dữ liệu tham chiếu). |
| 6 | Cơ quan quản lý | Label | | x | Đơn vị chủ quản của bộ dữ liệu. |
| 7 | Phạm vi | Label | | x | Ranh giới áp dụng của danh mục (ví dụ: Cấp quốc gia). |
| 8 | Trạng thái | Label | | x | Tình trạng hiện tại trước khi gửi duyệt. |
| 9 | Người phê duyệt | Dropdown | x | x | Lựa chọn lãnh đạo hoặc cán bộ có thẩm quyền duyệt. |
| 10 | Người nhận thông báo | Dropdown | x | x | Lựa chọn các cá nhân/phòng ban nhận tin khi có kết quả. |
| 11 | Mô tả (Ghi chú) | Text | | | Nhập ghi chú thêm cho cấp phê duyệt (nếu có). |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Đóng (X) | Button | Tắt popup và hủy bỏ thao tác gửi yêu cầu. |
| 2 | Chọn người phê duyệt | Dropdown | Tìm kiếm và chọn tên cán bộ phê duyệt từ danh sách nhân sự. |
| 3 | Chọn người nhận | Text | Cho phép chọn nhiều người để nhận thông báo về trạng thái hồ sơ. |
| 4 | Gửi yêu cầu | Button | Thực hiện chuyển trạng thái bản ghi sang "Chờ phê duyệt" và gửi thông báo cho người liên quan. |

---

### DC1-DMDC-TLDM-454-MH-01. Màn danh sách thông tin thuộc tính của danh mục

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Chọn thực thể dữ liệu chủ | Dropdown | x | x | Chọn danh mục cần thiết lập thuộc tính. |
| 2 | Tổng số thuộc tính | Label | | x | Hiển thị tổng số lượng trường dữ liệu hiện có. |
| 3 | Tên trường | Label | x | x | Tên định danh kỹ thuật trong CSDL (ví dụ: citizen_id). |
| 4 | Tên hiển thị | Label | x | x | Tên gọi trên giao diện người dùng (ví dụ: Số CCCD). |
| 5 | Kiểu dữ liệu | Label | x | x | Định dạng dữ liệu của thuộc tính (Chuỗi, Ngày, Văn bản dài...). |
| 6 | Độ dài | Label | | x | Giới hạn ký tự tối đa cho phép nhập. |
| 7 | Ràng buộc | Label | | x | Các thuộc tính đặc biệt: Bắt buộc, Duy nhất, Index. |
| 8 | Phiên bản | Label | | x | Phiên bản hiện hành của cấu trúc thuộc tính. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Chọn danh mục | Button | Lọc danh sách thuộc tính theo thực thể dữ liệu chủ được chọn. |
| 2 | Thêm thuộc tính | Button | Mở giao diện để thêm mới một trường dữ liệu vào danh mục hiện tại. |
| 3 | Chỉnh sửa | Button | Cho phép thay đổi Tên hiển thị, Kiểu dữ liệu hoặc các Ràng buộc của thuộc tính. |
| 4 | Xóa | Button | Loại bỏ thuộc tính khỏi danh mục (thường chỉ cho phép khi chưa có dữ liệu phát sinh). |
| 5 | Tab điều hướng | Tab | Chuyển đổi giữa các phân hệ: Thiết lập danh sách, Thuộc tính, Quan hệ, Phê duyệt. |

---

### DC1-DMDC-TLDM-454-MH-02. Màn hình gửi yêu cầu phê duyệt cấu trúc

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Chọn thực thể dữ liệu chủ | Dropdown | x | x | Chọn danh mục cần thiết lập thuộc tính. |
| 2 | Tổng số thuộc tính | Label | | x | Hiển thị tổng số lượng trường dữ liệu hiện có. |
| 3 | Tên trường | Label | x | x | Tên định danh kỹ thuật trong CSDL (ví dụ: citizen_id). |
| 4 | Tên hiển thị | Label | x | x | Tên gọi trên giao diện người dùng (ví dụ: Số CCCD). |
| 5 | Kiểu dữ liệu | Label | x | x | Định dạng dữ liệu của thuộc tính (Chuỗi, Ngày, Văn bản dài...). |
| 6 | Độ dài | Label | | x | Giới hạn ký tự tối đa cho phép nhập. |
| 7 | Ràng buộc | Label | | x | Các thuộc tính đặc biệt: Bắt buộc, Duy nhất, Index. |
| 8 | Phiên bản | Label | | x | Phiên bản hiện hành của cấu trúc thuộc tính. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Chọn danh mục | Button | Lọc danh sách thuộc tính theo thực thể dữ liệu chủ được chọn. |
| 2 | Thêm thuộc tính | Button | Mở giao diện để thêm mới một trường dữ liệu vào danh mục hiện tại. |
| 3 | Chỉnh sửa | Button | Cho phép thay đổi Tên hiển thị, Kiểu dữ liệu hoặc các Ràng buộc của thuộc tính. |
| 4 | Xóa | Button | Loại bỏ thuộc tính khỏi danh mục (thường chỉ cho phép khi chưa có dữ liệu phát sinh). |
| 5 | Tab điều hướng | Tab | Chuyển đổi giữa các phân hệ: Thiết lập danh sách, Thuộc tính, Quan hệ, Phê duyệt. |

---

### DC1-DMDC-TLDM-455-MH-01. Màn danh sách thiết lập quan hệ

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Thực thể nguồn | Label | | x | Tên bộ dữ liệu đóng vai trò là gốc của quan hệ (ví dụ: Bộ dữ liệu chủ Công dân). |
| 2 | Loại quan hệ | Label | | x | Định nghĩa kiểu liên kết giữa hai thực thể (ví dụ: n-n, 1-n). |
| 3 | Thực thể đích | Label | | x | Tên bộ dữ liệu được liên kết tới (ví dụ: Bộ dữ liệu chủ Tổ chức). |
| 4 | Điều kiện liên kết | Label | | x | Hiển thị thông tin bảng trung gian và các khóa chính (PK) dùng để ánh xạ dữ liệu. |
| 5 | Trạng thái | Label | | x | Tình trạng khả dụng của mối quan hệ trên hệ thống. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Thêm mới | Button | Mở giao diện cấu hình để thiết lập một mối quan hệ mới giữa hai thực thể dữ liệu. |
| 2 | Chỉnh sửa | Button | Cho phép thay đổi loại quan hệ hoặc cập nhật lại các khóa điều kiện liên kết. |
| 3 | Xóa | Button | Loại bỏ mối liên kết giữa các thực thể (yêu cầu xác nhận và kiểm tra ràng buộc dữ liệu). |
| 4 | Tab điều hướng | Tab | Chuyển đổi qua lại giữa các phần: Thiết lập danh sách, Thuộc tính, Quan hệ, Phê duyệt, Lịch sử. |

---

### DC1-DMDC-TLDM-457-MH-05. Màn danh sách phê duyệt danh mục

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Chờ phê duyệt | Number | x | Theo hệ thống | Tổng số hồ sơ đang đợi xử lý. |
| 2 | Đã phê duyệt | Number | x | Theo hệ thống | Tổng số hồ sơ đã được chấp thuận. |
| 3 | Từ chối | Number | x | Theo hệ thống | Tổng số hồ sơ đã bị bác bỏ. |
| 4 | Trạng thái hiển thị | Label | x | Tất cả | Lọc danh sách theo: Tất cả, Chờ phê duyệt, Đã phê duyệt, Từ chối. |
| 5 | Tên & Mã dữ liệu chủ | Label | x | Theo bản ghi | Tên hiển thị kèm mã định danh của bộ dữ liệu (VD: MD-AGENCY-001). |
| 6 | Trạng thái hồ sơ | Label | x | Chờ phê duyệt | Gắn nhãn màu sắc để nhận diện tình trạng hồ sơ. |
| 7 | Cơ quan quản lý | Label | x | Theo bản ghi | Đơn vị chịu trách nhiệm cho bộ dữ liệu này. |
| 8 | Loại dữ liệu | Label | x | Theo bản ghi | Phân loại dữ liệu (Dữ liệu tham chiếu, Dữ liệu chuẩn). |
| 9 | Ngày gửi | Date time | x | Theo bản ghi | Thời điểm hồ sơ được gửi lên hệ thống. |
| 10 | Người gửi | Label | x | Theo bản ghi | Tài khoản cán bộ thực hiện gửi yêu cầu phê duyệt. |
| 11 | Thông tin cấu trúc | Label | | Theo bản ghi | Hiển thị số lượng thuộc tính, quy tắc hợp nhất, quan hệ và định danh của bộ dữ liệu. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Phê duyệt | Button | Chấp thuận hồ sơ ngay tại danh sách (Quick Approve). Trạng thái chuyển sang "Đã phê duyệt". |
| 2 | Từ chối | Button | Bác bỏ yêu cầu phê duyệt. Trạng thái chuyển sang "Từ chối". |
| 3 | Xem chi tiết | Button | Mở màn hình xem chi tiết toàn bộ cấu trúc và nội dung của bộ dữ liệu trước khi ra quyết định. |
| 4 | Lịch sử cập nhật | Button | Hiển thị danh sách các phiên bản hoặc lần chỉnh sửa trước đó (nếu có). |
| 5 | Tab điều hướng | Button | Chuyển đổi giữa các phân hệ: Thiết lập danh sách, Thuộc tính, Quan hệ, Phê duyệt, Lịch sử phiên bản. |

---

### DC1-DMDC-TLDM-460-MH-08. Hết hiệu lực danh mục

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Chờ phê duyệt | Number | x | Theo hệ thống | Tổng số hồ sơ đang đợi xử lý. |
| 2 | Đã phê duyệt | Number | x | Theo hệ thống | Tổng số hồ sơ đã được chấp thuận. |
| 3 | Từ chối | Number | x | Theo hệ thống | Tổng số hồ sơ đã bị bác bỏ. |
| 4 | Trạng thái hiển thị | Label | x | Tất cả | Lọc danh sách theo: Tất cả, Chờ phê duyệt, Đã phê duyệt, Từ chối. |
| 5 | Tên & Mã dữ liệu chủ | Label | x | Theo bản ghi | Tên hiển thị kèm mã định danh của bộ dữ liệu (VD: MD-AGENCY-001). |
| 6 | Trạng thái hồ sơ | Label | x | Chờ phê duyệt | Gắn nhãn màu sắc để nhận diện tình trạng hồ sơ. |
| 7 | Cơ quan quản lý | Label | x | Theo bản ghi | Đơn vị chịu trách nhiệm cho bộ dữ liệu này. |
| 8 | Loại dữ liệu | Label | x | Theo bản ghi | Phân loại dữ liệu (Dữ liệu tham chiếu, Dữ liệu chuẩn). |
| 9 | Ngày gửi | Date time | x | Theo bản ghi | Thời điểm hồ sơ được gửi lên hệ thống. |
| 10 | Người gửi | Label | x | Theo bản ghi | Tài khoản cán bộ thực hiện gửi yêu cầu phê duyệt. |
| 11 | Thông tin cấu trúc | Label | | Theo bản ghi | Hiển thị số lượng thuộc tính, quy tắc hợp nhất, quan hệ và định danh của bộ dữ liệu. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Phê duyệt | Button | Chấp thuận hồ sơ ngay tại danh sách (Quick Approve). Trạng thái chuyển sang "Đã phê duyệt". |
| 2 | Từ chối | Button | Bác bỏ yêu cầu phê duyệt. Trạng thái chuyển sang "Từ chối". |
| 3 | Xem chi tiết | Button | Mở màn hình xem chi tiết toàn bộ cấu trúc và nội dung của bộ dữ liệu trước khi ra quyết định. |
| 4 | Lịch sử cập nhật | Button | Hiển thị danh sách các phiên bản hoặc lần chỉnh sửa trước đó (nếu có). |
| 5 | Tab điều hướng | Button | Chuyển đổi giữa các phân hệ: Thiết lập danh sách, Thuộc tính, Quan hệ, Phê duyệt, Lịch sử phiên bản. |

---

### DC1-DMDC-TLDM-460-MH-09. Màn hiển thị danh mục và trạng thái sử dụng hiện tại

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Mã | Label | | x | Mã định danh duy nhất của bộ dữ liệu. |
| 2 | Tên | Label | | x | Tên hiển thị của danh mục đơn vị hành chính. |
| 3 | Loại | Label | | x | Phân loại tính chất của bộ dữ liệu. |
| 4 | Cơ quan quản lý | Label | | x | Đơn vị chủ quản chịu trách nhiệm nội dung. |
| 5 | Phạm vi | Label | | x | Quy mô sử dụng của bộ dữ liệu. |
| 6 | Ghi chú công khai | Label | | | Nhập mục đích hoặc nội dung cần lưu ý khi chia sẻ danh mục này. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Xác nhận công khai | Button | Hoàn tất quy trình, chuyển trạng thái danh mục sang "Công khai" để các bên có thể khai thác. |
| 2 | Hủy | Button | Đóng popup và giữ danh mục ở trạng thái nội bộ. |
| 3 | Đóng (X) | Button | Thoát nhanh cửa sổ công khai. |

---

### DC1-DMDC-BTDM-466-MH-05. Màn danh sách danh mục được công khai

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Tổng danh mục công bố | Number | | 5 | Tổng số lượng danh mục hiện có trên hệ thống. |
| 2 | Đã công bố | Number | | 3 | Số lượng danh mục đang ở trạng thái hoạt động công khai. |
| 3 | Đã cập nhật | Number | | 1 | Số lượng danh mục vừa có sự thay đổi hoặc cập nhật mới. |
| 4 | Ngưng cập nhật | Number | | 1 | Số lượng danh mục đã tạm dừng cập nhật dữ liệu. |
| 5 | STT | Number | | x | Số thứ tự của danh mục trong danh sách. |
| 6 | Mã danh mục | Label | | x | Mã định danh duy nhất (Ví dụ: DMCB001). |
| 7 | Tên danh mục | Label | | x | Tên đầy đủ và mô tả ngắn gọn của danh mục. |
| 8 | Lĩnh vực | Label | | x | Phân loại lĩnh vực quản lý (Văn bản pháp luật, Hộ tịch...). |
| 9 | Ngày công bố | Date | | x | Ngày danh mục được đưa lên hệ thống. |
| 10 | Định dạng | Label | | x | Các loại tệp tin hỗ trợ (JSON, XML, CSV, Excel). |
| 11 | Lượt tải | Number | | x | Tổng số lượt người dùng đã tải danh mục này. |
| 12 | Trạng thái | Label | | x | Tình trạng hiện tại: Đã công bố, Đã cập nhật, Ngưng cập nhật. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Tìm kiếm | Textbox | Nhập tên hoặc mã danh mục để lọc nhanh dữ liệu trong danh sách. |
| 2 | Lọc theo tiêu chí | Dropdown | Các ô lọc bổ sung để giới hạn phạm vi danh sách hiển thị. |
| 3 | Xem chi tiết (Icon mắt) | Button | Chuyển đến màn hình xem thông tin chi tiết của danh mục tương ứng. |
| 4 | Tải về (Icon download) | Button | Thực hiện tải dữ liệu danh mục về máy tính. |
| 5 | Thông báo (Icon chuông) | Button | Xem các tin nhắn hoặc cập nhật mới từ hệ thống. |
| 6 | Tài khoản người dùng | Dropdown | Hiển thị thông tin người dùng đang đăng nhập và các tùy chọn cá nhân. |

---

### DC1-DMDC-KTBC-467-MH-01. Màn báo cáo thống kê danh mục dùng chung

#### Mô tả thông tin trên màn hình

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Từ khóa | Textbox | | | Nhập từ khóa để tìm kiếm theo mã hoặc tên Dataset. |
| 2 | Chủ đề | Dropdown | | | Lọc danh mục theo các nhóm chủ đề (ví dụ: Văn bản pháp luật, Đăng ký kinh doanh...). |
| 3 | Hiệu lực | Dropdown | | | Lọc theo tình trạng pháp lý (Hiệu lực, Hết hiệu lực). |
| 4 | Trạng thái công bố | Dropdown | | | Lọc theo tình trạng đã phát hành dữ liệu (Đã công bố, Chưa công bố). |
| 5 | Trạng thái phê duyệt | Dropdown | | | Lọc theo tiến độ phê duyệt nội dung (Đã phê duyệt, Đang chờ). |
| 6 | Mã danh mục | Label | | x | Mã định danh duy nhất của bộ dữ liệu (ví dụ: DS001). |
| 7 | Tên danh mục | Label | | x | Tên đầy đủ của bộ dữ liệu công bố. |
| 8 | Chủ đề | Tag | | x | Phân loại chủ đề tương ứng của Dataset. |
| 9 | Phiên bản | Link | | x | Số hiệu phiên bản hiện hành của danh mục. |
| 10 | Hiệu lực | Tag | | x | Trạng thái hiệu lực của dữ liệu (Hiệu lực/Hết hiệu lực). |
| 11 | Tình trạng khai thác | Tag | | x | Trạng thái sử dụng (Đang khai thác, Tạm dừng, Ngừng khai thác). |
| 12 | Trạng thái công bố | Tag | | x | Tình trạng phát hành của bộ dữ liệu. |
| 13 | Trạng thái phê duyệt | Tag | | x | Tình trạng kiểm duyệt nội dung. |
| 14 | Ngày công bố | Date | | x | Ngày công bố được đưa lên hệ thống công khai. |
| 15 | Lượt xem | Number | | x | Tổng số lượt truy cập xem thông tin Mã danh mục. |
| 16 | Lượt tải | Number | | x | Tổng số lượt người dùng tải dữ liệu về. |

#### Chức năng trên màn hình

| STT | Tên chức năng | Định dạng | Mô tả |
| :---: | :--- | :--- | :--- |
| 1 | Tìm kiếm | Button | Thực hiện tìm kiếm danh mục theo các tiêu chí đã chọn. |
| 2 | Kết xuất dữ liệu | Button | Kết xuất báo cáo ra file Excel hoặc PDF. |
