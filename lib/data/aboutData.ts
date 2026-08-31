import { Shield, Truck, Phone, Package, Target, Eye, Star, CheckCircle } from "lucide-react";

export const ABOUT_DATA = {
  hero: {
    title: "Trusted Veterinary & Animal Care Solutions",
    subtitle: "Your reliable partner for veterinary medicines, livestock products, poultry supplements, and pet care essentials across Pakistan.",
  },
  story: {
    title: "Our Journey to Excellence",
    content: [
      "Usama Vet & Surgical was established with a clear vision: to elevate the standard of animal healthcare and farming equipment across Pakistan. What started as a local initiative has grown into a trusted nationwide supplier.",
      "Our focus has always been on providing accessible, genuine, and reliable veterinary solutions. From commercial livestock farms to individual pet owners, we strive to ensure that every customer receives the best possible products and support.",
    ],
    image: "/images/about/our-story.jpg",
  },
  founder: {
    name: "M. Usama",
    designation: "Founder & CEO",
    message: "Our goal is to make quality animal-care and veterinary products easier for customers to find and order, while providing reliable support throughout the buying process.",
    image: "/images/about/founder.jpg",
  },
  missionVision: {
    mission: {
      title: "Our Mission",
      content: "Make trusted veterinary and animal-care products easier to access through a reliable and convenient shopping experience.",
      icon: Target,
    },
    vision: {
      title: "Our Vision",
      content: "Build a recognized and dependable animal-care e-commerce destination for customers across Pakistan.",
      icon: Eye,
    }
  },
  reach: {
    title: "Serving Animal-Care Customers Across Pakistan",
    stats: [
      { label: "Cities Served", value: "CLIENT_TO_PROVIDE" },
      { label: "Products Available", value: "CLIENT_TO_PROVIDE" },
      { label: "Customers Served", value: "CLIENT_TO_PROVIDE" },
      { label: "Brands Available", value: "CLIENT_TO_PROVIDE" },
    ]
  },
  benefits: [
    { title: "Broad Product Selection", description: "Comprehensive range of veterinary medicines and supplements.", icon: Package },
    { title: "Easy Online Ordering", description: "Streamlined checkout process for quick and hassle-free purchases.", icon: CheckCircle },
    { title: "Customer Support", description: "Dedicated assistance via phone and WhatsApp for your queries.", icon: Phone },
    { title: "Nationwide Delivery", description: "Reliable shipping to ensure your products reach you safely.", icon: Truck },
    { title: "Secure Checkout", description: "Safe and encrypted payment methods for peace of mind.", icon: Shield },
    { title: "Quality-Focused Sourcing", description: "Products sourced directly from reputable manufacturers.", icon: Star },
  ],
  videos: [
    { id: "vid_1", title: "Warehouse Tour", description: "A behind-the-scenes look at our temperature-controlled storage.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid1/600/400" },
    { id: "vid_2", title: "Livestock Expo", description: "Showcasing our products at the national dairy exhibition.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid2/600/400" },
    { id: "vid_3", title: "Daily Dispatches", description: "How we securely pack and ship orders across Pakistan.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid3/600/400" },
  ],
  values: [
    { title: "Customer First", description: "We prioritize our customers' needs and ensure a smooth shopping experience." },
    { title: "Reliable Service", description: "Dependable order fulfillment and consistent product availability." },
    { title: "Responsible Information", description: "Providing accurate product details for informed purchasing decisions." },
    { title: "Long-Term Relationships", description: "Building trust with farmers, breeders, and pet owners for ongoing success." },
  ],
  cta: {
    title: "Explore Our Veterinary & Animal Care Range",
    subtitle: "Find the right products for your livestock, poultry, and pets today.",
  }
};
