import AlertIcon from 'svgs/icons/AlertIcon';

const Error = ({ errorMsg }: { errorMsg: string }) => {
  return (
    <div className="py-2 px-4 bg-down-bad rounded-lg flex justify-center space-x-2 animate-pulse">
      <AlertIcon className="my-auto w-6 h-6" />
      <p className="text-black text-s my-auto">{errorMsg}</p>
    </div>
  );
};

export default Error;
