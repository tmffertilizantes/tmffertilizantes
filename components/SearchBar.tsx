import { ChangeEvent } from "react";

interface Props {
  items: Array<any>;
	onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar(props: Props) {
  return (
    <div className="SearchBar d-flex align-items-center">
      <span className="position-absolute ps-3 search-icon">
        <i className="fe fe-search"></i>
      </span>
      <input
        type="search"
        className="form-control form-control-sm ps-6"
        placeholder="Pesquisar"
        onChange={props.onSearchChange}
      />
    </div>
  );
}
