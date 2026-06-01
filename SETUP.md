# Parfüm E-Ticaret Sitesi - Supabase Kurulum Rehberi

## 1. Supabase Projesi Oluşturma
1. https://supabase.com adresine gidin ve yeni bir proje oluşturun
2. Proje ayarlarından `Project URL` ve `anon public` key'i alın

## 2. .env Dosyasını Yapılandırma
Proje kök dizininde `.env` dosyasına aşağıdakileri ekleyin:
```
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 3. Veritabanı Tablolarını Oluşturma
Supabase Dashboard > SQL Editor'a gidin ve `supabase-migration.sql` dosyasındaki SQL komutlarını çalıştırın.

## 4. Storage Bucket Oluşturma
Supabase Dashboard > Storage'a gidin:
1. Yeni bir bucket oluşturun: `product-images`
2. Bucket'ı public olarak ayarlayın

## 5. Admin Kullanıcısı Oluşturma
1. Supabase Dashboard > Authentication > Users'tan yeni bir kullanıcı oluşturun
2. Kullanıcının UUID'sini kopyalayın
3. SQL Editor'da aşağıdaki komutu çalıştırın:
   ```sql
   INSERT INTO admin_roles (user_id, role)
   VALUES ('KULLANICI_UUID', 'admin');
   ```

## 6. Projeyi Çalıştırma
```bash
npm install
npm run dev
```

## Kullanım
- Admin paneline erişmek için: `/admin/login`
- Ürünleri yönetmek için: `/admin/products`
- Siparişleri görüntülemek için: `/admin/orders`
- Site ayarlarını değiştirmek için: `/admin/settings`
