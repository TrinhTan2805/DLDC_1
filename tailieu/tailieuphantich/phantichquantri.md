# 4.9. PM07.QLHT_Quản trị & vận hành hệ thống

## 4.9.1. PM07.QLHT.QTND – Quản trị người dùng

### *4.9.1.1. Mục đích*
Quản lý người dùng trong kho dữ liệu dùng chung (DLDC) nhằm đảm bảo việc khai thác và sử dụng dữ liệu **đúng đối tượng, đúng quyền hạn, đúng mục đích và đúng trách nhiệm**.

Thông qua cơ chế quản trị và phân quyền, hệ thống:
- Đảm bảo an toàn, bảo mật dữ liệu trong suốt quá trình vận hành;
- Kiểm soát chặt chẽ quyền truy cập, chỉnh sửa, khai thác và chia sẻ dữ liệu;
- Hỗ trợ cán bộ quản trị trong việc **giám sát, theo dõi, kiểm tra và vận hành kho DLDC một cách hiệu quả**;
- Nâng cao tính minh bạch, trách nhiệm giải trình của các đơn vị, cá nhân khi sử dụng dữ liệu.

*+ Phân quyền*
**Cán bộ quản trị kho DLDC là đối tượng được giao thực hiện chức năng quản lý, vận hành và phân quyền người dùng trong hệ thống, bao gồm các quyền chính:**
• Tạo mới, cập nhật, khóa/mở khóa tài khoản người dùng;
• Phân quyền truy cập, khai thác, cập nhật dữ liệu theo vai trò, chức năng và phạm vi được giao;
• Giám sát hoạt động sử dụng hệ thống, theo dõi nhật ký truy cập và xử lý các vấn đề phát sinh;
• Phối hợp với các đơn vị liên quan trong công tác vận hành, bảo trì và đảm bảo an toàn hệ thống.

*+ Điều kiện thực hiện*
Cán bộ quản trị kho DLDC phải:
• Được cơ quan, đơn vị có thẩm quyền **phân công nhiệm vụ và cấp quyền truy cập quản trị**;
• Có kiến thức, kỹ năng phù hợp để thực hiện công tác quản trị, vận hành hệ thống kho dữ liệu;
• Chịu trách nhiệm trước cơ quan quản lý về các hoạt động quản trị, phân quyền và vận hành kho DLDC theo quy định hiện hành.

### 4.9.1.2. PM07.QLHT.QTND.MH13 – Quản lý người dùng

#### 4.9.1.2.1. MH13 Màn hình danh sách người dùng

##### Màn hình
- Màn hình:

![Danh sách người dùng (HA01)](./images/MH13_quanlynguoidung.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Màn hình danh sách người dùng</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Họ tên | VARCHAR2(255) | - | - | Tên đầy đủ của cán bộ. |
| Tài khoản | VARCHAR2(50) | - | - | Tên đăng nhập. |
| Email | VARCHAR2(100) | - | - | Địa chỉ email công vụ. |
| Đơn vị | VARCHAR2(255) | - | - | Cơ quan/đơn vị công tác. |
| Trạng thái | VARCHAR2(20) | - | - | Hoạt động / Đã khóa. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Kích hoạt đồng bộ danh sách người dùng từ hệ thống LDAP/Active Directory. |
| 2 | CN02 | Button text | Mở popup chọn file Excel để upload danh sách người dùng. |
| 3 | CN03 | Button text | Xuất danh sách người dùng hiện tại ra file Excel. |
| 4 | CN04 | Button text | Mở popup gán người dùng vào các nhóm quyền. |
| 5 | CN05 | Button icon | Mở popup xem chi tiết thông tin đầy đủ, nhóm và quyền hạn của người dùng. |
| 6 | CN06 | Button icon | Mở popup xác nhận khóa hoặc mở khóa tài khoản. |
| 7 | CN07 | Button icon | Mở popup thiết lập cấp lại mật khẩu cho người dùng. |

#### 4.9.1.2.2. MH13.P02 Chi tiết người dùng

##### Màn hình
- Màn hình: (Popup chi tiết chỉ đọc)

![Chi tiết người dùng (HA02)](./images/MH13_P02_chitiet_nguoidung.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Màn hình chi tiết người dùng</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên đăng nhập | VARCHAR2(50) | - | - | Tên truy cập LDAP. |
| Họ tên | VARCHAR2(255) | - | - | Hiển thị tên tài khoản. |
| Email / Số điện thoại | VARCHAR2(100) | - | - | Các thông tin liên hệ. |
| Vai trò / Đơn vị | VARCHAR2(255) | - | - | Các thông tin công tác. |
| Giờ đăng nhập gần nhất | DATE | - | - | Tracking thời gian truy cập. |
| Danh sách Nhóm trực thuộc | CLOB | - | - | (Ví dụ: Admin, Viewer). |
| Danh sách Quyền hạn chi tiết | CLOB | - | - | (Ví dụ: Toàn quyền, Xem dữ liệu). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng cửa sổ (Không có nút lưu). |

#### 4.9.1.2.3. MH13.P03 Xác nhận khóa tài khoản

##### Màn hình
- Màn hình: (Cửa sổ cảnh báo)

![Xác nhận khóa tài khoản (HA03)](./images/MH13_P03_xacnhan_khoa.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình xác nhận khóa tài khoản</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | Thông báo xác nhận hành động thay đổi trạng thái đăng nhập ("Bạn có chắc chắn muốn khóa/mở khóa tài khoản của [Tên người dùng]?"). |
| Lý do (nếu có) | VARCHAR2(1000) | Không | - | Người quản trị nhập lý do khóa. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Áp dụng thay đổi trạng thái tài khoản. |
| 2 | CN02 | Button text | Quay lại danh sách. |

#### 4.9.1.2.4. MH13.P04 Xác nhận đặt lại mật khẩu

##### Màn hình
- Màn hình:

![Reset mật khẩu (HA08)](./images/MH13_P04_dat_lai_mat_khau.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 8 - Màn hình xác nhận đặt lại mật khẩu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thông báo | VARCHAR2(500) | - | - | "Mật khẩu sẽ được đặt lại về giá trị mặc định. Người dùng cần đổi mật khẩu ở lần đăng nhập tiếp theo." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thực hiện đặt lại mật khẩu và hiển thị mật khẩu mới. |
| 2 | CN02 | Button text | Bỏ qua thao tác. |

### 4.9.1.3. PM07.QLHT.QTND.MH14 – Quản lý nhóm người dùng
#### 4.9.1.3.1. MH14 Màn hình danh sách nhóm người dùng
##### Màn hình
- Màn hình:

![Danh sách nhóm người dùng (HA04)](./images/MH14_nhomnguoidung.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Màn hình danh sách nhóm người dùng</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã nhóm | VARCHAR2(50) | - | - | Định danh của nhóm. |
| Tên nhóm | VARCHAR2(255) | - | - | Tên hiển thị (VD: Ban Giám đốc, Quản trị viên...). |
| Mô tả | VARCHAR2(1000) | - | - | Diễn giải vai trò của nhóm. |
| Số lượng thành viên | NUMBER | - | - | Số user có trong nhóm. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở màn hình thêm nhóm người dùng mới. |
| 2 | CN02 | Button icon | Mở màn hình chỉnh sửa nhóm người dùng. |
| 3 | CN03 | Button icon | Xem thông tin chi tiết nhóm. |
| 4 | CN04 | Thêm thành viên| Button icon | Thêm thành viên vào nhóm. |
| 5 | CN05 | Button icon | Mở màn hình gán quyền cho nhóm. |
| 6 | CN06 | Button icon | Mở màn hình xác nhận xóa nhóm. |

#### 4.9.1.3.2. MH14.P01 Thêm nhóm người dùng mới
##### Màn hình
- Màn hình:

![Thêm nhóm người dùng mới (HA05)](./images/MH14_P01_them_nhom.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Màn hình thêm nhóm người dùng mới</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã nhóm | VARCHAR2(50) | Có | - | Mã định danh nhóm, không được trùng lặp. |
| Tên nhóm | VARCHAR2(255) | Có | - | Tên hiển thị đầy đủ của nhóm. |
| Mô tả | VARCHAR2(1000) | Không | - | Ghi chú thêm về vai trò của nhóm này. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Ghi nhận thông tin thêm nhóm mới. |
| 2 | CN02 | Button text | Hủy thao tác thêm nhóm và quay lại danh sách. |

#### 4.9.1.3.3. MH14.P02 Chỉnh sửa nhóm người dùng
##### Màn hình
- Màn hình:

![Chỉnh sửa nhóm người dùng (HA06)](./images/MH14_P02_sua_nhom.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Màn hình chỉnh sửa nhóm người dùng</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã nhóm | VARCHAR2(50) | Có | (Dữ liệu cũ) | Mã định danh nhóm. |
| Tên nhóm | VARCHAR2(255) | Có | (Dữ liệu cũ) | Tên hiển thị đầy đủ của nhóm. |
| Mô tả | VARCHAR2(1000) | Không | (Dữ liệu cũ) | Ghi chú thêm về vai trò của nhóm. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Ghi nhận thay đổi thông tin nhóm. |
| 2 | CN02 | Button text | Hủy thao tác sửa nhóm. |

#### 4.9.1.3.4. MH14.P03 Chi tiết nhóm
##### Màn hình
- Màn hình:

![Chi tiết nhóm (HA07)](./images/MH14_P03_chitiet_nhom.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 7 - Màn hình chi tiết nhóm</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên nhóm | VARCHAR2(255) | - | - | Hiển thị tên (Ví dụ: Nhóm Đăng ký Kinh doanh). |
| Mã nhóm | VARCHAR2(50) | - | - | Mã định danh nhóm. |
| Các thuộc tính | VARCHAR2(1000) | - | - | Thông tin về hoạt động và vai trò. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng màn hình xem chi tiết. |



#### 4.9.1.3.5. MH14.P04 Thêm thành viên vào nhóm
##### Màn hình
- Màn hình:

![Thêm thành viên vào nhóm (HA09)](./images/MH14_P04_them_thanhvien.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 9 - Màn hình thêm thành viên vào nhóm</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách tài khoản | VARCHAR2(1000) | - | - | Lọc và hiển thị các tài khoản hệ thống. |
| Tích chọn | NUMBER(1) | Có | - | Chọn người dùng muốn đưa vào nhóm. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận việc bổ sung nhân sự vào nhóm. |
| 2 | CN02 | Button text | Bỏ qua các thay đổi. |


#### 4.9.1.3.6. MH14.P05 Gán quyền cho nhóm
##### Màn hình
- Màn hình: (Tham chiếu luồng phân quyền)

![Phân quyền nhóm (HA10)](./images/MH14_P05_phanquyen_nhom.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 10 - Màn hình gán quyền chức năng cho nhóm</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Danh sách chức năng | VARCHAR2(1000) | - | - | Cây các chức năng (Menu cha, menu con). |
| Quyền Xem | NUMBER(1) | Không | 0 | Cho phép truy cập và xem menu. |
| Quyền Thêm | NUMBER(1) | Không | 0 | Cho phép thêm mới dữ liệu. |
| Quyền Sửa | NUMBER(1) | Không | 0 | Cho phép cập nhật dữ liệu. |
| Quyền Xóa | NUMBER(1) | Không | 0 | Cho phép xóa dữ liệu. |
| Quyền Phê duyệt | NUMBER(1) | Không | 0 | Cho phép duyệt/công bố. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu lại các thay đổi quyền hạn. |
| 2 | CN02 | Button text | Hủy các thiết lập chưa lưu, quay về mặc định. |

#### 4.9.1.3.7. MH14.P06 Xác nhận xóa nhóm
##### Màn hình
- Màn hình: (Bảng thông báo xác nhận)

![Xóa nhóm (HA11)](./images/MH14_P06_xoa_nhom.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 11 - Màn hình xác nhận xóa nhóm</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn xóa nhóm này không? Các người dùng thuộc nhóm sẽ bị mất quyền lợi tương ứng." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thực thi lệnh xóa nhóm. |
| 2 | CN02 | Button text | Không xóa. |

### 4.9.1.4. PM07.QLHT.QTND.MH15 – Danh sách chức năng
#### 4.9.1.4.1. MH15 Màn hình danh sách chức năng
##### Màn hình
- Màn hình:

![Danh sách chức năng (HA12)](./images/MH15_danhsachchucnang.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 12 - Màn hình quản lý danh sách chức năng (Menu)</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên chức năng | VARCHAR2(255) | - | - | Tên menu / màn hình. |
| Đường dẫn (URL) | VARCHAR2(500) | - | - | Path truy cập. |
| Icon | VARCHAR2(50) | - | - | Biểu tượng hiển thị trên sidebar. |
| Menu cha | VARCHAR2(255) | - | - | Cấp quy định cha/con trong cấu trúc cây. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup thêm chức năng mới. |
| 2 | CN02 | Button icon | Mở popup thay đổi đường dẫn/tên nhánh. |
| 3 | CN03 | Button icon | Xóa cấu hình chức năng. |

#### 4.9.1.4.2. MH15.P01 Popup Thêm chức năng mới
##### Màn hình
- Màn hình:

![Thêm chức năng (HA13)](./images/MH15_P01_them_sua_chucnang.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 13 - Popup thêm cấu hình chức năng menu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên chức năng | VARCHAR2(255) | Có | - | Nhãn hiển thị của menu trên thanh điều hướng. |
| Menu cha | VARCHAR2(255) | Không | - | Chọn menu gốc nếu đây là menu con, bỏ trống nếu là menu gốc. |
| Đường dẫn truy cập | VARCHAR2(500) | Không | - | URL Path ví dụ: `/admin/users`. |
| Icon | VARCHAR2(50) | Không | - | Tên class của Icon (VD: `fas fa-users`). |
| Số thứ tự | NUMBER | Không | 1 | Vị trí hiển thị của menu. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thêm mới chức năng vào hệ thống. |
| 2 | CN02 | Button text | Đóng cửa sổ popup. |

#### 4.9.1.4.3. MH15.P02 Popup Sửa chức năng
##### Màn hình
- Màn hình:

![Sửa chức năng (HA14)](./images/MH15_P01_them_sua_chucnang.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 14 - Popup sửa cấu hình chức năng menu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên chức năng | VARCHAR2(255) | Có | (Dữ liệu cũ) | Nhãn hiển thị của menu trên thanh điều hướng. |
| Menu cha | VARCHAR2(255) | Không | (Dữ liệu cũ)| Chọn menu gốc nếu đây là menu con. |
| Đường dẫn truy cập | VARCHAR2(500) | Không | (Dữ liệu cũ)| URL Path ví dụ: `/admin/users`. |
| Icon | VARCHAR2(50) | Không | (Dữ liệu cũ)| Tên class của Icon. |
| Số thứ tự | NUMBER | Không | (Dữ liệu cũ)| Vị trí hiển thị của menu. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thay đổi chức năng. |
| 2 | CN02 | Button text | Đóng cửa sổ popup. |

## 4.9.2. PM07.QLHT.CHHT – Cấu hình hệ thống

### 4.9.2.1. PM07.QLHT.CHHT.MH16 – Thiết lập cấu hình hệ thống
#### 4.9.2.1.1. MH16 Màn hình thiết lập cấu hình
##### Màn hình
- Màn hình:

![Thiết lập cấu hình hệ thống (HA15)](./images/MH16_thietlapcauhinh.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 15 - Màn hình thiết lập tham số hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Yêu cầu đổi mật khẩu khi đăng nhập lần đầu | NUMBER(1) | Có | 1 | Bắt buộc người dùng thay đổi mật khẩu mặc định ngay sau lần đăng nhập đầu tiên. |
| Thời gian yêu cầu thay đổi mật khẩu (ngày) | NUMBER | Có | 90 | Số ngày tối đa trước khi yêu cầu người dùng đổi mật khẩu. |
| Số lần đăng nhập sai tối đa | NUMBER | Có | 5 | Số lần nhập sai mật khẩu liên tiếp trước khi tài khoản bị khóa tạm thời. |
| Thời gian khóa tài khoản (phút) | NUMBER | Có | 15 | Thời gian tài khoản bị khóa sau khi vượt quá số lần đăng nhập sai. |
| Thời gian hết hạn phiên làm việc (phút) | NUMBER | Có | 30 | Tự động đăng xuất người dùng sau khoảng thời gian không có thao tác. |
| Tự động sao lưu | VARCHAR2(50) | Có | Hàng ngày | Cấu hình tần suất sao lưu dữ liệu tự động (Hàng ngày, Hàng tuần, Hàng tháng). |
| Thời gian lưu trữ bản sao lưu (ngày) | NUMBER | Có | 30 | Hệ thống sẽ tự động xóa các bản sao lưu cũ hơn thời gian này. |
| Thời gian thực hiện sao lưu (giờ) | DATE | Có | 02:00 | Thời điểm hệ thống thực hiện sao lưu tự động trong ngày. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Cập nhật và lưu các thiết lập cấu hình. |
| 2 | CN02 | Button text | Khôi phục các thiết lập về giá trị mặc định lúc ban đầu. |

### 4.9.2.2. PM07.QLHT.CHHT.MH17 – Thiết lập quy tắc đặt mật khẩu
#### 4.9.2.2.1. MH17 Màn hình thiết lập quy tắc đặt mật khẩu
##### Màn hình
- Màn hình:

![Quy tắc đặt mật khẩu (HA16)](./images/MH17_quytacmatkhau.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 16 - Màn hình thiết lập độ an toàn kỹ thuật của mật khẩu</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Độ dài tối thiểu | NUMBER | Có | 8 | Yêu cầu số ký tự tối thiểu của mật khẩu. |
| Độ dài tối đa | NUMBER | Có | 32 | Yêu cầu số ký tự tối đa của mật khẩu. |
| Yêu cầu chứa chữ hoa | NUMBER(1) | Có | Có | Phải có ít nhất 1 chữ hoa (A-Z). |
| Số lượng chữ hoa tối thiểu | NUMBER | Khi tick chọn "Yêu cầu chứa chữ hoa" | 1 | Số lượng ký tự chữ hoa tối thiểu cần có. |
| Yêu cầu chứa chữ thường | NUMBER(1) | Có | Có | Phải có ít nhất 1 chữ thường (a-z). |
| Số lượng chữ thường tối thiểu | NUMBER | Khi tick chọn "Yêu cầu chứa chữ thường" | 1 | Số lượng ký tự chữ thường tối thiểu cần có. |
| Yêu cầu chứa số | NUMBER(1) | Có | Có | Phải có ít nhất 1 chữ số (0-9). |
| Số lượng số tối thiểu | NUMBER | Khi tick chọn "Yêu cầu chứa số" | 1 | Số lượng chữ số tối thiểu cần có. |
| Yêu cầu chứa ký tự đặc biệt | NUMBER(1) | Có | Có | Phải có ít nhất 1 ký tự đặc biệt. |
| Số lượng ký tự đặc biệt tối thiểu | NUMBER | Khi tick chọn "Yêu cầu chứa ký tự đặc biệt" | 1 | Số lượng ký tự đặc biệt tối thiểu cần có. |
| Các ký tự đặc biệt cho phép | VARCHAR2(50) | Khi tick chọn "Yêu cầu chứa ký tự đặc biệt" | !@#$%^&* | Danh sách các ký tự đặc biệt được sử dụng. |
| Không chứa tên đăng nhập | NUMBER(1) | Có | Có | Không cho phép mật khẩu chứa toàn bộ hoặc một phần tên đăng nhập (Username). |
| Không sử dụng mật khẩu phổ biến | NUMBER(1) | Có | Có | Ngăn chặn việc sử dụng các mật khẩu dễ đoán, nằm trong danh sách các mật khẩu phổ biến (123456, password, admin...). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Cập nhật chính sách mật khẩu và làm mới hiển thị. |
| 2 | CN02 | Button text | Khôi phục thiết lập về quy tắc mặc định. |

### 4.9.2.3. PM07.QLHT.CHHT.MH18 – Sao lưu dự phòng
#### 4.9.2.3.1. MH18 Màn hình danh sách bản sao lưu
##### Màn hình
- Màn hình:

![Sao lưu dự phòng (HA17)](./images/MH18_saoluuduphong.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 17 - Màn hình sao lưu (Backup / Restore) hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên bản sao lưu | VARCHAR2(255) | - | - | Tên file sao lưu định danh. |
| Kích thước | VARCHAR2(50) | - | - | Dung lượng của bản sao lưu (VD: 2.5 GB). |
| Phân loại | VARCHAR2(20) | - | - | Loại sao lưu (Tự động / Thủ công). |
| Trạng thái | VARCHAR2(50) | - | - | Trạng thái hiện tại của quá trình sao lưu (Hoàn thành / Lỗi / Đang xử lý). |
| Thời gian bắt đầu | DATE | - | - | Thời điểm bắt đầu tiến trình sao lưu. |
| Thời gian kết thúc | DATE | - | - | Thời điểm hoàn tất tiến trình sao lưu. |
| Người thực hiện | VARCHAR2(100) | - | - | Tên admin đã kích hoạt (nếu là thủ công) hoặc "System" (nếu là tự động). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Thực thi tiến trình sao lưu dự phòng thủ công ngay thời điểm hiện tại. |
| 2 | CN02 | Button icon | Tải file sao lưu về máy để lưu trữ cục bộ. |
| 3 | CN03 | Button icon | Mở màn hình xác nhận phục hồi toàn bộ dữ liệu từ bản sao lưu này. |
| 4 | CN04 | Button icon | Xem thông tin chi tiết của bản ghi sao lưu. |
| 5 | CN05 | Button icon | Mở popup xác nhận xóa bản ghi sao lưu và file tương ứng trên hệ thống. |

#### 4.9.2.3.2. MH18.P01 Màn hình Xác nhận phục hồi dữ liệu
##### Màn hình
- Màn hình: (Cửa sổ cảnh báo)

![Xác nhận phục hồi (HA18)](./images/MH18_P01_phuchoi_dulieu.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 18 - Màn hình xác nhận phục hồi hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo khôi phục | VARCHAR2(500) | - | - | Đặt ra câu hỏi xác nhận kèm một số điểm rủi ro: Quá trình này không thể hoàn tác, tất cả dữ liệu từ sau thời điểm sao lưu sẽ bị xóa, người dùng cần xác nhận bằng cách nhập chữ "Khôi phục dữ liệu". |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Tiến hành khôi phục dữ liệu hệ thống từ file backup. |
| 2 | CN02 | Button text | Hủy thao tác và đóng cửa sổ. |

## 4.9.3. PM07.QLHT.NK – Quản lý nhật ký

### 4.9.3.1. PM07.QLHT.NK.MH19 – Nhật ký truy cập
#### 4.9.3.1.1. MH19 Màn hình danh sách nhật ký truy cập
##### Màn hình
- Màn hình:

![Nhật ký truy cập (HA19)](./images/MH19_nhatky_truycap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 19 - Báo cáo nhật ký truy cập hệ thống đăng nhập/đăng xuất</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tài khoản | VARCHAR2(100) | - | - | Họ tên và Username của người dùng. |
| Thời gian | DATE | - | - | Thời điểm đăng nhập/đăng xuất/thao tác. |
| Sự kiện | VARCHAR2(50) | - | - | Loại sự kiện (Ví dụ: Đăng nhập, Đăng xuất, Đăng nhập thất bại). |
| Trình duyệt/Thiết bị | VARCHAR2(255) | - | - | Thông tin về trình duyệt (Chrome, Firefox...) và Hệ điều hành. |
| Địa chỉ IP | VARCHAR2(50) | - | - | Địa chỉ IP máy trạm của người dùng. |
| Trạng thái | VARCHAR2(20) | - | - | Thành công / Thất bại. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lọc danh sách theo Từ khóa (Tài khoản, IP), Loại sự kiện, Khoảng thời gian, và Trạng thái. |
| 2 | CN02 | Button icon | Mở màn hình xem chi tiết thông tin của bản ghi truy cập lưu vết. |
| 3 | CN03 | Button text | Tải danh sách nhật ký đang lọc ra file Excel. |

#### 4.9.3.1.2. MH19.P01 Màn hình Chi tiết truy cập
##### Màn hình
- Màn hình:

![Chi tiết truy cập (HA20)](./images/MH19_P01_chitiet_truycap.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 20 - Màn hình chi tiết truy cập hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thông tin chung | VARCHAR2(500) | - | - | Bao gồm Thời gian, Sự kiện, Trạng thái. |
| Phân tích thiết bị | VARCHAR2(1000) | - | - | Chi tiết địa chỉ IP, User Agent, Trình duyệt, Hệ điều hành và Ước tính vị trí địa lý. |
| Dữ liệu giao thức | CLOB | - | - | Toàn bộ payload hoặc payload header của phiên truy cập. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng cửa sổ chi tiết. |

### 4.9.3.2. PM07.QLHT.NK.MH20 – Nhật ký các lỗi phát sinh
#### 4.9.3.2.1. MH20 Màn hình danh sách lỗi
##### Màn hình
- Màn hình:

![Nhật ký lỗi (HA21)](./images/MH20_nhatky_loi.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 21 - Màn hình theo dõi các Exception lỗi hệ thống</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã lỗi | VARCHAR2(50) | - | - | Mã định danh duy nhất của lỗi phục vụ tra cứu. |
| Thời gian | DATE | - | - | Thời điểm phát sinh lỗi. |
| Mức độ | VARCHAR2(50) | - | - | Các mức độ: Nghiêm trọng (Critical), Lỗi (Error), Cảnh báo (Warning), Thông tin (Info). |
| Module | VARCHAR2(255) | - | - | Phân hệ (API, DB, UI...) hoặc component xảy ra lỗi. |
| Thông điệp lỗi | VARCHAR2(1000) | - | - | Tóm tắt nguyên nhân hoặc text ngắn của lỗi đó. |
| Trạng thái xử lý | VARCHAR2(50) | - | - | Tình trạng theo dõi (Chưa xử lý, Đang kiểm tra, Đã khắc phục). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Tìm kiếm theo Từ khóa, Mức độ ưu tiên, Khoảng thời gian, và Trạng thái xử lý. |
| 2 | CN02 | Button icon | Mở màn hình xem toàn văn chi tiết của lỗi và stacktrace đi kèm. |
| 3 | CN03 | Button icon | Đánh dấu lỗi đã được khắc phục/bỏ qua. |
| 4 | CN04 | Button text | Xuất dữ liệu lỗi đang hiển thị ra file Excel. |

#### 4.9.3.2.2. MH20.P01 Màn hình Chi tiết lỗi phát sinh
##### Màn hình
- Màn hình: (Popup hiển thị Stacktrace)

![Chi tiết lỗi (HA22)](./images/MH20_P01_chitiet_loi.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 22 - Màn hình xem chi tiết log lỗi</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thông tin cơ bản | VARCHAR2(500) | - | - | Bao gồm Thời gian, Mức độ, Mã lỗi, Module, Trạng thái. |
| Thông điệp lỗi trực tiếp | VARCHAR2(1000) | - | - | Tóm tắt Text Exception. |
| Chi tiết Stacktrace | CLOB | - | - | Nội dung chi tiết call stack từ môi trường server phục vụ việc debug. |
| Thông tin Client/Request | VARCHAR2(1000) | - | - | Payload yêu cầu, IP truy vấn (nếu có tham gia của client). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Cập nhật trạng thái lỗi này sang "Đã khắc phục". |
| 2 | CN02 | Button text | Copy toàn văn đoạn Stacktrace lỗi ra clipboard. |
| 3 | CN03 | Button text | Tắt màn hình chi tiết. |

### 4.9.3.3. PM07.QLHT.NK.MH21 – Nhật ký quản lý tài khoản
#### 4.9.3.3.1. MH21 Màn hình danh sách nhật ký tài khoản
##### Màn hình
- Màn hình:

![Nhật ký tài khoản (HA23)](./images/MH21_nhatky_taikhoan.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 23 - Nhật ký giám sát thay đổi trạng thái user</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Người thực hiện | VARCHAR2(100) | - | - | Họ tên và định danh của admin thao tác. |
| Thời gian | DATE | - | - | Thời điểm thực hiện hành động. |
| Tác vụ | VARCHAR2(100) | - | - | Phân loại tác vụ (Tạo tài khoản, Xóa, Khóa, Mở khóa, Đổi mật khẩu, Thay đổi quyền...). |
| Tài khoản đích | VARCHAR2(50) | - | - | Tài khoản bị tác động bởi hành động. |
| Chi tiết | VARCHAR2(1000) | - | - | Mô tả ngắn gọn thay đổi đã xảy ra. |
| IP người thực hiện | VARCHAR2(50) | - | - | Địa chỉ IP của máy admin dùng để thao tác. |
| Trạng thái | VARCHAR2(20) | - | - | Kết quả thực thi (Thành công / Thất bại). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Tra cứu theo tài khoản, tác vụ, thời gian và trạng thái. |
| 2 | CN02 | Button icon | Mở popup xem chi tiết lý do và giá trị đã thay đổi (Old/New value). |
| 3 | CN03 | Button text | Tải danh sách nhật ký quản lý tài khoản theo cấu hình tìm kiếm. |

#### 4.9.3.3.2. MH21.P01 Màn hình Chi tiết nhật ký
##### Màn hình
- Màn hình:

![Chi tiết nhật ký tài khoản (HA24)](./images/MH21_P01_chitiet_nhatky.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 24 - Màn hình chi tiết thay đổi tài khoản</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thời gian, Trạng thái | VARCHAR2(500) | - | - | Thông tin chung của bản ghi lưu vết. |
| Tài khoản đích | VARCHAR2(255) | - | - | Chi tiết User bị tác động. |
| Người thực hiện | VARCHAR2(255) | - | - | Chi tiết Admin (Họ tên, Username, IP). |
| Chi tiết thay đổi | CLOB | - | - | Mô tả lý do (nếu có), chi tiết nội dung bị đổi, giá trị cũ (Old Value), giá trị mới (New Value). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng cửa sổ chi tiết. |

### 4.9.3.4. PM07.QLHT.NK.MH22 – Nhật ký thay đổi cấu hình
#### 4.9.3.4.1. MH22 Màn hình danh sách thay đổi cấu hình
##### Màn hình
- Màn hình:

![Nhật ký cấu hình (HA25)](./images/MH22_nhatky_cauhinh.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 25 - Nhật ký thay đổi tham số hệ thống chung</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thời gian | DATE | - | - | Thời điểm cấu hình bị sửa đổi. |
| Người thực hiện | VARCHAR2(100) | - | - | Quản trị viên thay đổi tham số. |
| Phân loại | VARCHAR2(50) | - | - | Hệ thống, Bảo mật, Mật khẩu, Giao diện... |
| Tham số | VARCHAR2(255) | - | - | Tên setting bị đổi (VD: Thời gian hết hạn phiên làm việc). |
| Giá trị cũ | VARCHAR2(1000) | - | - | Giá trị trước khi tiến hành cập nhật. |
| Giá trị mới | VARCHAR2(1000) | - | - | Giá trị được ghi đè mới. |
| Trạng thái | VARCHAR2(20) | - | - | Thành công / Thất bại. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button icon | Mở màn hình xác nhận Rollback trạng thái tham số về "Giá trị cũ". |
| 2 | CN02 | Button icon | Tham chiếu một số thông số thay đổi phức tạp trên hệ thống (dạng form/JSON). |
| 3 | CN03 | Button text | Tải danh sách thay đổi theo nhóm hệ thống ra file. |


## 4.9.4. PM07.QLHT.TKBC – Thống kê & báo cáo

### 4.9.4.1. PM07.QLHT.TKBC.MH23 – Xem biểu đồ thống kê
#### 4.9.4.1.1. MH23 Màn hình biểu đồ thống kê
##### Màn hình
- Màn hình:

![Xem biểu đồ thống kê (HA26)](./images/MH23_bieudothongke.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 26 - Màn hình báo cáo hoạt động hệ thống qua thị giác</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Thẻ thống kê tổng quan | VARCHAR2(500) | - | - | Thể hiện Tổng số bản ghi, Số lượng thành công, Thất bại và Tỷ lệ thành công. |
| Biểu đồ theo tháng | VARCHAR2(1000) | - | - | Có thể chuyển đổi hiển thị Cột/Đường biểu diễn độ biến động dữ liệu đồng bộ theo thời gian. |
| Phân bổ theo nguồn/hạng mục | VARCHAR2(1000) | - | - | Tỷ trọng bản ghi được phân chia theo nguồn (Đăng ký kinh doanh, Công chứng...). |
| Bảng dữ liệu chi tiết | CLOB | - | - | Bảng liệt kê chi tiết số lượng thực hiện theo từng tháng và tỷ lệ (tại chế độ Xem bảng). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lọc dữ liệu theo Hạng mục, Từ ngày - Đến ngày và Loại biểu đồ. |
| 2 | CN02 | Button text | Chuyển đổi giữa chế độ "Xem biểu đồ" và "Xem bảng dữ liệu". |
| 3 | CN03 | Button text | Tải hình ảnh biểu đồ hiện hành xuống máy tính (PNG). |
| 4 | CN04 | Button text | Xuất toàn bộ Dashboard ra tệp tin báo cáo. |
| 5 | CN05 | Button text | Tải dòng dữ liệu thống kê ra file Excel. |
| 6 | CN06 | Button icon | (Trong Xem bảng) Mở popup hiển thị chỉ tiêu lỗi/thành công chi tiết của một tháng báo cáo. |
