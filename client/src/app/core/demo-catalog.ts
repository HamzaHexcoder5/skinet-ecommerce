import { Category, Product, Seller } from './models';

// Bundled copy of the demo catalogue. Static hosting (GitHub Pages) has no
// serverless API, so the storefront falls back to this data when a request fails.
// Asset paths are relative so they resolve against the document base href.

export const DEMO_PRODUCTS: Product[] = [
  {
    "id": 1,
    "name": "Angular Speedster Board 2000",
    "description": "Built on a lightweight wood core with a sintered base, the Angular Speedster Board 2000 holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 200,
    "oldPrice": 224.99,
    "discountPercent": 10,
    "pictureUrl": "images/products/sb-ang1.png",
    "images": [
      "images/products/sb-ang1.png"
    ],
    "type": "Boards",
    "brand": "Angular",
    "category": "boards",
    "quantityInStock": 82,
    "rating": 4.8,
    "ratingCount": 49,
    "sold": 83,
    "sellerId": 2,
    "sellerName": "Alpine Gear Co.",
    "freeShipping": true
  },
  {
    "id": 2,
    "name": "Green Angular Board 3000",
    "description": "Built on a lightweight wood core with a sintered base, the Green Angular Board 3000 holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 150,
    "oldPrice": 179.99,
    "discountPercent": 15,
    "pictureUrl": "images/products/sb-ang2.png",
    "images": [
      "images/products/sb-ang2.png"
    ],
    "type": "Boards",
    "brand": "Angular",
    "category": "boards",
    "quantityInStock": 75,
    "rating": 4.6,
    "ratingCount": 86,
    "sold": 136,
    "sellerId": 3,
    "sellerName": "SnowHub Store",
    "freeShipping": true
  },
  {
    "id": 3,
    "name": "Core Board Speed Rush 3",
    "description": "Built on a lightweight wood core with a sintered base, the Core Board Speed Rush 3 holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 180,
    "oldPrice": 224.99,
    "discountPercent": 20,
    "pictureUrl": "images/products/sb-core1.png",
    "images": [
      "images/products/sb-core1.png"
    ],
    "type": "Boards",
    "brand": "NetCore",
    "category": "boards",
    "quantityInStock": 3,
    "rating": 4.4,
    "ratingCount": 123,
    "sold": 189,
    "sellerId": 4,
    "sellerName": "Peak Sports",
    "freeShipping": true
  },
  {
    "id": 4,
    "name": "Net Core Super Board",
    "description": "Built on a lightweight wood core with a sintered base, the Net Core Super Board holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 300,
    "oldPrice": 399.99,
    "discountPercent": 25,
    "pictureUrl": "images/products/sb-core2.png",
    "images": [
      "images/products/sb-core2.png"
    ],
    "type": "Boards",
    "brand": "NetCore",
    "category": "boards",
    "quantityInStock": 52,
    "rating": 4.2,
    "ratingCount": 160,
    "sold": 242,
    "sellerId": 1,
    "sellerName": "SkiNet Official",
    "freeShipping": true
  },
  {
    "id": 5,
    "name": "React Board Super Whizzy Fast",
    "description": "Built on a lightweight wood core with a sintered base, the React Board Super Whizzy Fast holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 250,
    "oldPrice": 359.99,
    "discountPercent": 30,
    "pictureUrl": "images/products/sb-react1.png",
    "images": [
      "images/products/sb-react1.png"
    ],
    "type": "Boards",
    "brand": "React",
    "category": "boards",
    "quantityInStock": 97,
    "rating": 4.9,
    "ratingCount": 197,
    "sold": 295,
    "sellerId": 2,
    "sellerName": "Alpine Gear Co.",
    "freeShipping": true
  },
  {
    "id": 6,
    "name": "Typescript Entry Board",
    "description": "Built on a lightweight wood core with a sintered base, the Typescript Entry Board holds an edge on hardpack and floats through fresh powder. Camber underfoot keeps it lively while the forgiving flex makes long days easy on the legs. Arrives waxed, tuned and ready to mount.",
    "price": 120,
    "oldPrice": null,
    "discountPercent": 0,
    "pictureUrl": "images/products/sb-ts1.png",
    "images": [
      "images/products/sb-ts1.png"
    ],
    "type": "Boards",
    "brand": "Typescript",
    "category": "boards",
    "quantityInStock": 37,
    "rating": 4.7,
    "ratingCount": 234,
    "sold": 348,
    "sellerId": 3,
    "sellerName": "SnowHub Store",
    "freeShipping": false
  },
  {
    "id": 7,
    "name": "Core Blue Hat",
    "description": "A double-layer knit with a fleece headband lets the Core Blue Hat trap heat without the itch. It packs flat into a jacket pocket, keeps its shape after a season of use and stays put under a helmet.",
    "price": 10,
    "oldPrice": 14.99,
    "discountPercent": 10,
    "pictureUrl": "images/products/hat-core1.png",
    "images": [
      "images/products/hat-core1.png"
    ],
    "type": "Hats",
    "brand": "NetCore",
    "category": "hats",
    "quantityInStock": 32,
    "rating": 4.5,
    "ratingCount": 271,
    "sold": 401,
    "sellerId": 4,
    "sellerName": "Peak Sports",
    "freeShipping": false
  },
  {
    "id": 8,
    "name": "Green React Woolen Hat",
    "description": "A double-layer knit with a fleece headband lets the Green React Woolen Hat trap heat without the itch. It packs flat into a jacket pocket, keeps its shape after a season of use and stays put under a helmet.",
    "price": 8,
    "oldPrice": 9.99,
    "discountPercent": 15,
    "pictureUrl": "images/products/hat-react1.png",
    "images": [
      "images/products/hat-react1.png"
    ],
    "type": "Hats",
    "brand": "React",
    "category": "hats",
    "quantityInStock": 6,
    "rating": 4.3,
    "ratingCount": 308,
    "sold": 454,
    "sellerId": 1,
    "sellerName": "SkiNet Official",
    "freeShipping": false
  },
  {
    "id": 9,
    "name": "Purple React Woolen Hat",
    "description": "A double-layer knit with a fleece headband lets the Purple React Woolen Hat trap heat without the itch. It packs flat into a jacket pocket, keeps its shape after a season of use and stays put under a helmet.",
    "price": 15,
    "oldPrice": 19.99,
    "discountPercent": 20,
    "pictureUrl": "images/products/hat-react2.png",
    "images": [
      "images/products/hat-react2.png"
    ],
    "type": "Hats",
    "brand": "React",
    "category": "hats",
    "quantityInStock": 17,
    "rating": 4.1,
    "ratingCount": 345,
    "sold": 507,
    "sellerId": 2,
    "sellerName": "Alpine Gear Co.",
    "freeShipping": false
  },
  {
    "id": 10,
    "name": "Blue Code Gloves",
    "description": "A waterproof insert and brushed lining keep the Blue Code Gloves warm on the coldest lifts. The palm is reinforced for rope work and board carry, while touchscreen-friendly fingertips mean you never have to bare a hand to check your phone.",
    "price": 18,
    "oldPrice": 24.99,
    "discountPercent": 25,
    "pictureUrl": "images/products/glove-code1.png",
    "images": [
      "images/products/glove-code1.png"
    ],
    "type": "Gloves",
    "brand": "VS Code",
    "category": "gloves",
    "quantityInStock": 74,
    "rating": 4.8,
    "ratingCount": 382,
    "sold": 560,
    "sellerId": 3,
    "sellerName": "SnowHub Store",
    "freeShipping": false
  },
  {
    "id": 11,
    "name": "Green Code Gloves",
    "description": "A waterproof insert and brushed lining keep the Green Code Gloves warm on the coldest lifts. The palm is reinforced for rope work and board carry, while touchscreen-friendly fingertips mean you never have to bare a hand to check your phone.",
    "price": 15,
    "oldPrice": 24.99,
    "discountPercent": 30,
    "pictureUrl": "images/products/glove-code2.png",
    "images": [
      "images/products/glove-code2.png"
    ],
    "type": "Gloves",
    "brand": "VS Code",
    "category": "gloves",
    "quantityInStock": 19,
    "rating": 4.6,
    "ratingCount": 419,
    "sold": 613,
    "sellerId": 4,
    "sellerName": "Peak Sports",
    "freeShipping": false
  },
  {
    "id": 12,
    "name": "Purple React Gloves",
    "description": "A waterproof insert and brushed lining keep the Purple React Gloves warm on the coldest lifts. The palm is reinforced for rope work and board carry, while touchscreen-friendly fingertips mean you never have to bare a hand to check your phone.",
    "price": 16,
    "oldPrice": null,
    "discountPercent": 0,
    "pictureUrl": "images/products/glove-react1.png",
    "images": [
      "images/products/glove-react1.png"
    ],
    "type": "Gloves",
    "brand": "React",
    "category": "gloves",
    "quantityInStock": 77,
    "rating": 4.4,
    "ratingCount": 456,
    "sold": 666,
    "sellerId": 1,
    "sellerName": "SkiNet Official",
    "freeShipping": false
  },
  {
    "id": 13,
    "name": "Green React Gloves",
    "description": "A waterproof insert and brushed lining keep the Green React Gloves warm on the coldest lifts. The palm is reinforced for rope work and board carry, while touchscreen-friendly fingertips mean you never have to bare a hand to check your phone.",
    "price": 14,
    "oldPrice": 19.99,
    "discountPercent": 10,
    "pictureUrl": "images/products/glove-react2.png",
    "images": [
      "images/products/glove-react2.png"
    ],
    "type": "Gloves",
    "brand": "React",
    "category": "gloves",
    "quantityInStock": 45,
    "rating": 4.2,
    "ratingCount": 13,
    "sold": 719,
    "sellerId": 2,
    "sellerName": "Alpine Gear Co.",
    "freeShipping": false
  },
  {
    "id": 14,
    "name": "Redis Red Boots",
    "description": "A heat-mouldable liner and a supportive shell give the Redis Red Boots the response you want on steep runs without punishing your feet on the lift. Reinforced toe caps and a grippy outsole handle icy car parks and short bootpacks, and the flex stays consistent below freezing.",
    "price": 250,
    "oldPrice": 294.99,
    "discountPercent": 15,
    "pictureUrl": "images/products/boot-redis1.png",
    "images": [
      "images/products/boot-redis1.png"
    ],
    "type": "Boots",
    "brand": "Redis",
    "category": "boots",
    "quantityInStock": 49,
    "rating": 4.9,
    "ratingCount": 50,
    "sold": 772,
    "sellerId": 3,
    "sellerName": "SnowHub Store",
    "freeShipping": true
  },
  {
    "id": 15,
    "name": "Core Red Boots",
    "description": "A heat-mouldable liner and a supportive shell give the Core Red Boots the response you want on steep runs without punishing your feet on the lift. Reinforced toe caps and a grippy outsole handle icy car parks and short bootpacks, and the flex stays consistent below freezing.",
    "price": 189.99,
    "oldPrice": 239.99,
    "discountPercent": 20,
    "pictureUrl": "images/products/boot-core2.png",
    "images": [
      "images/products/boot-core2.png"
    ],
    "type": "Boots",
    "brand": "NetCore",
    "category": "boots",
    "quantityInStock": 28,
    "rating": 4.7,
    "ratingCount": 87,
    "sold": 825,
    "sellerId": 4,
    "sellerName": "Peak Sports",
    "freeShipping": true
  },
  {
    "id": 16,
    "name": "Core Purple Boots",
    "description": "A heat-mouldable liner and a supportive shell give the Core Purple Boots the response you want on steep runs without punishing your feet on the lift. Reinforced toe caps and a grippy outsole handle icy car parks and short bootpacks, and the flex stays consistent below freezing.",
    "price": 199.99,
    "oldPrice": 269.99,
    "discountPercent": 25,
    "pictureUrl": "images/products/boot-core1.png",
    "images": [
      "images/products/boot-core1.png"
    ],
    "type": "Boots",
    "brand": "NetCore",
    "category": "boots",
    "quantityInStock": 69,
    "rating": 4.5,
    "ratingCount": 124,
    "sold": 878,
    "sellerId": 1,
    "sellerName": "SkiNet Official",
    "freeShipping": true
  },
  {
    "id": 17,
    "name": "Angular Purple Boots",
    "description": "A heat-mouldable liner and a supportive shell give the Angular Purple Boots the response you want on steep runs without punishing your feet on the lift. Reinforced toe caps and a grippy outsole handle icy car parks and short bootpacks, and the flex stays consistent below freezing.",
    "price": 150,
    "oldPrice": 214.99,
    "discountPercent": 30,
    "pictureUrl": "images/products/boot-ang2.png",
    "images": [
      "images/products/boot-ang2.png"
    ],
    "type": "Boots",
    "brand": "Angular",
    "category": "boots",
    "quantityInStock": 35,
    "rating": 4.3,
    "ratingCount": 161,
    "sold": 31,
    "sellerId": 2,
    "sellerName": "Alpine Gear Co.",
    "freeShipping": true
  },
  {
    "id": 18,
    "name": "Angular Blue Boots",
    "description": "A heat-mouldable liner and a supportive shell give the Angular Blue Boots the response you want on steep runs without punishing your feet on the lift. Reinforced toe caps and a grippy outsole handle icy car parks and short bootpacks, and the flex stays consistent below freezing.",
    "price": 180,
    "oldPrice": null,
    "discountPercent": 0,
    "pictureUrl": "images/products/boot-ang1.png",
    "images": [
      "images/products/boot-ang1.png"
    ],
    "type": "Boots",
    "brand": "Angular",
    "category": "boots",
    "quantityInStock": 27,
    "rating": 4.1,
    "ratingCount": 198,
    "sold": 84,
    "sellerId": 3,
    "sellerName": "SnowHub Store",
    "freeShipping": true
  }
];

export const DEMO_CATEGORIES: Category[] = [
  {
    "id": 1,
    "name": "Boards",
    "slug": "boards",
    "image": "images/products/sb-ang1.png",
    "tagline": "Snowboards & decks",
    "count": 6
  },
  {
    "id": 2,
    "name": "Boots",
    "slug": "boots",
    "image": "images/products/boot-ang1.png",
    "tagline": "All-mountain boots",
    "count": 5
  },
  {
    "id": 3,
    "name": "Gloves",
    "slug": "gloves",
    "image": "images/products/glove-code1.png",
    "tagline": "Insulated gloves",
    "count": 4
  },
  {
    "id": 4,
    "name": "Hats",
    "slug": "hats",
    "image": "images/products/hat-core1.png",
    "tagline": "Beanies & caps",
    "count": 3
  }
];

export const DEMO_SELLERS: Seller[] = [
  {
    "id": 1,
    "name": "SkiNet Official",
    "slug": "skinet-official",
    "rating": 4.9,
    "followers": 128400,
    "since": 2019
  },
  {
    "id": 2,
    "name": "Alpine Gear Co.",
    "slug": "alpine-gear",
    "rating": 4.7,
    "followers": 42100,
    "since": 2020
  },
  {
    "id": 3,
    "name": "SnowHub Store",
    "slug": "snowhub",
    "rating": 4.5,
    "followers": 18750,
    "since": 2021
  },
  {
    "id": 4,
    "name": "Peak Sports",
    "slug": "peak-sports",
    "rating": 4.6,
    "followers": 9630,
    "since": 2022
  }
];
