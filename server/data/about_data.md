# Dojo Food Data

Each data directory here contains json files used in initializing the database.

## Ingredients
The `ingredients` directory contains json files, organized by category, of ingredients in the restaraunt.

Each file is an array of objects, each representing an ingredient, with the following properties:

| Syntax | Description |
| ------ | --------- |
| `"name": string` | The name of the ingredient and unique ID for the purpose of these files |
| `"bulkCostCents": number` | The price, in cents, of one unit of this ingredient that this store buys in builk |
| `"builkUnit": string` | The name of the unit that bulk orders for this ingredient are ordered in terms of |
|`"units": {[name: string]: number}`| The set of units available for defining amounts of food in item recipes|


## Menu Items
The `menu_items` directory contains json files, organized by category, of items available to be purchased.

Each file is an array of objects, each representing a menu item, with the following properties:

| Syntax | Description |
| ------ | ----------- |
| `"name": string` | The name of the menu item, as it will be displayed on the menu |
| `"priceCents": number` | The price in cents |
|`"ingredients": { ... }[]`| The list of ingredients required to make this item, with three properties given below |
|`{"name": string, ...}`| The name of the ingredient |
|`{"quantity": number, ...}`| The number of units of this ingredient required to make this item |
|`{"unit": string, ...}`| The name of the unit |

## Menu Options
The `menu_options` directory contains json files, with one per option menu, of options each availalble to many items.

Each file has properties for the whole menu, and properties for each option in the menu.

These are the properties for the whole menu:
| Syntax |  Description |
| ------ | ------------ |
| `"min_options": number` | The minimum number of options required when this menu is present
| `"free_options": number` | The number of options that are available for no charge |
| `"max_options":  number`| The maximum number of options that may be selected from this menu |
| `"options": {}[]`| The list of options that may be selected from this menu, see below |

These are the properties for each option:
| Syntax |  Description |
| ------ | ------------ |
| `"name":string` | The name of the ingredient |
| `"priceCents":number` | The price of this option.  If missing, or if `free_options` >= n where this is the nth item, then there is no charge for this option. |
| `"ingredients":{}[]`| The list of ingredients required to make this option, with the same parameters as in `menu_items` |
