# Hulaim — Portfolio

موقع ثابت (HTML/CSS/JS في ملف واحد: `index.html`). لا يحتاج `npm` ولا بناء.

## النشر على Cloudflare Pages (مرة واحدة)
1. ارفع هذا المجلد إلى مستودع جديد في GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → اختر المستودع.
3. الإعدادات:
   - Framework preset: **None**
   - Build command: **(فارغ)**
   - Build output directory: **/**
4. Save and Deploy.

## التحديث
أي تعديل → `git add . && git commit -m "update" && git push` → يُنشر تلقائيًا.

## التشغيل محليًا
افتح `index.html` في المتصفح، أو في VS Code استخدم إضافة Live Server.

## إضافة مشروع
1. افتح `projects.js`، وانسخ أي مشروع من `{` إلى `},` والصقه حيث تريد ظهوره.
2. غيّر القيم: `t` الاسم، `y` السنة، `r` الدور، `client`، `stack`، `d` الوصف.
3. صورة (اختياري): ضع الملف في `images/` واكتب `img: 'images/اسم-الصورة.jpg'`،
   ولصور صفحة المشروع: `gallery: ['images/a.jpg', 'images/b.jpg']`. بدون صورة يظهر رسم تجريدي.
4. احفظ، ثم `git add . && git commit -m "مشروع جديد" && git push`.

عدد المشاريع في القائمة وسنواتها يتحدّثان تلقائيًا. لحذف مشروع: احذف كتلته من `projects.js`.
