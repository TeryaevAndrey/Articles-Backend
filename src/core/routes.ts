import { Express, urlencoded, json } from "express";
import AuthController from "../Controllers/AuthController.js";

const createRoutes = (app: Express) => {
  const AuthCtrl = new AuthController();

  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.post("/auth/reg", AuthCtrl.reg);
  app.post("/auth/login", AuthCtrl.login);
};

export default createRoutes;
