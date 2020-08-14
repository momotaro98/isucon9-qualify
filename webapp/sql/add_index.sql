create index items_created_at_index on items(created_at);
create index items_seller_created_index on items(seller_id, created_at);
create index items_buyer_created_index on items(buyer_id, created_at);
