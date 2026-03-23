# API Rest Barbeiros

- `/barbeiros` - **GET**: Retorna a lista de todos os barbeiros cadastrados no banco de dados.
```json
[
  {
    "id": 1,
    "nome": "Marcos Silva",
    "especialidade": "Corte Clássico",
    "telefone": "11988887777",
    "experiencia_anos": 10
  },
  {
    "id": 2,
    "nome": "Pedro Henrique",
    "especialidade": "Degradê e Freestyle",
    "telefone": "11977776666",
    "experiencia_anos": 3
  }
]
```

- `/barbeiros/filtrar?especialidade=Valor` - **GET**: Filtra e retorna os barbeiros que possuem a especialidade informada na query string (busca parcial/LIKE).
```json
[
  {
    "id": 1,
    "nome": "Marcos Silva",
    "especialidade": "Corte Clássico",
    "telefone": "11988887777",
    "experiencia_anos": 10
  }
]
```

- `/barbeiros/ordenar?por=campo&ordem=ASC|DESC` - **GET**: Retorna a lista de todos os barbeiros ordenada pelo campo especificado (`id`, `nome`, `especialidade`, `experiencia_anos`) e na direção desejada.
```json
[
  {
    "id": 1,
    "nome": "Marcos Silva",
    "especialidade": "Corte Clássico",
    "telefone": "11988887777",
    "experiencia_anos": 10
  },
  {
    "id": 3,
    "nome": "João Souza",
    "especialidade": "Barboterapia",
    "telefone": "11966665555",
    "experiencia_anos": 7
  }
]
```

- `/barbeiros` - **POST**: Cria um novo registro de barbeiro. Requer `nome`, `especialidade`, `telefone` e `experiencia_anos` no corpo da requisição.
```json
{
  "id": 6,
  "mensagem": "Barbeiro cadastrado com sucesso!"
}
```

- `/barbeiros/:id` - **GET**: Busca e retorna os dados de um barbeiro específico através do seu ID.
```json
{
  "id": 1,
  "nome": "Marcos Silva",
  "especialidade": "Corte Clássico",
  "telefone": "11988887777",
  "experiencia_anos": 10
}
```

- `/barbeiros/:id` - **PUT**: Atualiza os dados de um barbeiro existente. Requer o ID na URL e os dados atualizados no corpo da requisição.
```json
{
  "mensagem": "Dados atualizados com sucesso!"
}
```

- `/barbeiros/:id` - **DELETE**: Remove um barbeiro do banco de dados através do seu ID.
```json
{
  "mensagem": "Barbeiro removido com sucesso!"
}
```
