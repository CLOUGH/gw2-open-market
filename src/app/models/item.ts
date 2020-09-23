export interface Item {
  id?: number;
  chat_link?: string;
  name?: string;
  icon?: string;
  description?: string;
  type?: string;
  rarity?: string;
  level?: number;
  vendor_value?: number;
  default_skin?: number;
  flags?: [string];
  game_types?: [string];
  restrictions?: [string];
}
