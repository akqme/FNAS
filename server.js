const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);

// Configuração do WebSocket permitindo acesso de qualquer PC na rede
const io = new Server(server, { cors: { origin: '*' } });

// ATENÇÃO: Verifique se o seu Arduino está na COM3 mesmo. 
// Se for outra porta (ex: COM4), mude aqui embaixo:
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Lendo a porta serial e enviando para o Frontend
parser.on('data', (data) => {
    console.log(`Recebido do Arduino: ${data}`);
    // Dispara a informação para o HTML conectado
    io.emit('dados_arduino', data); 
});

port.on('error', (err) => {
    console.error('Erro na porta serial: ', err.message);
});

// Inicializando o servidor
server.listen(3000, () => {
    console.log('Backend rodando! Escutando a porta 3000...');
    console.log('Aguardando comunicação do Arduino...');
});
