import clsx from 'clsx';

const Loading = ({ fixed = false, backdrop = false }) => {
  return (
    <div className={clsx('inset-0 z-100', fixed ? 'fixed' : 'absolute', backdrop && 'bg-black/40')}>
      <div
        className={clsx(
          'absolute top-1/2 left-1/2 size-14 -translate-1/2 animate-spin',
          'rounded-[50%] border-3 border-black/20 border-t-orange-500'
        )}
      ></div>
    </div>
  );
};

export default Loading;
