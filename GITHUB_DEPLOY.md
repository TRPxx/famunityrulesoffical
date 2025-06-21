# 📋 สร้าง GitHub Repository และ Deploy บน GitHub Pages

## 🔗 ขั้นตอนที่ 1: สร้าง Repository บน GitHub

1. **เปิด GitHub.com** และ login
2. **กดปุ่ม "New"** หรือ "+" -> "New repository"
3. **ตั้งค่า Repository:**
   - **Repository name**: `FamUnity-Rules`
   - **Description**: `Fam Unity Server Rules - Standalone Static Website`
   - **Visibility**: Public (เพื่อใช้ GitHub Pages ฟรี)
   - **✅ Add a README file**: ไม่ต้องเลือก (เรามีแล้ว)
   - **✅ Add .gitignore**: ไม่ต้องเลือก (เรามีแล้ว)
   - **✅ Choose a license**: MIT License (หรือตามต้องการ)

4. **กดปุ่ม "Create repository"**

## 🔗 ขั้นตอนที่ 2: เชื่อมต่อ Local กับ GitHub

หลังจากสร้าง repo แล้ว ให้คัดลอก URL ที่ GitHub แสดง (จะเป็น https://github.com/[username]/FamUnity-Rules.git)

จากนั้นรันคำสั่งต่อไปนี้:

```bash
# เพิ่ม remote origin
git remote add origin https://github.com/[YOUR_USERNAME]/FamUnity-Rules.git

# เปลี่ยน branch เป็น main
git branch -M main

# Push ขึ้น GitHub
git push -u origin main
```

## 🌐 ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages

1. **ไปที่ Repository** บน GitHub
2. **กดแท็บ "Settings"** (ด้านบนขวา)
3. **เลื่อนลงหา "Pages"** ในเมนูซ้าย
4. **ตั้งค่า Source:**
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
5. **กดปุ่ม "Save"**

## ✅ ขั้นตอนที่ 4: ตรวจสอบการ Deploy

- GitHub จะใช้เวลาประมาณ 2-5 นาทีในการ build
- เมื่อเสร็จแล้วจะมี URL แสดงขึ้น: `https://[username].github.io/FamUnity-Rules/`
- สถานะการ deploy จะแสดงใน Actions tab

## 🎯 ผลลัพธ์ที่จะได้:

- ✅ เว็บไซต์กฎ Fam Unity ใช้งานได้บน Internet
- ✅ URL สำหรับแชร์: `https://[username].github.io/FamUnity-Rules/`
- ✅ อัปเดตอัตโนมัติเมื่อ push โค้ดใหม่
- ✅ ฟรี! ไม่มีค่าใช้จ่าย
- ✅ HTTPS ปลอดภัย
- ✅ CDN เร็วทั่วโลก

---

**📌 หมายเหตุ**: แทนที่ `[YOUR_USERNAME]` ด้วย GitHub username ของคุณ
