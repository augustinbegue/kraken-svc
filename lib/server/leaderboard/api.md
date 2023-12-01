Documentation
Authentication:
Bearer ou access_token query parameter
Access token de l'API: NSATnQYWdS5ve8AU2ZY5VtiFGys1XQza

# Leaderboard

## Get leaderboard

GET /leaderboard

Returns: sorted list of objects { login, points }

# Rewards

## Create a reward
POST /items/reward
Body:
- login required
- activity (id of activity default wildcard activity)
- bonus (int, nombre de points bonus default 0)
```json
{
  "login": "login",
  "activity": 1,
  "bonus": 0
}
```
Returns the created item

## Get rewards
GET /items/reward

Returns: all rewards

# Activities

## Get all activity items
GET /items/activity

Returns: list of activities ({name, category, points})

## Create activity
POST /items/activity
Body:
- name (required)
- category (id) required
- points (int) required
```json
{
  "name": "name",
  "category": 1,
  "points": 1
}
```
Returns the new item

## Get all categories
GET /items/category

Returns: all the category items
