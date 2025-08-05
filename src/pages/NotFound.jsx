import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="pt-40 pb-20">
      <div className="align-center flex w-full flex-wrap">
        <div className="space-y-4 p-8 md:w-1/2">
          <h1 className="pb-8 text-4xl font-medium">404</h1>
          <p>We can't seem to find the page you're looking for.</p>
          <p>
            Perhaps we've linked to a product that no longer exists or maybe you've made a typo?
          </p>
          <Link className="underline" to="/">
            GO HOME »
          </Link>
        </div>
        <div className="md:w-1/2">
          <img src="/images/404.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
