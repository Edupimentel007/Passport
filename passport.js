const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();

// Configuração do Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Substitua esta lógica com a verificação real do nome de usuário e senha
    if (username === 'usuario' && password === 'senha') {
      return done(null, { username });
    } else {
      return done(null, false, { message: 'Nome de usuário ou senha incorretos' });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username });
});

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: 'secretpassphrase',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.get('/', (req, res) => {
  res.send('Página inicial');
});

app.get('/login', (req, res) => {
  res.send('Página de login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Olá, ${req.user.username}! Bem-vindo ao painel.`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
