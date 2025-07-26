import clsx from 'clsx';

const Loading = () => {
  return (
    <div className="fixed z-100 h-screen w-screen bg-black/25">
      <div
        className={clsx(
          'absolute top-1/2 left-1/2 size-14 -translate-1/2 animate-spin',
          'rounded-[50%] border-2 border-black/15 border-t-orange-500'
        )}
      ></div>
    </div>
  );
};

export default Loading;
