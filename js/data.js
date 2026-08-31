/* =========================================================
   STACKLY ARTISAN — Central product & catalogue data
   ========================================================= */
window.STACKLY = window.STACKLY || {};

(function(){
  'use strict';

  const CATEGORIES = [
    {id:'pottery',    name:'Pottery',    img:'images/cat-pottery.webp',    desc:'Sun-baked ceramics and terracotta made on the wheel.', count:34},
    {id:'textiles',   name:'Textiles',   img:'images/cat-textiles.webp',   desc:'Handwoven fabrics, throws and natural-dyed weaves.', count:28},
    {id:'jewelry',    name:'Jewelry',    img:'images/cat-jewelry.webp',    desc:'Handcrafted brass, beads and heritage ornaments.', count:22},
    {id:'woodcraft',  name:'Woodcraft',  img:'images/cat-woodcraft.webp',  desc:'Carved bowls, heritage lamps and heirloom wood.', count:19},
    {id:'homedecor',  name:'Home Decor', img:'images/cat-homedecor.webp',  desc:'Handmade pieces that warm every corner of your home.', count:31},
    {id:'paintings',  name:'Paintings',  img:'images/cat-paintings.webp',  desc:'Original folk art and contemporary canvas originals.', count:15},
    {id:'bags',       name:'Bags',       img:'images/cat-bags.webp',       desc:'Organic jute, cotton and leather crafted by hand.', count:17},
    {id:'traditional',name:'Traditional Crafts', img:'images/cat-traditional.webp', desc:'Time-honoured crafts passed down through generations.', count:25}
  ];

  const ARTISANS = [
    {id:'a1', name:'Meera Agarwal', img:'images/artisan-01.webp', loc:'Jaipur, Rajasthan',   craft:'Pottery & Ceramics', rating:4.9, products:24, exp:'18 yrs', src:'images/craft-workshop.webp',
     bio:'Meera learnt the potter’s wheel from her grandmother and now runs a small studio keeping the terracotta tradition of Rajasthan alive.'},
    {id:'a2', name:'Rahul Nair',    img:'images/artisan-02.webp', loc:'Kochi, Kerala',       craft:'Brass & Woodcraft',  rating:4.8, products:16, exp:'12 yrs', src:'images/about-story.webp',
     bio:'A metal-smith and woodcarver, Rahul blends coastal heritage with clean modern forms, working sustainably from reclaimed timber.'},
    {id:'a3', name:'Sunita Devi',   img:'images/artisan-03.webp', loc:'Varanasi, UP',        craft:'Handwoven Textiles', rating:4.9, products:30, exp:'22 yrs', src:'images/cat-textiles.webp',
     bio:'Sunita weaves on a traditional handloom, producing heirloom-quality fabrics dyed only with natural pigments and plant extracts.'},
    {id:'a4', name:'Ananya Rao',    img:'images/artisan-04.webp', loc:'Udaipur, Rajasthan',  craft:'Jewelry & Beading',  rating:4.7, products:12, exp:'9 yrs', src:'images/cat-jewelry.webp',
     bio:'Ananya shapes brass and bead ornaments, each inspired by the courtyards and heritage designs of her hometown Udaipur.'},
    {id:'a5', name:'Vikram Singh',  img:'images/artisan-05.webp', loc:'Bikaner, Rajasthan',  craft:'Traditional Craft',  rating:4.8, products:20, exp:'15 yrs', src:'images/cat-traditional.webp',
     bio:'Vikram specialises in heritage decorative crafts, reviving nearly-forgotten regional techniques with a contemporary eye.'},
    {id:'a6', name:'Lakshmi Menon', img:'images/artisan-06.webp', loc:'Thanjavur, Tamil Nadu',craft:'Home Decor',        rating:4.9, products:18, exp:'20 yrs', src:'images/collection-home.webp',
     bio:'Lakshmi creates thoughtful home objects that tell stories — blending sacred motifs with warm, liveable design for modern homes.'}
  ];

  /* Base products (real names, mapped to real images) */
  const PRODUCTS = [
    {id:'p1',  title:'Terracotta Ceramic Vase',     category:'pottery',    artisan:'a1', img:'images/pottery-vase.webp',     price:1450, was:1950, rating:4.9, reviews:128, materials:'Natural terracotta clay', dims:'H 28cm · Ø 14cm', time:'3 days', stock:12,
     short:'A hand-thrown terracotta vase with a warm matte glaze, fired slowly in a wood kiln.'},
    {id:'p2',  title:'Handwoven Cotton Basket',     category:'textiles',   artisan:'a3', img:'images/handwoven-basket.webp', price:1250, was:0,    rating:4.8, reviews:96,  materials:'Handspun cotton rope', dims:'Ø 30cm · H 22cm', time:'2 days', stock:20,
     short:'A sturdy, organic basket woven by hand from natural cotton rope — perfect for storage.'},
    {id:'p3',  title:'Wooden Heritage Lamp',        category:'woodcraft',  artisan:'a2', img:'images/wooden-lamp.webp',      price:3200, was:3900, rating:4.9, reviews:74,  materials:'Sheesham wood & brass', dims:'H 34cm · Ø 20cm', time:'5 days', stock:6,
     short:'Heirloom wooden lamp with a warm brass glow, carved from sustainably sourced sheesham.'},
    {id:'p4',  title:'Handmade Clay Dinner Set',    category:'pottery',    artisan:'a1', img:'images/clay-dinner-set.webp',  price:5600, was:0,    rating:4.7, reviews:58,  materials:'Earthenware clay', dims:'6 pieces', time:'7 days', stock:9,
     short:'A complete handmade dinner set, each piece subtly unique from the potter’s wheel.'},
    {id:'p5',  title:'Traditional Brass Necklace',  category:'jewelry',    artisan:'a4', img:'images/brass-necklace.webp',   price:2400, was:2900, rating:4.8, reviews:110, materials:'Hand-polished brass', dims:'Length 42cm', time:'4 days', stock:15,
     short:'A hand-polished brass necklace inspired by heritage jewellery and folk motifs.'},
    {id:'p6',  title:'Organic Jute Handbag',        category:'bags',       artisan:'a3', img:'images/jute-handbag.webp',     price:950,  was:0,    rating:4.6, reviews:83,  materials:'Organic jute & cotton', dims:'H 30cm · W 33cm', time:'2 days', stock:30,
     short:'An everyday tote woven from organic jute, lined with soft handspun cotton.'},
    {id:'p7',  title:'Earthy Ceramic Bowl Set',     category:'homedecor',  artisan:'a6', img:'images/ceramic-bowl.webp',     price:1800, was:2200, rating:4.8, reviews:67,  materials:'Stoneware & glaze', dims:'Set of 3 · Ø 16cm', time:'4 days', stock:14,
     short:'Three nested stoneware bowls in earthy glazes, made for warm everyday tables.'},
    {id:'p8',  title:'Handwoven Textile Throw',     category:'textiles',   artisan:'a3', img:'images/textile-throw.webp',    price:2900, was:0,    rating:4.9, reviews:140, materials:'Handloom cotton', dims:'130 × 180cm', time:'6 days', stock:8,
     short:'A generous handloom throw in muted earthy tones, woven on a traditional loom.'},
    {id:'p9',  title:'Handcarved Wooden Bowl',      category:'woodcraft',  artisan:'a2', img:'images/wooden-bowl.webp',      price:2100, was:0,    rating:4.7, reviews:49,  materials:'Reclaimed teak', dims:'Ø 24cm · H 8cm', time:'5 days', stock:11,
     short:'A food-safe wooden bowl carved from reclaimed teak, oiled for a silky finish.'},
    {id:'p10', title:'Stoneware Coffee Set',        category:'pottery',    artisan:'a1', img:'images/coffee-set.webp',       price:3400, was:4100, rating:4.8, reviews:92,  materials:'Stoneware', dims:'6 pieces', time:'6 days', stock:7,
     short:'A cosy hand-thrown coffee set that makes slow mornings feel special.'},
    {id:'p11', title:'Original Folk Wall Art',      category:'paintings',  artisan:'a5', img:'images/wall-art.webp',        price:3900, was:0,    rating:4.9, reviews:61,  materials:'Acrylic on canvas', dims:'60 × 90cm', time:'8 days', stock:5,
     short:'An original folk-inspired canvas painting, signed and ready to frame.'},
    {id:'p12', title:'Ceramic Planter Pot',         category:'homedecor',  artisan:'a6', img:'images/ceramic-planter.webp', price:1200, was:0,    rating:4.6, reviews:45,  materials:'Ceramic & terracotta', dims:'Ø 18cm · H 16cm', time:'3 days', stock:18,
     short:'A charming handmade planter with a natural drainage saucer for your greens.'},
    {id:'p13', title:'Hand-poured Soy Candle',      category:'homedecor',  artisan:'a6', img:'images/soy-candle.webp',      price:850,  was:0,    rating:4.7, reviews:120, materials:'Soy wax & cotton wick', dims:'H 9cm · Ø 8cm', time:'1 day', stock:40,
     short:'A slow-burning soy candle with a soft, earthy scent hand-poured in small batches.'},
    {id:'p14', title:'Hand-thrown Ceramic Mug',     category:'pottery',    artisan:'a1', img:'images/ceramic-mug.webp',     price:750,  was:0,    rating:4.9, reviews:210, materials:'Stoneware & glaze', dims:'H 9cm · 320ml', time:'2 days', stock:35,
     short:'A hefty, hand-thrown mug in a toasted glaze — keeps your coffee warm, longer.'}
  ];

  const COLLECTIONS = [
    {id:'c1', name:'Heritage Collection',   img:'images/collection-heritage.webp',      desc:'Time-honoured crafts and generational techniques, curated with care.', count:12},
    {id:'c2', name:'Sustainable Living',    img:'images/collection-sustainable.webp',   desc:'Earthy, planet-kind pieces made from natural and reclaimed materials.', count:9},
    {id:'c3', name:'Festive Crafts',        img:'images/collection-festive.webp',       desc:'Colourful, celebratory handmade objects for your most joyful moments.', count:10},
    {id:'c4', name:'Modern Handmade',       img:'images/collection-modern.webp',        desc:'Clean, contemporary forms crafted slowly by independent makers.', count:11},
    {id:'c5', name:'Gifts for Her',         img:'images/collection-gifts-her.webp',     desc:'Considered, beautiful gifts she will treasure for years.', count:8},
    {id:'c6', name:'Gifts for Him',         img:'images/collection-gifts-him.webp',     desc:'Thoughtful handmade pieces for the man who appreciates craft.', count:7},
    {id:'c7', name:'Home & Living',         img:'images/collection-home.webp',          desc:'Warm, liveable objects to make every room feel truly yours.', count:13},
    {id:'c8', name:'Premium Artisan Picks', img:'images/collection-premium.webp',       desc:'Our most-loved, highest-rated pieces from featured artisans.', count:10}
  ];

  const NAMES = {'p1':'Terracotta Ceramic Vase','p2':'Handwoven Cotton Basket','p3':'Wooden Heritage Lamp','p4':'Handmade Clay Dinner Set','p5':'Traditional Brass Necklace','p6':'Organic Jute Handbag','p7':'Earthy Ceramic Bowl Set','p8':'Handwoven Textile Throw','p9':'Handcarved Wooden Bowl','p10':'Stoneware Coffee Set','p11':'Original Folk Wall Art','p12':'Ceramic Planter Pot','p13':'Hand-poured Soy Candle','p14':'Hand-thrown Ceramic Mug'};

  function getProduct(id){ return PRODUCTS.find(p=>p.id===id) || null; }
  function getArtisan(id){ return ARTISANS.find(a=>a.id===id) || null; }
  function getCategory(id){ return CATEGORIES.find(c=>c.id===id) || null; }
  function getCollection(id){ return COLLECTIONS.find(c=>c.id===id) || null; }
  function artisanProducts(id){ return PRODUCTS.filter(p=>p.artisan===id); }
  function categoryProducts(id){ return PRODUCTS.filter(p=>p.category===id); }
  function formatPrice(n){ return '₹' + Number(n||0).toLocaleString('en-IN'); }

  window.STACKLY.data = {
    CATEGORIES, ARTISANS, PRODUCTS, COLLECTIONS, NAMES,
    getProduct, getArtisan, getCategory, getCollection,
    artisanProducts, categoryProducts, formatPrice
  };
})();
