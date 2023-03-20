const SushiMigrationBanner = () => {
  return (
    <div className="xl:max-w-5xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-md mx-auto mt-32 mb-4 lg:mb-8 bg-primary rounded-lg py-4 px-6 h-full">
      <div className="text-white text-lg">
        The Farms have been migrated to the Sushi Earn Platform:{' '}
        <a
          className="underline"
          href="https://www.sushi.com/earn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sushi Earn
        </a>
      </div>
    </div>
  );
};

export default SushiMigrationBanner;
