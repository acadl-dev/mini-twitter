# Mini Twitter

Este é um projeto que simula uma aplicação estilo Twitter, onde os usuários podem se cadastrar, fazer login e postar tweets. A aplicação possui um backend desenvolvido com Python e Django, e um frontend em React e Next.js, utilizando PostgreSQL para armazenamento dos dados.

## Funcionalidades

- Cadastro de usuários
- Autenticação e login de usuários
- Publicação de tweets
- Seguir e deixar de seguir outros usuários
- Visualização do feed de tweets

### Futuras melhorias

- Correção da rota para follow/unfllow no front
- Implementação do sistema de páginação do Django
- Adicionar fotos para cada usuário

## Tecnologias Utilizadas

### Backend
- **Python 3**
- **Django**
- **Django Rest Framework**
- **PostgreSQL**
- **JWT (JSON Web Token) para autenticação**

### Frontend
- **React**
- **Next.js**
- **TypeScript**
- **Framer Motion** (para animações)
- **Radix UI** (para componentes visuais)

### Infraestrutura
- **Amazon AWS** (para armazenamento das imagens dos tweets)

## Configuração do Projeto

### Backend

1. Clone o repositório:
   ```bash
   [git clone https://github.com/acadl-dev/mini-twitter.git
   git clone 

2. Navegue para a pasta do backend:
   ```bash
   cd mini-twitter/backend

3. Crie e ative um ambiente virtual:
   ```bash
  python3 -m venv venv
  source venv/bin/activate  # No Windows, use: venv\Scripts\activate

4. Instale as dependências:
   ```bash
   pip install -r requirements.txt

5. Configure o banco de dados PostgreSQL e adicione suas credenciais no arquivo .env.
   pode se basear no arquivo: ".env.example" dentro da pasta "back"

6. Execute as migrações:
   ```bash
   pip install -r requirements.txt

8. Inicie o servidor:
    ```bash
   python manage.py runserver

   
