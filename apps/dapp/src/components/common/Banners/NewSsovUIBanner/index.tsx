const NewSsovUIBanner = () => {
  return (
    <div className="w-fit mx-auto mt-32 mb-4 lg:mb-8 bg-primary rounded-lg p-2 h-full flex">
      <div className="text-white flex justify-between space-x-4">
        <span className="text-left break-before-all my-auto w-4/5">
          Our new SSOV Interface is currently live for Beta testing!{' '}
        </span>
        <a
          className="bg-white text-black rounded-md px-2 py-1 w-1/5 my-auto"
          href="https://app.dopex.io/ssov-new/ARB"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-sm text-primary my-2">Launch</span>
        </a>
      </div>
    </div>
  );
};

export default NewSsovUIBanner;
