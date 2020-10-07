import { GW2ProfitsApiService } from './../services/gw2-profits.service';
import { GW2ApiService } from './../services/gw2-api.service';
import { ItemTradeListingService } from '../services/Item-trade-listing.service';
import { Request, Response, Router } from 'express';
import Item from '../models/Item';
import { min } from 'rxjs/operators';
import Recipe from '../models/Recipe';

export const itemRouter = Router();

itemRouter.get('/', async (req: Request, res: Response, next) => {
  const {
    limit = 25,
    page = 1,
    search,
    subCategory,
    category,
    rarity,
    minLevel,
    maxLevel,
    maxBuy,
    minBuy,
    maxSell,
    minSell,
    minDemand,
    maxDemand,
    minSupply,
    maxSupply,
    minFlipProfit,
    maxFlipProfit,
    maxRoi,
    minRoi,
    maxDemandSupplyRatio,
    minDemandSupplyRatio,
  } = req.query;


  const profitFormula = {
    $subtract: [
      {
        $subtract: [
          '$price.sells.unit_price',
          '$price.buys.unit_price'
        ]
      },
      {
        $multiply: ['$price.sells.unit_price', 0.15]
      }
    ]
  };
  const roiFormula = {
    $multiply: [{
      $divide: [profitFormula, {
        $cond: [
          { $eq: ['$price.buys.unit_price', 0] }, 1,
          '$price.buys.unit_price'
        ]

      }]
    }, 100]
  };
  const demandSupplyRationFormula = {
    $multiply: [
      {
        $divide: [
          'price.buys.quantity',
          {
            $cond: [
              { $eq: ['price.sells.quantity', 0] },
              1,
              'price.sells.quantity'
            ]
          }
        ]
      },
      100
    ]
  };

  let query = {};
  const lookUpCriteria = [];

  if (search) {
    lookUpCriteria.push({ name: { $regex: search, $options: 'i' } });
    // lookUpCriteria.push({ name: new RegExp('' + search) });
  }
  if (category) {
    lookUpCriteria.push({ type: category });
  }
  if (subCategory) {
    lookUpCriteria.push({ 'details.type': subCategory });
  }
  if (rarity) {
    lookUpCriteria.push({ rarity });
  }
  if (minLevel || maxLevel) {
    lookUpCriteria.push({
      level: {
        ...(minLevel ? { $gte: +minLevel } : {}),
        ...(maxLevel ? { $lte: +maxLevel } : {})
      }
    });
  }
  if (minBuy || maxBuy) {
    lookUpCriteria.push({
      'price.buys.unit_price': {
        ...(minBuy ? { $gte: +minBuy } : {}),
        ...(maxBuy ? { $lte: +maxBuy } : {})
      },
    });
  }
  if (minSell || maxSell) {
    lookUpCriteria.push({
      'price.sells.unit_price': {
        ...(minSell ? { $gte: +minSell } : {}),
        ...(maxSell ? { $lte: +maxSell } : {})
      },
    });
  }
  if (minDemand || maxDemand) {
    lookUpCriteria.push({
      'price.buys.quantity': {
        ...(minDemand ? { $gte: +minDemand } : {}),
        ...(maxDemand ? { $lte: +maxDemand } : {})
      },
    });
  }
  if (minSupply || maxSupply) {
    lookUpCriteria.push({
      'price.sells.quantity': {
        ...(minSupply ? { $gte: +minSupply } : {}),
        ...(maxSupply ? { $lte: +maxSupply } : {})
      },
    });
  }
  if (minFlipProfit) {
    lookUpCriteria.push({
      $expr: {
        ...(minFlipProfit ? { $gte: [profitFormula, +minFlipProfit] } : {}),
      },
    });
  }
  if (maxFlipProfit) {
    lookUpCriteria.push({
      $expr: {
        ...(maxFlipProfit ? { $lte: [profitFormula, +maxFlipProfit] } : {}),
      },
    });
  }
  if (minRoi) {
    lookUpCriteria.push({
      $expr: {
        ...(minRoi ? { $gte: [roiFormula, +minRoi] } : {}),
      },
    });
  }
  if (maxRoi) {
    lookUpCriteria.push({
      $expr: {
        ...(maxRoi ? { $lte: [roiFormula, +maxRoi] } : {}),
      },
    });
  }
  if (minDemandSupplyRatio) {
    lookUpCriteria.push({
      $expr: {
        ...(minDemandSupplyRatio ? { $gte: [demandSupplyRationFormula, +minDemandSupplyRatio] } : {}),
      },
    });
  }
  if (maxDemandSupplyRatio) {
    lookUpCriteria.push({
      $expr: {
        ...(maxDemandSupplyRatio ? { $lte: [demandSupplyRationFormula, +maxDemandSupplyRatio] } : {}),
      },
    });
  }
  lookUpCriteria.push({
    listed: { $eq: true }
  });

  query = {
    ...query,
    ...(lookUpCriteria.length > 0 ? { $and: lookUpCriteria } : {}),
    // $addField: {
    //   roi: roiFormula
    // }
  };

  console.log(JSON.stringify(query, null, 2));

  // Item.paginate(query, { limit: +limit, page: +page , sort: {createdAt : 1}})

  const aggregate = Item.aggregate();
  aggregate.match(query).addFields({ sort: roiFormula});

  // @ts-ignore
  Item.aggregatePaginate(aggregate, { limit: +limit, page: +page, sort: { sort: -1 } })
    .then(result => {
      res.set('X-LENGTH', result.total)
        .set('X-LIMIT', result.limit)
        .set('X-PAGE', result.page)
        .set('X-PAGES', result.pages)
        .json(result.docs);

    }).catch(e => {
      res.status(500).json({
        message: e.message
      });
    });
});

itemRouter.get('/:id/recipes', async (req: Request, res: Response, next) => {
  try {
    const itemId = +req.params.id;
    const query = {};
    const craftedBy = await Recipe.aggregate([{
      $match: {
        output_item_id: itemId
      }
    }, {
      $lookup: {
        from: 'items',
        localField: 'ingredients.item_id',
        foreignField: 'id',
        as: 'ingredient_items',
      }
    }]);
    const useIn = await Recipe.aggregate([
      {
        $match: { 'ingredients.item_id': itemId }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'ingredients.item_id',
          foreignField: 'id',
          as: 'ingredient_items',
        }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'output_item_id',
          foreignField: 'id',
          as: 'output_item',
        }
      }
    ]);

    res.json({
      craftedBy,
      useIn
    });

  } catch (e) {
    console.log(`An error has occurred while trying to get item ${req.params.id} recipe`);
    res.status(500).json({
      message: e.message
    });
  }
});

itemRouter.post('/update-item-prices', async (req: Request, res: Response, next) => {
  try {
    const gW2ApiService = new GW2ApiService();
    const bulkWriteUpdateResult = await gW2ApiService.updateItemPrices();

    res.json(bulkWriteUpdateResult);
  } catch (e) {
    console.log('An error has occurred while performing item price update');
    res.status(500).json({
      message: e.message
    });
  }
});

itemRouter.get('/:itemId/trade-listings', async (req: Request, res: Response, next) => {
  try {
    const itemTradeListingService = new ItemTradeListingService();
    const itemTradeListing = await itemTradeListingService.getItemTradeListing(+req.params.itemId);

    res.json(itemTradeListing);
  } catch (e) {
    console.log(`A error has occurred while trying to get trade history for item  ${req.params.itemId}`);
    console.error(e);
    res.status(500).json({
      message: e.message
    });
  }
});

itemRouter.post('/update-item-trade-listings', async (req: Request, res: Response, next) => {
  try {
    const itemTradeListingService = new ItemTradeListingService();
    itemTradeListingService.updateAllItemTradeListing();
    console.log('Completed update of all listings');
    res.json({ message: 'Performing action to update item trade listings' });
  } catch (e) {
    console.log('An error has occurred while trying to update trade list data');
    console.error(e);
  }
});

itemRouter.post('/update-item-recipes', async (req: Request, res: Response, next) => {
  try {
    const gw2ApiService = new GW2ApiService();
    console.log('Received request to update recipe list')
    gw2ApiService.updateRecipeList();

    const gw2ProfitApiService = new GW2ProfitsApiService();
    gw2ProfitApiService.getMysticForgeRecipes();

    console.log('Completed update of all recipe');
    res.json({ message: 'Performing action to update item recipe ' });

  } catch (e) {
    console.log('An error has occurred while trying to update recipe data');
    console.error(e);
  }
});
itemRouter.post('/update-all-items', async (req: Request, res: Response, next) => {
  try {
    const gw2ApiService = new GW2ApiService();
    console.log('Received request to all update item listing')
    gw2ApiService.updateItems();

    console.log('Completed update of all update item listing');
    res.json({ message: 'Performing action to update item all items ' });

  } catch (e) {
    console.log('An error has occurred while trying to update all items data');
    console.error(e);
  }
});
