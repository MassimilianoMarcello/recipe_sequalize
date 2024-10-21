import express from 'express';
import recipeControllers from '../controllers/recipe.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();
const {
    getAll,
    getOne,
    addRecipe,
    updateRecipe,
    removeRecipe,
    addRecipeForm,
    updateRecipeForm
} = recipeControllers;

router.get('/recipes', getAll);
router.get('/recipes/:id',verifyToken, getOne);
router.post('/add-recipes',verifyToken, addRecipe);
router.put('/update-recipe/:id',verifyToken, updateRecipe);

router.delete('/delete-recipe/:id',verifyToken, removeRecipe);
router.get('/add-recipes',verifyToken, addRecipeForm);
router.get('/update-recipe/:id',verifyToken, updateRecipeForm);
export default router;