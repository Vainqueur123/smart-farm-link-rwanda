import { CropType, DistrictCode, PaymentMethod } from "./types"

interface ProductData extends Omit<Product, 'paymentMethods' | 'id'> {
  id: string
  paymentMethods: PaymentMethod[]
}

// Extend the Unit type to include more options
export type ExtendedUnit = 'kg' | 'g' | 'ton' | 'bunch' | 'piece' | 'sack' | 'bag'

export interface Product {
  id: string
  name: string
  type: CropType
  description: string
  pricePerKg: number
  minOrderQuantity: number
  availableQuantity: number
  unit: ExtendedUnit
  district: DistrictCode
  farmerId: string
  farmerName: string
  rating: number
  reviewCount: number
  imageUrl: string
  isOrganic: boolean
  harvestDate: string
  createdAt: string
  updatedAt: string
  paymentMethods: PaymentMethod[]
  isVerified: boolean
}

// Product categories
export const productCategories = [
  { id: 'all', name: 'All Products' },
  
  // Staple Crops
  { id: 'maize', name: 'Maize' },
  { id: 'rice', name: 'Rice' },
  { id: 'beans', name: 'Beans' },
  { id: 'irish_potato', name: 'Irish Potatoes' },
  { id: 'sweet_potato', name: 'Sweet Potatoes' },
  { id: 'cassava', name: 'Cassava' },
  
  // Fruits
  { id: 'mango', name: 'Mangoes' },
  { id: 'banana', name: 'Bananas' },
  { id: 'apple', name: 'Apples' },
  { id: 'avocado', name: 'Avocados' },
  { id: 'pineapple', name: 'Pineapples' },
  { id: 'passion_fruit', name: 'Passion Fruit' },
  
  // Vegetables
  { id: 'tomato', name: 'Tomatoes' },
  { id: 'onion', name: 'Onions' },
  { id: 'cabbage', name: 'Cabbage' },
  { id: 'carrot', name: 'Carrots' },
  { id: 'spinach', name: 'Spinach' },
  
  // Cash Crops
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea' },
  
  // Spices
  { id: 'chili', name: 'Chili Peppers' },
  { id: 'garlic', name: 'Garlic' },
  { id: 'ginger', name: 'Ginger' },
  { id: 'turmeric', name: 'Turmeric' }
];

export const sampleProducts: ProductData[] = [
  // Staple Crops
  {
    id: 'prod_maize_001',
    name: 'Maize',
    type: 'maize',
    description: 'Premium quality maize, perfect for human consumption and animal feed. Grown organically in the fertile soils of Rwanda.',
    pricePerKg: 1200,
    minOrderQuantity: 10,
    availableQuantity: 1000,
    unit: 'kg',
    district: 'Musanze',
    farmerId: 'farmer_001',
    farmerName: 'Mukamana Alice',
    rating: 4.5,
    reviewCount: 24,
    imageUrl: '/images/maize.jpg',
    isOrganic: true,
    harvestDate: '2023-09-15',
    createdAt: '2023-09-20T10:30:00Z',
    updatedAt: '2023-10-01T14:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  {
    id: 'prod_rice_001',
    name: 'Kilombero Rice',
    type: 'rice',
    description: 'Premium Kilombero rice, known for its excellent cooking quality and taste. Grown in the marshlands of Rwanda.',
    pricePerKg: 2800,
    minOrderQuantity: 5,
    availableQuantity: 800,
    unit: 'kg',
    district: 'Bugesera',
    farmerId: 'farmer_002',
    farmerName: 'Niyibizi Jean',
    rating: 4.7,
    reviewCount: 32,
    imageUrl: '/images/rice.jpg',
    isOrganic: true,
    harvestDate: '2023-10-01',
    createdAt: '2023-10-05T08:15:00Z',
    updatedAt: '2023-10-10T11:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'bank_transfer', 'cash'] as const
  },
  
  // Fruits
  {
    id: 'prod_mango_001',
    name: 'Fresh Mangoes',
    type: 'mango',
    description: 'Sweet and juicy mangoes, hand-picked at peak ripeness. Rich in vitamins A and C, perfect for fresh eating or making smoothies.',
    pricePerKg: 2500,
    minOrderQuantity: 5,
    availableQuantity: 200,
    unit: 'kg',
    district: 'Gisagara',
    farmerId: 'farmer_003',
    farmerName: 'Uwineza Grace',
    rating: 4.7,
    reviewCount: 42,
    imageUrl: '/images/mango.jpg',
    isOrganic: true,
    harvestDate: '2023-09-15',
    createdAt: '2023-09-20T10:30:00Z',
    updatedAt: '2023-10-01T14:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  {
    id: 'prod_banana_001',
    name: 'Fresh Bananas',
    type: 'banana',
    description: 'Naturally grown bananas, rich in potassium and essential nutrients. Perfect for a healthy snack or smoothies.',
    pricePerKg: 1800,
    minOrderQuantity: 3,
    availableQuantity: 150,
    unit: 'bunch',
    district: 'Musanze',
    farmerId: 'farmer_004',
    farmerName: 'Niyonshuti Jean',
    rating: 4.5,
    reviewCount: 38,
    imageUrl: '/images/banana.jpg',
    isOrganic: true,
    harvestDate: '2023-10-10',
    createdAt: '2023-10-12T09:15:00Z',
    updatedAt: '2023-10-12T09:15:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  
  // Vegetables
  {
    id: 'prod_tomato_001',
    name: 'Fresh Tomatoes',
    type: 'tomato',
    description: 'Fresh, juicy tomatoes grown in the sunny fields of Rwanda. Perfect for salads and cooking.',
    pricePerKg: 800,
    minOrderQuantity: 5,
    availableQuantity: 200,
    unit: 'kg',
    district: 'Bugesera',
    farmerId: 'farmer_006',
    farmerName: 'Niyigena Eric',
    rating: 4.4,
    reviewCount: 31,
    imageUrl: '/images/tomatoes.png',
    isOrganic: false,
    harvestDate: '2023-10-12',
    createdAt: '2023-10-14T08:45:00Z',
    updatedAt: '2023-10-20T11:30:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  {
    id: 'prod_onion_001',
    name: 'Red Onions',
    type: 'onion',
    description: 'Fresh red onions with a mild, sweet flavor. Ideal for cooking and salads.',
    pricePerKg: 700,
    minOrderQuantity: 3,
    availableQuantity: 400,
    unit: 'kg',
    district: 'Gisagara',
    farmerId: 'farmer_007',
    farmerName: 'Uwamahoro Josiane',
    rating: 4.3,
    reviewCount: 22,
    imageUrl: '/images/redonion.jpg',
    isOrganic: false,
    harvestDate: '2023-10-08',
    createdAt: '2023-10-10T13:20:00Z',
    updatedAt: '2023-10-10T13:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  
  // Cash Crops
  // Spices
  {
    id: 'prod_chili_001',
    name: 'Red Chili Peppers',
    type: 'chili',
    description: 'Hot red chili peppers, perfect for adding spice to your dishes. Grown organically.',
    pricePerKg: 1800,
    minOrderQuantity: 1,
    availableQuantity: 100,
    unit: 'kg',
    district: 'Rusizi',
    farmerId: 'farmer_008',
    farmerName: 'Niyonsenga Marie',
    rating: 4.6,
    reviewCount: 18,
    imageUrl: '/images/chili.png',
    isOrganic: true,
    harvestDate: '2023-10-05',
    createdAt: '2023-10-08T11:20:00Z',
    updatedAt: '2023-10-08T11:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  {
    id: 'prod_avocado_001',
    name: 'Avocados',
    type: 'avocado',
    description: 'Creamy Hass avocados, rich in healthy fats and nutrients. Perfect for guacamole, salads, or toast.',
    pricePerKg: 1500,
    minOrderQuantity: 3,
    availableQuantity: 300,
    unit: 'kg',
    district: 'Kicukiro',
    farmerId: 'farmer_016',
    farmerName: 'Uwase Marie',
    rating: 4.7,
    reviewCount: 45,
    imageUrl: '/images/avocado.png',
    isOrganic: true,
    harvestDate: '2023-10-18',
    createdAt: '2023-10-20T09:30:00Z',
    updatedAt: '2023-10-25T14:15:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'] as const
  },
  {
    id: 'prod_sweetpotato_001',
    name: 'Sweet Potatoes',
    type: 'sweet_potato',
    description: 'Naturally sweet orange-fleshed sweet potatoes, rich in vitamins and fiber. Grown in the fertile soils of Bugesera.',
    pricePerKg: 600,
    minOrderQuantity: 5,
    availableQuantity: 400,
    unit: 'kg',
    district: 'Bugesera',
    farmerId: 'farmer_017',
    farmerName: 'Niyonshuti Jean de Dieu',
    rating: 4.5,
    reviewCount: 28,
    imageUrl: '/images/sweet-potatoes.png',
    isOrganic: true,
    harvestDate: '2023-10-12',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-20T09:15:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash'],
    isVerified: true
  },
  {
    id: 'prod_bean_002',
    name: 'Red Beans',
    type: 'beans',
    description: 'Freshly harvested red kidney beans known for their high protein content and natural flavor.',
    pricePerKg: 1800,
    minOrderQuantity: 5,
    availableQuantity: 200,
    unit: 'kg',
    district: 'Gatsibo',
    farmerId: 'farmer_032',
    farmerName: 'Ange Uwimana',
    rating: 4.7,
    reviewCount: 29,
    imageUrl: '/images/redbeans.png',
    isOrganic: true,
    harvestDate: '2023-07-22',
    createdAt: '2023-08-01T08:45:00Z',
    updatedAt: '2023-08-18T13:10:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'bank_transfer'],
    isVerified: true
  },
  {
    id: 'prod_tea_001',
    name: 'Rwandan Black Tea',
    type: 'tea',
    description: 'Finest quality black tea leaves from the hills of Rwanda. Rich flavor and aroma.',
    pricePerKg: 1800,
    minOrderQuantity: 2,
    availableQuantity: 150,
    unit: 'kg',
    district: 'Nyamagabe',
    farmerId: 'farmer_004',
    farmerName: 'Twagirimana Pierre',
    rating: 4.7,
    reviewCount: 42,
    imageUrl: '/images/tea.jpg',
    isOrganic: true,
    harvestDate: '2023-09-20',
    createdAt: '2023-09-25T11:45:00Z',
    updatedAt: '2023-10-10T16:30:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'bank_transfer'],
    isVerified: true
  },
  {
    id: 'prod_fruit_009',
    name: 'Fresh Apples',
    type: 'fruits',
    description: 'Crisp, juicy apples grown in the cool highlands. Perfect for snacking, juicing, or baking.',
    pricePerKg: 2500,
    minOrderQuantity: 2,
    availableQuantity: 100,
    unit: 'kg',
    district: 'Burera',
    farmerId: 'farmer_053',
    farmerName: 'Marie Claire Uwizeye',
    rating: 4.9,
    reviewCount: 52,
    imageUrl: '/images/apples.png',
    isOrganic: true,
    harvestDate: '2023-08-25',
    createdAt: '2023-09-10T09:40:00Z',
    updatedAt: '2023-09-28T16:15:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'bank_transfer'],
    isVerified: true
  },
  {
    id: 'prod_fruit_002',
    name: 'Green Bananas',
    type: 'fruits',
    description: 'Fresh green bananas rich in fiber and starch, ideal for cooking or local dishes like matoke.',
    pricePerKg: 300,
    minOrderQuantity: 3,
    availableQuantity: 250,
    unit: 'kg',
    district: 'Gisagara',
    farmerId: 'farmer_060',
    farmerName: 'Innocent Nkurunziza',
    rating: 4.7,
    reviewCount: 34,
    imageUrl: '/images/greenbanana.jpg',
    isOrganic: true,
    harvestDate: '2023-09-18',
    createdAt: '2023-09-30T10:25:00Z',
    updatedAt: '2023-10-05T13:10:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'bank_transfer'],
    isVerified: true
  },
  {
    id: 'prod_bean_003',
    name: 'Black Beans',
    type: 'beans',
    description: 'Rich and flavorful black beans grown using sustainable farming practices. Great source of protein and fiber.',
    pricePerKg: 2000,
    minOrderQuantity: 3,
    availableQuantity: 150,
    unit: 'kg',
    district: 'Musanze',
    farmerId: 'farmer_041',
    farmerName: 'Claudine Mukamana',
    rating: 4.8,
    reviewCount: 41,
    imageUrl: '/images/beans.png',
    isOrganic: true,
    harvestDate: '2023-09-12',
    createdAt: '2023-09-25T11:20:00Z',
    updatedAt: '2023-10-02T15:40:00Z',
    paymentMethods: ['mtn_momo', 'airtel_money', 'bank_transfer'],
    isVerified: true
  },
  {
    id: 'prod_potatoes_001',
    name: 'Irish Potatoes',
    type: 'potatoes',
    description: 'Fresh Irish potatoes, perfect for boiling, frying, or mashing. Grown in the fertile volcanic soils of Rwanda.',
    pricePerKg: 450,
    minOrderQuantity: 10,
    availableQuantity: 1000,
    unit: 'kg',
    district: 'Rubavu',
    farmerId: 'farmer_005',
    farmerName: 'Hakizimana Eric',
    rating: 4.6,
    reviewCount: 31,
    imageUrl: '/images/irish.jpg',
    isOrganic: false,
    harvestDate: '2023-10-05',
    createdAt: '2023-10-10T13:20:00Z',
    updatedAt: '2023-10-10T13:20:00Z',
    isVerified: true,
    paymentMethods: ['mtn_momo', 'airtel_money', 'cash']
  }
]

// Product categories are now properly defined at the top of the file

export const districts = [
  'gasabo', 'kicukiro', 'nyarugenge',
  'bugesera', 'gatsibo', 'kayonza', 'ngoma', 'nyagatare', 'rwamagana',
  'burera', 'gakenke', 'gicumbi', 'musanze', 'rulindo',
  'gisozi', 'nyabihu', 'nyamagabe', 'nyamasheke', 'nyaruguru', 'rubavu', 'rusizi', 'rutsiro',
  'huye', 'gisagara', 'kamonyi', 'muhanga', 'nyamagana', 'nyanza', 'nyaruguru', 'ruhango'
] as const

export const sortOptions = [
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'rating', name: 'Top Rated' },
  { id: 'newest', name: 'Newest' },
  { id: 'popular', name: 'Most Popular' },
]
