# day 7

## Instructions

- setup project
- clone to your github
- Read the documentation https://github.com/ChainSafe/web3.js https://web3js.readthedocs.io/en/v1.7.0/web3-eth-accounts.html
- for web3 provider, you can use https://www.alchemyapi.io/supernode
- Setup the following Models in models folder. Make sure tables made by sequelize:

```
user
- id
- name
- wallet_id
```

- Make the CRUD API for these tables. Create Web3Service to wrap all the web3 calls

- ABI to use is:
- The Wallet Address to test with is:

```
GET /api/v1/user (get all)
GET /api/v1/user/:id (get one)
POST /api/v1/user/:id (add one)
PUT /api/v1/user/:id (update one)
DELETE /api/v1/user/:id (delete one)

POST /api/v1/user/wallet (create a wallet for user and save wallet id into user, return private key)
GET /api/v1/user/sign?private_key (sign user and return payload)

GET /api/v1/user/account?private_key (return the balance of user wallet)
GET /api/v1/user/transfer?private_key=sdfdsf&to_address=fdgfdg&amount (Transfer x toke from user to to_address user)
```

- Everything must be done by end of date
