# Chuyển LAMI từ Netlify sang GitHub Pages + Formspree

> Không thay đổi DNS trước khi GitHub Pages build thành công. Source of truth: nhánh `main` trong repository `khanhpn308/landing_page`.

## 1. Triển khai GitHub Pages

1. Vào GitHub repository → **Settings → Pages**.
2. Dưới **Build and deployment**, chọn **Source: GitHub Actions**.
3. Review/merge PR chuyển nền tảng vào `main`.
4. GitHub Actions sẽ chạy workflow **Deploy React to GitHub Pages** và upload thư mục `dist`.
5. Kiểm tra URL thử nghiệm: `https://khanhpn308.github.io/landing_page/`. Chỉ tiếp tục khi JS, hình nền, các section, menu và font tải được.

Workflow dùng `npm run build -- --base=./`; ảnh được tham chiếu theo `import.meta.env.BASE_URL` để chạy ở cả thư mục `/landing_page/` lẫn tên miền gốc. Không có Netlify credits cho workflow mới này.

## 2. Kết nối nhận hồ sơ Join Us bằng Formspree Free

Github Pages chỉ host file tĩnh, không xử lý POST của form trực tiếp. Formspree cần được tạo riêng.

1. Truy cập https://formspree.io → tạo tài khoản Free → tạo form **join-us**.
2. Chọn email nhận thông báo `contact@lam-i.tech`; xác minh địa chỉ email theo hướng dẫn Formspree. Trước đó phải kiểm tra email forwarding Name.com hoạt động.
3. Formspree cung cấp endpoint như `https://formspree.io/f/xxxxxxxx`; phần `xxxxxxxx` là **form ID**.
4. Vào GitHub repository → **Settings → Secrets and variables → Actions → Variables → New repository variable**.
5. Name: `VITE_FORMSPREE_FORM_ID`. Value: **chỉ form ID**, không nhập cả URL.
6. Vào **Actions → Deploy React to GitHub Pages → Run workflow** hoặc push code lên `main` để build lại, đưa ID vào bundle frontend.
7. Trên website thử nghiệm, gửi một bộ dữ liệu kiểm thử không nhạy cảm → xác nhận submission xuất hiện trong Formspree → xác nhận email thông báo đến Gmail qua forwarding.

Không phải API secret: Formspree Form ID được nhúng công khai trong frontend theo kiến trúc dịch vụ. Không đưa API private key hoặc mật khẩu lên biến `VITE_*`.

Formspree Free: 50 submissions/tháng, chỉ giữ 30 ngày lịch sử trong inbox miễn phí; nên định kỳ xuất dữ liệu và cân nhắc hạn mức.

Nếu chưa cấu hình Form ID, nút Gửi đăng ký bị vô hiệu hóa và có thông báo rằng chức năng đang được cấu hình. **Không hiển thị thành công giả.**

## 3. Chuyển tên miền `lam-i.tech` (Name.com)

Chỉ đổi DNS sau khi GitHub Pages thử nghiệm tốt:

1. Vào **Settings → Pages → Custom domain** trong repo, nhập `lam-i.tech` → Save. Thao tác này phải làm **trước khi đổi DNS**, để tránh hijack domain.
2. Name.com → **Manage DNS Records**:
   - Xóa/thay **A** của `lam-i.tech` hiện đang trỏ Netlify `75.2.60.5`.
   - Thêm bốn **A** cho root `lam-i.tech` (Name.com thường Host để trống): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Thay **CNAME** `www` từ Netlify thành `khanhpn308.github.io` (không có `/landing_page/`).
   - **KHÔNG đổi nameserver** khỏi Name.com nếu dùng Name.com Email Forwarding. **KHÔNG xóa** bản ghi MX/SPF/TXT của email.
3. Kiểm tra `nslookup lam-i.tech 1.1.1.1` và `nslookup -type=CNAME www.lam-i.tech 1.1.1.1`.
4. Sau khi GitHub Pages cấp HTTPS, kiểm tra `https://lam-i.tech`, `https://www.lam-i.tech` và toàn bộ ảnh/JS.
5. Chỉ khi website chính thức đã chạy tốt mới gỡ domain khỏi Netlify nếu muốn; không xóa Netlify trước khi chuyển xong.

## 4. Rollback

Nếu GitHub Pages chưa hoạt động sau khi đổi DNS:
- Khôi phục A root về `75.2.60.5` và CNAME www về `snazzy-liger-dea6d2.netlify.app`, với điều kiện Netlify project còn giữ domain và bản deploy trước vẫn Published.
- Không thay đổi email forwarding/MX trong rollback.
- Chú ý bản Netlify cũ vẫn là Join Us demo; không giả định hệ thống nhận form hoạt động sau rollback.

Tài liệu: https://vite.dev/guide/static-deploy.html · https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site · https://formspree.io/plans/
