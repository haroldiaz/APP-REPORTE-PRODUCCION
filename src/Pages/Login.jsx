import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  // ✅ Código correcto desde .env
  const codigoCorrecto = process.env.REACT_APP_USER;

  const handleChange = (value, index) => {
    const newCodigo = [...codigo];
    newCodigo[index] = value.slice(-1); // solo último dígito
    setCodigo(newCodigo);
  };

  const handleContinuar = () => {
    const codigoFinal = codigo.join("");
    console.log("Código ingresado:", codigoFinal);
        console.log("Código correcto:", codigoCorrecto);
        
        // ✅ Comparar como strings
    if (codigoFinal === codigoCorrecto) {
      setMensaje({ tipo: "success", texto: "✅ Código correcto, bienvenido." });
      navigate("/menu");
    } else {
      setMensaje({ tipo: "error", texto: "❌ Código incorrecto, inténtalo de nuevo." });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        px: 2,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={{ xs: 2, sm: 4 }}
        sx={{
          width: "100%",
          maxWidth: { xs: 300, sm: 400 }, // más pequeño en móviles
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "16px", sm: "20px" }, // más pequeño en móvil
            mb: 2,
          }}
        >
          Digite el código de verificación
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          {codigo.map((num, i) => (
            <TextField
              key={i}
              value={num}
              onChange={(e) => handleChange(e.target.value, i)}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "18px" },
              }}
              sx={{
                width: { xs: "40px", sm: "55px" }, // reducido en móviles
              }}
            />
          ))}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinuar}
          sx={{
            width: { xs: "100%", sm: "80%" }, // ocupa todo en móvil, menos en desktop
            fontSize: { xs: "14px", sm: "16px" },
            py: { xs: 1, sm: 1.5 },
          }}
        >
          Continuar
        </Button>

        {mensaje && (
          <Alert
            severity={mensaje.tipo}
            sx={{
              mt: 2,
              width: "100%",
              fontSize: { xs: "13px", sm: "15px" }, // más compacto en móvil
            }}
          >
            {mensaje.texto}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
