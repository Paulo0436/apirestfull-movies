const mongoose = require("mongoose");

async function conectarAoBancoDeDados() {
  const user = process.env.MONGODB_USER;
  const passwd = process.env.MONGODB_PASSWD;
  const host = process.env.MONGODB_HOST;
  const dbname = process.env.MONGODB_DBNAME;

  // A senha pode precisar de encodeURIComponent caso tenha caracteres especiais
  const URL = `mongodb+srv://${user}:${encodeURIComponent(passwd)}@${host}/${dbname}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(URL);
    console.log(" MongoDB conectado com sucesso!");
  } catch (error) {
    console.error(" Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = conectarAoBancoDeDados;
