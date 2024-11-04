# Mini Twitter

Este é um projeto que simula uma aplicação estilo Twitter, onde os usuários podem se cadastrar, fazer login e postar tweets. A aplicação possui um backend desenvolvido com Python e Django, e um frontend em React e Next.js, utilizando PostgreSQL para armazenamento dos dados. As imagens enviadas nos tweets são enviadas para um Bucket S3.

## Funcionalidades

- Cadastro de usuários
- Autenticação e login de usuários
- Publicação de tweets
- Seguir e deixar de seguir outros usuários
- Visualização do feed de tweets
- Opção de Follow/Unfollow outros usuarios
- Impletação da funcionalidade cursor pagination para o feed de tweets

### Futuras melhorias

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
   git clone https://github.com/acadl-dev/mini-twitter.git  

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

    
### Frontend

1. Navegue para a pasta do frontend:
    ```bash
   cd ../frontend
    
2. Instale as dependências:
    ```bash
   npm install
    
3. Inicie o servidor de desenvolvimento:
    ```bash
   npm run dev

## Contribuindo

Contribuições são bem-vindas! Se você deseja ajudar a melhorar o projeto, siga estas etapas:

### Passo a Passo para Contribuir

1. **Faça um Fork do Repositório**

   No canto superior direito da página do repositório, clique em **Fork**. Isso criará uma cópia do repositório na sua conta do GitHub.

2. **Clone o Repositório Forkado**

   Clone o repositório forkado para o seu computador local. No terminal, execute:
   ```bash
   git clone https://github.com/seu-usuario/mini-twitter.git
   
3. Crie uma Nova Branch
   ```bash
   cd mini-twitter
   git checkout -b feature/nova-funcionalidade
   
4. Faça suas Alterações
  Realize as alterações desejadas no código. Você pode adicionar novas funcionalidades, corrigir bugs...
   
5. Faça o Commit das suas Alterações
   Após fazer as alterações, adicione os arquivos modificados ao seu commit:
   ```bash
   git add .
   
6. Envie suas Alterações para o Repositório Remoto
   ```bash
   git commit -m 'Adicionei uma nova funcionalidade'

7. Abra um Pull Request
     Vá para a página do seu repositório forkado no GitHub. Você verá um botão Compare & pull request. Clique nele. Adicione uma descrição das suas alterações e clique em Create pull request.
   

