const express = require('express');
const cors = require('cors'); // Importa el paquete CORS
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Para manejar archivos
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); //

const upload = multer({
  dest: 'uploads/', // Carpeta temporal para guardar archivos
});

// Ruta para listar carpetas de usuarios
app.get('/users', (req, res) => {
  const usersPath = path.join(__dirname, 'UserSamples');
  if (!fs.existsSync(usersPath)) {
    return res.status(404).send('Carpeta "UserSamples" no encontrada.');
  }

  const users = fs
    .readdirSync(usersPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name }));

  res.json(users);
});

// Ruta para listar archivos de un usuario
app.get('/files/:user', (req, res) => {
  const userPath = path.join(__dirname, 'UserSamples', req.params.user);
  if (!fs.existsSync(userPath)) {
    return res.status(404).send(`Carpeta del usuario ${req.params.user} no encontrada.`);
  }

  const files = fs
    .readdirSync(userPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  res.json(files);
});


// Ruta para crear una nueva carpeta de usuario
app.post('/users', (req, res) => {
  const { username } = req.body;
  const userPath = path.join(__dirname, 'UserSamples', username);

  if (fs.existsSync(userPath)) {
    return res.status(400).send('El usuario ya existe.');
  }

  fs.mkdirSync(userPath, { recursive: true });
  res.status(201).json({ message: 'Usuario creado exitosamente.' });
});


// Ruta para subir un archivo a una carpeta de usuario
app.post('/upload/:user', upload.single('file'), (req, res) => {
  const { user } = req.params;
  const userPath = path.join(__dirname, 'UserSamples', user);

  if (!fs.existsSync(userPath)) {
    return res.status(404).json({ message: 'El usuario no existe.' });
  }

  const tempPath = req.file.path; // Ruta temporal del archivo subido
  const targetPath = path.join(userPath, req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error('Error al mover el archivo:', err);
      return res.status(500).json({ message: 'Error al guardar el archivo.' });
    }

    res.status(200).json({ message: 'Archivo subido exitosamente.' }); // Respuesta JSON válida
  });
});


// Ruta para descargar los archivos
app.get('/download/:user/:file', (req, res) => {
  const { user, file } = req.params;
  const filePath = path.join(__dirname, 'UserSamples', user, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado.');
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      res.status(500).send('Error al descargar el archivo.');
    }
  });
});

app.post('/generate-graph', upload.single('file'), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'CSVSamples', req.file.originalname);

  // Mover el archivo CSV a la carpeta destino
  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error('Error al mover el archivo:', err);
      return res.status(500).json({ message: 'Error al guardar el archivo.' });
    }

    // Ejecutar el script de Python
    const pythonScript = path.join(__dirname, 'script.py'); // Cambia esto por tu script
    exec(`python3 "${pythonScript}" "${targetPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error al ejecutar el script de Python:', error);
        return res.status(500).json({ message: 'Error al generar la gráfica.' });
      }

      // Leer el nombre del archivo generado desde el stdout del script
      const outputImagePath = stdout.trim();

      // Enviar la ruta relativa de la imagen generada al cliente
      const relativeImagePath = path.relative(path.join(__dirname, 'GraphSamples'), outputImagePath);
      res.status(200).json({ imageUrl: `/graphs/${relativeImagePath}` });
    });
  });
});

app.use('/graphs', express.static(path.join(__dirname, 'GraphSamples')));

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));