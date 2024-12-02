import mongoose from "mongoose";

const Schema = mongoose.Schema;

let UserRecipeSchema = new Schema({
    title: { type: String, required: true },
    servings: { type: String, required: false },
    prepTime: { type: Number, required: false},
    cookTime: { type: Number, required: true},
    ingredients: [{ type: String, required: true}],
    directions: [{ type: String, required: true}],
    favorite: {type: Boolean, required: true}
});

export default mongoose.model('UserRecipe', UserRecipeSchema);