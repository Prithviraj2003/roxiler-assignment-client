import React, { useState, useEffect } from 'react';
import { Select, MenuItem, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Pagination, IconButton, Modal, InputBase, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Homepage = () => {
    const [month, setMonth] = useState('03'); // Default to March
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [openSearchModal, setOpenSearchModal] = useState(false); // State to manage search modal visibility
    const [tableData, setTableData] = useState([]);
    
    // Function to fetch data with search, page, and perPage parameters
    const fetchData = async (search = '', page = 1, perPage = 10) => {
        try {
            const response = await axios.get('http://localhost:8000/api/transactions', {
                params: {
                    search,
                    page,
                    perPage
                }
            });

            setTableData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Effect to fetch data when component mounts or when dependencies change
    useEffect(() => {
        fetchData(searchQuery, currentPage, itemsPerPage);
    }, [searchQuery, currentPage, itemsPerPage]); // Dependencies include searchQuery, currentPage, and itemsPerPage

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        setCurrentPage(1); // Reset to the first page when the month changes
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
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
        <Box sx={{ padding: '20px' }} className="container">
            <h1 sx={{ mb: 3, color: '#161D6F' }}>Transaction Board</h1>

            {/* Search and Month Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' }, // Hide on mobile
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        border: '1px solid #ddd',
                        borderRadius: '50px',
                        padding: '5px 15px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        width: '300px',
                        backgroundColor: '#fff',
                    }}
                >
                    <TextField
                        variant="standard"
                        placeholder="Search transaction"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            disableUnderline: true,
                            sx: { paddingLeft: '10px', flex: 1 },
                        }}
                    />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </Box>

                <IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={handleSearchIconClick}>
                    <SearchIcon />
                </IconButton>

                <Select value={month} onChange={handleMonthChange}
                    sx={{
                        width: '200px',  // Adjust the width as needed
                    }}
                >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']?.map((m) => (
                        <MenuItem key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Transactions Table */}
            <Table sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '15px' }}>
                <TableHead>
                    <TableRow className='bg-gray'>
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
                            <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell> {/* Adjust for current page */}
                            <TableCell>{transaction.title}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.price}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                            <TableCell><img src={transaction.image} alt="Transaction" width="50" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    my: 3
                }}
            >
                <Typography>Page No: {currentPage}</Typography>
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</Button>
                <Button onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
                <Typography>Per Page:
                    <Select value={itemsPerPage} onChange={handleItemsPerPageChange}
                        sx={{
                            width: '100px',  // Adjust the width as needed
                        }}
                    >
                        {['10', '20', '30']?.map((m) => (
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
            <Box sx={{ mt: 4 }}>
                <Bar
                    sx={{ width: '400px' }}
                    data={{
                        labels: ['0-100', '100-200', '200-300', '300-400', '400+'],
                        datasets: [
                            {
                                label: '# of Items in Price Range',
                                data: [5, 10, 15, 7, 2],
                                backgroundColor: 'rgba(75,192,192,0.4)',
                                borderColor: 'rgba(75,192,192,1)',
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
                                    text: 'Price Range',
                                },
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: '# of Items',
                                },
                            },
                        },
                    }}
                />
            </Box>

            {/* Transactions Pie Chart */}
            {/* <Box sx={{ mt: 4 }}>
                <PieChart
                    data={[
                        // { value: sampleStatistics.totalSoldItems, label: 'Sold Items' },
                        // { value: sampleStatistics.totalNotSoldItems, label: 'Not Sold Items' },
                    ]}
                    width={400}
                    height={400}
                />
            </Box> */}

            {/* Search Modal */}
            <Modal
                open={openSearchModal}
                onClose={handleCloseModal}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
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
