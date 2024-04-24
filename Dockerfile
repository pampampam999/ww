# Gunakan image Node.js sebagai dasar
FROM node:20.12.2-buster

# Atur direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin package.json dan pnpm-lock.yaml (atau pnpmfile.js) ke dalam direktori kerja
COPY package.json pnpm-lock.yaml* ./

# Instal dependensi menggunakan pnpm
RUN npm install -g pnpm && \
    pnpm install

# Salin semua file proyek ke dalam direktori kerja
COPY . .

# Ekspos port yang diperlukan oleh aplikasi Anda
EXPOSE 3000

# Perintah untuk menjalankan aplikasi Anda
CMD ["pnpm", "start"]
