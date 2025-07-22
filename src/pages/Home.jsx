import { Link } from 'react-router';

const Home = () => {
  return (
    <>
      <div className="relative h-[90vh]">
        <img className="h-full w-full object-cover" src="images/hero.jpg" alt="Hero" />
        <div className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-y-4 p-8 font-bold lg:flex-row">
          <h2 className="text-4xl text-white uppercase">For any transition</h2>
          <Link className="btn bg-white text-[15px] leading-[17.25px] hover:underline">Shop the news</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
