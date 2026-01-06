# Stage 1: Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# ลงเฉพาะ production dependencies เพื่อประหยัดพื้นที่
RUN npm install --only=production

# Stage 2: Production stage
FROM node:18-alpine
WORKDIR /app

# ติดตั้ง Tesseract OCR บน Alpine (ขนาดเล็กกว่า Debian มาก)
RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    tesseract-ocr-data-tha

# ก๊อปปี้ node_modules จาก builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# กำหนด Environment ให้ Node รู้ว่าเรามี Tesseract อยู่ที่ไหน (ถ้าจำเป็น)
# ENV TESSDATA_PREFIX=/usr/share/tessdata

EXPOSE 8080
CMD ["node", "index.js"]