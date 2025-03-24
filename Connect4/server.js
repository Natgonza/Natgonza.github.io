const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the project folder
app.use(express.static(__dirname));

// Store game states for multiple rooms
let games = {};

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // When a player joins a game room
  socket.on("joinGame", (gameId) => {
    socket.join(gameId);

    // Create new game state if it doesn't exist
    if (!games[gameId]) {
      games[gameId] = {
        board: Array(6).fill(null).map(() => Array(7).fill(null)),
        currentPlayer: "player1",
      };
    }

    // Send current game state to the new player
    socket.emit("gameState", games[gameId]);

    console.log(`Player ${socket.id} joined game ${gameId}`);
  });

  // Handle player moves
  socket.on("playerMove", ({ gameId, column }) => {
    const game = games[gameId];
    if (!game) return;

    // Find the lowest available row in the selected column
    for (let row = 5; row >= 0; row--) {
      if (!game.board[row][column]) {
        game.board[row][column] = game.currentPlayer;
        game.currentPlayer = game.currentPlayer === "player1" ? "player2" : "player1";
        break;
      }
    }

    // Broadcast updated game state to all players in the room
    io.to(gameId).emit("gameState", game);
  });

  // Handle game reset
  socket.on("resetGame", (gameId) => {
    if (games[gameId]) {
      games[gameId] = {
        board: Array(6).fill(null).map(() => Array(7).fill(null)),
        currentPlayer: "player1",
      };
      io.to(gameId).emit("gameState", games[gameId]);
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});