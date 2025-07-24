import { Link } from 'react-router';
import ProductFeatureCard from '../components/ProductFeatureCard';

const Home = () => {
  return (
    <div className="uppercase">
      <div className="relative h-[90vh]">
        <img className="h-full w-full object-cover" src="images/homepage/hero.jpg" alt="Hero" />
        <div className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-y-4 p-8 lg:flex-row">
          <h2 className="text-[40px] font-bold text-white">For any transition</h2>
          <Link className="btn text-[15px] leading-[17.25px]">Shop the news</Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <ProductFeatureCard
          imageSrc="images/homepage/mens-training.jpg"
          label="Men's training"
          link="https://www.newlinehalo.com/men/activewear"
        />
        <ProductFeatureCard
          imageSrc="images/homepage/halo-sorona-half-zip.jpg"
          label="Halo Sorona Half Zip"
          link="https://www.newlinehalo.com/halo-sorona-half-zip-turbulence/610544-1518.html"
          textBlack
        />
      </div>
      <ProductFeatureCard
        className="h-[50vh]"
        imageSrc="images/homepage/halo-archive.jpg"
        label="The Halo Archive"
        labelProminent
        showLinkIcon={false}
        link="https://www.newlinehalo.com/archive"
      />
      <div className="flex flex-col md:flex-row">
        <ProductFeatureCard
          imageSrc="images/homepage/light-outwear.jpg"
          label="Light outwear"
          link="https://www.newlinehalo.com/women/outdoor"
        />
        <ProductFeatureCard
          imageSrc="images/homepage/tees-and-shorts.jpg"
          label="Tees and shorts"
          link="https://www.newlinehalo.com/men/activewear"
        />
      </div>
    </div>
  );
};

export default Home;
