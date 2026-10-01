-- 1. Habilitar extensión para UUIDs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Función para actualizar el campo updated_at automáticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
```

---

```sql
-- 3. Creación de Tablas
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price DECIMAL(10,2),
    exists BOOLEAN DEFAULT true,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    price_varies BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    days TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE franchises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    streets TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE franchise_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise_id UUID REFERENCES franchises(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE hero_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sales_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    streets TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE associates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    logo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Aplicar Triggers de actualización
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_variants_modtime BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_announcements_modtime BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_franchises_modtime BEFORE UPDATE ON franchises FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_hero_images_modtime BEFORE UPDATE ON hero_images FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sales_points_modtime BEFORE UPDATE ON sales_points FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_associates_modtime BEFORE UPDATE ON associates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. Configuración de Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE associates ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública, Escritura solo para autenticados (Admins)
CREATE POLICY "Autenticated read only" ON categories FOR SELECT USING (true);
CREATE POLICY "Autenticated users only" ON categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Autenticated read only" ON products FOR SELECT USING (true);
CREATE POLICY "Autenticated users only" ON products FOR ALL TO authenticated USING (true);

CREATE POLICY "Autenticated read only" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Autenticated users only" ON product_variants FOR ALL TO authenticated USING (true);

CREATE POLICY "Autenticated read only" ON announcements FOR SELECT USING (active = true);
CREATE POLICY "Autenticated users only" ON announcements FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read only" ON cities FOR SELECT USING (true);
CREATE POLICY "Authenticated users only" ON cities FOR ALL TO authenticated USING (true);

CREATE POLICY "Autenticated read only" ON franchises FOR SELECT USING (true);
CREATE POLICY "Autenticated users only" ON franchises FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read only" ON franchise_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users only" ON franchise_photos FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read only" ON hero_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users only" ON hero_images FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read only" ON sales_points FOR SELECT USING (true);
CREATE POLICY "Authenticated users only" ON sales_points FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read only" ON associates FOR SELECT USING (true);
CREATE POLICY "Authenticated users only" ON associates FOR ALL TO authenticated USING (true);
```
