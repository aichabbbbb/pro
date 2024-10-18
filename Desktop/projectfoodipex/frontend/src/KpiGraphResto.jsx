import React from 'react';
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Line as ChartLine, Bar as ChartBar } from 'react-chartjs-2';

// Données pour les graphiques
const dataPie = [
  { name: 'Nouveau', value: 7700 },
  { name: 'Backlog', value: 3700 },
];

const dataBar = [
  { name: 'Téléphone', Active: 2700, Resolved: 2400 },
  { name: 'Web', Active: 1700, Resolved: 1400 },
  { name: 'Email', Active: 1900, Resolved: 1400 },
  { name: 'Facebook', Active: 100, Resolved: 50 },
  { name: 'Twitter', Active: 100, Resolved: 50 },
];

const dataCaseTracking = [
  { date: '22 mars', New: 500, Resolved: 300 },
  { date: '29 mars', New: 600, Resolved: 400 },
  { date: '5 avril', New: 800, Resolved: 700 },
];

const data = {
  labels: ['0-30 jours', '31-60 jours', '61-90 jours', '91+ jours'],
  datasets: [
    {
      data: [120, 80, 60, 32],
      backgroundColor: ['#4F81BD', '#C0504D', '#9BBB59', '#8064A2'],
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: 'white',
    },
  },
};

const caseTrackingData = {
  labels: ['22 mars', '29 mars', '5 avril'],
  datasets: [
    {
      label: 'Nouveau',
      data: [200, 800, 300],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: true,
    },
    {
      label: 'Résolu',
      data: [150, 600, 400],
      borderColor: 'teal',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
};

const dataCasePriority = [
  { name: 'Bas', value: 4.3 },
  { name: 'Normal', value: 94.7 },
  { name: 'Élevé', value: 11 },
];
const COLORS = ['#FF8042', '#00C49F', '#FFBB28'];

const emergingTopicsData = [
  { topic: 'produit1', volumeChange: '8.2%', totalCases: 146 },
  { topic: 'produit1s', volumeChange: '2.4%', totalCases: 83 },
  { topic: 'produit1', volumeChange: '7.9%', totalCases: 79 },
  { topic: 'produit1', volumeChange: '18.9%', totalCases: 37 },
  { topic: 'produit1', volumeChange: '3.3%', totalCases: 30 },
  { topic: 'produit1', volumeChange: '19.0%', totalCases: 21 },
];

const caseVolumeData = [
  { topic: 'produit1', volume: '18.4%', totalCases: 2096 },
  { topic: 'produit1', volume: '9.0%', totalCases: 1022 },
  { topic: 'produit1', volume: '4.9%', totalCases: 558 },
  { topic: 'produit1', volume: '4.5%', totalCases: 511 },
  { topic: 'produit1', volume: '3.2%', totalCases: 369 },
  { topic: 'produit1', volume: '3.2%', totalCases: 364 },
];

const childStyle = {
  position: 'relative',
  top: '-201px'
};
const dataCaseBreakdown = [
  { name: 'New', value: 7700 },
  { name: 'Backlog', value: 3700 },
];
const renderTableRows = (data) => {
  return data.map((row) => (
    <TableRow key={row.topic}>
      <TableCell>{row.topic}</TableCell>
      <TableCell align="right">{row.volumeChange || row.volume}</TableCell>
      <TableCell align="right">{row.totalCases}</TableCell>
    </TableRow>
  ));
};

const styles1 = {
  container: {
    padding: '5px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666666',
    marginTop: '5px',
  },
  dateRange: {
    fontSize: '14px',
    color: '#666666',
    marginTop: '10px',
  },
};

const doughnutData = {
  labels: ['0-30 jours', '31-60 jours', '61-90 jours', '91+ jours'],
  datasets: [{
    data: [120, 80, 60, 32],
    backgroundColor: ['#4F81BD', '#C0504D', '#9BBB59', '#8064A2'],
  }],
};

const KpiGraphResto = () => {
  const [timePeriod, setTimePeriod] = React.useState('Derniers 30 jours');
  const [product, setProduct] = React.useState('Tous');
  const [channel, setChannel] = React.useState('Tous');
  const [businessUnit, setBusinessUnit] = React.useState('Tous');
  const [assignedTeam, setAssignedTeam] = React.useState('Tous');

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  return (
       <div className="scroll-container"> {/* Add this wrapping div */}
    <Grid container spacing={1} padding={1} style={{ backgroundColor: 'rgb(252 252 252)' , marginTop: '0px' }}>
      <Grid item xs={12} md={4}>
        <Card style={{ boxShadow: 'none' }}>
          <CardContent>
            <div style={{ ...styles1.container, padding: '2px' }}>
              <div style={{ ...styles1.title, fontSize: '18px' }}>Résumé KPI</div>
              <div style={{ ...styles1.subtitle, fontSize: '12px', marginTop: '3px' }}>Actualisé UTC 2020/04/20 22:25</div>
              <div style={{ ...styles1.dateRange, fontSize: '12px', marginTop: '5px' }}>2020/03/21 - 2020/04/19</div>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Box sx={{ height: '50px' }}></Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '4px',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 100, height: '40px' }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Période</InputLabel>
            <Select
              value={timePeriod}
              onChange={handleChange(setTimePeriod)}
              label="Période"
              sx={{ height: '40px', fontSize: '0.8rem' }}
            >
              <MenuItem value="Derniers 30 jours" sx={{ fontSize: '0.8rem' }}>Derniers 30 jours</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 100, height: '40px' }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Produit</InputLabel>
            <Select
              value={product}
              onChange={handleChange(setProduct)}
              label="Produit"
              sx={{ height: '40px', fontSize: '0.8rem' }}
            >
              <MenuItem value="Tous" sx={{ fontSize: '0.8rem' }}>Tous</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 100, height: '40px' }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Canal</InputLabel>
            <Select
              value={channel}
              onChange={handleChange(setChannel)}
              label="Canal"
              sx={{ height: '40px', fontSize: '0.8rem' }}
            >
              <MenuItem value="Tous" sx={{ fontSize: '0.8rem' }}>Tous</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 100, height: '40px' }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Unité commerciale</InputLabel>
            <Select
              value={businessUnit}
              onChange={handleChange(setBusinessUnit)}
              label="Unité commerciale"
              sx={{ height: '40px', fontSize: '0.8rem' }}
            >
              <MenuItem value="Tous" sx={{ fontSize: '0.8rem' }}>Tous</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 100, height: '40px' }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Équipe assignée</InputLabel>
            <Select
              value={assignedTeam}
              onChange={handleChange(setAssignedTeam)}
              label="Équipe assignée"
              sx={{ height: '40px', fontSize: '0.8rem' }}
            >
              <MenuItem value="Tous" sx={{ fontSize: '0.8rem' }}>Tous</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>

      {/* Sujets émergents */}
<Grid item xs={12} md={4}>
  <Card>
    <CardContent>
      <Typography variant="subtitle1">Sujets émergents</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sujet</TableCell>
              <TableCell align="right">Changement de volume</TableCell>
              <TableCell align="right">Total des cas</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {renderTableRows(emergingTopicsData)}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
</Grid>


      {/* Résumé KPI */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Divider />
            <Grid container spacing={1}>
              {[ // Données KPI
                { value: '11K', label: 'Total des cas' },
                { value: '6447', label: 'Résolutions' },
                { value: '392', label: 'Escalations' },
                { value: '5899', label: 'Conformes à la SLA' },
                { value: '31.5h', label: 'Temps moyen de résolution' },
              ].map((item) => (
                <Grid item xs={12} md={2.4} key={item.label}>
                  <Card variant="outlined">
                    <CardContent style={{ height: '66px' }}>
                      <Typography variant="h7">{item.value}</Typography>
                      <br/>
                      <Typography variant="caption">{item.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Pilotes de volume des cas */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Pilotes de volume des cas</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sujet</TableCell>
                        <TableCell align="right">Volume</TableCell>
                        <TableCell align="right">Total des cas</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderTableRows(caseVolumeData)}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Répartition des cas et priorité */}
          <Grid item xs={12} md={4} style={childStyle}>
            <Card>
              <CardContent style={{ padding: '8px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={dataCasePriority}
                      dataKey="value"
                      outerRadius={70}
                      innerRadius={50}
                      fill="#82ca9d"
                      label
                    >
                      {dataCasePriority.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} style={childStyle}>
            <Card>
              <CardContent style={{ padding: '8px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dataCaseBreakdown}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>

          {/* Répartition des cas et priorité */}
          <Grid item xs={12} md={4} style={childStyle} style={{ position: 'relative', top: '-260px', paddingTop: '0' }}>
            <Card>
              <CardContent style={{ padding: '4px' }}>
                <ResponsiveContainer width="90%" height={200}>
                  <LineChart data={dataCaseTracking}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="New" stroke="#ff7300" />
                    <Line type="monotone" dataKey="Resolved" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} style={childStyle} style={{ position: 'relative', top: '-260px', paddingTop: '0' }}>
            <Card>
              <CardContent style={{ padding: '4px' }}>
                <ResponsiveContainer width="100%" height={190}>
                  <ChartLine data={caseTrackingData} />
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Graphique des canaux des cas */}
    </Grid>
      </div>
  );
};

export default KpiGraphResto;