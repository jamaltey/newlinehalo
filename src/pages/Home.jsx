import { Link } from 'react-router';
import ProductFeatureCard from '../components/ProductFeatureCard';

const Home = () => {
  return (
    <div className="uppercase">
      <div className="relative h-[90vh]" id="hero">
        <video className="hidden lg:block" loop autoPlay muted>
          <source src="https://player.vimeo.com/progressive_redirect/playback/1105089822/rendition/1080p/file.mp4?loc=external&signature=00b19cf6de335177a10b3a26abab47f2ad376d3ed208539551306db4411b391a" />
        </video>
        <video className="h-full object-cover lg:hidden" loop autoPlay muted>
          <source src="https://player.vimeo.com/progressive_redirect/playback/1105092258/rendition/720p/file.mp4?loc=external&signature=4d6061aee66e2836a64e43c7642f51d0c5d05589f522e9c805a63ad2154ecc8e" />
        </video>
        <div className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-y-4 p-8 lg:flex-row">
          <h2 className="text-[2rem] font-bold text-white md:text-[2.5rem]">Back to training</h2>
          <Link className="btn text-dark text-[15px] leading-[17.25px] [--btn-bg:#fff]">
            Shop the news
          </Link>
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
