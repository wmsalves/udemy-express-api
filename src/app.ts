import express, { NextFunction, Request, Response } from "express";

const app = express();

// req de requisação e res de resposta
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello Express!");
});
// rota com post
app.post("/api/product", (req, res) => {
  console.log(req.body);
  return res.send("Produto adicionado!");
});

// rota para todos os verbos
app.all("/api/product/check", (req, res) => {
  // req.method = verbo http
  if (req.method === "POST") {
    return res.send("Foi possível inserir algum registro.");
  } else if (req.method === "GET") {
    return res.send("Foi possível ler algum registro.");
  } else {
    return res.send("Impossível realizar esta operação.");
  }
});
// interface express
app.get("/api/interfaces", (req: Request, res: Response) => {
  return res.send("Utilizando as interfaces!");
});

// enviando json
app.get("/api/json", (req: Request, res: Response) => {
  return res.json({
    name: "Shirt",
    price: 30.0,
    color: "Blue",
    sizes: ["P", "M", "G"],
  });
});

// router parameteres
app.get("/api/product/:id", (req: Request, res: Response) => {
  console.log(req.params);
  const id = req.params.id;
  if (id === "1") {
    const product = {
      id: 1,
      name: "Boné",
      price: 10,
    };
    return res.json(product);
  } else {
    return res.send("Produto nao encontrado.");
  }
});

// rotas complexas
app.get("/api/product/:id/review/:reviewId", (req: Request, res: Response) => {
  console.log(req.params);
  const productId = req.params.id;
  const reviewId = req.params.id;

  return res.send(`Acessando a review ${reviewId} do produto ${productId}`);
});

// router handler
function getUser(req: Request, res: Response) {
  console.log(`Resgatando o usuario com o id: ${req.params.id}`);

  return res.send("O usuário foi encontrado!");
}
app.get("/api/user/:id", getUser);

// middlewares
function checkUser(req: Request, res: Response, next: NextFunction) {
  if (req.params.id === "1") {
    console.log("Pode seguir!");
    next();
  } else {
    console.log("Não pode seguir");
  }
}
app.get(
  "/api/user/:id/access",
  checkUser,
  (req: Request, res: Response, next: NextFunction) => {
    return res.json({ msg: "Bem-vindo a área administrativa!" });
  }
);

// middlewares para todas as rotas
function showPath(req: Request, res: Response, next: NextFunction) {
  console.log(req.path);
  next();
}

app.use(showPath);

app.get("/", (req, res) => {
  return res.send("Hello Express!");
});

// request responde generics
app.get(
  "/api/user/:id/details/:name",
  (
    req: Request<{ id: string; name: "string" }>,
    res: Response<{ status: boolean }>
  ) => {
    console.log(`ID: ${req.params.id}`);
    console.log(`Name: ${req.params.name}`);

    return res.json({ status: true });
  }
);

// tratando erros
app.get("/api/error", (req: Request, res: Response) => {
  try {
    throw new Error("Algo deu errado!");
  } catch (e: any) {
    res.statusCode = 500;

    res.status(500).json({ msg: e.message });
  }
});
// definir porta que vamos utilizar para expor o serviço
app.listen(3000, () => [console.log("Aplicação de TS + Express funcionando")]);
