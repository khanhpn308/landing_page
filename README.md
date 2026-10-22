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
