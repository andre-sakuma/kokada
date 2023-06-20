## Abrir dois terminais, um para o backend e outro para o frontend

## Os dois processos devem estar rodando simultaneamente

### Backend (/app)

0. acessar a pasta do backend

   `cd app`

1. Passo 1 checar versão do Node (deve estar na 16.algumacoisa)

   `node -v`

   a. Se não estiver, use o comando:

   `nvm use 16`

   b. Se não tiver essa versão instalada, use o comando:

   `nvm install 16`

2. Inicializar o container do banco de dados

   `docker-compose up -d`

3. Instalar as dependências

   `yarn install`

   a. Se não tiver o yarn instalado, use o comando:

   `npm install -g yarn`

4. Rodar as migrations

   `yarn prisma:migrate`

5. Popular o banco de dados

   `yarn prisma:seed`

6. Inicializar o servidor

   `yarn start`

### Frontend (/web)

0. acessar a pasta do frontend

   `cd web`

1. Passo 1 checar versão do Node (deve estar na 16.algumacoisa)

   `node -v`

   a. Se não estiver, use o comando:

   `nvm use 16`

   b. Se não tiver essa versão instalada, use o comando:

   `nvm install 16`

2. Instalar as dependências

   `yarn install`

   a. Se não tiver o yarn instalado, use o comando:

   `npm install -g yarn`

3. Inicializar o servidor

   `yarn start`
