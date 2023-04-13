import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/AppContext/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useAuthContext } from '../context/AuthContext/AuthContext';

export default function SearchContainer() {
  const {
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const { isLoading } = useAuthContext();

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) return;
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            label="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            selectValues={['all', ...statusOptions]}
          />

          <FormRowSelect
            label="type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            selectValues={['all', ...jobTypeOptions]}
          />

          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            selectValues={sortOptions}
          />

          <button
            className="btn btn-block btn-dange"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
