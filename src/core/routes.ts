import { Express, urlencoded, json } from "express";
import cors from "cors";
import AuthController from "../Controllers/AuthController.js";
import checkAuth from "../middlewares/checkAuth.js";
import ArticlesController from "../Controllers/ArticlesController.js";
import ProfileController from "../Controllers/ProfileController.js";
import { multerUploads } from "../utils/multer.js";
import CommentController from "../Controllers/CommentsController.js";
import FavouriteController from "../Controllers/FavouritesController.js";

const createRoutes = (app: Express) => {
  const AuthCtrl = new AuthController();
  const ProfileCtrl = new ProfileController();
  const ArticleCtrl = new ArticlesController();
  const CommentCtrl = new CommentController();
  const FavouriteCtrl = new FavouriteController();

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
  app.get("/get-articles-by-search", ArticleCtrl.getArticlesBySearch);
  app.get("/get-article/:articleId", ArticleCtrl.getArticle);

  app.post(
    "/img-processing",
    checkAuth,
    multerUploads.single("img"),
    ArticleCtrl.imgProcessing
  );

  app.post("/add-comment", checkAuth, CommentCtrl.addComment);
  app.get("/get-comments/:articleId", CommentCtrl.getComments);

  app.post("/add-to-favourite", checkAuth, FavouriteCtrl.addArticleToFavourite);
  app.get(
    "/get-favourite-article/:articleId",
    checkAuth,
    FavouriteCtrl.getFavouriteArticle
  );
  app.get(
    "/get-favourite-articles",
    checkAuth,
    FavouriteCtrl.getFavouriteArticles
  );
  app.post(
    "/delete-from-favourite",
    checkAuth,
    FavouriteCtrl.deleteArticleFromFavourite
  );

  app.get("/get-popular-tags", ArticleCtrl.getPopularTags);
};

export default createRoutes;
