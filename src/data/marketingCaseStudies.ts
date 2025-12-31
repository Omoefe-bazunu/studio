
import type { MarketingCaseStudy } from '@/types';

export const marketingCaseStudiesData: MarketingCaseStudy[] = [
  {
    id: 'dm-study-1',
    clientName: 'Fusion Drinks Co.',
    description: 'Launched a targeted social media campaign and SEO strategy to boost brand visibility and engagement for a new line of organic beverages.',
    imageSrc: 'https://placehold.co/600x400.png?id=dm1img1',
    imageHint: 'beverage product marketing',
    achievements: [
      { metric: 'Brand Awareness', value: '200', unit: '%', iconName: 'Eye' },
      { metric: 'Social Followers', value: '15K', unit: '+', iconName: 'Users' },
      { metric: 'Website Traffic', value: '75', unit: '%', iconName: 'LineChart' },
    ],
    category: 'Digital Marketing',
    campaignDate: '2023-11-01',
  },
  {
    id: 'dm-study-2',
    clientName: 'TechGadget Store',
    description: 'Executed a comprehensive digital marketing plan including PPC, email marketing, and content creation to drive sales for an online electronics retailer.',
    imageSrc: 'https://placehold.co/600x400.png?id=dm2img1',
    imageHint: 'gadgets e-commerce',
    achievements: [
      { metric: 'Conversion Rate', value: '30', unit: '%', iconName: 'ShoppingCart' },
      { metric: 'Email Subscribers', value: '5K', unit: '+', iconName: 'Mail' },
      { metric: 'Ad ROI', value: '3.5', unit: 'x', iconName: 'DollarSign' },
    ],
    category: 'Digital Marketing',
    campaignDate: '2024-02-15',
  },
  {
    id: 'dm-study-3',
    clientName: 'Local Eats Restaurant',
    description: 'Implemented local SEO and social media marketing to increase online orders and foot traffic for a neighborhood restaurant.',
    imageSrc: 'https://placehold.co/600x400.png?id=dm3img1',
    imageHint: 'restaurant food promotion',
    achievements: [
      { metric: 'Local Search Ranking', value: 'Top 3', unit: '', iconName: 'MapPin' },
      { metric: 'Online Orders', value: '50', unit: '%', iconName: 'Laptop' },
      { metric: 'Customer Engagement', value: '120', unit: '%', iconName: 'MessageSquare' },
    ],
    category: 'Digital Marketing',
    campaignDate: '2023-09-20',
  },
];
