import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SearchProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch, className, style }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
      <TextField
        className={`${className ? className || '' : ''}`}
        variant="outlined"
        placeholder="Search..."
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ input: { fontSize: '0.9rem' }, ...(style || {}) }}
        style={{ border: '1px solid rgba(208,219,240,1)', borderRadius: '0.5em' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ fontSize: '1.3rem' }} />
            </InputAdornment>
          ),
        }}
      />
    );
};

export default Search;