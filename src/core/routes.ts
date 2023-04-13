import { Express, urlencoded, json } from "express";
import AuthController from "../Controllers/AuthController.js";
import checkAuth from "../middlewares/checkAuth.js";
import ArticlesController from "../Controllers/ArticlesController.js";
import ProfileController from "../Controllers/ProfileController.js";

const createRoutes = (app: Express) => {
  const AuthCtrl = new AuthController();
  const ProfileCtrl = new ProfileController();
  const ArticleCtrl = new ArticlesController();

  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.post("/auth/reg", AuthCtrl.reg);
  app.post("/auth/login", AuthCtrl.login);

  app.post("/edit-profile", checkAuth, ProfileCtrl.editProfile);

  app.post("/add-article", checkAuth, ArticleCtrl.addArticle);
  app.post("/edit-article/:articleId", checkAuth, ArticleCtrl.editArticle);
};

export default createRoutes;
