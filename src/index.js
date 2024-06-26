  // en package.json con el "type" : "module" puedo importar de la siguiente manera: import express from "express"
  import express from "express"
  import { MercadoPagoConfig, Preference } from 'mercadopago';
  const app = express();
  import cors from 'cors';
  import { PORT, MPKEY } from './config.js';

  app.use(cors())

const client = new MercadoPagoConfig({ accessToken: MPKEY });

app.get("/pruebapagina", async (req, res)=>{
    res.status(200).send("pagina cargada!")
})

app.post("/create_preference/:user/:id/:saldo/:usercomp", async (req, res)=> {
    const id = req.params.id; 
    const user = req.params.user; 
    const saldo = req.params.saldo;
    const usercomp = req.params.usercomp;
    const preference = new Preference(client);

    var succ = `https://potenciarcash.vercel.app/vender/${user}/${id}/${saldo / 10000}/${usercomp}`;
    
        if(id === usercomp){
             succ = `https://potenciarcash.vercel.app/comprar/${user}/${id}/${saldo / 10000}/${usercomp}`
            }

    let preferenc = {
        items: [
            {
                  title: req.body.description,
                   unit_price: Number(req.body.price),
                   quantity: Number(req.body.quantity),
            }
        ],
        back_urls: {
            "success": succ,
            "failure": "https://potenciarcash.vercel.app/",
            "pending": "https://potenciarcash.vercel.app/"
        },
        auto_return: "approved",
    };


        preference.create({
          body: preferenc
    
        })
        .then(
            function (response) {
                res.json({
                id: response.id
            });
            
        }).catch(function (error) {
            console.log(error);
        });
})
   

  app.listen(PORT);
  console.log("Server is listening on port ", PORT)
