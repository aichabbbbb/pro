import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ReptureStock from './ReptureStock';
import TableKpi from './TableKpi';


const COLORS = ['rgb(65 169 204)', 'rgb(44 176 44)', '#FFD700', '#FFA07A', 'rgb(255 0 224)'];
// Light Blue, Light Green, Gold, Light Salmon, Light Pink


// KPI Graph Component
const KpiGraphResto = ({ data = [] }) => {
  const processedData = data.reduce((acc, item) => {
    const existingMonth = acc.find((entry) => entry.Mois === item.Mois);
    if (existingMonth) {
      existingMonth[item.Année] = item.CA;
    } else {
      acc.push({ Mois: item.Mois, [item.Année]: item.CA });
    }
    return acc;
  }, []);

  // Calculer le taux de croissance
  const growthRates = processedData.map((entry, index) => {
    const rates = {};
    Object.keys(entry).forEach((key) => {
      if (key !== 'Mois') {
        const currentCA = entry[key];
        const previousCA = index > 0 ? processedData[index - 1][key] : null;
        if (previousCA !== null && previousCA > 0) {
          rates[key] = ((currentCA - previousCA) / previousCA) * 100; // Taux de croissance
        } else {
          rates[key] = null; // Pas de taux de croissance si pas d'année précédente
        }
      }
    });
    return { Mois: entry.Mois, ...rates };
  });

  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const month = payload[0].payload.Mois;
    const tooltipContent = payload.map((entry) => {
      const year = entry.name;
      const ca = entry.value;
      const growthRate = growthRates.find((rate) => rate.Mois === month)[year];

      return (
        <div
          key={year}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px',
            padding: '8px',
            borderBottom: '1px solid #e0e0e0',
            fontSize: '14px',
            backgroundColor: growthRate > 0 ? '#e0ffe0' : '#ffe0e0' // green for growth, red for decline
          }}
        >
          <strong>{year}</strong>: {ca.toLocaleString()}
          {growthRate !== null && (
            <span style={{
              color: growthRate > 0 ? 'green' : 'red',
              marginLeft: '10px',
              fontWeight: 'bold'
            }}>
              {growthRate > 0 ? '⬆' : '⬇'} {growthRate.toFixed(2)}%
            </span>
          )}
        </div>
      );
    });
    return <div className="custom-tooltip" style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc' }}>{tooltipContent}</div>;
  }
  return null;
};


  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Mois" tick={{ fontSize: 12 }} interval={0} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {processedData.length > 0 &&
          Object.keys(processedData[0] || {})
            .filter((key) => key !== 'Mois')
            .map((year, index) => (
              <Line key={year} type="monotone" dataKey={year} strokeWidth={2} stroke={COLORS[index % COLORS.length]} />
            ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const KpiGraphRestoNc = ({ data = [] }) => {
  const processedData = data.reduce((acc, item) => {
    const existingMonth = acc.find((entry) => entry.Mois === item.Mois);
    if (existingMonth) {
      existingMonth[item.Année] = item.Nombrecouverts;
    } else {
      acc.push({ Mois: item.Mois, [item.Année]: item.Nombrecouverts });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Mois" />
        <YAxis />
        <Tooltip />
        <Legend />
        {processedData.length > 0 &&
          Object.keys(processedData[0] || {})
            .filter((key) => key !== 'Mois')
            .map((year, index) => (
              <Line key={year} type="monotone" dataKey={year} stroke={COLORS[index % COLORS.length]} />
            ))}
      </LineChart>
    </ResponsiveContainer>
  );
};



// Main Dashboard Component
const Dashboardkpi = () => {
  const [timePeriod, setTimePeriod] = useState('mois Derniers');
  const [product, setProduct] = useState('Tous');
  const [channel, setChannel] = useState('Tous');
  const [businessUnit, setBusinessUnit] = useState('Tous');
  const [assignedTeam, setAssignedTeam] = useState('Tous');
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [Datacouverts, setDatacouverts] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedMois, setSelectedMois] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/GetCFAchatFoodipex/');
        if (response.data && Array.isArray(response.data.achatfoodipex)&& Array.isArray(response.data.venderesto)&& Array.isArray(response.data.couverts)) {
          setData(response.data.achatfoodipex);
          setData1(response.data.venderesto);
          setDatacouverts(response.data.couverts);
        } else {
          console.error('Data format is incorrect', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
   const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };
   // Helper function to filter data based on selected time period
  const filterDataByTimePeriod = (data, period) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JavaScript

    switch (period) {
      case 'Mois en cours':
        return data.filter(item => item.Année === currentYear && item.Mois === currentMonth);
      case 'Année dernière':
        return data.filter(item => item.Année === currentYear - 1);
      case 'Année en cours':
        return data.filter(item => item.Année === currentYear);
      case 'Derniers mois':
      default:
        return data; // Default logic: return all data
    }
  };




  // Handle change for Ville selection
  const handleChangeVille = (event) => setSelectedVille(event.target.value);
  const handleChangeMois = (event) => setSelectedMois(event.target.value);
  const handleChangeAnnee = (event) => setSelectedAnnee(event.target.value);
  const handleChangeRestaurant = (event) => setSelectedRestaurant(event.target.value);

  // Get unique values for Ville, Mois, Année, and Restaurant
  const uniqueVilles = [...new Set(data.map(data => data.Ville))];
  const uniqueMois = [...new Set(data.map(data => data.Mois))];
  const uniqueAnnees = [...new Set(data.map(data => data.Année))];
  const uniqueRestaurants = [...new Set(data.map(data => data.Restaurant))];

  // Filter data based on selected values

  // Apply filtering based on the selected dropdowns and time period
  const filteredData = filterDataByTimePeriod(
    data.filter(data => {
      return (!selectedVille || data.Ville === selectedVille) &&
             (!selectedMois || data.Mois === selectedMois) &&
             (!selectedAnnee || data.Année === selectedAnnee) &&
             (!selectedRestaurant || data.Restaurant === selectedRestaurant);
    }),
    timePeriod
  );
  const filteredDataNc = filterDataByTimePeriod(
    Datacouverts.filter(data => {
      return (!selectedVille || data.Ville === selectedVille) &&
             (!selectedMois || data.Mois === selectedMois) &&
             (!selectedAnnee || data.Année === selectedAnnee) &&
             (!selectedRestaurant || data.Restaurant === selectedRestaurant);
    }),
    timePeriod
  );

  const filteredData1 = filterDataByTimePeriod(
    data1.filter(data => {
      return (!selectedVille || data.Ville === selectedVille) &&
             (!selectedMois || data.Mois === selectedMois) &&
             (!selectedAnnee || data.Année === selectedAnnee) &&
             (!selectedRestaurant || data.Restaurant === selectedRestaurant);
    }),
    timePeriod
  );
  const emergingTopicsData = [
    { topic: 'Produit 1', volumeChange: '8.2%', totalCases: 146 },
    { topic: 'Produit 2', volumeChange: '2.4%', totalCases: 83 },
    { topic: 'Produit 3', volumeChange: '7.9%', totalCases: 79 },
    { topic: 'Produit 4', volumeChange: '18.9%', totalCases: 37 },
    { topic: 'Produit 5', volumeChange: '3.3%', totalCases: 30 },
    { topic: 'Produit 6', volumeChange: '19.0%', totalCases: 21 },
  ];

  const renderTableRows = (data) =>
    data.map((row) => (
      <TableRow key={row.topic}>
        <TableCell>{row.topic}</TableCell>
        <TableCell align="right">{row.volumeChange}</TableCell>
        <TableCell align="right">{row.totalCases}</TableCell>
      </TableRow>
    ));

   return (
    <Grid container spacing={1} padding={1} style={{ backgroundColor: '#fdfdfd' }}>
      <Grid item xs={12} md={4}>
        <Card style={{ boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="h6">Résumé KPI</Typography>
            <Typography variant="caption" display="block">
              Actualisé UTC 2020/04/20 22:25
            </Typography>
            <Typography variant="caption" display="block">
              Période: 2020/03/21 - 2020/04/19
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box sx={{ height: '50px' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '4px', borderBottom: '1px solid #e0e0e0' }}>
           <FormControl variant="outlined" sx={{ minWidth: 100 }}>
            <InputLabel>Période</InputLabel>
            <Select value={timePeriod} onChange={handleChange(setTimePeriod)} label="Période">
              <MenuItem value="Derniers mois">Derniers mois</MenuItem>
              <MenuItem value="Mois en cours">Mois en cours</MenuItem>
              <MenuItem value="Année dernière">Année dernière</MenuItem>
              <MenuItem value="Année en cours">Année en cours</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 100 }}>
            <InputLabel>Ville</InputLabel>
            <Select value={selectedVille} onChange={handleChangeVille} label="Ville">
              <MenuItem value="">All Cities</MenuItem>
              {uniqueVilles.map((ville, index) => (
                <MenuItem key={index} value={ville}>{ville}</MenuItem>
              ))}
            </Select>
          </FormControl>

           <FormControl variant="outlined" sx={{ minWidth: 100 }}>
                <InputLabel>Mois</InputLabel>
                <Select value={selectedMois} onChange={handleChangeMois} label="Mois">
                  <MenuItem value="">All Months</MenuItem>
                  {uniqueMois.map((mois, index) => (
                    <MenuItem key={index} value={mois}>{mois.charAt(0).toUpperCase() + mois.slice(1)}</MenuItem>
                  ))}
                </Select>
           </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: 2 }}>
            <InputLabel>Année</InputLabel>
            <Select value={selectedAnnee} onChange={handleChangeAnnee} label="Année">
              <MenuItem value="">All Years</MenuItem>
              {uniqueAnnees.map((annee, index) => (
                <MenuItem key={index} value={annee}>{annee}</MenuItem>
              ))}
            </Select>
          </FormControl>

         <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel>Restaurant</InputLabel>
            <Select value={selectedRestaurant} onChange={handleChangeRestaurant} label="Restaurant">
              <MenuItem value="">All Restaurants</MenuItem>
              {uniqueRestaurants.map((restaurant, index) => (
                <MenuItem key={index} value={restaurant}>{restaurant}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>

      {/* Résumé KPI Cards - Moved Above the Graph */}
{/*       <ReptureStock /> */}

      {/* Emerging Topics */}
{/*       <TableKpi  sx={{ height: '400px' }}/> */}


      {/* KPI Graphs */}
      <Grid item xs={12} md={8} style={{ position: 'relative'  }}>
        <Grid container spacing={2}>
            <Typography variant="subtitle1">Achat Foodipex</Typography>

            <KpiGraphResto  data={filteredData} />

        </Grid>

      </Grid>
       <Grid item xs={12} md={8} style={{ position: 'relative' }}>

      </Grid>
    </Grid>
  );
};

export default Dashboardkpi;
