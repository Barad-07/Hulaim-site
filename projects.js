/* ==========================================================================
   المشاريع — Selected work
   لإضافة مشروع: انسخ أي مشروع من { إلى } مع الفاصلة بعده، وغيّر قيمه.
   الترتيب هنا هو ترتيب الظهور في الموقع. العدد والسنوات في الموقع تتحدّث تلقائيًا.

   الحقول:
     t       اسم المشروع
     y       السنة
     r       الدور (يظهر بجانب الاسم وفي صفحة المشروع)
     client  العميل
     stack   الأدوات
     d       وصف قصير لصفحة المشروع
     img     (اختياري) صورة المشروع، مثل 'images/saltline.jpg' — بنسبة 4:5 تقريبًا
     gallery (اختياري) صور إضافية لصفحة المشروع، مثل ['images/saltline-2.jpg', 'images/saltline-3.jpg']
   بدون img يُستخدم رسم تجريدي تلقائيًا.
   ========================================================================== */
const works = [
  {t:'Barad Site', y:'2025', r:'Web design & build', client:'Barad', stack:'WordPress, Elementor, GSAP',
   d:'A calm, typographic site for a maritime law practice. Case results lead, contact paths are short, and the team can edit every page themselves.',
   img:'images/Barad-Site.png'},  {t:'Foamwork', y:'2025', r:'Brand site & booking', client:'Car wash group', stack:'WordPress, custom booking form',
   d:'A multi-branch car wash site where picking a location and a wash takes three taps. Loud on the street, quiet on the screen.'},
  {t:'Quire', y:'2024', r:'Product design & tooling', client:'Self-initiated', stack:'Open source, right-to-left UI',
   d:'A private, in-browser PDF toolkit with full Arabic support. Merge, split and sign without a file ever leaving the device.'},
  {t:'Dunes After Dark', y:'2024', r:'Motion & title design', client:'Documentary series', stack:'After Effects, Blender',
   d:'Opening titles and lower thirds for a six-part desert documentary. Slow sand-wave typography built from layered displacement.'},
  {t:'Maktab Studio', y:'2023', r:'Portfolio system', client:'Architecture studio', stack:'WordPress, Elementor, ScrollTrigger',
   d:'A portfolio system for an architecture office with hundreds of projects. Filterable, image-first and easy to keep current.'}
];
