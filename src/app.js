// Imports
const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// Construtor do express
const app = express();

// Configura o express para reconhecer json
app.use(express.json());

// Configura o cors
app.use(cors());

// Middlewares

// Valida o id do repositório
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();  
}

// Usa o middleware na rota especificada
app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

// Rotas

// List
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// Create
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

// Update
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = { ...repositories[repositoryIndex], id, title, url, techs };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// Delete
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// Create like
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;