import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const hardcodedProducts = [
  { id: 1, category: "irrigation", name: "Drip Irrigation Kit (1 Acre)", description: "Complete drip irrigation system for 1 acre. Includes mainline, drip tapes, fittings and filter.", price: 32000, unit: "kit", stock: 25, image: "https://grekkon.co.ke/wp-content/uploads/2021/04/grekkon-vegetable-drip-irrigation.jpg" },
  { id: 2, category: "irrigation", name: "Sprinkler Irrigation Kit", description: "Overhead sprinkler system for vegetables and nurseries. Covers up to 0.5 acres.", price: 15000, unit: "kit", stock: 20, image: "https://aquahubirrigation.co.ke/wp-content/uploads/2022/12/Greenhouse-88.png" },
  { id: 3, category: "irrigation", name: "Water Pump (1HP Petrol)", description: "Portable petrol-powered water pump for field irrigation and water transfer.", price: 18500, unit: "unit", stock: 30, image: "https://www.waterpumps.co.ke/images/1.jpg" },
  { id: 4, category: "animal feed", name: "Dairy Meal (Maziwa Plus)", description: "High protein dairy feed to boost milk production in cows. Contains minerals and vitamins.", price: 2800, unit: "50kg bag", stock: 350, image: "https://unga-group.com/wp-content/uploads/2019/06/Maziwa-2.png" },
  { id: 5, category: "animal feed", name: "Goat & Sheep Pellets", description: "Balanced pelleted feed for goats and sheep. Improves weight gain and health.", price: 2400, unit: "50kg bag", stock: 200, image: "https://bfel.in/wp-content/uploads/2023/06/5.png" },
  { id: 6, category: "animal feed", name: "Layers Mash", description: "Complete feed for laying hens. Promotes high egg production and strong shells.", price: 2600, unit: "50kg bag", stock: 300, image: "https://unga-group.com/wp-content/uploads/2019/06/kienyeji-layer-mash.png" },
  { id: 7, category: "equipment", name: "Pump Sprayer 20L Knapsack", description: "Manual knapsack sprayer with adjustable nozzle. Durable and easy to use for farm chemical application.", price: 3500, unit: "unit", stock: 80, image: "https://wingssuppliers.co.ke/wp-content/uploads/2025/02/enter-pulverizator-ingco-hspp42002-667732.webp" },
  { id: 8, category: "equipment", name: "Ox-Plough (Disc Plough)", description: "Heavy-duty disc plough for ox-drawn tillage. Suitable for small to medium farms.", price: 28000, unit: "unit", stock: 12, image: "https://s.alicdn.com/@sc04/kf/Ha3582f06001d4499bf16b4874c85238dg.png?avif=close&webp=close" },
  { id: 9, category: "pesticides", name: "Duduthrin Insecticide", description: "Contact and stomach pyrethroid insecticide. Controls caterpillars, aphids and stalk borers.", price: 680, unit: "500ml bottle", stock: 170, image: "https://pictures-kenya.jijistatic.com/72518642_NjIwLTI3OS0xNjJmNDgzMTFj.webp" },
  { id: 10, category: "pesticides", name: "Roundup Herbicide (Glyphosate)", description: "Broad spectrum non-selective herbicide. Clears weeds before planting.", price: 1500, unit: "1 litre", stock: 100, image: "https://images-na.ssl-images-amazon.com/images/I/810jVH814FL._UL500_.jpg" },
  { id: 11, category: "pesticides", name: "Actara 25WG Insecticide", description: "Systemic insecticide for aphids, whiteflies and thrips. Used in vegetables and horticulture.", price: 1200, unit: "100g sachet", stock: 150, image: "https://kuzaagrochem.co.ke/media/user_35/Actara.jpeg" },
  { id: 12, category: "pesticides", name: "Dithane M-45 Fungicide", description: "Broad spectrum protective fungicide. Controls blight, anthracnose, downy mildew in vegetables.", price: 850, unit: "1kg tin", stock: 130, image: "https://agrify.ph/cdn/shop/products/Photo_25-03-2019_3_45_53_PM_4a0c9140-e2ed-41bc-9792-c8f109611dec_1536x.png?v=1554448414" },
  { id: 13, category: "tools", name: "Hand Jembe (Hoe)", description: "Forged steel jembe for digging, weeding and soil preparation. Long wooden handle.", price: 450, unit: "piece", stock: 500, image: "https://i0.wp.com/www.shopnanjala.com/wp-content/uploads/2024/05/Nanjala-Jogoo-Jembe-with-wooden-handle-large_side.png?fit=700%2C900&ssl=1" },
  { id: 14, category: "tools", name: "Slasher", description: "Heavy duty slasher for clearing bush and tall grass. Tempered steel blade.", price: 380, unit: "piece", stock: 400, image: "https://image.made-in-china.com/2f0j00hJSbdQPzrEoN/Farming-Garden-Tools-M214-Grass-Slasher-with-Wood-Handle.webp" },
  { id: 15, category: "tools", name: "Garden Fork", description: "4-prong steel garden fork for loosening and aerating soil.", price: 620, unit: "piece", stock: 300, image: "https://www.myagrovet.co.ke/images/products/7121/a5e4bb528bad9485a79080e6674a7b0d.jpg" },
  { id: 16, category: "fertilizers", name: "Mavuno Planting Fertilizer", description: "Specifically formulated for Kenyan soils. Enriched with micronutrients for healthy crop establishment.", price: 4500, unit: "50kg bag", stock: 140, image: "https://portal.mkulimabora.org/admin/product_photos_compressed/452.webp" },
  { id: 17, category: "fertilizers", name: "NPK 17:17:17 Fertilizer", description: "Balanced compound fertilizer for vegetables and horticulture crops.", price: 4000, unit: "50kg bag", stock: 160, image: "https://agroduka.com/images/product/51_photo_11436_1.jpg" },
  { id: 18, category: "fertilizers", name: "CAN Fertilizer (Calcium Ammonium Nitrate)", description: "Top dressing nitrogen fertilizer, 26% N. Ideal for maize, tea, coffee and vegetables.", price: 3800, unit: "50kg bag", stock: 200, image: "https://farmsquare.ng/wp-content/uploads/2022/07/calcium-nitrate-600x489.webp" },
  { id: 19, category: "fertilizers", name: "Urea Fertilizer (46% N)", description: "High nitrogen fertilizer for top dressing. Boosts leafy growth and green color.", price: 3600, unit: "50kg bag", stock: 190, image: "https://infinitygalaxy.org/wp-content/webp-express/webp-images/uploads/2023/06/What-is-urea-nitrogen-46-1024x683.jpg.webp" },
  { id: 20, category: "fertilizers", name: "DAP Fertilizer (Di-Ammonium Phosphate)", description: "Basal fertilizer for planting. 18% N, 46% P. Suitable for all crops.", price: 4200, unit: "50kg bag", stock: 220, image: "https://scientificrefractories.com/wp-content/uploads/2024/12/DAP-Di-Ammonium-Phosphate.jpg" },
  { id: 21, category: "seeds", name: "Sukuma Wiki Seeds (Kale)", description: "Kenya Kale / Sukuma Wiki seeds. Fast growing, high yielding leafy vegetable.", price: 180, unit: "100g packet", stock: 600, image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/4548623/1.jpg?6410" },
  { id: 22, category: "seeds", name: "Calypso F1 Tomato Seeds", description: "Premium F1 hybrid tomato seeds. High yield, disease-resistant, excellent shelf life.", price: 750, unit: "10g packet", stock: 400, image: "https://tropicalgoldseeds.com/cdn/shop/products/Calypso-Tomato-4-11-21_grande.jpg?v=1676981589" },
  { id: 23, category: "seeds", name: "Beans (Rosecoco) Seeds", description: "Certified Rosecoco bean seeds. Popular variety with good market demand.", price: 320, unit: "1kg packet", stock: 350, image: "https://spiceworldltd.co.ke/wp-content/uploads/2023/09/rosecoco-brown-64fe1fd7e6d6f.webp" },
  { id: 24, category: "seeds", name: "DK8031 Maize Seeds", description: "Dekalb hybrid maize seeds, drought-tolerant, high yield. Ideal for Kenyan highlands and midlands.", price: 1350, unit: "2kg bag", stock: 300, image: "https://imaginecare.co.ke/wp-content/uploads/2023/09/DK-8031-Hybrid-Maize-Seeds-2kg.png" },
  { id: 25, category: "seeds", name: "Sunflower Seeds (Hybrid)", description: "High oil content hybrid sunflower seeds for commercial farming.", price: 1200, unit: "5kg bag", stock: 180, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80" },
  { id: 26, category: "seeds", name: "H614D Maize Seeds", description: "Kenya Seed Company H614D hybrid maize, suited for low to mid altitude areas.", price: 950, unit: "2kg bag", stock: 250, image: "https://farmbizafrica.com/wp-content/uploads/2019/11/H614_maize_seed-1.jpg" },
];

const categoryList = [
  { value: "all", label: "All Products" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "pesticides", label: "Pesticides" },
  { value: "tools", label: "Tools" },
  { value: "equipment", label: "Equipment" },
  { value: "animal feed", label: "Animal Feed" },
  { value: "irrigation", label: "Irrigation" },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbProducts, setDbProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setDbProducts(data);
      });
  }, []);

  // Merge: DB products first (new ones), then hardcoded
  const allProducts = [
    ...dbProducts.map(p => ({
      id: `db-${p.id}`,
      category: (p.category || "").toLowerCase(),
      name: p.name,
      description: p.description || "Quality agricultural product from Chicago Agro Supplies.",
      price: Number(p.price),
      unit: "unit",
      stock: p.stock,
      image: p.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    })),
    ...hardcodedProducts,
  ];

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Our Catalogue</span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">All Products</h1>
            <p className="text-gray-600 max-w-2xl">Browse our complete range of premium agricultural supplies</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categoryList.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={"px-4 py-2 rounded-full font-medium text-sm transition-all " + (
                activeCategory === cat.value
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              )}>
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-6">Showing {filtered.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <Link to={`/products/${product.id}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
                  {String(product.id).startsWith('db-') && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">New</span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{product.category}</span>
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-emerald-600">KES {product.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm ml-1">/{product.unit}</span>
                  </div>
                  <button onClick={() => addToCart(product)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
