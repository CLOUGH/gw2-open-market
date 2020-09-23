export interface ItemCategory extends SelectableType {
  subCategory?: SelectableType[];
}

export interface SelectableType {
  label: string;
  value: string;
}


export interface ItemFilterOption {
  categories: ItemCategory[];
  rarity: SelectableType[]
}
