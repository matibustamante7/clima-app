import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';

function App() {

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [data, setData] = useState({
    city: '',
    country: '',
    temp: '',
    condition: '',
    icon: '',
    conditionText: ''
  })


  const apiUrl = 'http://api.weatherapi.com/v1/current.json?key=9f01df49fcd842c6b45133942233006&q=';

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: ''
    })
    try {
      if (!city.trim()) throw { message: "El campo no puede estar vacio" }

      //consulta a la api
      const response = await fetch(`${apiUrl}${city}`)
      const data = await response.json();

      if (data.error) {
        throw { message: data.error.message }
      } else {
        setData({
          city: data.location.name,
          country: data.location.country,
          temp: data.current.temp_c,
          condition: data.current.condition.code,
          icon: data.current.condition.icon,
          conditionText: data.current.condition.text,
        })
      }

    } catch (error) {
      setError({
        error: true,
        message: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth='xs'
      sx={{ m: 'auto', mt:20 }}>
      <Typography variant="h3" component='h1' align="center" gutterBottom>
        Clima App
      </Typography>
      <Box
        sx={{ display: 'grid', gap: 2 }}
        component="form"
        autocomplete='off'
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Cargando...">
          Buscar
        </LoadingButton>
      </Box>

      {
        data.city && (
          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gap: 2,
              textAlign: "center",
            }}>
            <Typography
              variant="h4"
              component="h2">
              {data.city}, {data.country}
            </Typography>
            <Box
              component='img'
              alt={data.conditionText}
              src={data.icon}
              sx={{ margin: "0 auto" }}
            />
            <Typography
              variant="h5"
              component="h3"
            >
              {data.temp} °C
            </Typography>
            <Typography
              variant="h6"
              component="h4"
            >
              {data.conditionText}
            </Typography>
          </Box>
        )
      }

      <Typography textAlign='center' sx={{ mt: 2, fontSize: "10px" }}>
        Powered By
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}

export default App;
