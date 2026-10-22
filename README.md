# Lab for Autonomous Machines & IoT — Landing Page

Bản dựng React/Vite dựa trên 5 mockup đã chốt: Hero, About Us, Learning Paths, Projects, Roadmap. Bao gồm biểu mẫu Join Us dạng demo (CHƯA lưu/gửi dữ liệu).

## Chạy local

```bash
npm install
npm run dev
```

Mở URL do Vite in ra (thường là http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Cấu trúc

- `src/App.jsx`: component React, menu, section, bộ lọc dự án, form demo
- `src/styles.css`: design tokens, responsive, CSS của từng section
- `public/assets/`: hình ảnh đã cắt từ ảnh mockup để dựng bản đầu
- `references/`: 5 ảnh đối chiếu gốc đã chốt

## Tái hiện sát ảnh mẫu

Mockup là ảnh phẳng (không phải thiết kế Figma có layer), vì vậy không thể suy ra tuyệt đối font, tọa độ và ảnh gốc. Bản dựng ưu tiên các component thật, tự co giãn. Cắt ảnh từ screenshot là giải pháp tạm thời; để đạt độ khớp cao hơn, thay bằng ảnh thiết bị, hình nền hero, logo vector và photography chất lượng gốc.

Viewport để kiểm tra lấy đúng theo từng ảnh tham chiếu (đa số là 1536 × 1024; riêng About có kích thước khác), Chrome với zoom 100%. Lưu screenshot và so với từng `references/*.png`. Căn từng section theo thứ tự: ảnh → kích thước container → layout → font & line-height → spacing → chi tiết.

Chú ý: chưa xác minh tên font được dùng trong ảnh sinh; `Inter` là font gần giống, có fallback sans-serif. Nếu không có Internet ở máy chạy, trình duyệt dùng fallback cho tới khi tải được Inter.

## Những thứ chưa kết nối

- Form Join Us chưa có API, database, email hoặc hệ thống chống spam. Sau khi bấm đăng ký, UI nói rõ đây chỉ là demo.
- Các dự án và tiến độ trong ảnh là nội dung minh họa. Hãy xác nhận thông tin trước khi công bố.
- Dùng ảnh mẫu làm nội dung hình ảnh chỉ ở giai đoạn dựng bố cục; thay các ảnh có chữ UI bị cắt nếu cần production.
- Không dùng nguyên screenshot làm nền toàn bộ trang vì nó khiến nội dung không responsive, khó truy cập, và nút không hoạt động.

## Visual regression

Đối chiếu 1 section so với ảnh gốc bằng Playwright + Pillow:

```bash
pip install playwright pillow
python -m playwright install chromium
python scripts/visual_regression.py --url http://localhost:5173 \
  --section learning --reference references/03-learning.png
```

Ảnh `artifacts/learning-overlay.png` pha 50% ảnh thật và ảnh chuẩn để thấy rõ chỗ lệch. Lưu ý mockup là ảnh render, nên cần đánh giá theo bố cục và thành phần, không chỉ theo sai khác từng pixel.

## V1.1 correction (Hero + menu)

- Thay `hero-machines.webp` bằng bản crop **không còn phần chữ gốc sót lại** trên nền ảnh; typography/nút vẫn là React HTML.
- Sửa logic navigation active theo vị trí cuộn thật; tải đầu trang phải active `Home`.
- Khôi phục khoảng trắng rõ ràng trước `Real-World` của tiêu đề About.
- Kiểm tra bằng Chrome Zoom **100%** (Ctrl+0); mockup tham chiếu 1536×1024, browser screenshot ở zoom khác làm kích thước trông sai.

Bản này vẫn là starter. Cần hiệu chỉnh tiếp sau khi có ảnh screenshot trình duyệt tại zoom 100%.


## Visual QA desktop + mobile (branch qa/visual-desktop-mobile-v1)

Chạy hai terminal trong thư mục dự án. Terminal 1:

```bash
npm ci
npm run dev
```

Terminal 2 (đã tạo và kích hoạt `.venv`):

```bash
source .venv/bin/activate
python -m pip install playwright pillow
python -m playwright install chromium
python scripts/visual_qa.py --url http://127.0.0.1:5173
```

Đầu ra nằm trong `artifacts/visual-qa/`:
- `home/about/learning/projects/roadmap-actual.png`: ảnh chụp desktop ở **đúng kích thước từng reference** (About: 1672×941; các mẫu khác: 1536×1024).
- `*-overlay.png`: ảnh chồng 50% bản thật và bản mẫu; `*-diff.png`: heatmap sai lệch.
- `768x1024-*.png`, `390x844-*.png`, `320x700-*.png`: hình tablet, mobile và small-mobile.
- `REPORT.md`, `results.json`: chỉ số chênh lệch pixel, cảnh báo tràn ngang, ảnh lỗi, anchor lỗi và kết quả thử tương tác.

**Quy trình nghiệm thu:** chụp ở Chrome zoom 100%, kiểm tra Hero → About → Learning → Projects → Roadmap; chỉnh CSS theo overlay và chạy lại. Điểm khác biệt pixel là tín hiệu chẩn đoán, **không** thể dùng để chứng minh pixel-perfect tuyệt đối vì nguồn tham chiếu là ảnh AI.

**Trạng thái:** các chỉnh sửa CSS và kịch bản QA ở đây chưa được xác nhận trên trình duyệt WSL của bạn; phải chạy lệnh trên và review ảnh trước khi merge. Form Join Us vẫn chỉ là demo.


## Đổi logo Lab

Logo hiện là các file SVG riêng, **không** còn vẽ inline trong `src/App.jsx`:

- `public/assets/logo-light.svg`: logo cho navbar **nền tối**, bao gồm Home, About, Learning và Projects.
- `public/assets/logo-dark.svg`: logo cho navbar **nền sáng** (Roadmap) và favicon của trình duyệt.

Thay hai file cùng tên bằng SVG mới, giữ kích thước tỉ lệ `viewBox` phù hợp. Tên "Lab for Autonomous Machines & IoT" vẫn là văn bản HTML trong component `Logo()`, với màu chữ tự đổi theo nền. Để thay cả chữ, chỉnh `src/App.jsx`. Kích thước biểu tượng là `.brand-mark` trong `src/styles.css`. Nếu muốn favicon riêng, sửa `<link rel="icon">` trong `index.html`.

Làm mới Chrome bằng **Ctrl + Shift + R** sau khi đổi file để loại cache SVG.

## Join Us — Four Specialization Tracks (recruitment UX)

Thông điệp tuyển thành viên chính: **Một thành viên – Một hướng chuyên môn chính**.

Các hướng được chọn khi ứng tuyển:
1. **Embedded Systems** — Hardware / Firmware
2. **Web Application** — Backend / Frontend / Database
3. **Mobile Application** — Mobile / Cross-platform
4. **AI & Predictive Maintenance** — Machine Learning / Data Analytics

Luồng giao diện:
- Hero có liên kết đến `#tracks`; section **One Lab. Four Tracks.** nằm sau About và trước Learning.
- Bốn thẻ chuyên môn trỏ đến `#join` và chọn sẵn hướng tương ứng.
- Bước 1 của Join Us bắt buộc chọn đúng một hướng chuyên môn. Không thể chuyển sang bước 2 nếu chưa chọn.
- Bước 2 thu thập họ tên, năm nhập học, điện thoại và email; hiển thị hướng đã chọn, cho phép quay lại thay đổi.
- Trạng thái form được giữ khi chuyển qua lại giữa hai bước.
- **Không có backend**: nút Gửi đăng ký không gửi/lưu dữ liệu. UI thông báo minh bạch rằng đây là demo. Khi triển khai API, cần gửi `specialization` cùng các trường liên hệ và xử lý loading/success/error thực sự.

Checklist nghiệm thu:
- Trên desktop, tablet và mobile 320px: bốn thẻ không tràn ngang; menu nav thu gọn khi đủ hẹp.
- Chọn từng thẻ ở section dẫn về form với đúng lựa chọn; đổi lựa chọn trong form và quay lại bước 1.
- Không thể đi bước 2 khi chưa chọn hướng. Bước 2 cần nhập đúng tất cả trường bắt buộc.
- Tab/keyboard và focus ring hoạt động với thẻ, radio, nút Tiếp tục và Quay lại.
- Chạy `npm ci && npm run build`, kiểm thử giao diện và form ở cả mobile và desktop trước khi merge.
