// --- BILINGUAL SCRIPT ---

const translations = {
  vi: {
    logo_text: "blubooth",
    nav_home: "Trang chủ",
    nav_about: "Về chúng tôi",
    nav_contact: "Liên hệ", // Thêm bản dịch cho liên hệ
    nav_privacy: "Chính sách",
    nav_layout: "Chọn Layout",
    nav_customize: "Tùy chỉnh",
    main_title: "Lưu Giữ Khoảnh Khắc Cùng Blubooth",
    main_desc: "Capture the moment, cherish the magic",
    main_tagline: "Bạn không cần phải là người mẫu — chỉ cần là chính mình, và để ánh đèn, phông nền và chiếc máy ảnh này làm bạn toả sáng. 💡👑",
    start_btn: "Bắt đầu",
    blubooth_title: "Blubooth Chụp Ảnh Vui Vẻ",
    footer_text: "Làm bởi Blu & Chippy",
    footer_tagline: "Góc lưu giữ những kỉ niệm quý giá của bạn 🥹🥰 <br> ❤️❤️",
    footer_quick_links: "Liên Kết Nhanh",
    footer_follow_us: "Theo Dõi Chúng Tôi",
    footer_copyright: "© 2024 Blubooth. Tất cả quyền được bảo lưu.",
    footer_telegram: "Telegram",
    footer_tiktok: "TikTok",
    // About page
    about_title: "Về Chúng Tôi",
    about_mission_title: "Sứ mệnh của chúng tôi",
    about_mission_text: "Chúng tôi mang đến những trải nghiệm chụp ảnh độc đáo và thú vị, giúp bạn lưu giữ những khoảnh khắc đẹp nhất trong cuộc sống. Với công nghệ hiện đại và giao diện thân thiện, chúng tôi cam kết tạo ra những bức ảnh chất lượng cao mà bạn sẽ trân trọng mãi mãi.",
    about_vision_text: "Trở thành nền tảng chụp ảnh trực tuyến hàng đầu, nơi mọi người có thể dễ dàng tạo ra những tác phẩm nghệ thuật từ những khoảnh khắc thường ngày. Chúng tôi hướng tới việc kết nối con người thông qua những hình ảnh đầy cảm xúc.",
    about_values_text: "Chất lượng, sáng tạo và trải nghiệm người dùng là ba trụ cột chính trong mọi sản phẩm của chúng tôi. Chúng tôi tin rằng công nghệ phải phục vụ con người, và mỗi tính năng được phát triển đều hướng tới việc mang lại niềm vui và sự hài lòng cho người dùng.",
    // Bản dịch cho trang Contact
    contact_title: "Liên hệ với chúng tôi",
    contact_send_message_title: "Gửi lời nhắn cho chúng tôi",
    contact_name_label: "Tên của bạn:",
    contact_email_label: "Email của bạn:",
    contact_message_label: "Lời nhắn của bạn:",
    contact_submit_btn: "Gửi lời nhắn",
    contact_details_title: "Thông tin liên hệ",
    contact_phone_label: "Điện thoại:",
    contact_email_info_label: "Email:",
    contact_address_label: "Địa chỉ:",
    // Bản dịch cho trang Privacy
    privacy_title: "Chính sách bảo mật",
    privacy_main_title: "Quyền riêng tư của bạn siêu quan trọng với tụi mình nha! 😊",
    privacy_main_text: "Blubooth không hề thu thập, lưu trữ hay chia sẻ bất kỳ dữ liệu hay ảnh cute của bạn đâu. Tất cả đều diễn ra ngay trên thiết bị của bạn thôi – ảnh của bạn an toàn trong trình duyệt, không đi lang thang đâu hết! 📸<br><br>Tụi mình chỉ xin phép dùng camera khi bạn cho phép, và ảnh chụp xong là của bạn mãi mãi. Không upload lén, không track gì hết, siêu an toàn và dễ thương luôn! 💕",
    // Bản dịch cho trang Customize
    customize_page_title: "Tùy chỉnh ảnh của bạn",
    customize_upload_title: "TẢI ẢNH LÊN",
    customize_upload_btn: "Tải Ảnh Lên",
    customize_upload_info: "Chọn nhiều ảnh từ thiết bị của bạn",
    customize_frame_title: "KHUNG ẢNH",
    customize_logo_title: "LOGO",
    customize_show_logo: "Hiển thị Logo",
    customize_language_label: "Ngôn ngữ:",
    customize_time_title: "THỜI GIAN",
    customize_show_time: "Hiển thị Thời gian",
    customize_format_label: "Định dạng:",
    customize_reset_btn: "Đặt Lại",
    customize_download_btn: "Tải Xuống Ảnh",
    customize_crop_title: "Cắt Ảnh",
    customize_cancel_btn: "Hủy",
    customize_apply_btn: "Áp Dụng",
    customize_preview_title: "Xem Trước Ảnh",
    customize_tools_title: "Tùy Chỉnh",
    strip_header: "Blubooth Photo Strip",
    frame_placeholder: "Khung ảnh",
    strip_footer: "Made with ❤️ by Blubooth",
    filters_title: "Bộ Lọc",
    filter_none: "Gốc",
    filter_vintage: "Vintage",
    filter_bw: "Đen Trắng",
    filter_sepia: "Sepia",
    filter_bright: "Sáng",
    filter_contrast: "Tương Phản",
    stickers_title: "Stickers",
    text_title: "Thêm Chữ",
    text_placeholder: "Nhập text...",
    add_text_btn: "Thêm Text",
    download_btn: "Tải Xuống",
    share_btn: "Chia Sẻ",
    // Bản dịch cho trang Canvas
    canvas_flip_btn: "Lật Ảnh",
    canvas_countdown_label: "Đếm ngược:",
    canvas_0_seconds: "0 giây",
    canvas_3_seconds: "3 giây",
    canvas_5_seconds: "5 giây",
    canvas_10_seconds: "10 giây",
    canvas_download_btn: "Tải Xuống",
    canvas_edit_btn: "Chỉnh Sửa",
    canvas_layout_title: "Bố Cục Ảnh",

    // Bản dịch cho trang Choose Layout
    choose_layout: "Chọn Bố Cục",
    layout_2_name: "2 Khung Dọc",
    layout_2_desc: "Khổ in 4x6 inch - Hai ảnh dọc với kích thước 4x2.75 inch",
    layout_3_name: "3 Khung Dọc",
    layout_3_desc: "Khổ in 2.5x7 inch - Ba ảnh dọc với kích thước 2.5x2.17 inch",
    layout_4_name: "4 Khung Dọc",
    layout_4_desc: "Khổ in 2x6 inch - Bốn ảnh dọc với kích thước 2x1.4 inch",
    layout_6_name: "Lưới 6 Khung",
    layout_6_desc: "Sáu khung ảnh sắp xếp dạng lưới 3x2",
    continue_btn: "Tiếp Tục"
  },
  en: {
    logo_text: "blubooth",
    nav_home: "Home",
    nav_about: "About",
    nav_contact: "Contact", // Thêm bản dịch cho liên hệ
    nav_privacy: "Privacy",
    nav_layout: "Choose Layout",
    nav_customize: "Customize",
    main_title: "Capture Moments with Blubooth",
    main_desc: "Capture the moment, cherish the magic",
    main_tagline: "You don't need to be a model — just be yourself, and let the lights, the background, and this camera make you shine. 💡👑",
    start_btn: "Start",
    blubooth_title: "Blubooth Fun Photo Booth",
    footer_text: "Made by Blu & Chippy",
    footer_tagline: "A little corner to cherish your dearest memories 🥹🥰❤️❤️",
    footer_quick_links: "Quick Links",
    footer_follow_us: "Follow Us",
    footer_copyright: "© 2024 Blubooth. All rights reserved.",
    footer_telegram: "Telegram",
    footer_tiktok: "TikTok",
    // About page
    about_title: "About Us",
    about_mission_title: "Our Mission",
    about_mission_text: "We bring unique and exciting photography experiences, helping you preserve the most beautiful moments in life. With modern technology and user-friendly interface, we are committed to creating high-quality photos that you will treasure forever.",
    about_vision_text: "To become the leading online photography platform where everyone can easily create works of art from everyday moments. We aim to connect people through emotional images.",
    about_values_text: "Quality, creativity and user experience are the three main pillars in all our products. We believe that technology must serve people, and every feature developed is aimed at bringing joy and satisfaction to users.",
    // Bản dịch cho trang Contact
    contact_title: "Contact Us",
    contact_send_message_title: "Send us a message",
    contact_name_label: "Your Name:",
    contact_email_label: "Your Email:",
    contact_message_label: "Your Message:",
    contact_submit_btn: "Send Message",
    contact_details_title: "Contact Information",
    contact_phone_label: "Phone:",
    contact_email_info_label: "Email:",
    contact_address_label: "Address:",
    // Bản dịch cho trang Privacy
    privacy_title: "Privacy Policy",
    privacy_main_title: "Your privacy matters!",
    privacy_main_text: "This Blubooth App does not collect, store, or share any of your data or photos. Everything happens locally on your device—your images never leave your browser.<br><br>The app only accesses your camera with your permission, and once you take your photos, they stay with you. No uploads, no tracking, no hidden storage.",
    // Bản dịch cho trang Customize
    customize_page_title: "Customize your photo",
    customize_upload_title: "UPLOAD PHOTOS",
    customize_upload_btn: "Upload Photos",
    customize_upload_info: "Select multiple photos from your device",
    customize_frame_title: "FRAME",
    customize_logo_title: "LOGO",
    customize_show_logo: "Show Logo",
    customize_language_label: "Language:",
    customize_time_title: "TIME",
    customize_show_time: "Show Time",
    customize_format_label: "Format:",
    customize_reset_btn: "Reset",
    customize_download_btn: "Download Photo",
    customize_crop_title: "Crop Photo",
    customize_cancel_btn: "Cancel",
    customize_apply_btn: "Apply",
    customize_preview_title: "Photo Preview",
    customize_tools_title: "Customize",
    strip_header: "Blubooth Photo Strip",
    frame_placeholder: "Photo frame",
    strip_footer: "Made with ❤️ by Blubooth",
    filters_title: "Filters",
    filter_none: "Original",
    filter_vintage: "Vintage",
    filter_bw: "Black & White",
    filter_sepia: "Sepia",
    filter_bright: "Bright",
    filter_contrast: "Contrast",
    stickers_title: "Stickers",
    text_title: "Add Text",
    text_placeholder: "Enter text...",
    add_text_btn: "Add Text",
    download_btn: "Download",
    share_btn: "Share",
    // Bản dịch cho trang Canvas
    canvas_flip_btn: "Flip Camera",
    canvas_countdown_label: "Countdown:",
    canvas_0_seconds: "0 seconds",
    canvas_3_seconds: "3 seconds",
    canvas_5_seconds: "5 seconds",
    canvas_10_seconds: "10 seconds",
    canvas_download_btn: "Download",
    canvas_edit_btn: "Edit",
    canvas_layout_title: "Photo Layout",

    // Bản dịch cho trang Choose Layout
    choose_layout: "Choose Layout",
    layout_2_name: "2-Frame Strip",
    layout_2_desc: "4x6 inch print - Two vertical photos sized 4x2.75 inch",
    layout_3_name: "3-Frame Strip",
    layout_3_desc: "2.5x7 inch print - Three vertical photos sized 2.5x2.17 inch",
    layout_4_name: "4-Frame Strip",
    layout_4_desc: "2x6 inch print - Four vertical photos sized 2x1.4 inch",
    layout_6_name: "6-Frame Grid",
    layout_6_desc: "Six frames arranged in 3x2 grid",
    continue_btn: "Continue"
  }
};

const setLanguage = (lang) => {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  // Set language attribute on html tag for accessibility
  document.documentElement.lang = lang;
  // Store preference in localStorage
  localStorage.setItem('blubooth_lang', lang);
  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // Add click listeners to language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
  // Check for saved language or default to Vietnamese
  const savedLang = localStorage.getItem('blubooth_lang') || 'vi';
  setLanguage(savedLang);
});
// --- END BILINGUAL SCRIPT ---
