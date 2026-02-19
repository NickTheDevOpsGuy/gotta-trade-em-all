# API Reference

Base URL (development): `http://localhost:3001/api`

## Cards

### GET /cards

List all cards in the catalog.

**Response**

```json
[
  {
    "id": "001",
    "name": "Leafling",
    "rarity": "common",
    "value": 1
  }
]
```

---

## Inventory

> **Auth required** — All inventory endpoints require a signed-in user. Include the Supabase JWT in the `Authorization: Bearer <token>` header.

### GET /inventory

List cards in your collection (with quantities).

**Response**

```json
[
  {
    "id": "001",
    "name": "Leafling",
    "rarity": "common",
    "value": 1,
    "quantity": 2
  }
]
```

### POST /inventory

Add a card to your collection.

**Request**

```json
{
  "card_id": "001"
}
```

| Field   | Type   | Required | Description                    |
| ------- | ------ | -------- | ------------------------------ |
| card_id | string | Yes      | Card ID from the catalog       |

**Response** (200)

```json
{
  "id": "001",
  "name": "Leafling",
  "rarity": "common",
  "value": 1,
  "quantity": 2
}
```

**Errors**

- `400` — Missing `card_id`
- `404` — Card not found in catalog

### POST /inventory/trade

Trade selected cards for new ones. You receive cards of similar total value from the pool.

**Request**

```json
{
  "offer_card_ids": ["001", "002", "004"]
}
```

| Field           | Type     | Required | Description                        |
| --------------- | -------- | -------- | ---------------------------------- |
| offer_card_ids  | string[] | Yes      | Card IDs to trade (must be in your inventory) |

**Response** (200)

```json
{
  "received": [
    {
      "id": "005",
      "name": "Voltwing",
      "rarity": "rare",
      "value": 3
    }
  ],
  "offered_value": 5
}
```

**Errors**

- `400` — Invalid request or insufficient quantity for a card
- `429` — Too many trades (max 50 per hour per user)

### POST /inventory/import

Bulk import cards into your collection from a JSON export.

**Request**

```json
{
  "items": [
    { "card_id": "001", "quantity": 2 },
    { "card_id": "004", "quantity": 1 }
  ]
}
```

| Field  | Type   | Required | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------- |
| items  | array  | Yes      | 1–100 objects with `card_id` and optional `quantity` |

**Response** (200)

```json
{ "success": true }
```

---

## Trades

### GET /trades

List your recent trade history (auth required).

**Query**

| Param  | Type | Default | Description       |
| ------ | ---- | ------- | ----------------- |
| limit  | int  | 10      | Max 50 trades     |

**Response**

```json
{
  "trades": [
    {
      "id": 1,
      "offered_card_ids": ["001", "002"],
      "received_card_ids": ["005", "006"],
      "offered_value": 4,
      "created_at": "2025-02-17T12:00:00Z"
    }
  ]
}
```
