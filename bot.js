const { Client } = require('pg'); // Cliente de PostgreSQL
const venom = require('venom-bot');
const path = require('path');

const TIEMPO_MAXIMO_CONVERSACION = 15*60 * 1000; 

// conexión a PostgreSQL
const dbClient = new Client({
  user: 'Oscar',
  host: 'localhost',
  database: 'chatbot-Manuel',
  password: 'robot432',
  port: 5432,
});

dbClient.connect();
const tokensPath = path.resolve(__dirname, 'tokens');

// Creacion cliente Venom
venom
  .create({
    session: 'chatbot-bot', 
    multidevice: true,
    folderNameToken: tokensPath,
  })
  .then((client) => {
    console.log('Venom client creado con éxito');
    start(client);
  })
  .catch((error) => {
    console.error('Error al crear el cliente:', error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg) return;  

    const telefonoCliente = message.from.replace('@c.us', ''); // Obtener número del cliente
    const nombreCliente = message.notifyName || 'Cliente'; // Nombre mostrado o "Cliente"

    try {
      // Verificar si el cliente ya existe en la base de datos
      const res = await dbClient.query('SELECT * FROM clientes WHERE numero_telefono = $1', [telefonoCliente]);

      if (res.rows.length === 0) {
        // Si el cliente no existe, insertarlo en la base de datos
        await dbClient.query(
          'INSERT INTO clientes (nombre, numero_telefono, ultima_interaccion) VALUES ($1, $2, NOW())',
          [nombreCliente, telefonoCliente]
        );
        console.log(`Cliente nuevo registrado: ${nombreCliente}, Teléfono: ${telefonoCliente}`);
      } else {
        console.log(`Cliente ya registrado: ${nombreCliente}, Teléfono: ${telefonoCliente}`);
      }

      // Responder con la información sobre los chatbots
      await handleChatbotInfo(client, message);
    } catch (error) {
      console.error('Error al manejar la base de datos:', error);
    }
  });
}

// respuestas del chatbot (solo información sobre chatbots)
const conversationState = {}; // Mantener el estado de la conversación

async function handleChatbotInfo(client, message) {
  const messageBody = message.body.toLowerCase();
  const telefonoCliente = message.from.replace('@c.us', '');
  const ahora = new Date();

  try {
    // Consultar la última interacción del cliente
    const res = await dbClient.query('SELECT ultima_interaccion FROM clientes WHERE numero_telefono = $1', [telefonoCliente]);
    if (res.rows.length > 0) {
      
      const ultimaInteraccion = new Date(res.rows[0].ultima_interaccion); 
      const tiempoPasado = ahora - ultimaInteraccion; // Resta en milisegundos

      if (tiempoPasado > TIEMPO_MAXIMO_CONVERSACION) {
        // Si han pasado más de 15 minutos, enviar el saludo inicial
        const saludo = '¡Hola! Gracias por comunicarte con *DELAI SOLUTIONS*. Estamos aquí para ayudarte.\n' +
                       '1️⃣ Desea información sobre chatbots? Escribe *chatbot*.\n';
        await client.sendText(message.from, saludo);
        conversationState[telefonoCliente] = 'esperando_opcion';
      } else {
        // conversación basada en el estado
        if (!conversationState[telefonoCliente]) {
          conversationState[telefonoCliente] = 'inicio';
        }

        if (conversationState[telefonoCliente] === 'inicio') {
          const saludo = '¡Hola! Gracias por comunicarte con *DELAI SOLUTIONS*. Estamos aquí para ayudarte.\n' +
                         '1️⃣ Desea información sobre chatbots? Escribe *chatbot*.\n';
          await client.sendText(message.from, saludo);
          conversationState[telefonoCliente] = 'esperando_opcion';
        } else if (conversationState[telefonoCliente] === 'esperando_opcion') {
          if (messageBody.includes('chatbot')) {
            // Caso cuando el cliente pide información sobre chatbots
            try {
              const resChatbots = await dbClient.query('SELECT mensaje FROM mensajes_predefinidos WHERE tipo = $1', ['consulta_chatbots']);
              const respuestaChatbots = resChatbots.rows.length > 0 ? resChatbots.rows[0].mensaje : 'Información no disponible.';
              await client.sendText(message.from, respuestaChatbots);
              conversationState[telefonoCliente] = 'esperando_opcion';
            } catch (error) {
              console.error('Error al consultar la base de datos:', error);
              await client.sendText(message.from, 'Hubo un error al procesar tu solicitud. Inténtalo de nuevo más tarde.');
            }
          } else if (messageBody.includes('precio')) {
            // Caso cuando el cliente pide información sobre precios
            try {
              const resPrecios = await dbClient.query('SELECT precio FROM mensajes_predefinidos WHERE tipo = $1', ['consulta_chatbots']);
              const respuestaPrecios = resPrecios.rows.length > 0 ? `El precio es: ${resPrecios.rows[0].precio}` : 'Información no disponible.';
              await client.sendText(message.from, respuestaPrecios);
              conversationState[telefonoCliente] = 'finalizado';
            } catch (error) {
              console.error('Error al consultar la base de datos:', error);
              await client.sendText(message.from, 'Hubo un error al obtener la información de precios.');
            }
          } else {
            // Si el mensaje no es reconocido, pedir que el cliente escriba las opciones correctas
            await client.sendText(message.from, 'Lo siento, no entendí tu mensaje. Por favor, escribe *chatbot* o *precio*.');
          }
        } else if (conversationState[telefonoCliente] === 'finalizado') {
          // Si la conversación está finalizada y se recibe un mensaje adicional
          await client.sendText(message.from, 'Gracias por su consulta, en unos momentos el personal le responderá.');
        }
      }
    } else {
      // Si el cliente es nuevo, registrar el número y la hora de la interacción
      await dbClient.query('INSERT INTO clientes (nombre, numero_telefono, ultima_interaccion) VALUES ($1, $2, NOW())',
        ['Cliente', telefonoCliente, ahora]);

      // Enviar el saludo inicial
      const saludo = '¡Hola! Gracias por comunicarte con *DELAI SOLUTIONS*. Estamos aquí para ayudarte.\n' +
                     '1️⃣ Desea información sobre chatbots? Escribe *chatbot*.\n';
      await client.sendText(message.from, saludo);
      conversationState[telefonoCliente] = 'esperando_opcion';
    }

    // Actualizar la última interacción
    await dbClient.query('UPDATE clientes SET ultima_interaccion = NOW() WHERE numero_telefono = $1', [telefonoCliente]);

  } catch (error) {
    console.error('Error al manejar la base de datos:', error);
    await client.sendText(message.from, 'Hubo un error al procesar tu solicitud. Inténtalo de nuevo más tarde.');
  }
}