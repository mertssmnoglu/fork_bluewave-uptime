import { useState } from "react";
import Search from "../../../../../Components/Inputs/Search";
import { Box } from "@mui/material";
import useDebounce from "../../Hooks/useDebounce";
import { useEffect } from "react";
import PropTypes from "prop-types";

const SearchComponent = ({ monitors, onSearchChange, setIsSearching }) => {
	const [localSearch, setLocalSearch] = useState("");
	const debouncedSearch = useDebounce(localSearch, 500);
	useEffect(() => {
		onSearchChange(debouncedSearch);
		setIsSearching(false);
	}, [debouncedSearch, onSearchChange, setIsSearching]);

	const handleSearch = (value) => {
		setLocalSearch(value);
		setIsSearching(true);
	};

	return (
		<Box
			width="25%"
			minWidth={150}
			ml="auto"
		>
			<Search
				options={monitors}
				filteredBy="name"
				inputValue={localSearch}
				handleInputChange={handleSearch}
			/>
		</Box>
	);
};

SearchComponent.propTypes = {
	monitors: PropTypes.array,
	onSearchChange: PropTypes.func,
	setIsSearching: PropTypes.func,
};

export default SearchComponent;