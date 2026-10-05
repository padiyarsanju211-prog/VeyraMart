import { ProductReview } from '../types/index.ts';

const INDIAN_REVIEWERS = [
  { name: 'Aarav Sharma', city: 'Mumbai' },
  { name: 'Priya Iyer', city: 'Bengaluru' },
  { name: 'Rohit Verma', city: 'Delhi NCR' },
  { name: 'Ananya Mukherjee', city: 'Kolkata' },
  { name: 'Karthik Raja', city: 'Chennai' },
  { name: 'Sneha Patil', city: 'Pune' },
  { name: 'Vikram Choudhary', city: 'Jaipur' },
  { name: 'Neha Reddy', city: 'Hyderabad' },
  { name: 'Aditya Nair', city: 'Kochi' },
  { name: 'Pooja Agarwal', city: 'Ahmedabad' },
  { name: 'Siddharth Joshi', city: 'Indore' },
  { name: 'Divya Sen', city: 'Chandigarh' },
];

const POSITIVE_TITLES = [
  'Value for money! Truly authentic Indian quality',
  'Prompt 2-day delivery and original packing',
  'Exceeded my expectations, 10/10 recommend',
  'Superb quality, exactly as shown in images',
  'Great discount on VeyraMart, very satisfied',
  'Loved the finishing and build quality',
  'Daily essential for our family now',
];

const POSITIVE_COMMENTS = [
  'Received genuine factory sealed product within 48 hours. The packaging was top notch with heavy bubble wrap.',
  'Best price compared to local markets and retail stores. You get great savings with VeyraMart offers.',
  'Using this for the past month and the performance/feel has been flawless. Will definitely order again.',
  'Great experience! Delivered directly to my doorstep without any hassle. Cash on delivery was seamless.',
  'Finishing and quality is really premium. My whole family is happy with the purchase.',
  'Authentic brand product. Verified barcode and seal. Really happy with the quick customer support as well.',
];

export function generateProductReviews(productId: string, count = 4): ProductReview[] {
  const reviews: ProductReview[] = [];
  // Deterministic seed based on product id
  let seed = 0;
  for (let i = 0; i < productId.length; i++) {
    seed += productId.charCodeAt(i);
  }

  for (let i = 0; i < count; i++) {
    const reviewerIndex = (seed + i * 3) % INDIAN_REVIEWERS.length;
    const titleIndex = (seed + i * 2) % POSITIVE_TITLES.length;
    const commentIndex = (seed + i * 5) % POSITIVE_COMMENTS.length;
    const daysAgo = 3 + ((seed + i * 7) % 60);

    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    reviews.push({
      id: `rev-${productId}-${i}`,
      userName: INDIAN_REVIEWERS[reviewerIndex].name,
      userCity: INDIAN_REVIEWERS[reviewerIndex].city,
      rating: i === 0 ? 5 : ((seed + i) % 2 === 0 ? 5 : 4),
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: POSITIVE_TITLES[titleIndex],
      comment: POSITIVE_COMMENTS[commentIndex],
      verifiedPurchase: true,
    });
  }

  return reviews;
}
