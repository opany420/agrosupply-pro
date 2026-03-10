import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

const products = [
  { id: 1, category: "irrigation", name: "Drip Irrigation Kit (1 Acre)", description: "Complete drip irrigation system for 1 acre. Includes mainline, drip tapes, fittings and filter.", price: 32000, unit: "kit", stock: 25, image: "https://grekkon.co.ke/wp-content/uploads/2021/04/grekkon-vegetable-drip-irrigation.jpg" },
  { id: 2, category: "irrigation", name: "Sprinkler Irrigation Kit", description: "Overhead sprinkler system for vegetables and nurseries. Covers up to 0.5 acres.", price: 15000, unit: "kit", stock: 20, image: "https://aquahubirrigation.co.ke/wp-content/uploads/2022/12/Greenhouse-88.png" },
  { id: 3, category: "irrigation", name: "Water Pump (1HP Petrol)", description: "Portable petrol-powered water pump for field irrigation and water transfer.", price: 18500, unit: "unit", stock: 30, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&q=80" },
  { id: 4, category: "animal feed", name: "Dairy Meal (Maziwa Plus)", description: "High protein dairy feed to boost milk production in cows. Contains minerals and vitamins.", price: 2800, unit: "50kg bag", stock: 350, image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80" },
  { id: 5, category: "animal feed", name: "Goat & Sheep Pellets", description: "Balanced pelleted feed for goats and sheep. Improves weight gain and health.", price: 2400, unit: "50kg bag", stock: 200, image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80" },
  { id: 6, category: "animal feed", name: "Layers Mash", description: "Complete feed for laying hens. Promotes high egg production and strong shells.", price: 2600, unit: "50kg bag", stock: 300, image: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=600&q=80" },
  { id: 7, category: "equipment", name: "Pump Sprayer 20L Knapsack", description: "Manual knapsack sprayer with adjustable nozzle. Durable and easy to use for farm chemical application.", price: 3500, unit: "unit", stock: 80, image: "https://wingssuppliers.co.ke/wp-content/uploads/2025/02/enter-pulverizator-ingco-hspp42002-667732.webp" },
  { id: 8, category: "equipment", name: "Ox-Plough (Disc Plough)", description: "Heavy-duty disc plough for ox-drawn tillage. Suitable for small to medium farms.", price: 28000, unit: "unit", stock: 12, image: "https://s.alicdn.com/@sc04/kf/Ha3582f06001d4499bf16b4874c85238dg.png?avif=close&webp=close" },
  { id: 9, category: "pesticides", name: "Duduthrin Insecticide", description: "Contact and stomach pyrethroid insecticide. Controls caterpillars, aphids and stalk borers.", price: 680, unit: "500ml bottle", stock: 170, image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80" },
  { id: 10, category: "pesticides", name: "Roundup Herbicide (Glyphosate)", description: "Broad spectrum non-selective herbicide. Clears weeds before planting.", price: 1500, unit: "1 litre", stock: 100, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80" },
  { id: 11, category: "pesticides", name: "Actara 25WG Insecticide", description: "Systemic insecticide for aphids, whiteflies and thrips. Used in vegetables and horticulture.", price: 1200, unit: "100g sachet", stock: 150, image: "https://images.unsplash.com/photo-1616128418859-4b3f4e78cf6f?w=600&q=80" },
  { id: 12, category: "pesticides", name: "Dithane M-45 Fungicide", description: "Broad spectrum protective fungicide. Controls blight, anthracnose, downy mildew in vegetables.", price: 850, unit: "1kg tin", stock: 130, image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80" },
  { id: 13, category: "tools", name: "Hand Jembe (Hoe)", description: "Forged steel jembe for digging, weeding and soil preparation. Long wooden handle.", price: 450, unit: "piece", stock: 500, image: "https://i0.wp.com/www.shopnanjala.com/wp-content/uploads/2024/05/Nanjala-Jogoo-Jembe-with-wooden-handle-large_side.png?fit=700%2C900&ssl=1" },
  { id: 14, category: "tools", name: "Slasher", description: "Heavy duty slasher for clearing bush and tall grass. Tempered steel blade.", price: 380, unit: "piece", stock: 400, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80" },
  { id: 15, category: "tools", name: "Garden Fork", description: "4-prong steel garden fork for loosening and aerating soil.", price: 620, unit: "piece", stock: 300, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=600&q=80" },
  { id: 16, category: "fertilizers", name: "Mavuno Planting Fertilizer", description: "Specifically formulated for Kenyan soils. Enriched with micronutrients for healthy crop establishment.", price: 4500, unit: "50kg bag", stock: 140, image: "https://portal.mkulimabora.org/admin/product_photos_compressed/452.webp" },
  { id: 17, category: "fertilizers", name: "NPK 17:17:17 Fertilizer", description: "Balanced compound fertilizer for vegetables and horticulture crops.", price: 4000, unit: "50kg bag", stock: 160, image: "https://agroduka.com/images/product/51_photo_11436_1.jpg" },
  { id: 18, category: "fertilizers", name: "CAN Fertilizer (Calcium Ammonium Nitrate)", description: "Top dressing nitrogen fertilizer, 26% N. Ideal for maize, tea, coffee and vegetables.", price: 3800, unit: "50kg bag", stock: 200, image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80" },
  { id: 19, category: "fertilizers", name: "Urea Fertilizer (46% N)", description: "High nitrogen fertilizer for top dressing. Boosts leafy growth and green color.", price: 3600, unit: "50kg bag", stock: 190, image: "https://infinitygalaxy.org/wp-content/webp-express/webp-images/uploads/2023/06/What-is-urea-nitrogen-46-1024x683.jpg.webp" },
  { id: 20, category: "fertilizers", name: "DAP Fertilizer (Di-Ammonium Phosphate)", description: "Basal fertilizer for planting. 18% N, 46% P. Suitable for all crops.", price: 4200, unit: "50kg bag", stock: 220, image: "https://scientificrefractories.com/wp-content/uploads/2024/12/DAP-Di-Ammonium-Phosphate.jpg" },
  { id: 21, category: "seeds", name: "Sukuma Wiki Seeds (Kale)", description: "Kenya Kale / Sukuma Wiki seeds. Fast growing, high yielding leafy vegetable.", price: 180, unit: "100g packet", stock: 600, image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600&q=80" },
  { id: 22, category: "seeds", name: "Calypso F1 Tomato Seeds", description: "Premium F1 hybrid tomato seeds. High yield, disease-resistant, excellent shelf life.", price: 750, unit: "10g packet", stock: 400, image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80" },
  { id: 23, category: "seeds", name: "Beans (Rosecoco) Seeds", description: "Certified Rosecoco bean seeds. Popular variety with good market demand.", price: 320, unit: "1kg packet", stock: 350, image: "https://spiceworldltd.co.ke/wp-content/uploads/2023/09/rosecoco-brown-64fe1fd7e6d6f.webp" },
  { id: 24, category: "seeds", name: "DK8031 Maize Seeds", description: "Dekalb hybrid maize seeds, drought-tolerant, high yield. Ideal for Kenyan highlands and midlands.", price: 1350, unit: "2kg bag", stock: 300, image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&q=80" },
  { id: 25, category: "seeds", name: "Sunflower Seeds (Hybrid)", description: "High oil content hybrid sunflower seeds for commercial farming.", price: 1200, unit: "5kg bag", stock: 180, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80" },
  { id: 26, category: "seeds", name: "H614D Maize Seeds", description: "Kenya Seed Company H614D hybrid maize, suited for low to mid altitude areas.", price: 950, unit: "2kg bag", stock: 250, image: "https://farmbizafrica.com/wp-content/uploads/2019/11/H614_maize_seed-1.jpg" },
];


const categories = [
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
  const { addToCart } = useCart();

  const filtered = products.filter(p => {
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
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={"px-4 py-2 rounded-full font-medium text-sm transition-all " + (
                activeCategory === cat.value ? "bg-emerald-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              )}>
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-6">Showing {filtered.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <Link to={"/products/" + product.id}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{product.category}</span>
                <Link to={"/products/" + product.id}>
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
