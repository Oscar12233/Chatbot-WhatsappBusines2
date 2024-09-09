const venom = require('venom-bot');
const path = require('path');

// Define la ruta absoluta para la carpeta de tokens
const tokensPath = path.resolve(__dirname, 'tokens');

// Información del restaurante
const restaurantInfo = {
  menu: "Aquí está el menú: 1. Pizza, 2. Pasta, 3. Ensaladas, 4. Postres.",
  hours: "Estamos abiertos de lunes a domingo de 11:00 a 22:00.",
  location: "Nos encontramos en la Calle Falsa 123, Ciudad.",
  contact: "Puedes llamarnos al +123456789.",
};
//conexion a MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Definir un modelo para la información del restaurante
  const InfoSchema = new mongoose.Schema({
    type: String,
    content: String,
  });
  
  const Info = mongoose.model('Info', InfoSchema);
// Crear el cliente Venom
venom.create({
  session: 'restaurant-bot', // Nombre de la sesión
  multidevice: true, // Habilitar multidevice si es necesario
  folderNameToken: tokensPath // Ruta para almacenar los archivos de sesión
}).then((client) => {
  console.log('Venom client creado con éxito');
  start(client);
}).catch((error) => {
  console.error('Error al crear el cliente:', error);
});

function start(client) {
  client.onMessage((message) => {
    console.log(message);

    if (message.isGroupMsg) return; // Ignorar mensajes de grupos

    const messageBody = message.body.toLowerCase();



    if (messageBody.includes('menú')) {
      client.sendText(message.from, restaurantInfo.menu);
    } else if (messageBody.includes('horarios')) {
      client.sendText(message.from, restaurantInfo.hours);
    } else if (messageBody.includes('ubicación')) {
      client.sendText(message.from, restaurantInfo.location);
    } else if (messageBody.includes('contacto')) {
      client.sendText(message.from, restaurantInfo.contact);
    }  else {
      client.sendText(message.from, 'Lo siento, no entendí tu mensaje. Por favor, dime si necesitas información sobre el menú, horarios, ubicación, contacto.');
    }
  });
}