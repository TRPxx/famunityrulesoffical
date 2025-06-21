# 📋 Fam Unity Rules - Standalone Project

กฎและข้อกำหนดของ Fam Unity เซิร์ฟเวอร์ (แยกต่างหากจากระบบหลัก)

## � Live Demo
**🚀 ดูเว็บไซต์ได้ที่**: [GitHub Pages](https://[username].github.io/FamUnity-Rules/)

## �🎯 ข้อมูลโปรเจค

- **ชื่อ**: Fam Unity Rules  
- **ประเภท**: Static Website (กฎเซิร์ฟเวอร์เท่านั้น)
- **ไม่มี**: ระบบหลังบ้าน, ฐานข้อมูล, Admin Panel
- **วันที่สร้าง**: 22 มิถุนายน 2025
- **Deployment**: GitHub Pages (อัตโนมัติ)

## 📁 โครงสร้างไฟล์

```
FamUnity-Rules/
├── index.html                 ← หน้าหลักแสดงกฎ
├── styles/                    ← CSS สำหรับกฎ
│   ├── global.css            ← สไตล์หลัก
│   ├── rules.css             ← สไตล์เฉพาะกฎ
│   └── animations.css        ← เอฟเฟค
├── scripts/                   ← JavaScript
│   └── rules-loader.js       ← โหลดและแสดงกฎ
├── data/                      ← ข้อมูลกฎ (JSON)
│   ├── new-player-rules.json      ← กฎผู้เล่นใหม่
│   ├── roleplay-rules.json        ← กฎ Roleplay
│   ├── server-country-rules.json  ← กฎเซิร์ฟเวอร์
│   ├── stream-snipe-rules.json    ← กฎ Stream Snipe
│   ├── rules-config.json          ← การตั้งค่า
│   └── particles-config.json      ← พื้นหลังเอฟเฟค
├── assets/                    ← รูปภาพและไฟล์
│   └── images/               ← รูปภาพต่างๆ
└── README.md                  ← คู่มือนี้
```

## 🚀 วิธีการใช้งาน

### 1. เปิดใช้งานทันที
```bash
# เปิดไฟล์ index.html ด้วยเบราว์เซอร์
start index.html
```

### 2. สำหรับเว็บเซิร์ฟเวอร์
```bash
# อัปโหลดไฟล์ทั้งหมดไปยัง hosting
# เข้าถึงผ่าน http://yourdomain.com/
```

### 3. เซิร์ฟเวอร์ท้องถิ่น (Local Server)
```bash
# Python
python -m http.server 3000

# Node.js (หากติดตั้ง http-server)
npx http-server -p 3000

# จากนั้นเปิด: http://localhost:3000
```

## 📝 ประเภทกฎที่มี

### 🔰 กฎพื้นฐาน
- **กฎผู้เล่นใหม่** - แนวทางสำหรับผู้เล่นใหม่
- **กฎ Roleplay** - การเล่นบทบาทสมจริง
- **กฎเซิร์ฟเวอร์** - ข้อบังคับประจำเซิร์ฟเวอร์

### ⭐ กฎพิเศษ
- **กฎ Stream Snipe** - การไล่ตาม Streamer

## 🎨 คุณสมบัติ

### ✅ ที่มี:
- 📱 **Responsive Design** - ใช้งานได้ทุกอุปกรณ์
- 🔍 **ค้นหากฎ** - ค้นหาภายในกฎได้
- 🎯 **Navigation** - เมนูแบ่งหมวดหมู่
- ✨ **เอฟเฟคพื้นหลัง** - Particles animation
- 🎨 **UI สวยงาม** - Gradient และ Glass effect
- ⚡ **โหลดเร็ว** - ไม่ต้องฐานข้อมูล

### ❌ ที่ไม่มี:
- 🚫 **Admin Panel** - ไม่มีระบบหลังบ้าน
- 🚫 **Database** - ไม่ต้องฐานข้อมูล
- 🚫 **User System** - ไม่มีระบบผู้ใช้
- 🚫 **PHP/Server** - ใช้ HTML/CSS/JS เท่านั้น

## 🔧 การแก้ไขกฎ

### วิธีเพิ่ม/แก้ไขกฎ:
1. เปิดไฟล์ JSON ที่ต้องการใน `data/`
2. แก้ไขข้อมูลในรูปแบบ JSON
3. บันทึกไฟล์
4. รีเฟรชหน้าเว็บ

### รูปแบบข้อมูลกฎ:
```json
{
  "title": "ชื่อกฎ",
  "description": "คำอธิบาย",
  "icon": "fas fa-icon",
  "color": "blue",
  "rules": [
    {
      "id": "rule-1",
      "title": "กฎข้อ 1",
      "content": "รายละเอียดกฎ",
      "penalty": "บทลงโทษ",
      "examples": ["ตัวอย่าง 1", "ตัวอย่าง 2"]
    }
  ]
}
```

## 🌐 การใช้งานบน Hosting

### Static Hosting แนะนำ:
- **GitHub Pages** - ฟรี
- **Netlify** - ฟรี + รองรับ custom domain
- **Vercel** - ฟรี + deployment อัตโนมัติ
- **Firebase Hosting** - ฟรี
- **Surge.sh** - ฟรี

### การ Deploy:
1. อัปโหลดไฟล์ทั้งหมดไปยัง hosting
2. ตั้งค่า index.html เป็นหน้าหลัก
3. เสร็จ! ไม่ต้องตั้งค่าอะไรเพิ่ม

## 📊 ข้อมูลเทคนิค

- **ภาษา**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: ไม่มี (Vanilla JS)
- **Dependencies**: 
  - Font Awesome (Icons)
  - Google Fonts (Typography)
  - Particles.js (Background effects)
- **ขนาดโปรเจค**: ~2-5 MB
- **Browser Support**: Chrome, Firefox, Safari, Edge (Modern browsers)

## 🔄 การอัปเดต

### จากโปรเจคหลัก:
หากต้องการ sync กฎจากโปรเจคหลัก Fam Unity:
1. คัดลอกไฟล์ JSON ใหม่จาก `RuleFamUnity/src/data/`
2. วางใน `FamUnity-Rules/data/`
3. รีเฟรชหน้าเว็บ

## 📞 การสนับสนุน

- **ประเภท**: โปรเจคแยกต่างหาก (Standalone)
- **การอัปเดต**: Manual เท่านั้น
- **การบำรุงรักษา**: แก้ไขไฟล์ JSON โดยตรง

---

## 🎉 สรุป

โปรเจค **FamUnity-Rules** เป็นเว็บไซต์แสดงกฎแบบ Static ที่:
- ✅ **ใช้งานง่าย** - เปิดไฟล์ HTML ได้เลย
- ✅ **ไม่ซับซ้อน** - ไม่ต้องระบบหลังบ้าน
- ✅ **รวดเร็ว** - โหลดเร็ว ไม่ต้อง server
- ✅ **ปรับแต่งได้** - แก้ไข JSON ได้ง่าย
- ✅ **Deploy ง่าย** - อัปโหลดไฟล์ไปยัง hosting ใดก็ได้

**เหมาะสำหรับ**: การแสดงกฎเซิร์ฟเวอร์แบบเรียบง่าย ไม่ต้องการระบบจัดการที่ซับซ้อน

---

**© 2025 Fam Unity. สงวนลิขสิทธิ์ทุกประการ**
