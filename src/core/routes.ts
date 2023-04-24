import { Express, urlencoded, json } from "express";
import cors from "cors";
import AuthController from "../Controllers/AuthController.js";
import checkAuth from "../middlewares/checkAuth.js";
import ArticlesController from "../Controllers/ArticlesController.js";
import ProfileController from "../Controllers/ProfileController.js";
import { multerUploads } from "../utils/multer.js";

const createRoutes = (app: Express) => {
  const AuthCtrl = new AuthController();
  const ProfileCtrl = new ProfileController();
  const ArticleCtrl = new ArticlesController();

  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

  app.post("/auth/reg", AuthCtrl.reg);
  app.post("/auth/login", AuthCtrl.login);

  app.post(
    "/edit-profile",
    checkAuth,
    multerUploads.single("avatar"),
    ProfileCtrl.editProfile
  );
  app.get("/get-my-data", checkAuth, ProfileCtrl.getMyData);

  app.post("/add-article", checkAuth, ArticleCtrl.addArticle);
  app.post("/edit-article/:articleId", checkAuth, ArticleCtrl.editArticle);
  app.get("/get-articles", ArticleCtrl.getArticles);
  app.get("/get-my-articles", checkAuth, ArticleCtrl.getMyArticles);
  app.get("/get-article/:articleId", ArticleCtrl.getArticle);
  app.post(
    "/img-processing",
    checkAuth,
    multerUploads.single("img"),
    ArticleCtrl.imgProcessing
  );
};

export default createRoutes;
