
import { Component, Input, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';

interface RecipeNode {
  amount: number;
  name: string;
  icon: string;
  ingredients?: RecipeNode[];
  buyPrice?: number;
  sellPrice?: number;
  craftPrice?: number;
  rarity: string;
}

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  treeControl = new NestedTreeControl<RecipeNode>(node => node.ingredients)
  dataSource: ArrayDataSource<RecipeNode>;
  recipeData: RecipeNode;

  @Input('recipe')
  set setRecipe(recipe: any) {
    this.recipeData = this.getRecipeTreeNode(recipe);
    this.dataSource = new ArrayDataSource<RecipeNode>([this.recipeData]);
  }

  getRecipeTreeNode(recipe: any): RecipeNode {
    const ingredients: RecipeNode[] = [];
    let craftPrice = 0;
    recipe.ingredient_items.forEach(ingredientItem => {
      const buyPrice = ingredientItem.price ? ingredientItem.price.buys.unit_price : 0;
      const sellPrice = ingredientItem.price ? ingredientItem.price.sells.unit_price : 0;
      const amount = recipe.ingredients.find(ingredient => ingredient.item_id === ingredientItem.id).count;
      ingredients.push({
        amount,
        name: ingredientItem.name,
        icon: ingredientItem.icon,
        buyPrice,
        sellPrice,
        rarity: ingredientItem.rarity
      });

      craftPrice = craftPrice + amount * buyPrice;
    });
    const recipeNode = {
      amount: +recipe.output_item_count,
      name: recipe.output_item[0].name,
      icon: recipe.output_item[0].icon,
      ingredients,
      craftPrice,
      buyPrice: recipe.output_item[0].price ? recipe.output_item[0].price.buys.unit_price : 0,
      sellPrice: recipe.output_item[0].price ? recipe.output_item[0].price.buys.unit_price : 0,
      rarity: recipe.output_item[0].rarity
    } as RecipeNode;

    return recipeNode;
  }

  constructor() { }

  ngOnInit(): void {
  }

  hasChild = (_: number, node: RecipeNode) => !!node.ingredients && node.ingredients.length > 0;

}
