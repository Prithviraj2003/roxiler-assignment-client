import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  IconButton,
  Modal,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Homepage = () => {
  const [month, setMonth] = useState("03"); // Default to null
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [openSearchModal, setOpenSearchModal] = useState(false); // State to manage search modal visibility
  const [tableData, setTableData] = useState([]);
  const [Statistics, setStatistics] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Function to fetch data with search, page, and perPage parameters
  const fetchData = async (search = "", page = 1, perPage = 10) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/transactions`,
        {
          params: {
            search,
            page,
            perPage,
            month,
          },
        }
      );

      setTableData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getStatisics`,
        {
          params: {
            month,
          },
        }
      );
      setStatistics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getBarChartData`,
        {
          params: {
            month,
          },
        }
      );
      setBarChartData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Effect to fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchData(searchQuery, currentPage, itemsPerPage);
    // eslint-disable-next-line
  }, [searchQuery, currentPage, itemsPerPage, month]); // Dependencies include searchQuery, currentPage, and itemsPerPage

  useEffect(() => {
    fetchStatistics();
    fetchBarChartData();
    // eslint-disable-next-line
  }, [month]);
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleMonthChange = (event) => {
    if (event.target.value === "null") {
      setMonth(null);
      return;
    }
    setMonth(event.target.value);
    setCurrentPage(1); // Reset to the first page when the month changes
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleSearchIconClick = () => {
    setOpenSearchModal(true); // Open the search modal on mobile
  };

  const handleCloseModal = () => {
    setOpenSearchModal(false); // Close the search modal
  };

  return (
    <Box sx={{ padding: "20px" }} className="container">
      <h1 sx={{ mb: 3, color: "#161D6F" }}>Transaction Board</h1>

      {/* Search and Month Selection */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box
          sx={{
            display: { xs: "none", md: "flex" }, // Hide on mobile
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            border: "1px solid #ddd",
            borderRadius: "50px",
            padding: "5px 15px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            width: "300px",
            backgroundColor: "#fff",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search transaction"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              disableUnderline: true,
              sx: { paddingLeft: "10px", flex: 1 },
            }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleSearchIconClick}
        >
          <SearchIcon />
        </IconButton>

        <Select
          value={month ? month : "null"}
          onChange={handleMonthChange}
          sx={{
            width: "200px", // Adjust the width as needed
          }}
        >
          <MenuItem value="null">All Months</MenuItem>
          {[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ]?.map((m) => (
            <MenuItem key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {month && (
        <Card variant="outlined">
          {
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Statistics of{" "}
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </Typography>
              <Typography variant="body2">
                Total Sale Amount : {Statistics.totalSaleAmount}
                <br />
                Total Sold Items : {Statistics.totalSoldItems}
                <br />
                Total Not Sold Items : {Statistics.totalNotSoldItems}
              </Typography>
            </CardContent>
          }
        </Card>
      )}
      {/* Transactions Table */}
      <Table
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          borderRadius: "15px",
        }}
      >
        <TableHead>
          <TableRow className="bg-gray">
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.transactions?.map((transaction, index) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </TableCell>{" "}
              {/* Adjust for current page */}
              <TableCell>{transaction.title}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.price}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
              <TableCell>
                <img src={transaction.image} alt="Transaction" width="50" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 3,
        }}
      >
        <Typography>Page No: {currentPage}</Typography>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
        <Typography>
          Per Page:
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            sx={{
              width: "100px", // Adjust the width as needed
            }}
          >
            {["10", "20", "30"]?.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </Typography>
      </Box>

      {/* Statistics */}
      {/* <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Transaction Statistics</Typography>
                <Typography>Total Sale Amount: {sampleStatistics.totalSaleAmount}</Typography>
                <Typography>Total Sold Items: {sampleStatistics.totalSoldItems}</Typography>
                <Typography>Total Not Sold Items: {sampleStatistics.totalNotSoldItems}</Typography>
            </Box> */}

      {/* Transactions Bar Chart */}
      {barChartData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Bar
            sx={{ width: "400px" }}
            data={{
              labels: [
                "0-100",
                "101-200",
                "201-300",
                "301-400",
                "401-500",
                "501-600",
                "601-700",
                "701-800",
                "801-900",
                "901-above",
              ],
              datasets: [
                {
                  label: "# of Items in Price Range",
                  data: barChartData?.map((data) => data.count),
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Price Range",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "# of Items",
                  },
                },
              },
            }}
          />
        </Box>
      )}

      {/* Search Modal */}
      <Modal
        open={openSearchModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            variant="outlined"
            placeholder="Search transaction"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Homepage;
