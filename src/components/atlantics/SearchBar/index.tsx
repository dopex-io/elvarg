import CustomInput from 'components/UI/CustomInput';

interface SearchBarProps {
  searchKey: string;
}

const SearchBar = (props: SearchBarProps) => {
  const { searchKey } = props;

  return (
    <CustomInput
      size="medium"
      onChange={() => {}}
      id="search"
      name="search"
      variant={'filled'}
    />
  );
};

export default SearchBar;
