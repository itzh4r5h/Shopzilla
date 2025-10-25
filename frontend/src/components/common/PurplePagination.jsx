import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    color: "var(--purpleDark)",
    borderColor: "var(--purpleDark)",
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    backgroundColor: "var(--purpleDark)",
    color: "#fff",
    borderColor: "var(--purpleDark)",
  },
}));

export const PurplePagination = ({ count,setPage, ...props }) => {
    const dispatch = useDispatch();
    const handleChange = (event, value) =>{
         dispatch(setPage(value))
    };

  return (
    <StyledPagination
      count={count}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      {...props}
    />
  );
};

// optional: type checking
PurplePagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number,
  onChange: PropTypes.func,
};
