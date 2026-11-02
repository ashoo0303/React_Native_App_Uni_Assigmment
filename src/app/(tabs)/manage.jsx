import { useRef, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { BrandHeader } from '@/components/BrandHeader';
import { JewelleryImage } from '@/components/JewelleryImage';
import { Button, Chip, Eyebrow, Field } from '@/components/ui';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/format';
import { CATEGORIES, CATEGORY_LABELS, METALS } from '@/lib/products';

const MAX_IMAGE_BYTES = 800 * 1024;

const emptyForm = {
  id: '',
  name: '',
  category: '',
  metal: '',
  price: '',
  stock: '5',
  notes: '',
  image: '',
  imageUrl: '',
};

export default function ManageScreen() {
  const { ready, products, saveProducts, showBanner } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formError, setFormError] = useState('');
  const listRef = useRef(null);

  const priceSum = products.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const query = search.trim().toLowerCase();
  const filtered = products.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    if (!matchesCategory) return false;
    if (!query) return true;
    return [item.name, item.category, item.metal, item.notes, String(item.price)].some((field) =>
      String(field || '')
        .toLowerCase()
        .includes(query),
    );
  });

  const editing = Boolean(form.id);

  function updateForm(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function resetForm() {
    setForm(emptyForm);
    setFormError('');
  }

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError('Photo library permission is needed, or paste an image URL instead.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    if (asset.mimeType && !asset.mimeType.startsWith('image/')) {
      setFormError('Please choose an image file.');
      return;
    }
    if (!asset.base64) {
      setFormError('Could not read that image. Try another file or paste an image URL.');
      return;
    }
    const bytes = Math.floor((asset.base64.length * 3) / 4);
    if (bytes > MAX_IMAGE_BYTES) {
      setFormError('Image is too large. Please use a file under 800 KB.');
      return;
    }
    const mime = asset.mimeType || 'image/jpeg';
    updateForm({
      image: `data:${mime};base64,${asset.base64}`,
      imageUrl: '',
    });
    setFormError('');
    showBanner('Image ready to save with the product.');
  }

  async function onSubmit() {
    const name = form.name.trim();
    const category = form.category;
    const metal = form.metal;
    const priceText = form.price.trim();
    const stockText = form.stock.trim();
    const notes = form.notes.trim();
    const image = (form.image || form.imageUrl).trim();

    const requiredFilled = [name, category, metal, priceText, stockText].every(
      (value) => value !== '' && value !== null && value !== undefined,
    );
    if (!requiredFilled) {
      setFormError('Please fill in name, category, metal, price and stock.');
      return;
    }

    const price = Number(priceText);
    const stock = Number(stockText);
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Price must be a positive number.');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setFormError('Stock must be zero or a positive number.');
      return;
    }
    if (!CATEGORIES.includes(category) || !METALS.includes(metal)) {
      setFormError('Please choose a valid category and metal.');
      return;
    }

    const duplicate = products.some(
      (item) => item.id !== form.id && item.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      setFormError('A product with this name already exists.');
      return;
    }

    if (editing) {
      const existing = products.find((item) => item.id === form.id);
      if (!existing) {
        setFormError('Product not found.');
        resetForm();
        return;
      }
      const next = products.map((item) =>
        item.id === form.id
          ? { ...item, name, category, metal, price, stock, notes, image, updatedAt: Date.now() }
          : item,
      );
      const saved = await saveProducts(next);
      if (!saved) return;
      showBanner('Product updated.');
    } else {
      const next = [
        {
          id: Crypto.randomUUID(),
          name,
          category,
          metal,
          price,
          stock,
          notes,
          image,
          createdAt: Date.now(),
        },
        ...products,
      ];
      const saved = await saveProducts(next);
      if (!saved) return;
      showBanner('Product added.');
    }

    resetForm();
  }

  function onEdit(id) {
    const record = products.find((item) => item.id === id);
    if (!record) return;
    setForm({
      id: record.id,
      name: record.name,
      category: record.category,
      metal: record.metal,
      price: String(record.price),
      stock: String(Number.isFinite(Number(record.stock)) ? record.stock : 0),
      notes: record.notes || '',
      image: record.image || '',
      imageUrl: record.image && /^https?:/i.test(record.image) ? record.image : '',
    });
    setFormError('');
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  function onDelete(id) {
    const record = products.find((item) => item.id === id);
    if (!record) return;
    Alert.alert('Delete product', `Delete "${record.name}" from the store?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const next = products.filter((item) => item.id !== id);
          const saved = await saveProducts(next);
          if (!saved) return;
          if (form.id === id) resetForm();
          showBanner('Product deleted.');
        },
      },
    ]);
  }

  if (!ready) {
    return (
      <View style={styles.screen}>
        <BrandHeader />
        <Text style={styles.loading}>Loading saved products…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <ManageHeader
            form={form}
            editing={editing}
            formError={formError}
            search={search}
            categoryFilter={categoryFilter}
            countLabel={`${filtered.length} of ${products.length} products`}
            productCount={products.length}
            priceSum={priceSum}
            onChange={updateForm}
            onSubmit={onSubmit}
            onCancel={resetForm}
            onChoosePhoto={choosePhoto}
            onClearImage={() => updateForm({ image: '', imageUrl: '' })}
            onSearch={setSearch}
            onCategoryFilter={setCategoryFilter}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {products.length
              ? 'No products found. Try another search or category.'
              : 'No products found. Add a product to start the inventory.'}
          </Text>
        }
        renderItem={({ item }) => (
          <ProductCard item={item} onEdit={onEdit} onDelete={onDelete} />
        )}
      />
    </View>
  );
}

function ManageHeader({
  form,
  editing,
  formError,
  search,
  categoryFilter,
  countLabel,
  productCount,
  priceSum,
  onChange,
  onSubmit,
  onCancel,
  onChoosePhoto,
  onClearImage,
  onSearch,
  onCategoryFilter,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.hero}>
        <Eyebrow light>Ecommerce inventory</Eyebrow>
        <Text style={styles.heroTitle}>Product admin</Text>
        <Text style={styles.heroCopy}>Add, edit and search the jewellery saved on this phone.</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={styles.statValue}>{productCount}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Sum of prices</Text>
            <Text style={styles.statPrice}>{formatPrice(priceSum)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Eyebrow>Product form</Eyebrow>
        <Text style={styles.formTitle}>{editing ? 'Update product' : 'Add product'}</Text>
        <Text style={styles.help}>Create or update a jewellery product for the online store.</Text>
        <Field
          label="Product name *"
          value={form.name}
          onChangeText={(name) => onChange({ name })}
          placeholder="e.g. Aurora Solitaire Ring"
        />
        <Text style={styles.pickerLabel}>Category *</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={CATEGORY_LABELS[category]}
              selected={form.category === category}
              onPress={() => onChange({ category })}
            />
          ))}
        </View>
        <Text style={styles.pickerLabel}>Metal / material *</Text>
        <View style={styles.chips}>
          {METALS.map((metal) => (
            <Chip
              key={metal}
              label={metal}
              selected={form.metal === metal}
              onPress={() => onChange({ metal })}
            />
          ))}
        </View>
        <Field
          label="Price (Rs.) *"
          value={form.price}
          onChangeText={(price) => onChange({ price })}
          placeholder="e.g. 148000"
          keyboardType="number-pad"
        />
        <Field
          label="Stock qty *"
          value={form.stock}
          onChangeText={(stock) => onChange({ stock })}
          placeholder="e.g. 5"
          keyboardType="number-pad"
        />
        <Text style={styles.pickerLabel}>Product image</Text>
        <Button label="Choose from library" variant="outline" onPress={onChoosePhoto} />
        <Text style={styles.help}>JPG, PNG or WebP, max 800 KB, or paste an image URL.</Text>
        <Field
          label="Image URL (optional)"
          value={form.imageUrl}
          onChangeText={(imageUrl) => onChange({ imageUrl, image: imageUrl.trim() })}
          placeholder="https://example.com/jewellery.jpg"
          autoCapitalize="none"
          keyboardType="url"
        />
        {form.image ? (
          <View style={styles.previewWrap}>
            <Text style={styles.pickerLabel}>Preview</Text>
            <JewelleryImage src={form.image} style={styles.preview} />
            <Pressable onPress={onClearImage}>
              <Text style={styles.link}>Remove image</Text>
            </Pressable>
          </View>
        ) : null}
        <Field
          label="Description"
          value={form.notes}
          onChangeText={(notes) => onChange({ notes })}
          placeholder="Short product description"
          multiline
        />
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <View style={styles.actions}>
          <Button label={editing ? 'Save changes' : 'Add product'} onPress={onSubmit} style={styles.action} />
          {editing ? <Button label="Cancel edit" variant="outline" onPress={onCancel} style={styles.action} /> : null}
        </View>
      </View>

      <View style={styles.listHead}>
        <Eyebrow>Inventory</Eyebrow>
        <Text style={styles.formTitle}>All products</Text>
        <Text style={styles.count}>{countLabel}</Text>
        <Field
          label="Search products"
          value={search}
          onChangeText={onSearch}
          placeholder="Search by name, category, metal, notes or price"
        />
        <Text style={styles.pickerLabel}>Filter by category</Text>
        <View style={styles.chips}>
          <Chip label="All categories" selected={categoryFilter === 'all'} onPress={() => onCategoryFilter('all')} />
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={CATEGORY_LABELS[category]}
              selected={categoryFilter === category}
              onPress={() => onCategoryFilter(category)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function ProductCard({ item, onEdit, onDelete }) {
  const stock = Number.isFinite(Number(item.stock)) ? Number(item.stock) : 0;
  return (
    <View style={styles.product}>
      <View style={styles.figure}>
        <JewelleryImage src={item.image} />
      </View>
      <View style={styles.productBody}>
        <Text style={styles.meta}>
          {item.category} · {item.metal}
        </Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <Text style={styles.stock}>{stock > 0 ? `Stock: ${stock}` : 'Out of stock'}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        <View style={styles.actions}>
          <Button label="Edit" variant="outline" onPress={() => onEdit(item.id)} style={styles.action} />
          <Button label="Delete" variant="dark" onPress={() => onDelete(item.id)} style={styles.action} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  loading: {
    margin: 24,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink700,
  },
  list: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    gap: 16,
    marginBottom: 8,
  },
  hero: {
    backgroundColor: colors.ink,
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.white,
  },
  heroCopy: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.ink300,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  stat: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    gap: 4,
  },
  statLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink400,
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.white,
  },
  statPrice: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  formTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
  },
  help: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink600,
  },
  pickerLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.ink800,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewWrap: {
    gap: 8,
  },
  preview: {
    width: 140,
    height: 176,
    borderRadius: 16,
  },
  link: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.ink600,
    textDecorationLine: 'underline',
  },
  formError: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
  },
  listHead: {
    gap: 10,
    marginTop: 8,
  },
  count: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink600,
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.ink200,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    textAlign: 'center',
    fontFamily: fonts.sans,
    color: colors.ink600,
  },
  product: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ink100,
    marginBottom: 12,
  },
  figure: {
    width: 108,
    height: 156,
    backgroundColor: colors.sand,
  },
  productBody: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  meta: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink400,
  },
  productName: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
  },
  price: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
  },
  stock: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink600,
  },
  notes: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink600,
  },
});
