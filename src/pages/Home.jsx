import { Link } from 'react-router';
import ProductFeatureCard from '../components/ProductFeatureCard';

const Home = () => {
  return (
    <div className="uppercase">
      <div className="relative h-[90vh]" id="hero">
        <img
          className="hidden h-full w-full object-cover lg:block"
          src="https://www.newlinehalo.com/dw/image/v2/BDWL_PRD/on/demandware.static/-/Sites-halo-Library/default/dweb5c5003/Front Page/AUGUST/WEB_HALO_2025_Aug_Week32_Hero_Desktop_01.jpg"
          alt="Hero"
        />
        <img
          className="h-full w-full object-cover lg:hidden"
          src="https://www.newlinehalo.com/dw/image/v2/BDWL_PRD/on/demandware.static/-/Sites-halo-Library/default/dw21ce7b41/Front Page/AUGUST/WEB_HALO_2025_Aug_Week32_Hero_Mobile_01.jpg"
          alt="Hero"
        />
        <div className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-y-4 p-8 lg:flex-row">
          <h2 className="text-[2rem] font-bold text-white md:text-[2.5rem]">Back to training</h2>
          <Link
            to="/mens-new-in"
            className="btn text-dark text-[15px] leading-[17.25px] [--btn-bg:#fff]"
          >
            Shop the news
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <ProductFeatureCard
          imageSrc="images/homepage/mens-training.jpg"
          label="Men's training"
          link="/mens-training"
        />
        <ProductFeatureCard
          imageSrc="images/homepage/halo-sorona-half-zip.jpg"
          label="Halo Sorona Half Zip"
          link="/mens-clothing"
          textBlack
        />
      </div>
      <ProductFeatureCard
        className="h-[50vh]"
        imageSrc="images/homepage/halo-archive.jpg"
        label="The Halo Archive"
        labelProminent
        showLinkIcon={false}
        link="/archive"
      />
      <div className="flex flex-col md:flex-row">
        <ProductFeatureCard
          imageSrc="images/homepage/light-outwear.jpg"
          label="Light outwear"
          link="/womens-outdoor"
        />
        <ProductFeatureCard
          imageSrc="images/homepage/tees-and-shorts.jpg"
          label="Tees and shorts"
          link="/mens-training"
        />
      </div>
    </div>
  );
};

export default Home;
